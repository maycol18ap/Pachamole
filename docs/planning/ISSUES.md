# Backlog detallado para GitHub Issues

Cada entrada se puede pegar en `New issue`. IDs como `F2-01` **NO** son los números `#` que asignará GitHub.

**Asignación recomendada:** `Área` describe especialidad, **Ejecutor** es quien realmente ejecuta con Codex, **Revisor** es el humano que verifica. Si Fernando u Omar no aceptaron participar, no asignarles ni atribuirles el trabajo; registra tareas disponibles por área.

Para importar opcionalmente, ver `scripts/crear_issues.py`. La importación crea Issues, no los agrega automáticamente a GitHub Projects salvo que configures una regla de auto-adición o los vincules manualmente.

## F0-01 — Auditoría inicial del monorepo (solo lectura)

- **Fase:** F0 | **Área:** coordinacion | **Prioridad:** P0
- **Dependencias:** ninguna
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Inventario real de dependencias, scripts, lockfiles y Git
- [ ] Reporte de riesgos/pendientes sin modificar archivos
- [ ] Comandos ejecutados anotados en ESTADO_ACTUAL

**Prueba negativa / error:** Detectar scripts inexistentes y lockfiles divergentes sin eliminarlos

## F0-02 — Normalizar pnpm workspace y arranque local

- **Fase:** F0 | **Área:** coordinacion | **Prioridad:** P0
- **Dependencias:** F0-01
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Un único lockfile raíz, si el análisis confirma workspace
- [ ] Frontend y backend inician desde clon fresco
- [ ] Documentar scripts verificados y requisitos Node

**Prueba negativa / error:** Fallo de instalación cuando lockfile no coincide; corregir sin borrar dependencias a ciegas

## F0-03 — Integrar AGENTS, skills y guías sin sobrescribir contenido útil

- **Fase:** F0 | **Área:** coordinacion | **Prioridad:** P0
- **Dependencias:** F0-01
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] AGENTS root y locales revisados
- [ ] Skills detectables desde Codex o lectura manual
- [ ] Guía de 3 chats y checkpoint en repo

**Prueba negativa / error:** Detectar instrucciones contradictorias y registrar resolución

## F0-04 — GitHub Issues, Projects y flujo PR de prueba

- **Fase:** F0 | **Área:** coordinacion | **Prioridad:** P0
- **Dependencias:** F0-03
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Plantillas de Issue/PR visibles
- [ ] Tablero enlazado a repositorio
- [ ] Rama y PR de ejemplo revisados

**Prueba negativa / error:** Comprobar que cambios directos a main no formen parte del proceso habitual

## F0-05 — Confirmar endpoint health y manejo de errores inicial

- **Fase:** F0 | **Área:** backend | **Prioridad:** P0
- **Dependencias:** F0-02
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] GET /api/health responde JSON estable
- [ ] Backend escucha puerto configurable
- [ ] README explica cómo ejecutar y verificar

**Prueba negativa / error:** Ruta inexistente produce 404 controlado

## F1-01 — Diseñar ER y estados para la BD

- **Fase:** F1 | **Área:** arquitectura | **Prioridad:** P0
- **Dependencias:** F0-01
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Definir entidades y claves para productos, pedidos, pagos y adjuntos
- [ ] Definir snapshots de precios, token de seguimiento y auditoría
- [ ] Diagramar relaciones y aprobar reglas de estado

**Prueba negativa / error:** No permitir preparar sin pago verificado

## F1-02 — Configurar PostgreSQL/Prisma y migración inicial

- **Fase:** F1 | **Área:** arquitectura | **Prioridad:** P0
- **Dependencias:** F1-01, F0-02
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Conexión por .env sin secretos en Git
- [ ] Migración reproducible en DB de desarrollo
- [ ] Instrucciones para reset seguro solo de DB local

**Prueba negativa / error:** Conexión inválida falla sin filtrar credenciales

## F1-03 — Semillas de universidades y catálogo ficticio

- **Fase:** F1 | **Área:** backend | **Prioridad:** P1
- **Dependencias:** F1-02
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] UDI, Univalle y UCEBOL únicos
- [ ] Productos seed con precios de prueba claramente marcados
- [ ] Seed ejecutable repetidamente sin duplicar

**Prueba negativa / error:** No permitir cuarta universidad sin decisión explícita

## F1-04 — Validaciones base y respuestas de error API

