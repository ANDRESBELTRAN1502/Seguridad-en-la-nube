
  
(() => {
"use strict";
const C = window.CAA = window.CAA || {};
const $ = id => document.getElementById(id);
const SAVE = "cyberagent_academy_v3";
console.log("%cCyberAgent Academy — Creado por Andrés Felipe Beltrán Barrera",
  "color:#39ff7a;background:#020a05;font-size:14px;padding:6px 10px;border:1px solid #39ff7a");

let misiones = [];          // resumen de cada carpeta mision_XX
let modo = "titulo";        // titulo | mundo | intro | juego | dialogo | combate | panel | fin
const est = C.estado = cargar();
if (!est.flagsCTF) est.flagsCTF = {};

function nuevoEstado(nombre){
  return { flagsCTF:{}, agente: (crypto.randomUUID ? crypto.randomUUID() : "a"+Date.now()+Math.random().toString(16).slice(2)),
           nombre: nombre||"Agente", completadas:{}, inicio: Date.now() };
}
function cargar(){
  try { const s = JSON.parse(localStorage.getItem(SAVE)); if (s && s.agente) return s; } catch(e){}
  return nuevoEstado("Agente");
}
function guardar(){ try { localStorage.setItem(SAVE, JSON.stringify(est)); } catch(e){} }
const tienePartida = () => Object.keys(est.completadas).length > 0;
const esc = s => String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function mostrar(id){ ["title","world","game"].forEach(s=>$(s).classList.toggle("hidden", s!==id)); }

/* ---------------- Rangos ---------------- */
const xpTotal = () => Object.values(est.completadas).reduce((a,c)=>a+(c.xp||0),0);
const xpMaxTotal = () => misiones.reduce((a,m)=>a+m.xp_max,0) || 1;
const todoCompleto = () => misiones.length>0 && misiones.every(m=>est.completadas[m.id]);
function rango(){
  if (todoCompleto()) return "Agente Élite";
  const p = xpTotal()/xpMaxTotal();
  return p >= 0.6 ? "Especialista" : p >= 0.3 ? "Analista" : "Cadete";
}

/* ---------------- Pantalla de título ---------------- */
async function iniciarApp(){
  C.musica && C.musica.buscarArchivos();
  if (C.API.offline) document.querySelectorAll(".srv-only").forEach(a=>a.classList.add("hidden"));
  try { misiones = await C.API.misiones(); }
  catch(e){
    $("loadError").classList.remove("hidden");
    $("loadError").innerHTML = "⚠ No se pudieron cargar las misiones.<br>Ejecuta el servidor con <b>python app.py</b> y abre <b>http://127.0.0.1:5000</b>.<br><small>"+esc(e.message)+"</small>";
    return;
  }
  if (!misiones.length){ $("loadError").classList.remove("hidden"); $("loadError").textContent = "No hay carpetas mision_XX con mision.json."; }
  if (tienePartida() || est.nombre !== "Agente"){ $("btnContinue").classList.remove("hidden"); $("agentName").value = est.nombre; }
}
$("btnStart").onclick = () => {
  if (tienePartida() && !confirm("Ya tienes una partida guardada. ¿Empezar de cero?")) return;
  const n = ($("agentName").value.trim()||"Agente").slice(0,24);
  Object.assign(est, nuevoEstado(n)); guardar(); irMundo();
};
$("btnContinue").onclick = () => { est.nombre = ($("agentName").value.trim()||est.nombre).slice(0,24); guardar(); irMundo(); };
$("agentName").addEventListener("keydown", e=>{ if (e.key==="Enter") (tienePartida()?$("btnContinue"):$("btnStart")).click(); });

/* ---------------- Mapa de niveles ---------------- */
const musica = (n, nv) => C.musica && C.musica.tocar(n, nv);
function irMundo(){
  modo = "mundo"; mostrar("world"); musica("titulo");
  $("wName").textContent = est.nombre.toUpperCase();
  $("wRank").textContent = "★ "+rango();
  $("wXp").textContent = xpTotal(); $("wDone").textContent = Object.keys(est.completadas).length+" / "+misiones.length;
  $("wXpFill").style.width = Math.min(100, xpTotal()/xpMaxTotal()*100)+"%";
  $("btnCert").classList.toggle("hidden", !todoCompleto());
  const grid = $("levelGrid"); grid.innerHTML = "";
  misiones.forEach((m,i)=>{
    const hecho = est.completadas[m.id], libre = i===0 || est.completadas[misiones[i-1].id];
    const b = document.createElement("button");
    b.className = "level" + (hecho ? " done" : ""); b.disabled = !libre;
    b.innerHTML = `<span class="lv-icon">${m.icono}</span><div class="lv-num">NIVEL ${String(i+1).padStart(2,"0")}</div>
      <div class="lv-title">${esc(m.titulo)}</div><div class="lv-topic">${esc(m.tema)}</div>
      <div class="stars">${"★".repeat(m.estrellas)}${"☆".repeat(5-m.estrellas)}</div>
      <div class="lv-meta"><span>👾 ${m.enemigos} enemigos</span><span>⭐ ${m.xp_max} XP</span></div>
      <div class="lv-state">${hecho ? "✓ "+hecho.xp+" XP" : libre ? "▶ Jugar" : "🔒"}</div>`;
    b.onclick = () => abrirIntro(i);
    grid.appendChild(b);
  });
}
$("btnTitle").onclick = () => { modo="titulo"; mostrar("title"); iniciarApp(); };
document.addEventListener("pointerdown", function primerToque(){ if (modo==="titulo") musica("titulo"); document.removeEventListener("pointerdown", primerToque); });
$("btnCert").onclick = () => mostrarCertificado();

/* ---------------- Intro del nivel ---------------- */
let idxNivel = 0, datosNivel = null;
async function abrirIntro(i){
  idxNivel = i;
  try { datosNivel = await C.API.mision(misiones[i].id); }
  catch(e){ alert("No se pudo cargar la misión: "+e.message); return; }
  datosNivel.id = misiones[i].id;
  const m = datosNivel, d = m.dificultad;
  $("inIcon").textContent = m.icono; $("inLevel").textContent = "NIVEL "+String(i+1).padStart(2,"0")+" · "+m.sector;
  $("inTitle").textContent = m.titulo; $("inTopic").textContent = m.tema;
  $("inLab").textContent = "🧪 Basado en: "+m.laboratorio;
  $("inStars").textContent = "Dificultad "+"★".repeat(d.estrellas)+"☆".repeat(5-d.estrellas);
  $("inObj").textContent = m.objetivo;
  $("inStats").innerHTML = [
    ["👾 Enemigos", misiones[i].enemigos], ["♥ Golpes por enemigo", d.vida_enemigo],
    ["💢 Daño por error", d.dano], ["⏱ Tiempo por pregunta", d.tiempo ? d.tiempo+" s" : "Sin límite"],
    ["👁 Te persiguen", d.persigue ? "Sí ("+d.radio+" casillas)" : "No"], ["👑 Guardián", m.guardian.nombre]
  ].map(([a,b])=>`<div>${a}<b>${esc(b)}</b></div>`).join("");
  modo = "intro"; $("intro").classList.remove("hidden"); $("btnBegin").focus();
}
$("btnBegin").onclick = () => { $("intro").classList.add("hidden"); empezarNivel(); };

/* ---------------- Juego ---------------- */
let canvasListo = false;
function empezarNivel(){
  if (!canvasListo){ C.initCanvas($("world-canvas")); canvasListo = true; }
  C.cargarNivel(datosNivel);
  clearTimeout(tt); $("toast").classList.add("hidden");
  mostrar("game"); modo = "juego";
  musica("exploracion", idxNivel+1);
  const fd = $("fade"); fd.classList.remove("hidden","out"); void fd.offsetWidth; fd.classList.add("out");
  $("world-canvas").parentElement.classList.remove("glitch");
  $("hudLevel").textContent = "NIVEL "+String(idxNivel+1).padStart(2,"0")+" "+datosNivel.icono;
  $("hudTitle").textContent = datosNivel.titulo;
  hud();
  setTimeout(()=>dialogo("Sistema CyberAgent", [
    "Entrando al "+datosNivel.sector+". "+C.vivos().length+" amenazas detectadas en la red.",
    "Derrota a todos los enemigos para abrir la sala de "+datosNivel.guardian.nombre+". Ellos guardan las pistas que necesitas.",
    (datosNivel.dificultad.persigue ? "⚠ Cuidado: en este sector los enemigos te persiguen si te ven. " : "")+
    (datosNivel.dificultad.tiempo ? "⏱ Tendrás "+datosNivel.dificultad.tiempo+" segundos por pregunta." : "Recoge los poderes del mapa: te van a servir.")
  ]), 250);
}

function hud(){
  const lv = C.nivel; if (!lv) return;
  $("hudHp").textContent = lv.hp; $("hpFill").style.width = Math.max(0, lv.hp/lv.hpMax*100)+"%";
  $("hudEnemies").textContent = C.vivos().length;
  $("hudClues").textContent = lv.pistas.length+"/"+lv.m.pistas.length;
  $("hudXp").textContent = lv.xp;
  $("invEscudo").querySelector("b").textContent = lv.inv.escudo;
  $("invEscaner").querySelector("b").textContent = lv.inv.escaner;
  $("invParche").querySelector("b").textContent = lv.inv.parche;
  $("invTurbo").querySelector("b").textContent = lv.inv.turbo;
  const st = [];
  if (lv.escudo) st.push("🛡 Escudo activo");
  if (performance.now() < lv.turboHasta) st.push("⚡ Turbo");
  if (lv.abierta && !lv.finalOk) st.push("🔓 Sala del guardián abierta");
  if (lv.finalOk) st.push("🌀 Portal activo");
  $("invState").textContent = st.join(" · ");
}
C.hooks.onHud = hud;
if (C.initConsola) C.initConsola();

const NOMBRE_PODER = { "1":["escudo","🛡 Escudo","Úsalo en combate: bloquea el próximo golpe."],
  "2":["escaner","🔍 Escáner","Úsalo en combate: tacha una respuesta incorrecta."],
  "3":["parche","💊 Parche","Recupera 35 de vida (tecla 3)."], "4":["turbo","⚡ Turbo","Corre más rápido 20 s (tecla 4)."] };

C.hooks.onLlegar = () => {
  const lv = C.nivel, p = lv.player;
  const i = lv.items.findIndex(it=>it.x===p.x && it.y===p.y);
  if (i >= 0){
    const it = lv.items.splice(i,1)[0], [k,n,desc] = NOMBRE_PODER[it.tipo];
    lv.inv[k]++; C.sfx.item(); toast("Obtuviste "+n+" — "+desc); hud();
    C.fx.chispas(p.x, p.y, {"1":"#60a5fa","2":"#facc15","3":"#f87171","4":"#fde047"}[it.tipo], 18);
    C.fx.texto(p.x, p.y, "+"+n.split(" ")[1], "#ffffff");
  }
  if (lv.consolaPos && p.x===lv.consolaPos.x && p.y===lv.consolaPos.y && modo==="juego"){ abrirConsola(); return; }
  if (lv.portal && p.x===lv.portal.x && p.y===lv.portal.y){
    if (lv.finalOk && !lv.portalAnim){ lv.portalAnim = performance.now(); modo = "fin"; C.sfx.door();
      C.fx.chispas(p.x, p.y, "#39ff7a", 30); setTimeout(completarNivel, 800); }
    else if (!lv.finalOk) toast("🌀 El portal está apagado. Supera al guardián para activarlo.");
  }
  actualizarAviso();
};
C.hooks.onPuertaSellada = () => toast("🔒 Sala sellada: quedan "+C.vivos().length+" enemigos por derrotar.");
C.hooks.onEnemigo = (e) => {
  if (modo !== "juego") return;
  modo = "combate"; $("prompt").classList.add("hidden"); C.keys.clear();
  transicion(() => C.iniciarCombate(e, false, resultado => {
    modo = "juego"; hud(); musica("exploracion", idxNivel+1);
    if (C.nivel.hp <= 0) return gameOver();
    if (resultado === "victoria"){
      C.nivel.invulnerable = performance.now()+900;
      C.fx.explosion(e.x, e.y, e.info.color); C.temblor(350, 8); C.sfx.hit();
      C.fx.texto(e.x, e.y, "¡ELIMINADO!", "#ffd166");
      if (!C.vivos().length && !C.nivel.abierta){
        C.nivel.abierta = true; setTimeout(()=>C.sfx.door(), 300);
        const lv = C.nivel;
        for (let y=0;y<lv.H;y++) for (let x=0;x<lv.W;x++) if (lv.grid[y][x]==="L") C.fx.chispas(x, y, "#39ff7a", 20);
        C.temblor(500, 5);
        toast("🔓 ¡Todos los enemigos derrotados! La sala de "+C.nivel.m.guardian.nombre+" está abierta.");
      }
    }
    hud();
  }));
};

function transicion(fn){
  const t = $("trans"); t.classList.remove("hidden","go"); void t.offsetWidth; t.classList.add("go");
  setTimeout(()=>{ fn(); }, 520); setTimeout(()=>t.classList.add("hidden"), 900);
}
function actualizarAviso(){
  const lv = C.nivel; if (!lv) return;
  const g = lv.guardian && C.junto(lv.guardian), t = C.terminalCerca();
  $("prompt").innerHTML = g ? "Pulsa <kbd>E</kbd> para hablar" : "Pulsa <kbd>E</kbd> para leer la terminal";
  $("prompt").classList.toggle("hidden", !(modo==="juego" && (g || t)));
}

function hablar(){
  const lv = C.nivel; if (modo!=="juego") return;
  const term = C.terminalCerca();
  if (term && !C.junto(lv.guardian)){
    const nueva = !term.leida;
    dialogo("💻 " + term.titulo, [term.texto].concat(nueva && lv.m.xp.terminal ? ["Registro descargado: +"+lv.m.xp.terminal+" XP."] : []), () => {
      if (nueva){ term.leida = true; lv.leidas++; lv.xp += lv.m.xp.terminal||0; C.sfx.item(); C.fx.chispas(term.x, term.y, "#ffd166", 16);
        C.fx.texto(term.x, term.y, "+"+(lv.m.xp.terminal||0)+" XP", "#ffd166"); hud(); }
      actualizarAviso();
    });
    return;
  }
  if (!C.junto(lv.guardian)) return;
  const g = lv.m.guardian;
  if (lv.finalOk){ dialogo(g.nombre, ["Lo lograste, agente. El portal 🌀 ya está activo: entra para terminar el sector."]); return; }
  dialogo(g.nombre, g.historia.concat([
    "Tienes "+lv.pistas.length+" de "+lv.m.pistas.length+" pistas. Te pondré a prueba: si fallas, pierdes "+lv.m.dificultad.dano_guardian+" de vida."
  ]), () => {
    modo = "combate";
    transicion(() => C.iniciarCombate(lv.guardian, true, resultado => {
      modo = "juego"; hud(); musica("exploracion", idxNivel+1);
      if (lv.hp <= 0) return gameOver();
      if (resultado === "victoria"){ C.sfx.door(); C.temblor(500, 6); C.fx.chispas(lv.portal.x, lv.portal.y, "#39ff7a", 40);
        C.fx.explosion(lv.guardian.x, lv.guardian.y, "#ffd166");
        toast("🌀 ¡Portal activado! Camina hacia él para salir del sector."); }
    }));
  });
}

/* ---------------- Poderes en el mapa ---------------- */
C.usarParche = () => {
  const lv = C.nivel; if (!lv || !lv.inv.parche || lv.hp >= lv.hpMax) return;
  lv.inv.parche--; lv.hp = Math.min(lv.hpMax, lv.hp+35); C.sfx.item(); toast("💊 +35 de vida"); hud();
  C.fx.chispas(lv.player.x, lv.player.y, "#f87171", 16); C.fx.texto(lv.player.x, lv.player.y, "+35 ❤", "#f87171");
};
function usarTurbo(){
  const lv = C.nivel; if (!lv.inv.turbo) return;
  lv.inv.turbo--; lv.turboHasta = performance.now()+20000; C.sfx.item(); toast("⚡ ¡Turbo activado por 20 segundos!"); hud();
  C.fx.chispas(lv.player.x, lv.player.y, "#fde047", 20);
}
function abrirConsola(){
  if (modo!=="juego" || !C.nivel) return;
  const id = C.nivel.m.id, ya = !!(est.flagsCTF[id]);
  modo = "consola"; C.keys.clear(); $("prompt").classList.add("hidden");
  C.abrirConsola(C.nivel.m, ya, (res) => {
    modo = "juego";
    if (res && res.completada){
      const lv = C.nivel;
      if (!est.flagsCTF[id]){ est.flagsCTF[id] = res.flag; guardar(); }
      lv.xp += res.xp || 0; lv.consolaHecha = true;
      C.fx.texto(lv.player.x, lv.player.y, "+"+(res.xp||0)+" XP", "#ffd166");
      toast("⌨️ Consola completada · bandera "+res.flag+" · +"+(res.xp||0)+" XP");
      hud();
    }
    actualizarAviso();
  });
}
$("btnConsola").onclick = abrirConsola;
$("invConsola").onclick = abrirConsola;
$("invParche").onclick = () => modo==="juego" && C.usarParche();
$("invTurbo").onclick = () => modo==="juego" && usarTurbo();
$("invEscudo").onclick = () => toast("🛡 El escudo se activa dentro de un combate.");
$("invEscaner").onclick = () => toast("🔍 El escáner se usa dentro de un combate.");

/* ---------------- Diálogo ---------------- */
let dlg = { lineas:[], i:0, n:0, timer:null, fin:null };
function dialogo(nombre, lineas, fin){
  modo = "dialogo"; $("prompt").classList.add("hidden"); C.keys.clear();
  dlg = { lineas, i:0, n:0, timer:null, fin };
  $("dlgName").textContent = nombre; $("dialog").classList.remove("hidden"); escribir();
}
function escribir(){
  clearInterval(dlg.timer); dlg.n = 0; const l = dlg.lineas[dlg.i];
  dlg.timer = setInterval(()=>{ dlg.n += 2; $("dlgText").textContent = l.slice(0,dlg.n);
    if (dlg.n%6===0) C.sfx.talk(); if (dlg.n>=l.length) clearInterval(dlg.timer); }, 22);
}
function avanzar(){
  const l = dlg.lineas[dlg.i];
  if (dlg.n < l.length){ clearInterval(dlg.timer); dlg.n = l.length; $("dlgText").textContent = l; return; }
  dlg.i++;
  if (dlg.i >= dlg.lineas.length){
    $("dialog").classList.add("hidden"); modo = "juego";
    const f = dlg.fin; dlg.fin = null; if (f) f(); else actualizarAviso(); return;
  }
  escribir();
}
$("dialog").addEventListener("click", avanzar);

/* ---------------- Paneles ---------------- */
function abrirPistas(){
  if (modo!=="juego") return; modo = "panel";
  const lv = C.nivel, ol = $("cluesList"); ol.innerHTML = "";
  lv.m.pistas.forEach((p,i)=>{
    const li = document.createElement("li");
    if (i < lv.pistas.length) li.textContent = lv.pistas[i];
    else { li.textContent = "🔒 Pista bloqueada — derrota otro enemigo"; li.className = "locked"; }
    ol.appendChild(li);
  });
  $("cluesPanel").classList.remove("hidden");
}
function cerrarPistas(){ $("cluesPanel").classList.add("hidden"); modo = "juego"; }
$("btnClues").onclick = abrirPistas;
$("btnCloseClues").onclick = cerrarPistas;
$("btnSound").onclick = () => { C.sonido = !C.sonido; $("btnSound").textContent = C.sonido ? "🔊" : "🔇"; };
function pintarMusica(){ document.querySelectorAll(".btn-music").forEach(b=>{ b.textContent = C.musica && C.musica.activa ? "🎵" : "🎵̸"; b.classList.toggle("off", !(C.musica && C.musica.activa)); }); }
document.querySelectorAll(".btn-music").forEach(b => b.onclick = () => { C.musica.alternar(); pintarMusica(); });
pintarMusica();
$("btnExit").onclick = () => { if (modo==="juego" && confirm("¿Salir al mapa de niveles? Perderás el progreso de este nivel.")) irMundo(); };

/* ---------------- Fin de nivel ---------------- */
function completarNivel(){
  const lv = C.nivel, id = lv.m.id, previo = est.completadas[id];
  modo = "fin"; musica("victoria");
  est.completadas[id] = { xp: Math.max(lv.xp, previo ? previo.xp : 0), flag: lv.flag, fecha: new Date().toISOString() };
  guardar();
  $("ldTitle").textContent = "¡"+lv.m.titulo+" completada!";
  $("ldStats").innerHTML = [["👾 Enemigos", lv.derrotados], ["✓ Aciertos", lv.aciertos], ["✕ Errores", lv.fallos],
    ["❤ Vida final", lv.hp], ["⭐ XP del nivel", lv.xp], ["🧩 Pistas", lv.pistas.length+"/"+lv.m.pistas.length],
    ["💻 Terminales", lv.leidas+"/"+lv.terminales.length]]
    .map(([a,b])=>`<div>${a}<b>${b}</b></div>`).join("");
  $("ldFlag").textContent = "🚩 "+(lv.flag||"");
  const cf = est.flagsCTF[lv.m.id];
  $("ldStats").insertAdjacentHTML("beforeend", cf ? `<div>⌨️ Consola CTF<b style="font-size:12px">${cf}</b></div>` : `<div>⌨️ Consola CTF<b style="font-size:12px;color:#7fb894">pendiente (botón ⌨️)</b></div>`);
  const hay = idxNivel+1 < misiones.length;
  $("btnLdNext").textContent = hay ? "Siguiente nivel ▶" : "🏆 Ver certificado";
  $("levelDone").classList.remove("hidden");
}
$("btnLdWorld").onclick = () => { $("levelDone").classList.add("hidden"); irMundo(); };
$("btnLdNext").onclick = () => {
  $("levelDone").classList.add("hidden");
  if (idxNivel+1 < misiones.length){ irMundo(); abrirIntro(idxNivel+1); }
  else { irMundo(); mostrarCertificado(); }
};

function gameOver(){
  modo = "fin"; musica("derrota"); $("world-canvas").parentElement.classList.add("glitch");
  setTimeout(()=>$("gameOver").classList.remove("hidden"), 600);
}
$("btnGoRetry").onclick = () => { $("gameOver").classList.add("hidden"); empezarNivel(); };
$("btnGoWorld").onclick = () => { $("gameOver").classList.add("hidden"); irMundo(); };

/* ---------------- Certificado ---------------- */
function mostrarCertificado(){
  if (!todoCompleto()) return;
  $("certName").textContent = est.nombre.toUpperCase();
  $("certStats").textContent = xpTotal()+" / "+xpMaxTotal()+" XP · "+misiones.length+" misiones completadas";
  $("certFlags").innerHTML = misiones.map(m=>"<span>"+esc((est.completadas[m.id]||{}).flag||"")+"</span>").join("")
    + Object.values(est.flagsCTF||{}).map(f=>"<span style='border-color:#ffd166'>"+esc(f)+"</span>").join("");
  $("certDate").textContent = new Date().toLocaleDateString("es-CO",{year:"numeric",month:"long",day:"numeric"});
  $("victory").classList.remove("hidden");
}
$("btnPrint").onclick = () => window.print();
$("btnCloseCert").onclick = () => $("victory").classList.add("hidden");

/* ---------------- Mensajes ---------------- */
let tt = null;
function toast(msg){ const t=$("toast"); t.textContent=msg; t.classList.remove("hidden"); clearTimeout(tt); tt=setTimeout(()=>t.classList.add("hidden"), 2800); }

/* ---------------- Teclado y táctil ---------------- */
window.addEventListener("keydown", e=>{
  const k = e.key;
  if (modo==="titulo" || modo==="mundo") return;
  if (modo==="consola") return;
  if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(k)) e.preventDefault();
  if (modo==="intro" && (k==="Enter"||k===" ")){ $("btnBegin").click(); return; }
  if (modo==="dialogo" && (k===" "||k==="Enter"||k==="e"||k==="E")){ avanzar(); return; }
  if (modo==="combate"){ C.teclaCombate(k); return; }
  if (modo==="panel" && (k==="Escape"||k==="p"||k==="P")){ cerrarPistas(); return; }
  if (modo==="juego"){
    if (k===" "||k==="Enter"||k==="e"||k==="E"){ hablar(); return; }
    if (k==="p"||k==="P"){ abrirPistas(); return; }
    if (k==="c"||k==="C"){ abrirConsola(); return; }
    if (k==="3"){ C.usarParche(); return; }
    if (k==="4"){ usarTurbo(); return; }
  }
  C.keys.add(k);
});
window.addEventListener("keyup", e=>C.keys.delete(e.key));
window.addEventListener("blur", ()=>C.keys.clear());
document.querySelectorAll(".dpad button").forEach(b=>{
  const dir = b.dataset.dir;
  const down = e=>{ e.preventDefault();
    if (dir) C.keys.add("pad-"+dir);
    else if (modo==="dialogo") avanzar(); else if (modo==="juego") hablar(); };
  const up = e=>{ e.preventDefault(); if (dir) C.keys.delete("pad-"+dir); };
  b.addEventListener("pointerdown",down); b.addEventListener("pointerup",up); b.addEventListener("pointerleave",up);
});

/* ---------------- Bucle ---------------- */
let ultimoHud = 0;
function bucle(now){
  if (C.nivel && !$("game").classList.contains("hidden")){
    const jugando = modo === "juego";
    C.actualizarJugador(now, jugando);
    C.actualizarEnemigos(now, jugando);
    C.render(now);
    if (now-ultimoHud > 500){ ultimoHud = now; if (jugando) { hud(); actualizarAviso(); } }
  }
  requestAnimationFrame(bucle);
}
requestAnimationFrame(bucle);

// Acceso para pruebas automáticas desde la consola
C.debug = { get modo(){ return modo; }, get misiones(){ return misiones; }, abrirIntro, irMundo };
iniciarApp();
})();
