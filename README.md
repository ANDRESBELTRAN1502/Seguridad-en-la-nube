# CyberAgent Academy 🛡️

**Videojuego RPG educativo de hacking ético**
Creado por **Andrés Felipe Beltrán Barrera** · Universidad de Cundinamarca · Ingeniería de Sistemas · Ética Hacking 901N

Recorres 10 sectores y en cada uno peleas contra enemigos con combates por turnos. Respondes preguntas sobre los laboratorios de SQL Injection, XSS, BeEF y Carga de archivos, recoges poderes, juntas pistas y vences al guardián del sector.

## Estructura del proyecto

```
CyberAgent-Academy/
├── app.py                  # Rutas de la aplicación Flask y API (valida respuestas)
├── requirements.txt        # Dependencias
├── README.md
├── scripts/                # Scripts de generación, validación y auditoría
│   ├── generar_mapa.py     #   crea mapas ASCII de salas temáticas (datacenter, NOC, red…)
│   ├── generar_personajes.py # sprites animados + retratos con el nombre de cada personaje
│   ├── nueva_mision.py     #   crea la carpeta de una misión nueva
│   ├── validar_misiones.py #   auditoría: revisa que cada misión sea jugable
│   ├── generar_excel.py    #   Excel del instructor + docs/GUIA_NIVELES.md
│   └── build_offline.py    #   versión de un solo archivo HTML (sin Flask)
├── datos/                  # Base de datos, salidas y evidencias
│   ├── cyberagent.db       #   (se crea sola) agentes, respuestas, ranking
│   ├── auditoria_misiones.txt
│   ├── CyberAgent_Academy_Historias_y_Respuestas.xlsx
│   └── JUGAR_CyberAgent_Academy.html
├── docs/                   # Documentación
│   ├── ARQUITECTURA.md
│   ├── COMO_AGREGAR_MISION.md
│   └── GUIA_NIVELES.md
├── mision_01/ … mision_10/ # UNA CARPETA POR NIVEL (mision.json + README.md)
├── static/                 # CSS, JavaScript, imágenes y música
│   ├── css/game.css
│   ├── js/  api.js · motor.js · combate.js · consola.js · juego.js · musica.js · sonido.js · fondo.js
│   ├── musica/             #   (opcional) tus MP3: titulo, exploracion, combate, jefe, victoria, derrota
│   └── img/
│       ├── logo.jpg · favicon.png
│       └── personajes/     #   ★ TODOS LOS PERSONAJES
│           ├── galeria/    #     retratos con el nombre: "Nivel 01 - Profesora Ada.png"…
│           │   ├── guardianes/ · enemigos/
│           │   └── TODOS_LOS_PERSONAJES.png
│           ├── sprites/    #     hojas de animación que usa el juego
│           └── personajes.json
└── templates/              # Vistas Flask
    ├── base.html           #   plantilla común (créditos, fondo)
    ├── index.html          #   título → mapa de niveles → juego → combate → certificado
    ├── ranking.html        #   ranking de agentes
    ├── personajes.html     #   galería animada de los 76 personajes
    └── creditos.html
```

## Cómo ejecutarlo en Visual Studio Code

1. Descomprime el ZIP y abre la carpeta `CyberAgent-Academy` en VS Code (**Archivo → Abrir carpeta**).
2. Abre una terminal (**Terminal → Nueva terminal**) y ejecuta:

   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Linux / Mac:
   source .venv/bin/activate

   pip install -r requirements.txt
   python app.py
   ```
3. Abre **http://127.0.0.1:5000** en el navegador.

Si no quieres usar Python, abre `datos/JUGAR_CyberAgent_Academy.html` con doble clic. Ese archivo trae todo adentro, pero no tiene ranking.

## Novedades v5 — Consola de comandos (práctica tipo CTF)

Cada nivel tiene una **estación de consola** (el equipo con el cartel **CONSOLA** en el centro de la sala inicial): **písala para abrirla**, o usa el botón ⌨️ / la tecla **C**. Ahí escribes **comandos reales** y ves la respuesta simulada, igual que en un laboratorio de hacking ético. Practicas las categorías del curso y ganas **banderas CTF{...}** y XP extra:

| Nivel | Categoría que practicas | Ejemplo de comando |
|---|---|---|
| 1 | Reconocimiento | `nmap -sV 10.10.10.7` |
| 2 | Búsqueda pasiva de información | `curl http://10.10.10.7/robots.txt` |
| 3 | Enumeración web | `gobuster dir -u http://10.10.10.7 -w wordlist.txt` |
| 4 | Análisis HTTP | `curl -I http://10.10.10.7/` → `base64 -d` |
| 5 | Gestión de sesiones | `curl -b rol=admin http://10.10.10.7/panel` |
| 6 | File upload | `cp reporte.php reporte.php.png` |
| 7 | Inyección de comandos | `127.0.0.1; cat flag_oculta.txt` |
| 8 | Esteganografía | `strings agente_secreto.png` |
| 9 | XSS | `curl http://10.10.10.7/buscar?q=<script>alert(1)</script>` |
| 10 | Linux y Docker | `sudo -l` · `sudo cat ...` · `env` |

