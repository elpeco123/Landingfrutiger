import styles from './Scenery.module.css';

// Piezas detalladas del fondo: peces y tecnología de los 2000 (CD, MP3, monitor LCD, tira de fotos).
// Se dibujan dentro del <svg> de Scenery; los degradados que usan viven en <PartsDefs />.

const INK = '#1a1a1a';

// Silueta de los peces (se reutiliza como clipPath para las franjas).
const CLOWN_BODY = 'M-52 0C-46-22-20-30 8-28C30-26 46-12 48 0C46 12 30 26 8 28C-20 30-46 22-52 0Z';
const TANG_BODY = 'M-42 0C-36-30-6-40 18-34C34-28 42-14 44 0C42 14 34 28 18 34C-6 40-36 30-42 0Z';
const WATER_TOP = 'M690 900C750 832 860 800 960 804C1080 810 1160 770 1280 774C1360 777 1410 768 1440 764';
const TANG_BLUE_BODY = 'M-44 0C-38-20-14-28 10-26C30-24 42-12 44 0C42 12 30 24 10 26C-14 28-38 20-44 0Z';

export function PartsDefs() {
  return (
    <>
      <linearGradient id="silver" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset=".45" stopColor="#dfe7ef" />
        <stop offset=".55" stopColor="#b4c3d1" />
        <stop offset="1" stopColor="#eef3f8" />
      </linearGradient>
      <linearGradient id="bezel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4a5664" />
        <stop offset=".5" stopColor="#1b232c" />
        <stop offset="1" stopColor="#0b1016" />
      </linearGradient>
      <linearGradient id="screen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1c63e6" />
        <stop offset=".55" stopColor="#8fd8ff" />
        <stop offset=".56" stopColor="#27b4e6" />
        <stop offset="1" stopColor="#0a5fb0" />
      </linearGradient>
      <linearGradient id="glare" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".45" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c4f7ff" stopOpacity=".92" />
        <stop offset=".35" stopColor="#3cc0ec" stopOpacity=".92" />
        <stop offset="1" stopColor="#0a6ec8" />
      </linearGradient>
      {/* Peces: degradados de muchas paradas para dar volumen */}
      <linearGradient id="clown" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffe0b0" />
        <stop offset=".15" stopColor="#ffc070" />
        <stop offset=".35" stopColor="#ffa03a" />
        <stop offset=".55" stopColor="#ff8a1f" />
        <stop offset=".75" stopColor="#f06a12" />
        <stop offset=".9" stopColor="#d9500f" />
        <stop offset="1" stopColor="#a8380a" />
      </linearGradient>
      <linearGradient id="clownFin" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#ff8a1f" />
        <stop offset=".6" stopColor="#ffb05a" stopOpacity=".92" />
        <stop offset="1" stopColor="#ffd9a8" stopOpacity=".8" />
      </linearGradient>
      <linearGradient id="bandWhite" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d4e2ef" />
        <stop offset=".25" stopColor="#ffffff" />
        <stop offset=".65" stopColor="#f6fbff" />
        <stop offset="1" stopColor="#b9cbdc" />
      </linearGradient>
      <linearGradient id="yellowFish" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fffbd0" />
        <stop offset=".18" stopColor="#fff39a" />
        <stop offset=".4" stopColor="#ffe14a" />
        <stop offset=".6" stopColor="#ffd21f" />
        <stop offset=".8" stopColor="#f0b400" />
        <stop offset="1" stopColor="#c98a00" />
      </linearGradient>
      <linearGradient id="tangFin" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#ffd21f" />
        <stop offset=".7" stopColor="#ffe46a" stopOpacity=".9" />
        <stop offset="1" stopColor="#fff3b0" stopOpacity=".75" />
      </linearGradient>
      {/* Sombreado esférico que se superpone a cualquier cuerpo: luz arriba a la izquierda */}
      <radialGradient id="volume" cx="38%" cy="22%" r="85%">
        <stop offset="0" stopColor="#fff" stopOpacity=".55" />
        <stop offset=".32" stopColor="#fff" stopOpacity="0" />
        <stop offset=".62" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#031a3a" stopOpacity=".5" />
      </radialGradient>
      <radialGradient id="iris" cx="45%" cy="40%" r="60%">
        <stop offset="0" stopColor="#fff6c8" />
        <stop offset=".55" stopColor="#ffb347" />
        <stop offset="1" stopColor="#8a3208" />
      </radialGradient>
      <radialGradient id="irisDark" cx="45%" cy="40%" r="60%">
        <stop offset="0" stopColor="#6a7a8a" />
        <stop offset=".6" stopColor="#1b2530" />
        <stop offset="1" stopColor="#05070c" />
      </radialGradient>
      <pattern id="scales" width="7" height="5" patternUnits="userSpaceOnUse">
        <path d="M0 5Q3.5-1 7 5" fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth=".8" />
      </pattern>
      <pattern id="tangLines" width="6" height="10" patternUnits="userSpaceOnUse">
        <path d="M3 0V10" stroke="#c98a00" strokeOpacity=".22" strokeWidth=".9" />
      </pattern>
      <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".35" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      {/* Sombras proyectadas */}
      <filter id="fishShadow" x="-30%" y="-30%" width="160%" height="180%">
        <feDropShadow dx="3" dy="7" stdDeviation="4" floodColor="#032a55" floodOpacity=".45" />
      </filter>
      <filter id="drop" x="-30%" y="-30%" width="160%" height="170%">
        <feDropShadow dx="5" dy="10" stdDeviation="7" floodColor="#0a2a5a" floodOpacity=".38" />
      </filter>
      <linearGradient id="note" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8ff0ff" />
        <stop offset=".55" stopColor="#1a8fe6" />
        <stop offset="1" stopColor="#0a4fb0" />
      </linearGradient>
      <radialGradient id="disc" cx="40%" cy="35%" r="75%">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset=".6" stopColor="#e4ecf4" />
        <stop offset="1" stopColor="#b3c2d2" />
      </radialGradient>
      <linearGradient id="lcd" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e2f7ff" />
        <stop offset="1" stopColor="#3aa2e8" />
      </linearGradient>
      <linearGradient id="film0" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1c63e6" />
        <stop offset="1" stopColor="#c4ecff" />
      </linearGradient>
      <linearGradient id="film1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8fdcff" />
        <stop offset=".5" stopColor="#27b4e6" />
        <stop offset="1" stopColor="#0a5fb0" />
      </linearGradient>
      <linearGradient id="film2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6fc0ff" />
        <stop offset=".55" stopColor="#d4f2ff" />
        <stop offset=".56" stopColor="#62d12c" />
        <stop offset="1" stopColor="#2c9412" />
      </linearGradient>
      <clipPath id="waterClip">
        <path d={`${WATER_TOP}V900Z`} />
      </clipPath>
      <clipPath id="tangClip">
        <path d={TANG_BODY} />
      </clipPath>
      <clipPath id="clownClip">
        <path d={CLOWN_BODY} />
      </clipPath>
      <linearGradient id="blueFish" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8fc4ff" />
        <stop offset=".5" stopColor="#2a6fff" />
        <stop offset="1" stopColor="#0a2fa8" />
      </linearGradient>
    </>
  );
}

