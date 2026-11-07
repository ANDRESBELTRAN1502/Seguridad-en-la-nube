# -*- coding: utf-8 -*-
"""
Agrega una CONSOLA INTERACTIVA a cada mision_XX/mision.json sin tocar el resto.
Creado por Andrés Felipe Beltrán Barrera.

En la consola el jugador escribe comandos reales (nmap, curl, cat, strings, env…)
y ve una respuesta simulada; al final encuentra una bandera CTF{...} y la escribe.
Cada nivel practica una categoría del laboratorio de hacking ético.

Uso:  python3 scripts/build_consolas.py
"""
import hashlib
import json
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
SEMILLA = "CyberAgentConsola-901N"


def flag(nombre):
    h = hashlib.md5((SEMILLA + nombre).encode()).hexdigest()[:4]
    return "CTF{" + nombre + "_" + h + "}"


# Una consola por nivel, temática por categoría del laboratorio.
# Estructura de cada comando: match (lista de formas aceptadas), salida, objetivo (índice
# que completa, o None), pista (opcional).
CONSOLAS = {
1: {"categoria": "Reconocimiento", "host": "objetivo", "user": "agente", "ip": "10.10.10.7",
    "escenario": "Te dieron solo la IP del objetivo: 10.10.10.7. Averigua qué servicios corren y lee el banner de SSH.",
    "objetivos": ["Escanear puertos y versiones del objetivo", "Leer el banner del servicio SSH"],
    "fs": {"notas.txt": "Solo tengo la IP del objetivo: 10.10.10.7\nHay que escanearla con nmap."},
    "comandos": [
        {"match": ["nmap -sv 10.10.10.7", "nmap 10.10.10.7", "nmap -sv -p- 10.10.10.7", "nmap -p- 10.10.10.7"],
         "salida": "Starting Nmap...\nPORT     STATE SERVICE VERSION\n22/tcp   open  ssh     OpenSSH 8.9p1\n80/tcp   open  http    Apache 2.4.52\n8080/tcp open  http    Werkzeug (portal)\nNmap done.",
         "objetivo": 0, "pista": "Escanea versiones: nmap -sV 10.10.10.7"},
        {"match": ["nc 10.10.10.7 22", "ssh 10.10.10.7", "ssh agente@10.10.10.7", "telnet 10.10.10.7 22"],
         "salida": "SSH-2.0-OpenSSH_8.9p1\n==== CyberAgent Academy ====\nBanner: " + flag("R3C0N"),
         "objetivo": 1, "pista": "Conéctate al puerto 22: nc 10.10.10.7 22"},
    ],
    "pregunta": {"texto": "¿Qué versión de OpenSSH corre el objetivo? (ej: 8.9)",
                 "acepta": ["8.9", "openssh 8.9", "8.9p1", "openssh 8.9p1"], "xp": 20},
    "flag": flag("R3C0N"), "xp": 60},

2: {"categoria": "Búsqueda pasiva de información", "host": "kali", "user": "agente", "ip": "10.10.10.7",
    "escenario": "El sitio http://10.10.10.7 publica información sin que haga falta atacarlo. Revísala.",
    "objetivos": ["Leer el archivo robots.txt", "Buscar comentarios ocultos en la página"],
    "fs": {"objetivo.txt": "http://10.10.10.7  — revisar robots.txt y el codigo fuente"},
    "comandos": [
        {"match": ["curl http://10.10.10.7/robots.txt", "curl 10.10.10.7/robots.txt", "wget http://10.10.10.7/robots.txt"],
         "salida": "User-agent: *\nDisallow: /gestion-interna/\n# nota: no indexar el panel\n# " + flag("0S1NT"),
         "objetivo": 0, "pista": "Pide el archivo robots.txt con curl"},
        {"match": ["curl http://10.10.10.7/", "curl 10.10.10.7", "curl -s http://10.10.10.7/ | grep <!--", "view-source"],
         "salida": "<html>...\n<!-- panel interno en /gestion-interna/ -->\n<!-- modulo de diagnostico en /diagnostico -->\n...</html>",
         "objetivo": 1, "pista": "Descarga la página y busca comentarios <!-- -->"},
    ],
    "flag": flag("0S1NT"), "xp": 60},

3: {"categoria": "Enumeración web", "host": "kali", "user": "agente", "ip": "10.10.10.7",
    "escenario": "Hay un directorio que no está enlazado en ninguna página. Encuéntralo por fuerza bruta.",
    "objetivos": ["Enumerar directorios ocultos", "Abrir el directorio encontrado"],
    "fs": {"wordlist.txt": "admin\nbackup\nlogin\ngestion-interna\ndev"},
    "comandos": [
        {"match": ["gobuster dir -u http://10.10.10.7 -w wordlist.txt", "gobuster dir -u http://10.10.10.7",
                   "dirb http://10.10.10.7", "gobuster -u http://10.10.10.7 -w wordlist.txt"],
         "salida": "/admin           (Status: 403)\n/login           (Status: 200)\n/gestion-interna (Status: 200)  <-- oculto\n",
         "objetivo": 0, "pista": "Usa gobuster dir -u http://10.10.10.7 -w wordlist.txt"},
        {"match": ["curl http://10.10.10.7/gestion-interna/", "curl 10.10.10.7/gestion-interna/",
                   "curl http://10.10.10.7/gestion-interna"],
         "salida": "<h1>Gestion interna</h1>\nAcceso no autorizado detectado. Bandera: " + flag("3NUM"),
         "objetivo": 1, "pista": "Abre /gestion-interna/ con curl"},
    ],
    "flag": flag("3NUM"), "xp": 70},

4: {"categoria": "Análisis HTTP", "host": "kali", "user": "agente", "ip": "10.10.10.7",
    "escenario": "El servidor esconde algo en sus cabeceras HTTP. Analízalas.",
    "objetivos": ["Ver solo las cabeceras HTTP", "Decodificar la cabecera en Base64"],
    "fs": {},
    "comandos": [
        {"match": ["curl -i http://10.10.10.7/", "curl -i 10.10.10.7", "curl --head http://10.10.10.7/",
                   "curl -i http://10.10.10.7"],
         "salida": "HTTP/1.1 200 OK\nServer: Apache\nX-Powered-By: CyberAgent/1.0\nX-Agente-Flag: Q1RGe0hUVFBfYjA0M30=\nContent-Type: text/html",
         "objetivo": 0, "pista": "Mira solo las cabeceras: curl -I http://10.10.10.7/"},
        {"match": ["echo q1rfe0huvvbfyja0m30= | base64 -d", "base64 -d", "echo 'Q1RGe0hUVFBfYjA0M30=' | base64 -d",
                   "echo Q1RGe0hUVFBfYjA0M30= | base64 -d"],
         "salida": flag("HTTP"), "objetivo": 1, "pista": "Decodifica el valor con: echo <valor> | base64 -d"},
    ],
    "flag": flag("HTTP"), "xp": 70},

5: {"categoria": "Gestión de sesiones", "host": "kali", "user": "agente", "ip": "10.10.10.7",
    "escenario": "Entraste como invitado. Tu rol viaja en una cookie sin firmar. Hazte administrador.",
    "objetivos": ["Ver tus cookies", "Pedir el panel con el rol de administrador"],
    "fs": {"cookies.txt": "sesion=abc123\nrol=invitado"},
    "comandos": [
        {"match": ["cat cookies.txt", "curl -v http://10.10.10.7/panel", "cat cookies"],
         "salida": "sesion=abc123\nrol=invitado   <-- se puede cambiar", "objetivo": 0,
         "pista": "Mira el archivo cookies.txt"},
        {"match": ["curl -b rol=admin http://10.10.10.7/panel", "curl --cookie rol=admin http://10.10.10.7/panel",
                   "curl -b 'rol=admin' http://10.10.10.7/panel", "curl -b rol=admin 10.10.10.7/panel"],
         "salida": "Panel de administrador\nRol: admin\nBandera: " + flag("S3SS10N"), "objetivo": 1,
         "pista": "Envía la cookie modificada: curl -b rol=admin http://10.10.10.7/panel"},
    ],
    "flag": flag("S3SS10N"), "xp": 80},

6: {"categoria": "File upload", "host": "kali", "user": "agente", "ip": "10.10.10.7",
    "escenario": "El portal solo revisa la extensión del nombre del archivo. Evádelo.",
    "objetivos": ["Ver qué archivos se aceptan", "Subir un archivo con doble extensión"],
    "fs": {"reporte.php": "<?php echo 'demo'; ?>", "nota.txt": "El filtro solo mira la extension final del nombre."},
    "comandos": [
        {"match": ["cat nota.txt", "ls", "cat reporte.php"], "salida": "El filtro solo mira la extension final del nombre.",
         "objetivo": 0, "pista": "Lee nota.txt para entender el filtro"},
        {"match": ["cp reporte.php reporte.php.png", "mv reporte.php reporte.php.png",
                   "curl -f archivo=@reporte.php.png http://10.10.10.7/subir",
                   "curl -f 'archivo=@reporte.php.png' http://10.10.10.7/subir"],
         "salida": "Subiendo reporte.php.png ... filtro ve '.png' -> ACEPTADO\nFiltro evadido. Bandera: " + flag("UPL04D"),
         "objetivo": 1, "pista": "Renombra a reporte.php.png (doble extensión) y súbelo"},
    ],
    "flag": flag("UPL04D"), "xp": 80},

7: {"categoria": "Inyección de comandos", "host": "objetivo", "user": "www-data", "ip": "10.10.10.7",
    "escenario": "La herramienta de diagnóstico hace ping a lo que escribas, pero no filtra nada.",
    "objetivos": ["Probar el ping normal", "Encadenar un comando para leer la bandera"],
    "fs": {"flag_oculta.txt": flag("CMD1NJ")},
    "comandos": [
        {"match": ["ping 127.0.0.1", "ping -c 1 127.0.0.1", "ping -c1 127.0.0.1"],
         "salida": "PING 127.0.0.1: 64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.03 ms", "objetivo": 0,
         "pista": "Primero prueba un ping normal: ping 127.0.0.1"},
        {"match": ["127.0.0.1; cat flag_oculta.txt", "ping 127.0.0.1; cat flag_oculta.txt",
                   "127.0.0.1 && cat flag_oculta.txt", "127.0.0.1; cat flag_oculta.txt #",
                   "127.0.0.1 | cat flag_oculta.txt"],
         "salida": "64 bytes from 127.0.0.1: time=0.03 ms\n" + flag("CMD1NJ"), "objetivo": 1,
         "pista": "Agrega un segundo comando: 127.0.0.1; cat flag_oculta.txt"},
    ],
    "flag": flag("CMD1NJ"), "xp": 90},

8: {"categoria": "Esteganografía", "host": "kali", "user": "agente", "ip": "",
    "escenario": "Descargaste una imagen sospechosa (agente_secreto.png). Esconde una bandera.",
    "objetivos": ["Listar los archivos", "Extraer los datos ocultos de la imagen"],
    "fs": {"agente_secreto.png": "(imagen binaria del agente)"},
    "comandos": [
        {"match": ["ls", "ls -la", "file agente_secreto.png"], "salida": "agente_secreto.png", "objetivo": 0,
         "pista": "Lista los archivos con ls"},
        {"match": ["strings agente_secreto.png", "strings agente_secreto.png | grep ctf", "binwalk agente_secreto.png",
                   "exiftool agente_secreto.png", "strings agente_secreto.png | grep flag"],
         "salida": "IHDR...IDAT...IEND\nComentario: datos ocultos ->\nFLAG=" + flag("ST3G0"), "objetivo": 1,
         "pista": "Usa strings o exiftool sobre la imagen"},
    ],
    "flag": flag("ST3G0"), "xp": 90},

9: {"categoria": "XSS", "host": "kali", "user": "agente", "ip": "10.10.10.7",
    "escenario": "El buscador refleja lo que escribes sin filtrarlo. Inyecta un script.",
    "objetivos": ["Probar una búsqueda normal", "Inyectar un script que se ejecute"],
    "fs": {},
    "comandos": [
        {"match": ["curl http://10.10.10.7/buscar?q=hola", "curl 'http://10.10.10.7/buscar?q=hola'",
                   "curl http://10.10.10.7/buscar?q=test"],
         "salida": "No se encontro: hola", "objetivo": 0, "pista": "Prueba el buscador: curl http://10.10.10.7/buscar?q=hola"},
        {"match": ["curl http://10.10.10.7/buscar?q=<script>alert(1)</script>",
                   "curl 'http://10.10.10.7/buscar?q=<script>alert(1)</script>'",
                   "curl http://10.10.10.7/buscar?q=<script>alert('xss')</script>"],
         "salida": "El administrador reviso tu mensaje y el script se ejecuto.\nBandera: " + flag("XSS"),
         "objetivo": 1, "pista": "Inyecta <script>alert(1)</script> en q="},
    ],
    "flag": flag("XSS"), "xp": 100},

10: {"categoria": "Linux y Docker", "host": "objetivo", "user": "agente", "ip": "10.10.10.7",
     "escenario": "Entraste por SSH al contenedor. Combina Linux y Docker para la bandera final.",
     "objetivos": ["Ver tus permisos sudo", "Leer el respaldo protegido", "Revisar las variables del contenedor"],
     "fs": {"leeme.txt": "Pista: revisa 'sudo -l' y luego 'env'."},
     "comandos": [
        {"match": ["sudo -l", "whoami"], "salida": "Usuario agente puede ejecutar: (root) NOPASSWD: /bin/cat",
         "objetivo": 0, "pista": "Mira qué puedes ejecutar como root: sudo -l"},
        {"match": ["sudo cat /opt/respaldo/flag.txt", "sudo cat /opt/respaldo/10_linux.flag",
                   "cat /opt/respaldo/flag.txt", "sudo /bin/cat /opt/respaldo/flag.txt"],
         "salida": "Parte 1: " + flag("L1NUX"), "objetivo": 1,
         "pista": "Usa el permiso sudo: sudo cat /opt/respaldo/flag.txt"},
        {"match": ["env", "env | grep flag", "env | grep -i flag", "printenv"],
         "salida": "PATH=/usr/bin\nHOSTNAME=objetivo-ctf\nFLAG_DOCKER=" + flag("D0CK3R") + "\nParte 2 lista.",
         "objetivo": 2, "pista": "Lista las variables de entorno del contenedor: env"},
     ],
     "pregunta": {"texto": "Junta las dos partes: escribe la bandera final del contenedor (la de Docker).",
                  "acepta": [flag("D0CK3R").lower()], "xp": 30},
     "flag": flag("D0CK3R"), "xp": 110},
}


