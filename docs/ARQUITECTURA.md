# Arquitectura — CyberAgent Academy
Creado por Andrés Felipe Beltrán Barrera

## Componentes

```
Navegador (static/js)                         Servidor Flask (app.py)
┌────────────────────────────┐   GET /api/misiones   ┌──────────────────────────┐
│ juego.js  pantallas, flujo │ ────────────────────▶ │ lee mision_*/mision.json │
│ motor.js  mapa, IA, render │   GET /api/mision/id  │ quita respuestas y flag  │
│ combate.js turnos, poderes │ ────────────────────▶ │                          │
│ api.js    llamadas HTTP    │  POST /api/responder  │ valida la opción         │
│ musica.js chiptune / MP3   │ ────────────────────▶   GET /api/musica
│ sonido.js efectos          │ ────────────────────▶ │ guarda en SQLite         │
└────────────────────────────┘  POST /api/descartar  │ (datos/cyberagent.db)    │
                                ────────────────────▶ │ poder Escáner            │
                                    GET /ranking      └──────────────────────────┘
```

## Flujo de un nivel
1. `abrirIntro()` descarga la misión sin respuestas y muestra la dificultad.
2. `cargarNivel()` (motor.js) convierte el mapa ASCII en paredes, enemigos, poderes, guardián y portal.
3. Bucle con `requestAnimationFrame`: mueve al jugador y a los enemigos (patrullan o persiguen según `dificultad`) y dibuja el mapa en el canvas.
4. Al chocar con un enemigo se ejecuta `iniciarCombate()` (combate.js). Cada respuesta se envía a `/api/responder`.
5. Cuando no quedan enemigos se activa `abierta = true` y la puerta `L` se puede cruzar.
6. Si se acierta la pregunta del guardián (`reto: "final"`), el servidor devuelve la flag y registra la misión como completada.
7. Al pisar el portal `X` el progreso se guarda en `localStorage` y aparece el resumen del nivel.

## Base de datos (`datos/cyberagent.db`)
| Tabla | Contenido |
|---|---|
| agentes | id (UUID del navegador), nombre |
| respuestas | cada respuesta enviada: misión, reto, opción, si fue correcta y la fecha (evidencia) |
| completadas | misiones validadas por el servidor y su XP (de aquí sale el ranking) |

## Modo sin servidor
`scripts/build_offline.py` renderiza `templates/index.html` y mete adentro el CSS, el JS, las imágenes y las misiones con `window.CAA_OFFLINE`. Así, `api.js` responde todo localmente.

## Animación y efectos (motor.js)
- **Sprites:** cada personaje tiene una hoja en `static/img/personajes/sprites/<id>.png`. Las personas tienen 4 direcciones × 4 cuadros de caminar y los enemigos 4 cuadros de animación. Si una imagen falta, se usa un dibujo de respaldo.
- **Partículas:** `C.fx.explosion`, `chispas`, `polvo` y `texto` (números flotantes), y `C.temblor()` para sacudir la cámara.
- **Tiles animados:** LEDs, gráficas, ventiladores, baterías y pulsos de datos se calculan con el tiempo (`now`) en cada cuadro.
- **Combate (combate.js):** un bucle `requestAnimationFrame` propio dibuja al rival y al agente con efectos `golpe`, `ataque` y `derrota`.

## Música (musica.js)
Es un secuenciador Web Audio con 4 voces (melodía de pulso, arpegio, bajo triangular y batería de ruido) que programa las notas con 150 ms de anticipación. Las pistas están escritas como texto (`"A4 - C5 ."`). `/api/musica` avisa si hay MP3 propios en `static/musica/`.
