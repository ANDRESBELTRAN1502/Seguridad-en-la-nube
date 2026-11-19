// Documentación completa del proyecto CyberAgent Academy (v5) en Word.
// Creado por Andrés Felipe Beltrán Barrera.
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, PageBreak, ImageRun,
  LevelFormat, PositionalTab, PositionalTabAlignment, PositionalTabLeader,
} = require("docx");

const D = JSON.parse(fs.readFileSync("/tmp/docdata.json", "utf8"));
const VERDE = "0A7D33", VERDE2 = "39A85A", GRIS = "444444", AMAR = "9A6B00", FONDO = "02140C", CLARO = "EAF7EF";
const AUTOR = "Andrés Felipe Beltrán Barrera";
const C = [];
const P = (o) => new Paragraph(o);
const T = (t, o = {}) => new TextRun({ text: t, font: o.mono ? "Consolas" : "Arial", size: o.size || 22, bold: o.bold, italics: o.italics, color: o.color, break: o.break });
const H1 = (t) => C.push(P({ heading: HeadingLevel.HEADING_1, children: [T(t, { bold: true, size: 30, color: VERDE })] }));
const H2 = (t) => C.push(P({ heading: HeadingLevel.HEADING_2, children: [T(t, { bold: true, size: 25, color: VERDE })] }));
const par = (runs, o = {}) => C.push(P({ spacing: { after: o.after == null ? 120 : o.after, before: o.before || 0 }, children: Array.isArray(runs) ? runs : [T(runs)] }));
const bullet = (runs) => C.push(P({ bullet: { level: 0 }, children: Array.isArray(runs) ? runs : [T(runs)] }));
const code = (t) => T(t, { mono: true, color: VERDE, size: 20 });
const pageBreak = () => C.push(P({ children: [new PageBreak()] }));

function tabla(cols, headers, filas, opts = {}) {
  const celda = (txt, o = {}) => new TableCell({
    width: { size: o.w, type: WidthType.DXA },
    shading: o.head ? { type: ShadingType.CLEAR, fill: VERDE, color: "auto" } : (o.alt ? { type: ShadingType.CLEAR, fill: CLARO, color: "auto" } : undefined),
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
    children: [P({ children: (Array.isArray(txt) ? txt : [T(String(txt), { bold: o.head || o.bold, color: o.head ? "FFFFFF" : o.color, size: 18, mono: o.mono })] )})] });
  const rows = [new TableRow({ tableHeader: true, children: headers.map((h, i) => celda(h, { w: cols[i], head: true })) })];
  filas.forEach((f, r) => rows.push(new TableRow({ children: f.map((v, i) => celda(v, { w: cols[i], alt: r % 2 === 1, mono: opts.monoCol === i, color: opts.monoCol === i ? AMAR : undefined, bold: opts.boldCol === i })) })));
  C.push(new Table({ width: { size: cols.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: cols,
    borders: { top: { style: BorderStyle.SINGLE, size: 4, color: VERDE2 }, bottom: { style: BorderStyle.SINGLE, size: 4, color: VERDE2 }, left: { style: BorderStyle.SINGLE, size: 4, color: VERDE2 }, right: { style: BorderStyle.SINGLE, size: 4, color: VERDE2 }, insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "CDE9D5" }, insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "CDE9D5" } }, rows }));
}

// ===================== PORTADA =====================
try {
  C.push(P({ alignment: AlignmentType.CENTER, spacing: { before: 600, after: 160 },
    children: [new ImageRun({ type: "jpg", data: fs.readFileSync("static/img/logo.jpg"), transformation: { width: 190, height: 190 } })] }));
} catch (e) {}
C.push(P({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [T("CyberAgent Academy", { bold: true, size: 56, color: VERDE })] }));
C.push(P({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [T("Videojuego educativo de hacking ético — Documentación del proyecto", { bold: true, size: 26, color: GRIS })] }));
C.push(P({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [T("Creado por " + AUTOR, { size: 24 })] }));
C.push(P({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [T("Universidad de Cundinamarca · Ingeniería de Sistemas y Computación", { size: 20, color: GRIS })] }));
C.push(P({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [T("Ética Hacking · Grupo 901N", { size: 20, color: GRIS })] }));
C.push(P({ alignment: AlignmentType.CENTER, children: [T("Versión 5 · Noviembre de 2026", { italics: true, size: 20, color: GRIS })] }));

