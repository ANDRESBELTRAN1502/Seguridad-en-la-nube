# -*- coding: utf-8 -*-
"""
Agrega una CONSOLA INTERACTIVA + GUÍA DE APRENDIZAJE a cada mision_XX/mision.json.
Creado por Andrés Felipe Beltrán Barrera.

Novedades (v7):
  - GUÍA por nivel: a lo largo del nivel los enemigos SUELTAN pistas que EXPLICAN
    bien la herramienta del nivel con EJEMPLOS DE COMANDOS reales y correctos
    (ej. nivel 1 enseña nmap: para qué sirve + cómo ver puertos + cómo ver
    versiones). Al llegar al profesor YA tienes los comandos con ejemplos claros.
  - Terminal con PREGUNTAS CLARAS paso a paso y conversacionales
    (ej. "ayúdame a ver qué puertos están activos en esta dirección" →
     "ya vemos los puertos, ahora veamos las versiones de los servicios").
  - Panel de ayuda a la derecha: comandos del nivel y para qué sirve cada uno.
  - Banderas de UNA palabra corta (ej. nivel 1 = "puerto22").
  - Al resolver, se abre la última puerta y aparece un MONSTRUO (salafinal.js).
  - Coloca la estación CONSOLA ('K') JUNTO al guardián ('G').

Uso:  python3 scripts/build_consolas.py
"""
import json
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
ROOM_W, ROOM_H = 9, 8  # igual que en generar_mapa.py


