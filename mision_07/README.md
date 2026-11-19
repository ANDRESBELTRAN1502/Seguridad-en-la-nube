# Misión 07 — El candado de cristal 🔍

**Sector 07 · Taller del Cliente** · Tema: Validaciones del lado del cliente
Basada en: Laboratorio XSS — campo maxlength en DVWA medio
Creada por Andrés Felipe Beltrán Barrera

## Qué pasa en este nivel
- Recorres 8 salas llenas de equipos (racks, switches, monitores, núcleos de datos) y 3 terminales de información, y te enfrentas a **7 enemigos** (2 golpe(s) para vencer a cada uno).
- Cada respuesta incorrecta te quita **22 de vida** y tienes **27 segundos** por pregunta.
- Los enemigos te **persiguen** cuando estás a 4 casillas o menos.
- Los primeros enemigos que derrotas sueltan las **3 pistas** para el guardián.
- Al derrotar a todos se abre la puerta sellada (L) de la sala de **Diseñadora Valentina**.
- Respondes la pregunta final, el portal (X) se activa y pasas al siguiente nivel.

## Cómo editar
Todo está en `mision.json`:
- `mapa`: dibujo ASCII del nivel (ver leyenda en `docs/COMO_AGREGAR_MISION.md`). Para poner otro enemigo agrega una `E`.
- `enemigos`: nombres, colores y frases (se asignan a las `E` en orden).
- `retos`: preguntas de combate. `correcta` es el índice de la opción (0 = A).
- `final`: la pregunta del guardián.
- `dificultad`: vida de enemigos, daño, tiempo, persecución y velocidad.


## Consola de comandos (pisa la estación CONSOLA en el centro de la sala, o tecla C / botón ⌨️)
Practica **Inyección de comandos** escribiendo comandos reales. Comandos clave:
- `ping 127.0.0.1`
- `127.0.0.1; cat flag_oculta.txt`

Bandera CTF de este nivel: `CTF{CMD1NJ_de0f}` (+90 XP). Se edita en el campo `consola` de `mision.json`.
