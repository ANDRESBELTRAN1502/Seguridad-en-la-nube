/* =========================================================
   CyberAgent Academy — Música chiptune original
   Compuesta y programada para el juego de Andrés Felipe Beltrán Barrera.
   Se sintetiza en vivo con Web Audio (no usa archivos).

   ¿Quieres tu propia música? Pon archivos MP3 en static/musica/ con estos
   nombres y el juego los usará en lugar de la chiptune:
     titulo.mp3 · exploracion.mp3 · combate.mp3 · jefe.mp3 · victoria.mp3 · derrota.mp3
   (usa solo música propia o con licencia libre)
   ========================================================= */
(() => {
"use strict";
const C = window.CAA = window.CAA || {};

/* ---------- notas ---------- */
const SEMI = { C:0, "C#":1, Db:1, D:2, "D#":3, Eb:3, E:4, F:5, "F#":6, Gb:6, G:7, "G#":8, Ab:8, A:9, "A#":10, Bb:10, B:11 };
function freq(nota, trans){
  const m = /^([A-G](?:#|b)?)(\d)$/.exec(nota); if (!m) return 0;
  const midi = 12*(+m[2]+1) + SEMI[m[1]] + (trans||0);
  return 440 * Math.pow(2, (midi-69)/12);
}
/* "A4 - C5 ." → eventos {paso, nota, largo} ('-' sostiene, '.' silencio) */
function parsear(txt){
  const t = txt.trim().split(/\s+/), ev = [];
  t.forEach((tok,i)=>{
    if (tok==="-" ){ if (ev.length && ev[ev.length-1].fin===i) { ev[ev.length-1].largo++; ev[ev.length-1].fin++; } return; }
    if (tok==="." ) return;
    ev.push({ paso:i, nota:tok, largo:1, fin:i+1 });
  });
  return { ev, pasos:t.length };
}
const rep = (s,n) => Array(n).fill(s).join(" ");

/* ---------- pistas (16 pasos por compás) ---------- */
const PISTAS = {
  titulo: { bpm: 96, loop: true,
    lead: `E5 - - - G5 - - - C6 - - - B5 - G5 -  D5 - - - G5 - - - B5 - - - A5 - G5 -
           C5 - - - E5 - - - A5 - - - G5 - E5 -  F5 - - - A5 - G5 - F5 - E5 - D5 - - -
           E5 - - - G5 - - - C6 - - - D6 - E6 -  D6 - - - B5 - - - G5 - - - A5 - B5 -
           C6 - - - B5 - A5 - G5 - - - E5 - - -  F5 - - - G5 - - - C6 - - - - - - -`,
    arp:  `${rep("C4 G4 C5 E5",4)} ${rep("G3 D4 G4 B4",4)} ${rep("A3 E4 A4 C5",4)} ${rep("F3 C4 F4 A4",4)}
           ${rep("C4 G4 C5 E5",4)} ${rep("G3 D4 G4 B4",4)} ${rep("A3 E4 A4 C5",4)} ${rep("F3 C4 F4 A4",2)} ${rep("G3 D4 G4 B4",2)}`,
    bass: `C2 - - - C3 - - - C2 - - - C3 - - -  G1 - - - G2 - - - G1 - - - G2 - - -
           A1 - - - A2 - - - A1 - - - A2 - - -  F1 - - - F2 - - - F1 - - - F2 - - -
           C2 - - - C3 - - - C2 - - - C3 - - -  G1 - - - G2 - - - G1 - - - G2 - - -
           A1 - - - A2 - - - A1 - - - A2 - - -  F1 - - - F2 - - - G1 - - - G2 - - -`,
    kick: "x . . . . . . . x . . . . . . .", snare: ". . . . x . . . . . . . x . . .", hat: "x . x . x . x . x . x . x . x ." },

  exploracion: { bpm: 132, loop: true, rock: true,
    lead: `E4 - E5 - E4 - G4 - E4 - E5 - D5 - B4 -  E4 - E5 - E4 - G4 - A4 - B4 - D5 - - -
           C4 - C5 - C4 - E4 - G4 - E4 - C5 - - -  D4 - D5 - D4 - F#4 - A4 - D5 - A4 - - -
           E4 - E5 - E4 - G4 - E4 - E5 - D5 - B4 -  G4 - B4 - D5 - B4 - E5 - D5 - B4 - G4 -
           A4 - A5 - A4 - C5 - E5 - C5 - A4 - - -  B4 - D5 - F#5 - D5 - B4 - - - - - - -`,
    arp:  `${rep("E3 B3 E4 B3",4)} ${rep("C3 G3 C4 G3",4)} ${rep("D3 A3 D4 A3",4)} ${rep("E3 B3 E4 B3",2)} ${rep("G3 D4 G4 D4",2)}`,
    bass: `${rep("E2 E2 E2 G2 E2 E2 D2 E2",2)} ${rep("C2 C2 C2 E2 C2 C2 G1 C2",2)} ${rep("D2 D2 D2 F#2 D2 D2 A1 D2",2)} ${rep("E2 E2 E2 G2 A2 A2 B1 B1",2)}`,
    kick: "x . . . x . x . x . . . x . x .", snare: ". . . . x . . . . . . . x . . .", hat: "x . x . x . x . x . x . x . x ." },

  combate: { bpm: 150, loop: true,
    lead: `E5 - - B4 E5 - G5 - F#5 - E5 - D5 - B4 -  C5 - - - E5 - G5 - - - E5 - G5 - C6 -
           A5 - - - F#5 - D5 - A5 - - - B5 - A5 -  F#5 - - - D#5 - B4 - F#5 - - - - - - -
           B5 - A5 - G5 - E5 - G5 - A5 - B5 - - -  C6 - B5 - A5 - G5 - E5 - G5 - C6 - - -
           D6 - C6 - A5 - F#5 - A5 - - - D6 - - -  D#6 - - - B5 - - - F#5 - - - D#5 - - -`,
    arp:  `${rep("E5 G5 B5 G5",4)} ${rep("C5 E5 G5 E5",4)} ${rep("D5 F#5 A5 F#5",4)} ${rep("B4 D#5 F#5 D#5",4)}
           ${rep("E5 G5 B5 G5",4)} ${rep("C5 E5 G5 E5",4)} ${rep("D5 F#5 A5 F#5",4)} ${rep("B4 D#5 F#5 D#5",4)}`,
    bass: `${rep("E2 E3",8)} ${rep("C2 C3",8)} ${rep("D2 D3",8)} ${rep("B1 B2",8)} ${rep("E2 E3",8)} ${rep("C2 C3",8)} ${rep("D2 D3",8)} ${rep("B1 B2",8)}`,
    kick: "x . . . x . . . x . . . x . x .", snare: ". . . . x . . . . . . . x . . x", hat: "x x x x x x x x x x x x x x x x" },

  jefe: { bpm: 160, loop: true,
    lead: `D6 - - - C6 - A5 - - - F5 - A5 - D6 -  D6 - - - F6 - - - D6 - C6 - Bb5 - - -
           G5 - - - Bb5 - D6 - - - Bb5 - G5 - A5 -  A5 - - - C#6 - E6 - - - - - C#6 - - -
           F6 - E6 - D6 - A5 - D6 - E6 - F6 - - -  F6 - - - D6 - Bb5 - F5 - Bb5 - D6 - - -
           G6 - F6 - E6 - D6 - Bb5 - G5 - Bb5 - D6 -  E6 - - - C#6 - - - A5 - - - E5 - - -`,
    arp:  `${rep("D5 F5 A5 F5",4)} ${rep("Bb4 D5 F5 D5",4)} ${rep("G4 Bb4 D5 Bb4",4)} ${rep("A4 C#5 E5 C#5",4)}
           ${rep("D5 F5 A5 F5",4)} ${rep("Bb4 D5 F5 D5",4)} ${rep("G4 Bb4 D5 Bb4",4)} ${rep("A4 C#5 E5 C#5",4)}`,
    bass: `${rep("D2 D2 D3 D2",4)} ${rep("Bb1 Bb1 Bb2 Bb1",4)} ${rep("G1 G1 G2 G1",4)} ${rep("A1 A1 A2 A1",4)}
           ${rep("D2 D2 D3 D2",4)} ${rep("Bb1 Bb1 Bb2 Bb1",4)} ${rep("G1 G1 G2 G1",4)} ${rep("A1 A1 A2 A1",4)}`,
    kick: "x . x . x . x . x . x . x . x x", snare: ". . . . x . . . . . . . x . x .", hat: "x x x x x x x x x x x x x x x x" },

  victoria: { bpm: 140, loop: false,
    lead: "C5 E5 G5 C6 - - G5 - C6 - - - E6 - - -  D6 - C6 - B5 - C6 - - - - - - - - -",
    arp:  "C4 E4 G4 C5 E4 G4 C5 E5 G4 C5 E5 G5 C5 E5 G5 C6  G4 B4 D5 G5 B4 D5 G5 B5 C5 E5 G5 C6 - - - -",
    bass: "C2 - - - - - - - C3 - - - - - - -  G2 - - - - - - - C2 - - - - - - -",
    kick: "x . . . . . . . x . . . . . . .", snare: ". . . . . . . . . . . . x . . .", hat: "" },

  derrota: { bpm: 84, loop: false,
    lead: "E5 - - - D5 - - - C5 - - - B4 - - -  A4 - - - G#4 - - - A4 - - - - - - -",
    arp:  "",
    bass: "A2 - - - - - - - F2 - - - - - - -  E2 - - - - - - - A1 - - - - - - -",
    kick: "", snare: "", hat: "" }
};
Object.values(PISTAS).forEach(p=>{
  ["lead","arp","bass"].forEach(k=> p["_"+k] = p[k] ? parsear(p[k]) : { ev:[], pasos:0 });
  p.pasos = Math.max(p._lead.pasos, p._arp.pasos, p._bass.pasos, 16);
  ["kick","snare","hat"].forEach(k=> p["_"+k] = p[k] ? p[k].trim().split(/\s+/) : []);
});

/* ---------- motor ---------- */
const M = C.musica = { activa: true, volumen: 0.55, actual: null, archivos: {} };
let ctx, master, ruido, pulso, timer = null, estado = null, audioEl = null;
try { const v = localStorage.getItem("caa_musica"); if (v !== null) M.activa = v === "1"; } catch(e){}

function iniciar(){
  ctx = C.audio();
  if (master) return;
  master = ctx.createGain(); master.gain.value = M.activa ? M.volumen : 0; master.connect(ctx.destination);
  const n = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate), d = n.getChannelData(0);
  for (let i=0;i<d.length;i++) d[i] = Math.random()*2-1;
  ruido = n;
  // onda de pulso al 25 % (sonido clásico de consola)
  const real = new Float32Array(32), imag = new Float32Array(32);
  for (let k=1;k<32;k++) imag[k] = (2/(k*Math.PI))*Math.sin(k*Math.PI*0.25);
  pulso = ctx.createPeriodicWave(real, imag);
}

function nota(t, f, dur, tipo, vol, vibrato){
  if (!f) return;
  const o = ctx.createOscillator(), g = ctx.createGain();
  if (tipo === "pulso") o.setPeriodicWave(pulso); else o.type = tipo;
  o.frequency.setValueAtTime(f, t);
  if (vibrato && dur > 0.25){
    const lfo = ctx.createOscillator(), lg = ctx.createGain();
    lfo.frequency.value = 5.5; lg.gain.value = f*0.012; lfo.connect(lg); lg.connect(o.frequency);
    lfo.start(t+0.12); lfo.stop(t+dur+0.05);
  }
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t+0.008);
  g.gain.exponentialRampToValueAtTime(vol*0.55, t+Math.min(0.15, dur*0.6));
  g.gain.setValueAtTime(vol*0.55, t+dur*0.9);
  g.gain.exponentialRampToValueAtTime(0.0001, t+dur+0.04);
  o.connect(g); g.connect(master); o.start(t); o.stop(t+dur+0.06);
}
function bombo(t){
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(40, t+0.12);
  g.gain.setValueAtTime(0.32, t); g.gain.exponentialRampToValueAtTime(0.0001, t+0.16);
  o.connect(g); g.connect(master); o.start(t); o.stop(t+0.18);
}
function ruidoGolpe(t, dur, filtro, fr, vol){
  const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = ruido; f.type = filtro; f.frequency.value = fr;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t+dur);
  s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random()*0.5); s.stop(t+dur+0.02);
}

