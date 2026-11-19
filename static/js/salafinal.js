/* =========================================================
   CyberAgent Academy — Sala final: monstruo + animación de victoria
   Creado por Andrés Felipe Beltrán Barrera
   Tras resolver la terminal se abre la última puerta y aparece un monstruo.
   El jugador se mueve (flechas/WASD) y con ESPACIO lanza su poder.
   Al derrotarlo, una animación de victoria con un mensaje temático.
   ========================================================= */
(() => {
"use strict";
const C = window.CAA = window.CAA || {};
const $ = id => document.getElementById(id);
const W = 640, H = 420;

let cv, cx, raf = null, fin = null, data = null;
let st = null;
const keys = new Set();

function onKey(e){
  if (!C.SALA) return;
  const k = e.key.toLowerCase();
  if (["arrowup","arrowdown","arrowleft","arrowright"," ","w","a","s","d"].includes(k)){ e.preventDefault(); }
  if (e.key === " " || k === " ") disparar();
  keys.add(k);
}
function onKeyUp(e){ keys.delete(e.key.toLowerCase()); }

C.salaFinal = function(consola, onDone){
  data = consola; fin = onDone;
  C.SALA = true;
  cv = $("salaCanvas"); cv.width = W; cv.height = H; cx = cv.getContext("2d"); cx.imageSmoothingEnabled = false;
  const mon = consola.monstruo || { nombre: "Monstruo", color: "#ef4444", mensaje: "" };
  st = {
    px: W / 2, py: H - 46, pvx: 0, flash: 0,
    mon: { x: W / 2, y: 90, vx: 2.2, hp: 6, hpMax: 6, color: mon.color, nombre: mon.nombre, mensaje: mon.mensaje, hit: 0, t: 0 },
    balas: [], enemBalas: [], part: [], cd: 0, enemCd: 60, ganado: false, winT: 0, now: 0,
  };
  $("salaMsg").textContent = "🚪 ¡La terminal abrió la última puerta! Apareció " + mon.nombre;
  $("salaInfo").classList.add("hidden");
  $("salaWin").classList.add("hidden");
  $("salaNext").classList.add("hidden");
  $("salaFinal").classList.remove("hidden");
  // Pantalla previa: avisa de la batalla y explica los controles ANTES de empezar.
  st.listo = false;
  const rt = $("salaReadyTxt");
  if (rt) rt.textContent = "Resolviste la terminal y se abrió la última puerta. ¡Aparece " + mon.nombre + "!";
  $("salaReady").classList.remove("hidden");
  $("salaStart").onclick = () => {
    $("salaReady").classList.add("hidden");
    $("salaInfo").classList.remove("hidden");
    st.listo = true;
  };
  window.addEventListener("keydown", onKey, true);
  window.addEventListener("keyup", onKeyUp, true);
  // d-pad / touch: reuse botones del juego no aplica; añadimos disparo al tocar canvas
  cv.onpointerdown = (ev) => { const r = cv.getBoundingClientRect(); st.px = (ev.clientX - r.left) / r.width * W; disparar(); };
  C.sfx && C.sfx.battle && C.sfx.battle();
  loop();
};

function disparar(){
  if (!st || !st.listo || st.ganado || st.cd > 0) return;
  st.balas.push({ x: st.px, y: st.py - 18, vy: -8 });
  st.cd = 12;
  C.sfx && C.sfx.beep && C.sfx.beep(880, 0.05, "square", 0.04);
}
function boom(x, y, color, n){
  for (let i = 0; i < n; i++){ const a = Math.random() * 7, v = 1 + Math.random() * 4;
    st.part.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vida: 0, max: 30 + Math.random() * 25, color: Math.random() < .3 ? "#fff" : color, t: 2 + Math.random() * 3 }); }
}

