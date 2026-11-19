/* Fondo Matrix — CyberAgent Academy · Andrés Felipe Beltrán Barrera */
(() => {
  const mx = document.getElementById("matrix"); if (!mx) return;
  const mc = mx.getContext("2d"); let drops = [], last = 0;
  function size(){ mx.width = innerWidth; mx.height = innerHeight; drops = Array(Math.ceil(mx.width/16)).fill(0).map(()=>Math.random()*mx.height/16); }
  size(); addEventListener("resize", size);
  function frame(now){
    if (now - last > 60){ last = now;
      mc.fillStyle = "rgba(3,8,6,.12)"; mc.fillRect(0,0,mx.width,mx.height);
      mc.fillStyle = "#39ff7a"; mc.font = "14px monospace";
      drops.forEach((d,i)=>{ mc.fillText(Math.random()<.5?"0":"1", i*16, d*16); drops[i] = d*16>mx.height && Math.random()>.97 ? 0 : d+1; });
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
