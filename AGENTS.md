# AGENTS.md — Pachamole (instrucciones globales para Codex)

## Proyecto y fuente de verdad
Pachamole es un MVP académico de pedidos para una dark kitchen en Santa Cruz de la Sierra, Bolivia. Consultar primero `docs/product/SPEC_MVP.md`, `docs/architecture/DECISIONES.md` y el Issue actual. El código real es la fuente de verdad sobre lo que está **implementado**; estos documentos describen lo **planificado**. No inventes funcionalidades existentes.

## Stack y alcance
Frontend: React + Vite + JavaScript/JSX; conservar CSS entregado por Diseño; Tailwind solo cuando se justifique. Backend: Node.js + Express + JavaScript. Dependencias: pnpm workspace. BD **prevista**: PostgreSQL de Supabase y Prisma (verificar instalación previa). ML: Python/pandas/scikit-learn para experimentos con datos sintéticos. No agregar TypeScript, Docker, Redis, n8n, otras BD o servicios sin autorización.

## Modo de trabajo
1. Antes de modificar, inspecciona `git status`, archivos relevantes, scripts `package.json` y el Issue. Respeta trabajo ajeno sin descartarlo.
2. Resume un plan corto para la tarea. Para cambios multicomponente seguir `PLANS.md`.
3. Trabaja solo en los archivos necesarios. Una tarea/issue a la vez; no reconstruyas el proyecto.
4. Añade o adapta pruebas para casos exitosos, fallidos y validaciones. Ejecuta los comandos disponibles; reporta lo no ejecutado.
5. Documenta cambios de contratos API, variables de entorno o reglas de negocio. Nunca declares una prueba como superada si no se ejecutó.
6. Entrega: resumen de archivos cambiados, comandos/resultados, riesgos, dependencias, pasos para reproducir y PR sugerido.
7. No hagas `push`, `merge`, despliegues, migraciones destructivas, cambios bancarios ni operaciones sobre datos reales sin autorización explícita del humano.

## Invariantes del negocio
- Servicio inicial: universidades UDI, Univalle y UCEBOL; no geolocalización.
- Pedido registrado ≠ pago verificado ≠ preparación iniciada.
- QR paga **productos solamente**; entrega aprox. Bs 5–10 y se coordina/paga aparte.
- Comprobante subido **NO** prueba pago; solo administración verifica el abono bancario.
- WhatsApp es comunicación opcional; el pedido existe sin enviar mensaje.
- No eliminar pedidos cancelados del historial; no ofrecer cancelación automática al cliente.
- Enlaces de seguimiento con token aleatorio de alta entropía, sin revelar datos personales.
- Pedidos programados y horario de atención previstos: 11:00–22:00; respetar horario/preparación.
- No reutilizar montos/stock enviados por el cliente sin recalcular en servidor.

## Seguridad y revisión
Consultar `docs/security/BASELINE.md`. No exponer claves Supabase privilegiadas, QR bancario personal, contraseñas, datos de clientes ni comprobantes. Archivos adjuntos privados y con controles. Admin autenticado y comprobación de permisos **en Express**, no solo ocultando elementos React. Evitar SQL crudo, credenciales en repositorio y logging de PII.

## Skills disponibles
- `$pachamole-implement`: implementar un Issue acotado.
- `$pachamole-review`: revisar seguridad, calidad y diferencias de una rama/PR.
- `$pachamole-data-ml`: dataset sintético, ML y métricas sin fuga de datos.
- `$pachamole-design-integration`: convertir HTML/CSS/JS de Diseño a React preservando visual.
Usarlas cuando correspondan; no todas deben cargarse en cada cambio.

## Convención de entrega
El trabajo se coordina desde Issues y PRs de GitHub. `main` debe permanecer estable. Se permite IA como ejecutora, con verificación humana. No atribuir trabajo a colaboradores que no lo hayan hecho.
