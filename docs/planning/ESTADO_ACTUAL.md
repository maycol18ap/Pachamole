# Estado actual — registro vivo del proyecto

**Fecha de corte** — 2026-11-25, America/La_Paz. **Fase activa** — F1. F0 está integrada y se repitió su verificación técnica. La aprobación de otra persona del equipo sigue sin registro en el PR de cierre. El experimento de demanda sintética avanza en paralelo. [Roadmap](ROADMAP.md).

- **`main` en GitHub** — [`5603ed75f1252e6d93ff28b2efec5aed82fe0bf5`](https://github.com/maycol18ap/Pachamole/commit/5603ed75f1252e6d93ff28b2efec5aed82fe0bf5), merge del PR #19. Es el SHA del clon limpio usado para repetir las pruebas de esta revisión.
- **Copia local al iniciar** — `feat/15-prisma-migracion-inicial` en `6dfd9d953c025c413604c5ad793347abb3b8982a`, sincronizada con su rama remota y con el árbol limpio. La referencia local `origin/main` todavía apuntaba a `baec61586119123fbb6b27e973622683efd386dd`. La rama de Prisma y el `main` remoto consultado tienen el mismo árbol de archivos, y el avance de Prisma ya figura integrado. [PR #19](https://github.com/maycol18ap/Pachamole/pull/19).

## F0 · Entorno, arranque y colaboración

| Avance | Estado al corte |
| --- | --- |
| Workspace, guías y checkpoint | Integrados en `fafbb92192ebbeae9a689b9e5608d9277cb0f86c` por el [PR #13](https://github.com/maycol18ap/Pachamole/pull/13). El workspace fija Node `22.23.1` y pnpm `12.14.0`, con un único lockfile de dependencias JS en la raíz. La guía explica instalación, arranque y entorno. [#6](https://github.com/maycol18ap/Pachamole/issues/6), [#7](https://github.com/maycol18ap/Pachamole/issues/7), [#8](https://github.com/maycol18ap/Pachamole/issues/8) y [README](../../README.md#primer-arranque-en-local). |
| Frontend y backend | `main` incluye la plantilla React/Vite y Express con `GET /api/health`. Health devuelve `200` con JSON y timestamp UTC. Express toma `PORT` del entorno o de `backend/.env` y usa `3000` por defecto. Una ruta inexistente devuelve `404`. [PR #12](https://github.com/maycol18ap/Pachamole/pull/12), [#10](https://github.com/maycol18ap/Pachamole/issues/10), [pantalla inicial](../../frontend/src/App.jsx) y [arranque del backend](../../backend/src/index.js). |
| Colaboración y revisión | GitHub muestra #6–#10 cerrados. Las plantillas están versionadas y el tablero respondió HTTP `200` el 25 de noviembre. El PR #13 está fusionado y GitHub devuelve una lista vacía de revisiones formales. Queda registrar la aprobación de otra persona del equipo y enlazarla desde #9. [Plantilla de PR](../../.github/pull_request_template.md), [tablero](https://github.com/users/maycol18ap/projects/2), [#9](https://github.com/maycol18ap/Pachamole/issues/9) y [PR #13](https://github.com/maycol18ap/Pachamole/pull/13). |

## F1 · Modelo, persistencia y API

| Avance | Estado al corte |
| --- | --- |
| Modelo de datos y estados · F1-01 | Integrado en `baec61586119123fbb6b27e973622683efd386dd`. El Issue está cerrado. El documento define entidades, relaciones, estados independientes de pedido y pago, precios históricos por ítem, token privado, idempotencia y auditoría. Las matrices describen el comportamiento que deberán implementar los flujos de Express. [#14](https://github.com/maycol18ap/Pachamole/issues/14) y [modelo](../architecture/MODELO_DATOS_ESTADOS.md). |
| Prisma y migración inicial · F1-02 | Integrados en `5603ed75f1252e6d93ff28b2efec5aed82fe0bf5` a partir de `6dfd9d953c025c413604c5ad793347abb3b8982a`. El Issue está cerrado. Prisma `6.19.3` en JavaScript ESM y la migración crean 11 tablas y sus restricciones en el esquema PostgreSQL `pachamole`. `DATABASE_URL` es para la aplicación y `DIRECT_URL` para migraciones. El reset está documentado para base local descartable. [#15](https://github.com/maycol18ap/Pachamole/issues/15), [PR #19](https://github.com/maycol18ap/Pachamole/pull/19), [migración](../../backend/prisma/migrations/20261124000000_initial/migration.sql) y [guía de Prisma](../../backend/prisma/README.md). |
| Seed de universidades y catálogo · F1-03 | Abierto y pendiente de implementación. El esquema restringe los slugs a UDI, Univalle y UCEBOL. En `main` y en la rama de Prisma consultada aún falta el script que inserte esas filas y productos ficticios de forma repetible. La dependencia #15 ya está integrada y se puede probar el seed con PostgreSQL local. [#16](https://github.com/maycol18ap/Pachamole/issues/16) y [esquema](../../backend/prisma/schema.prisma). |
| Validaciones y respuestas de error · F1-04 | Abierto, tras reapertura en GitHub. El backend ya valida su puerto y responde `404` para rutas inexistentes. Quedan la validación de entradas en servidor, el formato común de error JSON y las pruebas de `400`, `422` y límite del cuerpo. Su dependencia F0-05 (#10) está integrada. [#17](https://github.com/maycol18ap/Pachamole/issues/17) y [aplicación Express](../../backend/src/app.js). |
| Contrato de API v1 · F1-05 | Abierto. El archivo de API sigue siendo un borrador v0 con health implementado y rutas de negocio propuestas. La dependencia #14 está integrada. La aprobación y el versionado de v1 esperan el #17. [#18](https://github.com/maycol18ap/Pachamole/issues/18) y [borrador de API](../architecture/API_CONTRATO.md). |

La salida de F1 sigue pendiente del seed probado, las validaciones comunes y el contrato revisado. Falta validar la migración y ambas conexiones contra un proyecto de desarrollo de Supabase. El PR #19 figura fusionado y su lista de revisiones formales está vacía. El catálogo conectado, el carrito, el registro y seguimiento de pedidos, el QR, los comprobantes y el panel administrativo siguen en el roadmap. [PR #19](https://github.com/maycol18ap/Pachamole/pull/19) y [roadmap](ROADMAP.md).

## F7 · Demanda simulada en paralelo

El generador y su CSV están integrados en el merge `1183e650ca84d4b4feca5fdb14e4e568019c6c25` desde `ceec535d7d1eb21d8fc7c1a6687761f7deb92928`. El Issue #4 está cerrado y corresponde al generador F7-01. La semilla `42` produce una fila por cada combinación de 500 horas y tres universidades, para un total de 1.500 registros sintéticos. El avance verificado llega a generar y comprobar los datos. Queda comparar una predicción sencilla con un modelo de regresión, separar entrenamiento y evaluación por tiempo y reportar MAE y RMSE. Los datos simulados sirven para el experimento académico. [PR #11](https://github.com/maycol18ap/Pachamole/pull/11), [Issue #4](https://github.com/maycol18ap/Pachamole/issues/4), [guía ML](../../ml/README.md), [CSV](../../ml/data/synthetic/demand_data.csv) y [F7-02](ISSUES.md#f7-02--baseline-y-modelo-regresión-con-evaluación-temporal).

## Pruebas repetidas el 25 de noviembre

Todas las pruebas de esta tabla se ejecutaron sobre un clon fresco de `main` en `5603ed75f1252e6d93ff28b2efec5aed82fe0bf5`. Entorno Fedora 45 x86_64, Node `22.23.1` y pnpm `12.14.0`.

| Área | Comandos y resultados |
| --- | --- |
| Instalación y entorno | `pnpm install --frozen-lockfile` pasó con 246 paquetes instalados y sin cambios en `pnpm-lock.yaml`. `git check-ignore -v` confirmó los ignores de `.env` en la raíz, frontend y backend. El otro archivo con `lock` en el nombre, `migration_lock.toml`, registra el proveedor de Prisma. |
| Frontend | `pnpm --dir frontend lint` y `pnpm --dir frontend build` pasaron. Con `pnpm --dir frontend dev`, `/` y `/src/main.jsx` devolvieron `200` en Vite. La comprobación de render en Firefox se conserva como evidencia previa. |
| Backend | `pnpm --dir backend test` pasó **5/5** con `PACHAMOLE_TEST_DATABASE_URL` apuntando a la base temporal. `dev` y `start` sirvieron health `200` JSON y la ruta inexistente `404` en `3000`. `start` también respondió con `PORT` exportado y con `PORT` leído desde `backend/.env`. `PORT=invalido` salió con código `1`. |
| Prisma y PostgreSQL | Pasaron `db:generate` sin URLs de entorno, `prisma format --check` y `prisma validate`. `migrate deploy` creó las 11 tablas sobre PostgreSQL `17.12` local vacío mediante `DIRECT_URL`, aun con `DATABASE_URL` inaccesible. La segunda ejecución quedó sin pendientes y `migrate status` y `migrate diff --exit-code` confirmaron la coincidencia. `db:check` conectó por `DATABASE_URL` y leyó `.env`. Una URL malformada y una contraseña incorrecta devolvieron código `1` con mensaje genérico. Se comprobaron 14 rechazos por restricciones y se revirtieron los datos ficticios. La prueba de transacción con Prisma verificó snapshots, rollback y una actualización condicionada al pago verificado. |
| ML | Con Python `3.15.2`, pandas `3.1.1` y NumPy `2.5.5`, `python -m unittest discover -s ml -v` pasó **2/2**. `python ml/src/generate_dataset.py` regeneró un CSV idéntico al versionado, con 1.500 filas etiquetadas como `sintetico`. pandas emitió un aviso de deprecación por `Timestamp.dayofweek`. |

Los arranques y las pruebas de base se hicieron en local. Siguen pendientes la validación de las dos conexiones en Supabase, el despliegue en Vercel y las pruebas de un pedido completo una vez implementado ese flujo. El reset se mantuvo como procedimiento documentado.

## Evidencia anterior conservada

| SHA de la evidencia | Resultado registrado |
| --- | --- |
| `2877ca35df7adf894c05f12e9327d1f659178525` | Auditoría inicial de `main` del 24 de noviembre. Pasaron la instalación congelada con almacén temporal, los arranques, lint/build y health/404. La auditoría detectó tres lockfiles de JS, `PORT` ignorado y falta de `.env.example`. En ese árbol también pasaron **2/2** pruebas de ML y dos generaciones con semilla `42` produjeron CSV idénticos de 1.500 filas con Python `3.15.2`, pandas `3.1.1` y NumPy `2.5.5`. [PR #12](https://github.com/maycol18ap/Pachamole/pull/12) y [#6](https://github.com/maycol18ap/Pachamole/issues/6). |
| `9f939b9`, `d04a623`, `4a10620`, `5cfd3e910346f35d1f6e05786e5cc27ae11d11a9` | Evidencia previa de #10, #7, #8 y #9, respectivamente. El clon combinado en `5cfd3e9` pasó la suite de backend **3/3** con ocho valores de `PORT` inválidos, lint/build, arranques y sondas HTTP. En #7 y en el clon combinado la instalación congelada instaló 210 paquetes y quedó un solo lockfile de JS. Se verificaron comandos, enlaces relativos, ignores, lectura de `.env`, plantillas y presencia de #6–#10 en el tablero. [F0 en el PR #13](https://github.com/maycol18ap/Pachamole/pull/13). |
| `2f44857982fd1e29553bd0f6e7613f96e82a3441` | El PR de cierre de F0 registra 210 paquetes en un clon limpio, lint/build, Vite con render de React en Firefox headless, backend **3/3**, health y 404, puerto predeterminado, puerto alternativo por variable y por `.env`, y código `1` para puerto inválido. También registra comprobación de guías, `git diff --check` y un escaneo por patrones del diff sin coincidencias. [PR #13](https://github.com/maycol18ap/Pachamole/pull/13). |
| `6dfd9d953c025c413604c5ad793347abb3b8982a` | Verificación local previa al merge de F1-02. Pasaron instalación con lockfile congelado, generación del cliente, migración sobre PostgreSQL `17.12` vacío, estado al día, suite de backend **5/5**, 14 casos de rechazo y conexión inválida con mensaje genérico. La batería se repitió sobre `5603ed7`. [Commit del #15](https://github.com/maycol18ap/Pachamole/commit/6dfd9d953c025c413604c5ad793347abb3b8982a) y [PR #19](https://github.com/maycol18ap/Pachamole/pull/19). |

## Siguiente trabajo por área

| Área | Siguiente Issue y dependencia |
| --- | --- |
| Coordinación y revisión | Registrar la revisión humana de F0 en [#9](https://github.com/maycol18ap/Pachamole/issues/9), dependiente de #8 ya integrado. |
| Backend · Datos | [#16 / F1-03](https://github.com/maycol18ap/Pachamole/issues/16) habilitado para desarrollo local por #15 integrado. Implementar y probar el seed idempotente de universidades y catálogo ficticio. |
| Backend · API | [#17 / F1-04](https://github.com/maycol18ap/Pachamole/issues/17) habilitado por #10 integrado. Puede avanzar en paralelo con #16. |
| Arquitectura | [#18 / F1-05](https://github.com/maycol18ap/Pachamole/issues/18) espera #17. La otra dependencia, #14, ya está integrada. La verificación en Supabase sigue pendiente dentro del alcance de #15. |
| Frontend y Diseño | [F6-01](ISSUES.md#f6-01--inventario-de-archivos-recibidos-de-diseño) puede preparar el inventario por tener #7 integrado. La recepción de archivos de Diseño está por confirmar. El catálogo en React ([F2-03](ISSUES.md#f2-03--react-consulta-catálogo-y-maneja-estados)) espera la API F2-01, que depende de #15, #16 y #17. |
| ML | [F7-02](ISSUES.md#f7-02--baseline-y-modelo-regresión-con-evaluación-temporal) está habilitado por F7-01 (#4). El backlog registra la tarea de entrenamiento y evaluación temporal. La búsqueda de Issues del repositorio no devolvió un ticket de GitHub para F7-02. |
