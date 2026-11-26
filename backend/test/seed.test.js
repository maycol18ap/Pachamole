import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { PrismaClient } from "@prisma/client";

const root = new URL("../../", import.meta.url);
const backend = new URL("../", import.meta.url);
const localUrl = "postgresql://usuario_ficticio:clave_ficticia@127.0.0.1/pachamole_test?schema=pachamole";

const rejectedTargets = [
  { name: "host remoto", url: localUrl.replace("127.0.0.1", "db.example.invalid") },
  { name: "base de producción", url: localUrl.replace("pachamole_test", "pachamole_prod") },
  { name: "esquema incorrecto", url: localUrl.replace("schema=pachamole", "schema=public") },
  { name: "host alternativo en la URL", url: `${localUrl}&host=db.example.invalid` },
  { name: "NODE_ENV de producción", url: localUrl, nodeEnv: "production" },
];

for (const { name, url, nodeEnv = "test" } of rejectedTargets) {
  test(`el seed rechaza ${name} sin exponer credenciales`, () => {
    const result = spawnSync(process.execPath, ["prisma/seed.js"], {
      cwd: backend,
      env: { ...process.env, DATABASE_URL: url, NODE_ENV: nodeEnv },
      encoding: "utf8",
      timeout: 15000,
    });

    assert.ifError(result.error);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, "");
    assert.equal(result.stderr.trim(), "El seed requiere una base PostgreSQL local de desarrollo o pruebas.");
  });
}

function runSeed(databaseUrl) {
  const result = spawnSync("pnpm", ["--dir", "backend", "db:seed"], {
    cwd: root,
    env: { ...process.env, DATABASE_URL: databaseUrl, NODE_ENV: "test" },
    encoding: "utf8",
    timeout: 15000,
  });

  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Catálogo de prueba cargado en PostgreSQL local\./);
}

function readCatalog(db) {
  return db.$transaction([
    db.university.findMany({ orderBy: { slug: "asc" } }),
    db.category.findMany({ orderBy: { slug: "asc" } }),
    db.product.findMany({ orderBy: { id: "asc" } }),
  ]);
}

const databaseUrl = process.env.PACHAMOLE_SEED_TEST_DATABASE_URL;
test("el seed conserva el catálogo y las ediciones al repetir la carga en PostgreSQL", {
  skip: !databaseUrl && "Define PACHAMOLE_SEED_TEST_DATABASE_URL con una base local vacía y migrada",
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
  assert.deepEqual(await readCatalog(db), [[], [], []], "La prueba requiere un catálogo vacío");

  runSeed(databaseUrl);
  const [universities, categories, products] = await readCatalog(db);
  assert.deepEqual(universities.map(({ slug, name }) => [slug, name]), [
    ["udi", "UDI"], ["univalle", "Univalle"], ["ucebol", "UCEBOL"],
  ]);
  assert.deepEqual(categories.map(({ slug }) => slug), ["combos", "refrescos", "snacks"]);
  assert.equal(products.length, 9);
  assert.equal(products.find(({ name }) => name === "El Originario")?.priceMinor, 1400);
  const combo = products.find(({ name }) => name === "Nachos Pacha (Combo)");
  assert.equal(combo?.active, true);
  assert.equal(combo.available, false);
  const limonada = products.find(({ name }) => name === "Limonada");
  assert.ok(limonada);

  const [editedUniversity, editedCategory, editedProduct] = await db.$transaction([
    db.university.update({ where: { slug: "udi" }, data: { name: "UDI editada" } }),
    db.category.update({ where: { slug: "combos" }, data: { name: "Combos editados" } }),
    db.product.update({ where: { id: combo.id }, data: { priceMinor: 3600 } }),
    db.product.delete({ where: { id: limonada.id } }),
  ]);

  runSeed(databaseUrl);
  assert.deepEqual(await readCatalog(db), [
    universities.map((row) => row.id === editedUniversity.id ? editedUniversity : row),
    categories.map((row) => row.id === editedCategory.id ? editedCategory : row),
    products.map((row) => row.id === editedProduct.id ? editedProduct : row),
  ]);

  // SQL directo para probar el enum de PostgreSQL, pasando por alto la validación de Prisma Client.
  await assert.rejects(
    db.$executeRaw`
      INSERT INTO pachamole.universities (id, slug, name)
      VALUES (${randomUUID()}::uuid, 'cuarta', 'Universidad de prueba')
    `,
    (error) => error.code === "P2010" && error.meta?.code === "22P02",
  );
  assert.equal(await db.university.count(), 3);
});
