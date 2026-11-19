"""
Genera la versión de UN SOLO ARCHIVO del juego (sin Flask).
Creado por Andrés Felipe Beltrán Barrera

Uso:  python scripts/build_offline.py
Salida: datos/JUGAR_CyberAgent_Academy.html  (doble clic para jugar)

Ojo: en esta versión las respuestas viajan dentro del archivo. Para
evaluar de forma segura usa el servidor Flask (python app.py).
"""
import base64
import json
import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE))
from app import app, cargar_misiones  # noqa: E402

html = app.test_client().get("/").get_data(as_text=True)


def data_uri(ruta):
    tipo = "image/png" if ruta.suffix == ".png" else "image/jpeg"
    return f"data:{tipo};base64," + base64.b64encode(ruta.read_bytes()).decode()


def inline_css(m):
    return "<style>\n" + (BASE / m.group(1).lstrip("/")).read_text(encoding="utf-8") + "\n</style>"


def inline_js(m):
    codigo = (BASE / m.group(1).lstrip("/")).read_text(encoding="utf-8").replace("</script", "<\\/script")
    return "<script>\n" + codigo + "\n</script>"


html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', inline_css, html)
datos = json.dumps({"misiones": cargar_misiones()}, ensure_ascii=False).replace("</", "<\\/")
sprites = {p.stem: data_uri(p) for p in sorted((BASE / "static" / "img" / "personajes" / "sprites").glob("*.png"))}
html = html.replace('<script src="/static/js/api.js"></script>',
                    "<script>window.CAA_OFFLINE = " + datos + ";\nwindow.CAA_SPRITES = " + json.dumps(sprites) + ";</script>\n"
                    + '<script src="/static/js/api.js"></script>')
html = re.sub(r'<script src="([^"]+)"></script>', inline_js, html)
for img in (p for p in (BASE / "static" / "img").iterdir() if p.is_file()):
    html = html.replace(f"/static/img/{img.name}", data_uri(img))

salida = BASE / "datos" / "JUGAR_CyberAgent_Academy.html"
salida.write_text(html, encoding="utf-8")
print(f"Listo: {salida}  ({salida.stat().st_size // 1024} KB, {len(cargar_misiones())} misiones)")