// Ojo con cuenca, iris con degradado, pupila y dos brillos.
const Eye = ({ x, y, r = 6, iris = 'iris' }) => (
  <g>
    <circle cx={x + 0.6} cy={y + 0.8} r={r + 1.2} fill="#000" opacity=".25" />
    <circle cx={x} cy={y} r={r} fill={`url(#${iris})`} stroke={INK} strokeWidth="1.2" />
    <circle cx={x - r * 0.1} cy={y + r * 0.05} r={r * 0.55} fill="#05070c" />
    <ellipse cx={x - r * 0.35} cy={y - r * 0.38} rx={r * 0.3} ry={r * 0.22} fill="#fff" />
    <circle cx={x + r * 0.32} cy={y + r * 0.35} r={r * 0.11} fill="#fff" opacity=".85" />
  </g>
);

// Radios de aleta: n líneas finas que van del segmento "from" al segmento "to".
const Rays = ({ from, to, color, n = 5 }) => (
  <g stroke={color} strokeOpacity=".45" strokeWidth=".9" strokeLinecap="round">
    {Array.from({ length: n }, (_, i) => {
      const k = n === 1 ? 0.5 : i / (n - 1);
      const x1 = from[0][0] + (from[1][0] - from[0][0]) * k;
      const y1 = from[0][1] + (from[1][1] - from[0][1]) * k;
      const x2 = to[0][0] + (to[1][0] - to[0][0]) * k;
      const y2 = to[0][1] + (to[1][1] - to[0][1]) * k;
      return <path key={i} d={`M${x1} ${y1}L${x2} ${y2}`} />;
    })}
  </g>
);

