import assert from "node:assert/strict";
import { once } from "node:events";
import test from "node:test";
import { PrismaClient } from "@prisma/client";
import { createApp } from "../src/app.js";

async function withCatalog(database, check) {
  const server = createApp(undefined, database).listen(0, "127.0.0.1");
  await once(server, "listening");
  const url = `http://127.0.0.1:${server.address().port}/api/products`;
  try {
    await check((query = "") => fetch(url + query, { signal: AbortSignal.timeout(5000) }));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test("el catálogo rechaza paginación inválida antes de consultar la BD", async () => {
  const database = { product: { findMany: () => assert.fail("No debe consultar la BD") } };
  await withCatalog(database, async (get) => {
    for (const query of ["?limit=0", "?limit=101", "?limit=1.5", "?offset=-1", "?limit=1&limit=2", "?limit=2%0A", "?offset=9007199254740992"]) {
      const response = await get(query);
      assert.equal(response.status, 422, query);
      assert.equal((await response.json()).error.code, "VALIDATION_ERROR");
    }
  });
});

test("el catálogo utiliza los valores por defecto y devuelve un error genérico si falla la BD", async () => {
  let query;
  const database = { product: { findMany: async (options) => {
    query = options;
    throw new Error("Detalle interno de Prisma");
  } } };
  await withCatalog(database, async (get) => {
    const response = await get();
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), {
      error: { code: "INTERNAL_ERROR", message: "Ocurrió un error interno." },
    });
  });
  assert.equal(query.take, 51);
  assert.equal(query.skip, 0);
});

const databaseUrl = process.env.PACHAMOLE_TEST_DATABASE_URL;
test("el catálogo consulta PostgreSQL, pagina y expone únicamente los campos públicos", {
  skip: !databaseUrl && "Define PACHAMOLE_TEST_DATABASE_URL con una base local vacía y migrada",
}, async (t) => {
  const url = new URL(databaseUrl);
  assert.ok(
    ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname) &&
      /^\/pachamole_test(_[a-z0-9]+)*$/.test(url.pathname) &&
      url.searchParams.size === 1 && url.searchParams.get("schema") === "pachamole",
    "Usa una base local descartable pachamole_test con el esquema pachamole",
  );
  const db = new PrismaClient({ datasourceUrl: databaseUrl });
  t.after(() => db.$disconnect());
  const rollback = new Error("Revertir datos de prueba");

  await assert.rejects(db.$transaction(async (transaction) => {
    assert.equal(await transaction.product.count(), 0, "La prueba requiere un catálogo vacío");
    const snacks = await transaction.category.create({ data: { slug: "snacks", name: "Snacks" } });
    const combos = await transaction.category.create({ data: { slug: "combos", name: "Combos" } });
    const common = { priceMinor: 1400, active: true, available: true };
    const snack = await transaction.product.create({
      data: { ...common, categoryId: snacks.id, name: "El Originario" },
    });
    const combo = await transaction.product.create({
      data: { ...common, categoryId: combos.id, name: "Nachos Pacha", priceMinor: 3500, available: false },
    });
    await transaction.product.create({
      data: { ...common, categoryId: combos.id, name: "Producto retirado", active: false },
    });

    await withCatalog(transaction, async (get) => {
      for (const [offset, product, category, nextOffset] of [[0, combo, combos, 1], [1, snack, snacks, null]]) {
        const response = await get(`?limit=1&offset=${offset}`);
        assert.equal(response.status, 200);
        assert.deepEqual(await response.json(), {
          products: [{
            productId: product.id,
            name: product.name,
            category: { slug: category.slug, name: category.name },
            priceMinor: product.priceMinor,
            available: product.available,
          }],
          nextOffset,
        });
      }
      for (const offset of [2, Number.MAX_SAFE_INTEGER]) {
        const empty = await get(`?offset=${offset}`);
        assert.equal(empty.status, 200);
        assert.deepEqual(await empty.json(), { products: [], nextOffset: null });
      }
    });
    throw rollback;
  }), (error) => error === rollback);
});
