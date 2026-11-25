BEGIN;

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "pachamole";

-- CreateEnum
CREATE TYPE "pachamole"."university_slug" AS ENUM ('udi', 'univalle', 'ucebol');

-- CreateEnum
CREATE TYPE "pachamole"."order_status" AS ENUM ('pending', 'scheduled', 'preparing', 'ready', 'on_the_way', 'delivered', 'cancelled');

-- CreateEnum
CREATE TYPE "pachamole"."payment_status" AS ENUM ('pending', 'under_review', 'verified', 'issue', 'refund_pending');

-- CreateEnum
CREATE TYPE "pachamole"."payment_method" AS ENUM ('qr');

-- CreateEnum
CREATE TYPE "pachamole"."delivery_method" AS ENUM ('walking', 'external');

-- CreateEnum
CREATE TYPE "pachamole"."audit_actor_type" AS ENUM ('admin', 'customer', 'system');

-- CreateTable
CREATE TABLE "pachamole"."universities" (
    "id" UUID NOT NULL,
    "slug" "pachamole"."university_slug" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "universities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pachamole"."categories" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pachamole"."products" (
    "id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "price_minor" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,
    "available" BOOLEAN NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "products_price_minor_nonnegative" CHECK ("price_minor" >= 0)
);

-- CreateTable
CREATE TABLE "pachamole"."orders" (
    "id" UUID NOT NULL,
    "public_id" TEXT NOT NULL,
    "tracking_token_hash" TEXT NOT NULL,
    "university_id" UUID NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_phone" TEXT NOT NULL,
    "delivery_reference" TEXT NOT NULL,
    "notes" TEXT,
    "requested_for" TIMESTAMPTZ(3) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_status" "pachamole"."order_status" NOT NULL DEFAULT 'pending',
    "food_total_minor" INTEGER NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "orders_food_total_minor_nonnegative" CHECK ("food_total_minor" >= 0)
);

-- CreateTable
CREATE TABLE "pachamole"."order_items" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "product_name_snapshot" TEXT NOT NULL,
    "unit_price_minor" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "line_total_minor" INTEGER NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "order_items_quantity_positive" CHECK ("quantity" > 0),
    CONSTRAINT "order_items_unit_price_minor_nonnegative" CHECK ("unit_price_minor" >= 0),
    CONSTRAINT "order_items_line_total_minor_valid" CHECK (
        "line_total_minor" >= 0 AND "line_total_minor" = "unit_price_minor"::BIGINT * "quantity"
    )
);

-- CreateTable
CREATE TABLE "pachamole"."payments" (
    "order_id" UUID NOT NULL,
    "payment_status" "pachamole"."payment_status" NOT NULL DEFAULT 'pending',
    "method" "pachamole"."payment_method" NOT NULL DEFAULT 'qr',
    "credited_amount_minor" INTEGER,
    "bank_reference" TEXT,
    "verified_by" UUID,
    "verified_at" TIMESTAMPTZ(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("order_id"),
    CONSTRAINT "payments_credited_amount_minor_nonnegative" CHECK ("credited_amount_minor" >= 0),
    CONSTRAINT "payments_verification_fields_valid" CHECK (
        (
            "payment_status" IN ('verified', 'refund_pending')
            AND "verified_by" IS NOT NULL AND "verified_at" IS NOT NULL AND "credited_amount_minor" IS NOT NULL
        ) OR (
            "payment_status" NOT IN ('verified', 'refund_pending')
            AND "verified_by" IS NULL AND "verified_at" IS NULL AND "credited_amount_minor" IS NULL
            AND "bank_reference" IS NULL
        )
    )
);

-- CreateTable
CREATE TABLE "pachamole"."receipts" (
    "id" UUID NOT NULL,
    "payment_order_id" UUID NOT NULL,
    "storage_key" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "uploaded_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "receipts_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "receipts_size_bytes_positive" CHECK ("size_bytes" > 0)
);

-- CreateTable
CREATE TABLE "pachamole"."deliveries" (
    "order_id" UUID NOT NULL,
    "method" "pachamole"."delivery_method" NOT NULL,

    CONSTRAINT "deliveries_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "pachamole"."admins" (
    "id" UUID NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pachamole"."audit_events" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "admin_id" UUID,
    "actor_type" "pachamole"."audit_actor_type" NOT NULL,
    "event_type" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "from_status" TEXT,
    "to_status" TEXT,
    "reason" TEXT,
    "details" JSONB,
    "occurred_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "audit_events_admin_matches_actor" CHECK (("actor_type" = 'admin') = ("admin_id" IS NOT NULL))
);

-- CreateTable
CREATE TABLE "pachamole"."order_idempotency" (
    "order_id" UUID NOT NULL,
    "key_hash" TEXT NOT NULL,
    "request_fingerprint" TEXT NOT NULL,
    "initial_response" JSONB NOT NULL,

    CONSTRAINT "order_idempotency_pkey" PRIMARY KEY ("order_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "universities_slug_key" ON "pachamole"."universities"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "pachamole"."categories"("slug");

-- CreateIndex
CREATE INDEX "products_category_id_idx" ON "pachamole"."products"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_public_id_key" ON "pachamole"."orders"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_tracking_token_hash_key" ON "pachamole"."orders"("tracking_token_hash");

-- CreateIndex
CREATE INDEX "orders_university_id_idx" ON "pachamole"."orders"("university_id");

-- CreateIndex
CREATE INDEX "order_items_product_id_idx" ON "pachamole"."order_items"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_items_order_id_product_id_key" ON "pachamole"."order_items"("order_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_bank_reference_key" ON "pachamole"."payments"("bank_reference");

-- CreateIndex
CREATE INDEX "payments_verified_by_idx" ON "pachamole"."payments"("verified_by");

-- CreateIndex
CREATE UNIQUE INDEX "receipts_storage_key_key" ON "pachamole"."receipts"("storage_key");

-- CreateIndex
CREATE INDEX "receipts_payment_order_id_idx" ON "pachamole"."receipts"("payment_order_id");

-- CreateIndex
CREATE INDEX "audit_events_order_id_idx" ON "pachamole"."audit_events"("order_id");

-- CreateIndex
CREATE INDEX "audit_events_admin_id_idx" ON "pachamole"."audit_events"("admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_idempotency_key_hash_key" ON "pachamole"."order_idempotency"("key_hash");

-- AddForeignKey
ALTER TABLE "pachamole"."products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "pachamole"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pachamole"."orders" ADD CONSTRAINT "orders_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "pachamole"."universities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pachamole"."order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "pachamole"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pachamole"."order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "pachamole"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pachamole"."payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "pachamole"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pachamole"."payments" ADD CONSTRAINT "payments_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "pachamole"."admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pachamole"."receipts" ADD CONSTRAINT "receipts_payment_order_id_fkey" FOREIGN KEY ("payment_order_id") REFERENCES "pachamole"."payments"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pachamole"."deliveries" ADD CONSTRAINT "deliveries_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "pachamole"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pachamole"."audit_events" ADD CONSTRAINT "audit_events_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "pachamole"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pachamole"."audit_events" ADD CONSTRAINT "audit_events_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "pachamole"."admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pachamole"."order_idempotency" ADD CONSTRAINT "order_idempotency_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "pachamole"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;
