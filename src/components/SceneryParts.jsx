import styles from './Scenery.module.css';
import baseUrl from '../assets/scene/base.webp';
import bluetangUrl from '../assets/scene/bluetang.webp';
import cdUrl from '../assets/scene/cd.webp';
import cityUrl from '../assets/scene/city.webp';
import clownfishUrl from '../assets/scene/clownfish.webp';
import monitorUrl from '../assets/scene/monitor.webp';
import mp3Url from '../assets/scene/mp3.webp';
import yellowtangUrl from '../assets/scene/yellowtang.webp';

// Piezas del fondo hechas con fotos reales recortadas (ver créditos en el README) + detalles
// Frutiger Aero en SVG (agua, salpicadura, brillos, burbujas). Se dibujan dentro de los <svg> de Scenery.

const WATER_TOP = 'M690 900C750 832 860 800 960 804C1080 810 1160 770 1280 774C1360 777 1410 768 1440 764';

export function PartsDefs() {
  return (
    <>
      <linearGradient id="screen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1c63e6" />
        <stop offset=".5" stopColor="#8fd8ff" />
        <stop offset=".51" stopColor="#27b4e6" />
        <stop offset="1" stopColor="#0a4f9e" />
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
      <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".35" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="note" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8ff0ff" />
        <stop offset=".55" stopColor="#1a8fe6" />
        <stop offset="1" stopColor="#0a4fb0" />
      </linearGradient>
      <linearGradient id="filmSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1c63e6" />
        <stop offset="1" stopColor="#c4ecff" />
      </linearGradient>
      {/* Fotos dentro de los cuadros de la tira de película */}
      <pattern id="film0" patternContentUnits="objectBoundingBox" width="1" height="1">
        <image href={baseUrl} width="1" height="1" preserveAspectRatio="xMidYMid slice" />
      </pattern>
      <pattern id="film1" patternContentUnits="objectBoundingBox" width="1" height="1">
        <rect width="1" height="1" fill="url(#filmSky)" />
        <image href={cityUrl} y=".15" width="1" height=".85" preserveAspectRatio="xMidYMax meet" />
      </pattern>
      <pattern id="film2" patternContentUnits="objectBoundingBox" width="1" height="1">
        <rect width="1" height="1" fill="url(#water)" />
        <image href={clownfishUrl} x=".1" y=".2" width=".8" height=".6" preserveAspectRatio="xMidYMid meet" />
      </pattern>
      {/* Sombras proyectadas */}
      <filter id="fishShadow" x="-30%" y="-30%" width="160%" height="180%">
        <feDropShadow dx="3" dy="7" stdDeviation="4" floodColor="#032a55" floodOpacity=".45" />
      </filter>
      <filter id="drop" x="-30%" y="-30%" width="160%" height="170%">
        <feDropShadow dx="5" dy="10" stdDeviation="7" floodColor="#0a2a5a" floodOpacity=".38" />
      </filter>
      <clipPath id="waterClip">
        <path d={`${WATER_TOP}V900Z`} />
      </clipPath>
      <clipPath id="monitorScreen">
        <rect x="28" y="26" width="564" height="406" />
      </clipPath>
    </>
  );
}

/** Foto recortada con sombra; `w` fija el ancho y el alto sale de la proporción real. */
function Photo({ href, x, y, w, ratio, flip = false, className, delay = 0 }) {
  const h = w / ratio;
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={className} style={delay ? { animationDelay: `${delay}s` } : undefined}>
        <image
          href={href}
          x={-w / 2}
          y={-h / 2}
          width={w}
          height={h}
          filter="url(#fishShadow)"
          transform={flip ? 'scale(-1 1)' : undefined}
        />
      </g>
    </g>
  );
}