- **Fase:** F1 | **Área:** backend | **Prioridad:** P1
- **Dependencias:** F0-05
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Validador servidor para campos comunes
- [ ] Errores JSON sin stacktrace sensible
- [ ] Tests de 400/422 y límite de payload

**Prueba negativa / error:** Request malformado no detiene la API

## F1-05 — Aprobar y versionar contrato API v1

- **Fase:** F1 | **Área:** arquitectura | **Prioridad:** P0
- **Dependencias:** F1-01, F1-04
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Documentar payloads/endpoints y respuestas
- [ ] Acordar estados independientes y errores
- [ ] Ejemplos HTTP reproducibles y revisión

**Prueba negativa / error:** Detectar incompatibilidad con frontend antes de merge

## F2-01 — GET productos/categorías con disponibilidad

- **Fase:** F2 | **Área:** backend | **Prioridad:** P0
- **Dependencias:** F1-02, F1-03, F1-04
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] GET products consulta BD real
- [ ] Disponibilidad y agotado reflejados correctamente
- [ ] Respuesta paginable o limitada si escala

**Prueba negativa / error:** No filtrar datos administrativos en endpoint público

## F2-03 — React consulta catálogo y maneja estados

- **Fase:** F2 | **Área:** frontend | **Prioridad:** P1
- **Dependencias:** F2-01
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Servicio HTTP aislado del componente
- [ ] Pantalla con carga, error y vacío
- [ ] Productos agotados no se seleccionan

**Prueba negativa / error:** API caída muestra error sin romper página

## F3-01 — Carrito con cantidades y subtotal visual

- **Fase:** F3 | **Área:** frontend | **Prioridad:** P0
- **Dependencias:** F2-03
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Agregar, quitar y ajustar cantidades
- [ ] Estado consistente entre rutas
- [ ] Subtotal marcado como visual y sujeto a servidor

**Prueba negativa / error:** Cantidad cero/negativa no se envía

## F3-02 — Checkout universidades y programación

- **Fase:** F3 | **Área:** frontend | **Prioridad:** P0
- **Dependencias:** F3-01, F1-05
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Datos necesarios sin cuenta
- [ ] Solo 3 universidades y referencia
- [ ] Horario futuro validado y aviso fuera de 11–22

**Prueba negativa / error:** No aceptar universidad inexistente ni hora pasada

## F3-03 — POST orders atómico, snapshot e idempotencia

- **Fase:** F3 | **Área:** backend | **Prioridad:** P0
- **Dependencias:** F1-05, F2-01
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Precio y producto recalculado en servidor
- [ ] Pedido/ítems guardados transaccionalmente
- [ ] ID público + token privado + idempotencia

**Prueba negativa / error:** Repetir misma clave crea un solo pedido; precio manipulado ignorado

## F3-04 — Pantalla revisar pedido antes de registrar

- **Fase:** F3 | **Área:** frontend | **Prioridad:** P0
- **Dependencias:** F3-02
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Resumen de datos y subtotal
- [ ] Aviso envío Bs 5–10 aparte visible antes de pagar
- [ ] Confirmación llama API solo al aceptar

**Prueba negativa / error:** Doble clic no dispara múltiples pedidos

## F3-05 — GET seguimiento por token con datos mínimos

- **Fase:** F3 | **Área:** backend | **Prioridad:** P0
- **Dependencias:** F3-03
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Token aleatorio de alta entropía
- [ ] Solo ID/estado/monto necesario sin PII
- [ ] Limitación de consultas

**Prueba negativa / error:** Token inválido no expone datos ni distingue pedidos

## F3-06 — Página pedido registrado con ID, QR pendiente y seguimiento

- **Fase:** F3 | **Área:** frontend | **Prioridad:** P1
- **Dependencias:** F3-03, F3-05, F3-04
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Recupera por token
- [ ] Muestra registrado no pagado
- [ ] Puede reabrirse tras cerrar navegador con enlace

**Prueba negativa / error:** No marca pagado al refrescar

## F4-01 — Autenticación administrativa segura

- **Fase:** F4 | **Área:** backend | **Prioridad:** P0
- **Dependencias:** F1-02, F1-04
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Hash de credenciales y sesión segura
- [ ] Rate limit login/logout
- [ ] Pruebas de acceso sin sesión

**Prueba negativa / error:** Anónimo no accede a endpoints admin

