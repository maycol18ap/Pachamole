import { ValidationError } from "./api-errors.js";

export function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function isNonEmptyText(value, maxLength) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

export function isLocalPhone(value) {
  return typeof value === "string" && value.length === 8 && /^\d{8}$/.test(value);
}

export function isPositiveInteger(value) {
  return Number.isSafeInteger(value) && value > 0;
}

export function isDateTimeWithOffset(value) {
  if (typeof value !== "string") {
    return false;
  }
  const match = /^(\d{4}-\d{2}-\d{2})T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.exec(value);
  if (!match || match[0] !== value) {
    return false;
  }
  const date = new Date(match[1]);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === match[1];
}

export function validateJsonObject(validateFields) {
  return (req, _res, next) => {
    const details = isObject(req.body)
      ? validateFields(req.body)
      : [{ field: "body", message: "Debe ser un objeto JSON." }];

    return details.length > 0 ? next(new ValidationError(details)) : next();
  };
}
