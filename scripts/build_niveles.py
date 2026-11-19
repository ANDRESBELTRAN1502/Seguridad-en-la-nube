# -*- coding: utf-8 -*-
"""
Alinea CADA nivel a UN SOLO TEMA (el mismo de su terminal):
  - Nombre del mundo/sector relacionado con lo que se aprende.
  - INTRO al empezar el nivel: qué verás y qué aprenderás (la Profesora Ada
    lo explica; en el nivel 1 además explica objetivos, terminal, ayudas…).
  - Preguntas de COMBATE (retos) y el GUARDIÁN alineados al tema del nivel.
  - BANDERA del jefe de UNA sola palabra.
  - En el ÚLTIMO nivel aparece el profesor Fabián Gutiérrez con un cierre.

Uso:  python3 scripts/build_niveles.py
(Ejecútalo ANTES de build_consolas.py.)
Creado por Andrés Felipe Beltrán Barrera.
"""
import json
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
ADA = {"nombre": "Profesora Ada", "color": "#c084fc", "sprite": "profesora_ada"}
FABIAN = {"nombre": "Ing. Esp. Fabián Gutiérrez", "color": "#f59e0b", "sprite": "profesor_fabian"}

# Recordatorio corto de cómo jugar, al final de la intro de CADA nivel (menos el 1,
# que ya trae el tutorial completo).
RECORDATORIO = [
    "Recuerda cómo jugar: muévete con las FLECHAS o WASD y choca con los enemigos para combatir; cada acierto les quita vida y suelta una PISTA (un comando con ejemplo).",
    "Ayudas: 💊 Parche (tecla 3) te cura y ⚡ Turbo (tecla 4) te acelera. La TERMINAL (💻) está a mi lado: resuélvela paso a paso para pasar de nivel.",
]

# Tutorial de interfaz, SOLO en el nivel 1 (porque a veces uno no sabe estas cosas).
TUTORIAL_N1 = [
    "Antes de empezar, te explico la pantalla para que no te pierdas, cadete:",
    "• OBJETIVOS: arriba verás tu misión. Muévete con las FLECHAS o WASD.",
    "• ENEMIGOS: al chocar con uno empieza un COMBATE de preguntas; cada acierto le quita vida y suelta una PISTA (un comando con ejemplo).",
    "• AYUDAS (abajo): 🛡 Escudo y 🔍 Escáner se usan en combate; 💊 Parche (tecla 3) cura; ⚡ Turbo (tecla 4) te acelera.",
    "• TERMINAL (💻): la consola está a mi lado. Es la ÚLTIMA prueba: escribes comandos reales y, al resolverla, pasas de nivel.",
    "• A la derecha de la terminal tienes las PISTAS: qué hacer en cada paso. Si te atascas, pulsa «Dame una pista».",
]

