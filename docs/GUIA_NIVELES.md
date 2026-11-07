# Guía de niveles — CyberAgent Academy

Creado por **Andrés Felipe Beltrán Barrera**.
Generado automáticamente con `python scripts/generar_excel.py`.

## Nivel 01 · La puerta trasera del login 🔐

*Sector 01 · Puerta de Acceso* — SQL Injection en formularios (POST) — basado en: Laboratorio SQL Injection — Mutillidae, nivel bajo

Dificultad ★☆☆☆☆ · 4 enemigos × 1 golpe(s) · daño 10 · sin tiempo · patrullan

**Enemigos:** Bot Fuerza Bruta, Inyector Novato, Script Kiddie, Contraseña Débil

**Pasos:**

- En el mapa de niveles elige el nivel 1 y pulsa COMENZAR MISIÓN.
- Explora las salas y recoge poderes: 🛡 Escudo (1), 🔍 Escáner (1), 💊 Parche (1), ⚡ Turbo (0). Empiezas con 1 Escáner y 1 Parche.
- Choca con cada enemigo para combatir. Hay 4 y cada uno necesita 1 respuesta(s) correcta(s). Cada error quita 10 de vida.
- Los primeros 3 enemigos derrotados sueltan las pistas 🧩 (tecla P para verlas).
- Al caer el último enemigo se abre la puerta sellada de Profesora Ada. Habla con él/ella (tecla E).
- Responde la pregunta final: opción B — «Porque el servidor no distingue entre un dato y una instrucción, y la consulta puede alterarse». Si fallas pierdes 15 de vida y puedes volver a intentarlo.
- Entra al portal 🌀: ganas la flag CAA{C0NSULTAS_PARAMETRIZADAS} y pasas al nivel 2: Errores que hablan demasiado.

## Nivel 02 · Errores que hablan demasiado ⚠️

*Sector 02 · Sala de Errores* — Errores comunes en autenticación — basado en: Laboratorio SQL Injection — sección 'Errores comunes'

Dificultad ★☆☆☆☆ · 5 enemigos × 1 golpe(s) · daño 12 · sin tiempo · patrullan

**Enemigos:** Error 500, Admin Descuidado, Log Fugitivo, Traza Chismosa, Consulta Abierta

**Pasos:**

- En el mapa de niveles elige el nivel 2 y pulsa COMENZAR MISIÓN.
- Explora las salas y recoge poderes: 🛡 Escudo (1), 🔍 Escáner (1), 💊 Parche (1), ⚡ Turbo (0). Empiezas con 1 Escáner y 1 Parche.
- Choca con cada enemigo para combatir. Hay 5 y cada uno necesita 1 respuesta(s) correcta(s). Cada error quita 12 de vida.
- Los primeros 3 enemigos derrotados sueltan las pistas 🧩 (tecla P para verlas).
- Al caer el último enemigo se abre la puerta sellada de Ingeniero Bruno. Habla con él/ella (tecla E).
- Responde la pregunta final: opción C — «Mostrar errores genéricos y usar una cuenta de base de datos con privilegio mínimo». Si fallas pierdes 18 de vida y puedes volver a intentarlo.
- Entra al portal 🌀: ganas la flag CAA{ERR0RES_GENERIC0S} y pasas al nivel 3: Tres caminos de inyección.

## Nivel 03 · Tres caminos de inyección 🧭

*Sector 03 · Laberinto de Consultas* — SQLi por POST, GET y Blind — basado en: Laboratorio SQL Injection — conclusiones POST / GET / Blind

Dificultad ★★☆☆☆ · 5 enemigos × 1 golpe(s) · daño 14 · sin tiempo · patrullan

**Enemigos:** Sombra Booleana, URL Chismosa, Formulario Fantasma, Ciego del Tiempo, Retardo Sospechoso

**Pasos:**

