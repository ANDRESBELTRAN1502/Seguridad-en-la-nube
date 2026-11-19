"""
Genera el Excel del instructor y la guía de niveles a partir de las carpetas mision_XX.
Creado por Andrés Felipe Beltrán Barrera

Uso:  python scripts/generar_excel.py
Salidas:
  datos/CyberAgent_Academy_Historias_y_Respuestas.xlsx
  docs/GUIA_NIVELES.md
Si cambias una misión, vuelve a ejecutarlo y todo queda actualizado.
"""
import json
from pathlib import Path

from openpyxl import Workbook
from openpyxl.drawing.image import Image as XLImage
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

BASE = Path(__file__).resolve().parent.parent
AUTOR = "Andrés Felipe Beltrán Barrera"
L = "ABCD"
F = "Arial"
H_FILL = PatternFill("solid", fgColor="0B3A1C")
T_FILL = PatternFill("solid", fgColor="020A05")
ALT = PatternFill("solid", fgColor="EAF7EF")
OK = PatternFill("solid", fgColor="C6F6D5")
thin = Side(style="thin", color="9CC9AE")
BOX = Border(left=thin, right=thin, top=thin, bottom=thin)
WRAP = Alignment(wrap_text=True, vertical="top")


def cargar():
    ms = []
    for f in sorted(BASE.glob("mision_*/mision.json")):
        m = json.loads(f.read_text(encoding="utf-8"))
        m["id"] = f.parent.name
        m["n_enemigos"] = sum(r.count("E") for r in m["mapa"])
        m["n_poderes"] = {k: sum(r.count(k) for r in m["mapa"]) for k in "1234"}
        m["salas"] = None
        ms.append(m)
    return sorted(ms, key=lambda m: m.get("orden", 999))


def titulo(ws, texto, span):
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=span)
    c = ws.cell(row=1, column=1, value=texto)
    c.font = Font(name=F, bold=True, size=16, color="39FF7A"); c.fill = T_FILL
    c.alignment = Alignment(vertical="center"); ws.row_dimensions[1].height = 34
    ws.merge_cells(start_row=2, start_column=1, end_row=2, end_column=span)
    c = ws.cell(row=2, column=1, value=f"CyberAgent Academy · Creado por {AUTOR} · Universidad de Cundinamarca · Ética Hacking 901N")
    c.font = Font(name=F, italic=True, color="7FB894"); c.fill = T_FILL


def encabezado(ws, fila, cols):
    for i, t in enumerate(cols, 1):
        c = ws.cell(row=fila, column=i, value=t)
        c.font = Font(name=F, bold=True, color="39FF7A"); c.fill = H_FILL; c.border = BOX
        c.alignment = Alignment(wrap_text=True, vertical="center", horizontal="center")
    ws.row_dimensions[fila].height = 34


def celda(ws, r, c, v, fill=None, bold=False, color=None):
    x = ws.cell(row=r, column=c, value=v)
    x.font = Font(name=F, bold=bold, size=10, color=color); x.alignment = WRAP; x.border = BOX
    if fill:
        x.fill = fill
    return x


def anchos(ws, w):
    for i, v in enumerate(w, 1):
        ws.column_dimensions[get_column_letter(i)].width = v


def paso_a_paso(m, i, ms):
    d = m["dificultad"]
    sig = f"pasas al nivel {i + 2}: {ms[i + 1]['titulo']}" if i + 1 < len(ms) else "recibes el certificado de Agente Élite"
    return [
        f"1. En el mapa de niveles elige el nivel {i + 1} y pulsa COMENZAR MISIÓN.",
        f"2. Explora las salas y recoge poderes: 🛡 Escudo ({m['n_poderes']['1']}), 🔍 Escáner ({m['n_poderes']['2']}), "
        f"💊 Parche ({m['n_poderes']['3']}), ⚡ Turbo ({m['n_poderes']['4']}). Empiezas con 1 Escáner y 1 Parche.",
        f"3. Choca con cada enemigo para combatir. Hay {m['n_enemigos']} y cada uno necesita {d['vida_enemigo']} respuesta(s) correcta(s). "
        f"Cada error quita {d['dano']} de vida" + (f" y tienes {d['tiempo']} s por pregunta." if d["tiempo"] else "."),
        "4. Los primeros 3 enemigos derrotados sueltan las pistas 🧩 (tecla P para verlas).",
        f"5. Al caer el último enemigo se abre la puerta sellada de {m['guardian']['nombre']}. Habla con él/ella (tecla E).",
        f"6. Responde la pregunta final: opción {L[m['final']['correcta']]} — «{m['final']['opciones'][m['final']['correcta']]}». "
        f"Si fallas pierdes {d['dano_guardian']} de vida y puedes volver a intentarlo.",
        f"7. Entra al portal 🌀: ganas la flag {m['flag']} y {sig}.",
    ]


