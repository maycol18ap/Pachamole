#!/usr/bin/env python3
"""Preparar o crear Issues de Pachamole usando gh CLI.

Modo por defecto: simula, NO llama GitHub.
Para aplicar: python3 scripts/crear_issues.py --apply (requiere confirmación CREAR).
Para una fase: python3 scripts/crear_issues.py --fase F0 [--apply].

Requiere gh auth login y ejecutar dentro del repo con remote GitHub.
NO asigna responsables automáticamente ni incorpora Project: son pasos humanos.
"""
from __future__ import annotations
import argparse
import json
import shutil
import subprocess
from pathlib import Path

DATA = Path(__file__).resolve().parents[1] / 'docs/planning/issues.json'

def body(x: dict) -> str:
    checks = '\n'.join('- [ ] ' + s for s in x['criteria'])
    return (f"**ID de planificación:** {x['id']}\n"
            f"**Fase:** {x['phase']} | **Área:** {x['area']} | **Prioridad:** {x['priority']}\n"
            f"**Dependencias (IDs de planificación):** {', '.join(x['depends_on']) or 'ninguna'}\n"
            f"**Ejecutor real:** completar al iniciar.\n"
            f"**Revisor humano:** completar al revisar.\n\n"
            f"### Criterios de aceptación\n{checks}\n\n"
            f"### Prueba negativa\n{x['negative_test']}\n\n"
            f"### Evidencia de pruebas / commits / PR\nPendiente.\n")

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--fase', help='Fase F0..F8, por defecto todas')
    ap.add_argument('--apply', action='store_true', help='Crea Issues realmente tras confirmación')
    a=ap.parse_args()
    arr=json.loads(DATA.read_text(encoding='utf-8'))
    if a.fase:
        arr=[x for x in arr if x['phase'].upper()==a.fase.upper()]
    if not arr:
        raise SystemExit('No hay Issues para esa fase.')
    print(f'Issues seleccionados: {len(arr)}')
    for x in arr:
        print(f"  {x['id']} | {x['area']} | {x['title']}")
    if not a.apply:
        print('SIMULACIÓN. Para CREAR en GitHub ejecutar con --apply. No se modificó GitHub.')
        return
    if shutil.which('gh') is None:
        raise SystemExit('Instala y configura GitHub CLI (gh auth login).')
    subprocess.run(['gh','auth','status'], check=True)
    subprocess.run(['gh','repo','view','--json','nameWithOwner','--jq','.nameWithOwner'],check=True)
    answer=input('Se crearán estos Issues en el repositorio mostrado. Escribe CREAR para continuar: ')
    if answer!='CREAR':
        raise SystemExit('Cancelado. No se crearon Issues.')
    for x in arr:
        title=f"[{x['id']}] {x['title']}"
        result=subprocess.run(['gh','issue','create','--title',title,'--body',body(x)],capture_output=True,text=True)
        if result.returncode:
            print('ERROR creando',title,result.stderr)
            raise SystemExit(1)
        print(title,'=>',result.stdout.strip())
    print('Finalizado. Agrega los Issues al Project manualmente o configura auto-add.')

if __name__=='__main__':
    main()
