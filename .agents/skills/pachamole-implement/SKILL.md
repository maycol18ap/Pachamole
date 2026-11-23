---
name: pachamole-implement
description: Implementa un Issue pequeño de Pachamole en React o Express, con inspección del repositorio, cambios mínimos, tests y documentación. Usar cuando el usuario entregue un Issue concreto de desarrollo.
---

# Implementación acotada de Issues

## Antes
1. Lee instrucciones `AGENTS.md` del nivel pertinente, SPEC_MVP, API_CONTRATO, BASELINE y descripción del Issue.
2. Ejecuta inspección de estado real (`git status`, árbol/archivos de interés, scripts y dependencias); no asumas que un módulo existe.
3. Describe objetivo, archivos y riesgos en 4–8 líneas; si el Issue supera un módulo, proponer división.

## Durante
1. Trabaja una sola rama/tarea. No cambiar reglas de pago, universidad, envío, horario o permisos sin ADR/Issue.
2. Backend: validar servidor y precios, limitar datos, proteger endpoints; frontend: respetar diseño y accesibilidad.
3. Agregar tests de caso exitoso y por lo menos una condición de error relevante.
4. Ejecutar comandos reales existentes; si faltan, explicar y sugerir nueva tarea en vez de inventar éxito.
5. Actualizar contrato/README si cambian rutas, variables o comportamiento.

## Cierre
Entregar resumen de diff, comandos con resultados, pruebas faltantes, impacto de seguridad, rollback y texto para PR. Sin push, merge, deploy ni migraciones destructivas sin aprobación humana.