ROOM_W, ROOM_H = 9, 8  # igual que en generar_mapa.py


def colocar_estacion(mapa):
    """Coloca la estación de consola 'K' en el centro de la sala inicial.
       Es una casilla por la que se CAMINA: al pisarla se abre la consola."""
    g = [list(r) for r in mapa]
    H = len(g)
    # quita cualquier 'K' previo para que sea idempotente
    for fila in g:
        for i, c in enumerate(fila):
            if c == "K":
                fila[i] = "."
    cx, cy = ROOM_W // 2, ROOM_H // 2  # centro aproximado de la sala 0
    mejor, dist = None, 1e9
    for y in range(1, min(ROOM_H, H)):
        for x in range(1, min(ROOM_W, len(g[y]))):
            if g[y][x] == ".":
                d = abs(x - cx) + abs(y - cy)
                if d < dist:
                    dist, mejor = d, (x, y)
    if mejor:
        g[mejor[1]][mejor[0]] = "K"
    return ["".join(r) for r in g]


def main():
    cambiados = 0
    for n in range(1, 11):
        arch = BASE / f"mision_{n:02d}" / "mision.json"
        if not arch.exists():
            continue
        m = json.loads(arch.read_text(encoding="utf-8"))
        c = CONSOLAS[n]
        # normalizamos los 'match' (minúsculas y espacios simples) para comparar en JS
        for cmd in c["comandos"]:
            cmd["match"] = [" ".join(x.lower().split()) for x in cmd["match"]]
        if "pregunta" in c:
            c["pregunta"]["acepta"] = [" ".join(x.lower().split()) for x in c["pregunta"]["acepta"]]
        m["consola"] = c
        m["mapa"] = colocar_estacion(m["mapa"])
        arch.write_text(json.dumps(m, ensure_ascii=False, indent=2), encoding="utf-8")
        cambiados += 1
    print(f"Consola agregada a {cambiados} misiones.")
    total = sum(c["xp"] + c.get("pregunta", {}).get("xp", 0) for c in CONSOLAS.values())
    print(f"XP extra total por consolas: {total}")


if __name__ == "__main__":
    main()
