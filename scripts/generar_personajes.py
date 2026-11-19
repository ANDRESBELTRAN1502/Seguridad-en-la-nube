"""
Genera las imágenes de TODOS los personajes de CyberAgent Academy.
Creado por Andrés Felipe Beltrán Barrera

Uso:  python scripts/generar_personajes.py

Salidas en static/img/personajes/:
  sprites/<id>.png          hojas de animación que usa el juego
                            · personas: 64x64 (4 cuadros x 4 direcciones: abajo, izq, der, arriba)
                            · enemigos: 64x16 (4 cuadros de animación)
  galeria/                  retratos grandes con el nombre de cada personaje
     00 - Agente (jugador).png
     guardianes/Nivel 01 - Profesora Ada.png ...
     enemigos/Nivel 01 - Bot Fuerza Bruta.png ...
     TODOS_LOS_PERSONAJES.png
  personajes.json           índice (nombre, tipo, nivel, archivos)

Si reemplazas un PNG de sprites/ por tu propio dibujo (mismo tamaño), el juego lo usa.
Si agregas misiones nuevas, vuelve a ejecutar este script.
"""
import hashlib
import json
import re
import unicodedata
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

BASE = Path(__file__).resolve().parent.parent
OUT = BASE / "static" / "img" / "personajes"
AUTOR = "Andrés Felipe Beltrán Barrera"
OUTLINE = (8, 14, 10, 255)


def slug(t):
    t = unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "_", t).strip("_")


def hexrgb(h, a=255):
    h = h.lstrip("#")
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)


def tono(c, f):
    return tuple(max(0, min(255, int(v * f))) for v in c[:3]) + (255,)


def contorno(img):
    """Agrega un borde oscuro de 1 px alrededor de la silueta (estilo pixel art)."""
    w, h = img.size
    px = img.load()
    nuevo = img.copy()
    q = nuevo.load()
    for y in range(h):
        for x in range(w):
            if px[x, y][3] == 0:
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and px[nx, ny][3] > 0:
                        q[x, y] = OUTLINE
                        break
    return nuevo


def fuente(tam, negrita=True):
    for f in ("DejaVuSans-Bold.ttf" if negrita else "DejaVuSans.ttf",):
        for d in ("/usr/share/fonts/truetype/dejavu/", "C:/Windows/Fonts/", ""):
            try:
                return ImageFont.truetype(d + f, tam)
            except OSError:
                pass
    for f in ("arialbd.ttf", "arial.ttf"):
        try:
            return ImageFont.truetype(f, tam)
        except OSError:
            pass
    return ImageFont.load_default()


