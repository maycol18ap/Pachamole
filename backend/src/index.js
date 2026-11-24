import "dotenv/config";
import app from "./app.js";

const configuredPort = process.env.PORT ?? "3000";
const port = Number(configuredPort);

if (configuredPort === "" || /\D/.test(configuredPort) || port < 1 || port > 65535) {
  console.error("PORT inválido: debe ser un entero decimal entre 1 y 65535.");
  process.exit(1);
}

app.listen(port, (error) => {
  if (error) {
    console.error("No se pudo iniciar la API en el puerto %d (%s).", port, error.code);
    process.exitCode = 1;
    return;
  }

  console.log("API disponible en http://localhost:%d", port);
});
