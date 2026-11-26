import dotenv from "dotenv";
import { prisma } from "../src/config/prisma.js";
import catalog from "./seed-data/catalogo-demo.json" with { type: "json" };

const universities = [
  { slug: "udi", name: "UDI" },
  { slug: "univalle", name: "Univalle" },
  { slug: "ucebol", name: "UCEBOL" },
];

const categories = [
  { slug: "snacks", name: "Snacks" },
  { slug: "combos", name: "Combos" },
  { slug: "refrescos", name: "Refrescos" },
];

const localHosts = ["localhost", "127.0.0.1", "[::1]"];

function getLocalDatabaseName(connectionString) {
  let url;
  try {
    url = new URL(connectionString);
  } catch {
    return null;
  }

  const databaseName = url.pathname.slice(1);
  if (
    !["postgresql:", "postgres:"].includes(url.protocol) ||
    !localHosts.includes(url.hostname) ||
    !/^pachamole_(dev|test)(_[a-z0-9]+)*$/.test(databaseName) ||
    url.hash ||
    url.searchParams.size !== 1 ||
    url.searchParams.get("schema") !== "pachamole"
  ) {
    return null;
  }

  return databaseName;
}

async function seed(databaseName) {
  await prisma.$transaction(async (db) => {
    // Comprueba el servidor y la base en la conexión que hará las escrituras.
    const [target] = await db.$queryRaw`
      SELECT current_database() AS name, host(inet_server_addr()) AS address
    `;
    if (target.name !== databaseName || !["127.0.0.1", "::1"].includes(target.address)) {
      throw new Error("El destino de PostgreSQL debe ser local.");
    }

    await db.university.createMany({ data: universities, skipDuplicates: true });
    await db.category.createMany({ data: categories, skipDuplicates: true });

    const savedCategories = await db.category.findMany({
      where: { slug: { in: categories.map(({ slug }) => slug) } },
      select: { id: true, slug: true },
    });
    const categoryIds = new Map(savedCategories.map(({ id, slug }) => [slug, id]));
    const products = catalog.products.map(({ categorySlug, ...product }) => ({
      ...product,
      categoryId: categoryIds.get(categorySlug),
    }));

    await db.product.createMany({ data: products, skipDuplicates: true });
  });
}

dotenv.config({ quiet: true });

const databaseName = getLocalDatabaseName(process.env.DATABASE_URL);
if (!databaseName || ![undefined, "development", "test"].includes(process.env.NODE_ENV)) {
  console.error("El seed requiere una base PostgreSQL local de desarrollo o pruebas.");
  process.exitCode = 1;
} else {
  try {
    await seed(databaseName);
    console.log("Catálogo de prueba cargado en PostgreSQL local.");
  } catch {
    console.error("No se pudo cargar el catálogo de prueba. Revisa el destino local y la migración.");
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}
