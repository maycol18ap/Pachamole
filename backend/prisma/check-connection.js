import dotenv from "dotenv";
import { prisma } from "../src/config/prisma.js";

dotenv.config({ quiet: true });

try {
  await prisma.$connect().finally(() => prisma.$disconnect());
  console.log("Conexión a PostgreSQL correcta.");
} catch {
  console.error("No se pudo conectar a PostgreSQL. Revisa DATABASE_URL y la disponibilidad de la base.");
  process.exitCode = 1;
}
