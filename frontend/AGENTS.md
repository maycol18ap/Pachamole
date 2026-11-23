# Frontend — reglas locales

- React + Vite + JavaScript/JSX; prioridad a la fidelidad del HTML/CSS/JS entregado por Diseño.
- Conservar copias originales en `design-source/`; no modificar las fuentes recibidas sin acuerdo.
- Mantener CSS original si es funcional; Tailwind es opcional y no debe introducirse solo por moda.
- Formularios de cliente accesibles, con validación amigable; el backend siempre revalida.
- No poner claves privadas ni QR de acceso bancario personal en código cliente.
- No llamar APIs privilegiadas de Supabase desde React; usar Express.
- La pantalla del pedido solo consulta datos limitados con token opaco; no mostrar datos de otros clientes.
- Botón WhatsApp no crea pedido ni confirma pago; solo abre conversación prellenada.
- Revisar estados de carga/error/reintento y diseño móvil sin romper el lenguaje visual.
