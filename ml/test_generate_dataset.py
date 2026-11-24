import csv
from pathlib import Path
import shutil
import subprocess
import sys
from tempfile import TemporaryDirectory
import unittest


GENERATOR_PATH = Path("ml/src/generate_dataset.py")
CSV_PATH = Path("ml/data/synthetic/demand_data.csv")
COLUMNS = [
    "fecha_hora",
    "dia_semana",
    "universidad",
    "franja_horaria",
    "volumen_pedidos",
    "tipo_dato",
]
UNIVERSITIES = {"UDI", "Univalle", "UCEBOL"}


class GenerateDatasetTest(unittest.TestCase):
    def generate_csv(self, root):
        source = Path(__file__).resolve().parent / "src" / GENERATOR_PATH.name
        script = root / GENERATOR_PATH
        script.parent.mkdir(parents=True)
        shutil.copyfile(source, script)
        subprocess.run(
            [sys.executable, str(GENERATOR_PATH)],
            cwd=root,
            check=True,
            stdout=subprocess.DEVNULL,
        )
        return root / CSV_PATH

    def assert_valid_rows(self, rows):
        universities_by_hour = {}
        for row in rows:
            hour = row["fecha_hora"]
            university = row["universidad"]
            universities = universities_by_hour.setdefault(hour, set())
            self.assertNotIn(university, universities, f"Fila duplicada: {hour}, {university}")
            universities.add(university)
            self.assertRegex(row["volumen_pedidos"], r"\A[0-9]+\Z")
            self.assertEqual(row["tipo_dato"], "sintetico")

        self.assertTrue(universities_by_hour, "El CSV no tiene filas de datos")
        for hour, universities in universities_by_hour.items():
            self.assertEqual(universities, UNIVERSITIES, f"Universidades en {hour}")

    def test_csv_is_reproducible_and_valid(self):
        with TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            first_csv = self.generate_csv(root / "first")
            second_csv = self.generate_csv(root / "second")
            self.assertEqual(first_csv.read_bytes(), second_csv.read_bytes())

            with first_csv.open(encoding="utf-8", newline="") as csv_file:
                reader = csv.DictReader(csv_file)
                self.assertEqual(reader.fieldnames, COLUMNS)
                self.assert_valid_rows(reader)

    def test_rejects_duplicate_hour_and_university(self):
        rows = [
            {
                "fecha_hora": "2026-11-01 08:00:00",
                "dia_semana": "Sunday",
                "universidad": university,
                "franja_horaria": "manana",
                "volumen_pedidos": "0",
                "tipo_dato": "sintetico",
            }
            for university in ("UDI", "Univalle", "UCEBOL")
        ]
        self.assert_valid_rows(rows)
        with self.assertRaisesRegex(AssertionError, "Fila duplicada"):
            self.assert_valid_rows([*rows, rows[0].copy()])
