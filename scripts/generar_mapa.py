"""
Generador de mapas para CyberAgent Academy.
Creado por Andrés Felipe Beltrán Barrera.

Crea un mapa ASCII de salas conectadas en serpiente (4 salas por fila).
Cada sala recibe un tema de sistemas: centro de datos, oficina de TI,
NOC (centro de monitoreo), cuarto de red o núcleo de datos.
La última sala es la del guardián; su puerta (L) se abre al vencer a todos.

Uso:
    python scripts/generar_mapa.py --salas 6 --enemigos 6 --nivel 4 --semilla 7

Leyenda del mapa:
  Estructura:  #  pared   .  piso   L  puerta sellada
  Personajes:  S  inicio  E  enemigo   G  guardián   X  portal
  Poderes:     1 escudo   2 escáner   3 parche   4 turbo
  Equipos (sólidos):
               R  rack de servidores      N  switch / router de red
               D  escritorio con PC       T  terminal
               M  muro de monitores       C  unidad de enfriamiento
               U  UPS / baterías          H  núcleo de datos
               P  planta                  I  terminal de información (se lee con E)
  Decoración (se camina encima):
               k  cableado en el piso     g  rejilla de ventilación
"""
import argparse
import random
from collections import deque

ROOM_W, ROOM_H = 9, 8          # incluye una pared compartida
COLS_MAX = 4
SOLIDOS = set("#RDPTNMCUHI")
PISO = set(".kg")


def _vecinos(x, y):
    return ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1))


def _conectado(grid, desde):
    h, w = len(grid), len(grid[0])
    vistos, cola = {desde}, deque([desde])
    while cola:
        x, y = cola.popleft()
        for nx, ny in _vecinos(x, y):
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in vistos and grid[ny][nx] not in SOLIDOS:
                vistos.add((nx, ny))
                cola.append((nx, ny))
    libres = {(x, y) for y in range(h) for x in range(w) if grid[y][x] not in SOLIDOS}
    return libres <= vistos


def posicion_sala(i, salas):
    cols = min(COLS_MAX, salas)
    f = i // cols
    c = i % cols if f % 2 == 0 else cols - 1 - (i % cols)
    return c, f, cols