# =====================================================================
#  CONSOLAS: escenario claro, objetivos conversacionales paso a paso,
#  comandos (con su salida correcta), panel de ayuda, pistas, bandera y
#  el monstruo final. Las banderas son una sola palabra corta.
# =====================================================================
CONSOLAS = {
1: {"categoria": "Reconocimiento con Nmap", "host": "kali", "user": "agente", "ip": "10.10.10.7",
    "escenario": "Solo conoces la IP del objetivo: 10.10.10.7. Antes de atacar hay que RECONOCER. "
                 "Paso 1: averigua qué PUERTOS están activos en esa dirección. "
                 "Paso 2: mira qué VERSIONES de servicios corren en ellos. La herramienta para todo esto es nmap.",
    "objetivos": ["Ver qué puertos están activos en 10.10.10.7", "Ver las versiones de los servicios de esa dirección"],
    "ayuda": [
        {"cmd": "nmap 10.10.10.7", "desc": "Escanea la IP y muestra los PUERTOS abiertos (ej. 22, 80, 8080). Empieza por aquí."},
        {"cmd": "nmap -sV 10.10.10.7", "desc": "Muestra la VERSIÓN del servicio de cada puerto (ej. OpenSSH en el 22)."},
        {"cmd": "ls / cat <archivo>", "desc": "Lista archivos / muestra su contenido (p. ej. cat notas.txt)."},
    ],
    "fs": {"notas.txt": "Solo tengo la IP 10.10.10.7.\nPaso 1 ver puertos:  nmap 10.10.10.7\nPaso 2 ver versiones: nmap -sV 10.10.10.7"},
    "comandos": [
        {"match": ["nmap 10.10.10.7", "nmap -p- 10.10.10.7", "nmap -ss 10.10.10.7", "nmap --top-ports 10 10.10.10.7", "nmap -sp 10.10.10.7"],
         "salida": "Starting Nmap...\nPORT     STATE SERVICE\n22/tcp   open  ssh\n80/tcp   open  http\n8080/tcp open  http\nNmap done. ¡3 puertos activos! Ahora mira sus versiones con: nmap -sV 10.10.10.7",
         "objetivo": 0, "pista": "Ver puertos activos de la IP:  nmap 10.10.10.7"},
        {"match": ["nmap -sv 10.10.10.7", "nmap -a 10.10.10.7", "nmap -sv -p- 10.10.10.7", "nmap -sv -p22 10.10.10.7", "nmap -sc -sv 10.10.10.7"],
         "salida": "PORT     STATE SERVICE VERSION\n22/tcp   open  ssh     OpenSSH 8.9p1\n80/tcp   open  http    Apache 2.4.52\n8080/tcp open  http    Werkzeug (portal)\nServicio SSH confirmado en el puerto 22.\n>>> La bandera es la palabra: puerto22",
         "objetivo": 1, "pista": "Ver versiones de los servicios:  nmap -sV 10.10.10.7"},
    ],
    "pista_final": "La bandera es una sola palabra: el servicio clave estaba en el puerto 22 (SSH). Escribe: puerto22",
    "flag": "puerto22", "acepta": ["puerto22", "puerto 22", "22", "ssh"],
    "monstruo": {"nombre": "Escáner Oscuro", "color": "#ef4444",
                 "mensaje": "¡Usaste nmap, descubriste los puertos 22/80/8080 y sus versiones!"},
    "xp": 60},

2: {"categoria": "Búsqueda pasiva (OSINT)", "host": "kali", "user": "agente", "ip": "10.10.10.7",
    "escenario": "Antes de atacar, un sitio suele publicar pistas gratis. El archivo /robots.txt lista rutas que el sitio NO quiere que veas, "
                 "y por eso son las más interesantes. Paso 1: descárgalo con curl. Paso 2: fíjate en la ruta oculta que revela.",
    "objetivos": ["Entrar al directorio /robots.txt y leer la ruta oculta"],
    "ayuda": [
        {"cmd": "curl http://10.10.10.7/robots.txt", "desc": "Descarga el archivo robots.txt, donde el sitio esconde sus rutas."},
        {"cmd": "curl http://10.10.10.7/", "desc": "Descarga la página principal (busca comentarios <!-- ... -->)."},
    ],
    "fs": {"objetivo.txt": "Revisar las pistas públicas del sitio:\ncurl http://10.10.10.7/robots.txt"},
    "comandos": [
        {"match": ["curl http://10.10.10.7/robots.txt", "curl 10.10.10.7/robots.txt", "wget http://10.10.10.7/robots.txt", "curl http://10.10.10.7/robots", "curl -s http://10.10.10.7/robots.txt"],
         "salida": "User-agent: *\nDisallow: /gestion-interna/\n# nota del agente: no indexar el panel privado\nEncontraste una ruta oculta: /gestion-interna/\n>>> La bandera es la palabra: robots",
         "objetivo": 0, "pista": "Entra al directorio /robots.txt:  curl http://10.10.10.7/robots.txt"},
    ],
    "pista_final": "El archivo que acabas de leer se llama así. La bandera es: robots",
    "flag": "robots", "acepta": ["robots", "robots.txt"],
    "monstruo": {"nombre": "Rastreador Fantasma", "color": "#a855f7",
                 "mensaje": "¡Leíste robots.txt y descubriste la ruta oculta /gestion-interna/!"},
    "xp": 60},

3: {"categoria": "Enumeración web (Gobuster)", "host": "kali", "user": "agente", "ip": "10.10.10.7",
    "escenario": "Hay un directorio que no está enlazado en ninguna página; solo se encuentra PROBANDO nombres con un diccionario. "
                 "Paso 1: enumera los directorios con gobuster. Paso 2: entra al que aparezca como oculto.",
    "objetivos": ["Enumerar los directorios del sitio con gobuster", "Entrar al directorio oculto que encuentres"],
    "ayuda": [
        {"cmd": "gobuster dir -u http://10.10.10.7 -w wordlist.txt", "desc": "Prueba cada ruta del diccionario y muestra las que existen (Status 200)."},
        {"cmd": "curl http://10.10.10.7/gestion-interna/", "desc": "Abre el directorio oculto que hayas descubierto."},
        {"cmd": "cat wordlist.txt", "desc": "Muestra el diccionario de rutas que se van a probar."},
    ],
    "fs": {"wordlist.txt": "admin\nbackup\nlogin\ngestion-interna\ndev"},
    "comandos": [
        {"match": ["gobuster dir -u http://10.10.10.7 -w wordlist.txt", "gobuster dir -u http://10.10.10.7", "dirb http://10.10.10.7", "gobuster -u http://10.10.10.7 -w wordlist.txt", "gobuster dir -u 10.10.10.7 -w wordlist.txt", "gobuster dir -u http://10.10.10.7 -w /usr/share/wordlists/dirb/common.txt"],
         "salida": "/admin            (Status: 403)\n/login            (Status: 200)\n/gestion-interna  (Status: 200)  <-- OCULTO\nEntra con:  curl http://10.10.10.7/gestion-interna/",
         "objetivo": 0, "pista": "Enumera directorios:  gobuster dir -u http://10.10.10.7 -w wordlist.txt"},
        {"match": ["curl http://10.10.10.7/gestion-interna/", "curl 10.10.10.7/gestion-interna/", "curl http://10.10.10.7/gestion-interna"],
         "salida": "<h1>Gestion interna</h1>\nAcceso al panel privado detectado.\n>>> La bandera es la palabra: oculto",
         "objetivo": 1, "pista": "Abre el directorio encontrado:  curl http://10.10.10.7/gestion-interna/"},
    ],
    "pista_final": "El directorio que encontraste no estaba enlazado, estaba... La bandera es: oculto",
    "flag": "oculto", "acepta": ["oculto", "gestion-interna"],
    "monstruo": {"nombre": "Guardián de Puertas", "color": "#f97316",
                 "mensaje": "¡Con gobuster encontraste el directorio oculto /gestion-interna/!"},
    "xp": 70},

4: {"categoria": "Análisis HTTP + Base64", "host": "kali", "user": "agente", "ip": "10.10.10.7",
    "escenario": "El servidor esconde un dato en sus CABECERAS HTTP. Paso 1: mira solo las cabeceras con curl -I. "
                 "Paso 2: verás una cabecera con un valor raro en Base64; decodifícalo.",
    "objetivos": ["Ver las cabeceras HTTP del servidor con curl -I", "Decodificar el valor en Base64 que aparece"],
    "ayuda": [
        {"cmd": "curl -I http://10.10.10.7/", "desc": "Muestra SOLO las cabeceras de la respuesta (busca una cabecera X-...)."},
        {"cmd": "echo <valor> | base64 -d", "desc": "Decodifica un texto que está en Base64."},
    ],
    "fs": {"nota.txt": "Mira las cabeceras:  curl -I http://10.10.10.7/\nLuego decodifica el valor raro con base64 -d"},
    "comandos": [
        {"match": ["curl -i http://10.10.10.7/", "curl -i 10.10.10.7", "curl --head http://10.10.10.7/", "curl -i http://10.10.10.7"],
         "salida": "HTTP/1.1 200 OK\nServer: Apache\nX-Powered-By: CyberAgent/1.0\nX-Agente-Flag: YmFzZTY0\nContent-Type: text/html\nDecodifica el valor:  echo YmFzZTY0 | base64 -d",
         "objetivo": 0, "pista": "Ver solo las cabeceras:  curl -I http://10.10.10.7/"},
        {"match": ["echo ymfzzty0 | base64 -d", "base64 -d", "echo 'ymfzzty0' | base64 -d", "echo ymfzzty0= | base64 -d", "echo ymfzzty0 | base64 --decode"],
         "salida": "base64\n>>> La bandera es la palabra: base64", "objetivo": 1,
         "pista": "Decodifica el valor:  echo YmFzZTY0 | base64 -d"},
    ],
    "pista_final": "El valor venía codificado en... La bandera es: base64",
    "flag": "base64", "acepta": ["base64"],
    "monstruo": {"nombre": "Cifra Enmascarada", "color": "#eab308",
                 "mensaje": "¡Analizaste las cabeceras HTTP y decodificaste el Base64!"},
    "xp": 70},

5: {"categoria": "Gestión de sesiones (cookies)", "host": "kali", "user": "agente", "ip": "10.10.10.7",
    "escenario": "Entraste como invitado y tu ROL viaja en una cookie sin firmar: eso se puede manipular. "
                 "Paso 1: mira tu cookie de rol. Paso 2: pide el panel enviando la cookie con rol de administrador.",
    "objetivos": ["Ver tu cookie de rol actual", "Pedir el panel enviando la cookie como admin"],
    "ayuda": [
        {"cmd": "cat cookies.txt", "desc": "Muestra tus cookies; verás que el rol es 'invitado'."},
        {"cmd": "curl -b rol=admin http://10.10.10.7/panel", "desc": "Envía la cookie cambiada a 'admin' para entrar al panel."},
    ],
    "fs": {"cookies.txt": "sesion=abc123\nrol=invitado   (se puede cambiar a admin)"},
    "comandos": [
        {"match": ["cat cookies.txt", "cat cookies"],
         "salida": "sesion=abc123\nrol=invitado   <-- cámbialo a admin y pide el panel:\ncurl -b rol=admin http://10.10.10.7/panel", "objetivo": 0,
         "pista": "Mira tu cookie de rol:  cat cookies.txt"},
        {"match": ["curl -b rol=admin http://10.10.10.7/panel", "curl --cookie rol=admin http://10.10.10.7/panel", "curl -b 'rol=admin' http://10.10.10.7/panel", "curl -b rol=admin 10.10.10.7/panel"],
         "salida": "Panel de administrador\nRol: admin — acceso concedido\n>>> La bandera es la palabra: admin", "objetivo": 1,
         "pista": "Envía la cookie modificada:  curl -b rol=admin http://10.10.10.7/panel"},
    ],
    "pista_final": "El rol al que subiste era... La bandera es: admin",
    "flag": "admin", "acepta": ["admin", "administrador"],
    "monstruo": {"nombre": "Ladrón de Sesiones", "color": "#38bdf8",
                 "mensaje": "¡Cambiaste la cookie de rol y entraste como administrador!"},
    "xp": 80},

6: {"categoria": "Subida de archivos (file upload)", "host": "kali", "user": "agente", "ip": "10.10.10.7",
    "escenario": "El portal deja subir archivos pero solo revisa la EXTENSIÓN FINAL del nombre. Eso se evade con una doble extensión. "
                 "Paso 1: lee la nota para entender el filtro. Paso 2: renombra el archivo peligroso como .php.png para colarlo.",
    "objetivos": ["Entender por qué el filtro es débil", "Subir un archivo con doble extensión (.php.png)"],
    "ayuda": [
        {"cmd": "cat nota.txt", "desc": "Explica que el filtro solo mira la extensión final (.png, .jpg)."},
        {"cmd": "cp reporte.php reporte.php.png", "desc": "Crea una copia con doble extensión para evadir el filtro."},
    ],
    "fs": {"reporte.php": "<?php echo 'demo'; ?>", "nota.txt": "El filtro solo mira la extension FINAL del nombre (.png, .jpg).\nTruco: reporte.php.png"},
    "comandos": [
        {"match": ["cat nota.txt", "ls", "cat reporte.php"], "salida": "El filtro solo mira la extension FINAL del nombre.\nTruco: renombra a reporte.php.png -> cp reporte.php reporte.php.png",
         "objetivo": 0, "pista": "Lee la nota del filtro:  cat nota.txt"},
        {"match": ["cp reporte.php reporte.php.png", "mv reporte.php reporte.php.png", "curl -f archivo=@reporte.php.png http://10.10.10.7/subir", "curl -f 'archivo=@reporte.php.png' http://10.10.10.7/subir"],
         "salida": "Subiendo reporte.php.png ... el filtro ve '.png' -> ACEPTADO\nSe subió una web shell.\n>>> La bandera es la palabra: shell",
         "objetivo": 1, "pista": "Renombra con doble extensión:  cp reporte.php reporte.php.png"},
    ],
    "pista_final": "Un archivo malicioso que da control del servidor se llama una web... La bandera es: shell",
    "flag": "shell", "acepta": ["shell", "webshell", "web shell"],
    "monstruo": {"nombre": "Aduanero Corrupto", "color": "#fb923c",
                 "mensaje": "¡Evadiste el filtro con doble extensión y subiste la web shell!"},
    "xp": 80},

7: {"categoria": "Inyección de comandos", "host": "objetivo", "user": "www-data", "ip": "10.10.10.7",
    "escenario": "Hay una herramienta que hace ping a lo que escribas, pero NO filtra la entrada. "
                 "Paso 1: pruébala con un ping normal. Paso 2: encadena un segundo comando con ';' para leer el archivo de la bandera.",
    "objetivos": ["Probar la herramienta con un ping normal", "Encadenar ; cat para leer el archivo flag.txt"],
    "ayuda": [
        {"cmd": "ping 127.0.0.1", "desc": "Prueba la herramienta con un ping normal (así ves que funciona)."},
        {"cmd": "127.0.0.1; cat flag.txt", "desc": "Encadena un segundo comando (cat) después del ping con ';'."},
    ],
    "fs": {"flag.txt": "la bandera es: inyeccion"},
    "comandos": [
        {"match": ["ping 127.0.0.1", "ping -c 1 127.0.0.1", "ping -c1 127.0.0.1"],
         "salida": "PING 127.0.0.1: 64 bytes, time=0.03 ms.\nFunciona. Ahora encadena:  127.0.0.1; cat flag.txt", "objetivo": 0,
         "pista": "Prueba un ping normal:  ping 127.0.0.1"},
        {"match": ["127.0.0.1; cat flag.txt", "ping 127.0.0.1; cat flag.txt", "127.0.0.1 && cat flag.txt", "127.0.0.1 | cat flag.txt", "127.0.0.1;cat flag.txt", "127.0.0.1 ; cat flag.txt"],
         "salida": "64 bytes from 127.0.0.1: time=0.03 ms\nla bandera es: inyeccion\n>>> La bandera es la palabra: inyeccion", "objetivo": 1,
         "pista": "Encadena un comando con ;  ->  127.0.0.1; cat flag.txt"},
    ],
    "pista_final": "Lograste una... de comandos. La bandera es: inyeccion",
    "flag": "inyeccion", "acepta": ["inyeccion", "inyección", "injection"],
    "monstruo": {"nombre": "Shell Salvaje", "color": "#dc2626",
                 "mensaje": "¡Encadenaste un comando con ; y leíste la bandera del servidor!"},
    "xp": 90},

8: {"categoria": "Esteganografía", "host": "kali", "user": "agente", "ip": "",
    "escenario": "Descargaste una imagen (agente_secreto.png) que esconde un mensaje de texto dentro de sus bytes. "
                 "Paso 1: lista los archivos. Paso 2: saca el texto oculto con la herramienta strings.",
    "objetivos": ["Listar los archivos para ver la imagen", "Extraer el texto oculto con strings"],
    "ayuda": [
        {"cmd": "ls", "desc": "Lista los archivos; verás la imagen agente_secreto.png."},
        {"cmd": "strings agente_secreto.png", "desc": "Muestra el texto legible escondido dentro del archivo binario."},
    ],
    "fs": {"agente_secreto.png": "(imagen binaria del agente)"},
    "comandos": [
        {"match": ["ls", "ls -la", "file agente_secreto.png"], "salida": "agente_secreto.png\nSaca el texto oculto con:  strings agente_secreto.png", "objetivo": 0,
         "pista": "Lista los archivos:  ls"},
        {"match": ["strings agente_secreto.png", "strings agente_secreto.png | grep flag", "binwalk agente_secreto.png", "exiftool agente_secreto.png", "strings agente_secreto.png | grep ban"],
         "salida": "IHDR...IDAT...IEND\nComentario oculto -> strings\n>>> La bandera es la palabra: strings", "objetivo": 1,
         "pista": "Extrae el texto oculto:  strings agente_secreto.png"},
    ],
    "pista_final": "El comando que usaste para ver el texto oculto se llama... La bandera es: strings",
    "flag": "strings", "acepta": ["strings"],
    "monstruo": {"nombre": "Imagen Poseída", "color": "#ec4899",
                 "mensaje": "¡Usaste strings y sacaste el mensaje escondido en la imagen!"},
    "xp": 90},

9: {"categoria": "XSS reflejado", "host": "kali", "user": "agente", "ip": "10.10.10.7",
    "escenario": "El buscador del sitio DEVUELVE en la página lo que escribas, sin filtrarlo. Eso permite inyectar código. "
                 "Paso 1: prueba una búsqueda normal y mira cómo refleja tu texto. Paso 2: inyecta una etiqueta <script>.",
    "objetivos": ["Probar el buscador con un texto normal", "Inyectar una etiqueta <script> (XSS)"],
    "ayuda": [
        {"cmd": "curl http://10.10.10.7/buscar?q=hola", "desc": "Prueba el buscador; verás que refleja tu texto tal cual."},
        {"cmd": "curl http://10.10.10.7/buscar?q=<script>alert(1)</script>", "desc": "Inyecta un <script> para lograr el XSS."},
    ],
    "fs": {"nota.txt": "El buscador refleja tu texto sin filtrar.\nPrueba:  curl http://10.10.10.7/buscar?q=hola\nLuego inyecta un <script>."},
    "comandos": [
        {"match": ["curl http://10.10.10.7/buscar?q=hola", "curl 'http://10.10.10.7/buscar?q=hola'", "curl http://10.10.10.7/buscar?q=test", "curl http://10.10.10.7/buscar?q=prueba"],
         "salida": "No se encontro: hola\n(El buscador refleja tu texto SIN filtrar. Inyecta un <script>.)", "objetivo": 0,
         "pista": "Prueba el buscador:  curl http://10.10.10.7/buscar?q=hola"},
        {"match": ["curl http://10.10.10.7/buscar?q=<script>alert(1)</script>", "curl 'http://10.10.10.7/buscar?q=<script>alert(1)</script>'", "curl http://10.10.10.7/buscar?q=<script>alert('xss')</script>"],
         "salida": "El administrador abrió tu mensaje y el <script> se ejecutó.\n>>> La bandera es la palabra: script", "objetivo": 1,
         "pista": "Inyecta el script:  curl http://10.10.10.7/buscar?q=<script>alert(1)</script>"},
    ],
    "pista_final": "Inyectaste una etiqueta... La bandera es: script",
    "flag": "script", "acepta": ["script", "xss"],
    "monstruo": {"nombre": "Eco Maligno", "color": "#22d3ee",
                 "mensaje": "¡Inyectaste un <script> y lograste el XSS en el navegador!"},
    "xp": 100},

10: {"categoria": "Linux y Docker (privilegios)", "host": "objetivo", "user": "agente", "ip": "10.10.10.7",
     "escenario": "Entraste por SSH a un contenedor. Hay que escalar y encontrar el secreto final en 3 pasos. "
                  "Paso 1: mira qué puedes hacer como root (sudo -l). Paso 2: lee el respaldo protegido con ese permiso. "
                  "Paso 3: revisa las variables del contenedor Docker.",
     "objetivos": ["Ver tus permisos con sudo -l", "Leer el respaldo protegido con sudo cat", "Ver las variables del contenedor con env"],
     "ayuda": [
        {"cmd": "sudo -l", "desc": "Muestra qué puedes ejecutar como root (verás que puedes usar cat)."},
        {"cmd": "sudo cat /opt/respaldo/flag.txt", "desc": "Lee el archivo protegido aprovechando el permiso sudo."},
        {"cmd": "env", "desc": "Muestra las variables de entorno del contenedor Docker (busca FLAG=...)."},
     ],
     "fs": {"leeme.txt": "Pasos:\n1) sudo -l\n2) sudo cat /opt/respaldo/flag.txt\n3) env"},
     "comandos": [
        {"match": ["sudo -l", "whoami"], "salida": "El usuario agente puede ejecutar: (root) NOPASSWD: /bin/cat\nUsa ese permiso:  sudo cat /opt/respaldo/flag.txt", "objetivo": 0,
         "pista": "Mira tus permisos root:  sudo -l"},
        {"match": ["sudo cat /opt/respaldo/flag.txt", "cat /opt/respaldo/flag.txt", "sudo /bin/cat /opt/respaldo/flag.txt"],
         "salida": "Respaldo leído correctamente.\nAhora mira las variables del contenedor:  env", "objetivo": 1,
         "pista": "Lee el respaldo protegido:  sudo cat /opt/respaldo/flag.txt"},
        {"match": ["env", "env | grep flag", "env | grep -i flag", "printenv"],
         "salida": "PATH=/usr/bin\nHOSTNAME=objetivo-ctf\nFLAG=contenedor\n>>> La bandera es la palabra: contenedor", "objetivo": 2,
         "pista": "Mira las variables del contenedor:  env"},
     ],
     "pista_final": "La bandera estaba en la variable del... Docker. La bandera es: contenedor",
     "flag": "contenedor", "acepta": ["contenedor", "docker", "container"],
     "monstruo": {"nombre": "Núcleo del Contenedor", "color": "#e879f9",
                  "mensaje": "¡Combinaste Linux y Docker: sudo, el respaldo y las variables del contenedor!"},
     "xp": 110},
}