/** Pez payaso con volumen: sombra proyectada, escamas, aletas con radios y bordes negros. Mira a la izquierda. */
export function Clownfish({ x, y, s = 1, flip = false, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className={styles.swim} style={{ animationDelay: `${delay}s` }}>
        <g filter="url(#fishShadow)">
          {/* Aleta caudal */}
          <path d="M42 0C50-10 58-20 68-23C72-8 72 8 68 23C58 20 50 10 42 0Z" fill="url(#clownFin)" />
          <Rays from={[[46, -2], [46, 2]]} to={[[67, -20], [67, 20]]} color="#8a3208" n={6} />
          <path d="M68-23C72-8 72 8 68 23" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
          <path d="M42 0C50-10 58-20 68-23M42 0C50 10 58 20 68 23" fill="none" stroke={INK} strokeWidth="1.2" />

          {/* Dorsal (parte espinosa + parte blanda) */}
          <path d="M-24-24C-20-36-10-40 0-34C6-41 18-43 26-36C33-31 35-24 33-17Z" fill="url(#clownFin)" />
          <Rays from={[[-18, -26], [30, -20]]} to={[[-14, -36], [30, -30]]} color="#8a3208" n={8} />
          <path d="M-24-24C-20-36-10-40 0-34C6-41 18-43 26-36C33-31 35-24 33-17" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />

          {/* Pélvica y anal */}
          <path d="M-8 22C-6 35 4 41 13 34C10 28 8 24 6 20Z" fill="url(#clownFin)" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M16 22C22 33 32 35 37 26C33 22 27 18 22 16Z" fill="url(#clownFin)" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />

          {/* Cuerpo con franjas, escamas, volumen y luz de borde */}
          <path d={CLOWN_BODY} fill="url(#clown)" />
          <g clipPath="url(#clownClip)">
            <path d="M-30-40C-39-10-39 10-30 40H-17C-26 10-26-10-17-40Z" fill="url(#bandWhite)" stroke={INK} strokeWidth="2.6" />
            <path d="M2-40C-5-10-5 10 2 40H16C9 10 9-10 16-40Z" fill="url(#bandWhite)" stroke={INK} strokeWidth="2.6" />
            <path d="M34-40C29-10 29 10 34 40H42C37 10 37-10 42-40Z" fill="url(#bandWhite)" stroke={INK} strokeWidth="2.6" />
            <rect x="-60" y="-40" width="120" height="80" fill="url(#scales)" />
            <path d={CLOWN_BODY} fill="url(#volume)" />
            <path d="M-44 12C-28 26 12 32 44 12" fill="none" stroke="#ffe3b0" strokeWidth="3" opacity=".55" />
          </g>
          <path d={CLOWN_BODY} fill="none" stroke="#6b2505" strokeWidth="1" strokeOpacity=".7" />

          {/* Pectoral translúcida */}
          <path d="M-12 4C-4 17 10 19 15 10C8 6-2 2-12 4Z" fill="#ffb347" fillOpacity=".75" stroke="#8a3208" strokeWidth="1" />
          <Rays from={[[-10, 5], [-10, 5]]} to={[[4, 15], [14, 9]]} color="#8a3208" n={4} />

          <Eye x={-38} y={-6} r={6.5} />
          <path d="M-53 2Q-49 6-45 3" stroke={INK} fill="none" strokeWidth="1.6" strokeLinecap="round" />
          <ellipse cx="-24" cy="-17" rx="17" ry="4.2" fill="#fff" opacity=".5" transform="rotate(-8 -24 -17)" />
          <ellipse cx="-31" cy="-19" rx="5" ry="1.8" fill="#fff" opacity=".95" transform="rotate(-8 -31 -19)" />
        </g>
      </g>
    </g>
  );
}

/** Pez cirujano amarillo con volumen, aletas grandes con radios y espina blanca. Mira a la izquierda. */
export function YellowTang({ x, y, s = 1, flip = false, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className={styles.swim} style={{ animationDelay: `${delay}s` }}>
        <g filter="url(#fishShadow)">
          {/* Cola */}
          <path d="M40 0C48-12 58-20 67-23C63-8 63 8 67 23C58 20 48 12 40 0Z" fill="url(#tangFin)" stroke="#b77b00" strokeWidth="1.2" />
          <Rays from={[[44, -2], [44, 2]]} to={[[65, -20], [65, 20]]} color="#b77b00" n={6} />

          {/* Dorsal y anal grandes */}
          <path d="M-28-28C-14-58 22-58 40-22C22-30-6-34-28-28Z" fill="url(#tangFin)" stroke="#b77b00" strokeWidth="1.2" />
          <Rays from={[[-24, -29], [34, -24]]} to={[[-14, -48], [36, -30]]} color="#b77b00" n={9} />
          <path d="M-28 28C-14 58 22 58 40 22C22 30-6 34-28 28Z" fill="url(#tangFin)" stroke="#b77b00" strokeWidth="1.2" />
          <Rays from={[[-24, 29], [34, 24]]} to={[[-14, 48], [36, 30]]} color="#b77b00" n={9} />

          {/* Hocico */}
          <path d="M-40-4L-54-7C-57-3-57 3-54 7L-40 4Z" fill="url(#yellowFish)" stroke="#b77b00" strokeWidth="1.2" />

          {/* Cuerpo */}
          <path d={TANG_BODY} fill="url(#yellowFish)" />
          <g clipPath="url(#tangClip)">
            <rect x="-50" y="-40" width="100" height="80" fill="url(#tangLines)" />
            <path d={TANG_BODY} fill="url(#volume)" />
            <path d="M-36 14C-20 32 16 36 40 12" fill="none" stroke="#fff7c8" strokeWidth="3" opacity=".6" />
          </g>
          <path d={TANG_BODY} fill="none" stroke="#b77b00" strokeWidth="1.4" />

          {/* Espina blanca (el "bisturí") y opérculo */}
          <path d="M28 5 40 1.5 28-1.5Z" fill="#fff" stroke="#a9b4bf" strokeWidth=".8" />
          <path d="M-18-18C-12-6-12 6-18 18" fill="none" stroke="#c98a00" strokeWidth="1.2" opacity=".6" />

          {/* Pectoral translúcida */}
          <path d="M-10 4C-2 16 12 17 16 8C9 5 0 2-10 4Z" fill="#fff39a" fillOpacity=".7" stroke="#b77b00" strokeWidth=".9" />
          <Rays from={[[-8, 5], [-8, 5]]} to={[[6, 14], [15, 8]]} color="#b77b00" n={4} />

          <Eye x={-27} y={-9} r={5.5} iris="irisDark" />
          <path d="M-56-1Q-54 1-56 3" stroke="#6b4500" fill="none" strokeWidth="1.2" />
          <ellipse cx="-14" cy="-22" rx="16" ry="4.5" fill="#fff" opacity=".5" transform="rotate(-10 -14 -22)" />
          <ellipse cx="-20" cy="-25" rx="5" ry="1.8" fill="#fff" opacity=".95" transform="rotate(-10 -20 -25)" />
        </g>
      </g>
    </g>
  );
}

/** Pez cirujano azul (el que salta del monitor). */
function BlueTang({ x, y, s = 1, r = 0, flip = false }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${flip ? -s : s} ${s})`} filter="url(#fishShadow)">
      <path d="M40 0C48-10 56-18 64-21C60-6 60 6 64 21C56 18 48 10 40 0Z" fill="url(#tangFin)" stroke="#0a1f5a" strokeWidth="1.5" />
      <Rays from={[[44, -2], [44, 2]]} to={[[62, -18], [62, 18]]} color="#8a6a00" n={6} />
      <path d="M-26-24C-10-40 18-40 34-18Z" fill="#1a5cff" stroke="#0a1f5a" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M-26-24C-10-40 18-40 34-18" fill="none" stroke="#0b1236" strokeWidth="3" />
      <path d="M-20 22C-6 36 16 34 30 16Z" fill="#1a5cff" stroke="#0a1f5a" strokeWidth="1.5" strokeLinejoin="round" />
      <path d={TANG_BLUE_BODY} fill="url(#blueFish)" />
      <path d="M-18-10C-4-24 22-20 36-6C24-12 10-10 4 0C-4 10-12 8-18 2C-12-2-12-6-18-10Z" fill="#0b1236" />
      <path d={TANG_BLUE_BODY} fill="url(#volume)" />
      <path d={TANG_BLUE_BODY} fill="none" stroke="#0a1f5a" strokeWidth="1.5" />
      <path d="M-34 10C-22 18-8 18 4 12" fill="none" stroke="#bfe0ff" strokeWidth="2" opacity=".7" />
      <path d="M-44 0L-52-3-51 3Z" fill="#1a5cff" stroke="#0a1f5a" />
      <Eye x={-30} y={-6} r={5} iris="irisDark" />
      <ellipse cx="-16" cy="-17" rx="16" ry="4" fill="#fff" opacity=".5" />
      <ellipse cx="-22" cy="-19" rx="5" ry="1.6" fill="#fff" opacity=".95" />
    </g>
  );
}

/** Agua del frente con peces, reflejos y burbujitas. */

export function Water() {
  return (
    <g>
      <path d={`${WATER_TOP}V900Z`} fill="url(#water)" />
      {/* Haces de luz bajo el agua */}
      <g opacity=".7" clipPath="url(#waterClip)">
        {[[860, 60], [1010, 80], [1190, 70], [1340, 60]].map(([bx, w]) => (
          <polygon key={bx} points={`${bx},760 ${bx + w},760 ${bx + w * 1.6},900 ${bx + w * 0.4},900`} fill="url(#beam)" />
        ))}
      </g>
      {/* Cáusticas: reflejos ondulados del fondo */}
      <path d="M800 880C830 872 850 888 880 878S930 870 960 882M1040 890C1070 880 1100 896 1130 884S1190 878 1220 890M1260 870C1290 862 1320 878 1350 868S1400 862 1440 872" fill="none" stroke="#e6fdff" strokeWidth="1.5" opacity=".45" />
      <Clownfish x={1150} y={842} s={0.95} />
      <Clownfish x={965} y={872} s={0.55} delay={1.2} />
      <YellowTang x={1340} y={846} s={0.8} flip delay={0.6} />
      <path d={`${WATER_TOP}V900Z`} fill="#bff6ff" opacity=".12" />
      <path d={WATER_TOP} fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" opacity=".9" />
      <path d="M830 836C900 824 960 828 1020 832M1120 800C1180 790 1240 786 1300 788" fill="none" stroke="#fff" strokeWidth="1.5" opacity=".55" />
      {[[1080, 860, 7], [1096, 838, 4.5], [1230, 876, 6], [1405, 830, 5], [1022, 884, 4]].map(([cx, cy, r]) => (
        <g key={cx}>
          <circle cx={cx} cy={cy} r={r} fill="#fff" fillOpacity=".15" stroke="#fff" strokeOpacity=".85" />
          <circle cx={cx - r * 0.35} cy={cy - r * 0.35} r={r * 0.25} fill="#fff" />
        </g>
      ))}
    </g>
  );
}

/** Monitor LCD de los 2000 con un pez saltando fuera de la pantalla. */
export function Monitor({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#drop)">
      <ellipse cx="4" cy="4" rx="80" ry="12" fill="#1f6e0e" opacity=".35" filter="url(#soft)" />
      {/* Pie */}
      <ellipse cx="0" cy="3" rx="58" ry="11" fill="#7f95aa" />
      <ellipse cx="0" cy="0" rx="58" ry="11" fill="url(#silver)" stroke="#8aa0b4" />
      <ellipse cx="0" cy="-3" rx="16" ry="3.5" fill="#000" opacity=".2" />
      <path d="M-14-4H14L9-44H-9Z" fill="url(#silver)" stroke="#8aa0b4" />
      {/* Gabinete: lateral en perspectiva + marco negro brillante con borde plateado */}
      <path d="M105-186 116-178V-46L105-40Z" fill="#0b1016" />
      <rect x="-106" y="-192" width="212" height="152" rx="9" fill="url(#bezel)" stroke="#c9d6e2" strokeWidth="3" />
      <rect x="-94" y="-181" width="188" height="122" rx="2" fill="url(#screen)" />
      <rect x="-94" y="-181" width="188" height="122" rx="2" fill="none" stroke="#000" strokeOpacity=".45" strokeWidth="3" />
      {/* Escena en la pantalla */}
      <circle cx="-58" cy="-156" r="12" fill="#fff" opacity=".9" />
      <path d="M-94-112C-70-118-48-106-24-112S20-118 44-110 80-114 94-112" fill="none" stroke="#fff" strokeWidth="2" opacity=".7" />
      <path d="M-90-90C-70-94-50-86-30-90" fill="none" stroke="#fff" strokeWidth="1.2" opacity=".5" />
      {[[-40, -80, 4], [-30, -94, 2.5], [20, -76, 3.5]].map(([cx, cy, r]) => (
        <circle key={cx} cx={cx} cy={cy} r={r} fill="none" stroke="#fff" strokeOpacity=".8" />
      ))}
      <path d="M-94-181H20L-94-90Z" fill="url(#glare)" />
      {/* Mentón plateado con LED */}
      <rect x="-106" y="-58" width="212" height="18" rx="4" fill="url(#silver)" />
      <circle cx="88" cy="-49" r="3" fill="#3cf03c" />
      <circle cx="88" cy="-49" r="6" fill="#3cf03c" opacity=".35" />
      <path d="M-100-190H100" stroke="#fff" strokeOpacity=".45" strokeWidth="2" />
      {/* Salpicadura y pez saltando (hacia la izquierda, cabeza arriba) */}
      <g transform="scale(-1 1)">
        <g className={styles.jump}>
          <path d="M10-160C20-214 80-262 140-246C118-236 96-222 86-196C74-176 40-160 10-160Z" fill="url(#water)" stroke="#fff" strokeOpacity=".8" strokeWidth="1.5" />
          <path d="M-10-168C-30-188-40-206-34-222C-26-200-14-186 4-178Z" fill="url(#water)" stroke="#fff" strokeOpacity=".7" />
          <path d="M30-172C46-206 86-236 128-238" fill="none" stroke="#fff" strokeWidth="2.5" opacity=".85" />
          <BlueTang x={124} y={-262} s={1.15} r={-32} flip />
          {[[186, -276, 6], [172, -300, 4], [60, -236, 5], [200, -236, 3.5], [36, -214, 3.5], [-40, -232, 4], [-24, -250, 2.5], [150, -212, 3]].map(([cx, cy, r]) => (
            <g key={cx}>
              <circle cx={cx} cy={cy} r={r} fill="#8fe6ff" stroke="#fff" strokeOpacity=".9" />
              <circle cx={cx - r * 0.35} cy={cy - r * 0.35} r={r * 0.3} fill="#fff" />
            </g>
          ))}
        </g>
      </g>
    </g>
  );
}

/** CD iridiscente con una nota musical glossy adelante. */
const WEDGES = [
  [0, 40, '#ff9ad5'], [60, 100, '#fff38a'], [120, 160, '#9ff0ff'],
  [180, 220, '#c6ff8a'], [240, 280, '#b8a6ff'], [300, 340, '#9ff0ff'],
];

export function Disc({ x, y, r = 64 }) {
  const pt = (a) => [r * Math.cos((a * Math.PI) / 180), r * Math.sin((a * Math.PI) / 180)];
  return (
    <g transform={`translate(${x} ${y})`} filter="url(#drop)">
      <g className={styles.float}>
        <g transform="rotate(-15)">
          <circle cx="3" cy="4" r={r} fill="#8fa3b8" />
          <circle r={r} fill="url(#disc)" stroke="#8fa3b8" strokeWidth="1.5" />
          <g opacity=".5" filter="url(#soft)">
            {WEDGES.map(([a1, a2, c]) => {
              const [x1, y1] = pt(a1);
              const [x2, y2] = pt(a2);
              return <path key={a1} d={`M0 0L${x1} ${y1}A${r} ${r} 0 0 1 ${x2} ${y2}Z`} fill={c} />;
            })}
          </g>
          <circle r={r * 0.36} fill="none" stroke="#fff" strokeOpacity=".8" />
          <circle r={r * 0.27} fill="#e9eff5" stroke="#9fb0c2" />
          <circle r={r * 0.1} fill="#4aa3f2" stroke="#8fa3b8" />
          <path d={`M${-r * 0.8} ${-r * 0.3}A${r * 0.85} ${r * 0.85} 0 0 1 ${-r * 0.2} ${-r * 0.82}`} fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".85" />
        </g>
        {/* Nota musical (dos corcheas unidas) */}
        <g transform={`translate(${r * 0.55} ${r * 0.35})`} stroke="#0a3f8a" strokeWidth="1.5" strokeLinejoin="round">
          <path d="M-10-32 30-42V-28L-10-18Z" fill="url(#note)" />
          <rect x="-12" y="-30" width="6" height="54" fill="url(#note)" />
          <rect x="24" y="-40" width="6" height="54" fill="url(#note)" />
          <ellipse cx="-19" cy="24" rx="12" ry="8.5" transform="rotate(-20 -19 24)" fill="url(#note)" />
          <ellipse cx="17" cy="14" rx="12" ry="8.5" transform="rotate(-20 17 14)" fill="url(#note)" />
          <ellipse cx="-22" cy="20" rx="5" ry="2.5" transform="rotate(-20 -22 20)" fill="#fff" stroke="none" opacity=".8" />
          <ellipse cx="14" cy="10" rx="5" ry="2.5" transform="rotate(-20 14 10)" fill="#fff" stroke="none" opacity=".8" />
        </g>
      </g>
    </g>
  );
}

/** Reproductor MP3 plateado con pantalla azul, rueda y auriculares. */
export function Mp3Player({ x, y }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(12)`} filter="url(#drop)">
      <path d="M-6 38C-10 52-26 54-30 44M6 38C12 50 26 56 32 46" fill="none" stroke="#fff" strokeWidth="2" />
      <ellipse cx="-31" cy="42" rx="5" ry="6" fill="#fff" stroke="#9fb3c6" />
      <ellipse cx="33" cy="44" rx="5" ry="6" fill="#fff" stroke="#9fb3c6" />
      <rect x="-19" y="-37" width="44" height="80" rx="9" fill="#7f95aa" />
      <rect x="-22" y="-40" width="44" height="80" rx="9" fill="url(#silver)" stroke="#7f95aa" strokeWidth="1.5" />
      <rect x="-16" y="-33" width="32" height="26" rx="2" fill="url(#lcd)" stroke="#3a6a8f" />
      {[-11, -6, -1, 4, 9].map((bx, i) => (
        <rect key={bx} x={bx} y={-13 - [8, 13, 6, 11, 4][i]} width="3" height={[8, 13, 6, 11, 4][i]} fill="#fff" opacity=".9" />
      ))}
      <circle cy="18" r="14" fill="#eef3f7" stroke="#9fb3c6" />
      <circle cy="18" r="5.5" fill="url(#silver)" stroke="#9fb3c6" />
      <path d="M-18-38H18" stroke="#fff" strokeWidth="2" opacity=".8" />
    </g>
  );
}

