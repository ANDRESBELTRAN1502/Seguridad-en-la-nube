// Documentación COMPLETA (blanco y negro, sin portada) de CyberAgent Academy.
// Creado por Andrés Felipe Beltrán Barrera.
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, PageBreak,
} = require("docx");

const M = JSON.parse(fs.readFileSync("/tmp/fulldoc.json", "utf8"));
const L = "ABCD";
const NEG = "000000", GRISH = "D9D9D9", CAJA = "F2F2F2", GRIS = "595959";
const AUTOR = "Andrés Felipe Beltrán Barrera";
const C = [];
const P = (o) => new Paragraph(o);
const T = (t, o = {}) => new TextRun({ text: t, font: o.mono ? "Consolas" : "Calibri", size: o.size || 22, bold: o.bold, italics: o.italics, color: o.color || NEG });
const H1 = (t) => C.push(P({ heading: HeadingLevel.HEADING_1, children: [T(t, { bold: true, size: 30 })] }));
const H2 = (t) => C.push(P({ heading: HeadingLevel.HEADING_2, children: [T(t, { bold: true, size: 26 })] }));
const H3 = (t) => C.push(P({ heading: HeadingLevel.HEADING_3, children: [T(t, { bold: true, size: 23 })] }));
const par = (runs, o = {}) => C.push(P({ spacing: { after: o.after == null ? 140 : o.after, before: o.before || 0 }, alignment: o.just ? AlignmentType.JUSTIFIED : undefined, children: Array.isArray(runs) ? runs : [T(runs)] }));
const bullet = (runs, lvl = 0) => C.push(P({ bullet: { level: lvl }, spacing: { after: 40 }, children: Array.isArray(runs) ? runs : [T(runs)] }));
const num = (runs, ref) => C.push(P({ numbering: { reference: ref, level: 0 }, spacing: { after: 40 }, children: Array.isArray(runs) ? runs : [T(runs)] }));
const code = (t) => T(t, { mono: true, size: 20 });
const pageBreak = () => C.push(P({ children: [new PageBreak()] }));

function caja(lineas) { // bloque tipo terminal, gris claro, monoespaciado negro
  const parr = lineas.map((l, i) => P({ children: [new TextRun({ text: l, font: "Consolas", size: 18, color: NEG })],
    shading: { type: ShadingType.CLEAR, fill: CAJA, color: "auto" }, spacing: { before: i === 0 ? 40 : 0, after: 0, line: 240 }, indent: { left: 100, right: 100 } }));
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [9360],
    borders: { top: { style: BorderStyle.SINGLE, size: 4, color: GRIS }, bottom: { style: BorderStyle.SINGLE, size: 4, color: GRIS }, left: { style: BorderStyle.SINGLE, size: 4, color: GRIS }, right: { style: BorderStyle.SINGLE, size: 4, color: GRIS }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
    rows: [new TableRow({ children: [new TableCell({ width: { size: 9360, type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, fill: CAJA, color: "auto" }, margins: { top: 80, bottom: 80, left: 60, right: 60 }, children: parr })] })] });
}
function tabla(cols, headers, filas, opts = {}) {
  const celda = (txt, o = {}) => new TableCell({ width: { size: o.w, type: WidthType.DXA },
    shading: o.head ? { type: ShadingType.CLEAR, fill: GRISH, color: "auto" } : undefined,
    margins: { top: 40, bottom: 40, left: 90, right: 90 },
    children: [P({ children: Array.isArray(txt) ? txt : [T(String(txt), { bold: o.head || o.bold, size: 19, mono: o.mono })] })] });
  const rows = [new TableRow({ tableHeader: true, children: headers.map((h, i) => celda(h, { w: cols[i], head: true })) })];
  filas.forEach((f) => rows.push(new TableRow({ children: f.map((v, i) => celda(v, { w: cols[i], mono: opts.monoCol === i, bold: opts.boldCol === i })) })));
  C.push(new Table({ width: { size: cols.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: cols,
    borders: { top: { style: BorderStyle.SINGLE, size: 4, color: NEG }, bottom: { style: BorderStyle.SINGLE, size: 4, color: NEG }, left: { style: BorderStyle.SINGLE, size: 4, color: NEG }, right: { style: BorderStyle.SINGLE, size: 4, color: NEG }, insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "000000" }, insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "000000" } }, rows }));
}