# =====================================================================
#  GUÍA de aprendizaje por nivel:
#   - "pistas": lo que SUELTAN los enemigos a lo largo del nivel y lo que
#     tienes ya recolectado al llegar al profesor. Explican la herramienta
#     con EJEMPLOS DE COMANDOS reales y correctos.
#   - "ayuda": tarjetas del panel derecho de la terminal (paso + qué hacer).
#   - "aprendizajes" + "capacidad": recuento para la animación de victoria.
# =====================================================================
GUIA = {
1: {"pistas": [
        "RECONOCIMIENTO: antes de atacar hay que saber qué corre en el objetivo. La herramienta es nmap (Network Mapper).",
        "Ver los PUERTOS activos de una IP:  nmap 10.10.10.7   → lista los puertos abiertos (ej. 22 SSH, 80 HTTP, 8080).",
        "Ver las VERSIONES de los servicios:  nmap -sV 10.10.10.7   → dice el programa y versión de cada puerto (ej. OpenSSH en el 22)."],
    "ayuda": [{"t":"Paso 1 · Puertos","h":"Averigua qué puertos están activos en la IP 10.10.10.7 con nmap (escaneo normal)."},
              {"t":"Paso 2 · Versiones","h":"Mira qué versión de servicio corre en cada puerto con nmap y la opción de versión (-sV)."}],
    "aprendizajes": ["Qué es el reconocimiento y por qué es el primer paso.","Escanear puertos con nmap.","Detectar versiones de servicios con nmap -sV."],
    "capacidad": "escanear un objetivo e identificar sus puertos y las versiones de sus servicios."},
2: {"pistas": [
        "BÚSQUEDA PASIVA (OSINT): sacar información sin atacar nada. Primero explora con ls qué archivos hay.",
        "Un sitio publica pistas en /robots.txt. Entra a él desde la terminal:  curl http://10.10.10.7/robots.txt",
        "robots.txt lista rutas 'Disallow' que el sitio NO quiere mostrar (ej. /gestion-interna/): justo las interesantes."],
    "ayuda": [{"t":"Entrar a robots.txt","h":"Entra al archivo /robots.txt del sitio con curl y lee la ruta oculta."}],
    "aprendizajes": ["Qué es la búsqueda pasiva (OSINT).","Leer robots.txt con curl.","Encontrar rutas ocultas sin atacar."],
    "capacidad": "recolectar información pública de un sitio antes de atacarlo."},
3: {"pistas": [
        "ENUMERACIÓN WEB: buscar páginas y carpetas que no están enlazadas, probando nombres de un diccionario.",
        "Enumerar directorios con gobuster:  gobuster dir -u http://10.10.10.7 -w wordlist.txt",
        "Los que dan Status 200 existen; abre el oculto con:  curl http://10.10.10.7/gestion-interna/"],
    "ayuda": [{"t":"Paso 1 · Enumerar","h":"Busca directorios ocultos con gobuster y el diccionario wordlist.txt."},
              {"t":"Paso 2 · Entrar","h":"Abre con curl el directorio oculto que descubriste."}],
    "aprendizajes": ["Qué es la enumeración web.","Usar gobuster con un diccionario.","Descubrir recursos no enlazados."],
    "capacidad": "descubrir páginas y directorios ocultos de un sitio web."},
4: {"pistas": [
        "CABECERAS HTTP: toda respuesta web trae cabeceras con información del servidor. A veces esconden datos.",
        "Ver SOLO las cabeceras:  curl -I http://10.10.10.7/   (busca una cabecera X-... con un valor raro).",
        "Si el valor parece Base64, decodifícalo:  echo YmFzZTY0 | base64 -d"],
    "ayuda": [{"t":"Paso 1 · Cabeceras","h":"Mira solo las cabeceras HTTP del servidor con curl -I."},
              {"t":"Paso 2 · Decodificar","h":"El valor sospechoso está en Base64: decodifícalo con base64 -d."}],
    "aprendizajes": ["Analizar cabeceras HTTP con curl -I.","Reconocer datos en Base64.","Decodificar con base64 -d."],
    "capacidad": "analizar las cabeceras HTTP y decodificar datos ocultos."},
5: {"pistas": [
        "SESIONES: tras iniciar sesión, tu identidad viaja en cookies. Si el rol va sin firmar, se puede manipular.",
        "Ver tus cookies:  cat cookies.txt   → verás rol=invitado.",
        "Enviar la cookie cambiada a admin:  curl -b rol=admin http://10.10.10.7/panel"],
    "ayuda": [{"t":"Paso 1 · Cookies","h":"Mira tu cookie de rol: está como 'invitado'."},
              {"t":"Paso 2 · Elevar","h":"Pide el panel enviando la cookie con rol=admin."}],
    "aprendizajes": ["Cómo funcionan las cookies de sesión.","Por qué el rol no debe viajar sin firmar.","Elevar privilegios con una cookie (curl -b)."],
    "capacidad": "detectar y aprovechar una gestión de sesiones insegura."},
6: {"pistas": [
        "SUBIDA DE ARCHIVOS: si el servidor solo revisa la extensión final del nombre, el filtro es débil.",
        "Evasión con doble extensión: renombra el archivo peligroso como imagen →  cp reporte.php reporte.php.png",
        "El filtro ve '.png' y lo acepta, pero el servidor ejecuta el .php (una web shell)."],
    "ayuda": [{"t":"Paso 1 · El filtro","h":"Lee la nota: el filtro solo mira la extensión FINAL del nombre."},
              {"t":"Paso 2 · Subir","h":"Renombra el archivo como .php.png para evadir el filtro."}],
    "aprendizajes": ["Por qué validar solo la extensión es inseguro.","Evadir filtros con doble extensión.","El riesgo de una web shell."],
    "capacidad": "evadir un filtro de subida de archivos débil."},
7: {"pistas": [
        "INYECCIÓN DE COMANDOS: si una web pasa tu texto a la shell del sistema, puedes colar comandos propios.",
        "Prueba la herramienta de ping con algo normal:  ping 127.0.0.1",
        "Encadena un segundo comando con ';' para leer un archivo:  127.0.0.1; cat flag.txt"],
    "ayuda": [{"t":"Paso 1 · Probar","h":"Prueba la herramienta con un ping normal a 127.0.0.1."},
              {"t":"Paso 2 · Inyectar","h":"Encadena un comando con ';' para leer flag.txt."}],
    "aprendizajes": ["Qué es la inyección de comandos.","Encadenar comandos con ';'.","Por qué no se debe pasar la entrada del usuario a la shell."],
    "capacidad": "detectar y explotar una inyección de comandos."},
8: {"pistas": [
        "ESTEGANOGRAFÍA: esconder datos dentro de otro archivo (ej. texto dentro de una imagen).",
        "Listar los archivos para ver la imagen:  ls",
        "Sacar el texto legible escondido en un binario:  strings agente_secreto.png"],
    "ayuda": [{"t":"Paso 1 · Listar","h":"Lista los archivos para ver la imagen con ls."},
              {"t":"Paso 2 · Extraer","h":"Saca el texto oculto de la imagen con strings."}],
    "aprendizajes": ["Qué es la esteganografía.","Inspeccionar datos ocultos en archivos.","Usar strings sobre un binario."],
    "capacidad": "encontrar datos escondidos dentro de archivos."},
9: {"pistas": [
        "XSS REFLEJADO: si una web devuelve tu texto en la página sin filtrarlo, puedes inyectar código.",
        "Prueba el buscador con texto normal:  curl http://10.10.10.7/buscar?q=hola",
        "Inyecta una etiqueta de script:  curl http://10.10.10.7/buscar?q=<script>alert(1)</script>"],
    "ayuda": [{"t":"Paso 1 · Probar","h":"Prueba el buscador y mira cómo refleja tu texto."},
              {"t":"Paso 2 · Inyectar","h":"Inyecta una etiqueta <script> para ejecutar código."}],
    "aprendizajes": ["Qué es el XSS reflejado.","Por qué no reflejar la entrada sin filtrar.","Inyectar una etiqueta <script>."],
    "capacidad": "detectar y aprovechar una vulnerabilidad XSS."},
10: {"pistas": [
        "ESCALADA EN LINUX: tras entrar, revisa qué permisos especiales tienes. 'sudo -l' lista lo que puedes hacer como root.",
        "Si puedes usar cat como root, lee archivos protegidos:  sudo cat /opt/respaldo/flag.txt",
        "En un contenedor Docker, los secretos suelen estar en variables de entorno:  env  (busca FLAG=...)."],
    "ayuda": [{"t":"Paso 1 · Permisos","h":"Revisa qué puedes ejecutar como root con sudo -l."},
              {"t":"Paso 2 · Leer","h":"Lee el respaldo protegido con sudo cat."},
              {"t":"Paso 3 · Contenedor","h":"Mira las variables del contenedor Docker con env."}],
    "aprendizajes": ["Enumerar permisos sudo en Linux.","Leer archivos protegidos por una mala configuración.","Inspeccionar variables de un contenedor Docker."],
    "capacidad": "enumerar un sistema Linux y un contenedor Docker para encontrar secretos."},
}


