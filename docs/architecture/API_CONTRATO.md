# Contrato API propuesto — borrador v0

**Importante:** GET /api/health está implementado y se verificó localmente. Las demás rutas de esta tabla forman parte del contrato propuesto. Antes de implementarlas, revisar las convenciones existentes y registrar los cambios de contrato en el PR.

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

## GET /api/health

Devuelve HTTP `200 OK` cuando el servidor Express responde.
`timestamp` indica la fecha y hora de la petición en UTC.

```json
{
  "status": "ok",
  "service": "pachamole-api",
  "timestamp": "2026-11-23T22:53:53.570Z"
}
```

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

### Reglas de entrada propuestas para v1

La ruta de prueba del PR #23 aplica el validador de campos comunes. Estas reglas están pendientes de aprobación en [#18](https://github.com/maycol18ap/Pachamole/issues/18).

- `customer` debe ser un objeto con `name` no vacío de hasta 100 caracteres y `phone` como cadena de ocho dígitos.
- `universityId` usa los slugs `udi`, `univalle` y `ucebol` en el borrador. Los tres destinos ya están acordados en el MVP.
- `deliveryReference` es texto no vacío de hasta 200 caracteres. `notes` es opcional y admite texto de hasta 500 caracteres.
- `requestedFor` requiere una fecha válida con hora, segundos y `Z` o un desfase explícito. La disponibilidad de la franja y el tiempo de preparación se comprueban en el flujo de pedidos.
- `items` requiere al menos un objeto con `quantity` como entero seguro mayor que cero. El validador acepta `productId` como texto no vacío de hasta 100 caracteres. Prisma usa UUID para `Product.id` y el formato público de `productId` queda por acordar en v1.

El registro del pedido, las consultas de stock y precios y la idempotencia se tratan en sus propios tickets.

## Códigos de error
El PR del issue #17 propone un límite de **100 KiB (102 400 bytes)** para los cuerpos que procesa el parser JSON. Al superar ese límite, el parser devuelve `413` antes de que la ruta valide el contenido. El límite para adjuntos se define por separado.

El mismo PR propone un objeto `error` con `code` estable y `message` público. Para un `422`, `details` incluye la ruta y el mensaje de cada campo inválido. Las respuestas omiten trazas, mensajes internos y valores recibidos.

| HTTP | Código | Cuándo aplica |
|---|---|---|
| `400` | `INVALID_JSON` | La sintaxis JSON es inválida. |
| `400` | `INVALID_BODY` | La lectura del cuerpo se interrumpe o el tamaño declarado es inválido. |
| `404` | `NOT_FOUND` | Ninguna ruta bajo `/api` atiende la solicitud. El mensaje es «Ruta no encontrada.». |
| `413` | `PAYLOAD_TOO_LARGE` | El cuerpo JSON supera el límite. |
| `415` | `UNSUPPORTED_ENCODING` | La codificación del cuerpo no es compatible. |
| `422` | `VALIDATION_ERROR` | El contenido incumple las reglas de la ruta, por ejemplo `null` cuando se requiere un objeto. |
| `500` | `INTERNAL_ERROR` | Ocurre un error inesperado. |

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Revisa los campos indicados.",
    "details": [
      { "field": "items[0].quantity", "message": "Debe ser un entero mayor que cero." }
    ]
  }
}
```

El contrato también prevé `401` para falta de sesión admin, `403` para acceso prohibido, `404` cuando una ruta válida no encuentra el recurso solicitado, `409` para conflictos de estado, stock o clave idempotente, y `429` para límites de frecuencia.

## Seguridad
- Autenticación, validación y autorización siempre en Express.
- Seguimiento por token aleatorio suficientemente fuerte; limitar respuestas y frecuencia.
- Subida de comprobante con tamaño y formato limitados (p. ej., JPG/PNG, máximo sugerido 5 MiB), nombre aleatorio, acceso privado y expiración cuando corresponda.
- `payment_status=verified` solo tras acción administrativa explícita que indica verificación bancaria. Registrar cuándo y quién.
- Ninguna transición a `preparing` sin verificación de pago; pedido programado puede esperar.
- Ver `docs/security/BASELINE.md`.
