"""
Auditoría de misiones — CyberAgent Academy
Creado por Andrés Felipe Beltrán Barrera

Revisa que cada mision_XX/mision.json esté completo y sea jugable:
campos obligatorios, respuestas válidas, mapa rectangular, un solo S/G/X,
y que el jugador pueda llegar a todos los enemigos, al guardián y al portal.

Uso:  python scripts/validar_misiones.py
Guarda el reporte en datos/auditoria_misiones.txt
"""
import json
import sys
from collections import deque
from datetime import datetime
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
CAMPOS = ["orden", "titulo", "sector", "tema", "dificultad", "xp", "guardian", "pistas",
          "enemigos", "retos", "final", "flag", "mapa"]
DIF = ["estrellas", "vida_enemigo", "dano", "tiempo", "persigue", "radio", "velocidad_ms", "dano_guardian"]
SOLIDOS = set("#RDPTNMCUHI")


def alcanzables(mapa, inicio):
    h, w = len(mapa), len(mapa[0])
    vistos, cola = {inicio}, deque([inicio])
    while cola:
        x, y = cola.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in vistos and mapa[ny][nx] not in SOLIDOS and mapa[ny][nx] != "G":
                vistos.add((nx, ny))
                cola.append((nx, ny))
    return vistos


def revisar(carpeta):
    errores, avisos = [], []
    archivo = carpeta / "mision.json"
    if not archivo.exists():
        return ["no existe mision.json"], avisos
    try:
        m = json.loads(archivo.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        return [f"JSON inválido: {e}"], avisos

    for c in CAMPOS:
        if c not in m:
            errores.append(f"falta el campo '{c}'")
    if errores:
        return errores, avisos
    for c in DIF:
        if c not in m["dificultad"]:
            errores.append(f"falta dificultad.{c}")

    for r in m["retos"]:
        n = len(r.get("opciones", []))
        if n < 2:
            errores.append(f"reto {r.get('id')} tiene menos de 2 opciones")
        if not (0 <= r.get("correcta", -1) < n):
            errores.append(f"reto {r.get('id')}: 'correcta' fuera de rango")
    ids = [r.get("id") for r in m["retos"]]
    if len(ids) != len(set(ids)):
        errores.append("hay ids de retos repetidos")
    f = m["final"]
    if not (0 <= f.get("correcta", -1) < len(f.get("opciones", []))):
        errores.append("final: 'correcta' fuera de rango")
    if not m["enemigos"]:
        errores.append("la lista 'enemigos' está vacía")
    if len(m["retos"]) < 3:
        avisos.append("menos de 3 retos: las preguntas se repetirán mucho")

    mapa = m["mapa"]
    if len({len(r) for r in mapa}) != 1:
        errores.append("las filas del mapa no tienen el mismo largo")
        return errores, avisos
    todo = "".join(mapa)
    for ch, nombre in (("S", "inicio"), ("G", "guardián"), ("X", "portal")):
        if todo.count(ch) != 1:
            errores.append(f"el mapa debe tener exactamente un '{ch}' ({nombre}); tiene {todo.count(ch)}")
    validos = set("#.SEGXLRDPTNMCUHIKkg1234")
    raros = set(todo) - validos
    if raros:
        errores.append(f"caracteres desconocidos en el mapa: {''.join(sorted(raros))}")
    if todo.count("E") == 0:
        avisos.append("el mapa no tiene enemigos (E): la puerta del guardián se abrirá sola")
    n_term = todo.count("I")
    if n_term != len(m.get("terminales", [])):
        avisos.append(f"el mapa tiene {n_term} terminales I y el JSON define {len(m.get('terminales', []))} textos")
    if errores:
        return errores, avisos

    pos = {ch: [(x, y) for y, r in enumerate(mapa) for x, c in enumerate(r) if c == ch] for ch in "SGXE1234L"}
    llega = alcanzables(mapa, pos["S"][0])
    for (x, y) in pos["E"]:
        if (x, y) not in llega:
            errores.append(f"enemigo en ({x},{y}) no es alcanzable")
    gx, gy = pos["G"][0]
    if not any((gx + dx, gy + dy) in llega for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
        errores.append("no se puede llegar al lado del guardián")
    if pos["X"][0] not in llega:
        errores.append("el portal X no es alcanzable")
    for (x, y) in [(x, y) for y, r in enumerate(mapa) for x, c in enumerate(r) if c == "I"]:
        if not any((x + dx, y + dy) in llega for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
            errores.append(f"terminal I en ({x},{y}) no se puede leer")
    for k in "1234":
        for p in pos[k]:
            if p not in llega:
                avisos.append(f"poder '{k}' en {p} no es alcanzable")
    return errores, avisos


def main():
    carpetas = sorted(p for p in BASE.glob("mision_*") if p.is_dir())
    lineas = [f"AUDITORÍA DE MISIONES — CyberAgent Academy ({datetime.now():%Y-%m-%d %H:%M})",
              "Creado por Andrés Felipe Beltrán Barrera", ""]
    total_err = 0
    for c in carpetas:
        err, av = revisar(c)
        total_err += len(err)
        lineas.append(f"[{'OK ' if not err else 'ERR'}] {c.name}")
        lineas += [f"      ✕ {e}" for e in err] + [f"      ! {a}" for a in av]
    lineas += ["", f"Misiones revisadas: {len(carpetas)} · Errores: {total_err}"]
    texto = "\n".join(lineas)
    print(texto)
    salida = BASE / "datos" / "auditoria_misiones.txt"
    salida.parent.mkdir(exist_ok=True)
    salida.write_text(texto + "\n", encoding="utf-8")
    sys.exit(1 if total_err else 0)


if __name__ == "__main__":
    main()