/** Tira de fotos en perspectiva que se aleja hacia la ciudad. */
const FILM_CURVE = [[300, 1010], [250, 860], [470, 810], [520, 716]];
const FILM_NEAR = 178; // ancho de la tira adelante
const FILM_FAR = 44; // ancho al fondo

const bez = (t) => {
  const u = 1 - t;
  return [0, 1].map(
    (k) => u * u * u * FILM_CURVE[0][k] + 3 * u * u * t * FILM_CURVE[1][k] + 3 * u * t * t * FILM_CURVE[2][k] + t * t * t * FILM_CURVE[3][k],
  );
};
const lerp = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
const pts = (list) => list.map((p) => p.join(',')).join(' ');

// Muestreo por longitud de arco: cada cuadro mide ~0.8 × su ancho, así mantiene la proporción de fotograma.
function filmFrames() {
  const samples = Array.from({ length: 241 }, (_, i) => bez(i / 240));
  const dist = [0];
  for (let i = 1; i < samples.length; i++) {
    dist.push(dist[i - 1] + Math.hypot(samples[i][0] - samples[i - 1][0], samples[i][1] - samples[i - 1][1]));
  }
  const total = dist[dist.length - 1];
  const at = (d) => {
    const i = Math.min(dist.findIndex((v) => v >= d), samples.length - 1);
    return samples[Math.max(i, 0)];
  };
  const width = (d) => FILM_NEAR + (FILM_FAR - FILM_NEAR) * (d / total);

  const frames = [];
  for (let d = 0; d < total - 8; ) {
    const len = Math.min(width(d) * 0.8, total - d);
    frames.push({ pa: at(d), pb: at(d + len), wa: width(d), wb: width(d + len) });
    d += len;
  }
  return frames;
}
const FRAMES = filmFrames();