// ===== Encabezado del documento (sin portada) =====
par([T("CyberAgent Academy", { bold: true, size: 36 })], { after: 40 });
par([T("Documentación completa del proyecto", { bold: true, size: 24, color: GRIS })], { after: 40 });
par([T("Videojuego educativo de hacking ético · Creado por " + AUTOR + " · Universidad de Cundinamarca · Ética Hacking, grupo 901N", { size: 20, color: GRIS })], { after: 60 });
C.push(P({ border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: NEG, space: 4 } }, spacing: { after: 160 }, children: [T("")] }));

// ===== 1. Introducción =====
H1("1. Introducción");
par("CyberAgent Academy es un videojuego educativo de tipo RPG (estilo Pokémon) orientado a la enseñanza del hacking ético. El jugador asume el papel de un agente de ciberseguridad que debe superar diez misiones para graduarse como Agente Élite. Cada misión está basada en un laboratorio real del curso y combina una historia, combates por preguntas, una consola de comandos y un sistema de recompensas.", { just: true });
par("El propósito del proyecto es que los conceptos de seguridad informática — inyección SQL, XSS, BeEF, carga de archivos, análisis HTTP, gestión de sesiones, reconocimiento, Linux y Docker — se aprendan de forma práctica, interactiva y segura, sin atacar sistemas reales: todo ocurre dentro del propio videojuego.", { just: true });

H2("1.1 Objetivos del proyecto");
bullet("Reforzar, mediante el juego, los conceptos vistos en los laboratorios de Ética Hacking.");
bullet("Practicar comandos reales de seguridad (nmap, curl, cat, strings, env, etc.) en una consola simulada.");
bullet("Entender no solo las vulnerabilidades, sino también sus defensas y buenas prácticas.");
bullet("Ofrecer un entorno seguro y controlado, sin riesgo para sistemas reales.");

// ===== 2. Tecnologías y arquitectura =====
H1("2. Tecnologías y arquitectura");
par("El proyecto se compone de un servidor y un cliente:");
bullet([T("Servidor (Python + Flask): ", { bold: true }), T("detecta las misiones, entrega los retos al navegador sin las respuestas, valida las banderas y guarda el progreso y el ranking en una base de datos SQLite.")]);
bullet([T("Cliente (HTML5 Canvas, CSS y JavaScript): ", { bold: true }), T("el motor del juego, que dibuja el mapa, mueve al personaje y a los enemigos, gestiona los combates, la consola, la música y los efectos.")]);
bullet([T("Versión offline: ", { bold: true }), T("un único archivo HTML que incluye todo y funciona sin servidor (sin ranking).")]);
par([T("Flujo general: ", { bold: true }), T("el navegador pide la lista de misiones y los datos de cada una; el jugador resuelve los retos; cada respuesta se envía al servidor, que la valida y, si es correcta, registra el avance. En la versión offline, esa validación la hace el propio navegador.")], { before: 60 });

// ===== 3. Mecánica del juego =====
H1("3. Mecánica del juego");
par("Cada nivel se desarrolla así:");
const refNum = "flujo";
num("El jugador aparece en una sala y explora el nivel recogiendo poderes.", refNum);
num("Al chocar con un enemigo comienza un combate por turnos: cada respuesta correcta es un golpe al enemigo y cada error le quita vida al agente.", refNum);
num("Los primeros enemigos derrotados sueltan las pistas necesarias para la pregunta final.", refNum);
num("Al vencer a todos los enemigos se abre la sala del guardián.", refNum);
num("El guardián plantea la pregunta final; si se acierta, se activa el portal, se gana la bandera del nivel y se desbloquea el siguiente.", refNum);
num("En el centro de la sala inicial hay una estación CONSOLA: al pisarla se abre una terminal para practicar comandos reales y obtener una bandera CTF.", refNum);

H2("3.1 Controles");
tabla([3200, 6160], ["Acción", "Tecla / forma"], [
  ["Moverse", "Flechas o WASD (control táctil en celular)"],
  ["Hablar / avanzar diálogo", "E, Espacio o Enter"],
  ["Responder en combate", "1, 2, 3, 4 (o A, B, C, D)"],
  ["Abrir la consola de comandos", "Pisar la estación CONSOLA, tecla C o botón de teclado"],
  ["Ver pistas", "P"],
  ["Usar parche / turbo", "3 / 4"],
], { boldCol: 0 });