NIVELES = {
1: {"titulo": "La torre de los puertos", "sector": "Sector 01 · Torre de Reconocimiento",
    "tema": "Reconocimiento y escaneo de puertos con Nmap", "icono": "🛰️",
    "intro": ["¡Bienvenido a CyberAgent Academy, cadete! Soy la Profesora Ada.",
              "En este nivel verás el RECONOCIMIENTO: el primer paso de todo hacking ético.",
              "Aprenderás a usar nmap para descubrir qué PUERTOS están abiertos en un objetivo y qué VERSIONES de servicios corren en ellos."],
    "flag": "nmap",
    "retos": [
        {"id":"r1","pregunta":"¿Para qué sirve nmap?","opciones":["Para borrar archivos","Para escanear puertos y servicios de un objetivo","Para enviar correos"],"correcta":1,"explicacion":"Nmap (Network Mapper) escanea redes e identifica puertos y servicios."},
        {"id":"r2","pregunta":"¿Qué comando muestra los puertos abiertos de una IP?","opciones":["nmap 10.10.10.7","rm -rf 10.10.10.7","ping -c 1 10.10.10.7"],"correcta":0,"explicacion":"Un escaneo normal con nmap lista los puertos abiertos."},
        {"id":"r3","pregunta":"¿Qué opción de nmap detecta la VERSIÓN de los servicios?","opciones":["-sV","-rm","-xx"],"correcta":0,"explicacion":"nmap -sV identifica el programa y versión de cada puerto."},
        {"id":"r4","pregunta":"¿En qué puerto suele estar el servicio SSH?","opciones":["22","443","3306"],"correcta":0,"explicacion":"SSH usa por defecto el puerto 22."},
        {"id":"r5","pregunta":"¿Por qué se hace reconocimiento ANTES de atacar?","opciones":["Para saber qué servicios existen y por dónde entrar","Para hacer más lento el objetivo","No sirve de nada"],"correcta":0,"explicacion":"Sin reconocer, atacas a ciegas; nmap te da el mapa del objetivo."},
    ],
    "final": {"pregunta":"Como guardián, demuéstralo: ¿qué comando de nmap usarías para ver puertos Y versiones del objetivo 10.10.10.7?","opciones":["nmap -sV 10.10.10.7","cat 10.10.10.7","sudo reboot"],"correcta":0,"explicacion":"nmap -sV combina el escaneo de puertos con la detección de versiones.","defensa":"Cerrar puertos que no se usan, mantener servicios actualizados y filtrar con un firewall."}},

2: {"titulo": "Las huellas públicas", "sector": "Sector 02 · Sala de Rastros",
    "tema": "Búsqueda pasiva de información (OSINT)", "icono": "🔎",
    "intro": ["En este nivel verás la BÚSQUEDA PASIVA (OSINT).",
              "Aprenderás a recoger información que un sitio publica sin necesidad de atacarlo, usando curl para leer archivos como /robots.txt."],
    "flag": "osint",
    "retos": [
        {"id":"r1","pregunta":"¿Qué es OSINT?","opciones":["Un antivirus","Recoger información pública sin atacar","Un lenguaje de programación"],"correcta":1,"explicacion":"OSINT es inteligencia de fuentes abiertas: información pública."},
        {"id":"r2","pregunta":"¿Qué archivo suele revelar rutas que el sitio no quiere mostrar?","opciones":["/robots.txt","/estilo.css","/foto.png"],"correcta":0,"explicacion":"robots.txt lista rutas 'Disallow' que suelen ser las interesantes."},
        {"id":"r3","pregunta":"¿Qué comando descarga un archivo de la web desde la terminal?","opciones":["curl http://10.10.10.7/robots.txt","print robots","open web"],"correcta":0,"explicacion":"curl descarga el contenido de una URL."},
        {"id":"r4","pregunta":"¿Por qué la búsqueda pasiva es 'silenciosa'?","opciones":["Porque no ataca ni alerta al objetivo","Porque borra registros","Porque apaga el servidor"],"correcta":0,"explicacion":"Solo lees lo público; no generas ruido ni ataques."},
    ],
    "final": {"pregunta":"¿Dónde buscarías primero pistas públicas del sitio 10.10.10.7?","opciones":["En /robots.txt con curl","En el panel de admin a la fuerza","En la contraseña del wifi"],"correcta":0,"explicacion":"robots.txt es la fuente pasiva más rápida.","defensa":"No poner información sensible en robots.txt ni en comentarios del HTML."}},

3: {"titulo": "El laberinto de directorios ocultos", "sector": "Sector 03 · Laberinto de Rutas",
    "tema": "Enumeración web de directorios con Gobuster", "icono": "🗂️",
    "intro": ["En este nivel verás la ENUMERACIÓN WEB.",
              "Aprenderás a descubrir páginas y carpetas que no están enlazadas, probando nombres de un diccionario con gobuster."],
    "flag": "gobuster",
    "retos": [
        {"id":"r1","pregunta":"¿Qué hace la enumeración web?","opciones":["Descubre rutas ocultas no enlazadas","Cambia el color del sitio","Borra la base de datos"],"correcta":0,"explicacion":"Enumerar es encontrar recursos que no aparecen en los enlaces."},
        {"id":"r2","pregunta":"¿Qué herramienta prueba rutas con un diccionario?","opciones":["gobuster","notepad","chrome"],"correcta":0,"explicacion":"gobuster prueba muchas rutas de una wordlist."},
        {"id":"r3","pregunta":"¿Qué es una 'wordlist'?","opciones":["Un diccionario de posibles nombres de rutas","Una lista de contraseñas del wifi","Un juego"],"correcta":0,"explicacion":"Es la lista de nombres que la herramienta va probando."},
        {"id":"r4","pregunta":"Un directorio con Status 200 significa que…","opciones":["Existe y responde","No existe","Está prohibido"],"correcta":0,"explicacion":"200 = OK: el recurso existe."},
    ],
    "final": {"pregunta":"¿Con qué herramienta enumerarías los directorios de http://10.10.10.7?","opciones":["gobuster","ping","reboot"],"correcta":0,"explicacion":"gobuster con un diccionario revela los directorios ocultos.","defensa":"No dejar paneles sensibles sin autenticación y vigilar accesos por fuerza bruta."}},

4: {"titulo": "El mensaje en las cabeceras", "sector": "Sector 04 · Bóveda de Cabeceras",
    "tema": "Análisis de cabeceras HTTP y Base64", "icono": "🧾",
    "intro": ["En este nivel verás el ANÁLISIS HTTP.",
              "Aprenderás a leer las CABECERAS de una respuesta web con curl -I y a decodificar datos ocultos en Base64."],
    "flag": "cabecera",
    "retos": [
        {"id":"r1","pregunta":"¿Qué son las cabeceras HTTP?","opciones":["Datos extra que el servidor envía con cada respuesta","El logo de la página","La contraseña del admin"],"correcta":0,"explicacion":"Las cabeceras llevan metadatos de la respuesta (servidor, tipo, etc.)."},
        {"id":"r2","pregunta":"¿Qué comando muestra SOLO las cabeceras?","opciones":["curl -I http://10.10.10.7/","cat cabeceras","ls -l"],"correcta":0,"explicacion":"curl -I pide únicamente las cabeceras."},
        {"id":"r3","pregunta":"¿Qué es Base64?","opciones":["Una forma de codificar datos como texto","Un virus","Un puerto"],"correcta":0,"explicacion":"Base64 representa datos binarios como texto ASCII."},
        {"id":"r4","pregunta":"¿Qué comando decodifica Base64?","opciones":["base64 -d","unzip","sudo"],"correcta":0,"explicacion":"base64 -d decodifica el texto."},
    ],
    "final": {"pregunta":"Encontraste 'YmFzZTY0' en una cabecera. ¿Cómo lo lees?","opciones":["echo YmFzZTY0 | base64 -d","lo borro","reinicio el PC"],"correcta":0,"explicacion":"Se decodifica con base64 -d.","defensa":"No enviar información sensible en cabeceras ni confiar en que Base64 'oculta' algo (no cifra)."}},

5: {"titulo": "La galleta del administrador", "sector": "Sector 05 · Sala de Sesiones",
    "tema": "Gestión de sesiones y cookies", "icono": "🍪",
    "intro": ["En este nivel verás la GESTIÓN DE SESIONES.",
              "Aprenderás cómo tu identidad viaja en COOKIES y por qué, si el rol va sin firmar, se puede manipular con curl."],
    "flag": "cookie",
    "retos": [
        {"id":"r1","pregunta":"¿Qué es una cookie de sesión?","opciones":["Un dato que guarda tu identidad entre páginas","Un archivo de música","Un puerto abierto"],"correcta":0,"explicacion":"La cookie mantiene tu sesión identificada en el sitio."},
        {"id":"r2","pregunta":"¿Por qué es inseguro guardar el rol en una cookie sin firmar?","opciones":["Porque el usuario puede cambiarlo a 'admin'","Porque pesa mucho","Porque es bonita"],"correcta":0,"explicacion":"Si no está firmada, se puede alterar el valor del rol."},
        {"id":"r3","pregunta":"¿Qué opción de curl envía una cookie?","opciones":["-b","-rm","-9"],"correcta":0,"explicacion":"curl -b envía cookies en la petición."},
        {"id":"r4","pregunta":"¿Cómo se protege una cookie de sesión?","opciones":["Firmándola y con flags HttpOnly/Secure","Haciéndola más larga","Borrando el servidor"],"correcta":0,"explicacion":"Firmar la cookie y usar HttpOnly/Secure evita manipulación y robo."},
    ],
    "final": {"pregunta":"Tu cookie dice rol=invitado. ¿Cómo pides el panel como admin?","opciones":["curl -b rol=admin http://10.10.10.7/panel","curl -I","ping admin"],"correcta":0,"explicacion":"Envías la cookie modificada con curl -b.","defensa":"Firmar las cookies en el servidor y nunca confiar el rol al cliente."}},

6: {"titulo": "El archivo disfrazado", "sector": "Sector 06 · Aduana de Archivos",
    "tema": "Subida de archivos insegura (file upload)", "icono": "📤",
    "intro": ["En este nivel verás la SUBIDA DE ARCHIVOS insegura.",
              "Aprenderás por qué validar solo la extensión final es débil y cómo se evade con una doble extensión (.php.png)."],
    "flag": "upload",
    "retos": [
        {"id":"r1","pregunta":"¿Por qué es débil revisar solo la extensión final?","opciones":["Porque se engaña con doble extensión","Porque es lento","Porque gasta memoria"],"correcta":0,"explicacion":"Un .php.png pasa el filtro de '.png' pero sigue siendo ejecutable."},
        {"id":"r2","pregunta":"¿Qué es una web shell?","opciones":["Un archivo que da control del servidor","Una imagen normal","Un antivirus"],"correcta":0,"explicacion":"Una web shell permite ejecutar comandos en el servidor."},
        {"id":"r3","pregunta":"¿Cómo se evade el filtro del ejemplo?","opciones":["reporte.php.png","reporte.txt","reporte.mp3"],"correcta":0,"explicacion":"La doble extensión engaña la validación por extensión final."},
        {"id":"r4","pregunta":"¿Cómo se valida bien una subida?","opciones":["Por tipo real (MIME), tamaño y renombrando","Solo por el nombre","No se valida"],"correcta":0,"explicacion":"Hay que comprobar el contenido real, no solo el nombre."},
    ],
    "final": {"pregunta":"¿Qué nombre usarías para colar un .php evadiendo el filtro de extensión?","opciones":["reporte.php.png","reporte.png","reporte.doc"],"correcta":0,"explicacion":"La doble extensión evade un filtro que solo mira la extensión final.","defensa":"Validar el tipo real del archivo, renombrarlo y guardarlo fuera de la raíz web."}},

7: {"titulo": "La orden encadenada", "sector": "Sector 07 · Sala de Comandos",
    "tema": "Inyección de comandos", "icono": "⛓️",
    "intro": ["En este nivel verás la INYECCIÓN DE COMANDOS.",
              "Aprenderás cómo, si una web pasa tu texto a la shell del sistema, puedes encadenar tus propios comandos con ';'."],
    "flag": "comando",
    "retos": [
        {"id":"r1","pregunta":"¿Qué es la inyección de comandos?","opciones":["Colar comandos del sistema a través de una entrada","Un tipo de cookie","Una imagen oculta"],"correcta":0,"explicacion":"Ocurre cuando la entrada del usuario llega a la shell del sistema."},
        {"id":"r2","pregunta":"¿Qué símbolo encadena un segundo comando?","opciones":[";","@","#"],"correcta":0,"explicacion":"El ';' separa y encadena comandos en la shell."},
        {"id":"r3","pregunta":"¿Qué comando leería un archivo tras el ping?","opciones":["127.0.0.1; cat flag.txt","solo ping","reboot"],"correcta":0,"explicacion":"Tras el ping, '; cat flag.txt' ejecuta un segundo comando."},
        {"id":"r4","pregunta":"¿Cómo se evita esta vulnerabilidad?","opciones":["No pasar la entrada del usuario a la shell","Usando más colores","Reiniciando"],"correcta":0,"explicacion":"Nunca se debe construir comandos del sistema con entrada sin validar."},
    ],
    "final": {"pregunta":"La web hace ping a lo que escribas. ¿Cómo lees flag.txt?","opciones":["127.0.0.1; cat flag.txt","ping 127.0.0.1","curl -I"],"correcta":0,"explicacion":"Encadenas un comando con ';' porque la entrada no se filtra.","defensa":"Usar funciones seguras, listas blancas y evitar construir comandos con entrada del usuario."}},

8: {"titulo": "La imagen que esconde secretos", "sector": "Sector 08 · Cámara Oculta",
    "tema": "Esteganografía", "icono": "🖼️",
    "intro": ["En este nivel verás la ESTEGANOGRAFÍA.",
              "Aprenderás a encontrar datos escondidos dentro de otros archivos, sacando el texto oculto de una imagen con strings."],
    "flag": "stego",
    "retos": [
        {"id":"r1","pregunta":"¿Qué es la esteganografía?","opciones":["Esconder datos dentro de otro archivo","Cifrar con contraseña","Borrar metadatos"],"correcta":0,"explicacion":"Es ocultar información dentro de otro medio (ej. una imagen)."},
        {"id":"r2","pregunta":"¿Qué comando muestra el texto legible de un binario?","opciones":["strings","chmod","ping"],"correcta":0,"explicacion":"strings extrae las cadenas de texto de un archivo."},
        {"id":"r3","pregunta":"¿Qué comando lista los archivos?","opciones":["ls","go","up"],"correcta":0,"explicacion":"ls lista los archivos del directorio."},
        {"id":"r4","pregunta":"¿Dónde más puede esconderse información en un archivo?","opciones":["En los metadatos (EXIF)","En el nombre del wifi","En la batería"],"correcta":0,"explicacion":"Los metadatos EXIF pueden contener datos ocultos."},
    ],
    "final": {"pregunta":"Tienes agente_secreto.png. ¿Cómo sacas el texto escondido?","opciones":["strings agente_secreto.png","ping imagen","reboot"],"correcta":0,"explicacion":"strings muestra el texto oculto dentro del binario.","defensa":"Limpiar metadatos y no confiar secretos a 'ocultarlos' dentro de archivos."}},

9: {"titulo": "El espejo del navegador", "sector": "Sector 09 · Galería de Espejos",
    "tema": "Cross-Site Scripting (XSS reflejado)", "icono": "🪞",
    "intro": ["En este nivel verás el XSS (Cross-Site Scripting).",
              "Aprenderás cómo, si una web devuelve tu texto sin filtrarlo, puedes inyectar una etiqueta <script> para ejecutar código."],
    "flag": "xss",
    "retos": [
        {"id":"r1","pregunta":"¿Qué es un XSS reflejado?","opciones":["Inyectar código que la web devuelve sin filtrar","Un escaneo de puertos","Una cookie firmada"],"correcta":0,"explicacion":"La web refleja tu entrada y ejecuta el script inyectado."},
        {"id":"r2","pregunta":"¿Qué etiqueta se inyecta típicamente?","opciones":["<script>","<tabla>","<puerto>"],"correcta":0,"explicacion":"<script> permite ejecutar JavaScript en el navegador de la víctima."},
        {"id":"r3","pregunta":"¿Por qué ocurre el XSS?","opciones":["Porque no se filtra ni escapa la entrada del usuario","Porque el servidor es lento","Porque hay muchas imágenes"],"correcta":0,"explicacion":"Reflejar la entrada sin escaparla permite inyectar código."},
        {"id":"r4","pregunta":"¿Cómo se previene el XSS?","opciones":["Escapando/validando la salida y con CSP","Subiendo el brillo","Borrando cookies"],"correcta":0,"explicacion":"Escapar la salida y usar Content-Security-Policy mitiga el XSS."},
    ],
    "final": {"pregunta":"El buscador refleja tu texto. ¿Qué inyectas para lograr XSS?","opciones":["<script>alert(1)</script>","una imagen","un ping"],"correcta":0,"explicacion":"Una etiqueta <script> ejecuta código en el navegador.","defensa":"Escapar siempre la salida, validar la entrada y aplicar una CSP estricta."}},

10:{"titulo": "El núcleo del contenedor", "sector": "Sector 10 · Torre de la Dirección",
    "tema": "Linux, Docker y escalada de privilegios", "icono": "🐳",
    "intro": ["Soy el Ing. Esp. Fabián Gutiérrez, su docente. Han llegado al último nivel, agentes.",
              "Aquí verás LINUX y DOCKER: aprenderás a revisar permisos con sudo -l, leer archivos protegidos y encontrar secretos en las variables de un contenedor.",
              "Demuestra todo lo aprendido en el semestre. ¡Este es el reto final!"],
    "flag": "docker", "guardian": FABIAN,
    "retos": [
        {"id":"r1","pregunta":"¿Qué muestra 'sudo -l'?","opciones":["Qué puedes ejecutar como root","La hora del sistema","El wifi"],"correcta":0,"explicacion":"sudo -l lista los permisos que tienes como superusuario."},
        {"id":"r2","pregunta":"Si puedes usar cat como root, ¿cómo lees un archivo protegido?","opciones":["sudo cat /opt/respaldo/flag.txt","rm flag.txt","ping flag"],"correcta":0,"explicacion":"Aprovechas el permiso sudo sobre cat."},
        {"id":"r3","pregunta":"¿Dónde guardan secretos muchos contenedores Docker?","opciones":["En variables de entorno","En el teclado","En la pantalla"],"correcta":0,"explicacion":"Las variables de entorno suelen contener claves y flags."},
        {"id":"r4","pregunta":"¿Qué comando muestra las variables de entorno?","opciones":["env","color","mute"],"correcta":0,"explicacion":"env (o printenv) lista las variables del entorno."},
        {"id":"r5","pregunta":"¿Qué es la escalada de privilegios?","opciones":["Pasar de usuario normal a más permisos","Subir el volumen","Cambiar el fondo"],"correcta":0,"explicacion":"Es obtener más permisos de los que te corresponden."},
    ],
    "final": {"pregunta":"Reto final: ¿cómo ves la variable con la bandera del contenedor?","opciones":["env","sudo reboot","ping docker"],"correcta":0,"explicacion":"env revela las variables del contenedor, incluida la bandera.","defensa":"No guardar secretos en variables de entorno, limitar sudo y endurecer el contenedor."}},
}


