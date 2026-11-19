/* =========================================================
   CyberAgent Academy — Comunicación con el servidor Flask
   Creado por Andrés Felipe Beltrán Barrera
   Si existe window.CAA_OFFLINE (versión de un solo archivo),
   todo se resuelve en el navegador.
   ========================================================= */
(() => {
  const C = window.CAA = window.CAA || {};
  const OFF = window.CAA_OFFLINE || null;

  const contarE = m => m.mapa.reduce((a,r)=>a+(r.match(/E/g)||[]).length, 0);
  const contarI = m => m.mapa.reduce((a,r)=>a+(r.match(/I/g)||[]).length, 0);
  const xpMax = m => contarE(m)*m.dificultad.vida_enemigo*m.xp.por_golpe + m.xp.final + contarI(m)*(m.xp.terminal||0);
  const resumen = m => ({ id:m.id, orden:m.orden, titulo:m.titulo, sector:m.sector, tema:m.tema,
    icono:m.icono||"🛡️", estrellas:m.dificultad.estrellas, enemigos:contarE(m), xp_max:xpMax(m) });
  function publica(m){
    const p = JSON.parse(JSON.stringify(m));
    p.retos.forEach(r=>{ delete r.correcta; delete r.explicacion; });
    ["correcta","explicacion","defensa"].forEach(k=>delete p.final[k]);
    delete p.flag; return p;
  }
  const buscar = id => OFF.misiones.find(m=>m.id===id);
  const reto = (m,id) => id==="final" ? m.final : m.retos.find(r=>r.id===id);

  async function get(url){
    const r = await fetch(url); if (!r.ok) throw new Error("HTTP "+r.status+" en "+url); return r.json();
  }
  async function post(url, body){
    const r = await fetch(url, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
    if (!r.ok) throw new Error("HTTP "+r.status+" en "+url); return r.json();
  }

  C.API = {
    offline: !!OFF,
    misiones: async () => OFF ? OFF.misiones.map(resumen).sort((a,b)=>a.orden-b.orden) : get("/api/misiones"),
    mision:   async id => OFF ? publica(buscar(id)) : get("/api/mision/"+encodeURIComponent(id)),
    responder: async p => {
      if (!OFF) return post("/api/responder", p);
      const m = buscar(p.mision), r = reto(m, p.reto), ok = p.opcion === r.correcta;
      const out = { correcta: ok, explicacion: r.explicacion || "" };
      if (ok && p.reto === "final"){ out.defensa = m.final.defensa; out.flag = m.flag; }
      return out;
    },
    descartar: async p => {
      if (!OFF) return post("/api/descartar", p);
      const r = reto(buscar(p.mision), p.reto);
      const malas = r.opciones.map((_,i)=>i).filter(i=>i!==r.correcta && !(p.excluidas||[]).includes(i));
      return { descartar: malas.length ? malas[Math.floor(Math.random()*malas.length)] : null };
    }
  };
})();
