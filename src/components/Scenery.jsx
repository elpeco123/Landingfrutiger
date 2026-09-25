import styles from './Scenery.module.css';
import { Disc, FilmStrip, Monitor, Mp3Player, PartsDefs, Water } from './SceneryParts.jsx';

// Fondo Frutiger Aero dibujado en SVG (sin imágenes). Está partido en dos capas:
//  1. Estática: cielo, sol, nubes, globo, lomas, ciudad, lago, árboles y tira de fotos. Usa filtros
//     "caros" (texturas con feTurbulence + iluminación) que el navegador calcula una sola vez.
//  2. Animada: monitor con pez, agua con peces, CD, MP3, burbujas y destellos. Va en otro <svg>
//     para que sus animaciones no obliguen a recalcular los filtros de la capa estática.
// Todo es decorativo (aria-hidden). Los <defs> son del documento, así que ambas capas los comparten.

const BASE = 660; // línea donde apoyan los edificios (queda tapada por la loma y el lago)

// Edificios: [x, ancho, alto, remate]. Remates: flat | slant | round | spire | step
const BACK_ROW = [
  [250, 30, 190, 'flat'], [298, 36, 250, 'slant'], [356, 28, 170, 'flat'], [408, 40, 292, 'spire'],
  [468, 34, 212, 'round'], [540, 30, 242, 'step'], [598, 42, 200, 'flat'], [660, 32, 266, 'slant'],
  [718, 36, 182, 'round'], [768, 28, 150, 'flat'],
];
const FRONT_ROW = [
  [226, 34, 130, 'flat', 'C'], [262, 40, 176, 'step', 'A'], [306, 30, 216, 'spire', 'B'], [340, 44, 160, 'flat', 'C'],
  [388, 36, 236, 'round', 'A'], [428, 28, 146, 'flat', 'B'], [460, 46, 276, 'spire', 'A'], [510, 34, 190, 'slant', 'C'],
  [548, 40, 230, 'flat', 'B'], [592, 30, 160, 'round', 'A'], [626, 44, 206, 'step', 'C'], [674, 36, 246, 'slant', 'A'],
  [714, 40, 170, 'flat', 'B'], [758, 32, 140, 'round', 'C'], [792, 40, 118, 'flat', 'A'],
];

// Silueta frontal del edificio según su remate.
function towerPath(x, w, h, top) {
  const y = BASE - h;
  switch (top) {
    case 'slant':
      return `M${x} ${BASE}V${y + 18}L${x + w} ${y}V${BASE}Z`;
    case 'round':
      return `M${x} ${BASE}V${y + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2}V${BASE}Z`;
    case 'step':
      return `M${x} ${BASE}V${y + 34}H${x + w * 0.16}V${y + 14}H${x + w * 0.3}V${y}H${x + w * 0.7}V${y + 14}H${x + w * 0.84}V${y + 34}H${x + w}V${BASE}Z`;
    default:
      return `M${x} ${BASE}V${y}H${x + w}V${BASE}Z`;
  }
}

// Profundidad: cada torre muestra su cara derecha en sombra y, si es plana, el techo.
const SIDE = 0.34;
const SKEW = 8;

