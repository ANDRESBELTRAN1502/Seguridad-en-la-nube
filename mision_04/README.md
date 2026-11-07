# Misión 04 — La bóveda del volcado 🗄️

**Sector 04 · Bóveda de Datos** · Tema: Exposición de bases de datos y hashing
Basada en: Laboratorios SQLMAP y Base de datos DVWA
Creada por Andrés Felipe Beltrán Barrera

## Qué pasa en este nivel
- Recorres 6 salas llenas de equipos (racks, switches, monitores, núcleos de datos) y 3 terminales de información, y te enfrentas a **6 enemigos** (2 golpe(s) para vencer a cada uno).
- Cada respuesta incorrecta te quita **16 de vida** y tienes **40 segundos** por pregunta.
- Los enemigos patrullan al azar.
- Los primeros enemigos que derrotas sueltan las **3 pistas** para el guardián.
- Al derrotar a todos se abre la puerta sellada (L) de la sala de **Guardián Tomás**.
- Respondes la pregunta final, el portal (X) se activa y pasas al siguiente nivel.

## Cómo editar
Todo está en `mision.json`:
- `mapa`: dibujo ASCII del nivel (ver leyenda en `docs/COMO_AGREGAR_MISION.md`). Para poner otro enemigo agrega una `E`.
- `enemigos`: nombres, colores y frases (se asignan a las `E` en orden).
- `retos`: preguntas de combate. `correcta` es el índice de la opción (0 = A).
- `final`: la pregunta del guardián.
- `dificultad`: vida de enemigos, daño, tiempo, persecución y velocidad.


## Consola de comandos (pisa la estación CONSOLA en el centro de la sala, o tecla C / botón ⌨️)
Practica **Análisis HTTP** escribiendo comandos reales. Comandos clave:
- `curl -i http://10.10.10.7/`
- `echo q1rfe0huvvbfyja0m30= | base64 -d`

Bandera CTF de este nivel: `CTF{HTTP_8ad6}` (+70 XP). Se edita en el campo `consola` de `mision.json`.