def excel(ms, salida):
    wb = Workbook()
    # ---- Resumen
    ws = wb.active; ws.title = "Resumen"
    titulo(ws, "CYBERAGENT ACADEMY — Resumen de misiones", 13)
    encabezado(ws, 4, ["Nivel", "Carpeta", "Misión", "Tema", "Laboratorio de origen", "Dificultad", "Enemigos",
                       "Golpes por enemigo", "XP por golpe", "XP final (guardián)", "Terminales", "XP por terminal",
                       "XP máximo del nivel"])
    for i, m in enumerate(ms):
        r = 5 + i; f = ALT if i % 2 else None; d = m["dificultad"]
        for c, v in enumerate([i + 1, m["id"], m["titulo"], m["tema"], m.get("laboratorio", ""),
                               "★" * d["estrellas"] + "☆" * (5 - d["estrellas"]), m["n_enemigos"],
                               d["vida_enemigo"], m["xp"]["por_golpe"], m["xp"]["final"],
                               sum(rw.count("I") for rw in m["mapa"]), m["xp"].get("terminal", 0)], 1):
            celda(ws, r, c, v, f, bold=c in (1, 3))
        celda(ws, r, 13, f"=G{r}*H{r}*I{r}+J{r}+K{r}*L{r}", OK, True)
    t = 5 + len(ms)
    celda(ws, t, 12, "TOTAL", None, True)
    celda(ws, t, 13, f"=SUM(M5:M{t - 1})", OK, True)
    celda(ws, t + 2, 1, "Rangos", None, True)
    for k, (a, b) in enumerate([("Cadete", "menos del 30 % del XP total"), ("Analista", "30 % a 59 %"),
                                ("Especialista", "60 % o más"), ("Agente Élite", "al completar todas las misiones")]):
        celda(ws, t + 3 + k, 1, a, None, True); celda(ws, t + 3 + k, 2, b)
    anchos(ws, [7, 12, 28, 28, 34, 12, 10, 10, 9, 11, 10, 10, 13]); ws.freeze_panes = "A5"
    try:
        img = XLImage(str(BASE / "static" / "img" / "logo.jpg")); img.width = img.height = 140
        ws.add_image(img, f"D{t + 2}")
    except Exception:
        pass

    # ---- Dificultad
    ws = wb.create_sheet("Dificultad")
    titulo(ws, "Cómo sube la dificultad nivel a nivel", 9)
    encabezado(ws, 4, ["Nivel", "Misión", "Enemigos", "Golpes por enemigo", "Daño por error", "Daño del guardián",
                       "Tiempo por pregunta (s)", "¿Persiguen?", "Velocidad enemigos (ms por paso)"])
    for i, m in enumerate(ms):
        r = 5 + i; f = ALT if i % 2 else None; d = m["dificultad"]
        for c, v in enumerate([i + 1, m["titulo"], m["n_enemigos"], d["vida_enemigo"], d["dano"], d["dano_guardian"],
                               d["tiempo"] or "Sin límite", f"Sí, a {d['radio']} casillas" if d["persigue"] else "No",
                               d["velocidad_ms"]], 1):
            celda(ws, r, c, v, f, bold=c == 1)
    celda(ws, 6 + len(ms), 1, "Menos ms = enemigos más rápidos. Todo se configura en mision.json → dificultad.")
    anchos(ws, [7, 30, 10, 11, 10, 11, 13, 16, 16]); ws.freeze_panes = "A5"

    # ---- Historias
    ws = wb.create_sheet("Historias")
    titulo(ws, "Historias de cada misión (diálogo del guardián)", 6)
    encabezado(ws, 4, ["Nivel", "Misión", "Guardián", "Historia", "Objetivo", "Pistas que sueltan los enemigos"])
    for i, m in enumerate(ms):
        r = 5 + i; f = ALT if i % 2 else None
        celda(ws, r, 1, i + 1, f, True); celda(ws, r, 2, m["titulo"], f, True); celda(ws, r, 3, m["guardian"]["nombre"], f)
        celda(ws, r, 4, "\n\n".join(m["guardian"]["historia"]), f); celda(ws, r, 5, m.get("objetivo", ""), f)
        celda(ws, r, 6, "\n".join(f"🧩 {k + 1}. {p}" for k, p in enumerate(m["pistas"])), f)
        ws.row_dimensions[r].height = 200
    anchos(ws, [7, 24, 16, 70, 30, 40]); ws.freeze_panes = "A5"

    # ---- Enemigos
    ws = wb.create_sheet("Enemigos")
    titulo(ws, "Enemigos de cada nivel", 5)
    encabezado(ws, 4, ["Nivel", "Misión", "Enemigo", "Frase de combate", "Color"])
    r = 5
    for i, m in enumerate(ms):
        for e in m["enemigos"]:
            f = ALT if i % 2 else None
            celda(ws, r, 1, i + 1, f, True); celda(ws, r, 2, m["titulo"], f); celda(ws, r, 3, e["nombre"], f, True)
            celda(ws, r, 4, e["frase"], f)
            x = celda(ws, r, 5, e["color"]); x.fill = PatternFill("solid", fgColor=e["color"].lstrip("#"))
            r += 1
    anchos(ws, [7, 28, 24, 46, 10]); ws.freeze_panes = "A5"

    # ---- Retos de combate
    ws = wb.create_sheet("Retos de combate")
    titulo(ws, "Preguntas de combate contra enemigos — CLAVE DEL INSTRUCTOR", 10)
    encabezado(ws, 4, ["Nivel", "Reto", "Pregunta", "A", "B", "C", "D", "Correcta", "Texto correcto", "Explicación"])
    r = 5
    for i, m in enumerate(ms):
        for rt in m["retos"]:
            f = ALT if i % 2 else None
            celda(ws, r, 1, i + 1, f, True); celda(ws, r, 2, rt["id"], f); celda(ws, r, 3, rt["pregunta"], f, True)
            for k in range(4):
                v = rt["opciones"][k] if k < len(rt["opciones"]) else ""
                celda(ws, r, 4 + k, v, OK if k == rt["correcta"] else f)
            celda(ws, r, 8, L[rt["correcta"]], OK, True).alignment = Alignment(horizontal="center", vertical="top")
            celda(ws, r, 9, f"=INDEX(D{r}:G{r},1,CODE(H{r})-64)", f)
            celda(ws, r, 10, rt.get("explicacion", ""), f)
            ws.row_dimensions[r].height = 62
            r += 1
    anchos(ws, [7, 6, 36, 24, 24, 24, 24, 9, 28, 36]); ws.freeze_panes = "D5"

    # ---- Pregunta final
    ws = wb.create_sheet("Pregunta final")
    titulo(ws, "Pregunta del guardián de cada nivel — CLAVE DEL INSTRUCTOR", 10)
    encabezado(ws, 4, ["Nivel", "Guardián", "Pregunta", "A", "B", "C", "D", "Correcta", "Defensa", "Flag"])
    for i, m in enumerate(ms):
        r = 5 + i; f = ALT if i % 2 else None; fi = m["final"]
        celda(ws, r, 1, i + 1, f, True); celda(ws, r, 2, m["guardian"]["nombre"], f); celda(ws, r, 3, fi["pregunta"], f, True)
        for k in range(4):
            v = fi["opciones"][k] if k < len(fi["opciones"]) else ""
            celda(ws, r, 4 + k, v, OK if k == fi["correcta"] else f)
        celda(ws, r, 8, L[fi["correcta"]], OK, True).alignment = Alignment(horizontal="center", vertical="top")
        celda(ws, r, 9, fi.get("defensa", ""), f); celda(ws, r, 10, m["flag"], f)
        ws.row_dimensions[r].height = 80
    anchos(ws, [7, 18, 34, 24, 24, 24, 24, 9, 34, 28]); ws.freeze_panes = "D5"

    # ---- Cómo pasar cada nivel
    ws = wb.create_sheet("Cómo pasar cada nivel")
    titulo(ws, "Guía paso a paso para superar cada nivel", 3)
    encabezado(ws, 4, ["Nivel", "Misión", "Pasos"])
    for i, m in enumerate(ms):
        r = 5 + i; f = ALT if i % 2 else None
        celda(ws, r, 1, i + 1, f, True); celda(ws, r, 2, m["titulo"], f, True)
        celda(ws, r, 3, "\n".join(paso_a_paso(m, i, ms)), f)
        ws.row_dimensions[r].height = 175
    r = 6 + len(ms)
    celda(ws, r, 1, "Controles", None, True)
    for k, t in enumerate(["Flechas / WASD: moverse · E o Espacio: hablar y avanzar diálogo",
                           "En combate: 1, 2, 3, 4 (o A, B, C, D) para responder · Enter: siguiente",
                           "P: ver pistas · 3: usar parche · 4: activar turbo · 🗺: volver al mapa de niveles",
                           "Huir de un combate cuesta 5 de vida y el enemigo vuelve a su lugar aturdido 3 s",
                           "Si la vida llega a 0: CONEXIÓN PERDIDA y se reinicia el nivel"]):
        celda(ws, r + 1 + k, 2, "•"); celda(ws, r + 1 + k, 3, t)
    anchos(ws, [7, 26, 120]); ws.freeze_panes = "A5"

    # ---- Terminales
    ws = wb.create_sheet("Terminales")
    titulo(ws, "Terminales de información de cada nivel (se leen con E)", 4)
    encabezado(ws, 4, ["Nivel", "Misión", "Título", "Texto"])
    r = 5
    for i, m in enumerate(ms):
        for tm in m.get("terminales", []):
            f = ALT if i % 2 else None
            celda(ws, r, 1, i + 1, f, True); celda(ws, r, 2, m["titulo"], f); celda(ws, r, 3, tm["titulo"], f, True)
            celda(ws, r, 4, tm["texto"], f); ws.row_dimensions[r].height = 40; r += 1
    anchos(ws, [7, 28, 26, 90]); ws.freeze_panes = "A5"

    # ---- Consola de comandos (CTF)
    if any("consola" in m for m in ms):
        ws = wb.create_sheet("Consola CTF")
        titulo(ws, "Consola interactiva — comandos y banderas CTF por nivel", 6)
        encabezado(ws, 4, ["Nivel", "Categoría", "Escenario", "Comandos clave (uno de los aceptados)", "Bandera CTF", "XP"])
        r = 5
        for i, m in enumerate(ms):
            c = m.get("consola")
            if not c: continue
            f = ALT if i % 2 else None
            cmds = "\n".join("• " + cmd["match"][0] for cmd in c["comandos"])
            xp = c.get("xp", 0) + c.get("pregunta", {}).get("xp", 0)
            celda(ws, r, 1, i + 1, f, True); celda(ws, r, 2, c["categoria"], f, True)
            celda(ws, r, 3, c["escenario"], f); celda(ws, r, 4, cmds, f)
            celda(ws, r, 5, c["flag"], f, bold=True); celda(ws, r, 6, xp, f)
            ws.row_dimensions[r].height = 70; r += 1
        anchos(ws, [7, 26, 44, 46, 22, 7]); ws.freeze_panes = "A5"

    # ---- Personajes (con imagen)
    idx = BASE / "static" / "img" / "personajes" / "personajes.json"
    if idx.exists():
        ws = wb.create_sheet("Personajes")
        titulo(ws, "Todos los personajes (imágenes en static/img/personajes/galeria)", 6)
        encabezado(ws, 4, ["Imagen", "Nombre", "Tipo", "Nivel", "Frase / descripción", "Archivo del retrato"])
        for k, pj in enumerate(json.loads(idx.read_text(encoding="utf-8"))):
            r = 5 + k; f = ALT if k % 2 else None
            celda(ws, r, 1, "", f)
            celda(ws, r, 2, pj["nombre"], f, True)
            celda(ws, r, 3, {"jugador": "Jugador", "guardian": "Guardián", "enemigo": "Enemigo · " + pj.get("clase", "")}[pj["tipo"]], f)
            celda(ws, r, 4, pj["nivel"] or "—", f)
            celda(ws, r, 5, pj.get("frase") or pj.get("mision") or pj.get("descripcion", ""), f)
            celda(ws, r, 6, "static/img/personajes/" + pj["retrato"], f)
            ws.row_dimensions[r].height = 62
            try:
                img = XLImage(str(BASE / "static" / "img" / "personajes" / pj["retrato"]))
                img.width, img.height = 63, 80
                ws.add_image(img, f"A{r}")
            except Exception:
                pass
        anchos(ws, [11, 26, 20, 7, 50, 60]); ws.freeze_panes = "B5"

    # ---- Créditos
    ws = wb.create_sheet("Créditos")
    titulo(ws, "Créditos", 2)
    for k, (a, b) in enumerate([
            ("Proyecto", "CyberAgent Academy — videojuego RPG educativo de hacking ético"),
            ("Creado por", AUTOR),
            ("Institución", "Universidad de Cundinamarca — Ingeniería de Sistemas y Computación"),
            ("Grupo", "Ética Hacking 901N"),
            ("Laboratorios base", "SQL Injection (Mutillidae, SQLMAP, DVWA), XSS reflejado y almacenado, BeEF, Carga de archivos"),
            ("Tecnología", "Python + Flask + SQLite (servidor) · HTML5 Canvas, CSS y JavaScript (juego)"),
            ("Uso", "Material educativo. Las prácticas reales solo en laboratorios propios, aislados y autorizados.")]):
        celda(ws, 4 + k, 1, a, None, True); celda(ws, 4 + k, 2, b)
    anchos(ws, [22, 100])
    for s in wb.worksheets:
        s.sheet_view.showGridLines = False
    salida.parent.mkdir(exist_ok=True)
    wb.save(salida)