function Tower({ x, w, h, top, tone, back = false }) {
  const y = BASE - h;
  const d = towerPath(x, w, h, top);
  const sd = Math.round(w * SIDE);
  const shoulder = top === 'round' ? y + w / 2 : top === 'step' ? y + 34 : y; // alto del borde derecho
  const side = `${x + w},${shoulder} ${x + w + sd},${shoulder - SKEW} ${x + w + sd},${BASE} ${x + w},${BASE}`;
  const flatTop = top === 'flat' || top === 'spire';

  return (
    <g>
      <polygon points={side} fill={back ? 'url(#sideBack)' : 'url(#towerSide)'} />
      <polygon points={side} fill="url(#bands)" opacity=".5" />
      {flatTop && (
        <polygon points={`${x},${y} ${x + sd},${y - SKEW} ${x + w + sd},${y - SKEW} ${x + w},${y}`} fill="url(#roof)" />
      )}
      {top === 'spire' && (
        <>
          <rect x={x + (w + sd) / 2 - 1.5} y={y - SKEW / 2 - 52} width="3" height="52" fill="url(#antenna)" />
          <circle cx={x + (w + sd) / 2} cy={y - SKEW / 2 - 53} r="2.4" fill="#ff4a3d" />
          <circle cx={x + (w + sd) / 2} cy={y - SKEW / 2 - 53} r="6" fill="#ff4a3d" opacity=".25" />
        </>
      )}
      <path d={d} fill={`url(#tower${tone})`} />
      <path d={d} fill="url(#mullions)" />
      <path d={d} fill="url(#bands)" />
      <path d={d} fill="url(#sheen)" />
      <path d={d} fill="url(#glassRefl)" />
      <path d={d} fill="url(#ao)" />
      <path d={`M${x + 0.5} ${BASE}V${top === 'slant' ? y + 18 : shoulder}`} stroke="#fff" strokeOpacity=".7" />
    </g>
  );
}

function City() {
  return (
    <>
      <g opacity=".72" filter="url(#haze)">
        {BACK_ROW.map(([x, w, h, top]) => (
          <Tower key={x} x={x} w={w} h={h} top={top} tone="Back" back />
        ))}
      </g>
      {FRONT_ROW.map(([x, w, h, top, tone]) => (
        <Tower key={x} x={x} w={w} h={h} top={top} tone={tone} />
      ))}
    </>
  );
}

// Copa: muchas masas de follaje de distinto tamaño; el filtro "foliage" les da borde de hojas,
// textura con relieve e iluminación. Las de atrás son más oscuras para dar profundidad.
const CANOPY_BACK = [
  [-92, -170, 46], [92, -176, 48], [-62, -252, 52], [62, -256, 50], [0, -288, 48],
  [-108, -216, 38], [110, -220, 40], [0, -150, 55],
];
const CANOPY_FRONT = [
  [-56, -160, 48], [46, -158, 50], [0, -196, 62], [-72, -206, 42], [74, -210, 44],
  [-30, -246, 44], [34, -250, 42], [0, -266, 34], [-90, -182, 30], [94, -184, 30],
];
const TRUNK =
  'M-14 4C-12-30-11-70-9-110C-20-128-34-148-52-172L-44-178C-28-158-16-142-4-126C-3-150-2-176 0-204H9C10-180 10-152 11-128C22-146 34-164 48-180L56-174C42-154 28-132 15-112C15-72 16-32 18 4C26 6 32 8 38 6C28 12 12 12 0 10C-12 12-26 12-36 6C-28 6-20 6-14 4Z';

function Tree({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="14" cy="6" rx="116" ry="17" fill="#0f4a06" opacity=".4" filter="url(#blur6)" />
      <ellipse cx="4" cy="6" rx="42" ry="7" fill="#0b3304" opacity=".35" filter="url(#soft)" />
      <path d={TRUNK} fill="url(#trunk)" filter="url(#bark)" />
      <g filter="url(#foliage)">
        {CANOPY_BACK.map(([cx, cy, r]) => (
          <circle key={`b${cx}${cy}`} cx={cx} cy={cy} r={r} fill="url(#leafDark)" />
        ))}
        <ellipse cx="0" cy="-140" rx="92" ry="18" fill="#1f5e0c" opacity=".55" />
        {CANOPY_FRONT.map(([cx, cy, r]) => (
          <circle key={`f${cx}${cy}`} cx={cx} cy={cy} r={r} fill="url(#leaf)" />
        ))}
      </g>
    </g>
  );
}