# ------------------------------------------------------------------ personas
def persona(pal, dir_, cuadro):
    im = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    r = lambda x, y, w, h, c: d.rectangle([x, y, x + w - 1, y + h - 1], fill=c)
    ropa, pelo, piel, pantalon = pal["ropa"], pal["pelo"], pal["piel"], pal["pantalon"]
    claro, oscuro = tono(ropa, 1.25), tono(ropa, 0.7)
    paso = [0, 1, 0, -1][cuadro]
    bob = 1 if cuadro in (1, 3) else 0
    # piernas
    if dir_ in ("down", "up"):
        r(5, 12 - bob, 2, 3 + (1 if paso > 0 else 0), pantalon)
        r(9, 12 - bob, 2, 3 + (1 if paso < 0 else 0), pantalon)
        r(5, 14 + (1 if paso > 0 else 0) - bob, 2, 1, (30, 30, 30, 255))
        r(9, 14 + (1 if paso < 0 else 0) - bob, 2, 1, (30, 30, 30, 255))
    else:
        r(6 + paso, 12 - bob, 2, 3, pantalon); r(8 - paso, 12 - bob, 2, 3, tono(pantalon, 0.8))
    # torso
    r(4, 7 - bob, 8, 6, ropa); r(4, 7 - bob, 1, 6, claro); r(11, 7 - bob, 1, 6, oscuro)
    if pal.get("jugador"):
        if dir_ != "up":
            r(7, 8 - bob, 2, 3, (57, 255, 122, 255))      # logo verde en el pecho
            r(6, 7 - bob, 1, 5, (40, 40, 40, 255)); r(9, 7 - bob, 1, 5, (40, 40, 40, 255))  # cordones
    else:
        if dir_ != "up":
            r(7, 8 - bob, 2, 4, tono(ropa, 1.45))         # camisa
            if pal.get("insignia"):
                r(9, 8 - bob, 1, 1, (255, 209, 102, 255))
    # brazos (balanceo)
    if dir_ in ("down", "up"):
        r(3, 8 - bob + (1 if paso > 0 else 0), 1, 4, oscuro); r(12, 8 - bob + (1 if paso < 0 else 0), 1, 4, oscuro)
        r(3, 12 - bob + (1 if paso > 0 else 0), 1, 1, piel); r(12, 12 - bob + (1 if paso < 0 else 0), 1, 1, piel)
    else:
        ax = 7 + (paso if dir_ == "right" else -paso)
        r(ax, 8 - bob, 2, 4, oscuro); r(ax, 12 - bob, 2, 1, piel)
    # cabeza
    hy = 1 - bob
    if pal.get("jugador"):
        r(4, hy + 1, 8, 7, (20, 20, 20, 255))              # capucha
        r(5, hy, 6, 2, pelo); r(6, hy - 1 if hy > 0 else 0, 4, 1, pelo)  # copete
        if dir_ != "up":
            r(5, hy + 3, 6, 4, piel)
            ojos = (57, 255, 122, 255)
            if dir_ == "down":
                r(6, hy + 4, 1, 1, ojos); r(9, hy + 4, 1, 1, ojos); r(7, hy + 6, 2, 1, tono(piel, 0.8))
            elif dir_ == "left":
                r(5, hy + 4, 1, 1, ojos); r(7, hy + 4, 1, 1, ojos); r(4, hy + 3, 1, 4, piel)
            else:
                r(8, hy + 4, 1, 1, ojos); r(10, hy + 4, 1, 1, ojos); r(11, hy + 3, 1, 4, piel)
        else:
            r(5, hy + 3, 6, 4, (30, 30, 30, 255))
    else:
        r(5, hy + 1, 6, 6, piel)
        estilo = pal["estilo"]
        r(5, hy, 6, 2, pelo)
        if estilo == "largo":
            r(4, hy + 1, 1, 6, pelo); r(11, hy + 1, 1, 6, pelo)
        elif estilo == "mono":
            r(7, hy - 1 if hy > 0 else 0, 2, 1, pelo); r(6, hy, 4, 1, pelo)
        elif estilo == "gorra":
            r(4, hy, 8, 2, pal["gorra"]); r(3 if dir_ == "left" else 9, hy + 2, 4, 1, pal["gorra"]) if dir_ != "up" else None
        if dir_ == "up":
            r(5, hy + 1, 6, 5, pelo)
        else:
            ojo = (17, 17, 17, 255)
            if dir_ == "down":
                r(6, hy + 3, 1, 1, ojo); r(9, hy + 3, 1, 1, ojo); r(7, hy + 5, 2, 1, tono(piel, 0.75))
                if pal.get("lentes"):
                    r(5, hy + 3, 3, 1, (180, 220, 255, 255)); r(8, hy + 3, 3, 1, (180, 220, 255, 255))
                    r(6, hy + 3, 1, 1, ojo); r(9, hy + 3, 1, 1, ojo)
                if pal.get("barba"):
                    r(5, hy + 5, 6, 2, pelo); r(5, hy + 4, 1, 2, pelo); r(10, hy + 4, 1, 2, pelo)
                    r(6, hy + 5, 4, 1, piel)   # boca entre la barba
            elif dir_ == "left":
                r(5, hy + 3, 1, 1, ojo); r(7, hy + 3, 1, 1, ojo); r(11, hy + 1, 1, 4, pelo)
            else:
                r(8, hy + 3, 1, 1, ojo); r(10, hy + 3, 1, 1, ojo); r(4, hy + 1, 1, 4, pelo)
    return contorno(im)


def hoja_persona(pal):
    hoja = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    for fila, dir_ in enumerate(("down", "left", "right", "up")):
        for c in range(4):
            hoja.paste(persona(pal, dir_, c), (c * 16, fila * 16))
    return hoja