def guia_md(ms, salida):
    o = ["# Guía de niveles — CyberAgent Academy", "", f"Creado por **{AUTOR}**.",
         "Generado automáticamente con `python scripts/generar_excel.py`.", ""]
    for i, m in enumerate(ms):
        d = m["dificultad"]
        o += [f"## Nivel {i + 1:02d} · {m['titulo']} {m.get('icono', '')}", "",
              f"*{m['sector']}* — {m['tema']} — basado en: {m.get('laboratorio', '')}", "",
              f"Dificultad {'★' * d['estrellas']}{'☆' * (5 - d['estrellas'])} · {m['n_enemigos']} enemigos × {d['vida_enemigo']} golpe(s) · "
              f"daño {d['dano']} · {'tiempo ' + str(d['tiempo']) + ' s' if d['tiempo'] else 'sin tiempo'} · "
              f"{'te persiguen' if d['persigue'] else 'patrullan'}", "",
              "**Enemigos:** " + ", ".join(e["nombre"] for e in m["enemigos"]), "",
              "**Pasos:**", ""] + [f"- {p[3:]}" for p in paso_a_paso(m, i, ms)] + [""]
    salida.parent.mkdir(exist_ok=True)
    salida.write_text("\n".join(o), encoding="utf-8")


if __name__ == "__main__":
    ms = cargar()
    excel(ms, BASE / "datos" / "CyberAgent_Academy_Historias_y_Respuestas.xlsx")
    guia_md(ms, BASE / "docs" / "GUIA_NIVELES.md")
    print(f"Listo: {len(ms)} misiones → datos/CyberAgent_Academy_Historias_y_Respuestas.xlsx y docs/GUIA_NIVELES.md")
