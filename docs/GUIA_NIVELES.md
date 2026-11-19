# Guía de niveles — CyberAgent Academy

Creado por **Andrés Felipe Beltrán Barrera**.
Generado automáticamente con `python scripts/generar_excel.py`.

## Nivel 01 · La torre de los puertos 🛰️

*Sector 01 · Torre de Reconocimiento* — Reconocimiento y escaneo de puertos con Nmap — basado en: Laboratorio SQL Injection — Mutillidae, nivel bajo

Dificultad ★☆☆☆☆ · 4 enemigos × 1 golpe(s) · daño 10 · sin tiempo · patrullan

**Enemigos:** Bot Fuerza Bruta, Inyector Novato, Script Kiddie, Contraseña Débil

**Pasos:**

- En el mapa de niveles elige el nivel 1 y pulsa COMENZAR MISIÓN.
- Explora las salas y recoge poderes: 🛡 Escudo (1), 🔍 Escáner (1), 💊 Parche (1), ⚡ Turbo (0). Empiezas con 1 Escáner y 1 Parche.
- Choca con cada enemigo para combatir. Hay 4 y cada uno necesita 1 respuesta(s) correcta(s). Cada error quita 10 de vida.
- Los primeros 3 enemigos derrotados sueltan las pistas 🧩 (tecla P para verlas).
- Al caer el último enemigo se abre la puerta sellada de Profesora Ada. Habla con él/ella (tecla E).
- Responde la pregunta final: opción A — «nmap -sV 10.10.10.7». Si fallas pierdes 15 de vida y puedes volver a intentarlo.
- Entra al portal 🌀: ganas la flag nmap y pasas al nivel 2: Las huellas públicas.

## Nivel 02 · Las huellas públicas 🔎

*Sector 02 · Sala de Rastros* — Búsqueda pasiva de información (OSINT) — basado en: Laboratorio SQL Injection — sección 'Errores comunes'

Dificultad ★☆☆☆☆ · 5 enemigos × 1 golpe(s) · daño 12 · sin tiempo · patrullan

**Enemigos:** Error 500, Admin Descuidado, Log Fugitivo, Traza Chismosa, Consulta Abierta

**Pasos:**

- En el mapa de niveles elige el nivel 2 y pulsa COMENZAR MISIÓN.
- Explora las salas y recoge poderes: 🛡 Escudo (1), 🔍 Escáner (1), 💊 Parche (1), ⚡ Turbo (0). Empiezas con 1 Escáner y 1 Parche.
- Choca con cada enemigo para combatir. Hay 5 y cada uno necesita 1 respuesta(s) correcta(s). Cada error quita 12 de vida.
- Los primeros 3 enemigos derrotados sueltan las pistas 🧩 (tecla P para verlas).
- Al caer el último enemigo se abre la puerta sellada de Profesora Ada. Habla con él/ella (tecla E).
- Responde la pregunta final: opción A — «En /robots.txt con curl». Si fallas pierdes 18 de vida y puedes volver a intentarlo.
- Entra al portal 🌀: ganas la flag osint y pasas al nivel 3: El laberinto de directorios ocultos.

## Nivel 03 · El laberinto de directorios ocultos 🗂️

*Sector 03 · Laberinto de Rutas* — Enumeración web de directorios con Gobuster — basado en: Laboratorio SQL Injection — conclusiones POST / GET / Blind

Dificultad ★★☆☆☆ · 5 enemigos × 1 golpe(s) · daño 14 · sin tiempo · patrullan

**Enemigos:** Sombra Booleana, URL Chismosa, Formulario Fantasma, Ciego del Tiempo, Retardo Sospechoso

**Pasos:**

- En el mapa de niveles elige el nivel 3 y pulsa COMENZAR MISIÓN.
- Explora las salas y recoge poderes: 🛡 Escudo (1), 🔍 Escáner (1), 💊 Parche (2), ⚡ Turbo (1). Empiezas con 1 Escáner y 1 Parche.
- Choca con cada enemigo para combatir. Hay 5 y cada uno necesita 1 respuesta(s) correcta(s). Cada error quita 14 de vida.
- Los primeros 3 enemigos derrotados sueltan las pistas 🧩 (tecla P para verlas).
- Al caer el último enemigo se abre la puerta sellada de Profesora Ada. Habla con él/ella (tecla E).
- Responde la pregunta final: opción A — «gobuster». Si fallas pierdes 21 de vida y puedes volver a intentarlo.
- Entra al portal 🌀: ganas la flag gobuster y pasas al nivel 4: El mensaje en las cabeceras.

## Nivel 04 · El mensaje en las cabeceras 🧾

*Sector 04 · Bóveda de Cabeceras* — Análisis de cabeceras HTTP y Base64 — basado en: Laboratorios SQLMAP y Base de datos DVWA

Dificultad ★★☆☆☆ · 6 enemigos × 2 golpe(s) · daño 16 · tiempo 40 s · patrullan

**Enemigos:** Volcador, Hash Débil, Tabla Expuesta, Reutilizador, Movimiento Lateral, Contraseña Repetida

