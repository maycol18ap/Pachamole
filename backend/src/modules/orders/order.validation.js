import {
  isDateTimeWithOffset,
  isLocalPhone,
  isNonEmptyText,
  isObject,
  isPositiveInteger,
} from "../../middleware/validation.js";

export function validateOrderFields(order) {
  const details = [];
  const check = (valid, field, message) => {
    if (!valid) details.push({ field, message });
  };

  const { customer, universityId, deliveryReference, notes, requestedFor, items } = order;
  if (isObject(customer)) {
    check(isNonEmptyText(customer.name, 100), "customer.name", "Escribe un nombre de hasta 100 caracteres.");
    check(isLocalPhone(customer.phone), "customer.phone", "Debe ser una cadena de ocho dígitos.");
  } else {
    check(false, "customer", "Debe ser un objeto.");
  }
  check(["udi", "univalle", "ucebol"].includes(universityId), "universityId", "Elige una universidad admitida.");
  check(isNonEmptyText(deliveryReference, 200), "deliveryReference", "Escribe una referencia de hasta 200 caracteres.");
  check(notes === undefined || (typeof notes === "string" && notes.length <= 500), "notes", "Usa hasta 500 caracteres.");
  check(isDateTimeWithOffset(requestedFor), "requestedFor", "Indica una fecha y hora válida con zona horaria.");

  if (Array.isArray(items) && items.length > 0) {
    items.forEach((item, index) => {
      const field = `items[${index}]`;
      if (!isObject(item)) {
        check(false, field, "Debe ser un objeto.");
        return;
      }
      check(isNonEmptyText(item.productId, 100), `${field}.productId`, "Indica un identificador de hasta 100 caracteres.");
      check(isPositiveInteger(item.quantity), `${field}.quantity`, "Debe ser un entero mayor que cero.");
    });
  } else {
    check(false, "items", "Incluye al menos un ítem.");
  }
  return details;
}
