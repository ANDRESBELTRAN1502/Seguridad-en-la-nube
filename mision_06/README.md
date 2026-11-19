# Misión 06 — El filtro de palabras prohibidas 🛡️

**Sector 06 · Puesto del Centinela** · Tema: Filtros de lista negra y codificación de salida
Basada en: Laboratorio XSS — DVWA nivel medio
Creada por Andrés Felipe Beltrán Barrera

## Qué pasa en este nivel
- Recorres 7 salas llenas de equipos (racks, switches, monitores, núcleos de datos) y 3 terminales de información, y te enfrentas a **7 enemigos** (2 golpe(s) para vencer a cada uno).
- Cada respuesta incorrecta te quita **20 de vida** y tienes **30 segundos** por pregunta.
- Los enemigos te **persiguen** cuando estás a 3 casillas o menos.
- Los primeros enemigos que derrotas sueltan las **3 pistas** para el guardián.
- Al derrotar a todos se abre la puerta sellada (L) de la sala de **Centinela Marco**.
- Respondes la pregunta final, el portal (X) se activa y pasas al siguiente nivel.

## Cómo editar
Todo está en `mision.json`:
- `mapa`: dibujo ASCII del nivel (ver leyenda en `docs/COMO_AGREGAR_MISION.md`). Para poner otro enemigo agrega una `E`.
- `enemigos`: nombres, colores y frases (se asignan a las `E` en orden).
- `retos`: preguntas de combate. `correcta` es el índice de la opción (0 = A).
- `final`: la pregunta del guardián.
- `dificultad`: vida de enemigos, daño, tiempo, persecución y velocidad.


## Consola de comandos (pisa la estación CONSOLA en el centro de la sala, o tecla C / botón ⌨️)
Practica **File upload** escribiendo comandos reales. Comandos clave:
- `cat nota.txt`
- `cp reporte.php reporte.php.png`

Bandera CTF de este nivel: `CTF{UPL04D_c8e7}` (+80 XP). Se edita en el campo `consola` de `mision.json`.
