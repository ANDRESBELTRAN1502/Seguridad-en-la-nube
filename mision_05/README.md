# Misión 05 — El eco reflejado y el eco guardado 📚

**Sector 05 · Biblioteca de Ecos** · Tema: XSS reflejado vs. XSS almacenado
Basada en: Laboratorio XSS — DVWA y Mutillidae, nivel bajo
Creada por Andrés Felipe Beltrán Barrera

## Qué pasa en este nivel
- Recorres 6 salas llenas de equipos (racks, switches, monitores, núcleos de datos) y 3 terminales de información, y te enfrentas a **6 enemigos** (2 golpe(s) para vencer a cada uno).
- Cada respuesta incorrecta te quita **18 de vida** y tienes **35 segundos** por pregunta.
- Los enemigos te **persiguen** cuando estás a 3 casillas o menos.
- Los primeros enemigos que derrotas sueltan las **3 pistas** para el guardián.
- Al derrotar a todos se abre la puerta sellada (L) de la sala de **Bibliotecaria Lía**.
- Respondes la pregunta final, el portal (X) se activa y pasas al siguiente nivel.

## Cómo editar
Todo está en `mision.json`:
- `mapa`: dibujo ASCII del nivel (ver leyenda en `docs/COMO_AGREGAR_MISION.md`). Para poner otro enemigo agrega una `E`.
- `enemigos`: nombres, colores y frases (se asignan a las `E` en orden).
- `retos`: preguntas de combate. `correcta` es el índice de la opción (0 = A).
- `final`: la pregunta del guardián.
- `dificultad`: vida de enemigos, daño, tiempo, persecución y velocidad.


## Consola de comandos (pisa la estación CONSOLA en el centro de la sala, o tecla C / botón ⌨️)
Practica **Gestión de sesiones** escribiendo comandos reales. Comandos clave:
- `cat cookies.txt`
- `curl -b rol=admin http://10.10.10.7/panel`

Bandera CTF de este nivel: `CTF{S3SS10N_d966}` (+80 XP). Se edita en el campo `consola` de `mision.json`.
