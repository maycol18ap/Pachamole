# Instalar paquete sobre Pachamole existente — Fedora + GitHub

**No ejecutes el ZIP encima sin inspeccionar.** Ya puede haber `AGENTS.md`, plantillas `.github`, README u otras guías previas.

## 1. Revisar estado actual
```bash
cd ~/VsCode/appWebs/pachamole
git status --short
git branch --show-current
cat pnpm-workspace.yaml
cat frontend/package.json
cat backend/package.json
find . -name pnpm-lock.yaml -not -path '*/node_modules/*'
```
No pegar secretos si algún archivo los contiene. Guarda trabajo sin commitear antes de proceder.

## 2. Crear rama de documentación
```bash
git switch main
git pull --ff-only origin main
git switch -c docs/plan-codex-pachamole
```
Si hay cambios no guardados o pull falla, resolver primero; no `git reset --hard`.

## 3. Extraer en carpeta temporal y comparar
```bash
mkdir -p /tmp/pachamole-kit
unzip -l ~/Descargas/Pachamole_Codex_ChatGPT_Kit.zip
unzip ~/Descargas/Pachamole_Codex_ChatGPT_Kit.zip -d /tmp/pachamole-kit
# Compara primero cualquier archivo que ya exista:
diff -u AGENTS.md /tmp/pachamole-kit/AGENTS.md || true
```
**Atención:** si `AGENTS.md` existe, fusiona instrucciones en vez de reemplazar ciegamente. Usa tu editor o un diff visual. El ZIP contiene paths relativos a la raíz del repo.

## 4. Copiar selectivamente
- Archivos nuevos `docs/`, `.agents/skills/`, `PLANS.md`, `.github/ISSUE_TEMPLATE`.
- `AGENTS.md` raíz y anidados: solo después de comparar y resolver conflictos.
- No copiar los README de este paquete encima del README principal existente; `README_PAQUETE.md` es documentación auxiliar.
- Este paquete no cambia tu `frontend/src`, `backend/src`, `package.json`, lockfiles o BD.

## 5. Comprobar
```bash
git status --short
git diff --check
pnpm --version
# Ejecutar solo comandos que realmente existan en los package.json:
pnpm --dir frontend build
```
Si falla por dependencias, documentar y convertirlo en Issue F0, sin afirmar éxito.

## 6. Subir como PR
```bash
git add AGENTS.md PLANS.md frontend/AGENTS.md backend/AGENTS.md ml/AGENTS.md .agents docs .github/ISSUE_TEMPLATE .github/pull_request_template.md scripts README_PAQUETE.md
git commit -m "docs: plan de fases, skills Codex y guias ChatGPT"
git push -u origin docs/plan-codex-pachamole
```
Abrir PR para revisar antes del merge.

## 7. Preparar GitHub Projects
1. Crear/usar el Project existente, vista Board con Backlog, Por hacer, En progreso, En revisión, Terminado.
2. Crear campos opcionales `Fase`, `Área`, `Prioridad`, `Responsable de revisión`; Issues en GitHub conectados al Project.
3. Importar **primero F0 manualmente** para comprobar el proceso; `scripts/crear_issues.py` ofrece simulación y importación opcional.
4. Para etiquetar áreas crear etiquetas si son útiles, sin usar color como fuente de verdad.

## 8. Codex CLI
```bash
cd ~/VsCode/appWebs/pachamole
codex --version
codex
```
En sesión nueva, prueba: `Lee AGENTS.md y docs/planning/ROADMAP.md y audita F0-01 en modo solo lectura`. Para invocar una skill: `$pachamole-implement` junto al Issue concreto. Codex debería descubrir `.agents/skills`; si tu versión no las lista, actualizar CLI o referenciar el SKILL.md por ruta sin asumir que se cargó.

## 9. ChatGPT Projects
Seguir `docs/chatgpt/CONFIGURACION.md`; un Proyecto y tres chats. Subir versiones actualizadas de documentos. La sesión de ChatGPT no observa automáticamente los cambios locales de Codex.
