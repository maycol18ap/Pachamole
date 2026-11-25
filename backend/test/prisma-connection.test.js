import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const backend = fileURLToPath(new URL("../", import.meta.url));

function checkConnection(databaseUrl) {
  const result = spawnSync(process.execPath, ["prisma/check-connection.js"], {
    cwd: backend,
    env: { ...process.env, DATABASE_URL: databaseUrl },
    encoding: "utf8",
    timeout: 15000,
  });

  assert.ifError(result.error);
  return result;
}

test("la comprobación de PostgreSQL falla sin mostrar las credenciales", () => {
  const result = checkConnection("invalido://usuario_ficticio:clave_ficticia@127.0.0.1/pachamole");

  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(
    result.stderr.trim(),
    "No se pudo conectar a PostgreSQL. Revisa DATABASE_URL y la disponibilidad de la base.",
  );
});

const localDatabaseUrl = process.env.PACHAMOLE_TEST_DATABASE_URL;

test("la comprobación de PostgreSQL conecta a la base de prueba", {
  skip: !localDatabaseUrl && "Define PACHAMOLE_TEST_DATABASE_URL para ejecutar la prueba con PostgreSQL local",
}, () => {
  const result = checkConnection(localDatabaseUrl);

  assert.equal(result.status, 0);
  assert.equal(result.stderr, "");
  assert.equal(result.stdout.trim(), "Conexión a PostgreSQL correcta.");
});