H2("3.2 Poderes");
bullet([T("Escudo: ", { bold: true }), T("bloquea el próximo golpe en combate.")]);
bullet([T("Escáner: ", { bold: true }), T("tacha una respuesta incorrecta.")]);
bullet([T("Parche: ", { bold: true }), T("recupera 35 puntos de vida.")]);
bullet([T("Turbo: ", { bold: true }), T("aumenta la velocidad durante 20 segundos.")]);

H2("3.3 Progresión de dificultad");
par("La dificultad aumenta de forma gradual a lo largo de los diez niveles:");
tabla([4680, 4680], ["Aspecto", "Del nivel 1 al 10"], [
  ["Salas por nivel", "de 4 a 10"],
  ["Enemigos por nivel", "de 4 a 9"],
  ["Golpes para vencer a cada enemigo", "de 1 a 3"],
  ["Vida que quita cada error", "de 10 a 30"],
  ["Tiempo por pregunta", "sin límite, luego 18 s (desde el nivel 4)"],
  ["Persecución de enemigos", "no, luego sí y más rápido (desde el nivel 5)"],
  ["Opciones por pregunta", "3, luego 4 (desde el nivel 5)"],
], { boldCol: 0 });

// ===== 4. Estructura del proyecto =====
H1("4. Estructura del proyecto");
tabla([3000, 6360], ["Carpeta / archivo", "Contenido"], [
  ["app.py", "Servidor Flask: entrega retos, valida banderas, guarda progreso y ranking."],
  ["requirements.txt", "Dependencias: Flask, gunicorn (despliegue) y openpyxl (Excel)."],
  ["README.md", "Guía general del proyecto."],
  ["mision_01 … mision_10", "Un nivel por carpeta: mision.json (datos del nivel) y su README."],
  ["static/js", "Motor del juego: api, motor, combate, consola, juego, musica, sonido, fondo."],
  ["static/css/game.css", "Diseño de la interfaz."],
  ["static/img", "Logo, favicon y la carpeta personajes (sprites y retratos)."],
  ["static/musica", "Carpeta opcional para música propia (MP3)."],
  ["templates", "Páginas del servidor: index (juego), ranking, personajes, créditos."],
  ["scripts", "Herramientas para generar mapas, personajes, Excel, consolas, validar y versión offline."],
  ["datos", "Salidas: Excel, juego en un archivo, base de datos y reporte del validador."],
  ["docs", "Documentación: arquitectura, cómo agregar misiones y guía de niveles."],
], { monoCol: 0 });

// ===== 5. Descripción detallada de las misiones =====
pageBreak();
H1("5. Descripción detallada de las misiones");
par("Para cada misión se describe: el tema y el laboratorio en que se basa, el objetivo de aprendizaje, la historia, qué debe hacer el jugador, las preguntas de combate con su respuesta, la pregunta final del guardián, las terminales de información y la consola de comandos resuelta.");