// ===================== 1. INTRODUCCIÓN =====================
pageBreak();
H1("1. Introducción");
par("CyberAgent Academy es un videojuego educativo tipo RPG (estilo Pokémon) sobre hacking ético. El jugador es un agente que recorre 10 niveles, pelea contra enemigos en combates por turnos respondiendo preguntas, resuelve retos en una consola de comandos y se gradúa como Agente Élite.");
par("El objetivo es aprender, de forma práctica y divertida, los conceptos de seguridad informática vistos en los laboratorios del curso: SQL Injection, XSS, BeEF, carga de archivos, análisis HTTP, gestión de sesiones, reconocimiento, Linux y Docker.");
par([T("Temática: ", { bold: true }), T("una academia de agentes de ciberseguridad. Cada nivel es una misión basada en un laboratorio real, con su propio mapa, enemigos, guardián y bandera.")]);

H2("Tecnologías utilizadas");
bullet([T("Python + Flask", { bold: true }), T(" — el servidor que entrega los retos, valida las respuestas y guarda el progreso y el ranking (SQLite).")]);
bullet([T("HTML5 Canvas, CSS y JavaScript", { bold: true }), T(" — el motor del juego: mapa, movimiento, enemigos, combates, consola, música y efectos.")]);
bullet([T("Versión offline", { bold: true }), T(" — un solo archivo HTML que funciona sin servidor (doble clic).")]);

// ===================== 2. CÓMO SE JUEGA =====================
pageBreak();
H1("2. Cómo se juega");
par("El jugador escribe su nombre, elige un nivel en el mapa y entra a la misión. Dentro de cada nivel:");
bullet("Explora varias salas (llenas de racks de servidores, monitores, switches de red y demás equipos) y recoge poderes.");
bullet("Al chocar con un enemigo empieza un combate por turnos: cada respuesta correcta es un golpe al enemigo y cada error le quita vida al agente.");
bullet("Los primeros enemigos derrotados sueltan las pistas que se necesitan para la pregunta final.");
bullet("Cuando cae el último enemigo se abre la sala del guardián, que hace la pregunta final.");
bullet("Si acierta, se activa el portal, gana la bandera y se desbloquea el siguiente nivel.");
bullet([T("En el centro de la sala inicial hay una estación "), T("CONSOLA", { bold: true, color: VERDE }), T(": al pisarla se abre una terminal donde se escriben comandos reales.")]);

H2("Controles");
tabla([3000, 6360], ["Acción", "Tecla"], [
  ["Moverse", "Flechas o WASD (en celular, control táctil)"],
  ["Hablar / avanzar diálogo", "E, Espacio o Enter"],
  ["Responder en combate", "1, 2, 3, 4 (o A, B, C, D)"],
  ["Abrir la consola de comandos", "Pisar la estación CONSOLA, tecla C o botón ⌨️"],
  ["Ver pistas", "P"],
  ["Usar parche (+35 vida) / turbo", "3 / 4"],
], { boldCol: 0 });

H2("Poderes");
bullet([T("🛡 Escudo", { bold: true }), T(" — bloquea un golpe en combate.")]);
bullet([T("🔍 Escáner", { bold: true }), T(" — tacha una respuesta incorrecta.")]);
bullet([T("💊 Parche", { bold: true }), T(" — recupera 35 de vida.")]);
bullet([T("⚡ Turbo", { bold: true }), T(" — corres más rápido durante 20 segundos.")]);

// ===================== 3. LOS 10 NIVELES =====================
pageBreak();
H1("3. Los 10 niveles");
par([T(`El juego tiene ${D.niveles.length} niveles con ${D.tot_en} enemigos en total y un máximo de ${D.tot_xp} puntos de experiencia (XP). Cada nivel se basa en un laboratorio del curso:`)]);
tabla([700, 2600, 2900, 2500, 660], ["N°", "Misión", "Tema", "Laboratorio base", "👾"],
  D.niveles.map((n) => [String(n.n), n.titulo, n.tema, n.lab, String(n.enemigos)]), { boldCol: 1 });

H2("Cómo sube la dificultad");
par("La dificultad aumenta nivel a nivel para que el jugador progrese:");
tabla([4680, 4680], ["Aspecto", "Del nivel 1 al 10"], [
  ["Salas por nivel", "de 4 a 10"],
  ["Enemigos por nivel", "de 4 a 9"],
  ["Golpes para vencer a cada enemigo", "de 1 a 3"],
  ["Vida que quita cada error", "de 10 a 30"],
  ["Tiempo por pregunta", "sin límite → 18 segundos (desde el nivel 4)"],
  ["Los enemigos te persiguen", "no → sí, y cada vez más rápido (desde el nivel 5)"],
  ["Opciones de respuesta", "3 → 4 (desde el nivel 5)"],
], { boldCol: 0 });