## F4-02 — Carga privada de comprobantes QR

- **Fase:** F4 | **Área:** backend | **Prioridad:** P0
- **Dependencias:** F3-05, F1-02
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Upload valida tamaño/tipo/contenido
- [ ] Almacenar privado y asociar al pedido
- [ ] Pago pasa a under_review, nunca verified

**Prueba negativa / error:** Comprobante HTML/SVG o lectura pública es rechazado

## F4-03 — Subir comprobante y mostrar pago en revisión

- **Fase:** F4 | **Área:** frontend | **Prioridad:** P1
- **Dependencias:** F3-06, F4-02
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Formulario de imagen con error/reintento
- [ ] Texto claro de pago por productos
- [ ] No autoconfirmar éxito bancario

**Prueba negativa / error:** Archivo inválido no se acepta

## F4-04 — Administración: ver cola y comprobantes privados

- **Fase:** F4 | **Área:** backend | **Prioridad:** P0
- **Dependencias:** F4-01, F4-02
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Listado protegido con filtros mínimos
- [ ] Adjuntos solo accesibles por admin
- [ ] Pagos pendientes visibles separados

**Prueba negativa / error:** Usuario público no obtiene URL de comprobante

## F4-05 — Verificación bancaria manual, incidencia y auditoría

- **Fase:** F4 | **Área:** backend | **Prioridad:** P0
- **Dependencias:** F4-04
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Admin confirma pago tras revisión humana registrada
- [ ] Estado issue + detalle de gestión
- [ ] Nunca se prepara antes del verified

**Prueba negativa / error:** Subida sola no confirma ni cambia preparing

## F4-06 — Cancelar incidencia sin borrar historial

- **Fase:** F4 | **Área:** backend | **Prioridad:** P1
- **Dependencias:** F4-05
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Motivo y actor registrados
- [ ] Cancelado desaparece de cola activa, sigue en historial
- [ ] Pagos realmente recibidos se escalan a solución manual

**Prueba negativa / error:** No borrar pedido ni ocultar una transacción confirmada

## F4-07 — CRUD admin de productos autenticado

- **Fase:** F4 | **Área:** backend | **Prioridad:** P1
- **Dependencias:** F2-01, F4-01
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Alta, edición y agotado con validaciones
- [ ] No publicar productos sin datos mínimos
- [ ] Tests de cambios y permisos

**Prueba negativa / error:** Usuario sin sesión recibe 401/403; no modifica producto

## F5-01 — Máquina de estados para cocina y entrega

- **Fase:** F5 | **Área:** backend | **Prioridad:** P0
- **Dependencias:** F4-05
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Transiciones permitidas documentadas
- [ ] Registro de fecha/actor
- [ ] Distinguir pending, scheduled, preparing, ready, on_the_way, delivered

**Prueba negativa / error:** No preparar impago ni entregar sin proceso válido

## F5-02 — Horario 11–22 y programación validada

- **Fase:** F5 | **Área:** backend | **Prioridad:** P1
- **Dependencias:** F3-03, F5-01
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Validar timezone America/La_Paz
- [ ] Reservas futuras disponibles
- [ ] Franja configurable; cerrados no aceptan inmediato imposible

**Prueba negativa / error:** Pedido inmediato a las 23:00 rechazado o convertido en reserva explícita

## F5-03 — Método de entrega manual y aviso de costo

- **Fase:** F5 | **Área:** backend | **Prioridad:** P1
- **Dependencias:** F5-01
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Admin elige walking/external
- [ ] No API de mototaxi
- [ ] Guardar notas no sensibles de coordinación

**Prueba negativa / error:** No marcar en camino solo por solicitar mototaxi

## F5-04 — WhatsApp y consulta de estado básicos

- **Fase:** F5 | **Área:** frontend | **Prioridad:** P1
- **Dependencias:** F3-06, F5-01
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] wa.me prellenado solo con ID
- [ ] Estado se refresca de forma controlada
- [ ] WhatsApp no es condición de confirmación

**Prueba negativa / error:** Pulsar enlace nunca crea pedido adicional

## F6-01 — Inventario de archivos recibidos de Diseño

- **Fase:** F6 | **Área:** frontend | **Prioridad:** P1
- **Dependencias:** F0-02
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Guardar fuente original en design-source
- [ ] Mapeo pantallas/estilos/scripts
- [ ] Anotar licencias/autoría de recursos entregados