**Pasos:**

- En el mapa de niveles elige el nivel 4 y pulsa COMENZAR MISIÓN.
- Explora las salas y recoge poderes: 🛡 Escudo (2), 🔍 Escáner (2), 💊 Parche (2), ⚡ Turbo (1). Empiezas con 1 Escáner y 1 Parche.
- Choca con cada enemigo para combatir. Hay 6 y cada uno necesita 2 respuesta(s) correcta(s). Cada error quita 16 de vida y tienes 40 s por pregunta.
- Los primeros 3 enemigos derrotados sueltan las pistas 🧩 (tecla P para verlas).
- Al caer el último enemigo se abre la puerta sellada de Profesora Ada. Habla con él/ella (tecla E).
- Responde la pregunta final: opción A — «echo YmFzZTY0 | base64 -d». Si fallas pierdes 24 de vida y puedes volver a intentarlo.
- Entra al portal 🌀: ganas la flag cabecera y pasas al nivel 5: La galleta del administrador.

## Nivel 05 · La galleta del administrador 🍪

*Sector 05 · Sala de Sesiones* — Gestión de sesiones y cookies — basado en: Laboratorio XSS — DVWA y Mutillidae, nivel bajo

Dificultad ★★★☆☆ · 6 enemigos × 2 golpe(s) · daño 18 · tiempo 35 s · te persiguen

**Enemigos:** Eco Reflejado, Eco Guardado, Comentario Tóxico, Enlace Trampa, Script Errante, Comentario Eterno

**Pasos:**

- En el mapa de niveles elige el nivel 5 y pulsa COMENZAR MISIÓN.
- Explora las salas y recoge poderes: 🛡 Escudo (2), 🔍 Escáner (2), 💊 Parche (2), ⚡ Turbo (1). Empiezas con 1 Escáner y 1 Parche.
- Choca con cada enemigo para combatir. Hay 6 y cada uno necesita 2 respuesta(s) correcta(s). Cada error quita 18 de vida y tienes 35 s por pregunta.
- Los primeros 3 enemigos derrotados sueltan las pistas 🧩 (tecla P para verlas).
- Al caer el último enemigo se abre la puerta sellada de Profesora Ada. Habla con él/ella (tecla E).
- Responde la pregunta final: opción A — «curl -b rol=admin http://10.10.10.7/panel». Si fallas pierdes 27 de vida y puedes volver a intentarlo.
- Entra al portal 🌀: ganas la flag cookie y pasas al nivel 6: El archivo disfrazado.

## Nivel 06 · El archivo disfrazado 📤

*Sector 06 · Aduana de Archivos* — Subida de archivos insegura (file upload) — basado en: Laboratorio XSS — DVWA nivel medio

Dificultad ★★★☆☆ · 7 enemigos × 2 golpe(s) · daño 20 · tiempo 30 s · te persiguen

**Enemigos:** Evasor de Filtros, Máscara Mayúscula, Lista Negra Rota, Código Camuflado, Inyector Contextual, Saltafiltros, Etiqueta Rebelde

**Pasos:**

- En el mapa de niveles elige el nivel 6 y pulsa COMENZAR MISIÓN.
- Explora las salas y recoge poderes: 🛡 Escudo (2), 🔍 Escáner (2), 💊 Parche (3), ⚡ Turbo (1). Empiezas con 1 Escáner y 1 Parche.
- Choca con cada enemigo para combatir. Hay 7 y cada uno necesita 2 respuesta(s) correcta(s). Cada error quita 20 de vida y tienes 30 s por pregunta.
- Los primeros 3 enemigos derrotados sueltan las pistas 🧩 (tecla P para verlas).
- Al caer el último enemigo se abre la puerta sellada de Profesora Ada. Habla con él/ella (tecla E).
- Responde la pregunta final: opción A — «reporte.php.png». Si fallas pierdes 30 de vida y puedes volver a intentarlo.
- Entra al portal 🌀: ganas la flag upload y pasas al nivel 7: La orden encadenada.

## Nivel 07 · La orden encadenada ⛓️

*Sector 07 · Sala de Comandos* — Inyección de comandos — basado en: Laboratorio XSS — campo maxlength en DVWA medio

Dificultad ★★★★☆ · 7 enemigos × 2 golpe(s) · daño 22 · tiempo 27 s · te persiguen

**Enemigos:** Inspector Rebelde, Campo Oculto, Maxlength Roto, Validador Falso, Cliente Tramposo, Formulario Mutante, Hidden Travieso

**Pasos:**

- En el mapa de niveles elige el nivel 7 y pulsa COMENZAR MISIÓN.
- Explora las salas y recoge poderes: 🛡 Escudo (2), 🔍 Escáner (2), 💊 Parche (3), ⚡ Turbo (1). Empiezas con 1 Escáner y 1 Parche.
- Choca con cada enemigo para combatir. Hay 7 y cada uno necesita 2 respuesta(s) correcta(s). Cada error quita 22 de vida y tienes 27 s por pregunta.
- Los primeros 3 enemigos derrotados sueltan las pistas 🧩 (tecla P para verlas).
- Al caer el último enemigo se abre la puerta sellada de Profesora Ada. Habla con él/ella (tecla E).
- Responde la pregunta final: opción A — «127.0.0.1; cat flag.txt». Si fallas pierdes 33 de vida y puedes volver a intentarlo.
- Entra al portal 🌀: ganas la flag comando y pasas al nivel 8: La imagen que esconde secretos.

