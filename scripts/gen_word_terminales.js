// Genera un Word con las terminales (consolas) del juego RESUELTAS por nivel.
// CyberAgent Academy — Andrés Felipe Beltrán Barrera.
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, PageBreak, ImageRun,
} = require("docx");

const datos = JSON.parse(fs.readFileSync("/tmp/consolas.json", "utf8"));
const VERDE = "0A7D33", VERDE2 = "39A85A", GRIS = "444444", AMAR = "9A6B00", FONDO = "02140C";
const AUTOR = "Andrés Felipe Beltrán Barrera";

const P = (opts) => new Paragraph(opts);
const T = (text, o = {}) => new TextRun({ text, font: o.font || "Arial", size: o.size || 22,
  bold: o.bold, italics: o.italics, color: o.color, break: o.break });

// Bloque de terminal: fondo oscuro, texto monoespaciado verde
function terminal(lineas) {
  const parr = lineas.map((l, i) =>
    P({ children: [new TextRun({ text: l.t, font: "Consolas", size: 18, color: l.c || "AEEFC0" })],
        shading: { type: ShadingType.CLEAR, fill: FONDO, color: "auto" },
        spacing: { before: i === 0 ? 40 : 0, after: 0, line: 240 },
        indent: { left: 120, right: 120 } }));
  return new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: [9360],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: VERDE },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: VERDE },
      left: { style: BorderStyle.SINGLE, size: 6, color: VERDE },
      right: { style: BorderStyle.SINGLE, size: 6, color: VERDE },
      insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
    },
    rows: [new TableRow({ children: [new TableCell({
      width: { size: 9360, type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, fill: FONDO, color: "auto" },
      margins: { top: 80, bottom: 80, left: 60, right: 60 }, children: parr })] })],
  });
}

const children = [];

// ---- Portada ----
try {
  children.push(P({ alignment: AlignmentType.CENTER, spacing: { before: 400, after: 120 },
    children: [new ImageRun({ type: "jpg",
      data: fs.readFileSync("static/img/logo.jpg"), transformation: { width: 150, height: 150 } })] }));
} catch (e) {}
children.push(P({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
  children: [T("CyberAgent Academy", { bold: true, size: 48, color: VERDE })] }));
children.push(P({ alignment: AlignmentType.CENTER, spacing: { after: 240 },
  children: [T("Terminales (consolas) del juego — resueltas por nivel", { bold: true, size: 28, color: GRIS })] }));
children.push(P({ alignment: AlignmentType.CENTER, spacing: { after: 40 },
  children: [T("Creado por " + AUTOR, { size: 22 })] }));
children.push(P({ alignment: AlignmentType.CENTER, spacing: { after: 240 },
  children: [T("Universidad de Cundinamarca · Ingeniería de Sistemas · Ética Hacking 901N", { size: 20, color: GRIS })] }));
children.push(P({ alignment: AlignmentType.CENTER, spacing: { after: 120 },
  children: [T("Cada nivel tiene una estación CONSOLA (se pisa para abrirla). Aquí está resuelta: los comandos exactos, la respuesta del sistema y la bandera CTF que se obtiene.",
    { italics: true, size: 20, color: GRIS })] }));

// ---- Tabla resumen ----
children.push(P({ heading: HeadingLevel.HEADING_1, children: [T("Resumen de banderas", { bold: true, size: 30, color: VERDE })] }));
const celda = (txt, o = {}) => new TableCell({
  width: { size: o.w, type: WidthType.DXA },
  shading: o.head ? { type: ShadingType.CLEAR, fill: VERDE, color: "auto" } : undefined,
  margins: { top: 40, bottom: 40, left: 80, right: 80 },
  children: [P({ children: [T(txt, { bold: o.head || o.bold, color: o.head ? "FFFFFF" : o.color, size: 20,
    font: o.mono ? "Consolas" : "Arial" })] })] });
const anchoCols = [900, 3200, 3360, 1900];
const filasTabla = [new TableRow({ tableHeader: true, children: [
  celda("Nivel", { w: anchoCols[0], head: true }), celda("Categoría", { w: anchoCols[1], head: true }),
  celda("Bandera CTF", { w: anchoCols[2], head: true }), celda("XP", { w: anchoCols[3], head: true })] })];
