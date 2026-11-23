# Registro de decisiones (ADR ligero)

| ID | Decisión | Estado | Motivo |
|---|---|---|---|
| ADR-001 | Un repositorio con `frontend/`, `backend/`, `ml/` | Acordado | Coordinación simple |
| ADR-002 | pnpm workspace con lockfile único en raíz | Objetivo; **verificar estado actual** | Instalación reproducible |
| ADR-003 | React + Vite + JavaScript/JSX | Acordado | Adaptar entregables HTML/CSS/JS |
| ADR-004 | Conservar CSS original; Tailwind opcional/diferido | Acordado | Evitar reescritura de Diseño |
| ADR-005 | Node.js + Express + JavaScript | Acordado | Requisito de la materia |
| ADR-006 | PostgreSQL alojado en Supabase + Prisma | Propuesta técnica, por implementar | Pedidos con relaciones/consistencia |
| ADR-007 | API REST JSON entre React y Express | Acordado a nivel conceptual | Separar presentación y reglas |
| ADR-008 | Solo QR, verificación bancaria humana | Acordado | No integrar pasarela en MVP |
| ADR-009 | Token privado de seguimiento | Acordado | Seguimiento sin cuenta |
| ADR-010 | Datos sintéticos y modelo experimental Python | Acordado como exigencia académica | Dataset real aún no existe |
| ADR-011 | GitHub Projects para tareas + Issues y PR | Acordado como proceso | Evidencias verificables |
| ADR-012 | Codex implementa Issues pequeños, humano revisa | Nuevo plan | Evitar cambios gigantes no revisados |

### Estado real del repositorio conocido (último árbol compartido)
- `frontend/`: plantilla React/Vite con `App.jsx`, CSS, `package.json`.
- `backend/`: Express inicial con `src/index.js`, `package.json`.
- `pnpm-workspace.yaml` y lockfile raíz; en el árbol también se veían lockfiles secundarios en frontend/backend.
- `ml/`, `docs/`, `design-source/` creados; no se verificaron contenidos actuales.
- Se desconoce si AGENTS/skills anteriores ya fueron integrados o qué ramas/PR existen. **Codex debe inspeccionar antes de modificar.**

### Procedimiento de cambios
Añadir nueva entrada ADR si cambia pago, horario, estados, base de datos, API o seguridad. Registrar decisión, fecha, razón, alternativas e impacto; no modificar unilateralmente el MVP desde un chat especializado.
