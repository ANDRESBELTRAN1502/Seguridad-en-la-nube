/* Efectos de sonido sintetizados (sin archivos) — CyberAgent Academy */
(() => {
  const C = window.CAA = window.CAA || {};
  let ctx = null, sfxGain = null;
  C.sonido = true;
  C.audio = () => {
    if (!ctx){ ctx = new (window.AudioContext||window.webkitAudioContext)(); sfxGain = ctx.createGain(); sfxGain.gain.value = 1; sfxGain.connect(ctx.destination); }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  };
  function beep(freq=440, dur=0.08, type="square", vol=0.05, delay=0){
    if (!C.sonido) return;
    try {
      C.audio();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = freq; o.connect(g); g.connect(sfxGain);
      const t0 = ctx.currentTime + delay;
      g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0+dur);
      o.start(t0); o.stop(t0+dur+0.02);
    } catch(e){}
  }
  C.sfx = {
    beep,
    talk:  () => beep(660,0.03,"square",0.025),
    ok:    () => [523,659,784,1046].forEach((f,i)=>beep(f,0.12,"square",0.05,i*0.08)),
    bad:   () => { beep(180,0.18,"sawtooth",0.05); beep(140,0.2,"sawtooth",0.05,0.12); },
    hit:   () => { beep(110,0.12,"sawtooth",0.07); beep(70,0.15,"square",0.05,0.05); },
    door:  () => [300,450,600,800].forEach((f,i)=>beep(f,0.1,"triangle",0.06,i*0.08)),
    bump:  () => beep(90,0.05,"square",0.03),
    item:  () => [880,1175].forEach((f,i)=>beep(f,0.08,"triangle",0.06,i*0.07)),
    battle:() => [220,0,220,330,440].forEach((f,i)=>f&&beep(f,0.09,"square",0.05,i*0.08)),
    win:   () => [523,659,784,659,784,1046,1318].forEach((f,i)=>beep(f,0.16,"square",0.05,i*0.12)),
    over:  () => [392,330,262,196].forEach((f,i)=>beep(f,0.25,"triangle",0.06,i*0.2)),
    tick:  () => beep(1200,0.02,"square",0.02)
  };
})();
