# Contrato API v1 — para revisión humana

La versión identifica el documento. Las rutas conservan el prefijo `/api`. El arranque actual sirve health y aplica el manejo de errores de #17. Los ejemplos de negocio describen los payloads que se implementarán en las fases indicadas. Todos los importes con sufijo `Minor` se expresan como enteros en centavos de boliviano. [#18 / F1-05](https://github.com/maycol18ap/Pachamole/issues/18).

## GET /api/products

**Previsto en F2-01.** Primer consumo desde React (F2-03).

**Acceso.** Público, sin sesión. **Entrada.** Sin cuerpo. Query opcional `limit` (entero de 1 a 100, por defecto 50) y `offset` (entero no negativo, por defecto 0). Parámetros inválidos devuelven `422 VALIDATION_ERROR`.

**Respuesta.** `200 OK` con `products` y `nextOffset` (entero para la siguiente página o `null`). Express consulta el catálogo persistido y devuelve solo productos activos, también cuando están agotados. Orden estable por slug de categoría, nombre y UUID. Cada producto incluye `productId` (UUID), `name`, `category` (`slug` y `name`), `priceMinor` (entero no negativo en centavos de boliviano) y `available` (booleano). Un fallo inesperado devuelve `500 INTERNAL_ERROR` con el formato común.

Ejemplo de contrato para un catálogo de dos productos. Ambos UUID y precios provienen del seed ficticio de #16.

```http
GET /api/products?limit=50&offset=0
Accept: application/json
```

```json
{
  "products": [
    {
      "productId": "dd69a7ac-1fe0-4ae6-882b-19c0028c2272",
      "name": "Nachos Pacha (Combo)",
      "category": { "slug": "combos", "name": "Combos" },
      "priceMinor": 3500,
      "available": false
    },
    {
      "productId": "8507c03c-a41e-4451-b32a-21821d56b728",
      "name": "El Originario",
      "category": { "slug": "snacks", "name": "Snacks" },
      "priceMinor": 1400,
      "available": true
    }
  ],
  "nextOffset": null
}
```

Catálogo o página vacía (`200`).

```json
{"products":[],"nextOffset":null}
```

