"""
Crea una carpeta de misión nueva con una plantilla lista para editar.
Creado por Andrés Felipe Beltrán Barrera

Uso:  python scripts/nueva_mision.py "Título de la misión" --salas 4 --enemigos 5
Crea mision_XX/ con el siguiente número libre. Luego edita mision.json
y ejecuta  python scripts/validar_misiones.py
"""
import argparse
import json
from pathlib import Path

from generar_mapa import generar

BASE = Path(__file__).resolve().parent.parent

ap = argparse.ArgumentParser()
ap.add_argument("titulo")
ap.add_argument("--salas", type=int, default=4)
ap.add_argument("--enemigos", type=int, default=4)
ap.add_argument("--estrellas", type=int, default=3)
a = ap.parse_args()

usados = [int(p.name.split("_")[1]) for p in BASE.glob("mision_*") if p.name.split("_")[1].isdigit()]
n = max(usados, default=0) + 1
carpeta = BASE / f"mision_{n:02d}"
carpeta.mkdir()

plantilla = {
    "orden": n,
    "titulo": a.titulo,
    "sector": f"Sector {n:02d} · Nombre del sector",
    "tema": "Tema de la misión",
    "laboratorio": "Laboratorio en el que se basa",
    "icono": "🛡️",
    "autor": "Andrés Felipe Beltrán Barrera",
    "objetivo": "Qué debe aprender el jugador.",
    "colores": {"piso_a": "#123b25", "piso_b": "#0f3320"},
    "dificultad": {"estrellas": a.estrellas, "vida_enemigo": 2, "dano": 18, "tiempo": 30,
                   "persigue": True, "radio": 3, "velocidad_ms": 700, "dano_guardian": 27},
    "xp": {"por_golpe": 20, "final": 120},
    "guardian": {"nombre": "Guardián", "color": "#e879f9",
                 "historia": ["Primera línea de la historia.", "Segunda línea: qué pasó en el laboratorio."]},
    "pistas": ["Pista 1", "Pista 2", "Pista 3"],
    "enemigos": [{"nombre": "Enemigo 1", "color": "#ef4444", "frase": "¡No pasarás!"},
                 {"nombre": "Enemigo 2", "color": "#f97316", "frase": "Tu sistema es mío."}],
    "retos": [
        {"id": "r1", "pregunta": "Pregunta de combate 1", "opciones": ["Opción A", "Opción B", "Opción C"],
         "correcta": 0, "explicacion": "Por qué la respuesta es correcta."},
        {"id": "r2", "pregunta": "Pregunta de combate 2", "opciones": ["Opción A", "Opción B", "Opción C"],
         "correcta": 1, "explicacion": "Por qué la respuesta es correcta."},
        {"id": "r3", "pregunta": "Pregunta de combate 3", "opciones": ["Opción A", "Opción B", "Opción C"],
         "correcta": 2, "explicacion": "Por qué la respuesta es correcta."},
    ],
    "final": {"pregunta": "Pregunta del guardián", "opciones": ["Opción A", "Opción B", "Opción C"],
              "correcta": 0, "explicacion": "Explicación.", "defensa": "Medida de defensa."},
    "flag": "CAA{NUEVA_MISION}",
    "mapa": generar(a.salas, a.enemigos, nivel=a.estrellas * 2, semilla=n * 13 + 5,
                    poderes={"1": 1, "2": 1, "3": 2, "4": 1}),
}
(carpeta / "mision.json").write_text(json.dumps(plantilla, ensure_ascii=False, indent=2), encoding="utf-8")
(carpeta / "README.md").write_text(f"# Misión {n:02d} — {a.titulo}\n\nEdita `mision.json` y valida con `python scripts/validar_misiones.py`.\n", encoding="utf-8")
print(f"Creada {carpeta.name}. Edita {carpeta.name}/mision.json y reinicia el servidor si no ves los cambios.")