// Nubes: los "bollos" se deforman con ruido (filtro "cloudy") para quedar esponjosos y sin bordes perfectos.
const PUFFS_A = [[0, 0, 34], [40, -22, 44], [88, -12, 40], [122, 6, 30], [60, 10, 36], [20, 14, 26], [100, 16, 28]];
const PUFFS_B = [[0, 0, 20], [26, -12, 28], [56, -6, 24], [80, 4, 18], [40, 6, 22]];
const CLOUDS = [
  ['A', 560, 40, 1.25], ['A', 760, 110, 0.95], ['A', 1180, 330, 1.0], ['A', 1240, 430, 0.7],
  ['B', 20, 250, 1.0], ['B', 1010, 360, 1.0], ['B', 1310, 520, 0.85], ['B', 950, 480, 0.75],
  ['B', 1330, 40, 0.9], ['B', 600, 230, 0.9], ['B', 800, 300, 0.8],
];

const FAR_TREES = [[1000, 568], [1024, 565], [1210, 561], [1236, 563], [1262, 565], [120, 580], [146, 576]];

// Destellos (estrellitas de 4 puntas): [x, y, escala, retraso]
const SPARKLES = [
  [760, 612, 1, 0], [812, 586, 0.7, 1.2], [700, 590, 0.6, 0.4], [1000, 812, 0.9, 2], [1255, 790, 1, 1.6],
  [1410, 780, 0.7, 0.8], [1180, 760, 0.6, 0.2], [50, 300, 0.8, 1.8], [205, 430, 0.7, 1.1], [500, 120, 0.8, 0.5],
  [560, 290, 0.6, 1.4], [650, 350, 0.7, 2.2], [850, 250, 0.5, 0.9], [880, 420, 0.7, 1.1],
];

// Burbujas grandes: [cx, cy, r]
const BIG_BUBBLES = [
  [1300, 120, 90],
  [1375, 640, 30],
  [1230, 700, 44],
  [880, 720, 24],
];

// Burbujas que suben (HTML): posición, tamaño, duración, retraso y lugar de reposo sin movimiento.
const RISING = Array.from({ length: 18 }, (_, i) => ({
  x: `${(i * 37 + 5) % 100}%`,
  s: 14 + ((i * 13) % 46),
  d: 15 + ((i * 7) % 14),
  delay: (i * 5) % 20,
  rest: `${12 + ((i * 23) % 70)}%`,
}));

const STAR = 'M0-10L2.2-2.2 10 0 2.2 2.2 0 10-2.2 2.2-10 0-2.2-2.2Z';

function Bubble({ cx, cy, r, still = false }) {
  return (
    <g className={still ? undefined : styles.float}>
      <circle cx={cx} cy={cy} r={r} fill="url(#bubble)" />
      <circle cx={cx} cy={cy} r={r - 1.5} fill="none" stroke="url(#irid)" strokeWidth="2.5" opacity=".7" />
      <path
        d={`M${cx - r * 0.62} ${cy - r * 0.4}A${r * 0.74} ${r * 0.74} 0 0 1 ${cx + r * 0.05} ${cy - r * 0.72}`}
        fill="none"
        stroke="#fff"
        strokeWidth={Math.max(2, r * 0.08)}
        strokeLinecap="round"
        opacity=".85"
      />
      <path
        d={`M${cx + r * 0.7} ${cy + r * 0.2}A${r * 0.74} ${r * 0.74} 0 0 1 ${cx + r * 0.2} ${cy + r * 0.7}`}
        fill="none"
        stroke="#d6fff4"
        strokeWidth={Math.max(1.5, r * 0.04)}
        strokeLinecap="round"
        opacity=".7"
      />
    </g>
  );
}

// Borde brillante de una loma (reflejo glossy sobre la cresta).
const Rim = ({ d, w = 3, o = 0.6 }) => (
  <path d={d} fill="none" stroke="#f0ffd0" strokeWidth={w} strokeLinecap="round" opacity={o} />
);

