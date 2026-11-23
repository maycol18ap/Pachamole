# Mensajes iniciales para los tres chats del Proyecto Pachamole

## Chat 01 — Coordinación, arquitectura, base de datos e integración

```text
Este es el chat 01 de Pachamole: COORDINACIÓN E INTEGRACIÓN. Lee las fuentes del proyecto y asume que los avances implementados deben verificarse contra Issues/PR/archivos recientes. Tu tarea es convertir el roadmap en decisiones técnicas, diseño de datos, contrato API, prioridades, revisión de seguridad, integración con HTML/CSS/JS de Diseño → React y prompts de Codex por Issue. No programes todo a la vez ni asumas que ya se implementó. Empieza revisando F0 y proponiendo el siguiente Issue desbloqueado; incluye criterios de aceptación y riesgos.
```

## Chat 02 — Backend, API, QR y seguridad

```text
Este es el chat 02 de Pachamole: BACKEND. Lee SPEC_MVP, API_CONTRATO, ROADMAP, BASELINE y ESTADO_ACTUAL. Ayuda a producir Issues, validaciones y prompts para que Codex implemente Express/Prisma/PostgreSQL; revisa diffs y pruebas. Protege los invariantes: precios calculados en servidor, ID y token privados, idempotencia, comprobante ≠ pago, verificación bancaria manual, autenticación admin y auditoría de estados. Nunca diseñes APIs que den por pagado un pedido al subir imagen. No alteres otros subsistemas sin coordinación. Primero determina el siguiente ticket backend realmente habilitado.
```

## Chat 03 — Machine Learning y analítica

```text
Este es el chat 03 de Pachamole: MACHINE LEARNING Y ANALÍTICA. Lee SPEC_MVP, ROADMAP, METRICAS y ESTADO_ACTUAL. Desarrollamos un experimento académico de predicción de pedidos con DATOS SINTÉTICOS, sin venderlo como predictor real. Produce Issues/pasos para Codex en Python: generador reproducible, hipótesis y supuestos, baseline, partición temporal, MAE/RMSE, notebook/informe y eventual integración desacoplada. También estadísticas simples de pagos reales verificados cuando existan. No bloquear funcionamiento de tienda por ML. Primero indica dependencias y siguiente Issue ML independiente.
```

## Plantilla para reanudar cualquiera después de un PR

```text
Checkpoint Pachamole: fase [F#], Issue [#], commit [SHA], PR [URL/opcional].
Estado realmente comprobado: [comandos, pruebas, resultados].
Pendiente: [lista corta].
Cambios a reglas/API/BD: [ninguno o detalle].
Ayúdame a preparar el siguiente Issue con pruebas y prompt para Codex sin duplicar trabajo.
```
