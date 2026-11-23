# Configurar ChatGPT Projects para Pachamole

## Un solo Proyecto, tres chats
1. ChatGPT → Nuevo proyecto → `Pachamole — Desarrollo MVP`.
2. Abrir opciones del proyecto → instrucciones → pegar el contenido de `INSTRUCCIONES_PROYECTO.md`.
3. Subir como fuentes compartidas del proyecto **copias actualizadas** de `docs/product/SPEC_MVP.md`, `docs/planning/ROADMAP.md`, `docs/architecture/DECISIONES.md`, `docs/security/BASELINE.md`, `docs/quality/METRICAS.md` y `docs/planning/ESTADO_ACTUAL.md`.
4. Dentro del proyecto crear tres chats y enviar sus mensajes de inicio de `PROMPTS_TRES_CHATS.md`.
5. Al cerrar cada fase, actualizar `ESTADO_ACTUAL.md` y volver a adjuntar la versión nueva como fuente del proyecto si fuera necesario. No asumir sincronización en vivo con GitHub o Fedora.

Los chats comparten instrucciones y fuentes del proyecto, pero no ejecutan código en tu computadora por sí solos. Codex debe trabajar en la carpeta local del repositorio. Conectar GitHub, si se habilita, puede facilitar consultas, pero no sustituye Git, pruebas ni revisión humana.

## Reglas de coordinación
- Cada chat usa el mismo SPEC y ROADMAP; nunca autoriza cambios en la política de pagos por separado.
- Cualquier cambio de regla se anota en `DECISIONES.md`.
- Si el chat carece del commit/Issue actual, debe solicitarlo o trabajar sobre lo último compartido indicando incertidumbre.
- No subir tokens de admin, comprobantes bancarios ni datos reales de clientes a los chats.

## Recomiendo NO crear tres Proyectos independientes
Tres Proyectos separados duplican archivos y hacen más fácil que cada uno use versiones diferentes. Un Proyecto compartido con tres chats de enfoque distinto reduce deriva de contexto.