export function FilmStrip() {
  // De atrás hacia adelante, para que los cuadros cercanos tapen a los lejanos.
  const frames = FRAMES.map(({ pa, pb, wa, wb }, i) => {
    const dx = pb[0] - pa[0];
    const dy = pb[1] - pa[1];
    const len = Math.hypot(dx, dy) || 1;
    const [nx, ny] = [-dy / len, dx / len];
    const across = (p, w, k) => [p[0] + nx * w * k, p[1] + ny * w * k];
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    const outer = [across(pa, wa, 0.5), across(pb, wb, 0.5), across(pb, wb, -0.5), across(pa, wa, -0.5)];
    const qa = lerp(pa, pb, 0.06);
    const qb = lerp(pa, pb, 0.94);
    const photo = [across(qa, wa, 0.31), across(qb, wb, 0.31), across(qb, wb, -0.31), across(qa, wa, -0.31)];
    const sun = across(lerp(pa, pb, 0.7), (wa + wb) / 2, 0.14);

    const holes = [];
    for (const side of [0.405, -0.405]) {
      for (const k of [0.15, 0.38, 0.62, 0.85]) {
        const w = wa + (wb - wa) * k;
        const [hx, hy] = across(lerp(pa, pb, k), w, side);
        const size = w * 0.04;
        holes.push(
          <rect
            key={`${side}${k}`}
            x={-size}
            y={-size * 0.75}
            width={size * 2}
            height={size * 1.5}
            rx="1"
            fill="#2a6fd6"
            transform={`translate(${hx} ${hy}) rotate(${angle})`}
          />,
        );
      }
    }

    return (
      <g key={i}>
        <polygon points={pts(outer)} fill="#eef7ff" stroke="#2a5fa8" strokeWidth="1.5" strokeLinejoin="round" />
        <polygon points={pts(photo)} fill={`url(#film${i % 3})`} stroke="#1a3f7a" />
        <circle cx={sun[0]} cy={sun[1]} r={(wa + wb) * 0.03} fill="#fff" opacity=".85" />
        <polygon points={pts([outer[0], outer[1], lerp(outer[1], outer[2], 0.5), lerp(outer[0], outer[3], 0.5)])} fill="#fff" opacity=".18" />
        {holes}
      </g>
    );
  });
  return <g filter="url(#drop)">{frames.reverse()}</g>;
}