Error del catálogo (`500`, mismo payload genérico de #17).

```json
{"error":{"code":"INTERNAL_ERROR","message":"Ocurrió un error interno."}}
```

React muestra carga mientras espera, comprueba `response.ok` antes de leer `products` y usa `error.message` cuando recibe un error JSON. Si falla la red o no puede leer la respuesta, muestra un mensaje local y ofrece reintento. En la primera página, `products: []` muestra el estado vacío. Para cada fila, usa `productId` como clave y como referencia del carrito. Formatea `priceMinor / 100` con `Intl.NumberFormat("es-BO", { style: "currency", currency: "BOB" })`. Así, El Originario muestra Bs 14,00 y permite agregar. El combo muestra Bs 35,00 y «Agotado», con el botón de agregar deshabilitado. La disponibilidad se vuelve a comprobar en Express al registrar el pedido.

## GET /api/health

**Implementado y montado.** Acceso público. Entrada sin parámetros ni cuerpo. Respuesta `200 OK` con `status: "ok"`, `service: "pachamole-api"` y `timestamp` en UTC. Mide la disponibilidad HTTP de Express.

```json
{"status":"ok","service":"pachamole-api","timestamp":"2026-11-27T04:55:00.000Z"}
```

### Ejemplos HTTP ejecutables

Desde la raíz, con las dependencias instaladas mediante `pnpm install --frozen-lockfile`, inicia Express en una terminal.

```bash
PORT=3000 pnpm --dir backend start
```

En otra terminal, ejecuta estas sondas. El POST malformado usa una ruta inexistente para comprobar que el parser responde antes del `404`. La última llamada verifica que el servidor sigue disponible.

```bash
curl -sS -i http://localhost:3000/api/health
curl -sS -i http://localhost:3000/api/no-existe
curl -sS -i -H 'Content-Type: application/json' --data-binary '{"items":' \
  http://localhost:3000/api/no-existe
curl -sS -i http://localhost:3000/api/health
```

Resultados esperados en orden. `200`, `404 NOT_FOUND`, `400 INVALID_JSON` y `200`. Para reproducir también `422`, el límite de cuerpo al byte y el `500` genérico, ejecuta `pnpm --dir backend exec node --test test/validation.test.js`. La suite monta `POST /api/test/orders` y `GET /api/test/failure` en una instancia de prueba. El arranque normal devuelve `404` JSON para las rutas de negocio previstas.

## Errores JSON comunes

**Implementados por #17.** El parser de Express admite hasta **100 KiB (102 400 bytes)** de JSON. Las rutas con validación de campos usan el mismo objeto `error`. En `422`, `details` contiene `field` y `message` por campo inválido. Las respuestas excluyen trazas, mensajes internos y valores recibidos.

| HTTP | Código | Cuándo aplica |
| --- | --- | --- |
| `400` | `INVALID_JSON` | Sintaxis JSON inválida. |
| `400` | `INVALID_BODY` | Lectura del cuerpo interrumpida o tamaño declarado inválido. |
| `404` | `NOT_FOUND` | Ruta inexistente bajo `/api`. Mensaje «Ruta no encontrada.». |
| `413` | `PAYLOAD_TOO_LARGE` | El JSON supera el límite antes de validar campos. |
| `415` | `UNSUPPORTED_ENCODING` | Codificación del cuerpo incompatible. |
| `422` | `VALIDATION_ERROR` | La entrada incumple las reglas de una ruta con validador, por ejemplo, `null` cuando se espera un objeto. |
| `500` | `INTERNAL_ERROR` | Fallo inesperado. Mensaje «Ocurrió un error interno.». |

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

**Previstos.** Las rutas de negocio usarán el mismo formato para `401 UNAUTHORIZED` (sesión ausente o credenciales inválidas), `403 FORBIDDEN` (permiso insuficiente o protección CSRF), `404 NOT_FOUND` (recurso inexistente o token inválido), `409 CONFLICT` (estado, disponibilidad o clave en conflicto) y `429 RATE_LIMITED` (límite de frecuencia). Los adjuntos tienen su propio límite y usarán `413 PAYLOAD_TOO_LARGE` al excederlo y `415 UNSUPPORTED_MEDIA_TYPE` para tipos inadmisibles.

## GET /api/universities

**Previsto en F3-02 para el checkout.** Acceso público. Entrada sin parámetros ni cuerpo. Respuesta `200 OK` con los tres destinos admitidos. El `universityId` público es el slug que se envía al registrar el pedido. Express resuelve el UUID interno.

```json
{"universities":[{"universityId":"udi","name":"UDI"},{"universityId":"univalle","name":"Univalle"},{"universityId":"ucebol","name":"UCEBOL"}]}
```

## POST /api/orders

**Previsto en F3-03.** Acceso público sin cuenta, con límite de frecuencia. Entrada `application/json` y cabecera obligatoria `Idempotency-Key` aleatoria de alta entropía por intento. React puede generarla con `crypto.randomUUID()` y reutilizarla al reenviar el mismo intento. Express detecta los reintentos antes de volver a comprobar precios, disponibilidad u horario.

```http
POST /api/orders
Content-Type: application/json
Idempotency-Key: d5f776a8-d3d6-4ca2-8904-372ea49083cf

{
  "customer": { "name": "Ejemplo", "phone": "70000000" },
  "universityId": "udi",
  "deliveryReference": "Puerta principal",
  "notes": "Sin picante",
  "requestedFor": "2026-12-04T12:30:00-04:00",
  "items": [{ "productId": "8507c03c-a41e-4451-b32a-21821d56b728", "quantity": 2 }]
}
```

| Campo | Reglas de entrada |
| --- | --- |
| `customer` | Objeto requerido. `name` es texto no vacío de hasta 100 caracteres. `phone` es una cadena de ocho dígitos. |
| `universityId` | Uno de `udi`, `univalle`, `ucebol`. |
| `deliveryReference`, `notes` | Referencia no vacía de hasta 200 caracteres. Observaciones opcionales de hasta 500 caracteres. |
| `requestedFor` | Fecha válida con hora, segundos y `Z` o desfase explícito. Para probar el flujo futuro, elige una fecha futura disponible. Express valida horario, preparación y capacidad en `America/La_Paz`. F5-02 completa las franjas configurables. |
| `items` | Lista no vacía. Cada `productId` es el UUID devuelto por el catálogo y cada `quantity` es un entero seguro mayor que cero. Express consolida UUID repetidos y valida los límites de cantidades e importes antes de persistir. |

**Brecha con #17.** El validador reutilizable comprueba los campos comunes, pero por ahora acepta `items[].productId` como texto no vacío de hasta 100 caracteres (incluido `producto_1`). F3-03 debe exigir UUID en la ruta real. El validador actual solo comprueba la forma y validez de la fecha. La cabecera idempotente, la fecha futura y su disponibilidad, la existencia del producto y el stock requieren comprobaciones del flujo de pedidos.

**Respuesta.** `201 Created` y `Cache-Control: no-store` al registrar el pedido. El ejemplo usa el UUID de El Originario del catálogo y dos unidades a 1400 centavos. Express toma precio y disponibilidad de la BD, ignora importes y estados enviados por el cliente y guarda el precio por ítem. El QR cubre solo `foodTotalMinor`. El envío se coordina y paga aparte (aprox. Bs 5–10). El registro se completa aunque el cliente nunca abra WhatsApp.

```json
{
  "publicId": "PM-DEMO-001",
  "trackingToken": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "orderStatus": "pending",
  "paymentStatus": "pending",
  "foodTotalMinor": 2800
}
```

El token mostrado es ficticio. La operación guarda pedido, ítems, pago inicial, auditoría e idempotencia en una transacción. El hash de la clave es único. La clave y la huella del cuerpo normalizado permiten repetir el `201` y el cuerpo originales aunque cambien precio o estados. La misma clave con una huella distinta devuelve `409 CONFLICT`. Los reintentos concurrentes confirman un solo pedido. La respuesta original que conserva el token queda en un registro privado. Campos inválidos, clave ausente o fecha pasada devuelven `422`. Una franja que ya perdió capacidad o un producto que se agotó devuelven `409`. [Modelo de datos e idempotencia](MODELO_DATOS_ESTADOS.md#compatibilidad-con-idempotencia).

## GET /api/orders/track/:token

**Previsto en F3-05.** Acceso mediante token opaco privado, con límite de frecuencia. Entrada solo en el path, con 32 bytes generados por azar criptográfico y codificados en base64url sin relleno. Express busca por el hash SHA-256 del token. El ID público sirve para coordinación. El token se excluye de registros, trazas y texto de WhatsApp. El seguimiento y la subida responden con `Cache-Control: no-store`.

**Respuesta.** `200 OK` con los campos mínimos de la consulta actual. Tanto un token inválido o desconocido como usar el ID público en su lugar devuelven `404 NOT_FOUND` con el mismo mensaje genérico («Pedido no encontrado.»). La respuesta de éxito excluye contacto, referencia de entrega, comprobantes y datos bancarios.

```json
{"publicId":"PM-DEMO-001","orderStatus":"pending","paymentStatus":"under_review","foodTotalMinor":2800}
```

## POST /api/orders/track/:token/receipt

**Previsto en F4-02.** Acceso por el mismo token privado, con límite de frecuencia. Entrada `multipart/form-data` con un archivo en `receipt`. Se proponen JPG y PNG con un máximo de 5 MiB. Express verifica contenido real, tamaño y estado del pedido y guarda el archivo en privado con un nombre aleatorio. Devuelve `404` genérico por token inválido o desconocido, `409` si el estado impide adjuntar, `422` si falta el archivo, `415` por tipo inválido y `413` si supera el límite de adjuntos.

**Respuesta.** `201 Created`, por ejemplo, `{"publicId":"PM-DEMO-001","orderStatus":"pending","paymentStatus":"under_review"}`. La primera subida válida mueve el pago de `pending` a `under_review`. Una nueva subida admitida durante la revisión conserva ese estado. El comprobante queda disponible para revisión bancaria por administración.

## Estados independientes

| Campo | Valores |
| --- | --- |
| `orderStatus` | `pending`, `scheduled`, `preparing`, `ready`, `on_the_way`, `delivered`, `cancelled` |
| `paymentStatus` | `pending`, `under_review`, `issue`, `verified`, `refund_pending` |

Confirmar el abono en banca cambia el pago. Pasar a `scheduled` o `preparing` exige que el pago esté `verified` y una acción distinta sobre el pedido. Una incidencia puede reabrirse para revisión. Administración cancela con motivo y conserva el historial. Si hubo abono verificado o se confirma uno posterior para un pedido cancelado, el pago queda en `refund_pending` para resolución manual. [Matrices de estados](MODELO_DATOS_ESTADOS.md#matriz-de-estados-del-pedido).

## Endpoints de administración

**Convenciones previstas desde F4-01.** Todas las operaciones administrativas requieren sesión y permisos comprobados en Express, salvo el inicio de sesión. Cookie de sesión `HttpOnly`, `Secure` en HTTPS, `SameSite` según el origen y protección CSRF para cambios de estado. Respuestas privadas con `Cache-Control: no-store`. En las rutas de pedidos admin, `:id` es el UUID interno que entrega la cola. Los cambios de pago y pedido se auditan con actor, fecha y motivo cuando corresponda.

### POST /api/admin/login y POST /api/admin/logout

| Ruta prevista | Acceso y entrada | Respuesta de contrato |
| --- | --- | --- |
| `POST /api/admin/login` · F4-01 | Público con límite de intentos. JSON `{"username":"admin-demo","password":"<contraseña de prueba>"}`. | `200`, `Set-Cookie` de sesión y `{"authenticated":true}`. Credenciales inválidas devuelven `401` genérico. |
| `POST /api/admin/logout` · F4-01 | Admin con protección CSRF y límite de frecuencia. Sin cuerpo. | `204 No Content`. Invalida la sesión y expira la cookie. |

### GET /api/admin/orders

**Previsto en F4-04.** Acceso admin con permiso de lectura. Entrada sin cuerpo. Query opcional `view=active\|history` (por defecto `active`), `orderStatus`, `paymentStatus`, `limit` y `offset` con los límites del catálogo. La cola excluye `cancelled` y `delivered`. La vista histórica incluye ambos. Filtros inválidos devuelven `422`.

**Respuesta.** `200 OK` con `orders` y `nextOffset`. Ejemplo de contrato con la información mínima para coordinar y revisar comprobantes. La lista de adjuntos contiene metadatos e ID, y el contenido se consulta por separado.

```json
{
  "orders": [
    {
      "id": "2e1bf734-304c-4b59-9648-93276c3f03b7",
      "publicId": "PM-DEMO-001",
      "customer": { "name": "Ejemplo", "phone": "70000000" },
      "universityId": "udi",
      "deliveryReference": "Puerta principal",
      "notes": "Sin picante",
      "requestedFor": "2026-12-04T16:30:00.000Z",
      "orderStatus": "pending",
      "paymentStatus": "under_review",
      "foodTotalMinor": 2800,
      "items": [{ "productId": "8507c03c-a41e-4451-b32a-21821d56b728", "name": "El Originario", "quantity": 2, "unitPriceMinor": 1400, "lineTotalMinor": 2800 }],
      "receipts": [{ "receiptId": "dc4360b6-b801-497e-935d-6b8c7a792165", "contentType": "image/png", "sizeBytes": 24576 }]
    }
  ],
  "nextOffset": null
}
```

### GET /api/admin/orders/:id/receipts/:receiptId

**Ruta propuesta para F4-04.** Acceso admin con permiso de ver comprobantes. Entrada con ambos UUID en el path, sin cuerpo. Express comprueba que el comprobante pertenece al pedido. Respuesta `200 OK` con el archivo privado (por ejemplo, `Content-Type: image/png` y `Cache-Control: no-store`). Devuelve `404` si el recurso no existe para ese pedido.

### Operaciones de escritura

Cada ruta recibe JSON. El error `422` identifica campos inválidos. Las rutas con identificador devuelven `404` si el recurso no existe. Una operación incompatible con el estado actual devuelve `409`.

| Ruta prevista | Acceso y entrada | Respuesta de contrato |
| --- | --- | --- |
| `PATCH /api/admin/orders/:id/payment` · F4-05 | Admin con permiso de verificación bancaria. Ejemplo `{"paymentStatus":"verified","creditedAmountMinor":2800,"bankReference":"DEMO-ABONO-001"}`. Para `issue` o reabrir en `under_review`, enviar el estado y `reason`. Para `refund_pending` por abono posterior en un pedido cancelado, enviar el estado, monto, motivo y referencia si está disponible. | `200`, p. ej. `{"publicId":"PM-DEMO-001","orderStatus":"pending","paymentStatus":"verified"}`. La verificación exige un abono real identificable, por el importe exacto de comida y sin asignación previa. La referencia se envía cuando existe. Una confirmación repetida conserva la verificación y el evento originales. |
| `PATCH /api/admin/orders/:id/status` · F4-06 (cancelación) y F5-01 (cocina y despacho) | Admin con permiso de operación. Ejemplo `{"orderStatus":"preparing"}`. Para cancelar, `{"orderStatus":"cancelled","reason":"Incidencia de operación"}`. | `200`, p. ej. `{"publicId":"PM-DEMO-001","orderStatus":"preparing","paymentStatus":"verified"}`. Se devuelve `409` al intentar preparar con pago `under_review` y se conservan ambos estados. El despacho a `on_the_way` requiere método de entrega. Una cancelación con pago verificado devuelve `orderStatus: "cancelled"` y `paymentStatus: "refund_pending"`. |
| `PATCH /api/admin/orders/:id/delivery` · F5-03 | Admin con permiso de coordinación. JSON `{"method":"external"}` o `{"method":"walking"}`. Campo opcional `coordinationNotes` de hasta 500 caracteres para notas operativas sin datos sensibles, cuya persistencia se implementará en F5-03. | `200`, p. ej. `{"publicId":"PM-DEMO-001","method":"external","coordinationNotes":null}`. La respuesta devuelve las notas persistidas o `null`. Elegir el método conserva el estado del pedido. La coordinación es manual. |
| `POST /api/admin/products` · F4-07 | Admin con permiso de catálogo. JSON `{"name":"Producto demo","categorySlug":"snacks","priceMinor":1400,"active":true,"available":true}`. La categoría debe existir y el precio es entero no negativo. | `201`, p. ej. `{"productId":"86550c8f-20c6-4ce3-83f2-c5c21c5d374a","name":"Producto demo","categorySlug":"snacks","priceMinor":1400,"active":true,"available":true}`. Express asigna el UUID. |
| `PATCH /api/admin/products` · F4-07 | Admin con permiso de catálogo. Entrada con `productId` UUID y al menos un campo editable del alta. Ejemplo `{"productId":"8507c03c-a41e-4451-b32a-21821d56b728","available":false}`. Para retirar del catálogo, actualizar `active` a `false`. | `200` con el mismo objeto del alta y los valores actualizados. Ejemplo `{"productId":"8507c03c-a41e-4451-b32a-21821d56b728","name":"El Originario","categorySlug":"snacks","priceMinor":1400,"active":true,"available":false}`. |

## GET /api/slots?date=YYYY-MM-DD

**Previsto en F5-02.** Acceso público. Entrada sin cuerpo, con fecha local obligatoria `date` en `America/La_Paz`. Fecha ausente o inválida devuelve `422`.

**Respuesta.** `200 OK`, p. ej. `{"date":"2026-12-04","timeZone":"America/La_Paz","slots":[{"requestedFor":"2026-12-04T12:30:00-04:00"}]}`. Si la fecha carece de cupos, devuelve `slots: []`. La franja debe respetar la atención de 11:00 a 22:00 y el tiempo de preparación. Los horarios y cupos concretos son configurables. La consulta informa disponibilidad y el registro del pedido la confirma. F5-04 reutiliza el seguimiento de F3 para refrescar estados. El enlace de WhatsApp lleva solo el ID público.

## GET /api/admin/analytics

**Previsto en F7-04**, a partir de los pagos verificados de F4-05. Acceso admin con permiso de analítica. Entrada sin cuerpo. Query `groupBy=university\|product` (por defecto `university`), `limit` y `offset` con los límites del catálogo. Agrupación o paginación inválidas devuelven `422`.

**Respuesta.** `200 OK` con `rows` y `nextOffset`. Cuenta solo pagos con estado `verified`. Por universidad devuelve, por ejemplo, `{"rows":[{"universityId":"udi","orderCount":1,"foodTotalMinor":2800}],"nextOffset":null}`. Por producto usa `productId`, `quantity` y `foodTotalMinor` calculado desde los subtotales históricos, por ejemplo `{"rows":[{"productId":"8507c03c-a41e-4451-b32a-21821d56b728","quantity":2,"foodTotalMinor":2800}],"nextOffset":null}`.

[Especificación MVP](../product/SPEC_MVP.md) · [Modelo de datos y estados](MODELO_DATOS_ESTADOS.md) · [Línea base de seguridad](../security/BASELINE.md) · [Roadmap](../planning/ROADMAP.md)
