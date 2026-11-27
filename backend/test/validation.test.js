import assert from "node:assert/strict";
import { once } from "node:events";
import { after, before, test } from "node:test";
import { Router } from "express";
import { createApp, JSON_BODY_LIMIT } from "../src/app.js";
import { validateJsonObject } from "../src/middleware/validation.js";
import { validateOrderFields } from "../src/modules/orders/order.validation.js";

const sampleOrder = {
  customer: { name: "Ejemplo", phone: "70000000" },
  universityId: "udi",
  deliveryReference: "Puerta principal",
  notes: "Sin picante",
  requestedFor: "2026-11-23T12:30:00-04:00",
  items: [{ productId: "producto_1", quantity: 2 }],
};

const testRouter = Router();
testRouter.post("/test/orders", validateJsonObject(validateOrderFields), (_req, res) => {
  res.status(200).json({ status: "ok" });
});
testRouter.get("/test/failure", () => {
  throw new Error("detalle interno de prueba");
});

let server;
let baseUrl;

before(async () => {
  server = createApp(testRouter).listen(0, "127.0.0.1");
  await once(server, "listening");
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server?.listening) {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
});

function postOrder(body) {
  return fetch(`${baseUrl}/api/test/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    signal: AbortSignal.timeout(5000),
  });
}

async function assertError(response, status, error) {
  assert.equal(response.status, status);
  assert.match(response.headers.get("content-type") ?? "", /^application\/json(?:;|$)/i);
  assert.deepEqual(await response.json(), { error });
}

test("acepta un pedido con el formato propuesto", async () => {
  const response = await postOrder(JSON.stringify(sampleOrder));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("acepta un pedido sin notas", async () => {
  const response = await postOrder(JSON.stringify({ ...sampleOrder, notes: undefined }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("devuelve 400 para JSON malformado y health sigue devolviendo 200", async () => {
  await assertError(await postOrder('{"items":'), 400, {
    code: "INVALID_JSON",
    message: "El cuerpo contiene JSON malformado.",
  });

  const health = await fetch(`${baseUrl}/api/health`, { signal: AbortSignal.timeout(5000) });
  assert.equal(health.status, 200);
  assert.equal((await health.json()).status, "ok");
});

test("devuelve 422 con los campos inválidos", async () => {
  const invalidOrder = {
    ...sampleOrder,
    customer: { name: " ", phone: 70000000 },
    universityId: "otra",
    deliveryReference: "r".repeat(201),
    notes: null,
    requestedFor: "2026-02-30T12:30:00-04:00",
    items: [{ productId: " ", quantity: 0 }, null],
  };
  await assertError(await postOrder(JSON.stringify(invalidOrder)), 422, {
    code: "VALIDATION_ERROR",
    message: "Revisa los campos indicados.",
    details: [
      { field: "customer.name", message: "Escribe un nombre de hasta 100 caracteres." },
      { field: "customer.phone", message: "Debe ser una cadena de ocho dígitos." },
      { field: "universityId", message: "Elige una universidad admitida." },
      { field: "deliveryReference", message: "Escribe una referencia de hasta 200 caracteres." },
      { field: "notes", message: "Usa hasta 500 caracteres." },
      { field: "requestedFor", message: "Indica una fecha y hora válida con zona horaria." },
      { field: "items[0].productId", message: "Indica un identificador de hasta 100 caracteres." },
      { field: "items[0].quantity", message: "Debe ser un entero mayor que cero." },
      { field: "items[1]", message: "Debe ser un objeto." },
    ],
  });
});

test("devuelve 422 para null cuando la ruta espera un objeto", async () => {
  await assertError(await postOrder("null"), 422, {
    code: "VALIDATION_ERROR",
    message: "Revisa los campos indicados.",
    details: [{ field: "body", message: "Debe ser un objeto JSON." }],
  });
});

test("acepta 100 KiB y devuelve 413 al excederlos en un byte", async () => {
  const order = JSON.stringify(sampleOrder);
  const atLimit = order.padEnd(100 * 1024, " ");
  assert.equal(Buffer.byteLength(atLimit), JSON_BODY_LIMIT);
  const response = await postOrder(atLimit);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });

  await assertError(await postOrder(atLimit + " "), 413, {
    code: "PAYLOAD_TOO_LARGE",
    message: "El cuerpo JSON supera el límite permitido.",
  });
});

test("devuelve 500 con un mensaje genérico ante un error inesperado", async () => {
  const response = await fetch(`${baseUrl}/api/test/failure`, {
    signal: AbortSignal.timeout(5000),
  });
  await assertError(response, 500, {
    code: "INTERNAL_ERROR",
    message: "Ocurrió un error interno.",
  });
});
