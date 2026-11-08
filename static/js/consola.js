/* =========================================================
   CyberAgent Academy — Consola interactiva (shell simulado) v6
   Creado por Andrés Felipe Beltrán Barrera
   - Panel de ayuda a la derecha: comandos del nivel y pistas.
   - Banderas de una palabra corta y clara.
   - Al resolver, se abre la última puerta y aparece un monstruo (salafinal.js).
   ========================================================= */
(() => {
"use strict";
const C = window.CAA = window.CAA || {};
const $ = id => document.getElementById(id);

const K = C.consola = { abierta: false, data: null, fin: null, objetivos: [], hist: [], hi: 0, pista: 0, resuelta: false };

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
  $("consolaProg").textContent = `${K.objetivos.filter(Boolean).length}/${d.objetivos.length} objetivos`;
}
function pintarAyuda(){
  const d = K.data;
  $("consolaPrompt").textContent = prompt();
  const cmds = $("consolaCmds"); cmds.innerHTML = "";
  (d.ayuda || []).forEach(a => {
    const div = document.createElement("div"); div.className = "cmd-ref";
    div.innerHTML = "<b>" + esc(a.t) + "</b><span>" + esc(a.h) + "</span>";
    cmds.appendChild(div);
  });
  const hints = $("consolaHints"); hints.innerHTML = "";
  // todas las pistas de los comandos, en orden, + la pista final
  const pistas = (d.comandos || []).map(c => c.pista).filter(Boolean);
  if (d.pista_final) pistas.push(d.pista_final);
  pistas.forEach((p, i) => {
    const div = document.createElement("div"); div.className = "hint-ref" + (i < K.pista ? " vista" : " oculta");
    div.innerHTML = i < K.pista ? ("💡 " + esc(p)) : "🔒 Pista " + (i + 1) + " — pulsa «Dame una pista»";
    hints.appendChild(div);
  });
}

C.abrirConsola = function(mision, resuelta, alTerminar){
  const d = mision.consola;
  if (!d){ alTerminar && alTerminar({ completada: false }); return; }
  Object.assign(K, { abierta: true, data: d, fin: alTerminar, objetivos: d.objetivos.map(() => false), hist: [], hi: 0, pista: resuelta ? 99 : 0, resuelta });
  $("consolaCat").textContent = "⌨️ Consola — " + d.categoria;
  $("consolaEsc").textContent = d.escenario;
  $("consolaOut").innerHTML = "";
  escribir("CyberAgent Shell v1.0 — práctica de " + d.categoria, "sys");
  escribir("Esta es la ÚLTIMA prueba antes de la sala del jefe. Mira el panel de la derecha: tiene PISTAS de qué hacer en cada paso (no el comando exacto: ese lo armas tú).", "sys");
  escribir("Si te atascas, pulsa «Dame una pista» para una ayuda más concreta. Cuando encuentres la bandera (una palabra), escríbela.", "sys");
  if (d.pasos && d.pasos.length){
    escribir("", "sys");
    escribir("📋 PASOS EXACTOS de esta terminal:", "sys");
    d.pasos.forEach(p => escribir("   " + p, "sys"));
    escribir("(Comandos útiles: ls = ver qué archivos hay · cat <archivo> = leerlo)", "sys");
    escribir("", "sys");
  }
  if (resuelta) escribir("(Ya completaste esta consola antes; puedes practicar de nuevo.)", "sys");
  pintarObjetivos(); pintarAyuda();
  $("consola").classList.remove("hidden");
  $("consolaFlag").classList.add("hidden");
  setTimeout(() => $("consolaInput").focus(), 50);
};

function cerrar(res){ K.abierta = false; $("consola").classList.add("hidden"); const cb = K.fin; K.fin = null; cb && cb(res); }

function matchComando(n){ return K.data.comandos.find(c => c.match.includes(n)); }
function esBandera(n){ return K.data.acepta.includes(n) || n === norm(K.data.flag); }

function ejecutar(linea){
  const d = K.data, n = norm(linea);
  if (!n) return;
  escribir(prompt() + " " + linea, "cmd-in");
  K.hist.push(linea); K.hi = K.hist.length;

  if (esBandera(n) || n.startsWith("enviar ")){
    const val = n.startsWith("enviar ") ? n.slice(7).trim() : n;
    if (esBandera(val)){ banderaOk(); return; }
    escribir("Esa no es la bandera. Sigue los comandos del panel derecho.", "err"); return;
  }
  const cmd = n.split(" ")[0];
  if (cmd === "ayuda" || cmd === "help"){ escribir("Usa los comandos del panel de la derecha. También: ls, cat <archivo>, pista, limpiar, salir.", "sys"); return; }
  if (cmd === "limpiar" || cmd === "clear"){ $("consolaOut").innerHTML = ""; return; }
  if (cmd === "salir" || cmd === "exit"){ cerrar({ completada: false }); return; }
  if (cmd === "pista"){ darPista(); return; }
  if (cmd === "objetivos"){ escribir(d.objetivos.map((o, i) => (K.objetivos[i] ? "[✓] " : "[ ] ") + o).join("\n"), "sys"); return; }
  if (cmd === "pwd"){ escribir("/home/" + d.user, "out"); return; }
  if (cmd === "whoami" && !matchComando(n)){ escribir(d.user, "out"); return; }
  if (cmd === "ls" && !matchComando(n)){ escribir(Object.keys(d.fs).join("  ") || "(vacío)", "out"); return; }
  if (cmd === "cat" && !matchComando(n)){
    const f = linea.trim().split(/\s+/)[1] || "";
    const hay = d.fs[f] !== undefined;
    escribir(hay ? d.fs[f] : "cat: " + f + ": no existe el archivo", hay ? "out" : "err");
    if (hay) revisarFlag(d.fs[f]); return;
  }
  const c = matchComando(n);
  if (c){
    escribir(c.salida, "out");
    if (c.objetivo != null && !K.objetivos[c.objetivo]){ K.objetivos[c.objetivo] = true; pintarObjetivos(); C.sfx && C.sfx.item(); }
    revisarFlag(c.salida);
    return;
  }
  escribir(cmd + ": comando no encontrado. Revisa el panel de la derecha o escribe 'pista'.", "err");
}

function revisarFlag(txt){
  if (new RegExp("bandera es la palabra:\\s*" + K.data.flag, "i").test(txt) || txt.toLowerCase().includes("bandera es: " + K.data.flag)){
    escribir("↑ ¡Ahí está la bandera! Escribe la palabra para validarla: " + K.data.flag.replace(/./g, "•"), "hint");
    $("consolaFlag").classList.remove("hidden");
  }
}
function darPista(){
  const total = (K.data.comandos.map(c => c.pista).filter(Boolean).length) + (K.data.pista_final ? 1 : 0);
  if (K.pista >= total){ escribir("💡 Ya tienes todas las pistas (mira el panel derecho).", "hint"); return; }
  const lista = K.data.comandos.map(c => c.pista).filter(Boolean).concat(K.data.pista_final ? [K.data.pista_final] : []);
  escribir("💡 " + lista[K.pista], "hint"); K.pista++; pintarAyuda();
}

function banderaOk(){
  const d = K.data;
  escribir("✓ ¡Bandera correcta: " + d.flag + "!", "ok");
  escribir("🚪 La terminal abrió la ÚLTIMA PUERTA... algo se acerca.", "sys");
  C.sfx && C.sfx.ok();
  K.abierta = false; $("consola").classList.add("hidden");
  // Abre la sala final: monstruo que se mueve y disparas con espacio
  C.salaFinal(d, () => terminar());
}

function terminar(){
  const d = K.data;
  cerrar({ completada: true, xp: d.xp, flag: d.flag, categoria: d.categoria, monstruo: d.monstruo });
}

function onKey(e){
  const inp = $("consolaInput");
  if (e.key === "Enter"){ const linea = inp.value; inp.value = ""; if (K.abierta) ejecutar(linea); e.preventDefault(); }
  else if (e.key === "ArrowUp"){ if (K.hi > 0){ K.hi--; inp.value = K.hist[K.hi] || ""; } e.preventDefault(); }
  else if (e.key === "ArrowDown"){ if (K.hi < K.hist.length){ K.hi++; inp.value = K.hist[K.hi] || ""; } e.preventDefault(); }
}
C.initConsola = function(){
  $("consolaInput").addEventListener("keydown", onKey);
  $("consolaPista").onclick = () => { darPista(); $("consolaInput").focus(); };
  $("consolaCerrar").onclick = () => cerrar({ completada: false });
};
})();