# ------------------------------------------------------------------ enemigos
TIPOS = ["bicho", "virus", "fantasma", "slime", "robot", "ojo"]
PALABRAS = {"fantasma": "fantasma", "sombra": "fantasma", "ciego": "fantasma", "oculto": "fantasma", "oculta": "fantasma",
            "bot": "robot", "admin": "robot", "validador": "robot", "firewall": "robot", "cargador": "robot", "volcador": "robot",
            "eco": "slime", "script": "slime", "codigo": "slime", "comentario": "slime", "galletas": "slime",
            "hash": "virus", "error": "virus", "log": "virus", "contrasena": "virus", "sesion": "virus",
            "url": "ojo", "inspector": "ojo", "curioso": "ojo", "ventana": "ojo", "enlace": "ojo", "notificacion": "ojo"}


def tipo_enemigo(nombre, i):
    for w in slug(nombre).split("_"):
        if w in PALABRAS:
            return PALABRAS[w]
    return TIPOS[i % len(TIPOS)]


def enemigo(tipo, color, c):
    im = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    r = lambda x, y, w, h, col: d.rectangle([x, y, x + w - 1, y + h - 1], fill=col)
    base, claro, osc = color, tono(color, 1.35), tono(color, 0.65)
    blanco, negro, rojo = (255, 255, 255, 255), (15, 15, 15, 255), (255, 43, 74, 255)
    b = [0, -1, 0, 1][c]
    parpadeo = c == 2
    if tipo == "bicho":
        r(5, 1 + b, 1, 3, osc); r(10, 1 + b, 1, 3, osc); r(4, 1 + b, 2, 1, claro); r(10, 1 + b, 2, 1, claro)
        r(3, 4 + b, 10, 8, base); r(2, 6 + b, 12, 4, base); r(4, 4 + b, 8, 1, claro); r(3, 11 + b, 10, 1, osc)
        ey = 6 + b
        if parpadeo:
            r(4, ey + 1, 3, 1, negro); r(9, ey + 1, 3, 1, negro)
        else:
            r(4, ey, 3, 3, blanco); r(9, ey, 3, 3, blanco); r(5, ey + 1, 2, 2, rojo); r(10, ey + 1, 2, 2, rojo)
        r(5, 10 + b, 6, 1, negro); r(6, 10 + b, 1, 1, blanco); r(9, 10 + b, 1, 1, blanco)
        l = c % 2
        r(2, 12, 2, 2 - l, osc); r(6, 12, 1, 3, osc); r(9, 12, 1, 3, osc); r(12, 12, 2, 1 + l, osc)
    elif tipo == "virus":
        r(4, 4, 8, 8, base); r(3, 5, 10, 6, base); r(5, 3, 6, 10, base); r(5, 4, 3, 2, claro)
        picos = [(7, 0), (7, 13), (0, 7), (13, 7), (2, 2), (12, 2), (2, 12), (12, 12)]
        for k, (x, y) in enumerate(picos):
            if (k + c) % 2 == 0:
                r(x, y, 2, 2, claro)
            else:
                r(x + (1 if x < 7 else 0 if x > 7 else 0), y + (1 if y < 7 else 0), 1, 1, osc)
        if parpadeo:
            r(5, 7, 2, 1, negro); r(9, 7, 2, 1, negro)
        else:
            r(5, 6, 2, 2, blanco); r(9, 6, 2, 2, blanco); r(6, 7, 1, 1, rojo); r(10, 7, 1, 1, rojo)
        r(6, 10, 4, 1, negro)
    elif tipo == "fantasma":
        y0 = 2 + b
        r(4, y0, 8, 10, (*base[:3], 220)); r(3, y0 + 2, 10, 8, (*base[:3], 220)); r(5, y0 - 1, 6, 1, (*base[:3], 220))
        for k in range(5):
            if (k + c) % 2 == 0:
                r(3 + k * 2, y0 + 10, 2, 2, (*osc[:3], 220))
        r(5, y0 + 1, 3, 1, claro)
        if not parpadeo:
            r(5, y0 + 3, 2, 3, negro); r(9, y0 + 3, 2, 3, negro); r(5, y0 + 3, 1, 1, rojo); r(9, y0 + 3, 1, 1, rojo)
        else:
            r(5, y0 + 4, 2, 1, negro); r(9, y0 + 4, 2, 1, negro)
        r(7, y0 + 7, 2, 2, negro)
    elif tipo == "slime":
        anch = [0, 1, 0, -1][c]
        r(3 - anch, 7 - b, 10 + 2 * anch, 7 + b, base); r(4 - anch, 5 - b, 8 + 2 * anch, 2, base); r(6, 4 - b, 4, 1, base)
        r(4, 6 - b, 3, 1, claro); r(3 - anch, 13, 10 + 2 * anch, 1, osc)
        if parpadeo:
            r(5, 9, 2, 1, negro); r(9, 9, 2, 1, negro)
        else:
            r(5, 8, 2, 3, blanco); r(9, 8, 2, 3, blanco); r(6, 9, 1, 2, negro); r(10, 9, 1, 2, negro)
        r(7, 12, 2, 1, negro)
    elif tipo == "robot":
        r(7, 0, 2, 2, rojo if c % 2 == 0 else (255, 209, 102, 255)); r(7, 2, 2, 1, (120, 120, 130, 255))
        r(3, 3, 10, 6, base); r(3, 3, 10, 1, claro); r(3, 8, 10, 1, osc)
        r(4, 5, 8, 3, (12, 20, 16, 255))
        if not parpadeo:
            r(5, 6, 2, 1, rojo); r(9, 6, 2, 1, rojo)
        r(4, 9, 8, 4, tono(base, 0.85)); r(6, 10, 4, 2, (57, 255, 122, 255) if c % 2 else (14, 92, 43, 255))
        r(2, 9 + b, 2, 3, osc); r(12, 9 - b, 2, 3, osc)
        r(4, 13, 3, 2, (60, 60, 70, 255)); r(9, 13, 3, 2, (60, 60, 70, 255))
    else:  # ojo flotante
        y0 = 3 + b
        r(3, y0, 10, 8, blanco); r(2, y0 + 2, 12, 4, blanco); r(4, y0 - 1, 8, 1, base); r(3, y0 + 8, 10, 1, base)
        r(2, y0 + 1, 1, 1, base); r(13, y0 + 1, 1, 1, base)
        if parpadeo:
            r(2, y0 + 3, 12, 2, base)
        else:
            px = 6 + [0, 1, 0, -1][c]
            r(px, y0 + 2, 4, 4, base); r(px + 1, y0 + 3, 2, 2, negro); r(px + 1, y0 + 2, 1, 1, blanco)
        r(4, y0 + 10, 1, 2, osc); r(8, y0 + 11, 1, 2, osc); r(11, y0 + 10, 1, 2, osc)
    return contorno(im)