/** Agua del frente con peces reales, haces de luz, cáusticas y burbujitas. */
export function Water() {
  return (
    <g>
      <path d={`${WATER_TOP}V900Z`} fill="url(#water)" />
      <g opacity=".7" clipPath="url(#waterClip)">
        {[[860, 60], [1010, 80], [1190, 70], [1340, 60]].map(([bx, w]) => (
          <polygon key={bx} points={`${bx},760 ${bx + w},760 ${bx + w * 1.6},900 ${bx + w * 0.4},900`} fill="url(#beam)" />
        ))}
      </g>
      <path d="M800 880C830 872 850 888 880 878S930 870 960 882M1040 890C1070 880 1100 896 1130 884S1190 878 1220 890M1260 870C1290 862 1320 878 1350 868S1400 862 1440 872" fill="none" stroke="#e6fdff" strokeWidth="1.5" opacity=".45" />
      <g clipPath="url(#waterClip)">
        <Photo href={clownfishUrl} x={1150} y={846} w={176} ratio={520 / 288} className={styles.swim} />
        <Photo href={clownfishUrl} x={970} y={872} w={96} ratio={520 / 288} className={styles.swim} delay={1.2} />
        <Photo href={yellowtangUrl} x={1345} y={846} w={122} ratio={440 / 355} className={styles.swim} delay={0.6} />
      </g>
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

/**
 * Monitor LCD real (foto recortada, sin logo) con una escena de agua en la pantalla
 * y un pez cirujano azul (foto) saltando afuera con salpicadura.
 * x, y: esquina superior izquierda; s: escala sobre la foto de 620×622.
 */
export function PhotoMonitor({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="320" cy="618" rx="260" ry="26" fill="#0f4a06" opacity=".35" filter="url(#soft)" />
      <image href={monitorUrl} width="620" height="622" filter="url(#drop)" />
      {/* Pantalla encendida */}
      <g clipPath="url(#monitorScreen)">
        <rect x="28" y="26" width="564" height="406" fill="url(#screen)" />
        <circle cx="130" cy="92" r="34" fill="#fff" opacity=".9" />
        <path d="M28 232C100 214 170 250 240 232S380 214 450 238 560 226 592 232" fill="none" stroke="#fff" strokeWidth="5" opacity=".7" />
        <path d="M40 300C100 288 160 312 220 300" fill="none" stroke="#fff" strokeWidth="3" opacity=".5" />
        {[[180, 360, 12], [210, 320, 7], [360, 380, 10]].map(([cx, cy, r]) => (
          <circle key={cx} cx={cx} cy={cy} r={r} fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="2" />
        ))}
        <path d="M28 26H340L28 300Z" fill="url(#glare)" />
      </g>
      {/* Salpicadura y pez saltando fuera de la pantalla (espejado: sale hacia la izquierda) */}
      <g transform="translate(620 0) scale(-1 1)">
      <g className={styles.jump}>
        <path d="M380 40C410-60 520-150 640-120C590-100 540-70 520-20C500 20 440 44 380 40Z" fill="url(#water)" stroke="#fff" strokeOpacity=".8" strokeWidth="3" />
        <path d="M430 20C460-50 530-110 610-116" fill="none" stroke="#fff" strokeWidth="6" opacity=".85" />
        <path d="M330 34C300-10 290-50 300-90C318-40 340-10 372 14Z" fill="url(#water)" stroke="#fff" strokeOpacity=".7" strokeWidth="2" />
        <g transform="translate(610 -150) rotate(-28)">
          <image href={bluetangUrl} x="-170" y="-103" width="340" height="206" filter="url(#fishShadow)" />
        </g>
        {[[760, -200, 14], [730, -250, 9], [470, -110, 12], [800, -120, 8], [420, -60, 9], [300, -130, 10], [330, -170, 6]].map(([cx, cy, r]) => (
          <g key={cx}>
            <circle cx={cx} cy={cy} r={r} fill="#8fe6ff" stroke="#fff" strokeOpacity=".9" strokeWidth="2" />
            <circle cx={cx - r * 0.35} cy={cy - r * 0.35} r={r * 0.3} fill="#fff" />
          </g>
        ))}
      </g>
      </g>
    </g>
  );
}

/** CD real (foto recortada en círculo) con aro, brillo y una nota musical glossy. */
export function PhotoDisc({ x, y, r = 60 }) {
  return (
    <g transform={`translate(${x} ${y})`} filter="url(#drop)">
      <g className={styles.float}>
        <image href={cdUrl} x={-r} y={-r} width={r * 2} height={r * 2} />
        <circle r={r - 0.5} fill="none" stroke="#dfe8f1" strokeWidth="1.5" />
        <path d={`M${-r * 0.8} ${-r * 0.3}A${r * 0.85} ${r * 0.85} 0 0 1 ${-r * 0.2} ${-r * 0.82}`} fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".7" />
        <g transform={`translate(${r * 0.62} ${r * 0.4})`} stroke="#0a3f8a" strokeWidth="1.5" strokeLinejoin="round">
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

/** Reproductor MP3 con auriculares (foto recortada). Centro en x, y. */
export function PhotoMp3({ x, y, w = 110 }) {
  const h = w / (420 / 158);
  return (
    <g transform={`translate(${x} ${y}) rotate(-14)`} filter="url(#drop)">
      <image href={mp3Url} x={-w / 2} y={-h / 2} width={w} height={h} />
    </g>
  );
}

/** Tira de película en perspectiva que se aleja hacia la ciudad, con fotos reales en los cuadros. */
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
  const at = (d) => samples[Math.max(0, Math.min(dist.findIndex((v) => v >= d), samples.length - 1))];
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
        <polygon points={pts([outer[0], outer[1], lerp(outer[1], outer[2], 0.5), lerp(outer[0], outer[3], 0.5)])} fill="#fff" opacity=".18" />
        {holes}
      </g>
    );
  });
  // De atrás hacia adelante, para que los cuadros cercanos tapen a los lejanos.
  return <g filter="url(#drop)">{frames.reverse()}</g>;
}
