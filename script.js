/* ======================================================================
   SENDERO DE LA MATERIA — Lectura → Videos → Mapas Conceptuales → Examen
   4 estaciones fijas (el orden pedagógico no cambia), pero el progreso
   (qué está completado / cuál es la actual / qué sigue bloqueado) es
   configurable por materia con setProgress().
   ====================================================================== */

const SVG_NS = 'http://www.w3.org/2000/svg';

/* ----------------------------------------------------------------------
   1) ESTACIONES (posiciones fijas sobre el libro abierto, viewBox 900x540)
   ---------------------------------------------------------------------- */
const stations = [
  { key:'lectura', label:'Lectura',               cx:150, cy:430, route:'/lectura' },
  { key:'videos',  label:'Videos',                cx:350, cy:200, route:'/videos' },
  { key:'mapas',   label:'Mapas Conceptuales',     cx:560, cy:400, route:'/mapas-conceptuales' },
  { key:'examen',  label:'Examen (30 preguntas)',  cx:760, cy:150, route:'/examen' },
];

// Curva que pasa por las 4 estaciones, partida en 3 tramos (uno entre
// cada par de estaciones consecutivas) para poder pintar cada tramo
// como "recorrido" o "pendiente" por separado.
const segments = [
  `M${stations[0].cx},${stations[0].cy} C220,350 260,260 ${stations[1].cx},${stations[1].cy}`,
  `M${stations[1].cx},${stations[1].cy} C430,150 480,300 ${stations[2].cx},${stations[2].cy}`,
  `M${stations[2].cx},${stations[2].cy} C620,470 680,220 ${stations[3].cx},${stations[3].cy}`,
];

let currentProgressIndex = 1; // demo: Lectura completada, Videos es la actual

/* ----------------------------------------------------------------------
   2) HELPERS SVG
   ---------------------------------------------------------------------- */
function svgEl(tag, attrs = {}){
  const el = document.createElementNS(SVG_NS, tag);
  for(const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}
function pillWidthFor(label, fontSize=17, padding=56, avgCharW=0.56){
  return Math.max(150, label.length * fontSize * avgCharW + padding);
}
function stateFor(index, progressIndex){
  if(index < progressIndex) return 'completed';
  if(index === progressIndex) return 'current';
  return 'locked';
}

/* ----------------------------------------------------------------------
   3) DIBUJAR EL SENDERO (tramos + flechas + estaciones)
   ---------------------------------------------------------------------- */
function renderPath(progressIndex){
  currentProgressIndex = progressIndex;

  const trackGroup = document.getElementById('path-track');
  const arrowsGroup = document.getElementById('path-arrows');
  const stationsGroup = document.getElementById('path-stations');
  if(!trackGroup || !arrowsGroup || !stationsGroup) return;

  trackGroup.innerHTML = '';
  arrowsGroup.innerHTML = '';
  stationsGroup.innerHTML = '';

  // --- tramos del camino ---
  segments.forEach((d, i)=>{
    const done = i < progressIndex;
    trackGroup.appendChild(svgEl('path', {
      d, class: done ? 'path-track-line path-track-line--done' : 'path-track-line',
    }));

    // flecha de dirección en el punto medio del tramo (aprox., orientada
    // según la línea recta entre las dos estaciones que conecta)
    const a = stations[i], b = stations[i+1];
    const mx = (a.cx+b.cx)/2, my = (a.cy+b.cy)/2;
    const angle = Math.atan2(b.cy-a.cy, b.cx-a.cx) * 180/Math.PI;
    const arrow = svgEl('polygon', {
      points:'0,-7 12,0 0,7',
      class:'path-arrow',
      transform:`translate(${mx},${my}) rotate(${angle})`,
    });
    arrowsGroup.appendChild(arrow);
  });

  // --- estaciones ---
  stations.forEach((s, i)=>{
    const state = stateFor(i, progressIndex);
    const w = pillWidthFor(`${i+1}. ${s.label}`);
    const h = 46;
    const x = s.cx - w/2, y = s.cy - h/2;

    const g = svgEl('g', { class:`station ${state}`, 'data-step':s.key, tabindex: state==='locked' ? '-1' : '0', role:'button', 'aria-label':s.label });
    const glowFilter = state === 'current' ? 'url(#glow)' : 'url(#softShadow)';
    g.appendChild(svgEl('rect', {
      class:'station-pill station-pill-bg', x, y, width:w, height:h, rx:h/2, ry:h/2, filter:glowFilter,
    }));
    const text = svgEl('text', {
      x:s.cx, y:s.cy+6, 'text-anchor':'middle', class:'station-text', 'font-size':17,
    });
    text.textContent = `${i+1}. ${s.label}`;
    g.appendChild(text);

    if(state !== 'locked'){
      g.addEventListener('click', ()=>openStep(s.key));
      g.addEventListener('keydown', (ev)=>{
        if(ev.key==='Enter' || ev.key===' '){ ev.preventDefault(); openStep(s.key); }
      });
    }
    stationsGroup.appendChild(g);
  });
}

/* ----------------------------------------------------------------------
   4) INTERACTIVIDAD
   Hoy: log de ejemplo. Mañana: navegar a la ruta real de cada estación.
   ---------------------------------------------------------------------- */
function openStep(key){
  const step = stations.find(s=>s.key===key);
  if(!step) return;
  console.log(`Abriendo: ${step.label}`);
  // Punto de enganche para el futuro campus real:
  // window.location.href = step.route;
}

// Cambiar el avance (0 = recién empieza Lectura, 3 = ya está en el examen,
// 4 = las 4 estaciones completadas).
function setProgress(index){
  renderPath(Math.max(0, Math.min(stations.length, index)));
}

document.addEventListener('DOMContentLoaded', ()=>renderPath(currentProgressIndex));