def hoja_enemigo(tipo, color):
    hoja = Image.new("RGBA", (64, 16), (0, 0, 0, 0))
    for c in range(4):
        hoja.paste(enemigo(tipo, color, c), (c * 16, 0))
    return hoja


# ------------------------------------------------------------------ retratos
def retrato(sprite16, nombre, rol, detalle, color):
    W, H = 300, 380
    im = Image.new("RGBA", (W, H), (4, 16, 9, 255))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([4, 4, W - 5, H - 5], 18, outline=(57, 255, 122, 255), width=3)
    d.rounded_rectangle([24, 24, W - 25, 252], 14, fill=(10, 34, 20, 255), outline=hexrgb(color), width=2)
    for y in range(28, 250, 6):
        d.line([28, y, W - 29, y], fill=(16, 46, 28, 255))
    grande = sprite16.resize((192, 192), Image.NEAREST)
    im.alpha_composite(grande, ((W - 192) // 2, 40))
    f1, f2, f3 = fuente(22), fuente(15), fuente(11, False)
    def centrar(texto, y, f, col):
        w = d.textlength(texto, font=f)
        d.text(((W - w) / 2, y), texto, font=f, fill=col)
    nombre_l = nombre if d.textlength(nombre, font=f1) < W - 30 else nombre[:22] + "…"
    centrar(nombre_l, 266, f1, (57, 255, 122, 255))
    centrar(rol, 298, f2, (255, 209, 102, 255))
    centrar(detalle, 322, f3, (190, 230, 205, 255))
    centrar("CyberAgent Academy · " + AUTOR, 350, f3, (127, 184, 148, 255))
    return im


# ------------------------------------------------------------------ principal
def main():
    misiones = []
    for f in sorted(BASE.glob("mision_*/mision.json")):
        m = json.loads(f.read_text(encoding="utf-8"))
        m["_archivo"] = f
        misiones.append(m)
    misiones.sort(key=lambda m: m.get("orden", 999))

    (OUT / "sprites").mkdir(parents=True, exist_ok=True)
    for sub in ("galeria", "galeria/guardianes", "galeria/enemigos"):
        (OUT / sub).mkdir(parents=True, exist_ok=True)
    for viejo in (OUT / "galeria").rglob("*.png"):
        viejo.unlink()

    indice, retratos = [], []

    # jugador
    pal_j = {"jugador": True, "ropa": (24, 24, 24, 255), "pelo": (10, 10, 10, 255), "piel": (224, 162, 122, 255),
             "pantalon": (31, 41, 55, 255)}
    hoja = hoja_persona(pal_j); hoja.save(OUT / "sprites" / "agente.png")
    rt = retrato(hoja.crop((0, 0, 16, 16)), "Agente (jugador)", "Protagonista", "Inspirado en el logo de " + AUTOR, "#39ff7a")
    rt.save(OUT / "galeria" / "00 - Agente (jugador).png"); retratos.append(rt)
    indice.append({"id": "agente", "nombre": "Agente (jugador)", "tipo": "jugador", "nivel": None,
                   "sprite": "sprites/agente.png", "retrato": "galeria/00 - Agente (jugador).png",
                   "descripcion": "Tú: el agente de capucha negra y ojos verdes."})

    # ---- personajes SELECCIONABLES por el jugador (género + estilo) ----
    OPCIONES = [
        {"id": "jug_m1", "nombre": "Encapuchado", "genero": "m",
         "pal": {"jugador": True, "ropa": (24, 24, 24, 255), "pelo": (10, 10, 10, 255), "piel": (224, 162, 122, 255), "pantalon": (31, 41, 55, 255)}},
        {"id": "jug_m2", "nombre": "Analista", "genero": "m",
         "pal": {"ropa": (37, 99, 235, 255), "pelo": (40, 28, 18, 255), "piel": (224, 162, 122, 255), "pantalon": (30, 41, 59, 255), "estilo": "corto", "lentes": True}},
        {"id": "jug_m3", "nombre": "Técnico", "genero": "m",
         "pal": {"ropa": (16, 185, 129, 255), "pelo": (20, 20, 20, 255), "piel": (198, 134, 96, 255), "pantalon": (40, 40, 40, 255), "estilo": "gorra", "gorra": (10, 80, 50, 255)}},
        {"id": "jug_f1", "nombre": "Encapuchada", "genero": "f",
         "pal": {"jugador": True, "ropa": (124, 58, 237, 255), "pelo": (30, 20, 40, 255), "piel": (240, 190, 150, 255), "pantalon": (31, 41, 55, 255)}},
        {"id": "jug_f2", "nombre": "Analista", "genero": "f",
         "pal": {"ropa": (13, 148, 136, 255), "pelo": (60, 36, 18, 255), "piel": (224, 162, 122, 255), "pantalon": (30, 41, 59, 255), "estilo": "largo", "lentes": True}},
        {"id": "jug_f3", "nombre": "Técnica", "genero": "f",
         "pal": {"ropa": (236, 72, 153, 255), "pelo": (200, 160, 80, 255), "piel": (240, 190, 150, 255), "pantalon": (40, 40, 40, 255), "estilo": "largo"}},
    ]
    for op in OPCIONES:
        hoja = hoja_persona(op["pal"]); hoja.save(OUT / "sprites" / f"{op['id']}.png")
        indice.append({"id": op["id"], "nombre": op["nombre"], "tipo": "jugador_opcion",
                       "genero": op["genero"], "sprite": f"sprites/{op['id']}.png",
                       "descripcion": f"Personaje seleccionable ({'masculino' if op['genero']=='m' else 'femenino'})."})

    pelos = [(59, 36, 18, 255), (20, 20, 20, 255), (120, 72, 30, 255), (200, 160, 80, 255), (90, 50, 40, 255), (230, 230, 230, 255)]
    pieles = [(224, 162, 122, 255), (198, 134, 96, 255), (240, 190, 150, 255), (160, 105, 72, 255)]
    estilos = ["corto", "largo", "mono", "gorra", "corto", "largo"]

    for n, m in enumerate(misiones, 1):
        cambios = False
        g = m["guardian"]
        gid = g.get("sprite") or slug(g["nombre"])
        if g.get("sprite") != gid:
            g["sprite"] = gid; cambios = True
        h = int(hashlib.md5(g["nombre"].encode()).hexdigest(), 16)
        pal = {"ropa": hexrgb(g["color"]), "pelo": pelos[h % len(pelos)], "piel": pieles[(h >> 4) % len(pieles)],
               "pantalon": (40, 44, 60, 255), "estilo": estilos[(h >> 8) % len(estilos)], "gorra": tono(hexrgb(g["color"]), 0.6),
               "lentes": (h >> 12) % 3 == 0, "insignia": True}
        if gid == "profesor_fabian":   # el docente: gafas, barba y bata, para que se reconozca
            pal.update({"lentes": True, "barba": True, "estilo": "corto",
                        "pelo": (38, 28, 20, 255), "ropa": (235, 240, 245, 255), "piel": (232, 180, 140, 255)})
        hoja = hoja_persona(pal); hoja.save(OUT / "sprites" / f"{gid}.png")
        archivo = f"galeria/guardianes/Nivel {n:02d} - {g['nombre']}.png"
        rt = retrato(hoja.crop((0, 0, 16, 16)), g["nombre"], f"Guardián · Nivel {n:02d}", m["titulo"], g["color"])
        rt.save(OUT / archivo); retratos.append(rt)
        indice.append({"id": gid, "nombre": g["nombre"], "tipo": "guardian", "nivel": n, "mision": m["titulo"],
                       "sprite": f"sprites/{gid}.png", "retrato": archivo, "descripcion": m["sector"]})

        for i, e in enumerate(m["enemigos"]):
            eid = e.get("sprite") or slug(e["nombre"])
            if e.get("sprite") != eid:
                e["sprite"] = eid; cambios = True
            tipo = e.get("tipo") or tipo_enemigo(e["nombre"], i)
            hoja = hoja_enemigo(tipo, hexrgb(e["color"])); hoja.save(OUT / "sprites" / f"{eid}.png")
            archivo = f"galeria/enemigos/Nivel {n:02d} - {e['nombre']}.png"
            rt = retrato(hoja.crop((0, 0, 16, 16)), e["nombre"], f"Enemigo · Nivel {n:02d} · {tipo}", "«" + e["frase"] + "»", e["color"])
            rt.save(OUT / archivo); retratos.append(rt)
            indice.append({"id": eid, "nombre": e["nombre"], "tipo": "enemigo", "clase": tipo, "nivel": n,
                           "mision": m["titulo"], "frase": e["frase"], "sprite": f"sprites/{eid}.png", "retrato": archivo})

        if cambios:
            datos = {k: v for k, v in m.items() if k != "_archivo"}
            m["_archivo"].write_text(json.dumps(datos, ensure_ascii=False, indent=2), encoding="utf-8")

    # lámina con todos
    cols = 8
    filas = -(-len(retratos) // cols)
    esc = 0.5
    cw, ch = int(300 * esc), int(380 * esc)
    lam = Image.new("RGBA", (cols * cw + 40, filas * ch + 110), (2, 10, 5, 255))
    d = ImageDraw.Draw(lam)
    d.text((20, 18), "CYBERAGENT ACADEMY — TODOS LOS PERSONAJES", font=fuente(30), fill=(57, 255, 122, 255))
    d.text((20, 60), f"Creado por {AUTOR} · {len(retratos)} personajes", font=fuente(16, False), fill=(190, 230, 205, 255))
    for k, rt in enumerate(retratos):
        lam.alpha_composite(rt.resize((cw, ch), Image.LANCZOS), (20 + (k % cols) * cw, 95 + (k // cols) * ch))
    lam.convert("RGB").save(OUT / "galeria" / "TODOS_LOS_PERSONAJES.png", optimize=True)

    (OUT / "personajes.json").write_text(json.dumps(indice, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Listo: {len(indice)} personajes → static/img/personajes/ (sprites, galeria, personajes.json)")


if __name__ == "__main__":
    main()
