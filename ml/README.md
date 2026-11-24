# Módulo ML — Dataset Sintético de Demanda

Este conjunto de datos contiene volúmenes ficticios de pedidos para el análisis experimental de demanda.

## Requisitos

- Python 3.10 o superior
- `pandas`
- `numpy`

## Instalación y generación

Desde la raíz del repositorio, crea un entorno virtual e instala las dependencias.

```bash
python -m venv ml/.venv
source ml/.venv/bin/activate
python -m pip install pandas numpy
```

Ejecuta el generador desde la raíz.

```bash
python ml/src/generate_dataset.py
```

El script escribe [`ml/data/synthetic/demand_data.csv`](data/synthetic/demand_data.csv) en UTF-8. El CSV contiene 1.500 filas, una por cada combinación de universidad y hora en un total de 500 horas consecutivas a partir del 1 de noviembre de 2026 a las 08:00.

## Columnas del CSV

| Columna | Descripción |
| --- | --- |
| `fecha_hora` | Hora local simulada de registro del pedido en `America/La_Paz`, en formato `AAAA-MM-DD HH:MM:SS`. |
| `dia_semana` | Día de la semana en inglés, derivado de `fecha_hora`. |
| `universidad` | Universidad asociada al volumen simulado (`UDI`, `Univalle` o `UCEBOL`). |
| `franja_horaria` | Franja de la hora de registro (`manana`, `tarde` o `noche`). |
| `volumen_pedidos` | Cantidad ficticia de pedidos registrados en esa hora y universidad, como entero no negativo. |
| `tipo_dato` | Etiqueta `sintetico` en todas las filas. |

## Supuestos de la simulación

La semilla fija `42` inicializa el generador de números aleatorios de NumPy. Con las mismas versiones de las dependencias, volver a ejecutar el script reproduce el CSV.

El volumen de pedidos se muestrea con una distribución de Poisson. El promedio entre semana es 9 para `manana` (07:00–11:59), 16 para `tarde` (12:00–17:59) y 6 para `noche` (18:00–06:59). El sábado y el domingo se aplica un factor de 0,6 a esos promedios, con un mínimo de 2. UDI, Univalle y UCEBOL usan la misma distribución en cada hora y reciben un valor simulado por separado.

La simulación cubre las 24 horas del día, por lo que incluye registros fuera del horario de atención de referencia del MVP (11:00–22:00).

## Pruebas

Desde la raíz del repositorio, ejecuta `unittest` con las dependencias del generador instaladas.

```bash
python -m unittest discover -s ml -v
```
