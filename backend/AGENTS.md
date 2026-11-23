# Backend — reglas locales

- Inspecciona implementación actual antes de proponer estructura nueva.
- Express y JavaScript. Separar rutas/controladores/servicios/validación cuando el módulo lo amerite, sin sobreingeniería.
- API JSON coherente; documentar endpoints en `docs/architecture/API_CONTRATO.md`.
- Autenticación y permisos del administrador validados en servidor; proteger operaciones de pagos, productos y estados.
- Toda modificación de pedido usa precios de base de datos, snapshot de precio por ítem y transacciones cuando corresponda.
- Evitar doble pedido por reintento: estrategia de idempotencia y pruebas.
- Comprobante de QR: recibir/almacenar en privado, comprobar tipo y tamaño; solo humano marca pago verificado tras consulta bancaria.
- Pedido cancelado se conserva como historial. Auditoría de quién/cuándo cambia pago y estado.
- Verificar dependencias del workspace y scripts existentes antes de instalar más paquetes.
- Añadir pruebas para autenticación, validación, montos y transiciones ilegales.
