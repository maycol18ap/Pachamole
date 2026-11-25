# PostgreSQL y Prisma

Prisma CLI y Prisma Client están fijados en `6.19.3`. El cliente generado se importa desde `src/config/prisma.js` en JavaScript ESM y abre la conexión cuando se usa. La comprobación de salud de Express sigue midiendo la disponibilidad HTTP. Las tablas de la aplicación y el historial de migraciones se alojan en el esquema PostgreSQL `pachamole`. [Modelo de datos y estados](../../docs/architecture/MODELO_DATOS_ESTADOS.md).

## Aplicar la migración en PostgreSQL local

Crea una base vacía y descartable llamada `pachamole_dev` en un PostgreSQL local. Usa un rol local propietario de esa base con permiso `CREATE` para que Prisma pueda crear el esquema `pachamole`. Copia `backend/.env.example` a `backend/.env` y ajusta usuario, contraseña y puerto. Ambas URLs pueden apuntar a la misma base local. Codifica los caracteres reservados de la contraseña como parte de la URL. Git ignora `backend/.env`.

Desde la raíz del repositorio, con Node `22.23.1` y pnpm `12.14.0`:

```bash
pnpm install --frozen-lockfile
pnpm --dir backend exec prisma validate
pnpm --dir backend db:generate
pnpm --dir backend exec prisma migrate deploy
pnpm --dir backend exec prisma migrate status
pnpm --dir backend db:check
PACHAMOLE_TEST_DATABASE_URL='postgresql://pachamole_local:clave_ficticia@127.0.0.1:5432/pachamole_dev?schema=pachamole' pnpm --dir backend test
```

El último comando usa la URL ficticia del ejemplo. Sustitúyela por la de tu base local para habilitar el caso que necesita PostgreSQL. `migrate deploy` aplica el SQL versionado y una segunda ejecución queda sin migraciones pendientes. `db:check` comprueba `DATABASE_URL` y, si falla, devuelve código `1` con un mensaje genérico. Este ejemplo permite comprobar ese resultado con una URL ficticia inválida.

```bash
DATABASE_URL='invalido://usuario_ficticio:clave_ficticia@127.0.0.1/pachamole_dev' pnpm --dir backend db:check
```

Prisma declara las claves, relaciones y enums. La migración añade `CHECK` para montos, cantidades, subtotal por ítem, tamaño positivo, verificación bancaria y coherencia entre actor y administrador. Los tipos de evento y de entidad de auditoría se guardan como texto. El flujo de Express aplicará el mínimo de ítems, pago y evento inicial, el total entre tablas, la idempotencia del registro y las transiciones. El flujo de subida aplicará el límite de tamaño y el tipo real del comprobante.

### Reset de una base local descartable

`migrate reset` borra el esquema y vuelve a aplicar sus migraciones. Úsalo únicamente para la base local descartable `pachamole_dev`. En el comando de ejemplo, sustituye solo el usuario, la contraseña y, si corresponde, el puerto local. Las dos URLs se fijan para ese proceso. Confirma el destino `127.0.0.1` y `pachamole_dev` en la salida de Prisma antes de aceptar el borrado.

```bash
DATABASE_URL='postgresql://pachamole_local:clave_ficticia@127.0.0.1:5432/pachamole_dev?schema=pachamole' \
DIRECT_URL='postgresql://pachamole_local:clave_ficticia@127.0.0.1:5432/pachamole_dev?schema=pachamole' \
pnpm --dir backend exec prisma migrate reset
```

## Express en Vercel y PostgreSQL en Supabase

### Aplicación (`DATABASE_URL`)

Configura el secreto solo en el entorno de servidor de Vercel. Copia **Transaction pooler** desde **Connect** en Supabase y conserva `schema=pachamole`, `sslmode=require` y `pgbouncer=true`. `connection_limit=1` es un punto de partida por instancia de Express. Usa un rol de aplicación con acceso al esquema y concede permisos sobre las tablas según lo requieran los módulos. Mantén `pachamole` fuera de **Exposed schemas** en la configuración de Data API. Ejecuta `pnpm --dir backend db:generate` al construir desde la raíz del workspace para generar el cliente para el entorno de Vercel. [Prisma en Supabase](https://supabase.com/docs/guides/database/prisma), [esquemas de la Data API](https://supabase.com/docs/guides/api/using-custom-schemas), [generación de Prisma Client en Vercel](https://www.prisma.io/docs/orm/v6/prisma-client/deployment/serverless/deploy-to-vercel).

```dotenv
DATABASE_URL="postgresql://rol_app.proyecto-ficticio:clave-ficticia@aws-0-region-ficticia.pooler.supabase.com:6543/postgres?schema=pachamole&sslmode=require&pgbouncer=true&connection_limit=1"
```

### Migraciones (`DIRECT_URL`)

Configura `DIRECT_URL` solo en el entorno protegido del operador o del proceso de migración. En **Connect** elige **Direct connection** o, si necesitas IPv4, **Session pooler** en el puerto `5432`. Usa un rol con permiso para crear el esquema y administrar sus objetos. Conserva `schema=pachamole` y `sslmode=require`. [Tipos de conexión en Supabase](https://supabase.com/docs/guides/database/connecting-to-postgres).

```dotenv
# Direct connection
DIRECT_URL="postgresql://rol_migracion:clave-ficticia@db.proyecto-ficticio.supabase.co:5432/postgres?schema=pachamole&sslmode=require"
# Alternativa Session pooler
# DIRECT_URL="postgresql://rol_migracion.proyecto-ficticio:clave-ficticia@aws-0-region-ficticia.pooler.supabase.com:5432/postgres?schema=pachamole&sslmode=require"
```

Para una base de desarrollo de Supabase con el esquema `pachamole` vacío o ausente, ejecuta `pnpm --dir backend exec prisma migrate deploy` y `pnpm --dir backend exec prisma migrate status` con las dos variables definidas en el entorno protegido. Prisma Migrate usa `DIRECT_URL`. En un proceso dedicado exclusivamente a migraciones, también puedes asignar el valor de `DIRECT_URL` a `DATABASE_URL` dentro de ese proceso. Mantén los diagnósticos del CLI en el entorno de operación. Para corregir un esquema compartido ya migrado, prepara una nueva migración revisada. [Aplicación de migraciones con Prisma](https://www.prisma.io/docs/orm/v6/prisma-client/deployment/deploy-migrations-from-a-local-environment).