function update(){
  const s = st, m = s.mon;
  if (!s.listo) return;   // esperando a que el jugador pulse «Comenzar batalla»
  s.now++;
  if (s.cd > 0) s.cd--;
  if (!s.ganado){
    // jugador
    const sp = 4.2;
    if (keys.has("arrowleft") || keys.has("a")) s.px -= sp;
    if (keys.has("arrowright") || keys.has("d")) s.px += sp;
    if (keys.has("arrowup") || keys.has("w")) s.py -= sp;
    if (keys.has("arrowdown") || keys.has("s")) s.py += sp;
    s.px = Math.max(24, Math.min(W - 24, s.px));
    s.py = Math.max(H / 2, Math.min(H - 30, s.py));
    // monstruo se mueve
    m.t++; m.x += m.vx; if (m.x < 70 || m.x > W - 70) m.vx *= -1;
    m.y = 90 + Math.sin(m.t / 40) * 18;
    if (m.hit > 0) m.hit--;
    // disparos del monstruo (esquivables, no matan)
    if (--s.enemCd <= 0){ s.enemCd = Math.max(40, 90 - (m.hpMax - m.hp) * 6);
      const dx = (s.px - m.x), dy = (s.py - m.y), d = Math.hypot(dx, dy) || 1;
      s.enemBalas.push({ x: m.x, y: m.y + 20, vx: dx / d * 3, vy: dy / d * 3 }); }
  }
  // balas del jugador
  s.balas.forEach(b => b.y += b.vy);
  s.balas = s.balas.filter(b => {
    if (b.y < -10) return false;
    if (!s.ganado && Math.abs(b.x - m.x) < 34 && Math.abs(b.y - m.y) < 30){
      m.hp--; m.hit = 8; boom(b.x, b.y, m.color, 10); C.sfx && C.sfx.hit && C.sfx.hit();
      if (m.hp <= 0){ ganar(); }
      return false;
    }
    return true;
  });
  // balas del monstruo
  s.enemBalas.forEach(b => { b.x += b.vx; b.y += b.vy; });
  s.enemBalas = s.enemBalas.filter(b => {
    if (b.x < -10 || b.x > W + 10 || b.y < -10 || b.y > H + 10) return false;
    if (!s.ganado && Math.abs(b.x - s.px) < 16 && Math.abs(b.y - s.py) < 16){ s.flash = 10; C.sfx && C.sfx.bump && C.sfx.bump(); return false; }
    return true;
  });
  if (s.flash > 0) s.flash--;
  // partículas
  s.part.forEach(p => { p.vida++; p.x += p.vx; p.y += p.vy; p.vy += 0.08; });
  s.part = s.part.filter(p => p.vida < p.max);
  if (s.ganado){ s.winT++; if (s.winT === 1) boom(m.x, m.y, m.color, 60); if (s.winT < 40 && s.winT % 4 === 0) boom(m.x + (Math.random() - .5) * 40, m.y + (Math.random() - .5) * 40, m.color, 14); }
}

function ganar(){
  st.ganado = true; st.winT = 0;
  C.sfx && C.sfx.win && C.sfx.win();
  const m = st.mon;
  $("salaInfo").classList.add("hidden");
  const win = $("salaWin");
  const apr = (data.aprendizajes || []).map(a => "<li>" + a + "</li>").join("");
  win.innerHTML = `<div class="win-t">¡MONSTRUO DERROTADO!</div>
    <div class="win-n">${m.nombre} — ${m.mensaje || ""}</div>
    <div class="win-recap"><div class="win-rt">📚 En este nivel aprendiste:</div><ul>${apr}</ul></div>
    <div class="win-cap">💪 Ahora eres capaz de: <b>${data.capacidad || ""}</b></div>
    <div class="win-f">🚩 Bandera: <b>${data.flag}</b></div>`;
  setTimeout(() => { win.classList.remove("hidden"); $("salaNext").classList.remove("hidden"); $("salaNext").focus(); }, 900);
}

