from pathlib import Path
import numpy as np
import pandas as pd

# Semilla fija para que el dataset sea 100 % reproducible
SEED = 42
rng = np.random.default_rng(SEED)

# Ruta de salida: ml/data/synthetic/demand_data.csv
BASE_DIR = Path(__file__).resolve().parents[1]
OUTPUT_PATH = BASE_DIR / "data" / "synthetic" / "demand_data.csv"
OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

# Rango de fechas/horas simuladas
fechas = pd.date_range(start="2026-11-01 08:00:00", periods=500, freq="h")
universidades = ["UDI", "Univalle", "UCEBOL"]

filas = []
for dt in fechas:
    hora = dt.hour
    if 7 <= hora < 12:
        franja_horaria = "manana"
    elif 12 <= hora < 18:
        franja_horaria = "tarde"
    else:
        franja_horaria = "noche"

    es_fin_de_semana = dt.dayofweek >= 5

    for universidad in universidades:
        # Supuestos de simulación: mayor demanda en la tarde y menor en fin de semana
        if franja_horaria == "tarde":
            lam = 16.0
        elif franja_horaria == "manana":
            lam = 9.0
        else:
            lam = 6.0

        if es_fin_de_semana:
            lam = max(2.0, lam * 0.6)

        volumen_pedidos = int(rng.poisson(lam=lam))

        filas.append({
            "fecha_hora": dt.strftime("%Y-%m-%d %H:%M:%S"),
            "dia_semana": dt.day_name(),
            "universidad": universidad,
            "franja_horaria": franja_horaria,
            "volumen_pedidos": volumen_pedidos,
            "tipo_dato": "sintetico",
        })

df = pd.DataFrame(filas)
df.to_csv(OUTPUT_PATH, index=False, encoding="utf-8")

print(f"Archivo generado: {OUTPUT_PATH}")
print(f"Total de filas: {len(df)}")