M.forEach((m) => {
  pageBreak();
  H2(`5.${m.n}  Misión ${String(m.n).padStart(2, "0")} — ${m.titulo}`);
  tabla([2600, 6760], ["Dato", "Detalle"], [
    ["Sector", m.sector],
    ["Tema", m.tema],
    ["Laboratorio base", m.lab],
    ["Objetivo de aprendizaje", m.objetivo],
    ["Dificultad", "★".repeat(m.estrellas) + "☆".repeat(5 - m.estrellas) + `  (${m.enemigos_n} enemigos, ${m.vida} golpe(s) c/u, ${m.dano} de daño por error${m.tiempo ? ", " + m.tiempo + " s por pregunta" : ""}${m.persigue ? ", enemigos que persiguen" : ""})`],
    ["Guardián", m.guardian],
    ["Enemigos", m.enemigos.join(", ")],
    ["Bandera del nivel", m.flag_nivel],
  ], { boldCol: 0 });

  H3("Historia");
  m.historia.forEach((h) => par([T(h, { italics: true })], { after: 40 }));

  H3("Qué se hace en la misión");
  par([T(`El jugador explora el ${m.sector.toLowerCase()}, recoge poderes y derrota a los ${m.enemigos_n} enemigos respondiendo preguntas sobre ${m.tema.toLowerCase()}. Los primeros enemigos sueltan estas pistas:`)]);
  m.pistas.forEach((p) => bullet(p));
  par("Al vencer a todos, se abre la sala del guardián, que plantea la pregunta final. Además, puede pisar la estación CONSOLA para practicar comandos reales.", { before: 40 });

  H3("Preguntas de combate y respuestas");
  m.retos.forEach((r, i) => {
    par([T(`${i + 1}. ${r.q}`, { bold: true })], { after: 20 });
    r.ops.forEach((o, k) => par([T(`${L[k]}) ${o}`, k === r.c ? { bold: true } : {})], { after: 0 }));
    par([T("Respuesta correcta: ", { bold: true }), T(`${L[r.c]}) ${r.ops[r.c]}. `), T(r.exp, { italics: true })], { after: 100 });
  });

  H3("Pregunta final (guardián)");
  par([T(m.final.q, { bold: true })], { after: 20 });
  m.final.ops.forEach((o, k) => par([T(`${L[k]}) ${o}`, k === m.final.c ? { bold: true } : {})], { after: 0 }));
  par([T("Respuesta correcta: ", { bold: true }), T(`${L[m.final.c]}) ${m.final.ops[m.final.c]}. `), T(m.final.exp, { italics: true })], { after: 20 });
  par([T("Defensa / buena práctica: ", { bold: true }), T(m.final.def)], { after: 40 });
  par([T("Bandera del nivel: ", { bold: true }), code(m.flag_nivel)]);

  if (m.terminales.length) {
    H3("Terminales de información");
    par("En el mapa hay terminales que se leen con la tecla E y entregan notas del laboratorio (y dan XP):");
    m.terminales.forEach((t) => par([T(t.t + ": ", { bold: true }), T(t.x)], { after: 60 }));
  }

  H3(`Consola de comandos — ${m.consola.cat}`);
  par([T("Escenario: ", { bold: true }), T(m.consola.esc)]);
  par([T("Objetivos: ", { bold: true }), T(m.consola.obj.join("; ") + ".")], { after: 60 });
  par("Solución (comandos y respuesta del sistema):", { after: 40 });
  m.consola.cmds.forEach((cc) => {
    const lineas = [`agente@objetivo:~$ ${cc.cmd}`].concat(String(cc.out).split("\n"));
    C.push(caja(lineas));
    C.push(P({ spacing: { after: 60 }, children: [T("")] }));
  });
  if (m.consola.preg) {
    par([T("Pregunta extra: ", { bold: true }), T(m.consola.preg.q + "  "), T("Respuesta: ", { bold: true }), code(m.consola.preg.r)]);
  }
  par([T("Bandera CTF de la consola: ", { bold: true }), code(m.consola.flag)], { after: 60 });
});

// ===== 6. Personajes, música y efectos =====
pageBreak();
H1("6. Personajes, música y efectos");
H2("6.1 Personajes");
par("El juego tiene 76 personajes: el agente protagonista, 10 guardianes y 65 enemigos de seis tipos (bicho, virus, fantasma, slime, robot y ojo). Cada uno tiene un sprite animado y un retrato con su nombre, guardados en static/img/personajes. La página /personajes muestra la galería completa.");
H2("6.2 Música y sonido");
par("La música es chiptune original generada en el navegador (no usa archivos): hay pistas de título, exploración (que cambia de tono y velocidad en cada nivel), combate, jefe, victoria y derrota. Se puede sustituir por música propia colocando archivos MP3 en static/musica. Los botones permiten silenciar la música y los efectos por separado.");
H2("6.3 Animación y efectos");
par("Los personajes caminan animados en cuatro direcciones; los equipos de sistemas (racks, switches, monitores, ventiladores, baterías, cableado) están animados; hay partículas, explosiones, números flotantes, temblor de pantalla y una transición de combate estilo Pokémon.");

// ===== 7. Instalación y ejecución =====
H1("7. Instalación y ejecución");
H2("7.1 En Visual Studio Code (con servidor)");
const ref2 = "instal";
num([T("Descomprimir el proyecto y abrirlo en VS Code (Archivo → Abrir carpeta).")], ref2);
num([T("Crear el entorno virtual: "), code("python -m venv .venv"), T(" y activarlo.")], ref2);
num([T("Instalar dependencias: "), code("pip install -r requirements.txt")], ref2);
num([T("Ejecutar: "), code("python app.py")], ref2);
num([T("Abrir "), code("http://127.0.0.1:5000"), T(" en el navegador.")], ref2);
H2("7.2 Sin instalar nada (versión offline)");
par([T("Abrir con doble clic el archivo "), code("datos/JUGAR_CyberAgent_Academy.html"), T(". Incluye todo y no requiere Python; no tiene ranking.")]);
H2("7.3 Publicación en internet (Render)");
bullet([T("Build Command: "), code("pip install -r requirements.txt")]);
bullet([T("Start Command: "), code("gunicorn app:app")]);
bullet([T("El archivo requirements.txt debe incluir "), code("gunicorn"), T(". En el plan gratuito el ranking se reinicia cuando el servicio se suspende por inactividad.")]);

