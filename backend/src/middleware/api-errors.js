export class ValidationError extends Error {
  constructor(details) {
    super("Revisa los campos indicados.");
    this.details = details;
  }
}

const parserErrors = new Map([
  ["entity.parse.failed", [400, "INVALID_JSON", "El cuerpo contiene JSON malformado."]],
  ["entity.too.large", [413, "PAYLOAD_TOO_LARGE", "El cuerpo JSON supera el límite permitido."]],
  ["request.size.invalid", [400, "INVALID_BODY", "El tamaño declarado del cuerpo es inválido."]],
  ["request.aborted", [400, "INVALID_BODY", "La lectura del cuerpo se interrumpió."]],
  ["charset.unsupported", [415, "UNSUPPORTED_ENCODING", "La codificación del cuerpo no es compatible."]],
  ["encoding.unsupported", [415, "UNSUPPORTED_ENCODING", "La codificación del cuerpo no es compatible."]],
]);

export function handleApiError(error, _req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ValidationError) {
    return res.status(422).json({
      error: {
        code: "VALIDATION_ERROR",
        message: error.message,
        details: error.details,
      },
    });
  }

  const [status, code, message] = parserErrors.get(error.type) ??
    [500, "INTERNAL_ERROR", "Ocurrió un error interno."];
  return res.status(status).json({ error: { code, message } });
}
