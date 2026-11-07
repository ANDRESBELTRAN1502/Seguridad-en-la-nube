
(() => {
"use strict";
const C = window.CAA = window.CAA || {};
const $ = id => document.getElementById(id);

const K = C.consola = { abierta: false, data: null, fin: null, fase: "cmd",
                        objetivos: [], hechos: new Set(), hist: [], hi: 0, pista: 0 };

const norm = s => s.trim().toLowerCase().replace(/\s+/g, " ");
const esc = s => String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

function escribir(txt, clase){
  const out = $("consolaOut"), div = document.createElement("div");
  if (clase) div.className = clase;
  div.innerHTML = esc(txt).replace(/\n/g, "<br>");
  out.appendChild(div); out.scrollTop = out.scrollHeight;
}
function prompt(){ const d = K.data; return `${d.user}@${d.host}:~$`; }

function pintarObjetivos(){
  const d = K.data, ol = $("consolaObj"); ol.innerHTML = "";
  d.objetivos.forEach((o, i) => {
    const li = document.createElement("li");
    li.className = K.objetivos[i] ? "ok" : "";
    li.textContent = (K.objetivos[i] ? "✓ " : "○ ") + o;
    ol.appendChild(li);
  });
  const faltan = K.objetivos.filter(Boolean).length;
  $("consolaProg").textContent = `${faltan}/${d.objetivos.length} objetivos`;
}

C.abrirConsola = function(mision, resuelta, alTerminar){
  const d = mision.consola;
  if (!d){ alTerminar && alTerminar({ completada: false }); return; }
  Object.assign(K, { abierta: true, data: d, fin: alTerminar, fase: "cmd",
                     objetivos: d.objetivos.map(() => false), hechos: new Set(), hist: [], hi: 0, pista: 0 });
  $("consolaCat").textContent = "⌨️ Consola — " + d.categoria;
  $("consolaEsc").textContent = d.escenario;
  $("consolaOut").innerHTML = "";
  escribir("CyberAgent Shell v1.0 — práctica de " + d.categoria, "sys");
  escribir("Escribe 'ayuda' para ver los comandos. Objetivo: encontrar la bandera CTF{...} y escribirla.", "sys");
  if (resuelta) escribir("(Ya completaste esta consola antes; puedes practicar de nuevo.)", "sys");
  pintarObjetivos();
  $("consola").classList.remove("hidden");
  $("consolaFlag").classList.add("hidden");
  setTimeout(() => $("consolaInput").focus(), 50);
};

function cerrar(res){
  K.abierta = false; $("consola").classList.add("hidden");
  const cb = K.fin; K.fin = null; cb && cb(res);
}

function ayuda(){
  const extra = K.data.comandos.length;
  escribir("Comandos disponibles:\n"
    + "  ayuda            — muestra esta ayuda\n"
    + "  ls               — lista archivos\n"
    + "  cat <archivo>    — muestra el contenido de un archivo\n"
    + "  pwd / whoami     — dónde estás / quién eres\n"
    + "  objetivos        — ver objetivos\n"
    + "  pista            — da una pista (gratis)\n"
    + "  limpiar          — limpia la pantalla\n"
    + "  salir            — cierra la consola\n"
    + "  ...y los comandos propios del reto (nmap, curl, strings, env, sudo, etc.)\n"
    + "Cuando encuentres la bandera, escríbela tal cual: CTF{...}", "sys");
}

function ejecutar(linea){
  const d = K.data, n = norm(linea);
  if (!n) return;
  escribir(prompt() + " " + linea, "cmd-in");
  K.hist.push(linea); K.hi = K.hist.length;

  // ¿es la bandera?
  if (/^ctf\{.*\}$/i.test(n) || n.startsWith("enviar ")) {
    const val = n.startsWith("enviar ") ? n.slice(7).trim() : n;
    if (val === d.flag.toLowerCase()){ banderaOk(); return; }
    escribir("Esa bandera no es correcta. Sigue explorando con los comandos.", "err"); return;
  }

  const cmd = n.split(" ")[0];
  if (cmd === "ayuda" || cmd === "help") return ayuda();
  if (cmd === "limpiar" || cmd === "clear"){ $("consolaOut").innerHTML = ""; return; }
  if (cmd === "salir" || cmd === "exit"){ cerrar({ completada: false }); return; }
  if (cmd === "objetivos") { escribir(d.objetivos.map((o, i) => (K.objetivos[i] ? "[✓] " : "[ ] ") + o).join("\n"), "sys"); return; }
  if (cmd === "pwd"){ escribir("/home/" + d.user, "out"); return; }
  if (cmd === "whoami" && !matchComando(n)){ escribir(d.user, "out"); return; }
  if (cmd === "pista"){ darPista(); return; }
  if (cmd === "ls" && !matchComando(n)){ escribir(Object.keys(d.fs).join("  ") || "(vacío)", "out"); return; }
  if (cmd === "cat" && !matchComando(n)){
    const f = linea.trim().split(/\s+/)[1] || "";
    escribir(d.fs[f] !== undefined ? d.fs[f] : "cat: " + f + ": no existe el archivo", d.fs[f] !== undefined ? "out" : "err");
    revisarFlagEn(d.fs[f] || ""); return;
  }
  // comandos propios del reto
  const c = matchComando(n);
  if (c){
    escribir(c.salida, "out");
    if (c.objetivo !== null && c.objetivo !== undefined && !K.objetivos[c.objetivo]){
      K.objetivos[c.objetivo] = true; pintarObjetivos(); C.sfx && C.sfx.item();
    }
    revisarFlagEn(c.salida);
    return;
  }
  escribir(cmd + ": comando no encontrado. Escribe 'ayuda'.", "err");
}

function matchComando(n){
  return K.data.comandos.find(c => c.match.includes(n));
}
function revisarFlagEn(txt){
  if (new RegExp(K.data.flag.replace(/[{}]/g, "\\$&"), "i").test(txt)){
    escribir("↑ ¡Encontraste una bandera! Escríbela tal cual para validarla.", "hint");
    $("consolaFlag").classList.remove("hidden");
  }
}
function darPista(){
  const faltan = K.data.comandos.filter((c, i) => c.objetivo === undefined || !K.objetivos[c.objetivo]);
  const c = K.data.comandos.find(c => c.pista && (c.objetivo === undefined || !K.objetivos[c.objetivo]));
  if (c && c.pista) escribir("💡 " + c.pista, "hint");
  else escribir("💡 Ya hiciste lo principal. Si ves una bandera CTF{...}, escríbela.", "hint");
}

function banderaOk(){
  const d = K.data;
  escribir("✓ Bandera correcta: " + d.flag, "ok");
  C.sfx && C.sfx.ok();
  if (d.pregunta && K.fase === "cmd"){
    K.fase = "preg";
    escribir("Pregunta extra (+" + (d.pregunta.xp || 0) + " XP): " + d.pregunta.texto, "sys");
    $("consolaFlag").classList.add("hidden");
    return;
  }
  terminar(false);
}

function responderPregunta(linea){
  const d = K.data, n = norm(linea);
  escribir(prompt() + " " + linea, "cmd-in");
  if (d.pregunta.acepta.includes(n)){
    escribir("✓ ¡Correcto!", "ok"); C.sfx && C.sfx.ok(); terminar(true);
  } else {
    escribir("No es la respuesta. Revisa la salida de los comandos e inténtalo otra vez.", "err");
  }
}

function terminar(conPregunta){
  const d = K.data;
  const xp = d.xp + (conPregunta ? (d.pregunta.xp || 0) : 0);
  escribir(`\n=== Consola completada · +${xp} XP · Bandera ${d.flag} ===`, "ok");
  setTimeout(() => cerrar({ completada: true, xp, flag: d.flag, categoria: d.categoria }), 1100);
}

// --- entrada ---
function onKey(e){
  const inp = $("consolaInput");
  if (e.key === "Enter"){
    const linea = inp.value; inp.value = "";
    if (!K.abierta) return;
    if (K.fase === "preg") responderPregunta(linea); else ejecutar(linea);
    e.preventDefault();
  } else if (e.key === "ArrowUp"){
    if (K.hi > 0){ K.hi--; inp.value = K.hist[K.hi] || ""; } e.preventDefault();
  } else if (e.key === "ArrowDown"){
    if (K.hi < K.hist.length){ K.hi++; inp.value = K.hist[K.hi] || ""; } e.preventDefault();
  }
}
C.initConsola = function(){
  $("consolaInput").addEventListener("keydown", onKey);
  $("consolaPista").onclick = () => { if (K.fase === "cmd") darPista(); $("consolaInput").focus(); };
  $("consolaCerrar").onclick = () => cerrar({ completada: false });
};
})();
