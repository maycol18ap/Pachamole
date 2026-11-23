---
name: pachamole-data-ml
description: Crea o evalúa el experimento de predicción de demanda y analítica académica de Pachamole con Python, datos sintéticos reproducibles, baseline, métricas y prevención de fuga temporal.
---

# Workflow ML del proyecto

1. Leer `docs/product/SPEC_MVP.md` y `docs/quality/METRICAS.md`; verificar archivos existentes en `ml/`.
2. Definir pregunta predictiva y variables observables: universidad, fecha/hora, día de semana y demandas simuladas.
3. Crear generador de datos sintéticos **reproducible** con semilla, comentarios de supuestos, CSV pequeño; no simular «datos reales».
4. Establecer baseline ingenuo antes del modelo avanzado; separar entrenamiento y evaluación por orden temporal, no mezclar futuro con pasado.
5. Entrenar método simple de scikit-learn, registrar MAE/RMSE, error por segmento, intervalos de muestra si aporta valor.
6. Documentar ejecución desde cero, versiones, formato del dataset, cómo reproducir y limitaciones. Nunca afirmar rendimiento en mercado real.
7. Si se expone un predictor a Express, debe ser opcional y no bloquear checkout; proponer contrato antes de crear servicio.
