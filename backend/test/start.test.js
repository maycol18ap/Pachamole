import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const entrypoint = fileURLToPath(new URL("../src/index.js", import.meta.url));

test("el proceso de arranque rechaza un PORT inválido antes de escuchar", () => {
  for (const value of ["", "texto", "0", "-1", "65536", "1.5", "1e3", " 3000 "]) {
    const result = spawnSync(process.execPath, [entrypoint], {
      env: { ...process.env, PORT: value },
      encoding: "utf8",
      timeout: 5000,
    });
    const input = `PORT=${JSON.stringify(value)}`;

    assert.ifError(result.error);
    assert.equal(result.status, 1, input);
    assert.match(result.stderr, /PORT inválido.*entero decimal entre 1 y 65535/, input);
    assert.doesNotMatch(result.stdout, /API disponible/, input);
  }
});
