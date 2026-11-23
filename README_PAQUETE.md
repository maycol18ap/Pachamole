# Pachamole — Kit de coordinación ChatGPT Projects + Codex

**Edición de planificación, 22 de noviembre de 2026.** Este paquete NO es una app terminada ni altera el código existente. Se integra sobre tu repositorio actual mediante revisión humana.

## Qué contiene

| Archivo | Función | Quién lo usa |
|---|---|---|
| `AGENTS.md` | Normas globales que Codex lee en el repositorio | Codex / todos |
| `backend/AGENTS.md`, `frontend/AGENTS.md`, `ml/AGENTS.md` | Reglas locales por subsistema | Codex cuando trabaja ahí |
| `.agents/skills/*/SKILL.md` | Procedimientos repetibles (implementación, revisión, ML, integración visual) | Codex a solicitud |
| `PLANS.md` | Cuándo planificar cambios grandes | Codex |
| `docs/product/SPEC_MVP.md` | Reglas de negocio confirmadas | Todos / chats |
| `docs/architecture/*` | Arquitectura, decisiones y borrador de API | Coordinación / backend |
| `docs/planning/ROADMAP.md` | Fases, dependencias y puertas de aprobación | GitHub Projects / coordinación |
| `docs/planning/ISSUES.md` y `docs/planning/issues.json` | Tareas pequeñas con criterios de aceptación | GitHub Issues |
| `docs/security/BASELINE.md` | Seguridad y privacidad desde el primer commit | Todos / Codex |
| `docs/quality/METRICAS.md` | Objetivos medibles, sin prometer resultados | Todos |
| `docs/chatgpt/*` | Instrucciones del Proyecto y prompts para tres chats | ChatGPT Projects |
| `docs/workflows/*` | Flujo Issue → Codex → pruebas → revisión → PR | Coordinación / Codex |
| `docs/setup/INICIO.md` | Instrucciones para instalar este paquete en repo existente | Coordinación |
| `.github/ISSUE_TEMPLATE/*` y `.github/pull_request_template.md` | Plantillas listas para GitHub | Equipo |
| `scripts/crear_issues.py` | Importación opcional de Issues con GH CLI; modo simulación por defecto | Coordinación |

## Reglas de uso

1. Revisar el estado real del repositorio antes de copiar, instalar o renombrar archivos.
2. **No sobrescribir** archivos previos, especialmente `AGENTS.md` o `.github/`, sin comparar su contenido.
3. No ejecutar todo el roadmap de una vez. Comenzar por fase 0, cerrar Issues uno por uno.
4. No asumir que ChatGPT puede ver tu carpeta Fedora ni los cambios recientes de GitHub; adjuntar archivos, pegarlos o conectar una app compatible.
5. No presentar tareas generadas por Codex como contribuciones humanas que no ocurrieron. Issues/PRs deben reflejar quién validó y quién realizó el cambio.

**Inicio:** `docs/setup/INICIO.md` → `docs/chatgpt/CONFIGURACION.md` → `docs/planning/ROADMAP.md`.

**Primera sesión recomendada:** `docs/setup/PRIMERA_SESION.md`. Este kit contiene 40 Issues de planificación repartidos entre F0 y F8; importarlos todos a GitHub el primer día no es obligatorio.
