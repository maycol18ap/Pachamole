import { Router } from "express";
import { ValidationError } from "../../middleware/api-errors.js";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

function readInteger(value, { field, fallback, min, max }, details) {
  if (value === undefined) {
    return fallback;
  }

  const number = typeof value === "string" && value !== "" && !/\D/.test(value) ? Number(value) : NaN;
  if (!Number.isSafeInteger(number) || number < min || number > max) {
    const message = field === "limit"
      ? "Debe ser un entero entre 1 y 100."
      : "Debe ser un entero no negativo representable con precisión.";
    details.push({ field, message });
  }
  return number;
}

export function createProductsRouter(db) {
  const router = Router();

  router.get("/products", async (req, res) => {
    const details = [];
    const limit = readInteger(req.query.limit, {
      field: "limit", fallback: DEFAULT_LIMIT, min: 1, max: MAX_LIMIT,
    }, details);
    const offset = readInteger(req.query.offset, {
      field: "offset", fallback: 0, min: 0, max: Number.MAX_SAFE_INTEGER,
    }, details);

    if (details.length > 0) {
      throw new ValidationError(details);
    }

    const rows = await db.product.findMany({
      where: { active: true },
      orderBy: [{ category: { slug: "asc" } }, { name: "asc" }, { id: "asc" }],
      skip: offset,
      take: limit + 1,
      select: {
        id: true,
        name: true,
        category: { select: { slug: true, name: true } },
        priceMinor: true,
        available: true,
      },
    });

    const products = rows.slice(0, limit).map(({ id, ...product }) => ({
      productId: id,
      ...product,
    }));

    res.json({
      products,
      nextOffset: rows.length > limit ? offset + limit : null,
    });
  });

  return router;
}
