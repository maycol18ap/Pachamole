# Roadmap por fases — Pachamole MVP

**Modelo de trabajo:** Kanban sin fechas rígidas. Una fase se declara completa solo después de cumplir su puerta de salida (gate), no por cantidad de días. Los IDs `F0-01` etc. son **identificadores de planificación**, NO números de Issue de GitHub (éstos se asignan cuando se crean).

## Mapa de dependencias

`F0 → F1 → F2 → F3 → F4 → F5 → F6 → F8`; `F7 ML` puede iniciarse en paralelo desde F0; analítica basada en órdenes reales requiere F1/F4. La integración visual de Diseño puede hacerse progresivamente en F2/F3, su validación final en F6.

## F0. Repositorio auditable y colaboración
**Área:** Coordinación/Integración. **Primero**. **Ejecutor:** Maycol + Codex, con revisión humana.

- Auditar `git status`, workspace, scripts, lockfiles duplicados, `.gitignore`, ramas; no borrar nada sin analizar.
- Confirmar React y Express, endpoint `/api/health`, instrucciones para correr ambos, `.env.example`.
- Integrar AGENTS/skills sin sobrescribir archivos previos; instalar Issue/PR templates y tablero.
- Redactar primer checkpoint con comandos verificados.

**Gate F0:** clon fresco, `pnpm install` reproducible, frontend inicia, API health responde, sin secretos versionados, Issue/PR de muestra y documentación lista. No confirmar hasta ejecutar.

## F1. Modelo de datos + contrato + validaciones
**Área:** Arquitectura/Backend. **Depende:** F0.

- Aprobar tablas mínimas: university, category, product, order, order_item, payment, receipt, admin, delivery y audit log (se pueden consolidar según simplicidad).
- PostgreSQL/Supabase + Prisma si son aptos tras revisión; migraciones reproducibles, seed de 3 universidades/productos de prueba.
- Publicar contrato JSON con manejo de errores, validación y autenticación prevista; añadir tests de reglas críticas.

**Gate F1:** esquema reproducible en DB de desarrollo, seed probado, validación estándar y tests de BD; documentación API coherente. Prohibidas migraciones destructivas en datos reales sin aprobación.

## F2. Catálogo operativo
**Área:** Backend/Frontend. **Depende:** F1.

- API pública `GET /api/products` con precios reales y disponibilidad.
- Dejar previsto el CRUD administrativo protegido de productos para F4, cuando exista autenticación.
- React muestra datos reales y estados loading/error; adaptación visual inicial si ya llegó Diseño.

**Gate F2:** cliente ve catálogo real, disponibilidad y agotado; pruebas de API pública. El CRUD admin se completa como F4-07 al contar con autenticación.

## F3. Pedido desde carrito hasta comprobante
**Área:** Arquitectura + Backend + Integración. **Depende:** F2.

- Carrito React (no confiar en precio local), checkout con 3 universidades y horario, resumen antes de registrar.
- `POST /api/orders` con transacción, snapshot de precios, idempotencia, token de seguimiento.
- Página `/pedido/:token` con ID y total de comida, inicialmente estado pending. Datos personales mínimos.

**Gate F3:** desde navegador registrar un único pedido con doble clic/reintentos, verlo persistido y acceder a seguimiento seguro, sin WhatsApp obligatorio.

## F4. QR, comprobantes, autenticación y verificación manual
**Área:** Backend/Seguridad. **Depende:** F3.

- Login admin protegido, sesión segura y límites de intentos.
- QR de productos e interfaz para subir comprobante; archivos en almacenamiento privado.
- Cola admin, estado `under_review`; confirmar pago **solo** cotejado con banca, `issue` + cancelación con razón e historial.
- CRUD administrativo protegido de productos, después de disponer de autenticación (F4-07).

**Gate F4:** caso de comprobante adulterado no autoconfirma; sin sesión no se ve comprobante; solo admin pasa a `verified`; cancelados quedan en historial; tests automatizados de flujo.

## F5. Operación: cocina, horarios, envíos y WhatsApp
**Área:** Backend/Integración. **Depende:** F4.

- Máquina de estados `pending/scheduled/preparing/ready/on_the_way/delivered/cancelled` con transiciones controladas.
- Horario 11–22, pedidos programados futuros y cierre con mensaje para reserva; slots/capacidad configurables.
- Admin selecciona a pie o servicio externo MANUAL; aviso envío referencial Bs 5–10, fuera del QR.
- `wa.me` con texto mínimo e ID; no crea ni modifica estado del pedido.

**Gate F5:** pasar de pago verificado a preparación/entrega bajo reglas, rechazo de transiciones inválidas, reservas fuera de horario, costo explicado y sin API de delivery.

## F6. Integración visual y UX
**Área:** Coordinación/Frontend y Diseño. **Depende:** F2–F5 para fin de flujo; avances parciales antes.

- Preservar HTML/CSS/JS recibido en `design-source/` y documentar procedencia.
- Convertir a React sin duplicar manipulación DOM; componentes reutilizables, React Router cuando haya varias pantallas.
- Responsive y accesibilidad básica; errores y estados de carga; no convertir todo a Tailwind por obligación.
- Reseñas solo si se revalida alcance/tiempo, nunca bloquear MVP.

**Gate F6:** recorrido completo y coherente en móvil/desktop; no quedan scripts sueltos de DOM que contradigan React.

## F7. Analítica y ML académico (paralelo)
**Área:** ML/Analítica. **Depende:** generador desde F0; analítica real desde F4.

- Generar dataset ficticio reproducible (universidad, fecha, hora, número de pedidos) con supuestos.
- Baseline ingenuo, modelo regresivo, separación temporal, MAE/RMSE, informe reproducible, limitaciones.
- Métricas de ventas confirmadas desde base real de pruebas, sin contar pagos no verificados.
- Integración predictiva **opcional**, desacoplada; no bloquear pedidos por ML.

**Gate F7:** regenerar dataset y entrenamiento, informe que **reconoce que no prueba demanda real**; tests para indicadores.

## F8. Seguridad, carga, entrega y defensa
**Área:** Integración/Calidad. **Depende:** gates MVP anteriores y F7 para defensa ML.

- Ejecutar pruebas de casos reales: carga, validación, intentos de fraude de comprobante, doble pedido, privacidad y auth.
- Medir escenarios propuestos 100/1000/10000 registros, 1–25 usuarios virtuales según entorno.
- Registrar capturas/demos ficticias, resultados honestos y limitaciones.
- Checklist de despliegue HTTPS/secrets/backups para uso de verdad; no lanzar con pagos reales sin control.

**Gate F8:** build y tests pasan, recorrido completo demonstrable, métricas medidas y defensa preparada por módulos.

## Cómo repartir trabajo cuando Codex implementa
La **área técnica** determina qué chat y skill revisan, no autoriza atribuir commits a un compañero ausente. Maycol puede operar Codex para todas las áreas; Fernando/Omar pueden revisar y aceptar tickets si se reincorporan. Registrar en cada Issue `Área`, `Ejecutor real`, `Revisor humano`, `Dependencias` y `Evidencia`.
