# Estado actual — registro vivo del proyecto

**Actualizado:** 2026-11-24
**Fase activa:** F0, con verificación técnica previa al merge.
**Gate de F0:** pendiente de aprobación humana y de repetir la verificación en `main` integrado. F1 sigue bloqueada.

## main remoto

- `2877ca35df7adf894c05f12e9327d1f659178525`, vuelto a consultar en GitHub el 2026-11-24. En ese SHA la auditoría verificó la instalación congelada con almacén temporal, los arranques, lint/build y health/404. Detectó que `PORT` se ignoraba, había tres lockfiles y faltaba `.env.example`.
- Los Issues #6–#10 figuran cerrados como completados en GitHub. Este checkpoint registra la evidencia de sus correcciones antes de integrarlas. Los PR #11 y #12 de la primera entrega de ML y del backend ya estaban integrados.
- En ese árbol hay una plantilla React/Vite, Express con health y un generador de datos sintéticos. La base de datos, pedidos, checkout, QR y autenticación administrativa siguen planificados.

## Evidencia previa al merge

**SHA técnico probado en un clon sin `node_modules`:** `5cfd3e910346f35d1f6e05786e5cc27ae11d11a9` (reúne #10, #7, #8 y #9).
El PR de cierre documenta la repetición de las pruebas sobre el SHA publicado de `f0/cierre-integracion`, que también incluye #6.
**Entorno verificado:** Fedora 45 x86_64, Node `22.23.1`, pnpm `12.14.0`, en coincidencia con `package.json` raíz.

| Issue | Rama y commit | Evidencia |
| --- | --- | --- |
| [#10](https://github.com/maycol18ap/Pachamole/issues/10) | `f0/10-puerto-backend` · `9f939b9` | `pnpm --dir backend test` pasó 3/3, incluidos ocho valores inválidos en el test de arranque. `dev` y `start` escucharon en 3000. `start` con `PORT=37409` escuchó en ese puerto. En ambos puertos, health devolvió 200 JSON con `status=ok`, `service=pachamole-api` y tiempo UTC de la petición. La ruta inexistente devolvió 404. `PORT=invalido` salió con código 1. El README registra los comandos. |
| [#7](https://github.com/maycol18ap/Pachamole/issues/7) | `f0/07-workspace` · `d04a623` | `pnpm install --frozen-lockfile` pasó en el clon de #7 y en el clon combinado, con 210 paquetes instalados en cada uno. `git ls-files '*lock*'` listó solo `pnpm-lock.yaml` y `git diff --exit-code -- pnpm-lock.yaml` salió 0. La sección nueva del lockfile fija el gestor. El documento de resoluciones de las aplicaciones coincide byte a byte con el de `main`. `git check-ignore -v` confirmó los ignores y el proceso leyó `PORT` de `backend/.env`. `backend/.env.example` solo declara el puerto por defecto. |
| [#8](https://github.com/maycol18ap/Pachamole/issues/8) | `f0/08-guias` · `4a10620` | Los comandos de las guías coinciden con los manifiestos y se comprobaron sus enlaces relativos. La guía usa el Issue #6 existente y el frontend documenta JavaScript/JSX. |
| [#9](https://github.com/maycol18ap/Pachamole/issues/9) | `f0/09-revision` · `5cfd3e9` | Plantillas de Issues y PR comprobadas con `git ls-files`. El [tablero](https://github.com/users/maycol18ap/projects/2) respondió HTTP 200 e incluyó #6–#10 en sus datos públicos. La CLI de Projects exige `read:project`. La regla activa de `main` exige una aprobación. **Pendiente:** obtener una aprobación registrada de otra persona en el PR de cierre de F0 y enlazarla desde #9. |
| [#6](https://github.com/maycol18ap/Pachamole/issues/6) | `f0/06-checkpoint` | Evidencia del clon combinado registrada en este documento. El escaneo por patrones de las líneas añadidas no halló coincidencias. Pendiente de verificar y registrar el SHA de `main` tras la integración. |

En el clon combinado, `pnpm --dir frontend lint` y `pnpm --dir frontend build` salieron 0. `pnpm --dir frontend dev` devolvió 200 para `/` y `/src/main.jsx` en localhost:5173. Las sondas de Express verificaron health, 404 y los puertos con `pnpm --dir backend dev` y `pnpm --dir backend start`. La prueba de `backend/.env` usó un puerto alternativo libre y se retiró el archivo temporal. Los procesos se detuvieron al finalizar. El formato común de errores JSON corresponde a F1-04.

## Cierre de F0

1. Registrar en #9 el enlace al PR de cierre de F0 y a la aprobación humana cuando estén disponibles.
2. Tras integrar, partir de un clon nuevo de `main` y registrar `git rev-parse HEAD`, Node y pnpm. Repetir instalación congelada, lint, build, suite del backend, arranques, HTTP, configuración de entorno y revisión del diff.
3. Actualizar este checkpoint con los resultados de ese SHA antes de declarar F0 apta. Después, los primeros trabajos de F1 con dependencias satisfechas serán F1-01 (depende de F0-01) y F1-04 (depende de F0-05).

## ML en paralelo

La auditoría de `2877ca3` verificó #4 / F7-01 con Python 3.15.2, pandas 3.1.1 y NumPy 2.5.5. Las dos pruebas pasaron y las generaciones con semilla 42 produjeron CSV idénticos de 1.500 filas. F7-02 puede avanzar como experimento sintético independiente.
