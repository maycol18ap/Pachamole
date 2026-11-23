# Ciclo operativo: ChatGPT Project → Issue → Codex → PR → Checkpoint

**Tres chats no son tres agentes que comparten estados automáticamente.** Comparten instrucciones/archivos de un mismo Proyecto ChatGPT, pero el **repositorio** y GitHub Issues constituyen la verdad operativa.

## 1. Coordinación (chat 01)
- Recibe idea, bug o requisito.
- Confirma que aparece en SPEC_MVP o registra decisión nueva.
- Identifica fase y dependencias en ROADMAP.
- Redacta un Issue **atómico** con criterios de aceptación y pruebas negativas.
- Asigna **área** (`architecture`, `backend`, `ml`, `frontend`) y responsable de validación humano; **ejecutor técnico** puede ser Codex. Nunca atribuir trabajo no realizado a otro miembro.

## 2. Ejecución (Codex local)
- Iniciar desde el repositorio `pachamole/`, branch de feature; copiar prompt `docs/workflows/PROMPT_CODEX.md`.
- Codex inspecciona estado real, archivos y AGENTS; carga una skill específica si aplica; propone plan breve.
- Implementa **un Issue**; ejecuta pruebas; documenta; **no** despliega ni hace push/merge sin permiso.

## 3. Revisión (chat 02 o 03 y humano)
- Compartir diff y resultados (NO datos sensibles). Chat backend revisa API/seguridad; chat ML revisa simulación y métricas.
- Corregir errores; si algo no se probó, dejarlo claro.
- Abrir PR y revisar diffs/CI. Merge solo con aprobación humana.

## 4. Sincronización de contexto
- Al terminar fase/PR, actualizar: `docs/planning/ESTADO_ACTUAL.md`, ROADMAP/Issues, ADR si cambió contrato, y README de módulo.
- En ChatGPT Project, **reemplazar/actualizar el archivo subido** si ha cambiado; archivos adjuntados no equivalen a sincronización viva de Git.
- Arrancar nuevo chat con: fase/Issue, commit SHA, estado y restricciones. No pegar secretos ni capturas de banca.

## Fronteras entre áreas
- Arquitectura define contratos e invariantes; no modifica lógica de productos sin Issue.
- Backend implementa contratos y transiciones de pago.
- ML trabaja independiente, y solo consume datos de prueba hasta autorización.
- Frontend integración mantiene fidelidad del diseño y no reproduce reglas de seguridad en client-side.

## Si un compañero se integra tarde
Proporcionar README, contexto y Issues abiertos. Invitar a tomar una tarea verificable sin reescribir trabajo previo. Su contribución se refleja en commits y PR reales.
