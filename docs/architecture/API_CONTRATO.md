# Contrato API propuesto — borrador v0

**Importante:** estas rutas son sugerencias y NO son endpoints comprobados en el repositorio. Antes de implementar, revisar las rutas y convenciones existentes. Versionar cambios de contrato en PR.

| Método | Ruta propuesta | Público/admin | Función |
|---|---|---|---|
| GET | `/api/health` | Público | Estado básico |
| GET | `/api/products` | Público | Catálogo activo y disponibilidad |
| GET | `/api/universities` | Público | Solo UDI, Univalle, UCEBOL |
| GET | `/api/slots?date=YYYY-MM-DD` | Público | Horarios programables disponibles |
| POST | `/api/orders` | Público con protección antiabuso | Registrar pedido atómico e idempotente |
| GET | `/api/orders/track/:token` | Token privado | Estado público **mínimo** |
| POST | `/api/orders/track/:token/receipt` | Token privado + controles | Adjuntar comprobante privado |
| POST | `/api/admin/login` | Público limitado | Iniciar sesión admin |
| POST | `/api/admin/logout` | Admin | Cerrar sesión |
| GET | `/api/admin/orders` | Admin | Cola e historial |
| PATCH | `/api/admin/orders/:id/payment` | Admin | Verificar / incidencia con motivo |
| PATCH | `/api/admin/orders/:id/status` | Admin | Transición permitida |
| PATCH | `/api/admin/orders/:id/delivery` | Admin | Modalidad a pie/externa |
| POST/PATCH | `/api/admin/products` | Admin | Alta/edición controladas |
| GET | `/api/admin/analytics` | Admin | Estadísticas de pagos confirmados |

## Crear pedido: JSON ejemplo de **contrato propuesto**

```json
{
  "customer": {"name": "Ejemplo", "phone": "70000000"},
  "universityId": "udi",
  "deliveryReference": "Puerta principal",
  "notes": "Sin picante",
  "requestedFor": "2026-11-23T12:30:00-04:00",
  "items": [{"productId": "producto_1", "quantity": 2}]
}
```

Enviar `Idempotency-Key` aleatorio por intento de pedido y reutilizar la misma clave al reintentar **el mismo intento**. El cliente no envía precios ni un estado de pago validado.

Respuesta sugerida, sin identificar personas: `201` con `{ publicId, trackingToken, orderStatus, paymentStatus, foodTotal }`; devolver el mismo resultado al reintento idéntico. La cuenta de envío no se incluye en `foodTotal`.

## Códigos de error
`400` datos mal formados; `401` falta sesión admin; `403` acceso prohibido; `404` recurso no localizado; `409` estado, stock o clave idempotente en conflicto; `422` validación; `429` rate limit; `500` error interno sin traza sensible.

## Seguridad
- Autenticación, validación y autorización siempre en Express.
- Seguimiento por token aleatorio suficientemente fuerte; limitar respuestas y frecuencia.
- Subida de comprobante con tamaño y formato limitados (p. ej., JPG/PNG, máximo sugerido 5 MiB), nombre aleatorio, acceso privado y expiración cuando corresponda.
- `payment_status=verified` solo tras acción administrativa explícita que indica verificación bancaria. Registrar cuándo y quién.
- Ninguna transición a `preparing` sin verificación de pago; pedido programado puede esperar.
- Ver `docs/security/BASELINE.md`.
