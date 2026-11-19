# Misión 09 — El archivo disfrazado 📦

**Sector 09 · Aduana de Archivos** · Tema: Carga segura de archivos
Basada en: Laboratorio Carga de archivos y ejecución — DVWA bajo y medio
Creada por Andrés Felipe Beltrán Barrera

## Qué pasa en este nivel
- Recorres 9 salas llenas de equipos (racks, switches, monitores, núcleos de datos) y 3 terminales de información, y te enfrentas a **8 enemigos** (3 golpe(s) para vencer a cada uno).
- Cada respuesta incorrecta te quita **27 de vida** y tienes **21 segundos** por pregunta.
- Los enemigos te **persiguen** cuando estás a 5 casillas o menos.
- Los primeros enemigos que derrotas sueltan las **3 pistas** para el guardián.
- Al derrotar a todos se abre la puerta sellada (L) de la sala de **Custodia Elena**.
- Respondes la pregunta final, el portal (X) se activa y pasas al siguiente nivel.

## Cómo editar
Todo está en `mision.json`:
- `mapa`: dibujo ASCII del nivel (ver leyenda en `docs/COMO_AGREGAR_MISION.md`). Para poner otro enemigo agrega una `E`.
- `enemigos`: nombres, colores y frases (se asignan a las `E` en orden).
- `retos`: preguntas de combate. `correcta` es el índice de la opción (0 = A).
- `final`: la pregunta del guardián.
- `dificultad`: vida de enemigos, daño, tiempo, persecución y velocidad.


## Consola de comandos (pisa la estación CONSOLA en el centro de la sala, o tecla C / botón ⌨️)
Practica **XSS** escribiendo comandos reales. Comandos clave:
- `curl http://10.10.10.7/buscar?q=hola`
- `curl http://10.10.10.7/buscar?q=<script>alert(1)</script>`

Bandera CTF de este nivel: `CTF{XSS_dbdf}` (+100 XP). Se edita en el campo `consola` de `mision.json`.