const FAR_HILLS_TOP = 'M0 596C120 566 260 560 380 580C520 602 640 566 780 572C920 578 1040 552 1180 560C1300 566 1380 578 1440 574';
const CITY_HILL_TOP = 'M110 705C200 644 330 614 460 616C540 617 592 640 624 670';
const LAKE = 'M540 668C700 660 1000 658 1440 664V718C1200 710 1000 714 820 718C700 721 600 702 540 668Z';
const RIGHT_HILL_TOP = 'M880 790C1060 716 1260 700 1440 708';
const MEADOW_TOP = 'M0 690C180 650 380 680 560 730C760 786 1000 800 1440 752';

// Iluminación para texturas: multiplica la forma por un relieve de ruido (luz arriba a la izquierda).
// `intercept` sube el brillo base para que la textura no oscurezca de más.
function TextureFilter({ id, freq, octaves = 2, seed, surface = 2, azimuth = 235, elevation = 45, intercept = 0.4, extra = null }) {
  return (
    <filter id={id} x="-15%" y="-15%" width="130%" height="130%">
      <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={octaves} seed={seed} result="noise" />
      {extra}
      <feDiffuseLighting in="noise" surfaceScale={surface} lightingColor="#fff" result="light">
        <feDistantLight azimuth={azimuth} elevation={elevation} />
      </feDiffuseLighting>
      <feComponentTransfer in="light" result="lightUp">
        <feFuncR type="linear" slope=".9" intercept={intercept} />
        <feFuncG type="linear" slope=".9" intercept={intercept} />
        <feFuncB type="linear" slope=".9" intercept={intercept} />
      </feComponentTransfer>
      <feBlend in={extra ? 'shape' : 'SourceGraphic'} in2="lightUp" mode="multiply" result="lit" />
      <feComposite in="lit" in2={extra ? 'shape' : 'SourceGraphic'} operator="in" />
    </filter>
  );
}

