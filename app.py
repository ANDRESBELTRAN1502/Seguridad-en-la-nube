"""
CyberAgent Academy — Servidor Flask
Creado por Andrés Felipe Beltrán Barrera
Universidad de Cundinamarca · Ingeniería de Sistemas · Ética Hacking 901N

Cada carpeta mision_XX/ es un nivel. El servidor las detecta solas:
agrega una carpeta nueva y aparece en el juego; quítala y desaparece.
Las respuestas correctas se validan aquí, nunca se envían al navegador.
"""
import json
import random
import sqlite3
from datetime import datetime
from pathlib import Path

from flask import Flask, abort, jsonify, render_template, request

BASE = Path(__file__).resolve().parent
DB_PATH = BASE / "datos" / "cyberagent.db"
AUTOR = "Andrés Felipe Beltrán Barrera"

app = Flask(__name__)


# --------------------------------------------------------------------------
# Misiones
# --------------------------------------------------------------------------
def cargar_misiones():
    """Lee todas las carpetas mision_*/mision.json ordenadas por 'orden'."""
    misiones = []
    for archivo in sorted(BASE.glob("mision_*/mision.json")):
        try:
            data = json.loads(archivo.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as e:
            app.logger.error("No se pudo leer %s: %s", archivo, e)
            continue
        data["id"] = archivo.parent.name
        misiones.append(data)
    misiones.sort(key=lambda m: (m.get("orden", 999), m["id"]))
    return misiones


def buscar_mision(mid):
    for m in cargar_misiones():
        if m["id"] == mid:
            return m
    abort(404, description="Misión no encontrada")


def contar_enemigos(m):
    return sum(fila.count("E") for fila in m["mapa"])


def xp_maximo(m):
    vida = m["dificultad"]["vida_enemigo"]
    terminales = sum(fila.count("I") for fila in m["mapa"])
    return (contar_enemigos(m) * vida * m["xp"]["por_golpe"] + m["xp"]["final"]
            + terminales * m["xp"].get("terminal", 0))


def resumen(m):
    return {"id": m["id"], "orden": m.get("orden"), "titulo": m["titulo"], "sector": m["sector"],
            "tema": m["tema"], "icono": m.get("icono", "🛡️"), "estrellas": m["dificultad"]["estrellas"],
            "enemigos": contar_enemigos(m), "xp_max": xp_maximo(m)}


def sin_respuestas(m):
    """Copia de la misión sin los índices correctos (lo que ve el navegador)."""
    publica = json.loads(json.dumps(m))
    for r in publica["retos"]:
        r.pop("correcta", None)
        r.pop("explicacion", None)
    for campo in ("correcta", "explicacion", "defensa"):
        publica["final"].pop(campo, None)
    publica.pop("flag", None)
    return publica


def buscar_reto(m, reto_id):
    if reto_id == "final":
        return m["final"]
    for r in m["retos"]:
        if r["id"] == reto_id:
            return r
    abort(404, description="Reto no encontrado")


# --------------------------------------------------------------------------
# Base de datos (SQLite en datos/)
# --------------------------------------------------------------------------
def db():
    DB_PATH.parent.mkdir(exist_ok=True)
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    con.executescript("""
        CREATE TABLE IF NOT EXISTS agentes (id TEXT PRIMARY KEY, nombre TEXT, creado TEXT);
        CREATE TABLE IF NOT EXISTS completadas (
            agente TEXT, mision TEXT, xp INTEGER, fecha TEXT, PRIMARY KEY (agente, mision));
        CREATE TABLE IF NOT EXISTS respuestas (
            agente TEXT, mision TEXT, reto TEXT, opcion INTEGER, correcta INTEGER, fecha TEXT);
    """)
    return con


def ahora():
    return datetime.now().isoformat(timespec="seconds")


def registrar_agente(con, agente, nombre):
    if not agente:
        return
    nombre = (nombre or "Agente")[:24]
    con.execute("INSERT INTO agentes (id, nombre, creado) VALUES (?,?,?) "
                "ON CONFLICT(id) DO UPDATE SET nombre=excluded.nombre", (agente[:64], nombre, ahora()))


# --------------------------------------------------------------------------
# Vistas
# --------------------------------------------------------------------------
@app.context_processor
def autor():
    return {"AUTOR": AUTOR}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/ranking")
def ranking():
    return render_template("ranking.html", filas=datos_ranking(), total=len(cargar_misiones()))


@app.route("/personajes")
def personajes():
    archivo = BASE / "static" / "img" / "personajes" / "personajes.json"
    lista = json.loads(archivo.read_text(encoding="utf-8")) if archivo.exists() else []
    return render_template("personajes.html", personajes=lista)


PISTAS_MUSICA = ("titulo", "exploracion", "combate", "jefe", "victoria", "derrota")


@app.get("/api/musica")
def api_musica():
    """Lista los MP3/OGG propios que el usuario puso en static/musica/."""
    carpeta = BASE / "static" / "musica"
    encontrados = []
    for pista in PISTAS_MUSICA:
        for ext in ("mp3", "ogg", "wav"):
            if (carpeta / f"{pista}.{ext}").exists():
                encontrados.append({"pista": pista, "url": f"/static/musica/{pista}.{ext}"})
                break
    return jsonify(encontrados)


@app.route("/creditos")
def creditos():
    return render_template("creditos.html", misiones=[resumen(m) for m in cargar_misiones()])


# --------------------------------------------------------------------------
# API
# --------------------------------------------------------------------------
@app.get("/api/misiones")
def api_misiones():
    return jsonify([resumen(m) for m in cargar_misiones()])


@app.get("/api/mision/<mid>")
def api_mision(mid):
    return jsonify(sin_respuestas(buscar_mision(mid)))


@app.post("/api/responder")
def api_responder():
    d = request.get_json(silent=True) or {}
    m = buscar_mision(str(d.get("mision", "")))
    reto = buscar_reto(m, str(d.get("reto", "")))
    try:
        opcion = int(d.get("opcion"))
    except (TypeError, ValueError):
        abort(400, description="Opción inválida")
    ok = opcion == reto["correcta"]
    resp = {"correcta": ok, "explicacion": reto.get("explicacion", "")}

    con = db()
    agente = str(d.get("agente", ""))[:64]
    registrar_agente(con, agente, d.get("nombre"))
    con.execute("INSERT INTO respuestas VALUES (?,?,?,?,?,?)",
                (agente, m["id"], str(d.get("reto")), opcion, int(ok), ahora()))
    if ok and d.get("reto") == "final":
        resp.update({"defensa": m["final"].get("defensa", ""), "flag": m["flag"]})
        xp = int(d.get("xp_nivel") or 0)
        xp = max(0, min(xp, xp_maximo(m)))
        con.execute("INSERT INTO completadas VALUES (?,?,?,?) ON CONFLICT(agente, mision) "
                    "DO UPDATE SET xp=max(xp, excluded.xp), fecha=excluded.fecha", (agente, m["id"], xp, ahora()))
    con.commit()
    con.close()
    return jsonify(resp)


@app.post("/api/descartar")
def api_descartar():
    """Poder Escáner: devuelve una opción incorrecta para tacharla."""
    d = request.get_json(silent=True) or {}
    m = buscar_mision(str(d.get("mision", "")))
    reto = buscar_reto(m, str(d.get("reto", "")))
    excluidas = set(int(x) for x in d.get("excluidas", []) if str(x).lstrip("-").isdigit())
    malas = [i for i in range(len(reto["opciones"])) if i != reto["correcta"] and i not in excluidas]
    return jsonify({"descartar": random.choice(malas) if malas else None})


def datos_ranking():
    con = db()
    filas = con.execute("""
        SELECT a.nombre, COUNT(c.mision) AS misiones, COALESCE(SUM(c.xp),0) AS xp, MAX(c.fecha) AS ultima
        FROM agentes a JOIN completadas c ON c.agente = a.id
        GROUP BY a.id ORDER BY misiones DESC, xp DESC, ultima ASC LIMIT 50""").fetchall()
    con.close()
    return [dict(f) for f in filas]


@app.get("/api/ranking")
def api_ranking():
    return jsonify(datos_ranking())


@app.errorhandler(404)
def no_encontrado(e):
    if request.path.startswith("/api/"):
        return jsonify({"error": getattr(e, "description", "No encontrado")}), 404
    return render_template("creditos.html", misiones=[], error="Página no encontrada"), 404


if __name__ == "__main__":
    print(f"CyberAgent Academy — creado por {AUTOR}")
    print("Abre http://127.0.0.1:5000 en tu navegador")
    app.run(debug=True)