function render(){
  const s = st, m = s.mon, now = s.now;
  // fondo de la sala
  cx.fillStyle = "#02100a"; cx.fillRect(0, 0, W, H);
  for (let y = 0; y < H; y += 24){ cx.fillStyle = "rgba(57,255,122,.05)"; cx.fillRect(0, y, W, 1); }
  // puerta al fondo
  cx.fillStyle = "rgba(57,255,122,.10)"; cx.fillRect(W / 2 - 60, 20, 120, 60);
  cx.strokeStyle = "rgba(57,255,122,.5)"; cx.lineWidth = 2; cx.strokeRect(W / 2 - 60, 20, 120, 60);
  // partículas detrás
  s.part.forEach(p => { const a = 1 - p.vida / p.max; cx.globalAlpha = a; cx.fillStyle = p.color; cx.fillRect(p.x - p.t / 2, p.y - p.t / 2, p.t, p.t); });
  cx.globalAlpha = 1;
  // monstruo (boss)
  if (!s.ganado || s.winT < 30){
    cx.save();
    if (m.hit > 0){ cx.shadowColor = "#fff"; cx.shadowBlur = 20; }
    else { cx.shadowColor = m.color; cx.shadowBlur = 14; }
    const esc = 3.2;
    if (C.dibujarEnemigo) C.dibujarEnemigo(cx, m.x - 16 * esc / 2 * 2, m.y - 16 * esc / 2 * 2, m.color, now * 4, esc, true);
    else { cx.fillStyle = m.color; cx.fillRect(m.x - 30, m.y - 30, 60, 60); }
    cx.restore();
    // barra de vida del monstruo
    cx.fillStyle = "#1a0507"; cx.fillRect(m.x - 50, m.y - 54, 100, 8);
    cx.fillStyle = "#ff4d6d"; cx.fillRect(m.x - 50, m.y - 54, 100 * Math.max(0, m.hp / m.hpMax), 8);
    cx.strokeStyle = "#000"; cx.strokeRect(m.x - 50, m.y - 54, 100, 8);
    cx.fillStyle = "#fff"; cx.font = "bold 12px monospace"; cx.textAlign = "center"; cx.fillText(m.nombre, m.x, m.y - 60);
  }
  // balas del monstruo
  s.enemBalas.forEach(b => { cx.fillStyle = m.color; cx.beginPath(); cx.arc(b.x, b.y, 5, 0, 7); cx.fill(); cx.fillStyle = "rgba(255,255,255,.6)"; cx.fillRect(b.x - 1, b.y - 1, 2, 2); });
  // balas del jugador (poder)
  s.balas.forEach(b => { cx.fillStyle = "#39ff7a"; cx.fillRect(b.x - 3, b.y - 10, 6, 14); cx.fillStyle = "#d1fae5"; cx.fillRect(b.x - 1, b.y - 10, 2, 14); });
  // jugador
  if (!s.ganado || true){
    const blink = s.flash > 0 && Math.floor(now / 3) % 2 === 0;
    if (!blink){ cx.save(); cx.shadowColor = "rgba(57,255,122,.9)"; cx.shadowBlur = 8;
      if (C.dibujarPersona) C.dibujarPersona(cx, s.px - 16, s.py - 16, "up", null, Math.floor(now / 8) % 4, true, 0, "agente", 2);
      else { cx.fillStyle = "#39ff7a"; cx.fillRect(s.px - 10, s.py - 10, 20, 20); }
      cx.restore(); }
  }
  // viñeta + flash
  if (s.flash > 0){ cx.fillStyle = `rgba(255,60,90,${s.flash / 30})`; cx.fillRect(0, 0, W, H); }
  if (s.ganado && s.winT < 12){ cx.fillStyle = `rgba(255,255,255,${1 - s.winT / 12})`; cx.fillRect(0, 0, W, H); }
  cx.textAlign = "left";
}

function loop(){
  if (!C.SALA){ raf = null; return; }
  update(); render();
  raf = requestAnimationFrame(loop);
}

C.salaDebug = { get st(){ return st; }, ganar: () => ganar(), disparar };
C.initSalaFinal = function(){
  $("salaNext").onclick = () => {
    C.SALA = false; if (raf) cancelAnimationFrame(raf); raf = null;
    window.removeEventListener("keydown", onKey, true);
    window.removeEventListener("keyup", onKeyUp, true);
    keys.clear();
    $("salaFinal").classList.add("hidden");
    const cb = fin; fin = null; cb && cb();
  };
};
})();