// ===================== 4. CONSOLA DE COMANDOS (CTF) =====================
pageBreak();
H1("4. La consola de comandos (práctica tipo CTF)");
par("Además de los combates, cada nivel tiene una estación CONSOLA en el centro de la sala inicial. Al pisarla se abre una terminal donde el jugador escribe comandos reales (nmap, curl, cat, strings, env…), ve la respuesta simulada, encuentra una bandera CTF{...} y la escribe para validarla. Así se practican, de forma práctica, las categorías del laboratorio de hacking ético.");
tabla([700, 3600, 3060, 2000], ["N°", "Categoría que practica", "Comando de ejemplo", "Bandera CTF"],
  D.niveles.map((n) => [String(n.n), n.cat, "", n.flag]), { monoCol: 3 });
par([T("Nota: ", { bold: true }), T("las banderas se validan comparando su hash; no viajan en claro. Las banderas ganadas en la consola dan XP extra y aparecen en el certificado final. El documento ")], { before: 80 });
par([T("«Terminales (consolas) del juego — resueltas por nivel»", { italics: true }), T(" trae la solución paso a paso de cada una.")]);

// ===================== 5. PERSONAJES, MÚSICA Y EFECTOS =====================
pageBreak();
H1("5. Personajes, música y efectos");
H2("Personajes");
par([T(`El juego tiene ${D.npj} personajes: tu agente, ${D.ng} guardianes y ${D.ne} enemigos de 6 tipos (bicho, virus, fantasma, slime, robot y ojo). Cada uno tiene un sprite animado y un retrato con su nombre.`)]);
bullet([T("Las imágenes están en "), code("static/img/personajes/galeria/"), T(", con nombres como «Nivel 01 - Profesora Ada.png».")]);
bullet([T("Con el servidor, la página "), code("/personajes"), T(" muestra la galería animada.")]);
bullet("Se pueden reemplazar los sprites por dibujos propios (mismo tamaño) o regenerar con un script.");

H2("Música y sonido");
par("La música es chiptune original, generada en el navegador (no usa archivos). Hay pistas para el título, la exploración (cambia de tono y velocidad en cada nivel), el combate, el jefe, la victoria y la derrota. Se puede poner música propia (MP3) en la carpeta static/musica/. El botón 🎵 apaga la música y 🔊 los efectos.");

H2("Animación y efectos");
bullet("Sprites con animación de caminar en 4 direcciones.");
bullet("Equipos de sistemas animados: LEDs que parpadean, gráficas en vivo, ventiladores girando, baterías cargando, pulsos de datos en el cableado.");
bullet("Partículas, explosiones, números flotantes, temblor de pantalla y transición de combate estilo Pokémon.");
bullet("El portal absorbe al jugador al terminar el nivel; la pantalla se pone roja con poca vida.");

// ===================== 6. ESTRUCTURA DEL PROYECTO =====================
pageBreak();
H1("6. Estructura del proyecto");
par("Cada carpeta cumple una función; estas son las principales:");
const est = [
  ["app.py", "Servidor Flask: entrega retos, valida banderas, guarda progreso y ranking."],
  ["requirements.txt", "Dependencias (Flask, gunicorn para desplegar, openpyxl para el Excel)."],
  ["README.md", "Explicación general y guía de uso."],
  ["mision_01/ … mision_10/", "Un nivel por carpeta: mision.json (historia, enemigos, preguntas, consola, mapa) y su README."],
  ["static/js/", "El motor del juego: api, motor, combate, consola, juego, musica, sonido, fondo."],
  ["static/css/game.css", "Todo el diseño (estilo verde neón)."],
  ["static/img/", "Logo, favicon y carpeta personajes/ (sprites y retratos)."],
  ["static/musica/", "Opcional: aquí se ponen MP3 propios."],
  ["templates/", "Páginas del servidor: index (juego), ranking, personajes, créditos."],
  ["scripts/", "Herramientas: generar mapas, personajes, Excel, consolas, validar, versión offline."],
  ["datos/", "Salidas: Excel, juego en un archivo, base de datos del ranking, reporte del validador."],
  ["docs/", "Documentación: arquitectura, cómo agregar misiones, guía de niveles."],
];
tabla([3000, 6360], ["Carpeta / archivo", "Qué contiene"], est, { monoCol: 0 });

// ===================== 7. CÓMO EJECUTARLO =====================
pageBreak();
H1("7. Cómo ejecutarlo");
H2("Opción A — en Visual Studio Code (con servidor)");
[["1", "Descomprime el proyecto y ábrelo en VS Code (Archivo → Abrir carpeta)."],
 ["2", "Abre una terminal y crea el entorno: python -m venv .venv y actívalo."],
 ["3", "Instala dependencias: pip install -r requirements.txt"],
 ["4", "Ejecuta: python app.py"],
 ["5", "Abre http://127.0.0.1:5000 en el navegador."]].forEach(([a, b]) => par([T(a + ". ", { bold: true, color: VERDE }), b.includes(":") ? T(b.split(":")[0] + ": ") : T(b), b.includes(":") ? code(b.split(":").slice(1).join(":").trim()) : T("")]));