## Nivel 08 · La imagen que esconde secretos 🖼️

*Sector 08 · Cámara Oculta* — Esteganografía — basado en: Laboratorio BeEF — impacto de un XSS

Dificultad ★★★★☆ · 8 enemigos × 2 golpe(s) · daño 24 · tiempo 24 s · te persiguen

**Enemigos:** Ladrón de Galletas, Gancho del Navegador, Login Falso, Barra Falsa, Ventana Impostora, Sesión Robada, Notificación Trampa, Pop-up Mentiroso

**Pasos:**

- En el mapa de niveles elige el nivel 8 y pulsa COMENZAR MISIÓN.
- Explora las salas y recoge poderes: 🛡 Escudo (3), 🔍 Escáner (3), 💊 Parche (3), ⚡ Turbo (1). Empiezas con 1 Escáner y 1 Parche.
- Choca con cada enemigo para combatir. Hay 8 y cada uno necesita 2 respuesta(s) correcta(s). Cada error quita 24 de vida y tienes 24 s por pregunta.
- Los primeros 3 enemigos derrotados sueltan las pistas 🧩 (tecla P para verlas).
- Al caer el último enemigo se abre la puerta sellada de Profesora Ada. Habla con él/ella (tecla E).
- Responde la pregunta final: opción A — «strings agente_secreto.png». Si fallas pierdes 36 de vida y puedes volver a intentarlo.
- Entra al portal 🌀: ganas la flag stego y pasas al nivel 9: El espejo del navegador.

## Nivel 09 · El espejo del navegador 🪞

*Sector 09 · Galería de Espejos* — Cross-Site Scripting (XSS reflejado) — basado en: Laboratorio Carga de archivos y ejecución — DVWA bajo y medio

Dificultad ★★★★★ · 8 enemigos × 3 golpe(s) · daño 27 · tiempo 21 s · te persiguen

**Enemigos:** Archivo Disfrazado, Extensión Mentirosa, MIME Falso, Shell Oculta, Carga Ciega, Imagen Troyana, Cargador Infinito, Doble Extensión

**Pasos:**

- En el mapa de niveles elige el nivel 9 y pulsa COMENZAR MISIÓN.
- Explora las salas y recoge poderes: 🛡 Escudo (3), 🔍 Escáner (3), 💊 Parche (4), ⚡ Turbo (1). Empiezas con 1 Escáner y 1 Parche.
- Choca con cada enemigo para combatir. Hay 8 y cada uno necesita 3 respuesta(s) correcta(s). Cada error quita 27 de vida y tienes 21 s por pregunta.
- Los primeros 3 enemigos derrotados sueltan las pistas 🧩 (tecla P para verlas).
- Al caer el último enemigo se abre la puerta sellada de Profesora Ada. Habla con él/ella (tecla E).
- Responde la pregunta final: opción A — «<script>alert(1)</script>». Si fallas pierdes 40 de vida y puedes volver a intentarlo.
- Entra al portal 🌀: ganas la flag xss y pasas al nivel 10: El núcleo del contenedor.

## Nivel 10 · El núcleo del contenedor 🐳

*Sector 10 · Torre de la Dirección* — Linux, Docker y escalada de privilegios — basado en: Todos los laboratorios — entorno aislado 192.168.56.0/24

Dificultad ★★★★★ · 9 enemigos × 3 golpe(s) · daño 30 · tiempo 18 s · te persiguen

**Enemigos:** Tentación Ilegal, Fuera de Alcance, Divulgador Imprudente, Sin Autorización, Curioso Peligroso, Ego Hacker, Atajo Prohibido, Último Firewall, Atajo Oscuro

**Pasos:**

- En el mapa de niveles elige el nivel 10 y pulsa COMENZAR MISIÓN.
- Explora las salas y recoge poderes: 🛡 Escudo (3), 🔍 Escáner (3), 💊 Parche (4), ⚡ Turbo (1). Empiezas con 1 Escáner y 1 Parche.
- Choca con cada enemigo para combatir. Hay 9 y cada uno necesita 3 respuesta(s) correcta(s). Cada error quita 30 de vida y tienes 18 s por pregunta.
- Los primeros 3 enemigos derrotados sueltan las pistas 🧩 (tecla P para verlas).
- Al caer el último enemigo se abre la puerta sellada de Ing. Esp. Fabián Gutiérrez. Habla con él/ella (tecla E).
- Responde la pregunta final: opción A — «env». Si fallas pierdes 45 de vida y puedes volver a intentarlo.
- Entra al portal 🌀: ganas la flag docker y recibes el certificado de Agente Élite.
