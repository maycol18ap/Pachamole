import express from "express";
import cors from "cors";
import healthRouter from "./modules/health/health.routes.js";
import { createProductsRouter } from "./modules/catalog/products.routes.js";
import { handleApiError } from "./middleware/api-errors.js";
import { prisma } from "./config/prisma.js";

export const JSON_BODY_LIMIT = 100 * 1024;

export function createApp(apiRouter, database = prisma) {
  const app = express();
  app.use(cors({ origin: "http://localhost:5173" }));
  app.use(express.json({ limit: JSON_BODY_LIMIT, strict: false }));
  app.use("/api", healthRouter);
  app.use("/api", createProductsRouter(database));
  if (apiRouter) {
    app.use("/api", apiRouter);
  }
  app.use("/api", (_req, res) => {
    res.status(404).json({
      error: { code: "NOT_FOUND", message: "Ruta no encontrada." },
    });
  });
  app.use(handleApiError);
  return app;
}

export default createApp();
