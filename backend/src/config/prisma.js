import { PrismaClient } from "@prisma/client";

// Un cliente por proceso de Express, con conexión perezosa.
export const prisma = new PrismaClient();