def colocar_estacion(mapa):
    """Coloca la estación de consola 'K' JUNTO al guardián 'G' (su prueba final)."""
    g = [list(r) for r in mapa]
    H = len(g)
    for fila in g:
        for i, c in enumerate(fila):
            if c == "K":
                fila[i] = "."
    gp = None
    for y in range(H):
        for x in range(len(g[y])):
            if g[y][x] == "G":
                gp = (x, y)
    if gp:
        x0, y0 = gp
        for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, 1), (1, -1), (-1, -1)]:
            nx, ny = x0 + dx, y0 + dy
            if 0 <= ny < H and 0 <= nx < len(g[ny]) and g[ny][nx] == ".":
                g[ny][nx] = "K"
                return ["".join(r) for r in g]
    # respaldo: centro de la sala inicial
    cx, cy = ROOM_W // 2, ROOM_H // 2
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


# PASOS de ataque de cada terminal (el paso de EXPLORAR con ls se añade solo).
# Se numeran automáticamente. Sin la cadena completa de la dirección.
PASOS = {
1: ["Escanea los puertos del objetivo con nmap",
    "Mira las versiones de los servicios (opción -sV)",
    "Escribe la bandera:  puerto22"],
2: ["Entra al directorio /robots.txt del sitio con curl",
    "Escribe la bandera:  robots"],
3: ["Enumera los directorios del sitio con gobuster y el diccionario wordlist.txt",
    "Entra al directorio oculto /gestion-interna/ con curl",
    "Escribe la bandera:  oculto"],
4: ["Mira las cabeceras del sitio con curl -I",
    "Decodifica el valor en Base64 con base64 -d",
    "Escribe la bandera:  base64"],
5: ["Lee tu cookie de rol con  cat cookies.txt  (verás rol=invitado)",
    "Ataca el /panel enviando la cookie rol=admin con curl -b",
    "Escribe la bandera:  admin"],
6: ["Lee la nota del filtro con  cat nota.txt  (entiende por qué es débil)",
    "Ataca el archivo reporte.php renombrándolo a reporte.php.png con cp",
    "Escribe la bandera:  shell"],
7: ["Prueba la herramienta con un ping normal:  ping 127.0.0.1",
    "Ataca encadenando un comando con ; para leer flag.txt",
    "Escribe la bandera:  inyeccion"],
8: ["Ataca el archivo agente_secreto.png sacando su texto oculto con strings",
    "Escribe la bandera:  strings"],
9: ["Prueba el buscador con curl (?q=hola) y mira cómo refleja tu texto",
    "Ataca inyectando una etiqueta <script> en el buscador",
    "Escribe la bandera:  script"],
10:["Mira tus permisos de root con  sudo -l",
    "Lee el archivo protegido /opt/respaldo/flag.txt con sudo cat",
    "Mira las variables del contenedor con  env",
    "Escribe la bandera:  contenedor"],
}