export default function Scenery() {
  return (
    <div className={styles.scenery} aria-hidden="true">
      {/* ---------- Capa estática ---------- */}
      <svg className={styles.art} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a36c2" />
            <stop offset=".3" stopColor="#1c63e6" />
            <stop offset=".52" stopColor="#4aa3f2" />
            <stop offset=".66" stopColor="#c4e9ff" />
          </linearGradient>
          <linearGradient id="swoosh" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".9" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="sunGlow">
            <stop offset="0" stopColor="#fff" />
            <stop offset=".14" stopColor="#fff" stopOpacity=".9" />
            <stop offset=".32" stopColor="#a8f0ff" stopOpacity=".45" />
            <stop offset="1" stopColor="#a8f0ff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ray" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity=".55" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="puff" cx="45%" cy="30%" r="70%">
            <stop offset="0" stopColor="#fff" />
            <stop offset=".55" stopColor="#fbfdff" />
            <stop offset=".8" stopColor="#e2eefb" />
            <stop offset="1" stopColor="#b8cfea" />
          </radialGradient>
          <radialGradient id="globe">
            <stop offset="0" stopColor="#78beff" stopOpacity=".06" />
            <stop offset=".72" stopColor="#4f98f5" stopOpacity=".18" />
            <stop offset=".93" stopColor="#3b82ee" stopOpacity=".42" />
            <stop offset="1" stopColor="#d6efff" stopOpacity=".75" />
          </radialGradient>

          {/* Vidrio de los edificios: frente con varias paradas, lateral en sombra, techo claro */}
          <linearGradient id="towerA" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#b2e2ff" />
            <stop offset=".22" stopColor="#6db4f2" />
            <stop offset=".5" stopColor="#3d8fe6" />
            <stop offset=".8" stopColor="#2767c4" />
            <stop offset="1" stopColor="#1a4fa6" />
          </linearGradient>
          <linearGradient id="towerB" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7fb6ee" />
            <stop offset=".25" stopColor="#4a86d4" />
            <stop offset=".55" stopColor="#2458ae" />
            <stop offset=".85" stopColor="#153f86" />
            <stop offset="1" stopColor="#0f3070" />
          </linearGradient>
          <linearGradient id="towerC" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f2faff" />
            <stop offset=".25" stopColor="#cfe6fa" />
            <stop offset=".55" stopColor="#9ccaf2" />
            <stop offset=".85" stopColor="#6f9ed2" />
            <stop offset="1" stopColor="#5a88bf" />
          </linearGradient>
          <linearGradient id="towerBack" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#eef8ff" />
            <stop offset="1" stopColor="#a4c8ee" />
          </linearGradient>
          <linearGradient id="towerSide" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a64b4" />
            <stop offset=".6" stopColor="#163f82" />
            <stop offset="1" stopColor="#0b2656" />
          </linearGradient>
          <linearGradient id="sideBack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a9c8ea" />
            <stop offset="1" stopColor="#7fa4d0" />
          </linearGradient>
          <linearGradient id="roof" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f4faff" />
            <stop offset="1" stopColor="#a9c4e2" />
          </linearGradient>
          <linearGradient id="antenna" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f4f8fc" />
            <stop offset="1" stopColor="#8aa0b8" />
          </linearGradient>
          <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".4" />
            <stop offset=".3" stopColor="#fff" stopOpacity=".05" />
            <stop offset="1" stopColor="#0a2a66" stopOpacity=".2" />
          </linearGradient>
          {/* Reflejos diagonales de luz sobre el vidrio */}
          <linearGradient id="glassRefl" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".36" stopColor="#fff" stopOpacity="0" />
            <stop offset=".42" stopColor="#fff" stopOpacity=".32" />
            <stop offset=".47" stopColor="#fff" stopOpacity=".06" />
            <stop offset=".53" stopColor="#fff" stopOpacity=".2" />
            <stop offset=".58" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          {/* Oclusión ambiental en la base */}
          <linearGradient id="ao" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset=".72" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#06204a" stopOpacity=".38" />
          </linearGradient>
          <pattern id="bands" width="10" height="7" patternUnits="userSpaceOnUse">
            <rect width="10" height="1.1" fill="#fff" opacity=".38" />
          </pattern>
          <pattern id="mullions" width="6" height="10" patternUnits="userSpaceOnUse">
            <rect width=".8" height="10" fill="#0a2a66" opacity=".2" />
          </pattern>
          <filter id="haze" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation=".7" />
          </filter>

          <linearGradient id="farHill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b2e69a" />
            <stop offset=".5" stopColor="#6cc062" />
          </linearGradient>
          <linearGradient id="field" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c0f48a" />
            <stop offset=".35" stopColor="#70da34" />
            <stop offset="1" stopColor="#339c16" />
          </linearGradient>
          <linearGradient id="grassFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a8f462" />
            <stop offset=".4" stopColor="#56c624" />
            <stop offset="1" stopColor="#23840f" />
          </linearGradient>
          <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d2ecff" />
            <stop offset=".4" stopColor="#6fb0f2" />
            <stop offset="1" stopColor="#2c64c0" />
          </linearGradient>
          <clipPath id="lakeClip">
            <path d={LAKE} />
          </clipPath>

          <radialGradient id="leaf" cx="35%" cy="28%" r="78%">
            <stop offset="0" stopColor="#e8ffa8" />
            <stop offset=".3" stopColor="#a8e650" />
            <stop offset=".6" stopColor="#62bf28" />
            <stop offset=".85" stopColor="#3a931a" />
            <stop offset="1" stopColor="#276e10" />
          </radialGradient>
          <radialGradient id="leafDark" cx="35%" cy="28%" r="78%">
            <stop offset="0" stopColor="#9ad458" />
            <stop offset=".5" stopColor="#3e8f1c" />
            <stop offset="1" stopColor="#1a5a0a" />
          </radialGradient>
          <linearGradient id="trunk" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#6e4724" />
            <stop offset=".3" stopColor="#a8784a" />
            <stop offset=".6" stopColor="#7a5030" />
            <stop offset="1" stopColor="#3e2612" />
          </linearGradient>

          <radialGradient id="bubble">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".72" stopColor="#bff3fa" stopOpacity=".06" />
            <stop offset=".9" stopColor="#9ff0e0" stopOpacity=".32" />
            <stop offset=".97" stopColor="#fff" stopOpacity=".85" />
            <stop offset="1" stopColor="#7fc8ff" stopOpacity=".4" />
          </radialGradient>
          <linearGradient id="irid" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff9ad5" />
            <stop offset=".35" stopColor="#9ff0ff" />
            <stop offset=".7" stopColor="#c6ff8a" />
            <stop offset="1" stopColor="#8ab4ff" />
          </linearGradient>

          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
          <filter id="blur6" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>

          {/* Texturas realistas */}
          <filter id="cloudy" x="-20%" y="-40%" width="140%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="4" seed="9" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G" result="shape" />
            <feGaussianBlur in="shape" stdDeviation="1.6" />
          </filter>
          <TextureFilter
            id="foliage"
            freq=".14"
            octaves={4}
            seed={11}
            surface={6}
            elevation={38}
            intercept={0.34}
            extra={
              <>
                <feTurbulence type="fractalNoise" baseFrequency=".08" numOctaves="3" seed="7" result="edge" />
                <feDisplacementMap in="SourceGraphic" in2="edge" scale="16" xChannelSelector="R" yChannelSelector="G" result="shape" />
              </>
            }
          />
          <TextureFilter id="bark" freq=".5 .03" octaves={3} seed={2} surface={3} azimuth={200} intercept={0.35} />
          <TextureFilter id="grassTex" freq=".9 .12" seed={4} surface={1.6} elevation={50} intercept={0.42} />
          <filter id="ripple" x="-5%" y="-20%" width="110%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency=".004 .18" numOctaves="2" seed="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          <PartsDefs />
          <g id="cloudA">
            {PUFFS_A.map(([cx, cy, r]) => (
              <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={r} fill="url(#puff)" />
            ))}
          </g>
          <g id="cloudB">
            {PUFFS_B.map(([cx, cy, r]) => (
              <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={r} fill="url(#puff)" />
            ))}
          </g>
        </defs>

        {/* Cielo y arcos de luz */}
        <rect width="1440" height="900" fill="url(#sky)" />
        <path d="M100 720C500 470 1000 330 1600 230" fill="none" stroke="url(#swoosh)" strokeWidth="70" opacity=".14" filter="url(#blur6)" />
        <path d="M140 640C500 420 950 300 1600 180" fill="none" stroke="url(#swoosh)" strokeWidth="3" opacity=".35" />

        {/* Sol */}
        <g transform="translate(230 150)">
          <circle r="330" fill="url(#sunGlow)" />
          {Array.from({ length: 12 }, (_, i) => (
            <polygon key={i} points="-9,-70 9,-70 0,-300" fill="url(#ray)" transform={`rotate(${i * 30 + 15})`} />
          ))}
          <circle r="95" fill="#fff" filter="url(#glow)" />
          <circle r="72" fill="#fff" />
        </g>
        {/* Reflejos de lente */}
        <circle cx="395" cy="280" r="16" fill="#d4fff4" opacity=".3" />
        <circle cx="500" cy="370" r="30" fill="#bff3fa" opacity=".12" />
        <circle cx="580" cy="440" r="9" fill="#e6ffd0" opacity=".35" />

        {/* Nubes */}
        <g filter="url(#cloudy)">
          {CLOUDS.map(([k, x, y, s]) => (
            <use key={`${x}${y}`} href={`#cloud${k}`} transform={`translate(${x} ${y}) scale(${s})`} />
          ))}
        </g>

        {/* Globo de vidrio gigante */}
        <circle cx="700" cy="400" r="272" fill="url(#globe)" />
        <circle cx="700" cy="400" r="272" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="2" />
        <path d="M490 270A254 254 0 0 1 770 150" fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" opacity=".3" filter="url(#soft)" />
        <path d="M935 490A254 254 0 0 1 850 610" fill="none" stroke="#bff3fa" strokeWidth="6" strokeLinecap="round" opacity=".4" />

        {/* Neblina del horizonte y lomas lejanas */}
        <ellipse cx="1100" cy="570" rx="420" ry="26" fill="#fff" opacity=".55" filter="url(#blur6)" />
        <ellipse cx="200" cy="585" rx="320" ry="20" fill="#fff" opacity=".5" filter="url(#blur6)" />
        <path d={`${FAR_HILLS_TOP}V720H0Z`} fill="url(#farHill)" filter="url(#grassTex)" />
        <Rim d={FAR_HILLS_TOP} w={2} o={0.5} />
        {FAR_TREES.map(([x, y]) => (
          <Tree key={x} x={x} y={y} s={0.11} />
        ))}

        {/* Ciudad de cristal, suelo de la costa y loma de la ciudad */}
        <City />
        <rect y="700" width="1440" height="200" fill="url(#field)" filter="url(#grassTex)" />
        <path d={`${CITY_HILL_TOP}C600 690 560 705 520 712L110 712Z`} fill="url(#field)" filter="url(#grassTex)" />
        <Rim d={CITY_HILL_TOP} />
        <Tree x={596} y={664} s={0.3} />

        {/* Lago con reflejo ondulado de la ciudad */}
        <path d={LAKE} fill="url(#lake)" />
        <g clipPath="url(#lakeClip)" opacity=".3">
          <g filter="url(#ripple)">
            <g transform={`translate(0 ${BASE * 2 + 16}) scale(1 -1)`}>
              {FRONT_ROW.filter(([x]) => x > 530).map(([x, w, h, top, tone]) => (
                <path key={x} d={towerPath(x, w, h, top)} fill={`url(#tower${tone})`} />
              ))}
            </g>
          </g>
        </g>
        <path d="M600 676C760 668 1040 666 1440 672" fill="none" stroke="#fff" strokeWidth="2" opacity=".8" />
        <path d="M700 694C860 688 1100 690 1300 694" fill="none" stroke="#fff" strokeWidth="1.2" opacity=".5" />

        {/* Lomas cercanas */}
        <path d={`${RIGHT_HILL_TOP}V900H880Z`} fill="url(#field)" filter="url(#grassTex)" />
        <Rim d={RIGHT_HILL_TOP} />
        <path d={`${MEADOW_TOP}V900H0Z`} fill="url(#grassFront)" filter="url(#grassTex)" />
        <Rim d={MEADOW_TOP} w={4} o={0.55} />

        {/* Árbol principal, tira de fotos y destello verde */}
        <Tree x={170} y={782} s={1.05} />
        <FilmStrip />
        <circle cx="120" cy="690" r="22" fill="#c6ff6a" opacity=".4" filter="url(#soft)" />
      </svg>

      {/* ---------- Capa animada ---------- */}
      <svg className={styles.art} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice">
        <Monitor x={610} y={818} s={0.82} />
        <Water />
        <Disc x={110} y={360} r={58} />
        <g className={styles.float}>
          <Mp3Player x={430} y={190} />
          <Bubble cx={430} cy={192} r={64} still />
        </g>

        {BIG_BUBBLES.map(([cx, cy, r]) => (
          <Bubble key={cx} cx={cx} cy={cy} r={r} />
        ))}

        {SPARKLES.map(([x, y, s, delay]) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${s})`}>
            <path d={STAR} fill="#f4ffe0" className={styles.sparkle} style={{ animationDelay: `${delay}s` }} />
          </g>
        ))}
      </svg>

      {RISING.map((b, i) => (
        <span
          key={i}
          className={styles.bubble}
          style={{ '--x': b.x, '--s': `${b.s}px`, '--d': `${b.d}s`, '--delay': `-${b.delay}s`, '--rest': b.rest }}
        />
      ))}
    </div>
  );
}
