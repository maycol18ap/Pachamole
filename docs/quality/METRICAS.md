# Métricas: calidad, escalabilidad y ML

**Todos son objetivos de prueba propuestos, no mediciones existentes ni promesas comerciales.** Primero ejecutar baseline y registrar ambiente (Node, DB, red, datos, hardware); después ajustar objetivos con evidencia.

| Área | Indicador | Objetivo inicial bajo prueba controlada | Evidencia |
|---|---|---|---|
| API catálogo | Latencia p95 GET /api/products | ≤ 500 ms (sin contar red externa inestable) | reporte carga |
| Pedido | Latencia p95 POST /api/orders | ≤ 1000 ms | reporte carga |
| Estabilidad | Respuestas 5xx bajo carga prevista | < 1% | logs anonimizados |
| Integridad | Duplicados con mismo idempotency key | 0 | test automatizado |
| Integridad | Preparar sin QR verificado | 0 cambios exitosos | tests de estados |
| Seguridad | Accesos anónimos a administración | 0 accesos exitosos | tests autenticación |
| Privacidad | Lectura pública de comprobantes | 0 accesos exitosos | tests almacenamiento |
| Frontend móvil | LCP | ≤ 2.5 s en perfil medido y documentado | Lighthouse |
| Uso | Módulos esenciales testeados | pruebas de éxito/error por flujo crítico | CI/local |
| ML | Baseline vs modelo | documentar MAE/RMSE, no forzar que mejore | notebook reproducible |

## Escenarios mínimos de carga

| Escenario | Registros pedidos simulados | Usuarios virtuales concurrentes | Objetivo |
|---|---:|---:|---|
| A | 100 | 1–5 | validar flujo básico |
| B | 1.000 | 10 | comparar contra A |
| C | 10.000 | 25 | observar degradación y cuellos de botella |

Son **datos de prueba**, no volumen ni capacidad real demostrada. No ejecutar carga sobre producción ni cuentas gratuitas sin revisar políticas y límites. Preparar datos sintéticos sin información personal.

## Reporte por cada prueba
Fecha, commit, entorno, endpoint, escenario, dataset, herramienta, p50/p95/p99, throughput, errores, cuellos, conclusiones y siguiente acción. Comparar medidas solo en condiciones equivalentes.

## Calidad por Issue / Definition of Done
- Criterios de aceptación verificados y reportados.
- Prueba de fallo relevante (además de caso feliz).
- Linter/build/test ejecutados cuando existan; salida resumida.
- Cambio documentado en API o README si altera comportamiento.
- Sin secretos, PII ni cambios ajenos a la tarea.
- PR revisado por humano antes de integrar.

## ML
Generador sintético con semilla y supuestos, baseline ingenuo, holdout temporal, MAE y RMSE, revisión de fuga de datos, interpretación. Nunca afirmar precisión predictiva en mercado real con datos simulados.
