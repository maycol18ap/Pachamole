#  PACHAMOLE

**Bolivia × México · Dos culturas, un mismo sabor**

> Proyecto académico interdisciplinario de Ingeniería de Sistemas y Diseño Gráfico. **Estado actual: configuración inicial del entorno**. Este documento describe el producto previsto; **no significa que las funcionalidades ya estén implementadas**.

## ¿Qué es Pachamole?

Pachamole es una propuesta de *dark kitchen* de comida de inspiración boliviana y mexicana, orientada inicialmente a estudiantes en Santa Cruz de la Sierra, Bolivia. Su aplicación web permitirá consultar el menú, armar un carrito, registrar pedidos y dar seguimiento básico; una administración interna gestionará productos, pagos y preparación.

**Cobertura inicial:** UDI, Univalle y UCEBOL. El cliente seleccionará una de estas universidades y una referencia de entrega, sin mapas ni geolocalización.

## Alcance previsto del MVP

**Cliente:**
- Ver menú, categorías, precios, imágenes y disponibilidad.
- Agregar productos al carrito y revisar cantidades.
- Registrar pedido como invitado indicando nombre, teléfono, universidad, referencia, observaciones y horario solicitado.
- Revisar sus datos antes de enviar el pedido.
- Recibir un identificador de pedido y un enlace privado de seguimiento.
- Pagar **solo los productos** mediante QR, subir comprobante y consultar el estado.
- Abrir WhatsApp con un mensaje precargado para comunicarse con el negocio. **Enviar ese mensaje no crea ni confirma el pedido.**

**Administración:**
- Visualizar pedidos y sus estados.
- Revisar comprobantes y **contrastar los abonos con la banca real** antes de marcar un pago como verificado.
- Contactar por WhatsApp cuando exista una incidencia; confirmar el pago o cancelar el pedido, conservándolo en el historial.
- Gestionar productos, precios, disponibilidad y preparación.
- Coordinar entregas **manualmente** a pie o mediante mototaxi/servicio externo.
- Consultar estadísticas básicas.

**Reglas de negocio:**
- El pedido se guarda antes de adjuntar el comprobante o abrir WhatsApp.
- Pedido registrado, pago verificado y pedido en preparación **son eventos distintos**.
- El envío se paga por separado al responsable de la entrega; su costo comunicado inicialmente es **referencial: Bs 5–10**, sujeto a coordinación. La cifra final no está garantizada.
- Horario de referencia: **11:00–22:00**. Fuera de horario se informa que el local está cerrado y se permite solicitar un horario futuro disponible o contactar al negocio.
- No hay botón de cancelación automática para el cliente. Las incidencias, reclamos y eventuales devoluciones se atienden manualmente y conforme a las obligaciones aplicables.
- Las reseñas y algunas funciones complementarias dependen del tiempo disponible; no deben bloquear el circuito principal.

**Fuera del MVP:** selección libre de direcciones, cálculo de distancias, automatización de mototaxis/Yango, verificación bancaria automática, mensajes automáticos de WhatsApp y cuentas para clientes.

## Tecnologías

| Área | Tecnología | Función |
| --- | --- | --- |
| Frontend | React + Vite + JavaScript/JSX | Interfaz pública y administrativa |
| Estilos | CSS existente; Tailwind CSS **opcional, aún no asumido como instalado** | Conservar diseños recibidos y sumar utilidades si conviene |
| Backend | Node.js + Express | API y reglas del negocio |
| Paquetes JS | pnpm workspace | Instalación coordinada de `frontend` y `backend` |
| Base de datos, **planeada** | PostgreSQL alojado en Supabase | Persistir pedidos, productos y pagos |
| ORM, **planeado** | Prisma | Consultas y migraciones de base de datos |
| ML académico, **planeado** | Python + pandas + scikit-learn | Datos sintéticos y predicción experimental de demanda |
| Colaboración | Git, GitHub, Issues, Projects, Pull Requests | Versionado, tareas y revisión |

> Las herramientas marcadas como **planeadas** no deben darse por instaladas o configuradas. No introducir dependencias adicionales sin registrarlas y explicarlas en el PR.

## Estado del repositorio compartido

Según el árbol facilitado por coordinación, actualmente existen estos directorios:

```text
pachamole/
├── backend/
│   ├── package.json
│   └── src/index.js
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       └── estilos y recursos iniciales
├── design-source/     # HTML/CSS/JS originales de Diseño, cuando lleguen
├── docs/              # Guías, requisitos y decisiones
├── ml/                # Trabajo experimental de Machine Learning
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

`node_modules/` no se sube a Git. La existencia de `backend/src/index.js` no confirma por sí misma sus rutas o scripts: revísalos antes de ejecutar.

## Primer arranque en local

**Requisitos** — Git, Node.js `22.23.1` y pnpm `12.14.0`. Son las versiones
verificadas en Fedora y declaradas en el [manifiesto del workspace](package.json).
Verifica tu entorno con:

```bash
git --version
node --version
pnpm --version
```

En la raíz del repositorio clonado:

```bash
pnpm install --frozen-lockfile
```

La instalación usa el único `pnpm-lock.yaml` de la raíz. Para configurar el
backend desde un archivo, copia `backend/.env.example` a `backend/.env` y
ajusta `PORT`. El archivo es opcional y Express lo carga al arrancar con
`pnpm --dir backend`. Una variable `PORT` del entorno tiene prioridad.

Para iniciar cada aplicación en **terminales separadas**:

```bash
pnpm --dir frontend dev
pnpm --dir backend dev
```

Vite muestra su URL en la terminal, normalmente `http://localhost:5173`.
El backend escucha en `http://localhost:3000` cuando `PORT` está ausente.
Para iniciar Express sin modo watch, ejecuta `pnpm --dir backend start`.