- Escribes el comando, pulsas **Enter** y la consola responde. Comandos propios: `ayuda`, `ls`, `cat`, `pwd`, `whoami`, `pista`, `limpiar`, `salir` (↑/↓ repiten comandos anteriores).
- Cuando encuentras una bandera `CTF{...}`, la **escribes** para validarla. Algunos niveles piden además **escribir la respuesta** a una pregunta sobre lo que viste.
- Las banderas CTF ganadas aparecen en el resumen del nivel y en el certificado final.

## Novedades v4

- **Niveles más largos:** de 4 salas en el nivel 1 a 10 salas en el nivel 10, con 4 a 9 enemigos y 8 preguntas de combate por nivel.
- **Salas de sistemas animadas:** racks de servidores con LEDs que parpadean, switches de red, muros de monitores con gráficas en vivo, unidades de enfriamiento con ventilador girando, UPS cargando, núcleos de datos que pulsan, escritorios con código en pantalla y cableado con pulsos de datos.
- **Terminales de información 💻:** en cada nivel hay 2 o 3. Se leen con E, cuentan notas de tus laboratorios y dan +5 XP.
- **Animación:**
  - sprites con animación de caminar en 4 direcciones;
  - partículas, explosiones y textos flotantes;
  - temblor de pantalla;
  - transición de combate estilo Pokémon;
  - en el combate: tajo, retroceso y desintegración;
  - el portal absorbe al jugador;
  - cámara suave y viñeta roja cuando tienes poca vida.
- **Música chiptune original:** hay pistas de título, exploración (cambia de tono y velocidad en cada nivel), combate, jefe, victoria y derrota. El botón 🎵 la activa o la apaga, y 🔊 hace lo mismo con los efectos.
- **Personajes:** son 76, cada uno con su nombre. Están en `static/img/personajes/galeria/` y en la página **/personajes**.

## Cómo se juega

| Acción | Tecla |
|---|---|
| Moverse | Flechas o WASD (en celular sale un control táctil) |
| Hablar / avanzar diálogo | E, Espacio o Enter |
| Responder en combate | 1, 2, 3, 4 (o A, B, C, D) |
| Leer terminal 💻 | E (estando al lado) |
| Ver pistas | P |
| Usar parche (+35 vida) | 3 |
| Activar turbo (20 s) | 4 |

**Así funciona cada nivel:**
1. Exploras varias salas y recoges los poderes: 🛡 Escudo, 🔍 Escáner, 💊 Parche y ⚡ Turbo.
2. Al chocar con un enemigo 👾 empieza un combate. Cada respuesta correcta es un golpe al enemigo y cada error te quita vida.
3. Los primeros enemigos que derrotas sueltan las **pistas** 🧩 que necesitas para la pregunta final.
4. Cuando cae el último enemigo se abre la sala del **guardián**, que te hace la pregunta final.
5. Si aciertas se activa el **portal** 🌀, ganas la flag y se desbloquea el siguiente nivel.

**La dificultad sube nivel a nivel:**
- hay más salas y más enemigos (de 3 a 8);
- los enemigos aguantan más golpes (de 1 a 3);
- cada error quita más vida (de 10 a 30);
- desde el nivel 4 hay tiempo límite por pregunta (de 40 a 18 segundos);
- desde el nivel 5 los enemigos te persiguen, y cada vez son más rápidos;
- desde el nivel 5 hay 4 opciones de respuesta en vez de 3.

## Personajes e imágenes

```bash
python scripts/generar_personajes.py
```
Este comando crea un sprite animado y un retrato con el nombre de cada personaje de todas las misiones. Si quieres dibujar tu propio personaje, reemplaza su PNG en `static/img/personajes/sprites/` con el mismo tamaño: 64×64 para personas (4 cuadros × 4 direcciones) o 64×16 para enemigos (4 cuadros).

## Música

La música se genera sola con Web Audio y es original (`static/js/musica.js`). Para usar canciones tuyas, pon `titulo.mp3`, `exploracion.mp3`, `combate.mp3`, `jefe.mp3`, `victoria.mp3` o `derrota.mp3` en `static/musica/`. Usa solo música propia o con licencia libre.

## Agregar, quitar o cambiar niveles

- **Quitar un nivel:** borra o mueve su carpeta `mision_XX`.
- **Agregar un nivel:** ejecuta `python scripts/nueva_mision.py "Mi misión"`, edita el `mision.json` que se crea y luego corre `python scripts/generar_personajes.py`.
- **Cambiar un nivel:** edita su `mision.json`, que contiene historia, enemigos, preguntas, dificultad y mapa.
- Después de cualquier cambio ejecuta `python scripts/validar_misiones.py` y `python scripts/generar_excel.py`.

El servidor detecta las carpetas solo. Los detalles están en `docs/COMO_AGREGAR_MISION.md`.

## Seguridad del propio juego

- El navegador **nunca recibe** las respuestas correctas: `app.py` las valida en `/api/responder`.
- Las respuestas quedan registradas en `datos/cyberagent.db` como evidencia. El ranking solo cuenta las misiones que el servidor validó.
- La versión de un solo archivo (`build_offline.py`) sí lleva las respuestas adentro, así que úsala solo para practicar.

---
*Material educativo. Las prácticas reales se hacen únicamente en laboratorios propios, aislados y con autorización.*
© 2026 Andrés Felipe Beltrán Barrera
