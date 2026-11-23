# Línea base de seguridad — Pachamole MVP

Seguridad por diseño, incluso si se trata de un MVP académico. Este checklist es previo a cualquier demostración con datos de personas o dinero real. No es una auditoría ni garantía de seguridad.

## S0 — Entorno y dependencias
- [ ] `git status` limpio antes del trabajo; `.env` ignorado; `.env.example` documenta variables sin secretos.
- [ ] Un `pnpm-lock.yaml` consistente con workspace; dependencias fijadas y auditadas; no ejecutar scripts de terceros innecesarios.
- [ ] Claves Supabase server-side solo en Express; nunca exponer `service_role` ni credenciales en frontend, repo o logs.
- [ ] Variables distintas de desarrollo y producción; acceso mínimo y rotación si hubo filtración.

## S1 — Clientes, formularios y datos
- [ ] Validación **servidor** de teléfono, nombre, cantidades, universidad, fecha, horario; sanitizar salida de textos libres.
- [ ] Rate limiting y límites por IP/cliente razonables para login, crear pedido, subir comprobante, token de seguimiento.
- [ ] Nunca confiar en total enviado por navegador; recalcular precios y disponibilidad en DB; registrar snapshot de precio por ítem.
- [ ] Prevención de doble clic/reintento con `Idempotency-Key` y restricción única en DB.
- [ ] Tratamiento mínimo de datos personales, política de retención definida antes de utilizar clientes reales; no registrar teléfonos completos en logs.

## S2 — Pagos QR
- [ ] QR solo como instrucción de transferencia; **subir captura no marca pagado**.
- [ ] Verificación humana del abono real en banca del receptor; si no coincide, marcar incidencia.
- [ ] Confirmación de pago exclusivamente desde endpoint admin protegido, con auditoría actor/fecha/monto y referencia verificada cuando exista.
- [ ] Evitar confirmar dos veces el mismo pago; alerta de referencias duplicadas en operaciones verificadas.
- [ ] Pedido cancelado no se borra; si hay dinero acreditado, escalar a solución manual y no retenerlo indebidamente.
- [ ] No guardar credenciales de banca en el sistema ni permitir a Codex entrar a banca real.

## S3 — Archivos/comprobantes
- [ ] Límite tamaño y tipo permitido, validar contenido real (no solo extensión/MIME del cliente); no admitir SVG/HTML ejecutable.
- [ ] Nombre aleatorio e impredecible, sin usar ruta aportada por cliente.
- [ ] Almacenamiento **privado**; acceso mediante servidor autenticado o URL temporal controlada; no carpeta `public/` de React.
- [ ] No imprimir imágenes ni metadatos sensibles en logs; considerar eliminar EXIF, retención y borrado seguro cuando corresponda.
- [ ] Pruebas de subida con archivo inválido, archivo demasiado grande y acceso no autorizado.

## S4 — Administrador
- [ ] Login con credencial robusta almacenada con hash seguro (p. ej., Argon2id o bcrypt) y rate limit de intentos.
- [ ] Sesión protegida en cookie HttpOnly + Secure en HTTPS + SameSite apropiado; protección CSRF según diseño.
- [ ] No confiar en ocultar rutas React: cada endpoint `/api/admin/*` verifica sesión y permisos.
- [ ] Operaciones críticas requieren sesión válida; logout invalida sesión.
- [ ] No usar la cuenta del cliente como admin y no exponer información bancaria en token de seguimiento.

## S5 — Estados y concurrencia
- [ ] Máquina de estados y validaciones en servidor: no preparar sin pago comprobado, no entregar antes de despachar.
- [ ] Transacciones BD para creación de pedido/ítems; impedir errores de precio o stock ante concurrencia.
- [ ] Auditoría de cambios y cancelación; `cancelled` no elimina historial.
- [ ] Error de app no expone stack trace en respuestas ni secretos en consola.

## S6 — API/web/despliegue
- [ ] CORS limitado a orígenes reales de frontend (CORS no reemplaza autenticación).
- [ ] Cabeceras seguras, HTTPS, límites de cuerpo, consultas paginadas, imágenes optimizadas, sin caché pública de pedidos privados.
- [ ] No mostrar mensajes con PII en `wa.me`; solo ID público.
- [ ] Copias de seguridad y procedimiento de restauración probados si se usa información real.
- [ ] Revisar permisos de GitHub, PRs y acciones antes de desplegar.

## Pruebas negativas obligatorias
1. Usuario anónimo intenta listar pedidos administrativos → 401/403.
2. Cliente usa token inválido o adivina ID consecutivo → sin acceso a PII.
3. Imagen de comprobante se sube → `under_review`, **no** `verified`.
4. Se intenta preparar pedido sin pago → rechazado.
5. Se envía total manipulado → backend calcula original.
6. Doble POST idéntico con igual idempotency key → un pedido.
7. Se sube archivo ejecutable disfrazado → rechazado.
8. Se cancela pedido → permanece en historial y registro de motivo.
