---
name: pachamole-review
description: Revisa un diff o Pull Request de Pachamole buscando defectos funcionales, incumplimiento del MVP, problemas de seguridad, regresiones de API y pruebas faltantes. Usar antes de fusionar o al pedir auditoría.
---

# Revisión orientada a riesgos

1. Obtener diff real contra la rama base. Si no hay diff, solicitarlo o indicar imposibilidad de revisar.
2. Identificar rutas expuestas, superficie de datos, cambio de schema, cambios de estado y errores de concurrencia.
3. Verificar: QR imagen nunca se autoaprueba, solo admin confirma tras banco; tokens de seguimiento opacos; idempotencia; auth; comprobantes privados; ningún secreto o PII en logs.
4. Verificar que CSS de Diseño no se rompió, que los tests existen y que se ejecutaron con salida visible.
5. Reportar hallazgos por severidad: crítico, alto, medio, bajo; incluir archivo/línea, escenario y corrección concreta. Evitar opiniones sobre estilo como defectos si linter ya las cubre.
6. No modificar código inicialmente, salvo solicitud explícita. Los controles automáticos/PR humanos siguen siendo necesarios.
