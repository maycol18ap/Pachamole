# Plantilla de prompt para ejecutar un Issue con Codex CLI

Sustituye los campos entre corchetes. Usa UN Issue por sesión/rama cuando sea posible.

```text
Trabajaremos en Pachamole, Issue [NÚMERO]: [TÍTULO].
Área: [backend / frontend / ml / integración].
Fase: [F0..F8].
Objetivo y criterios de aceptación:
[PEGAR DESCRIPCIÓN DEL ISSUE]

Instrucciones:
1. Inspecciona el estado real del repositorio, `AGENTS.md`, instrucciones locales, SPEC_MVP, ROADMAP y archivos afectados. No supongas implementación previa.
2. Usa la skill pertinente: [$pachamole-implement / $pachamole-data-ml / $pachamole-design-integration]. Si no está disponible, lee SKILL.md directamente.
3. Resume plan corto, archivos previstos y riesgos ANTES de editar. No amplíes alcance.
4. Implementa solo este Issue. Mantén pnpm y JavaScript, no introduzcas dependencias innecesarias.
5. Incluye pruebas de caso feliz y fallo, documentación y cambios de API/BD si se autorizaron.
6. Ejecuta verificaciones disponibles; informa comandos, resultados y tests no ejecutados.
7. NO despliegues, NO borres datos, NO modifiques ramas protegidas, NO hagas push/merge sin aprobación explícita.
8. Entrega resumen para Pull Request: qué cambió, cómo probar, riesgos, archivos modificados y pendientes.
```

## Prompts para revisión

```text
Usa $pachamole-review. Revisa únicamente el diff de [rama/PR] contra main. Busca bugs reales, regresiones de contrato, acceso indebido a comprobantes, confirmación de pago sin verificación, PII, estados inválidos y ausencia de tests. No modifiques archivos inicialmente: produce hallazgos priorizados con archivo/línea y reproducción. Si no hay diff disponible, dilo.
```

## Para etapa 0

```text
Inspecciona este repositorio de Pachamole EN MODO SOLO LECTURA. Identifica scripts reales de pnpm, estructura, lockfiles duplicados, estado de Git, uso de React/Express y seguridad del .gitignore. Compara contra docs/architecture/DECISIONES.md. No modifiques ni elimines nada. Entrega un informe con un plan mínimo por Issues y comandos de verificación.
```