- En el mapa de niveles elige el nivel 3 y pulsa COMENZAR MISIÓN.
- Explora las salas y recoge poderes: 🛡 Escudo (1), 🔍 Escáner (1), 💊 Parche (2), ⚡ Turbo (1). Empiezas con 1 Escáner y 1 Parche.
- Choca con cada enemigo para combatir. Hay 5 y cada uno necesita 1 respuesta(s) correcta(s). Cada error quita 14 de vida.
- Los primeros 3 enemigos derrotados sueltan las pistas 🧩 (tecla P para verlas).
- Al caer el último enemigo se abre la puerta sellada de Analista Sofía. Habla con él/ella (tecla E).
- Responde la pregunta final: opción A — «SQL Injection Blind (ciega)». Si fallas pierdes 21 de vida y puedes volver a intentarlo.
- Entra al portal 🌀: ganas la flag CAA{BL1ND_SQLI} y pasas al nivel 4: La bóveda del volcado.

## Nivel 04 · La bóveda del volcado 🗄️

*Sector 04 · Bóveda de Datos* — Exposición de bases de datos y hashing — basado en: Laboratorios SQLMAP y Base de datos DVWA

Dificultad ★★☆☆☆ · 6 enemigos × 2 golpe(s) · daño 16 · tiempo 40 s · patrullan

**Enemigos:** Volcador, Hash Débil, Tabla Expuesta, Reutilizador, Movimiento Lateral, Contraseña Repetida

**Pasos:**

- En el mapa de niveles elige el nivel 4 y pulsa COMENZAR MISIÓN.
- Explora las salas y recoge poderes: 🛡 Escudo (2), 🔍 Escáner (2), 💊 Parche (2), ⚡ Turbo (1). Empiezas con 1 Escáner y 1 Parche.
- Choca con cada enemigo para combatir. Hay 6 y cada uno necesita 2 respuesta(s) correcta(s). Cada error quita 16 de vida y tienes 40 s por pregunta.
- Los primeros 3 enemigos derrotados sueltan las pistas 🧩 (tecla P para verlas).
- Al caer el último enemigo se abre la puerta sellada de Guardián Tomás. Habla con él/ella (tecla E).
- Responde la pregunta final: opción B — «Almacenarlas con un algoritmo de hash robusto y salt». Si fallas pierdes 24 de vida y puedes volver a intentarlo.
- Entra al portal 🌀: ganas la flag CAA{HASH_C0N_SALT} y pasas al nivel 5: El eco reflejado y el eco guardado.

## Nivel 05 · El eco reflejado y el eco guardado 📚

*Sector 05 · Biblioteca de Ecos* — XSS reflejado vs. XSS almacenado — basado en: Laboratorio XSS — DVWA y Mutillidae, nivel bajo

Dificultad ★★★☆☆ · 6 enemigos × 2 golpe(s) · daño 18 · tiempo 35 s · te persiguen

**Enemigos:** Eco Reflejado, Eco Guardado, Comentario Tóxico, Enlace Trampa, Script Errante, Comentario Eterno

**Pasos:**

- En el mapa de niveles elige el nivel 5 y pulsa COMENZAR MISIÓN.
- Explora las salas y recoge poderes: 🛡 Escudo (2), 🔍 Escáner (2), 💊 Parche (2), ⚡ Turbo (1). Empiezas con 1 Escáner y 1 Parche.
- Choca con cada enemigo para combatir. Hay 6 y cada uno necesita 2 respuesta(s) correcta(s). Cada error quita 18 de vida y tienes 35 s por pregunta.
- Los primeros 3 enemigos derrotados sueltan las pistas 🧩 (tecla P para verlas).
- Al caer el último enemigo se abre la puerta sellada de Bibliotecaria Lía. Habla con él/ella (tecla E).
- Responde la pregunta final: opción A — «XSS almacenado (Stored)». Si fallas pierdes 27 de vida y puedes volver a intentarlo.
- Entra al portal 🌀: ganas la flag CAA{XSS_ST0RED} y pasas al nivel 6: El filtro de palabras prohibidas.

## Nivel 06 · El filtro de palabras prohibidas 🛡️