// ===== 8. Mantenimiento =====
H1("8. Mantenimiento: agregar, editar o quitar niveles");
bullet([T("Quitar un nivel: ", { bold: true }), T("borrar o mover su carpeta mision_XX.")]);
bullet([T("Agregar un nivel: ", { bold: true }), T("ejecutar "), code("python scripts/nueva_mision.py \"Mi misión\""), T(" y editar el mision.json creado.")]);
bullet([T("Editar un nivel: ", { bold: true }), T("modificar su mision.json (historia, enemigos, preguntas, dificultad, consola y mapa).")]);
par([T("Tras cualquier cambio, ejecutar "), code("python scripts/validar_misiones.py"), T(" y "), code("python scripts/build_offline.py"), T(".")], { before: 40 });
H2("8.1 Scripts disponibles");
tabla([3800, 5560], ["Script", "Función"], [
  ["generar_mapa.py", "Genera los mapas de salas temáticas."],
  ["generar_personajes.py", "Genera los sprites y retratos de los personajes."],
  ["build_consolas.py", "Agrega la consola de comandos y la estación en cada mapa."],
  ["generar_excel.py", "Genera el Excel con historias, respuestas, enemigos y consolas."],
  ["validar_misiones.py", "Verifica que cada nivel sea jugable."],
  ["build_offline.py", "Genera el juego en un solo archivo HTML."],
], { monoCol: 0 });

// ===== 9. Consideraciones educativas y créditos =====
H1("9. Consideraciones educativas y créditos");
par([T("Nota: ", { bold: true }), T("este es un material educativo. Las vulnerabilidades solo se representan dentro del juego; los conceptos deben practicarse en laboratorios propios, aislados y con autorización. El juego no interactúa con sistemas reales.")]);
H2("9.1 Créditos");
tabla([3000, 6360], ["Campo", "Descripción"], [
  ["Proyecto", "CyberAgent Academy — videojuego RPG educativo de hacking ético"],
  ["Creado por", AUTOR],
  ["Institución", "Universidad de Cundinamarca — Ingeniería de Sistemas y Computación"],
  ["Grupo", "Ética Hacking 901N"],
  ["Laboratorios base", "SQL Injection, XSS, BeEF, carga de archivos, HTTP, sesiones, reconocimiento, Linux y Docker"],
  ["Tecnología", "Python, Flask, SQLite, HTML5 Canvas, CSS y JavaScript"],
], { boldCol: 0 });

const doc = new Document({
  creator: AUTOR,
  numbering: { config: [
    { reference: "flujo", levels: [{ level: 0, format: "decimal", text: "%1.", alignment: AlignmentType.START, style: { paragraph: { indent: { left: 420, hanging: 260 } } } }] },
    { reference: "instal", levels: [{ level: 0, format: "decimal", text: "%1.", alignment: AlignmentType.START, style: { paragraph: { indent: { left: 420, hanging: 260 } } } }] },
  ] },
  styles: { default: {
    document: { run: { font: "Calibri", size: 22, color: NEG } },
    heading1: { run: { font: "Calibri", size: 30, bold: true, color: NEG }, paragraph: { spacing: { before: 280, after: 140 }, keepNext: true } },
    heading2: { run: { font: "Calibri", size: 26, bold: true, color: NEG }, paragraph: { spacing: { before: 220, after: 100 }, keepNext: true } },
    heading3: { run: { font: "Calibri", size: 23, bold: true, color: NEG }, paragraph: { spacing: { before: 160, after: 80 }, keepNext: true } },
  } },
  sections: [{ properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1100, bottom: 1100, left: 1200, right: 1200 } } }, children: C }],
});
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync("/home/claude/out_word/Documentacion_CyberAgent_Academy_completa.docx", buf); console.log("Word creado."); });
