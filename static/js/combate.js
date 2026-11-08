/* =========================================================
   CyberAgent Academy — Combate por turnos (estilo Pokémon)
   Creado por Andrés Felipe Beltrán Barrera
   Cada respuesta correcta es un golpe al enemigo; cada error
   le quita vida al agente. Las respuestas se validan en el servidor.
   ========================================================= */
(() => {
"use strict";
const C = window.CAA = window.CAA || {};
const $ = id => document.getElementById(id);

const B = C.combate = { activo:false, enemigo:null, jefe:false, reto:null, tachadas:[],
                        esperando:false, resuelto:false, timer:null, tFin:0, fin:null };

function barajar(a){ for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function siguienteReto(){
  const lv = C.nivel;
  if (!lv.deck.length) lv.deck = barajar(lv.m.retos.map(r=>r.id));
  const id = lv.deck.pop();
  return lv.m.retos.find(r=>r.id===id);
}
const esc = s => String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* ---------- abrir combate ---------- */
C.iniciarCombate = function(enemigo, jefe, alTerminar){
  const lv = C.nivel;
  Object.assign(B, { activo:true, enemigo, jefe, fin:alTerminar, tachadas:[], resuelto:false });
  $("battle").classList.remove("hidden");
  $("battle").querySelector(".battle-card").classList.toggle("boss", jefe);
  $("foeName").textContent = jefe ? "👑 "+enemigo.nombre+" (Guardián)" : enemigo.info.nombre;
  $("foeTaunt").textContent = jefe ? "«Demuestra lo que aprendiste. Una sola respuesta decide tu graduación de este sector.»"
                                   : "«"+enemigo.info.frase+"»";
  $("bFlee").classList.toggle("hidden", false);
  const pc = $("bClues");
  if (jefe){
    pc.classList.remove("hidden");
    pc.innerHTML = "🧩 <b>Tus pistas:</b><ol>" + (lv.pistas.length ? lv.pistas.map(p=>"<li>"+esc(p)+"</li>").join("") : "<li>No tienes pistas…</li>") + "</ol>";
  } else pc.classList.add("hidden");
  B.efecto = null;
  dibujarRival();
  C.sfx.battle();
  C.musica && C.musica.tocar(jefe ? "jefe" : "combate");
  nuevaPregunta();
};

/* ---------- animación del combate ---------- */
B.efecto = null; B.raf = null;
function efecto(tipo){ B.efecto = { tipo, t0: performance.now() }; }
function flotante(texto, clase, dondeYo){
  const card = $("battle").querySelector(".battle-card"), el = document.createElement("div");
  el.className = "float-num " + clase; el.textContent = texto;
  const ref = dondeYo ? $("meCanvas") : $("foeCanvas"), rc = ref.getBoundingClientRect(), rcard = card.getBoundingClientRect();
  el.style.left = (rc.left - rcard.left + rc.width/2 + (Math.random()*30-15)) + "px";
  el.style.top = (rc.top - rcard.top + 10) + "px";
  card.appendChild(el); setTimeout(()=>el.remove(), 1200);
}
function animar(){
  if (!B.activo){ B.raf = null; return; }
  const now = performance.now();
  // rival
  const c = $("foeCanvas"), x = c.getContext("2d");
  x.imageSmoothingEnabled = false; x.clearRect(0,0,96,96);
  let dx = 0, dy = Math.sin(now/300)*2, esc = 1, alpha = 1, blanco = false;
  const ef = B.efecto, k = ef ? (now-ef.t0) : 9999;
  if (ef && ef.tipo==="golpe" && k < 450){ dx = Math.sin(k/18)*6*(1-k/450); blanco = Math.floor(k/70)%2===0; }
  if (ef && ef.tipo==="ataque" && k < 500){ const q = Math.sin(Math.min(1,k/500)*Math.PI); esc = 1+q*0.25; dy += q*10; }
  if (ef && ef.tipo==="derrota"){ const q = Math.min(1,k/900); dy += q*30; alpha = 1-q; }
  x.fillStyle = "rgba(57,255,122,.18)"; x.beginPath(); x.ellipse(48, 84, 38, 9, 0, 0, 7); x.fill();
  x.save(); x.globalAlpha = alpha; x.translate(48+dx, 48+dy); x.scale(esc, esc);
  if (B.jefe) C.dibujarPersona(x, -40, -44, "down", B.enemigo.color, Math.floor(now/400)%2 ? 0 : 0, false, 0, B.enemigo.sprite, 5);
  else C.dibujarEnemigo(x, -40, -44, B.enemigo.info.color, now, 2.5, true, B.enemigo.info.sprite);
  x.restore();
  if (blanco){ x.globalCompositeOperation = "source-atop"; x.fillStyle = "rgba(255,255,255,.85)"; x.fillRect(0,0,96,96); x.globalCompositeOperation = "source-over"; }
  if (ef && ef.tipo==="golpe" && k < 350){ // tajo
    x.strokeStyle = `rgba(255,255,255,${1-k/350})`; x.lineWidth = 4;
    for (let i=0;i<3;i++){ x.beginPath(); x.moveTo(10+i*14, 10); x.lineTo(10+i*14 + 60*Math.min(1,k/120), 10 + 70*Math.min(1,k/120)); x.stroke(); }
  }
  if (ef && ef.tipo==="derrota" && k < 900){
    for (let i=0;i<14;i++){ const a = i*0.45 + k/300, r = k/12; x.fillStyle = i%2 ? "#fff" : (B.jefe ? B.enemigo.color : B.enemigo.info.color);
      x.fillRect(48+Math.cos(a)*r, 48+Math.sin(a)*r, 4, 4); }
  }
  // jugador (de espaldas)
  const m = $("meCanvas"), y = m.getContext("2d");
  y.imageSmoothingEnabled = false; y.clearRect(0,0,m.width,m.height);
  let jx = 0;
  if (ef && ef.tipo==="ataque" && k < 450) jx = Math.sin(k/20)*5*(1-k/450);
  if (ef && ef.tipo==="golpe" && k < 250) jx = -Math.sin(k/250*Math.PI)*8;
  y.fillStyle = "rgba(57,255,122,.22)"; y.beginPath(); y.ellipse(40, 66, 34, 7, 0, 0, 7); y.fill();
  y.save(); y.shadowColor = "rgba(57,255,122,.9)"; y.shadowBlur = 8;
  C.dibujarPersona(y, 8+jx, 4+Math.round(Math.sin(now/450)), "up", null, 0, true, 0, C.spriteJugador || "agente", 4);
  y.restore();
  if (ef && ef.tipo==="ataque" && k < 300 && Math.floor(k/60)%2===0){ y.globalCompositeOperation="source-atop"; y.fillStyle="rgba(255,40,60,.7)"; y.fillRect(0,0,m.width,m.height); y.globalCompositeOperation="source-over"; }
  if (C.nivel.escudo){ y.strokeStyle=`rgba(96,165,250,${0.5+0.3*Math.sin(now/150)})`; y.lineWidth=3; y.beginPath(); y.arc(40,38,34,0,7); y.stroke(); }
  B.raf = requestAnimationFrame(animar);
}
function dibujarRival(){
  const vida = B.jefe ? (C.nivel.finalOk ? 0 : 1) : B.enemigo.vida, max = B.jefe ? 1 : B.enemigo.vidaMax;
  let s=""; for (let i=0;i<max;i++) s += i<vida ? "♥" : "♡";
  $("foeHp").textContent = s;
  if (!B.raf) B.raf = requestAnimationFrame(animar);
}

function actualizarBarras(){
  const lv = C.nivel, pct = Math.max(0, lv.hp/lv.hpMax*100);
  $("bHp").textContent = lv.hp; $("bHpFill").style.width = pct+"%";
  $("bShield").classList.toggle("hidden", !lv.escudo);
  $("bEscudo").querySelector("b").textContent = lv.inv.escudo;
  $("bEscaner").querySelector("b").textContent = lv.inv.escaner;
  $("bParche").querySelector("b").textContent = lv.inv.parche;
  $("bEscudo").disabled = !lv.inv.escudo || lv.escudo || B.esperando;
  $("bEscaner").disabled = !lv.inv.escaner || B.resuelto || B.esperando;
  $("bParche").disabled = !lv.inv.parche || lv.hp>=lv.hpMax || B.esperando;
  C.hooks.onHud && C.hooks.onHud();
}

function nuevaPregunta(){
  const lv = C.nivel;
  B.reto = B.jefe ? Object.assign({ id:"final" }, lv.m.final) : siguienteReto();
  B.tachadas = []; B.resuelto = false; B.esperando = false;
  $("bQuestion").textContent = B.reto.pregunta;
  $("bFeedback").innerHTML = ""; $("bFeedback").className = "feedback";
  $("bNext").classList.add("hidden");
  const box = $("bAnswers"); box.innerHTML = "";
  B.reto.opciones.forEach((t,k)=>{
    const b = document.createElement("button"); b.className="answer";
    b.innerHTML = "<b>"+"ABCD"[k]+")</b>"; b.appendChild(document.createTextNode(t));
    b.onclick = () => responder(k, b);
    box.appendChild(b);
  });
  actualizarBarras();
  iniciarTemporizador();
}

/* ---------- temporizador (sube con la dificultad) ---------- */
function iniciarTemporizador(){
  pararTemporizador();
  let seg = C.nivel.m.dificultad.tiempo;
  if (!seg){ $("bTimerWrap").classList.add("hidden"); return; }
  if (B.jefe) seg += 10;
  $("bTimerWrap").classList.remove("hidden");
  const total = seg*1000; B.tFin = performance.now()+total; let ultimoTick = 99;
  B.timer = setInterval(()=>{
    const resta = B.tFin - performance.now(), pct = Math.max(0, resta/total*100);
    $("bTimer").style.width = pct+"%"; $("bTimer").classList.toggle("low", pct<30);
    const s = Math.ceil(resta/1000); if (s<=5 && s!==ultimoTick){ ultimoTick=s; C.sfx.tick(); }
    if (resta<=0){ pararTemporizador(); fallo("⏱ ¡Tiempo agotado! El enemigo aprovechó tu duda."); }
  }, 100);
}
function pararTemporizador(){ if (B.timer){ clearInterval(B.timer); B.timer=null; } }

/* ---------- responder ---------- */
async function responder(k, btn){
  if (B.esperando || B.resuelto) return;
  B.esperando = true; pararTemporizador();
  [...$("bAnswers").children].forEach(b=>b.disabled=true);
  actualizarBarras();
  const lv = C.nivel, est = C.estado;
  let r;
  try {
    r = await C.API.responder({ agente:est.agente, nombre:est.nombre, mision:lv.m.id, reto:B.reto.id, opcion:k,
                                xp_nivel: lv.xp + (B.jefe ? lv.m.xp.final : 0) });
  } catch(e){
    B.esperando=false; $("bFeedback").className="feedback bad";
    $("bFeedback").textContent="⚠ No hay conexión con el servidor (¿está corriendo python app.py?).";
    [...$("bAnswers").children].forEach((b,i)=>{ if(!B.tachadas.includes(i)) b.disabled=false; });
    return;
  }
  B.esperando = false;
  if (r.correcta){
    btn.classList.add("correct"); acierto(r);
  } else {
    btn.classList.add("wrong");
    B.tachadas.push(k);
    fallo("✕ Incorrecto. " + (r.explicacion ? "Dato clave: "+r.explicacion : ""));
  }
}

function acierto(r){
  const lv = C.nivel; B.resuelto = true; lv.aciertos++;
  C.sfx.ok();
  if (B.jefe){
    lv.finalOk = true; lv.xp += lv.m.xp.final; lv.flag = r.flag;
    efecto("derrota"); flotante("+"+lv.m.xp.final+" XP", "xp"); dibujarRival();
    $("bFeedback").className="feedback good";
    $("bFeedback").innerHTML = "👑 <b>¡Guardián superado!</b> "+esc(r.explicacion||"")+
      "<span class='def'>🛡 Defensa: "+esc(r.defensa||"")+"</span><br><span class='flag'>🚩 "+esc(r.flag||"")+"</span> &nbsp; <b>+"+lv.m.xp.final+" XP</b>";
    mostrarSiguiente("Ir al portal 🌀");
    return;
  }
  const e = B.enemigo; e.vida--; lv.xp += lv.m.xp.por_golpe;
  efecto(e.vida <= 0 ? "derrota" : "golpe"); flotante("−1 ♥", "dmg"); setTimeout(()=>flotante("+"+lv.m.xp.por_golpe+" XP", "xp"), 250);
  dibujarRival();
  let html = "⚔ <b>¡Golpe certero!</b> "+esc(r.explicacion||"")+" <b>+"+lv.m.xp.por_golpe+" XP</b>";
  if (e.vida <= 0){
    e.vivo = false; lv.derrotados++;
    html += "<br>💥 <b>"+esc(e.info.nombre)+" fue eliminado.</b>";
    if (lv.pistas.length < lv.m.pistas.length){
      const p = lv.m.pistas[lv.pistas.length]; lv.pistas.push(p);
      html += "<br>🧩 Soltó una pista: <i>"+esc(p)+"</i>";
    }
    if (Math.random() < 0.4){
      const tipo = ["escudo","escaner","parche"][Math.floor(Math.random()*3)];
      lv.inv[tipo]++; html += "<br>🎁 También dejó caer: <b>"+{escudo:"🛡 Escudo",escaner:"🔍 Escáner",parche:"💊 Parche"}[tipo]+"</b>";
    }
    mostrarSiguiente("Continuar ▶");
  } else {
    html += "<br>Al enemigo le quedan "+e.vida+" ♥.";
    mostrarSiguiente("Siguiente ataque ▶");
  }
  $("bFeedback").className="feedback good"; $("bFeedback").innerHTML = html;
  actualizarBarras();
}

function fallo(msg){
  const lv = C.nivel; lv.fallos++;
  const dano = B.jefe ? lv.m.dificultad.dano_guardian : lv.m.dificultad.dano;
  let html = esc(msg);
  if (lv.escudo){
    lv.escudo = false; C.sfx.item(); flotante("¡BLOQUEADO!", "shield", true); efecto("ataque");
    html += "<br>🛡 <b>Tu escudo bloqueó el ataque.</b> No perdiste vida.";
  } else {
    lv.hp = Math.max(0, lv.hp - dano); C.sfx.hit(); efecto("ataque"); flotante("−"+dano, "dmg", true);
    const card = $("battle").querySelector(".battle-card");
    card.classList.remove("hit"); void card.offsetWidth; card.classList.add("hit");
    html += "<br>💢 Recibiste <b>"+dano+"</b> de daño.";
  }
  $("bFeedback").className="feedback bad"; $("bFeedback").innerHTML = html;
  actualizarBarras();
  if (lv.hp <= 0){ B.resuelto = true; mostrarSiguiente("Continuar ▶"); B.perdio = true; return; }
  if (B.jefe){
    // el guardián repite su pregunta: quedan las opciones no tachadas
    [...$("bAnswers").children].forEach((b,i)=>{ if (!B.tachadas.includes(i)) b.disabled=false; });
    iniciarTemporizador();
  } else {
    B.resuelto = true; mostrarSiguiente("Siguiente pregunta ▶");
  }
}

function mostrarSiguiente(txt){ $("bNext").textContent = txt; $("bNext").classList.remove("hidden"); $("bNext").focus(); actualizarBarras(); }

function siguiente(){
  if ($("bNext").classList.contains("hidden")) return;
  const lv = C.nivel;
  if (B.perdio){ B.perdio=false; cerrar("derrota"); return; }
  if (B.jefe && lv.finalOk){ cerrar("victoria"); return; }
  if (!B.jefe && !B.enemigo.vivo){ cerrar("victoria"); return; }
  nuevaPregunta();
}

function cerrar(resultado){
  pararTemporizador();
  if (B.raf){ cancelAnimationFrame(B.raf); B.raf = null; }
  B.activo = false; $("battle").classList.add("hidden");
  const cb = B.fin; B.fin = null; cb && cb(resultado);
}

/* ---------- poderes en combate ---------- */
async function usarEscaner(){
  const lv = C.nivel; if (!lv.inv.escaner || B.resuelto || B.esperando) return;
  B.esperando = true; actualizarBarras();
  try {
    const r = await C.API.descartar({ mision:lv.m.id, reto:B.reto.id, excluidas:B.tachadas });
    if (r.descartar !== null && r.descartar !== undefined){
      lv.inv.escaner--; B.tachadas.push(r.descartar);
      const b = $("bAnswers").children[r.descartar]; b.disabled=true; b.classList.add("struck");
      C.sfx.item();
    }
  } catch(e){}
  B.esperando = false; actualizarBarras();
}
function usarEscudo(){ const lv=C.nivel; if (!lv.inv.escudo || lv.escudo) return; lv.inv.escudo--; lv.escudo=true; C.sfx.item(); actualizarBarras(); }
function usarParche(){ C.usarParche && C.usarParche(); actualizarBarras(); }
function huir(){
  const lv = C.nivel;
  if (B.esperando) return;
  lv.hp = Math.max(1, lv.hp-5);
  if (!B.jefe){ const e = B.enemigo; e.x=e.fx=e.sx=e.spawn.x; e.y=e.fy=e.sy=e.spawn.y; e.moving=false; e.stun=performance.now()+3000; }
  lv.invulnerable = performance.now()+1800;
  cerrar("huida");
}

$("bNext").onclick = siguiente;
$("bEscaner").onclick = usarEscaner;
$("bEscudo").onclick = usarEscudo;
$("bParche").onclick = usarParche;
$("bFlee").onclick = huir;

C.teclaCombate = function(k){
  if (!B.activo) return false;
  if ((k==="Enter"||k===" ") && !$("bNext").classList.contains("hidden")){ siguiente(); return true; }
  const idx = "1234".indexOf(k) >= 0 ? "1234".indexOf(k) : "abcd".indexOf(k.toLowerCase());
  if (idx >= 0 && k.length===1){ const b = $("bAnswers").children[idx]; if (b && !b.disabled) b.click(); return true; }
  return false;
};
})();
