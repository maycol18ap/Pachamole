# Especificación funcional — Pachamole MVP v1.0

**Situación:** planificación acordada entre el equipo; no equivale a implementación ni a validación legal/comercial. Actualizada: 2026-11-22.

## Objetivo y negocio
Dark kitchen Bolivia × México para estudiantes de Santa Cruz, con cocina cerca de UDI y tres destinos permitidos: **UDI, Univalle y UCEBOL**. Una computadora central para tres socias que coordinan pedidos y cocina. El equipo de Diseño entrega HTML, CSS, JS y recursos visuales; Sistemas adapta todo a React y conecta Express.

## Recorrido del cliente (orden obligatorio)
1. Abre inicio/menú, revisa disponibilidad, agrega productos al carrito.
2. Indica nombre, celular, universidad, referencia, observaciones, fecha/hora futura válida. No se crean cuentas de cliente.
3. Ve pantalla de revisión: productos, cantidades, subtotal **solo de comida**, métodos de pago, información de envío y condiciones.
4. Lee antes de pagar: «El QR cubre solamente productos. El envío se coordina por WhatsApp y se paga por separado; el valor aproximado es Bs 5–10 y puede variar».
5. Presiona **Registrar pedido**. React llama a Express; el servidor valida, recalcula precios/stock y registra transaccionalmente el pedido, genera ID legible + token privado + previene duplicados.
6. Aparece comprobante de pedido **registrado**, QR para pagar los productos, opción de subir comprobante, botón «Contactar por WhatsApp» y enlace de seguimiento. El pedido existe aunque nunca abra WhatsApp.
7. La administración ve el pedido y comprobante, comprueba **en banca/notificaciones bancarias** que recibió monto correcto. Solo entonces marca pago verificado; no basta la captura.
8. Pago verificado: si es programado, queda en espera; si corresponde, pasa a preparación.
9. Admin decide entrega a pie o mototaxi gestionado manualmente, coordina envío/costo por WhatsApp, actualiza estado y al terminar marca entregado.
10. Reseña con enlace privado: función de segunda etapa si alcanza el tiempo.

## Estados separados
`payment_status`: `pending`, `under_review`, `issue`, `verified` (y estado excepcional `refund_pending` si la operación requiere resolución manual).
`order_status`: `pending`, `scheduled`, `preparing`, `ready`, `on_the_way`, `delivered`, `cancelled`.
`delivery_method`: `walking`, `external` (seleccionada por administración); estado de entrega separado solo si aporta utilidad al flujo.

No permitir `preparing` sin pago verificado. No crear segundo pedido al adjuntar comprobante o pulsar WhatsApp. La administración puede registrar cancelación por incidencia; **no borrar el pedido**, conservar razón y auditabilidad.

## Pagos y atención de problemas
- Pago exclusivamente por QR durante el MVP. Se cobra **solo el producto**; pago del mototaxi/apoyo a pie se coordina separadamente.
- Cliente adjunta comprobante. Solo admin autenticado puede verlo y marcar pago verificado después de cotejar abono real.
- Si la operación no aparece: estado `issue`, botón WhatsApp. Admin puede reabrir revisión, confirmar si el banco acredita, o cancelar con motivo.
- **No** hay botón de cancelación libre del cliente ni plataforma automática de devolución. Las situaciones que legalmente requieran reparación/reintegro se gestionan manualmente. No afirmar «no existen derechos de devolución».
- QR receptor y acceso a banca son datos operativos pendientes; no incluir datos bancarios ficticios como reales.

## Horario y programación
- Horario de referencia: **11:00 a 22:00** (zona America/La_Paz).
- Se acepta elección de horario futuro, sujeta a capacidad/tiempo de preparación y disponibilidad. No ofrecer entrega instantánea a minutos del cierre si resulta imposible.
- Si visita fuera de horario: «Estamos cerrados. Programa tu pedido o contáctanos».
- Las franjas exactas, capacidad y preparación por producto quedan configurables; no hay reglas confirmadas aún.

## Envío
- Solo tres universidades. Sin dirección libre/GPS/rutas/cálculo de kilómetros.
- Mensaje previo al pago con **Bs 5–10 aprox.** para transporte; no añadir a QR, no prometer precio definitivo.
- Admin elige a pie o mototaxi externo; contratación 100 % manual en MVP. Puede haber diferencia de costo comunicada al cliente antes de despacho.

## WhatsApp
- Complemento: enlace con ID de pedido, sin exponer datos personales ni monto bancario en el texto precargado.
- No WhatsApp Business API ni confirmación automática por mensaje.

## Administración
- Una PC y acceso autenticado. Vista de pedidos nuevos, comprobantes privados, verificación bancaria manual, incidencias, estados, envío, productos/disponibilidad y estadísticas de ventas pagadas.
- Historial conserva cancelados. Auditoría mínima (actor/fecha/motivo) en cambios sensibles.

## Machine Learning académico
- Datos **sintéticos** reproducibles para pronóstico experimental de demanda por día/hora/universidad. No validar capacidad predictiva real con datos ficticios ni bloquear el sistema principal por ML.

## Fuera del MVP
Geolocalización, mototaxi integrado automáticamente, pago verificado por API bancaria, cuentas de clientes, reembolsos automáticos, inventarios ERP, ML empresarial y automatización de WhatsApp.

## Pendientes operativos que NO bloquean la fase 0
QR de las socias, tarifas reales, horarios/cupos exactos, catálogo y fotos definitivas, puntos exactos de entrega, acceso administrativo y políticas de atención por WhatsApp.
