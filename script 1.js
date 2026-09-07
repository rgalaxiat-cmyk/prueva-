/* ======================================================================
   TARJETA DE MATERIA — sistema de datos reutilizable
   Cambiar una tarjeta = cambiar sus datos acá abajo. loadSubject() se
   encarga de volcar todo al SVG; nunca hay que tocar el SVG a mano.
   ====================================================================== */

/* ----------------------------------------------------------------------
   1) DATOS DE CADA MATERIA
   `color` es el tono base de la tapa; el resto de los degradados
   (lomo, más claro/oscuro) se calculan automáticamente a partir de él
   con shadeColor(), así que alcanza con un solo hex por materia.
   ---------------------------------------------------------------------- */
const subjects = {
  histologia: {
    name: "Histología",
    percentage: 100,
    completed: "5/5",
    completedLabel: "completados",
    statsLine: "2/2 clases · 2/2 material · 1/1",
    statsLabel: "evaluación",
    message: "¡Excelente ritmo, no aflojés!",
    color: "#2E5B41",
    route: "/histologia",
  },
  quimicaBiologica: {
    name: "Química Biológica",
    percentage: 85,
    completed: "4/5",
    completedLabel: "completados",
    statsLine: "2/2 clases · 1/2 material · 1/1",
    statsLabel: "evaluación",
    message: "¡Vas muy bien!",
    color: "#5B4E8A",
    route: "/quimica-biologica",
  },
  fisiologia: {
    name: "Fisiología",
    percentage: 90,
    completed: "5/5",
    completedLabel: "completados",
    statsLine: "2/2 clases · 2/2 material · 1/1",
    statsLabel: "evaluación",
    message: "¡Excelente ritmo!",
    color: "#3A5A8C",
    route: "/fisiologia",
  },
  medicinaSociedad: {
    name: "Medicina y Sociedad",
    percentage: 60,
    completed: "3/5",
    completedLabel: "completados",
    statsLine: "1/2 clases · 1/2 material · 0/1",
    statsLabel: "evaluación",
    message: "Dale que se puede, un poco más",
    color: "#7A2E2E",
    route: "/medicina-y-sociedad",
  },
  biologia: {
    name: "Biología",
    percentage: 40,
    completed: "2/5",
    completedLabel: "completados",
    statsLine: "1/2 clases · 1/2 material · 0/1",
    statsLabel: "evaluación",
    message: "Dale que se puede, un poco más",
    color: "#3D7A4E",
    route: "/biologia",
  },
  anatomia: {
    name: "Anatomía",
    percentage: 20,
    completed: "1/5",
    completedLabel: "completados",
    statsLine: "1/2 clases · 0/2 material · 0/1",
    statsLabel: "evaluación",
    message: "Te está esperando, arrancá hoy",
    color: "#2C3E6B",
    route: "/anatomia",
  },
  fisicaBiologica: {
    name: "Física Biológica",
    percentage: 75,
    completed: "3/4",
    completedLabel: "completados",
    statsLine: "2/2 clases · 1/2 material · 1/1",
    statsLabel: "evaluación",
    message: "Vas por buen camino",
    color: "#2E6B6B",
    route: "/fisica-biologica",
  },
  embriologia: {
    name: "Embriología",
    percentage: 55,
    completed: "3/6",
    completedLabel: "completados",
    statsLine: "2/3 clases · 1/2 material · 0/1",
    statsLabel: "evaluación",
    message: "Dale que se puede, un poco más",
    color: "#4A2E6B",
    route: "/embriologia",
  },
  pediatria: {
    name: "Pediatría",
    percentage: 10,
    completed: "0/5",
    completedLabel: "completados",
    statsLine: "0/2 clases · 0/2 material · 0/1",
    statsLabel: "evaluación",
    message: "Te está esperando, arrancá hoy",
    color: "#2E6B5C",
    route: "/pediatria",
  },
  paidopsiquiatria: {
    name: "Paidopsiquiatría",
    percentage: 0,
    completed: "0/4",
    completedLabel: "completados",
    statsLine: "0/2 clases · 0/1 material · 0/1",
    statsLabel: "evaluación",
    message: "Empieza hoy, no lo dejes",
    color: "#5C1F35",
    route: "/paidopsiquiatria",
  },
};