# Qué muestra el comando "ls" al EXPLORAR cada terminal (los que tienen archivos).
# El nivel 7 no lo lleva (vería flag.txt directo). El paso se inyecta automático.
EXPLORA = {
    2: "objetivo.txt   robots.txt   index.html", 3: "wordlist.txt",
    4: "nota.txt", 5: "cookies.txt", 6: "reporte.php   nota.txt",
    8: "agente_secreto.png", 9: "nota.txt", 10: "leeme.txt",
}

# Dirección/objetivo claro a atacar en cada terminal (se antepone al escenario).
OBJETIVO = {
    1: "la IP 10.10.10.7", 2: "el sitio http://10.10.10.7", 3: "el sitio http://10.10.10.7",
    4: "el sitio http://10.10.10.7", 5: "el panel de http://10.10.10.7", 6: "el portal de http://10.10.10.7",
    7: "la herramienta de ping de http://10.10.10.7", 8: "los archivos locales del caso",
    9: "el buscador de http://10.10.10.7", 10: "el contenedor (ya estás dentro por SSH)",
}


def main():
    cambiados = 0
    for n in range(1, 11):
        arch = BASE / f"mision_{n:02d}" / "mision.json"
        if not arch.exists():
            continue
        m = json.loads(arch.read_text(encoding="utf-8"))
        c = CONSOLAS[n]
        gu = GUIA[n]
        # Decir SIEMPRE y claro cuál es la dirección/objetivo a atacar.
        c["escenario"] = f"🎯 Objetivo a atacar: {OBJETIVO[n]}. " + c["escenario"]
        ayuda = [dict(a) for a in gu["ayuda"]]
        pasos = list(PASOS[n])

        # --- Paso 0: EXPLORAR con ls (uniforme en todos los niveles con archivos) ---
        if n in EXPLORA:
            for cmd in c["comandos"]:
                if cmd.get("objetivo") is not None:
                    cmd["objetivo"] += 1
            c["objetivos"] = ["Explorar: mira qué archivos hay con ls"] + c["objetivos"]
            c["comandos"] = [{
                "match": ["ls", "ls -la", "dir"],
                "salida": EXPLORA[n] + "\n(Para leer un archivo usa:  cat <archivo>)",
                "objetivo": 0,
                "pista": "Primero explora los archivos:  ls",
            }] + c["comandos"]
            ayuda = [{"t": "Explorar", "h": "Mira qué archivos hay en el objetivo con ls (y léelos con cat <archivo>)."}] + ayuda
            pasos = ["Explora los archivos: escribe  ls"] + pasos

        # Numerar los pasos (1), 2), 3)...) y las tarjetas de ayuda (Paso N · ...)
        c["pasos"] = [f"{i+1}) {p}" for i, p in enumerate(pasos)]
        nueva_ayuda = []
        for i, a in enumerate(ayuda):
            titulo = a["t"].split("·", 1)[-1].strip() if "·" in a["t"] else a["t"].strip()
            nueva_ayuda.append({"t": f"Paso {i+1} · {titulo}", "h": a["h"]})

        # En la PISTA revelada mostramos la estructura del comando pero con la
        # dirección como un hueco "(dirección atacada)": el usuario la completa.
        def ocultar_dir(txt):
            return (txt.replace("http://10.10.10.7", "(dirección atacada)")
                       .replace("https://10.10.10.7", "(dirección atacada)")
                       .replace("10.10.10.7", "(dirección atacada)"))
        for cmd in c["comandos"]:
            if cmd.get("pista"):
                cmd["pista"] = ocultar_dir(cmd["pista"])
        if c.get("pista_final"):
            c["pista_final"] = ocultar_dir(c["pista_final"])
        c["ayuda"] = nueva_ayuda; c["aprendizajes"] = gu["aprendizajes"]; c["capacidad"] = gu["capacidad"]
        for cmd in c["comandos"]:
            cmd["match"] = [" ".join(x.lower().split()) for x in cmd["match"]]
        c["acepta"] = [" ".join(x.lower().split()) for x in c["acepta"]]
        m["consola"] = c
        # GUÍA que sueltan los enemigos y se lleva al profesor:
        m["pistas"] = gu["pistas"]
        m["mapa"] = colocar_estacion(m["mapa"])
        arch.write_text(json.dumps(m, ensure_ascii=False, indent=2), encoding="utf-8")
        cambiados += 1
    print(f"Consola + guía v7 agregada a {cambiados} misiones.")
    print("Banderas:", ", ".join(f"N{n}={CONSOLAS[n]['flag']}" for n in range(1, 11)))


if __name__ == "__main__":
    main()
