import styles from './Scenery.module.css';
import baseUrl from '../assets/scene/base.webp';
import cityUrl from '../assets/scene/city.webp';
import treeUrl from '../assets/scene/tree.webp';
import { FilmStrip, PartsDefs, PhotoDisc, PhotoMonitor, PhotoMp3, Water } from './SceneryParts.jsx';

// Fondo Frutiger Aero fotográfico: fotos reales recortadas (créditos en el README) + detalles de
// época en SVG (sol, nubes, globo de vidrio, burbujas, destellos). Está partido en dos capas:
//  1. Estática: foto base, cielo, sol, nubes, globo, ciudad, árbol y tira de película.
//  2. Animada: monitor con pez, agua con peces, CD, MP3, burbujas y destellos.
// Así las animaciones no obligan a recalcular los filtros de la capa estática. Todo es decorativo.

// La foto base (1920×1079, espejada) se escala a 1800 px de ancho y se corre a la izquierda
// para que el árbol quede del lado izquierdo, libre de la ventana de login.
const K = 1800 / 1920;
const BASE = { x: -330, y: -111, w: 1800, h: 1079 * K };
const HORIZON = BASE.y + 719 * K; // ≈ 563
// El árbol recortado de la misma foto (bbox 345,265 → 864,744) se dibuja encima de la ciudad,
// en la misma posición exacta: así la ciudad queda "detrás" del árbol.
const TREE = { x: BASE.x + 345 * K, y: BASE.y + 265 * K, w: 519 * K, h: 479 * K };
const CITY = { x: 330, w: 760, h: (760 * 568) / 1100 };

// Nubes: los "bollos" se deforman con ruido (filtro "cloudy") para quedar esponjosos.
const PUFFS_A = [[0, 0, 34], [40, -22, 44], [88, -12, 40], [122, 6, 30], [60, 10, 36], [20, 14, 26], [100, 16, 28]];
const PUFFS_B = [[0, 0, 20], [26, -12, 28], [56, -6, 24], [80, 4, 18], [40, 6, 22]];
const CLOUDS = [
  ['A', -40, 270, 1.2], ['A', 1150, 60, 0.8], ['A', 1180, 330, 0.9],
  ['B', 380, 255, 0.8], ['B', 780, 200, 0.8], ['B', 930, 40, 0.8], ['B', 1320, 500, 0.7],
];

// Destellos (estrellitas de 4 puntas): [x, y, escala, retraso]
const SPARKLES = [
  [470, 60, 0.9, 0], [590, 150, 0.7, 1.2], [800, 55, 0.8, 0.4], [1000, 812, 0.9, 2], [1255, 790, 1, 1.6],
  [1410, 780, 0.7, 0.8], [1180, 760, 0.6, 0.2], [520, 560, 0.8, 1.8], [470, 600, 0.6, 1.1],
  [820, 300, 0.6, 1.4], [600, 270, 0.7, 2.2], [880, 420, 0.7, 0.9],
];

// Burbujas grandes: [cx, cy, r]
const BIG_BUBBLES = [
  [1320, 90, 70],
  [1385, 690, 28],
  [1235, 715, 40],
  [870, 740, 22],
  [640, 520, 18],
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

export default function Scenery() {
  return (
    <div className={styles.scenery} aria-hidden="true">
      {/* ---------- Capa estática ---------- */}
      <svg className={styles.art} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice">
        <defs>
          {/* Tinte de cielo Frutiger: azul profundo arriba que se aclara hacia el horizonte */}
          <linearGradient id="skyTint" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0833b8" stopOpacity=".62" />
            <stop offset=".45" stopColor="#1c63e6" stopOpacity=".22" />
            <stop offset="1" stopColor="#bfe9ff" stopOpacity="0" />
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
            <stop offset="0" stopColor="#78beff" stopOpacity=".05" />
            <stop offset=".72" stopColor="#4f98f5" stopOpacity=".15" />
            <stop offset=".93" stopColor="#3b82ee" stopOpacity=".38" />
            <stop offset="1" stopColor="#d6efff" stopOpacity=".75" />
          </radialGradient>
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
          <filter id="cloudy" x="-20%" y="-40%" width="140%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="4" seed="9" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G" result="shape" />
            <feGaussianBlur in="shape" stdDeviation="1.6" />
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

        {/* Foto base: cielo, horizonte y pasto */}
        <image href={baseUrl} x={BASE.x} y={BASE.y} width={BASE.w} height={BASE.h} preserveAspectRatio="none" />
        <rect y={BASE.y} width="1440" height={HORIZON - BASE.y} fill="url(#skyTint)" />
        <path d="M100 720C500 470 1000 330 1600 230" fill="none" stroke="url(#swoosh)" strokeWidth="70" opacity=".12" filter="url(#blur6)" />
        <path d="M140 640C500 420 950 300 1600 180" fill="none" stroke="url(#swoosh)" strokeWidth="3" opacity=".3" />

        {/* Sol con rayos y reflejos de lente */}
        <g transform="translate(250 120)">
          <circle r="330" fill="url(#sunGlow)" />
          {Array.from({ length: 12 }, (_, i) => (
            <polygon key={i} points="-9,-70 9,-70 0,-300" fill="url(#ray)" transform={`rotate(${i * 30 + 15})`} />
          ))}
          <circle r="95" fill="#fff" filter="url(#glow)" />
          <circle r="72" fill="#fff" />
        </g>
        <circle cx="415" cy="250" r="16" fill="#d4fff4" opacity=".3" />
        <circle cx="520" cy="340" r="30" fill="#bff3fa" opacity=".12" />
        <circle cx="600" cy="410" r="9" fill="#e6ffd0" opacity=".35" />

        {/* Nubes */}
        <g filter="url(#cloudy)">
          {CLOUDS.map(([k, x, y, s]) => (
            <use key={`${x}${y}`} href={`#cloud${k}`} transform={`translate(${x} ${y}) scale(${s})`} />
          ))}
        </g>

        {/* Globo de vidrio gigante detrás de la ciudad */}
        <circle cx="690" cy="350" r="235" fill="url(#globe)" />
        <circle cx="690" cy="350" r="235" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="2" />
        <path d="M508 238A218 218 0 0 1 750 134" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" opacity=".3" filter="url(#soft)" />
        <path d="M894 432A218 218 0 0 1 820 536" fill="none" stroke="#bff3fa" strokeWidth="5" strokeLinecap="round" opacity=".4" />

        {/* Ciudad de cristal (foto), neblina del horizonte y árbol (foto) por delante */}
        <image href={cityUrl} x={CITY.x} y={HORIZON + 30 - CITY.h} width={CITY.w} height={CITY.h} />
        <ellipse cx="720" cy={HORIZON + 4} rx="760" ry="16" fill="#fff" opacity=".45" filter="url(#blur6)" />
        <image href={treeUrl} x={TREE.x} y={TREE.y} width={TREE.w} height={TREE.h} />

        <FilmStrip />
      </svg>

      {/* ---------- Capa animada ---------- */}
      <svg className={styles.art} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice">
        <PhotoMonitor x={540} y={612} s={0.36} />
        <Water />
        <PhotoDisc x={520} y={92} r={54} />
        <g className={styles.float}>
          <PhotoMp3 x={722} y={98} w={124} />
          <Bubble cx={722} cy={98} r={68} still />
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