*Sector 06 · Puesto del Centinela* — Filtros de lista negra y codificación de salida — basado en: Laboratorio XSS — DVWA nivel medio

Dificultad ★★★☆☆ · 7 enemigos × 2 golpe(s) · daño 20 · tiempo 30 s · te persiguen

**Enemigos:** Evasor de Filtros, Máscara Mayúscula, Lista Negra Rota, Código Camuflado, Inyector Contextual, Saltafiltros, Etiqueta Rebelde

**Pasos:**

- En el mapa de niveles elige el nivel 6 y pulsa COMENZAR MISIÓN.
- Explora las salas y recoge poderes: 🛡 Escudo (2), 🔍 Escáner (2), 💊 Parche (3), ⚡ Turbo (1). Empiezas con 1 Escáner y 1 Parche.
- Choca con cada enemigo para combatir. Hay 7 y cada uno necesita 2 respuesta(s) correcta(s). Cada error quita 20 de vida y tienes 30 s por pregunta.
- Los primeros 3 enemigos derrotados sueltan las pistas 🧩 (tecla P para verlas).
- Al caer el último enemigo se abre la puerta sellada de Centinela Marco. Habla con él/ella (tecla E).
- Responde la pregunta final: opción C — «Codificar la salida según el contexto (htmlspecialchars) y aplicar CSP». Si fallas pierdes 30 de vida y puedes volver a intentarlo.
- Entra al portal 🌀: ganas la flag CAA{0UTPUT_ENC0DING} y pasas al nivel 7: El candado de cristal.

## Nivel 07 · El candado de cristal 🔍

*Sector 07 · Taller del Cliente* — Validaciones del lado del cliente — basado en: Laboratorio XSS — campo maxlength en DVWA medio

Dificultad ★★★★☆ · 7 enemigos × 2 golpe(s) · daño 22 · tiempo 27 s · te persiguen

**Enemigos:** Inspector Rebelde, Campo Oculto, Maxlength Roto, Validador Falso, Cliente Tramposo, Formulario Mutante, Hidden Travieso

**Pasos:**

- En el mapa de niveles elige el nivel 7 y pulsa COMENZAR MISIÓN.
- Explora las salas y recoge poderes: 🛡 Escudo (2), 🔍 Escáner (2), 💊 Parche (3), ⚡ Turbo (1). Empiezas con 1 Escáner y 1 Parche.
- Choca con cada enemigo para combatir. Hay 7 y cada uno necesita 2 respuesta(s) correcta(s). Cada error quita 22 de vida y tienes 27 s por pregunta.
- Los primeros 3 enemigos derrotados sueltan las pistas 🧩 (tecla P para verlas).
- Al caer el último enemigo se abre la puerta sellada de Diseñadora Valentina. Habla con él/ella (tecla E).
- Responde la pregunta final: opción B — «Que las validaciones del cliente se pueden modificar; hay que validar en el servidor». Si fallas pierdes 33 de vida y puedes volver a intentarlo.
- Entra al portal 🌀: ganas la flag CAA{VALIDA_EN_SERVID0R} y pasas al nivel 8: La galleta de sesión.

## Nivel 08 · La galleta de sesión 🍪

*Sector 08 · Oficina del Detective* — Cookies, HttpOnly e ingeniería social (BeEF) — basado en: Laboratorio BeEF — impacto de un XSS

Dificultad ★★★★☆ · 8 enemigos × 2 golpe(s) · daño 24 · tiempo 24 s · te persiguen

**Enemigos:** Ladrón de Galletas, Gancho del Navegador, Login Falso, Barra Falsa, Ventana Impostora, Sesión Robada, Notificación Trampa, Pop-up Mentiroso

**Pasos:**