def main():
    cambiados = 0
    for n in range(1, 11):
        arch = BASE / f"mision_{n:02d}" / "mision.json"
        if not arch.exists():
            continue
        m = json.loads(arch.read_text(encoding="utf-8"))
        d = NIVELES[n]
        m["titulo"] = d["titulo"]; m["sector"] = d["sector"]
        m["tema"] = d["tema"]; m["icono"] = d["icono"]
        # Guardián e INTRO del nivel (historia que se ve al empezar)
        g = dict(d.get("guardian", ADA))
        hist = list(d["intro"])
        if n == 1:
            hist = [hist[0]] + TUTORIAL_N1 + hist[1:]
        else:
            hist = hist + RECORDATORIO
        g["historia"] = hist
        m["guardian"] = g
        # Combate del tema + bandera de UNA palabra
        m["retos"] = d["retos"]
        m["final"] = d["final"]
        m["flag"] = d["flag"]
        m["final"]["flag"] = d["flag"]
        arch.write_text(json.dumps(m, ensure_ascii=False, indent=2), encoding="utf-8")
        cambiados += 1
    print(f"Niveles alineados: {cambiados}")
    print("Banderas de jefe:", ", ".join(f"N{n}={NIVELES[n]['flag']}" for n in range(1, 11)))


if __name__ == "__main__":
    main()