function programar(){
  const p = estado.pista, dur = 60/estado.bpm/4;
  while (estado.t < ctx.currentTime + 0.15){
    const paso = estado.paso, t = estado.t, i = paso % p.pasos;
    if (!p.loop && paso >= p.pasos){ detenerSecuencia(); return; }
    const tr = estado.trans, rock = p.rock;
    const tLead = rock ? "sawtooth" : "pulso", tBass = rock ? "sawtooth" : "triangle";
    p._lead.ev.forEach(e=>{ if (e.paso===i) nota(t, freq(e.nota,tr), e.largo*dur, tLead, rock ? 0.09 : 0.075, true); });
    p._arp.ev.forEach(e=>{ if (e.paso===i) nota(t, freq(e.nota,tr), e.largo*dur*0.9, "square", rock ? 0.03 : 0.022); });
    p._bass.ev.forEach(e=>{ if (e.paso===i) nota(t, freq(e.nota,tr), e.largo*dur*0.95, tBass, 0.16); });
    const k = i % 16;
    if (p._kick[k]==="x") bombo(t);
    if (p._snare[k]==="x") ruidoGolpe(t, 0.12, "bandpass", 1800, 0.18);
    if (p._hat[k]==="x") ruidoGolpe(t, 0.03, "highpass", 7000, 0.06);
    estado.paso++; estado.t += dur;
  }
}
function detenerSecuencia(){ if (timer){ clearInterval(timer); timer=null; } estado = null; }

