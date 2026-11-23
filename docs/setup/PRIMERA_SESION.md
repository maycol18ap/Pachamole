# Primera sesión práctica (sin tocar código de negocio)

Objetivo: que Codex inspeccione la base real y entregue el reporte F0-01. No exigir que arregle todo de una vez.

## 1. Preparar y aislar trabajo

```bash
cd ~/VsCode/appWebs/pachamole
git status --short
git switch main
git pull --ff-only origin main
git switch -c docs/plan-codex-pachamole
```

Si hay cambios locales, primero guardarlos o resolverlos; no perderlos con `reset --hard`.

## 2. Integrar documentación

Leer `docs/setup/INICIO.md` del paquete. Extraer a carpeta temporal y comparar `AGENTS.md` anterior. Incorporar solo los archivos deseados. Subir en PR documental y fusionarlo después de revisión.

## 3. Primera tarea en GitHub

Crear Issue `F0-01 Auditoría inicial del monorepo`. Copiar criterios desde `docs/planning/ISSUES.md`. Agregarlo al GitHub Project, estado `En progreso`, área `Coordinación`, ejecutor Maycol con Codex.

## 4. Primera sesión Codex

```bash
cd ~/VsCode/appWebs/pachamole
codex
```

Prompt sugerido:

> Realiza F0-01 en modo SOLO LECTURA. Lee AGENTS.md, docs/product/SPEC_MVP.md, docs/architecture/DECISIONES.md y docs/planning/ISSUES.md. Inspecciona árbol real, pnpm-workspace.yaml, lockfiles, scripts, git status y seguridad de .gitignore. No edites, instales, borres ni hagas commits. Reporta estado encontrado, comandos verificados, diferencias con docs y plan mínimo de F0-02.

## 5. Validación humana

Revisar informe, comprobar que corresponde al repositorio, pegar hallazgos al Issue F0-01 y actualizar `docs/planning/ESTADO_ACTUAL.md`. Solo marcar terminado con evidencia reproducible.

## 6. Después

Ejecutar F0-02 y solo entonces comenzar las demás tareas. No dar tres Issues a Codex en el mismo worktree simultáneamente. Para paralelizar sin sobrescrituras, crear ramas/worktrees separados y coordinar merges; si aún no dominas `git worktree`, mantén una tarea activa a la vez.