def generar(salas=3, enemigos=3, nivel=1, semilla=1, poderes=None, terminales=2):
    rnd = random.Random(semilla)
    poderes = poderes or {"1": 1, "2": 1, "3": 1, "4": 0}
    cols = min(COLS_MAX, salas)
    filas = -(-salas // cols)
    w, h = cols * ROOM_W + 1, filas * ROOM_H + 1

    for _intento in range(600):
        g = [["#"] * w for _ in range(h)]
        origen = []
        for i in range(salas):
            c, f, _ = posicion_sala(i, salas)
            ox, oy = c * ROOM_W, f * ROOM_H
            origen.append((ox, oy))
            for y in range(oy + 1, oy + ROOM_H):
                for x in range(ox + 1, ox + ROOM_W):
                    g[y][x] = "."

        protegidas = set()
        for i in range(salas - 1):
            (ax, ay), (bx, by) = origen[i], origen[i + 1]
            ch = "L" if i == salas - 2 else "."
            if ay == by:
                xw = max(ax, bx)
                dy = rnd.randint(2, ROOM_H - 3)
                for yy in (ay + dy, ay + dy + 1):
                    g[yy][xw] = ch
                    protegidas |= {(xw + d, yy) for d in (-2, -1, 1, 2)}
            else:
                dx = rnd.randint(2, ROOM_W - 3)
                yw = max(ay, by)
                for xx in (ax + dx, ax + dx + 1):
                    g[yw][xx] = ch
                    protegidas |= {(xx, yw + d) for d in (-2, -1, 1, 2)}

        def dentro(s):
            ox, oy = origen[s]
            return [(x, y) for y in range(oy + 1, oy + ROOM_H) for x in range(ox + 1, ox + ROOM_W)]

        def poner(x, y, ch):
            if g[y][x] == "." and (x, y) not in protegidas:
                g[y][x] = ch
                return True
            return False

        inicio = (origen[0][0] + 2, origen[0][1] + ROOM_H - 2)
        protegidas |= {inicio, (inicio[0] + 1, inicio[1]), (inicio[0], inicio[1] - 1)}
        gx, gy = origen[-1][0] + ROOM_W // 2, origen[-1][1] + 4
        px, py = gx, gy - 2
        protegidas |= {(gx + dx, gy + dy) for dx in (-1, 0, 1) for dy in (-1, 0, 1)} | {(px, py), (px, py - 1)}

        # --- decoración temática por sala ---
        temas = ["datacenter", "oficina", "noc", "red", "nucleo"]
        for s in range(salas):
            ox, oy = origen[s]
            tema = "guardian" if s == salas - 1 else rnd.choice(temas)
            if tema == "datacenter":
                for col in (ox + 2, ox + 6):
                    hueco = rnd.randint(oy + 2, oy + 5)
                    for y in range(oy + 2, oy + 6):
                        if y != hueco:
                            poner(col, y, rnd.choice("RRRN"))
                poner(ox + 1, oy + 1, "C"); poner(ox + 7, oy + 1, "U")
            elif tema == "oficina":
                for (x, y) in [(ox + 2, oy + 2), (ox + 3, oy + 2), (ox + 5, oy + 2), (ox + 6, oy + 2),
                               (ox + 2, oy + 5), (ox + 3, oy + 5), (ox + 5, oy + 5), (ox + 6, oy + 5)]:
                    if rnd.random() < 0.8:
                        poner(x, y, "D")
                poner(ox + 1, oy + 1, "P"); poner(ox + 7, oy + ROOM_H - 1, "P")
            elif tema == "noc":
                for x in range(ox + 2, ox + 7):
                    poner(x, oy + 1, "M")
                for x in (ox + 2, ox + 4, ox + 6):
                    poner(x, oy + 3, "D")
                poner(ox + 1, oy + 6, "T"); poner(ox + 7, oy + 6, "T")
            elif tema == "red":
                for x in range(ox + 1, ox + 8, 2):
                    poner(x, oy + 1, "N")
                for x in range(ox + 1, ox + 8):
                    poner(x, oy + 4, "k")
                for y in range(oy + 2, oy + 7):
                    poner(ox + 4, y, "k")
                poner(ox + 7, oy + 6, "U"); poner(ox + 1, oy + 6, "R")
            elif tema == "nucleo":
                poner(ox + 4, oy + 3, "H")
                for (x, y) in [(ox + 1, oy + 1), (ox + 7, oy + 1), (ox + 1, oy + 6), (ox + 7, oy + 6)]:
                    poner(x, y, rnd.choice("CU"))
                for x in (ox + 3, ox + 5):
                    poner(x, oy + 5, "g")
            else:  # sala del guardián
                for x in range(ox + 2, ox + 7):
                    poner(x, oy + 1, "M")
                for (x, y) in [(ox + 1, oy + 1), (ox + 7, oy + 1), (ox + 1, oy + 6), (ox + 7, oy + 6)]:
                    poner(x, y, "R")
                for x in range(ox + 2, ox + 7):
                    poner(x, oy + ROOM_H - 1, "g")
            # obstáculos sueltos extra según el nivel
            libres = [c for c in dentro(s) if g[c[1]][c[0]] == "." and c not in protegidas]
            rnd.shuffle(libres)
            for (x, y) in libres[: nivel // 3]:
                g[y][x] = rnd.choice("RDTNP")

        if not _conectado(g, inicio):
            continue
        g[inicio[1]][inicio[0]] = "S"
        g[gy][gx] = "G"
        g[py][px] = "X"

        # --- terminales de información (I) pegadas a una pared ---
        salas_t = list(range(salas - 1))
        rnd.shuffle(salas_t)
        puestas = 0
        for s in salas_t:
            if puestas >= terminales:
                break
            cand = [(x, y) for (x, y) in dentro(s) if g[y][x] == "." and (x, y) not in protegidas
                    and (g[y - 1][x] == "#" or g[y + 1][x] == "#")]
            rnd.shuffle(cand)
            for (x, y) in cand:
                g[y][x] = "I"
                if _conectado(g, inicio) and any(g[ny][nx] in PISO for nx, ny in _vecinos(x, y)):
                    puestas += 1
                    break
                g[y][x] = "."
        if puestas < terminales:
            continue

        # --- enemigos repartidos en las salas antes del guardián ---
        salas_e = list(range(1, salas - 1)) or [0]
        por_sala = {s: [c for c in dentro(s) if g[c[1]][c[0]] in PISO
                        and abs(c[0] - inicio[0]) + abs(c[1] - inicio[1]) > 4] for s in range(salas)}
        for s in por_sala:
            rnd.shuffle(por_sala[s])
        orden, k = [], 0
        while len(orden) < enemigos and any(por_sala[s] for s in salas_e + [0]):
            fuente = salas_e if any(por_sala[t] for t in salas_e) else [0]
            s = fuente[k % len(fuente)]
            if por_sala[s]:
                orden.append(por_sala[s].pop())
            k += 1
        if len(orden) < enemigos:
            continue
        for (x, y) in orden:
            g[y][x] = "E"

        # --- poderes ---
        resto = [c for s in range(salas - 1) for c in dentro(s) if g[c[1]][c[0]] == "."]
        rnd.shuffle(resto)
        for ch, n in poderes.items():
            for _ in range(n):
                if resto:
                    x, y = resto.pop()
                    g[y][x] = ch
        return ["".join(r) for r in g]
    raise RuntimeError("No se pudo generar un mapa conectado; cambia la semilla.")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Genera un mapa ASCII para una misión")
    ap.add_argument("--salas", type=int, default=4)
    ap.add_argument("--enemigos", type=int, default=4)
    ap.add_argument("--nivel", type=int, default=1)
    ap.add_argument("--semilla", type=int, default=1)
    ap.add_argument("--terminales", type=int, default=2)
    a = ap.parse_args()
    print("\n".join(generar(a.salas, a.enemigos, a.nivel, a.semilla, terminales=a.terminales)))
