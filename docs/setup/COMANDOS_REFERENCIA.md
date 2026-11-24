# Comandos de referencia — NO sustituye inspección del repo

## Validar entorno
```bash
pwd
git status --short
node --version
pnpm --version
codex --version
pnpm install --frozen-lockfile
pnpm --dir frontend lint
pnpm --dir frontend build
pnpm --dir backend test
# Arranque en dos terminales, ambas en la raíz:
pnpm --dir frontend dev
pnpm --dir backend dev
```

## Ejecución por Issue
```bash
git switch main
git pull --ff-only origin main
git switch -c docs/verificacion-f0
# Abrir Codex dentro del repo y pasar el prompt de docs/workflows/PROMPT_CODEX.md
codex
git diff --check
git status --short
# Revisar, testear y SOLO entonces commit/push con aprobación:
```

## Importar issues (opcional, requiere gh instalado y autenticado)
```bash
python3 scripts/crear_issues.py --fase F0       # SIMULACIÓN
python3 scripts/crear_issues.py --fase F0 --apply  # PIDE CONFIRMACIÓN
```

## GitHub Projects
Crear vista por estado (Backlog / Por hacer / En progreso / En revisión / Terminado) y filtrar por Área/Fase. El script crea Issues, pero no cambia automáticamente el Project.