/* ----------------------------------------------------------------------
   2) HELPERS DE COLOR
   A partir de un solo hex por materia, se derivan las variantes más
   clara/oscura que usan el fondo y el lomo del libro.
   ---------------------------------------------------------------------- */
function hexToRgb(hex){
  const h = hex.replace('#','');
  return {
    r: parseInt(h.substring(0,2),16),
    g: parseInt(h.substring(2,4),16),
    b: parseInt(h.substring(4,6),16),
  };
}
function rgbToHex(r,g,b){
  const c = v => Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0');
  return `#${c(r)}${c(g)}${c(b)}`;
}
// amt > 0 aclara, amt < 0 oscurece (rango sugerido: -60 a 60)
function shadeColor(hex, amt){
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r+amt, g+amt, b+amt);
}

/* ----------------------------------------------------------------------
   3) VOLCAR UNA MATERIA AL SVG
   ---------------------------------------------------------------------- */
let currentSubjectKey = null;

function loadSubject(key){
  const data = subjects[key];
  if(!data){
    console.warn(`No existe la materia "${key}" en subjects.`);
    return;
  }
  currentSubjectKey = key;

  // --- textos ---
  setText('titleText', data.name);
  setText('pctText', `${data.percentage}%`);
  setText('messageText', data.message);
  setText('statValue1', data.completed);
  setText('statLabel1', data.completedLabel);
  setText('statValue2', data.statsLine);
  setText('statLabel2', data.statsLabel);
  setText('buttonText', 'Continuar →');

  // --- barra de progreso (ancho proporcional al %) ---
  const track = document.querySelector('.progress-track');
  const fill = document.getElementById('progressFill');
  if(track && fill){
    const maxWidth = parseFloat(track.getAttribute('width'));
    const pct = Math.max(0, Math.min(100, data.percentage));
    fill.setAttribute('width', (maxWidth * pct / 100).toFixed(1));
  }

  // --- color de la tapa (degradado de fondo + lomo), derivado de un solo hex ---
  applyColor(data.color);

  // --- accesibilidad ---
  const title = document.getElementById('cardTitleA11y');
  if(title) title.textContent = `Materia: ${data.name}, ${data.percentage}% completado`;
}

function setText(id, value){
  const el = document.getElementById(id);
  if(el) el.textContent = value;
}

function applyColor(baseHex){
  const light = shadeColor(baseHex, 40);
  const dark = shadeColor(baseHex, -55);

  setStop('bgStop0', light);
  setStop('bgStop1', baseHex);
  setStop('bgStop2', dark);

  setStop('spineStop0', shadeColor(baseHex, -35));
  setStop('spineStop1', shadeColor(baseHex, 30));
  setStop('spineStop2', shadeColor(baseHex, -15));
}
function setStop(id, color){
  const el = document.getElementById(id);
  if(el) el.setAttribute('stop-color', color);
}

/* ----------------------------------------------------------------------
   4) INTERACTIVIDAD DEL BOTÓN
   Hoy: log/alerta de ejemplo. Mañana: navegar a data.route del campus real.
   ---------------------------------------------------------------------- */
function openSubject(){
  const data = subjects[currentSubjectKey];
  if(!data) return;
  console.log(`Entrando a ${data.name}`);
  // Punto de enganche para el futuro campus real:
  // window.location.href = data.route;
}

function initCard(){
  const btn = document.getElementById('continueBtn');
  if(!btn) return;
  btn.addEventListener('click', openSubject);
  btn.addEventListener('keydown', (ev)=>{
    if(ev.key === 'Enter' || ev.key === ' '){
      ev.preventDefault();
      openSubject();
    }
  });

  loadSubject('histologia');
}

document.addEventListener('DOMContentLoaded', initCard);
