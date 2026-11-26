import assert from "node:assert/strict";
import { once } from "node:events";
import { after, before, test } from "node:test";
import { promisify } from "node:util";
import app from "../src/app.js";

let server;
let baseUrl;

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server?.listening) {
    await promisify(server.close).call(server);
  }
});

test("GET /api/health devuelve 200 y el estado del servicio en JSON", async () => {
  const startedAt = Date.now();
  const response = await fetch(`${baseUrl}/api/health`, {
    signal: AbortSignal.timeout(5000),
  });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^application\/json(?:;|$)/i);

  const { status, service, timestamp } = await response.json();
  assert.equal(status, "ok");
  assert.equal(service, "pachamole-api");
  assert.equal(typeof timestamp, "string");

  const date = new Date(timestamp);
  assert.ok(Number.isFinite(date.getTime()), "timestamp debe ser una fecha válida");
  assert.equal(timestamp, date.toISOString(), "timestamp debe estar en UTC");
  assert.ok(
    date.getTime() >= startedAt && date.getTime() <= Date.now(),
    "timestamp debe corresponder a la petición",
  );
});

test("GET de una ruta inexistente bajo /api devuelve 404 en JSON", async () => {
  const response = await fetch(`${baseUrl}/api/no-existe`, {
    signal: AbortSignal.timeout(5000),
  });
  assert.equal(response.status, 404);
  assert.match(response.headers.get("content-type") ?? "", /^application\/json(?:;|$)/i);
  assert.deepEqual(await response.json(), {
    error: { code: "NOT_FOUND", message: "Ruta no encontrada." },
  });
});
