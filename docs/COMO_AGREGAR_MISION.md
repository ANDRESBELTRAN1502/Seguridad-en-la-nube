# Cómo agregar, quitar o editar misiones
Creado por Andrés Felipe Beltrán Barrera

Cada nivel vive en su propia carpeta `mision_XX/`. El servidor las ordena por el campo `orden` del JSON.

## Crear una misión nueva
```bash
python scripts/nueva_mision.py "La red inalámbrica" --salas 5 --enemigos 6 --estrellas 4
```
El script crea `mision_11/mision.json` con una plantilla y un mapa generado. Llena los textos y luego ejecuta:
```bash
python scripts/validar_misiones.py
python scripts/generar_excel.py
```

## Campos de `mision.json`
| Campo | Para qué sirve |
|---|---|
| `orden` | posición del nivel en el mapa de niveles |
| `titulo`, `sector`, `tema`, `laboratorio`, `icono`, `objetivo` | textos que se muestran en la intro |
| `colores.piso_a / piso_b` | colores del piso (ajedrez) |
| `dificultad.vida_enemigo` | respuestas correctas necesarias para vencer a cada enemigo |
| `dificultad.dano` / `dano_guardian` | vida que pierdes por cada error |
| `dificultad.tiempo` | segundos por pregunta (0 = sin límite) |
| `dificultad.persigue`, `radio` | si los enemigos te persiguen y desde cuántas casillas |
| `dificultad.velocidad_ms` | cada cuántos ms se mueve un enemigo (menos = más rápido) |
| `xp.por_golpe`, `xp.final` | puntos por respuesta correcta y por el guardián |
| `guardian` | nombre, color e `historia` (lista de líneas de diálogo) |
| `pistas` | las pistas que sueltan los primeros enemigos derrotados |
| `enemigos` | nombre, color y frase; se asignan en orden a cada `E` del mapa |
| `retos` | preguntas de combate: `id`, `pregunta`, `opciones`, `correcta` (0 = A), `explicacion` |
| `final` | pregunta del guardián con `defensa` |
| `flag` | código que gana el jugador |
| `mapa` | dibujo ASCII del nivel (todas las filas del mismo largo) |

## Leyenda del mapa
```
Estructura:  #  pared        .  piso         L  puerta sellada (se abre al vencer a todos)
Personajes:  S  inicio (uno) E  enemigo      G  guardián (uno)      X  portal (uno)
Poderes:     1  escudo       2  escáner      3  parche              4  turbo
Equipos (no se pueden atravesar):
             R  rack de servidores           N  switch / router de red
             D  escritorio con PC            T  terminal
             M  muro de monitores            C  unidad de enfriamiento (ventilador)
             U  UPS / baterías               H  núcleo de datos
             P  planta                       I  terminal de información (se lee con E)
Decoración (se camina encima):
             k  cableado en el piso          g  rejilla de ventilación
```
Cada `I` del mapa usa, en orden, un texto de la lista `"terminales": [{"titulo": "...", "texto": "..."}]`.
Cada enemigo puede tener `"sprite"` (id de la imagen en `static/img/personajes/sprites/`) y `"tipo"`
(bicho, virus, fantasma, slime, robot, ojo) para elegir su forma; luego ejecuta `python scripts/generar_personajes.py`.

Para poner un enemigo más basta con cambiar un `.` por una `E`. Para hacer el nivel más difícil, sube `vida_enemigo` o `dano`, o baja `tiempo`.

Si prefieres generar un mapa nuevo:
```bash
python scripts/generar_mapa.py --salas 6 --enemigos 7 --nivel 6 --semilla 42
```
Copia lo que imprime dentro de `"mapa": [ ... ]`, poniendo cada fila entre comillas.

## Quitar una misión
Borra su carpeta o muévela fuera del proyecto. El juego deja de mostrarla de inmediato.
