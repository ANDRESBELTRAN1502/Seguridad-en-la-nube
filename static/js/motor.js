
(() => {
"use strict";
const C = window.CAA = window.CAA || {};
const T = 32;
C.T = T;
C.MOBILE = window.innerWidth < 760;
C.VIEW_W = C.MOBILE ? 11 : 20;
C.VIEW_H = C.MOBILE ? 13 : 14;
const SOLIDOS = new Set(["#","R","D","P","T","N","M","C","U","H","I"]);
const DIRS = { up:[0,-1], down:[0,1], left:[-1,0], right:[1,0] };
const FILA_DIR = { down:0, left:1, right:2, up:3 };
C.DIRS = DIRS;
C.hooks = {};
C.nivel = null;

/* ---------------- Sprites (static/img/personajes/sprites) ---------------- */
const sprites = {};
C.spriteUrl = id => (window.CAA_SPRITES && window.CAA_SPRITES[id]) || ("/static/img/personajes/sprites/" + id + ".png");
C.sprite = function(id){
  if (!id) return null;
  if (!sprites[id]){
    const img = new Image(); img._ok = false;
    img.onload = () => { img._ok = true; }; img.onerror = () => { img._err = true; };
    img.src = C.spriteUrl(id); sprites[id] = img;
  }
  return sprites[id]._ok ? sprites[id] : null;
};

/* ---------------- Carga del nivel ---------------- */
C.cargarNivel = function(m){
  const grid = m.mapa.map(r => r.split(""));
  const W = Math.max(...grid.map(r=>r.length)), H = grid.length;
  grid.forEach(r => { while (r.length < W) r.push("#"); });
  const d = m.dificultad;
  const lv = { m, grid, W, H, enemigos:[], items:[], guardian:null, portal:null, inicio:null, terminales:[],
               abierta:false, finalOk:false, pistas:[], xp:0, aciertos:0, fallos:0, derrotados:0, leidas:0,
               hp:100, hpMax:100, inv:{ escudo:0, escaner:1, parche:1, turbo:0 }, escudo:false,
               turboHasta:0, invulnerable:0, deck:[], cam:null };
  let ei = 0, ti = 0;
  for (let y=0;y<H;y++) for (let x=0;x<W;x++){
    const ch = grid[y][x];
    if (ch==="S"){ lv.inicio={x,y}; grid[y][x]="."; }
    else if (ch==="E"){
      const info = m.enemigos[ei % m.enemigos.length];
      lv.enemigos.push({ id:ei, x, y, fx:x, fy:y, sx:x, sy:y, spawn:{x,y}, info, vivo:true,
        vida:d.vida_enemigo, vidaMax:d.vida_enemigo, next:performance.now()+1500+Math.random()*1500,
        moving:false, t0:0, stun:0, dir:"down" });
      C.sprite(info.sprite); ei++; grid[y][x]=".";
    }
    else if (ch==="G"){ lv.guardian = { x, y, nombre:m.guardian.nombre, color:m.guardian.color, sprite:m.guardian.sprite }; C.sprite(m.guardian.sprite); grid[y][x]="."; }
    else if (ch==="X"){ lv.portal = {x,y}; }
    else if (ch==="I"){ const t = (m.terminales||[])[ti] || { titulo:"Terminal", texto:"Sin datos." }; lv.terminales.push({ x, y, ...t, leida:false }); ti++; }
    else if (ch==="K"){ lv.consolaPos = {x,y}; }
    else if ("1234".includes(ch)){ lv.items.push({x,y,tipo:ch}); grid[y][x]="."; }
  }
  if (!lv.inicio) lv.inicio = {x:1,y:1};
  const p = lv.inicio;
  lv.player = { x:p.x, y:p.y, fx:p.x, fy:p.y, sx:p.x, sy:p.y, dir:"up", moving:false, t0:0, anim:0 };
  C.sprite("agente");
  C.particulas.length = 0;
  C.nivel = lv;
  return lv;
};

C.vivos = () => C.nivel.enemigos.filter(e=>e.vivo);

function terreno(x,y){
  const lv = C.nivel;
  if (x<0||y<0||x>=lv.W||y>=lv.H) return true;
  const ch = lv.grid[y][x];
  if (SOLIDOS.has(ch)) return true;
  if (ch==="L" && !lv.abierta) return true;
  return false;
}
C.terreno = terreno;
const esGuardian = (x,y) => C.nivel.guardian && C.nivel.guardian.x===x && C.nivel.guardian.y===y;
const enemigoEn = (x,y) => C.nivel.enemigos.find(e => e.vivo && e.x===x && e.y===y);
C.enemigoEn = enemigoEn;

/* ---------------- Efectos: partículas, textos flotantes, temblor ---------------- */
C.particulas = [];
const P = C.particulas;
let temblorHasta = 0, temblorFuerza = 0;
C.temblor = (ms=300, fuerza=6) => { temblorHasta = performance.now()+ms; temblorFuerza = fuerza; };
C.fx = {
  explosion(tx, ty, color){
    for (let i=0;i<34;i++){ const a = Math.random()*Math.PI*2, v = 1.5+Math.random()*4;
      P.push({ x:tx*T+16, y:ty*T+16, vx:Math.cos(a)*v, vy:Math.sin(a)*v-1.5, g:0.12, vida:0, max:40+Math.random()*25,
               color: Math.random()<.3 ? "#ffffff" : color, tam: 2+Math.random()*3 }); }
    for (let i=0;i<8;i++) P.push({ x:tx*T+16, y:ty*T+16, vx:0, vy:0, g:0, vida:0, max:22, anillo:true, r0:4+i*3, color });
  },
  chispas(tx, ty, color, n=14){
    for (let i=0;i<n;i++){ const a = Math.random()*Math.PI*2, v = 0.6+Math.random()*1.8;
      P.push({ x:tx*T+16, y:ty*T+16, vx:Math.cos(a)*v, vy:Math.sin(a)*v-1, g:-0.01, vida:0, max:30+Math.random()*20, color, tam:2 }); }
  },
  polvo(tx, ty){
    for (let i=0;i<3;i++) P.push({ x:tx*T+10+Math.random()*12, y:ty*T+28, vx:(Math.random()-.5)*0.6, vy:-0.3-Math.random()*0.3,
      g:0, vida:0, max:18, color:"rgba(200,255,220,.35)", tam:2 });
  },
  texto(tx, ty, txt, color){ P.push({ x:tx*T+16, y:ty*T, vx:0, vy:-0.7, g:0, vida:0, max:70, txt, color }); }
};

/* ---------------- Jugador ---------------- */
const keys = new Set();
C.keys = keys;
function dirPulsada(){
  if (keys.has("ArrowUp")||keys.has("w")||keys.has("W")||keys.has("pad-up")) return "up";
  if (keys.has("ArrowDown")||keys.has("s")||keys.has("S")||keys.has("pad-down")) return "down";
  if (keys.has("ArrowLeft")||keys.has("a")||keys.has("A")||keys.has("pad-left")) return "left";
  if (keys.has("ArrowRight")||keys.has("d")||keys.has("D")||keys.has("pad-right")) return "right";
  return null;
}
let ultimoChoque = 0;
function pasoMs(now){ return now < C.nivel.turboHasta ? 85 : 140; }

C.actualizarJugador = function(now, puedeMover){
  const lv = C.nivel, p = lv.player;
  if (p.moving){
    const k = Math.min(1, (now-p.t0)/pasoMs(now));
    p.fx = p.sx + (p.x-p.sx)*k; p.fy = p.sy + (p.y-p.sy)*k;
    if (k>=1){ p.moving=false; p.fx=p.x; p.fy=p.y; if (now < lv.turboHasta) C.fx.chispas(p.x,p.y,"#fde047",3); C.hooks.onLlegar && C.hooks.onLlegar(); }
    else return;
  }
  if (!puedeMover) return;
  const d = dirPulsada(); if (!d) return;
  p.dir = d;
  const [dx,dy] = DIRS[d], nx = p.x+dx, ny = p.y+dy;
  const e = enemigoEn(nx,ny);
  if (e){ if (now > lv.invulnerable) C.hooks.onEnemigo && C.hooks.onEnemigo(e); return; }
  if (terreno(nx,ny) || esGuardian(nx,ny)){
    if (now-ultimoChoque > 300){ ultimoChoque = now; C.sfx.bump();
      if (lv.grid[ny] && lv.grid[ny][nx]==="L") C.hooks.onPuertaSellada && C.hooks.onPuertaSellada();
    }
    return;
  }
  C.fx.polvo(p.x, p.y);
  p.sx=p.x; p.sy=p.y; p.x=nx; p.y=ny; p.t0=now; p.moving=true; p.anim++;
};

C.junto = (obj) => { const p = C.nivel.player; return obj && Math.abs(p.x-obj.x)+Math.abs(p.y-obj.y) === 1; };
C.terminalCerca = () => C.nivel.terminales.find(t => C.junto(t));

/* ---------------- Enemigos (IA) ---------------- */
C.actualizarEnemigos = function(now, activos){
  const lv = C.nivel, d = lv.m.dificultad, p = lv.player, vel = d.velocidad_ms;
  for (const e of lv.enemigos){
    if (!e.vivo) continue;
    if (e.moving){
      const k = Math.min(1,(now-e.t0)/(vel*0.55));
      e.fx = e.sx+(e.x-e.sx)*k; e.fy = e.sy+(e.y-e.sy)*k;
      if (k>=1){ e.moving=false; e.fx=e.x; e.fy=e.y; }
      continue;
    }
    if (!activos || now < e.next || now < e.stun) continue;
    e.next = now + vel*(0.7+Math.random()*0.8);
    const dist = Math.abs(p.x-e.x)+Math.abs(p.y-e.y);
    let opciones = Object.entries(DIRS);
    if (d.persigue && dist <= d.radio){
      opciones.sort((a,b)=>{
        const da = Math.abs(p.x-(e.x+a[1][0]))+Math.abs(p.y-(e.y+a[1][1]));
        const db = Math.abs(p.x-(e.x+b[1][0]))+Math.abs(p.y-(e.y+b[1][1]));
        return da-db || Math.random()-.5;
      });
      if (!(e.alerta > now)) C.fx.texto(e.x, e.y, "!", "#ff4d6d");
      e.alerta = now + 900;
    } else {
      if (Math.random() < 0.35) continue;
      opciones.sort(()=>Math.random()-.5);
    }
    for (const [dir,[dx,dy]] of opciones){
      const nx=e.x+dx, ny=e.y+dy;
      if (nx===p.x && ny===p.y){
        if (now > lv.invulnerable && !p.moving){ e.dir=dir; C.hooks.onEnemigo && C.hooks.onEnemigo(e); }
        break;
      }
      if (terreno(nx,ny) || esGuardian(nx,ny) || enemigoEn(nx,ny) || lv.grid[ny][nx]==="L") continue;
      if (lv.enemigos.some(o=>o.vivo && o!==e && o.moving && o.x===nx && o.y===ny)) continue;
      e.dir=dir; e.sx=e.x; e.sy=e.y; e.x=nx; e.y=ny; e.t0=now; e.moving=true;
      break;
    }
  }
};

/* ---------------- Dibujo de personajes ---------------- */
// Persona: usa su hoja de sprites; si no cargó, dibujo básico de respaldo.
C.dibujarPersona = function(ctx, px, py, dir, color, step, esJugador, bob, spriteId, escala=2){
  const img = C.sprite(spriteId || (esJugador ? "agente" : null));
  ctx.fillStyle="rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(px+8*escala,py+15*escala,5*escala,1.5*escala,0,0,7); ctx.fill();
  if (img){
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, (step%4)*16, FILA_DIR[dir]*16, 16, 16, px, py+bob, 16*escala, 16*escala);
    return;
  }
  const s=escala, o=(x,y,w,h,c)=>{ ctx.fillStyle=c; ctx.fillRect(px+x*s, py+y*s+bob, w*s, h*s); };
  const hood = esJugador ? "#111" : color;
  o(5,13,2,3,"#1f2937"); o(9,13,2,3,"#1f2937"); o(4,8,8,6,hood); o(4,2,8,7, esJugador ? "#111" : "#3b2412");
  if (dir!=="up"){ o(5,4,6,4,"#e0a27a"); o(6,5,1,1, esJugador?"#39ff7a":"#111"); o(9,5,1,1, esJugador?"#39ff7a":"#111"); }
};
C.dibujarEnemigo = function(ctx, px, py, color, t, escala=1, alerta=false, spriteId){
  const img = C.sprite(spriteId), s = 2*escala;
  ctx.fillStyle="rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(px+8*s,py+15*s,4.5*s,1.5*s,0,0,7); ctx.fill();
  if (img){
    ctx.imageSmoothingEnabled = false;
    const f = Math.floor(t/160)%4;
    if (alerta){ ctx.save(); ctx.shadowColor = "#ff2b4a"; ctx.shadowBlur = 10; }
    ctx.drawImage(img, f*16, 0, 16, 16, px, py, 16*s, 16*s);
    if (alerta) ctx.restore();
    return;
  }
  const o=(x,y,w,h,c)=>{ ctx.fillStyle=c; ctx.fillRect(px+x*s, py+y*s, w*s, h*s); };
  o(3,4,10,9,color); o(4,7,3,3,"#fff"); o(9,7,3,3,"#fff"); o(5,8,2,2,alerta?"#ff2b4a":"#111"); o(10,8,2,2,alerta?"#ff2b4a":"#111");
};

/* ---------------- Tiles animados (equipos de sistemas) ---------------- */
let cv, cx;
C.initCanvas = function(canvas){
  cv = canvas; cv.width = C.VIEW_W*T; cv.height = C.VIEW_H*T;
  document.querySelector(".stage").style.aspectRatio = cv.width+"/"+cv.height;
  cx = cv.getContext("2d"); cx.imageSmoothingEnabled = false;
};
const hsh = (x,y) => ((x*73856093) ^ (y*19349663)) >>> 0;
const R = (x,y,w,h,c) => { cx.fillStyle=c; cx.fillRect(x,y,w,h); };
function luz(x,y,color,r=6,a=.35){
  const g = cx.createRadialGradient(x,y,0,x,y,r); g.addColorStop(0, color.replace(")", ","+a+")").replace("rgb","rgba")); g.addColorStop(1,"rgba(0,0,0,0)");
  cx.fillStyle = g; cx.fillRect(x-r,y-r,r*2,r*2);
}

function piso(x,y,sx,sy){
  const col = C.nivel.m.colores;
  R(sx,sy,T,T, ((x+y)&1) ? col.piso_a : col.piso_b);
  cx.fillStyle="rgba(57,255,122,.05)"; cx.fillRect(sx,sy,T,1); cx.fillRect(sx,sy,1,T);
  if (hsh(x,y)%11===0){ cx.fillStyle="rgba(255,255,255,.04)"; cx.fillRect(sx+6,sy+6,4,4); }
}

function tile(x,y,sx,sy,now){
  const lv = C.nivel, ch = lv.grid[y][x], h = hsh(x,y);
  if (ch==="#"){
    R(sx,sy,T,T,"#0b1510"); R(sx+2,sy+2,T-4,T-10,"#14261b"); R(sx+2,sy+2,T-4,3,"#1f3a29");
    if (h%5===0){ R(sx+6,sy+12,8,2,"rgba(57,255,122,.2)"); }
    if (h%9===0){ const on = (Math.floor(now/600)+h)%4!==0; R(sx+22,sy+8,3,3, on ? "#39ff7a" : "#0e3d22"); }
    return;
  }
  piso(x,y,sx,sy);
  switch (ch){
    case ".": case "X": return;
    case "k": { // cableado con pulso de datos
      const cols = ["#2563eb","#f59e0b","#10b981"];
      cols.forEach((c,i)=>{ R(sx, sy+10+i*5, T, 2, c); });
      const p = ((now/12 + h) % (T*3)) | 0;
      if (p < T){ R(sx+p, sy+9+((h>>3)%3)*5, 4, 4, "#e0fff0"); }
      return;
    }
    case "g": { // rejilla de ventilación
      R(sx+4,sy+4,T-8,T-8,"#0d1a14");
      for (let i=0;i<5;i++) R(sx+6,sy+7+i*4,T-12,2,"#203a2c");
      const a = (Math.sin(now/300+x)+1)/2; R(sx+6,sy+6,T-12,T-12,`rgba(120,220,255,${0.04+a*0.05})`);
      return;
    }
    case "L":
      if (lv.abierta){ R(sx,sy,T,T,"rgba(57,255,122,"+(0.2+0.1*Math.sin(now/300))+")"); }
      else {
        R(sx,sy,T,T,"#1a0507");
        cx.fillStyle="rgba(255,60,90,"+(0.6+0.4*Math.sin(now/150+x))+")";
        for (let i=4;i<T;i+=7) cx.fillRect(sx,sy+i,T,2);
        R(sx+12,sy+12,8,8,"#ffd166"); R(sx+15,sy+15,2,3,"#1a0507");
      }
      return;
    case "R": { // rack de servidores
      R(sx+3,sy+1,T-6,T-2,"#1b1f24"); R(sx+3,sy+1,T-6,2,"#3a434d");
      for (let i=0;i<5;i++){ R(sx+5,sy+4+i*5,T-10,4,"#2b323a"); R(sx+6,sy+5+i*5,10,1,"#444f5a");
        const on = ((Math.floor(now/(180+(h%5)*40))+i+h)%3)!==0;
        R(sx+T-10,sy+5+i*5,2,2, on?"#39ff7a":"#0e5c2b"); R(sx+T-7,sy+5+i*5,2,2, (i+Math.floor(now/90))%4===0?"#f59e0b":"#3b2a0a"); }
      return;
    }
    case "N": { // switch / router de red
      R(sx+2,sy+3,T-4,T-6,"#111827"); R(sx+2,sy+3,T-4,2,"#374151");
      for (let row=0; row<3; row++) for (let i=0;i<6;i++){
        const px = sx+5+i*4, py = sy+8+row*7;
        R(px,py,3,3,"#0b0f14");
        const blink = ((now/70 + i*13 + row*7 + h) % 9) < 4.5;
        R(px,py-2,2,1, blink ? (row===1?"#22d3ee":"#39ff7a") : "#0f2f22");
      }
      R(sx+4,sy+T-5,T-8,2,"#1e40af");
      return;
    }
    case "M": { // muro de monitores con gráficas
      R(sx,sy+2,T,T-6,"#0a0a0a"); R(sx+2,sy+4,T-4,T-10,"#03151d");
      const tipo = h%3;
      cx.strokeStyle = tipo===0 ? "#22d3ee" : tipo===1 ? "#39ff7a" : "#f59e0b"; cx.lineWidth = 1.5; cx.beginPath();
      for (let i=0;i<=T-6;i+=2){ const v = Math.sin((i+now/60+x*20)/5)*4 + Math.sin((i+now/25)/3)*2;
        if (i===0) cx.moveTo(sx+3+i, sy+14+v); else cx.lineTo(sx+3+i, sy+14+v); }
      cx.stroke();
      if (tipo===2){ for (let i=0;i<4;i++){ const hgt = 3+((now/200+i*3+h)%8); R(sx+5+i*6, sy+T-8-hgt, 4, hgt, "#ef4444"); } }
      R(sx+2,sy+T-6,T-4,2,"#1f2937");
      if (Math.random()<0.002) R(sx+2,sy+4,T-4,T-10,"rgba(255,255,255,.2)");
      return;
    }
    case "C": { // unidad de enfriamiento con ventilador
      R(sx+2,sy+2,T-4,T-4,"#cbd5e1"); R(sx+2,sy+2,T-4,2,"#f1f5f9"); R(sx+4,sy+4,T-8,T-8,"#64748b");
      const ang = now/80, cxp = sx+16, cyp = sy+16;
      cx.strokeStyle="#e2e8f0"; cx.lineWidth=3;
      for (let i=0;i<3;i++){ const a = ang+i*2.09; cx.beginPath(); cx.moveTo(cxp,cyp); cx.lineTo(cxp+Math.cos(a)*9, cyp+Math.sin(a)*9); cx.stroke(); }
      R(cxp-2,cyp-2,4,4,"#0f172a"); luz(cxp, cyp, "rgb(120,200,255)", 14, .12);
      return;
    }
    case "U": { // UPS / baterías
      R(sx+5,sy+3,T-10,T-5,"#1f2937"); R(sx+5,sy+3,T-10,2,"#4b5563");
      const nivel = 0.4 + 0.6*((Math.sin(now/900+h)+1)/2);
      R(sx+9,sy+8,14,16,"#0b0f14"); R(sx+10,sy+9+14*(1-nivel),12,14*nivel,"#22c55e");
      R(sx+13,sy+6,6,2,"#9ca3af"); R(sx+8,sy+T-5,3,2,(Math.floor(now/400)%2)?"#facc15":"#3f3a10");
      return;
    }
    case "H": { // núcleo de datos
      const pulso = (Math.sin(now/250)+1)/2;
      luz(sx+16, sy+16, "rgb(57,255,122)", 30, .25+pulso*.2);
      R(sx+8,sy+4,16,24,"#0b2a1a"); R(sx+10,sy+6,12,20,`rgba(57,255,122,${0.35+pulso*0.4})`);
      for (let i=0;i<4;i++){ const yy = sy+6+((now/40 + i*6) % 20); R(sx+10, yy, 12, 1, "#d1fae5"); }
      R(sx+6,sy+2,20,3,"#334155"); R(sx+6,sy+27,20,3,"#334155");
      return;
    }
    case "I": { // terminal de información
      const t = lv.terminales.find(q=>q.x===x && q.y===y), leida = t && t.leida;
      R(sx+6,sy+2,T-12,T-8,"#1e293b"); R(sx+8,sy+4,T-16,14, leida ? "#052e16" : "#2a1f05");
      cx.fillStyle = leida ? "#39ff7a" : "#ffd166"; cx.font = "bold 12px monospace"; cx.textAlign="center";
      cx.fillText(leida ? "✓" : ((Math.floor(now/400)%2) ? "i" : "!"), sx+16, sy+15); cx.textAlign="left";
      R(sx+10,sy+T-6,T-20,4,"#475569");
      if (!leida) luz(sx+16, sy+10, "rgb(255,209,102)", 18, .25+0.15*Math.sin(now/200));
      return;
    }
    case "D": { // escritorio con PC
      R(sx+1,sy+17,T-2,11,"#5b3b22"); R(sx+1,sy+17,T-2,2,"#7c5434");
      R(sx+6,sy+2,20,15,"#1a1a1a"); R(sx+8,sy+4,16,11,"#04210f");
      for (let i=0;i<4;i++){ const w = 4 + ((h>>i)%9); const off = (Math.floor(now/350)+i)%4; R(sx+9, sy+5+((i+off)%4)*2.5, w, 1, i%2?"#22d3ee":"#39ff7a"); }
      if (Math.floor(now/500)%2) R(sx+9+((h%6)), sy+13, 3, 1, "#e5e7eb");
      R(sx+14,sy+17,4,2,"#333"); R(sx+8,sy+22,10,3,"#2d2d2d");
      luz(sx+16, sy+9, "rgb(57,255,122)", 14, .12);
      return;
    }
    case "P":
      R(sx+10,sy+20,12,10,"#6b3e1f");
      cx.fillStyle="#22c55e"; cx.beginPath(); cx.arc(sx+16,sy+14+Math.sin(now/800+x)*0.6,9,0,7); cx.fill();
      cx.fillStyle="#16a34a"; cx.beginPath(); cx.arc(sx+11,sy+17,6,0,7); cx.arc(sx+21,sy+17,6,0,7); cx.fill();
      return;
    case "K": { // estación de consola (se pisa para abrirla)
      luz(sx+16, sy+15, "rgb(57,255,122)", 22, .28+0.12*Math.sin(now/250));
      R(sx+3,sy+2,T-6,15,"#0a0a0a"); R(sx+5,sy+4,T-10,10,"#02160e");
      cx.fillStyle="#39ff7a"; cx.font="bold 9px monospace";
      cx.fillText(">_"+((Math.floor(now/400)%2)?"\u2588":""), sx+7, sy+12);
      R(sx+13,sy+17,6,2,"#333"); R(sx+6,sy+20,T-12,5,"#1f2937");
      for (let i=0;i<6;i++) R(sx+8+i*3,sy+21,2,2, ((Math.floor(now/180)+i)%4===0)?"#39ff7a":"#374151");
      cx.fillStyle="#ffd166"; cx.font="bold 9px monospace"; cx.textAlign="center";
      cx.fillText("CONSOLA", sx+16, sy-3+Math.sin(now/300)*2); cx.textAlign="left";
      return;
    }
    case "T":
      R(sx+4,sy+2,T-8,T-6,"#0d0d0d"); R(sx+6,sy+4,T-12,14,"#012");
      cx.fillStyle="#39ff7a"; cx.font="8px monospace"; cx.fillText(">_"+((Math.floor(now/400)%2)?"█":""), sx+8, sy+14);
      R(sx+6,sy+21,T-12,5,"#333");
      return;
  }
}

/* ---------------- Poderes ---------------- */
const ITEMS = { "1":"#60a5fa", "2":"#facc15", "3":"#f87171", "4":"#fde047" };
C.dibujarPoder = function(ctx, sx, sy, tipo, now){
  const o=(x,y,w,h,c)=>{ ctx.fillStyle=c; ctx.fillRect(sx+x*2, sy+y*2, w*2, h*2); };
  ctx.fillStyle = ITEMS[tipo]+"33"; ctx.beginPath(); ctx.arc(sx+16, sy+16, 13+Math.sin(now/200)*1.5, 0, 7); ctx.fill();
  if (tipo==="1"){ o(4,3,8,2,"#93c5fd"); o(4,5,8,5,"#3b82f6"); o(5,10,6,2,"#3b82f6"); o(6,12,4,1,"#3b82f6"); o(7,13,2,1,"#3b82f6"); o(7,5,2,6,"#dbeafe"); }
  else if (tipo==="2"){ o(4,3,6,1,"#facc15"); o(3,4,1,6,"#facc15"); o(10,4,1,6,"#facc15"); o(4,10,6,1,"#facc15"); o(4,4,6,6,"#fef9c3"); o(10,10,2,2,"#a16207"); o(12,12,2,2,"#a16207"); }
  else if (tipo==="3"){ o(3,4,10,8,"#fff"); o(7,5,2,6,"#ef4444"); o(5,7,6,2,"#ef4444"); }
  else { o(8,2,3,2,"#fde047"); o(7,4,3,2,"#fde047"); o(5,6,6,2,"#facc15"); o(7,8,3,2,"#fde047"); o(6,10,3,2,"#fde047"); o(5,12,2,2,"#fde047"); }
  if (Math.floor(now/120+sx)%14===0){ ctx.fillStyle="#fff"; ctx.fillRect(sx+24, sy+4, 2, 2); }
};

/* ---------------- Ambiente: bits flotantes ---------------- */
const bits = Array.from({length:26}, () => ({ x:Math.random(), y:Math.random(), v:0.0006+Math.random()*0.001, c:Math.random()<.5?"0":"1" }));

/* ---------------- Render ---------------- */
C.render = function(now){
  const lv = C.nivel, p = lv.player;
  const vw = C.VIEW_W*T, vh = C.VIEW_H*T, mw = lv.W*T, mh = lv.H*T;
  let tx = p.fx*T - vw/2 + T/2, ty = p.fy*T - vh/2 + T/2;
  tx = mw <= vw ? (mw-vw)/2 : Math.max(0, Math.min(mw-vw, tx));
  ty = mh <= vh ? (mh-vh)/2 : Math.max(0, Math.min(mh-vh, ty));
  if (!lv.cam) lv.cam = { x:tx, y:ty };
  lv.cam.x += (tx-lv.cam.x)*0.18; lv.cam.y += (ty-lv.cam.y)*0.18;
  let camx = lv.cam.x, camy = lv.cam.y;
  if (now < temblorHasta){ const f = temblorFuerza*((temblorHasta-now)/300); camx += (Math.random()-.5)*f; camy += (Math.random()-.5)*f; }
  camx = Math.round(camx); camy = Math.round(camy);

  cx.fillStyle="#000"; cx.fillRect(0,0,cv.width,cv.height);
  const x0 = Math.max(0,Math.floor(camx/T)), y0 = Math.max(0,Math.floor(camy/T));
  for (let y=y0; y<=y0+C.VIEW_H+1 && y<lv.H; y++)
    for (let x=x0; x<=x0+C.VIEW_W+1 && x<lv.W; x++)
      tile(x,y, x*T-camx, y*T-camy, now);

  // portal
  if (lv.portal){
    const sx = lv.portal.x*T-camx+16, sy = lv.portal.y*T-camy+16;
    if (lv.finalOk){ luz(sx, sy, "rgb(57,255,122)", 34, .35);
      if (Math.random()<0.5){ const a = Math.random()*7; P.push({ x:lv.portal.x*T+16+Math.cos(a)*20, y:lv.portal.y*T+16+Math.sin(a)*20, vx:-Math.cos(a)*0.6, vy:-Math.sin(a)*0.6, g:0, vida:0, max:30, color:"#39ff7a", tam:2 }); } }
    for (let i=0;i<3;i++){
      cx.strokeStyle = lv.finalOk ? `rgba(57,255,122,${0.9-i*0.25})` : `rgba(120,120,140,${0.6-i*0.15})`;
      cx.lineWidth = 3; cx.beginPath();
      const v = lv.finalOk ? 200 : 900;
      cx.arc(sx, sy, 6+i*4 + (lv.finalOk ? Math.sin(now/200+i)*2 : 0), now/v+i, now/v+i+4.2);
      cx.stroke();
    }
  }
  // poderes
  for (const it of lv.items){
    C.dibujarPoder(cx, Math.round(it.x*T-camx), Math.round(it.y*T-camy + Math.sin(now/250+it.x)*2), it.tipo, now);
  }
  // guardián
  const g = lv.guardian;
  if (g){
    const sx = g.x*T-camx, sy = g.y*T-camy;
    const mira = C.junto(g) ? dirHacia(g, p) : "down";
    if (lv.abierta && !lv.finalOk) luz(sx+16, sy+16, "rgb(255,209,102)", 26, .18+0.08*Math.sin(now/250));
    C.dibujarPersona(cx, sx, sy, mira, g.color, 0, false, Math.round(Math.sin(now/400)), g.sprite);
    etiqueta(g.nombre, sx+16, sy-6, "#ffd166");
    const bb = Math.sin(now/200)*3;
    cx.font="bold 20px monospace"; cx.textAlign="center"; cx.fillStyle = lv.finalOk ? "#39ff7a" : (lv.abierta ? "#ffd166" : "#ff4d6d");
    cx.fillText(lv.finalOk ? "✓" : (lv.abierta ? "!" : "×"), sx+16, sy-18+bb); cx.textAlign="left";
  }
  // enemigos
  for (const e of lv.enemigos){
    if (!e.vivo) continue;
    const sx = e.fx*T-camx, sy = e.fy*T-camy + Math.sin(now/260+e.id)*1.5;
    if (sx<-T||sy<-T||sx>cv.width||sy>cv.height) continue;
    if (now < e.stun) cx.globalAlpha = 0.45 + 0.2*Math.sin(now/60);
    C.dibujarEnemigo(cx, sx, sy, e.info.color, now+e.id*90, 1, now < (e.alerta||0), e.info.sprite);
    cx.globalAlpha = 1;
    let pips = ""; for (let i=0;i<e.vidaMax;i++) pips += i<e.vida ? "♥" : "♡";
    cx.font="bold 10px monospace"; cx.textAlign="center"; cx.fillStyle="#ff4d6d"; cx.fillText(pips, sx+16, sy-2); cx.textAlign="left";
    if (Math.abs(e.x-p.x)+Math.abs(e.y-p.y) <= 3) etiqueta(e.info.nombre, sx+16, sy-12, "#ffb4c0");
  }
  // jugador
  const blink = now < lv.invulnerable && Math.floor(now/100)%2===0;
  const px = Math.round(p.fx*T-camx), py = Math.round(p.fy*T-camy);
  const cuadro = p.moving ? Math.floor(now/90)%4 : 0;
  const resp = p.moving ? 0 : (Math.sin(now/500) > 0.6 ? -1 : 0);
  if (lv.portalAnim){ // absorción por el portal
    const k = Math.min(1,(now-lv.portalAnim)/700);
    cx.save(); cx.translate(px+16, py+16); cx.rotate(k*12); cx.scale(1-k, 1-k); cx.globalAlpha = 1-k*0.6;
    C.dibujarPersona(cx, -16, -16, p.dir, null, 0, true, 0, "agente"); cx.restore();
  } else if (!blink) {
    luz(px+16, py+14, "rgb(57,255,122)", 22, .22);
    cx.save(); cx.shadowColor = "rgba(57,255,122,.9)"; cx.shadowBlur = 6;
    C.dibujarPersona(cx, px, py, p.dir, null, cuadro, true, resp, "agente");
    cx.restore();
  }
  if (lv.escudo){ cx.strokeStyle=`rgba(96,165,250,${0.6+0.3*Math.sin(now/150)})`; cx.lineWidth=2; cx.beginPath(); cx.arc(px+16, py+16, 18, 0, 7); cx.stroke(); }
  if (now < lv.turboHasta){ R(px+4, py+30, 24, 2, `rgba(253,224,71,${0.4+0.4*Math.sin(now/60)})`); }

  // partículas
  for (let i=P.length-1;i>=0;i--){
    const q = P[i]; q.vida++;
    if (q.vida > q.max){ P.splice(i,1); continue; }
    q.x += q.vx; q.y += q.vy; q.vy += q.g;
    const a = 1 - q.vida/q.max, sx = q.x-camx, sy = q.y-camy;
    if (q.txt){ cx.globalAlpha = Math.min(1, a*1.6); cx.font="bold 13px monospace"; cx.textAlign="center";
      cx.fillStyle="#000"; cx.fillText(q.txt, sx+1, sy+1); cx.fillStyle=q.color; cx.fillText(q.txt, sx, sy); cx.textAlign="left"; }
    else if (q.anillo){ cx.globalAlpha = a; cx.strokeStyle = q.color; cx.lineWidth = 2; cx.beginPath(); cx.arc(sx, sy, q.r0 + q.vida*1.6, 0, 7); cx.stroke(); }
    else { cx.globalAlpha = a; cx.fillStyle = q.color; cx.fillRect(sx-q.tam/2, sy-q.tam/2, q.tam, q.tam); }
  }
  cx.globalAlpha = 1;

  // bits flotantes + viñeta + líneas CRT
  cx.font = "10px monospace"; cx.fillStyle = "rgba(57,255,122,.18)";
  for (const b of bits){ b.y -= b.v; if (b.y < 0){ b.y = 1; b.x = Math.random(); } cx.fillText(b.c, b.x*cv.width, b.y*cv.height); }
  const vg = cx.createRadialGradient(cv.width/2, cv.height/2, cv.height*0.35, cv.width/2, cv.height/2, cv.width*0.7);
  vg.addColorStop(0,"rgba(0,0,0,0)"); vg.addColorStop(1, lv.hp < 30 ? `rgba(120,0,20,${0.45+0.15*Math.sin(now/200)})` : "rgba(0,0,0,.55)");
  cx.fillStyle = vg; cx.fillRect(0,0,cv.width,cv.height);
  cx.fillStyle="rgba(0,0,0,.08)"; for (let y=0;y<cv.height;y+=3) cx.fillRect(0,y,cv.width,1);
};

function dirHacia(a,b){ const dx=b.x-a.x, dy=b.y-a.y; return Math.abs(dx)>Math.abs(dy) ? (dx>0?"right":"left") : (dy>0?"down":"up"); }
function etiqueta(texto, x, y, color){
  cx.font="bold 10px monospace"; cx.textAlign="center";
  const w = cx.measureText(texto).width+8;
  cx.fillStyle="rgba(0,0,0,.7)"; cx.fillRect(x-w/2, y-9, w, 12);
  cx.fillStyle=color; cx.fillText(texto, x, y); cx.textAlign="left";
}
})();
