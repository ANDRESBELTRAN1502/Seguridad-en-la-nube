# Misión 10 — Agente Élite: el código ético 🏆

**Sector 10 · Torre de la Dirección** · Tema: Ética, autorización y alcance
Basada en: Todos los laboratorios — entorno aislado 192.168.56.0/24
Creada por Andrés Felipe Beltrán Barrera

## Qué pasa en este nivel
- Recorres 10 salas llenas de equipos (racks, switches, monitores, núcleos de datos) y 3 terminales de información, y te enfrentas a **9 enemigos** (3 golpe(s) para vencer a cada uno).
- Cada respuesta incorrecta te quita **30 de vida** y tienes **18 segundos** por pregunta.
- Los enemigos te **persiguen** cuando estás a 5 casillas o menos.
- Los primeros enemigos que derrotas sueltan las **3 pistas** para el guardián.
- Al derrotar a todos se abre la puerta sellada (L) de la sala de **Directora Nova**.
- Respondes la pregunta final, el portal (X) se activa y pasas al siguiente nivel.

## Cómo editar
Todo está en `mision.json`:
- `mapa`: dibujo ASCII del nivel (ver leyenda en `docs/COMO_AGREGAR_MISION.md`). Para poner otro enemigo agrega una `E`.
- `enemigos`: nombres, colores y frases (se asignan a las `E` en orden).
- `retos`: preguntas de combate. `correcta` es el índice de la opción (0 = A).
- `final`: la pregunta del guardián.
- `dificultad`: vida de enemigos, daño, tiempo, persecución y velocidad.


## Consola de comandos (pisa la estación CONSOLA en el centro de la sala, o tecla C / botón ⌨️)
Practica **Linux y Docker** escribiendo comandos reales. Comandos clave:
- `sudo -l`
- `sudo cat /opt/respaldo/flag.txt`
- `env`

Bandera CTF de este nivel: `CTF{D0CK3R_02ef}` (+110 XP). Se edita en el campo `consola` de `mision.json`.