H2("Opción B — sin instalar nada (versión offline)");
par([T("Abre con doble clic el archivo "), code("datos/JUGAR_CyberAgent_Academy.html"), T(". Trae todo adentro y no necesita Python (pero no tiene ranking).")]);

H2("Opción C — publicarlo en internet (Render)");
bullet([T("Build Command: "), code("pip install -r requirements.txt")]);
bullet([T("Start Command: "), code("gunicorn app:app")]);
bullet([T("requirements.txt debe incluir "), code("gunicorn"), T(". En el plan gratuito, el ranking se reinicia cuando el servicio se duerme.")]);

// ===================== 8. AGREGAR / EDITAR NIVELES =====================
pageBreak();
H1("8. Agregar, editar o quitar niveles");
par("El juego detecta las carpetas de nivel automáticamente:");
bullet([T("Quitar un nivel: ", { bold: true }), T("borra o mueve su carpeta mision_XX.")]);
bullet([T("Agregar un nivel: ", { bold: true }), T("ejecuta "), code("python scripts/nueva_mision.py \"Mi misión\""), T(" y edita el mision.json que se crea.")]);
bullet([T("Editar un nivel: ", { bold: true }), T("cambia su mision.json (historia, enemigos, preguntas, dificultad, consola y mapa).")]);
par([T("Después de cualquier cambio, ejecuta "), code("python scripts/validar_misiones.py"), T(" para revisar que el nivel se pueda jugar, y "), code("python scripts/build_offline.py"), T(" para actualizar la versión de un solo archivo.")], { before: 80 });

H2("Archivos que se generan con los scripts");
tabla([3800, 5560], ["Script", "Qué produce"], [
  ["generar_mapa.py", "Mapas de salas temáticas."],
  ["generar_personajes.py", "Sprites y retratos de todos los personajes."],
  ["build_consolas.py", "La consola de comandos y la estación en cada mapa."],
  ["generar_excel.py", "El Excel con historias, respuestas, enemigos y consolas."],
  ["validar_misiones.py", "Revisa que cada nivel sea jugable."],
  ["build_offline.py", "El juego completo en un solo archivo HTML."],
], { monoCol: 0 });

// ===================== 9. NOTA EDUCATIVA Y CRÉDITOS =====================
pageBreak();
H1("9. Nota educativa y créditos");
C.push(P({ spacing: { after: 120 }, shading: { type: ShadingType.CLEAR, fill: "FFF7E0", color: "auto" },
  border: { left: { style: BorderStyle.SINGLE, size: 18, color: AMAR, space: 8 } },
  children: [T("Material educativo. Los conceptos de seguridad del juego se practican únicamente en laboratorios propios, aislados y con autorización. El juego no ataca sistemas reales: todo ocurre dentro del propio videojuego.", { italics: true })] }));
H2("Créditos");
tabla([3000, 6360], ["", ""], [
  ["Proyecto", "CyberAgent Academy — videojuego RPG educativo de hacking ético"],
  ["Creado por", AUTOR],
  ["Institución", "Universidad de Cundinamarca — Ingeniería de Sistemas y Computación"],
  ["Grupo", "Ética Hacking 901N"],
  ["Laboratorios base", "SQL Injection, XSS, BeEF, carga de archivos, análisis HTTP, sesiones, reconocimiento, Linux y Docker"],
  ["Tecnología", "Python + Flask + SQLite · HTML5 Canvas, CSS y JavaScript"],
], { boldCol: 0 });
C.push(P({ spacing: { before: 240 }, alignment: AlignmentType.CENTER, children: [T("CyberAgent Academy © 2026 · " + AUTOR, { size: 18, color: GRIS })] }));

// ===================== DOCUMENTO =====================
const doc = new Document({
  creator: AUTOR,
  numbering: { config: [] },
  styles: { default: {
    document: { run: { font: "Arial", size: 22 } },
    heading1: { run: { font: "Arial", size: 30, bold: true, color: VERDE }, paragraph: { spacing: { before: 240, after: 140 }, keepNext: true } },
    heading2: { run: { font: "Arial", size: 25, bold: true, color: VERDE }, paragraph: { spacing: { before: 200, after: 100 }, keepNext: true } },
  } },
  sections: [{ properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1000, bottom: 1000, left: 1200, right: 1200 } } }, children: C }],
});
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync("/home/claude/out_word/Documentacion_CyberAgent_Academy.docx", buf); console.log("Word creado."); });