function pararArchivo(){ if (audioEl){ audioEl.pause(); audioEl = null; } }

/* nivel: transpone y acelera la música de exploración según la dificultad */
M.tocar = function(nombre, nivel){
  if (M.actual === nombre && (nombre !== "exploracion" || M.nivel === nivel)) return;
  M.actual = nombre; M.nivel = nivel;
  try { iniciar(); } catch(e){ return; }
  detenerSecuencia(); pararArchivo();
  if (!nombre) return;
  if (M.archivos[nombre]){
    audioEl = new Audio(M.archivos[nombre]); audioEl.loop = PISTAS[nombre] ? PISTAS[nombre].loop : true;
    audioEl.volume = M.activa ? M.volumen : 0; audioEl.play().catch(()=>{});
    return;
  }
  const p = PISTAS[nombre]; if (!p) return;
  let bpm = p.bpm, trans = 0;
  if (nombre === "exploracion" && nivel){ bpm = p.bpm + (nivel-1)*3; trans = [0,2,-2,3,-3,5,1,-1,4,-4][(nivel-1)%10]; }
  estado = { pista:p, bpm, trans, paso:0, t: ctx.currentTime + 0.08 };
  timer = setInterval(()=>{ try { programar(); } catch(e){} }, 25);
  programar();
};
M.parar = () => M.tocar(null);
M.alternar = function(){
  M.activa = !M.activa;
  try { localStorage.setItem("caa_musica", M.activa ? "1" : "0"); } catch(e){}
  if (master) master.gain.setTargetAtTime(M.activa ? M.volumen : 0, ctx.currentTime, 0.1);
  if (audioEl) audioEl.volume = M.activa ? M.volumen : 0;
  return M.activa;
};

/* busca MP3 propios en static/musica (solo con el servidor Flask) */
M.buscarArchivos = async function(){
  if (C.API && C.API.offline) return;
  try {
    const r = await fetch("/api/musica"); if (!r.ok) return;
    const lista = await r.json();
    lista.forEach(a => { M.archivos[a.pista] = a.url; });
  } catch(e){}
};
})();