**Prueba negativa / error:** No sobrescribir HTML/CSS/JS fuente

## F6-02 — Migrar pantallas visuales a React sin romper CSS

- **Fase:** F6 | **Área:** frontend | **Prioridad:** P1
- **Dependencias:** F6-01, F3-06
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Componentes JSX limpios
- [ ] Sin manipulaciones DOM incompatibles
- [ ] Flujo completo con servicios Express

**Prueba negativa / error:** Navegar carrito/checkout/seguimiento sin recarga destructiva

## F6-03 — Accesibilidad y responsive de compra/admin

- **Fase:** F6 | **Área:** frontend | **Prioridad:** P1
- **Dependencias:** F6-02, F4-04
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Form labels/errores visibles y teclado
- [ ] Móvil y desktop verificados
- [ ] Loading, empty, errors y botones deshabilitados

**Prueba negativa / error:** Formulario incompleto no procesa pedido

## F7-01 — Generador reproducible de datos sintéticos

- **Fase:** F7 | **Área:** ml | **Prioridad:** P0
- **Dependencias:** F0-02
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Script con semilla fija
- [ ] Documento de supuestos y esquema
- [ ] CSV generado sin personas reales

**Prueba negativa / error:** Ejecutar dos veces con semilla misma produce mismos datos

## F7-02 — Baseline y modelo regresión con evaluación temporal

- **Fase:** F7 | **Área:** ml | **Prioridad:** P0
- **Dependencias:** F7-01
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] División temporal de train/test
- [ ] Baseline comparado con modelo scikit-learn
- [ ] MAE/RMSE e interpretación por universidad

**Prueba negativa / error:** Evitar leakage por normalización/variables del futuro

## F7-03 — Informe académico reproducible y limitaciones

- **Fase:** F7 | **Área:** ml | **Prioridad:** P1
- **Dependencias:** F7-02
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Notebook/script corre desde cero
- [ ] Resultados con versiones/semilla
- [ ] No afirmar validez con demanda real

**Prueba negativa / error:** Mostrar un caso en que modelo no supera baseline

## F7-04 — Analítica de ventas de pagos verificados

- **Fase:** F7 | **Área:** backend | **Prioridad:** P1
- **Dependencias:** F4-05
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Pedidos por universidad y productos vendidos
- [ ] Solo pagos verificados en ingresos
- [ ] Consultas paginadas/limitadas y test

**Prueba negativa / error:** Pago bajo revisión no aumenta ingresos

## F8-01 — Pruebas negativas de pagos, permisos y tokens

- **Fase:** F8 | **Área:** seguridad | **Prioridad:** P0
- **Dependencias:** F4-05, F5-01
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Suite de ocho casos de BASELINE ejecutada
- [ ] Resultados evidenciados
- [ ] No exposición pública de PII/comprobantes

**Prueba negativa / error:** Intento fraude de imagen no da estado verified

## F8-02 — Pruebas de carga y reporte de p95/error rate

- **Fase:** F8 | **Área:** calidad | **Prioridad:** P1
- **Dependencias:** F3-03, F2-01
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Dataset 100/1000/10000 simulado
- [ ] Reportes 1–5/10/25 usuarios virtuales
- [ ] Ambiente y resultados documentados

**Prueba negativa / error:** No probar carga destructiva en producción

## F8-03 — Pruebas end-to-end y defensa por módulo

- **Fase:** F8 | **Área:** calidad | **Prioridad:** P0
- **Dependencias:** F6-03, F7-03, F8-01
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Recorrido pedido→QR→admin→entrega probado
- [ ] Demo con datos de prueba sin secretos
- [ ] Documento de limitaciones y roles reales

**Prueba negativa / error:** Demostrar caso de pago no encontrado y cancelación historial

## F8-04 — Checklist de despliegue seguro y recuperación

- **Fase:** F8 | **Área:** coordinacion | **Prioridad:** P1
- **Dependencias:** F8-03
- **Revisor humano:** Maycol (o revisor humano designado)
- **Ejecutor:** Codex + humano operador; no asignar contribuciones ficticias

**Criterios de aceptación**

- [ ] Config env/secrets/HTTPS validada
- [ ] Backups y procedimiento probado si existen datos reales
- [ ] Solo habilitar pagos reales si controles comprobados

**Prueba negativa / error:** Intentar acceder con usuario anónimo; no exponer comprobantes