En otra terminal, comprueba el estado de la API y una ruta inexistente:

```bash
curl -i http://localhost:3000/api/health       # 200 JSON
curl -i http://localhost:3000/api/no-existe   # 404
pnpm --dir backend test
```

Para probar un puerto distinto, detén el backend anterior y arráncalo con
un puerto libre, por ejemplo `PORT=3100 pnpm --dir backend start`.
Comprueba `curl -i http://localhost:3100/api/health`. El puerto debe ser un
entero decimal entre 1 y 65535. Un valor inválido detiene el arranque
con un mensaje en stderr y un código de salida distinto de cero.

Para listar los scripts disponibles:

```bash
cat frontend/package.json
cat backend/package.json
```

Si todavía no se ha conectado la web a la API, ver la pantalla inicial de Vite es un resultado normal.

## Flujo de pedido objetivo

1. Menú → carrito → datos del cliente y universidad.
2. Revisión final → `POST /api/orders` (ruta **prevista**, no necesariamente existente).
3. Express valida productos/precios y crea el pedido con ID y token privado.
4. Pantalla de pedido: ID, QR de productos, carga de comprobante, estado y WhatsApp.
5. Administración verifica el ingreso **en su banca**, no solo en la captura.
6. Si se confirma: preparación o programación futura. Si falla: incidencia, comunicación y posible cancelación administrativa.
7. Entrega manual, actualización de estados e historial.

La API debe garantizar que pulsar dos veces «Confirmar» no duplique pedidos. Nunca exponer datos sensibles mediante un ID secuencial público.

## Estructura futura orientativa

No hace falta crear todas estas carpetas hasta que empiece cada módulo:

```text
frontend/src/
  components/  pages/  features/  services/  routes/  styles/
backend/src/
  modules/products/  modules/orders/  modules/payments/
  modules/deliveries/  modules/admin/  middleware/  config/
backend/prisma/       # Cuando se configure la base de datos
ml/data/synthetic/    # Datos claramente rotulados como sintéticos
ml/notebooks/  ml/src/  ml/reports/
docs/requirements/  docs/api/  docs/decisions/
```

## Equipo y responsabilidades propuestas

| Integrante | Área principal | Alcance inicial |
| --- | --- | --- |
| Maycol | Coordinación técnica e integración | Estructura, contratos API, modelo de datos, seguridad y enlace con Diseño |
| Fernando | Backend operativo | Productos, pedidos, validaciones y documentación de endpoints |
| Omar | ML y analítica | Datos sintéticos, modelo explicable, evaluación y estadísticas |
| Equipo de Diseño Gráfico | Diseño e interfaz fuente | HTML, CSS, JS, identidad visual y recursos gráficos |

El equipo de Sistemas convertirá los diseños recibidos a React. La distribución podrá ajustarse según resultados y disponibilidad.

## Cómo colaborar

**Nadie trabaja directamente sobre `main`.** Las tareas se describen en GitHub Issues, se gestionan en GitHub Projects y se entregan mediante Pull Requests (PR). Cada PR debe explicar **qué cambió, cómo probarlo y por qué**. Quien entrega debe poder mostrarlo y defenderlo, aunque haya utilizado IA.

**Manual obligatorio para colaboradores:** [docs/README_COLABORADORES.md](docs/README_COLABORADORES.md).

## Documentación y seguridad

- Mantener el `.gitignore` para `node_modules`, `.env`, compilaciones y entornos Python.
- No subir tokens, claves, cuentas bancarias, contraseñas ni comprobantes reales.
- Usar `.env.example` con nombres de variables sin secretos cuando se necesiten configuraciones.
- Guardar decisiones relevantes en `docs/` y enlazar el Issue/PR.
- El README del módulo explica su uso; el PR registra el cambio; Git registra la autoría técnica.
- El modelo ML con datos sintéticos **no representa predicciones validadas con ventas reales**.

## Hito inicial — Sprint 0

Se considera listo cuando:

- [ ] El repositorio se puede clonar.
- [ ] `pnpm install --frozen-lockfile` termina correctamente desde la raíz.
- [ ] Frontend y backend se pueden ejecutar con scripts documentados.
- [ ] Existe una prueba simple de salud de la API y se conoce su URL.
- [ ] Los tres integrantes pueden crear una rama y abrir un PR de prueba.
- [ ] El tablero Projects contiene las primeras tareas asignadas.

> **No modificar este README para afirmar avances no comprobados.** Actualizarlo mediante PR cuando se complete cada hito.