- En el mapa de niveles elige el nivel 8 y pulsa COMENZAR MISIÓN.
- Explora las salas y recoge poderes: 🛡 Escudo (3), 🔍 Escáner (3), 💊 Parche (3), ⚡ Turbo (1). Empiezas con 1 Escáner y 1 Parche.
- Choca con cada enemigo para combatir. Hay 8 y cada uno necesita 2 respuesta(s) correcta(s). Cada error quita 24 de vida y tienes 24 s por pregunta.
- Los primeros 3 enemigos derrotados sueltan las pistas 🧩 (tecla P para verlas).
- Al caer el último enemigo se abre la puerta sellada de Detective Gabriel. Habla con él/ella (tecla E).
- Responde la pregunta final: opción A — «HttpOnly». Si fallas pierdes 36 de vida y puedes volver a intentarlo.
- Entra al portal 🌀: ganas la flag CAA{HTTP0NLY} y pasas al nivel 9: El archivo disfrazado.

## Nivel 09 · El archivo disfrazado 📦

*Sector 09 · Aduana de Archivos* — Carga segura de archivos — basado en: Laboratorio Carga de archivos y ejecución — DVWA bajo y medio

Dificultad ★★★★★ · 8 enemigos × 3 golpe(s) · daño 27 · tiempo 21 s · te persiguen

**Enemigos:** Archivo Disfrazado, Extensión Mentirosa, MIME Falso, Shell Oculta, Carga Ciega, Imagen Troyana, Cargador Infinito, Doble Extensión

**Pasos:**

- En el mapa de niveles elige el nivel 9 y pulsa COMENZAR MISIÓN.
- Explora las salas y recoge poderes: 🛡 Escudo (3), 🔍 Escáner (3), 💊 Parche (4), ⚡ Turbo (1). Empiezas con 1 Escáner y 1 Parche.
- Choca con cada enemigo para combatir. Hay 8 y cada uno necesita 3 respuesta(s) correcta(s). Cada error quita 27 de vida y tienes 21 s por pregunta.
- Los primeros 3 enemigos derrotados sueltan las pistas 🧩 (tecla P para verlas).
- Al caer el último enemigo se abre la puerta sellada de Custodia Elena. Habla con él/ella (tecla E).
- Responde la pregunta final: opción C — «Validar el contenido real en el servidor, renombrar los archivos y desactivar la ejecución en la carpeta de cargas». Si fallas pierdes 40 de vida y puedes volver a intentarlo.
- Entra al portal 🌀: ganas la flag CAA{UPL0AD_SEGUR0} y pasas al nivel 10: Agente Élite: el código ético.

## Nivel 10 · Agente Élite: el código ético 🏆

*Sector 10 · Torre de la Dirección* — Ética, autorización y alcance — basado en: Todos los laboratorios — entorno aislado 192.168.56.0/24

Dificultad ★★★★★ · 9 enemigos × 3 golpe(s) · daño 30 · tiempo 18 s · te persiguen

**Enemigos:** Tentación Ilegal, Fuera de Alcance, Divulgador Imprudente, Sin Autorización, Curioso Peligroso, Ego Hacker, Atajo Prohibido, Último Firewall, Atajo Oscuro

**Pasos:**

- En el mapa de niveles elige el nivel 10 y pulsa COMENZAR MISIÓN.
- Explora las salas y recoge poderes: 🛡 Escudo (3), 🔍 Escáner (3), 💊 Parche (4), ⚡ Turbo (1). Empiezas con 1 Escáner y 1 Parche.
- Choca con cada enemigo para combatir. Hay 9 y cada uno necesita 3 respuesta(s) correcta(s). Cada error quita 30 de vida y tienes 18 s por pregunta.
- Los primeros 3 enemigos derrotados sueltan las pistas 🧩 (tecla P para verlas).
- Al caer el último enemigo se abre la puerta sellada de Directora Nova. Habla con él/ella (tecla E).
- Responde la pregunta final: opción B — «No probarla; trabajar solo con autorización y alcance definido, y avisar por un canal responsable». Si fallas pierdes 45 de vida y puedes volver a intentarlo.
- Entra al portal 🌀: ganas la flag CAA{AGENTE_ELITE_ETIC0} y recibes el certificado de Agente Élite.
