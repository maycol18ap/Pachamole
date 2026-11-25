# Pachamole — avance para clase

25 de noviembre de 2026

Pachamole busca organizar los pedidos de una cocina de comida boliviana y mexicana para estudiantes de UDI, Univalle y UCEBOL en Santa Cruz de la Sierra. Los estudiantes podrán elegir su comida y consultar el estado de su pedido. La cocina podrá llevar un registro de los pagos y de lo que debe preparar. [Especificación](../product/SPEC_MVP.md).

## Qué hicimos y qué podemos mostrar

- **Pantalla y servidor.** React construye las pantallas. Express recibe las peticiones y será el encargado de validar los pedidos. Podemos abrir la plantilla inicial y mostrar que `/api/health` devuelve `200` en JSON y que una ruta inexistente devuelve `404`. [Guía de arranque](../../README.md#primer-arranque-en-local).
- **Base de datos.** Diseñamos cómo se relacionan productos, pedidos y pagos. PostgreSQL guarda la información y Prisma permite consultar y escribir en esas tablas desde JavaScript. La primera migración creó las once tablas y sus restricciones en una base local vacía. Podemos mostrar las tablas en clase. La validación en Supabase sigue pendiente. [Modelo](../architecture/MODELO_DATOS_ESTADOS.md) y [guía de Prisma](../../backend/prisma/README.md).
- **Demanda simulada.** Generamos y probamos un CSV de 1.500 filas con volúmenes ficticios por hora y universidad. Podemos regenerarlo con Python y mostrar que la misma semilla reproduce el resultado. Falta entrenar el modelo y comparar su error con una predicción sencilla. [Módulo ML](../../ml/README.md).

## Qué falta para completar un pedido

Falta cargar las universidades y un catálogo de prueba, definir los errores y terminar el contrato de la API. Después podremos conectar el catálogo y el carrito, guardar el pedido y mostrar su seguimiento. Quedan por implementar el QR de la comida, la carga privada del comprobante y la revisión del abono antes de preparar. El envío se coordinará y pagará aparte. [Roadmap](ROADMAP.md) y [estado técnico](ESTADO_ACTUAL.md).

## Guion oral (60–90 segundos)

> Estamos construyendo Pachamole, una aplicación para que estudiantes de UDI, Univalle y UCEBOL puedan pedir comida boliviana y mexicana en Santa Cruz. Queremos que puedan elegir lo que van a comer, indicar dónde recibirlo y ver cómo avanza el pedido.
>
> Hasta ahora dejamos listo el arranque del proyecto. Podemos abrir la pantalla inicial hecha con React y consultar una ruta de Express que nos confirma que el servidor está funcionando. También diseñamos cómo guardar productos, pedidos y pagos. Con Prisma creamos las once tablas en una base local de PostgreSQL y comprobamos que podemos repetir el comando sin duplicarlas.
>
> En paralelo, generamos datos simulados de demanda por universidad y hora. Ya podemos reproducir ese archivo. El entrenamiento del modelo viene después.
>
> Nuestro siguiente paso es cargar productos de prueba, definir cómo responde la API cuando hay errores y conectar el menú con el registro del pedido. Después podremos mostrar el seguimiento y la revisión manual del pago antes de preparar la comida.

## Tres preguntas que podría hacernos el docente

1. **¿Ya se puede hacer un pedido completo?** Todavía falta conectar el catálogo, el carrito y el registro. Hoy podemos mostrar la pantalla inicial, la respuesta del servidor y la base preparada.
2. **¿Qué pasa si alguien sube una foto del comprobante de pago?** En el flujo previsto, la foto deja el pago en revisión. La administración comprueba el abono en el banco antes de confirmarlo.
3. **¿Ya sabemos cuántos pedidos habrá?** Aún estamos en la etapa del conjunto de datos simulado. Falta comparar un modelo con una predicción sencilla usando horas posteriores a las de entrenamiento.