datos.forEach((d) => filasTabla.push(new TableRow({ children: [
  celda(String(d.n), { w: anchoCols[0], bold: true }),
  celda(d.categoria, { w: anchoCols[1] }),
  celda(d.flag, { w: anchoCols[2], mono: true, color: AMAR, bold: true }),
  celda(String(d.xp + (d.pregunta ? d.pregunta.xp : 0)), { w: anchoCols[3] })] })));
children.push(new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: anchoCols,
  borders: {
    top: { style: BorderStyle.SINGLE, size: 4, color: VERDE2 }, bottom: { style: BorderStyle.SINGLE, size: 4, color: VERDE2 },
    left: { style: BorderStyle.SINGLE, size: 4, color: VERDE2 }, right: { style: BorderStyle.SINGLE, size: 4, color: VERDE2 },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "CDE9D5" },
    insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "CDE9D5" } },
  rows: filasTabla }));

// ---- Una sección por nivel ----
datos.forEach((d) => {
  children.push(P({ children: [new PageBreak()] }));
  children.push(P({ heading: HeadingLevel.HEADING_1, spacing: { after: 40 },
    children: [T(`Nivel ${String(d.n).padStart(2, "0")} — ${d.titulo}`, { bold: true, size: 30, color: VERDE })] }));
  children.push(P({ spacing: { after: 120 }, children: [
    T("Categoría: ", { bold: true }), T(d.categoria + "   "),
    T("Bandera: ", { bold: true }), T(d.flag, { font: "Consolas", color: AMAR, bold: true }),
    T(`   (+${d.xp + (d.pregunta ? d.pregunta.xp : 0)} XP)`) ] }));

  children.push(P({ spacing: { after: 60 }, children: [T("Escenario: ", { bold: true }), T(d.escenario)] }));

  children.push(P({ spacing: { before: 80, after: 40 }, children: [T("Objetivos:", { bold: true })] }));
  d.objetivos.forEach((o) => children.push(P({ bullet: { level: 0 }, children: [T(o)] })));

  children.push(P({ heading: HeadingLevel.HEADING_2, spacing: { before: 160, after: 80 },
    children: [T("Solución paso a paso", { bold: true, size: 24, color: VERDE })] }));

  d.comandos.forEach((c, i) => {
    children.push(P({ spacing: { before: 100, after: 20 },
      children: [T(`Paso ${i + 1} — escribe el comando:`, { bold: true, color: GRIS })] }));
    const lineas = [{ t: `agente@objetivo:~$ ${c.cmd}`, c: "FFFFFF" }];
    String(c.salida).split("\n").forEach((s) => lineas.push({ t: s, c: "AEEFC0" }));
    children.push(terminal(lineas));
  });

  if (d.pregunta) {
    children.push(P({ heading: HeadingLevel.HEADING_2, spacing: { before: 160, after: 40 },
      children: [T("Pregunta extra", { bold: true, size: 24, color: VERDE })] }));
    children.push(P({ children: [T("Pregunta: ", { bold: true }), T(d.pregunta.texto)] }));
    children.push(P({ spacing: { after: 80 }, children: [T("Respuesta: ", { bold: true }),
      T(d.pregunta.resp, { font: "Consolas", color: VERDE, bold: true }),
      T(`   (+${d.pregunta.xp} XP)`) ] }));
  }

  children.push(P({ spacing: { before: 120 }, shading: { type: ShadingType.CLEAR, fill: "FFF7E0", color: "auto" },
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: AMAR, space: 8 } },
    children: [T("Bandera obtenida: ", { bold: true }),
      T(d.flag, { font: "Consolas", bold: true, color: AMAR, size: 24 }),
      T("  → se escribe en la consola para validarla.") ] }));
});

const doc = new Document({
  creator: AUTOR,
  styles: {
    default: {
      document: { run: { font: "Arial", size: 22 } },
      heading1: { run: { font: "Arial", size: 30, bold: true, color: VERDE },
        paragraph: { spacing: { before: 240, after: 120 }, keepNext: true } },
      heading2: { run: { font: "Arial", size: 24, bold: true, color: VERDE },
        paragraph: { spacing: { before: 160, after: 80 }, keepNext: true } },
    },
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1000, bottom: 1000, left: 1200, right: 1200 } } },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("/home/claude/out_word/Terminales_CyberAgent_resueltas.docx", buf);
  console.log("Word creado.");
});
