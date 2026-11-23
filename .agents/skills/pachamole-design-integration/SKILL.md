---
name: pachamole-design-integration
description: Convierte HTML, CSS y JavaScript entregados por Diseño Gráfico en componentes React/Vite de Pachamole, conservando identidad visual y conectándolos gradualmente con Express.
---

# Adaptar diseño a React

1. Leer `frontend/AGENTS.md`, SPEC_MVP, pantalla objetivo y archivos entregados en `design-source/`; si faltan, crear placeholder mínimo, sin inventar diseños aprobados.
2. Documentar el mapeo HTML → componentes JSX, CSS reutilizable, JS DOM → estado/handlers React.
3. Preservar la fuente de Diseño. No reemplazar indiscriminadamente CSS por Tailwind ni introducir UI library sin necesidad.
4. Usar `frontend/src/services` (o estructura ya existente) para acceso a API; respetar contrato Express.
5. Implementar estados loading, vacío, error, formularios accesibles y dispositivo móvil.
6. Probar navegación entre carrito, checkout, confirmar y seguimiento; probar que botón WhatsApp no registra otro pedido.
7. Entregar comparación visual/funcional y notas de divergencias con Diseño.
