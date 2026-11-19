# Misión 03 — Tres caminos de inyección 🧭

**Sector 03 · Laberinto de Consultas** · Tema: SQLi por POST, GET y Blind
Basada en: Laboratorio SQL Injection — conclusiones POST / GET / Blind
Creada por Andrés Felipe Beltrán Barrera

## Qué pasa en este nivel
- Recorres 5 salas llenas de equipos (racks, switches, monitores, núcleos de datos) y 2 terminales de información, y te enfrentas a **5 enemigos** (1 golpe(s) para vencer a cada uno).
- Cada respuesta incorrecta te quita **14 de vida**.
- Los enemigos patrullan al azar.
- Los primeros enemigos que derrotas sueltan las **3 pistas** para el guardián.
- Al derrotar a todos se abre la puerta sellada (L) de la sala de **Analista Sofía**.
- Respondes la pregunta final, el portal (X) se activa y pasas al siguiente nivel.

## Cómo editar
Todo está en `mision.json`:
- `mapa`: dibujo ASCII del nivel (ver leyenda en `docs/COMO_AGREGAR_MISION.md`). Para poner otro enemigo agrega una `E`.
- `enemigos`: nombres, colores y frases (se asignan a las `E` en orden).
- `retos`: preguntas de combate. `correcta` es el índice de la opción (0 = A).
- `final`: la pregunta del guardián.
- `dificultad`: vida de enemigos, daño, tiempo, persecución y velocidad.


## Consola de comandos (pisa la estación CONSOLA en el centro de la sala, o tecla C / botón ⌨️)
Practica **Enumeración web** escribiendo comandos reales. Comandos clave:
- `gobuster dir -u http://10.10.10.7 -w wordlist.txt`
- `curl http://10.10.10.7/gestion-interna/`

Bandera CTF de este nivel: `CTF{3NUM_a59e}` (+70 XP). Se edita en el campo `consola` de `mision.json`.
