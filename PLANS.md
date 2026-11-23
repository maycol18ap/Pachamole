# Planes de ejecución para tareas grandes

Para cambios que afecten dos o más dominios (por ejemplo BD + API + frontend + pagos), **antes de codificar** redacta en el Issue o en `docs/planning/ejecuciones/` un plan corto con:

1. Objetivo y escenario real del usuario.
2. Estado del repositorio encontrado, archivos concretos y dependencias.
3. Contratos/datos que cambiarían; decisiones que necesitan confirmación.
4. Pasos atómicos y verificación tras cada paso.
5. Estrategia de rollback sin perder datos.
6. Riesgos: privacidad, pagos, permisos, migraciones, concurrencia.
7. Criterios de aceptación y lista de pruebas.

No ejecutes cambios irreversibles sin aprobación. Si la tarea es pequeña, basta un plan breve en tu respuesta. Mantén un Issue por cambio funcional.
