import { useNow } from '../hooks/useNow.js';
import { useSvgId } from './Avatar.jsx';
import styles from './Gadgets.module.css';

/** Gadgets de la barra lateral: reloj analógico y clima (ficticio). */
export default function Gadgets() {
  return (
    <section id="gadgets" className={styles.gadgets} aria-label="Gadgets">
      <Clock />
      <Weather />
    </section>
  );
}

function Clock() {
  const now = useNow(1000);
  const id = useSvgId();
  const sec = now.getSeconds();
  const min = now.getMinutes() + sec / 60;
  const hour = (now.getHours() % 12) + min / 60;
  const time = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`${styles.gadget} ${styles.clockGadget}`}>
      <svg className={styles.clock} viewBox="0 0 120 120" role="img" aria-label={`Reloj: son las ${time}`}>
        <defs>
          <linearGradient id={`${id}rim`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".5" stopColor="#9fb7c9" />
            <stop offset="1" stopColor="#e6f0f7" />
          </linearGradient>
          <radialGradient id={`${id}face`} cx="50%" cy="40%" r="60%">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#d5eefb" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="57" fill={`url(#${id}rim)`} stroke="#5b7c96" />
        <circle cx="60" cy="60" r="49" fill={`url(#${id}face)`} stroke="#8fb2cc" />
        {Array.from({ length: 12 }, (_, i) => (
          <line
            key={i}
            x1="60"
            y1={i % 3 === 0 ? 15 : 17}
            x2="60"
            y2="22"
            stroke="#0b2545"
            strokeWidth={i % 3 === 0 ? 3 : 1.5}
            strokeLinecap="round"
            transform={`rotate(${i * 30} 60 60)`}
          />
        ))}
        <line x1="60" y1="60" x2="60" y2="34" stroke="#0b2545" strokeWidth="4" strokeLinecap="round" transform={`rotate(${hour * 30} 60 60)`} />
        <line x1="60" y1="60" x2="60" y2="24" stroke="#0b2545" strokeWidth="3" strokeLinecap="round" transform={`rotate(${min * 6} 60 60)`} />
        <line x1="60" y1="68" x2="60" y2="20" stroke="#0a9fc0" strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${sec * 6} 60 60)`} />
        <circle cx="60" cy="60" r="4" fill="#0a9fc0" stroke="#fff" />
        {/* Reflejo de vidrio */}
        <path d="M18 52 A43 43 0 0 1 102 52 Q60 40 18 52Z" fill="#fff" opacity=".55" />
      </svg>
      <div>
        <p className={styles.big}>{time}</p>
        <p className={styles.small}>
          {now.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>
    </div>
  );
}

// Pronóstico inventado para una ciudad inventada.
const FORECAST = [
  { kind: 'sun', max: 26, min: 17, text: 'Soleado' },
  { kind: 'cloud', max: 22, min: 15, text: 'Nublado' },
  { kind: 'rain', max: 19, min: 13, text: 'Lluvia' },
];

function Weather() {
  const today = new Date();
  const day = (offset) =>
    new Date(today.getTime() + offset * 86_400_000).toLocaleDateString('es-AR', { weekday: 'short' });

  return (
    <div className={styles.gadget}>
      <div className={styles.now}>
        <WeatherIcon kind="partly" size={64} />
        <div>
          <p className={styles.temp}>24°</p>
          <p className={styles.city}>Ciudad Burbuja</p>
          <p className={styles.small}>Mayormente soleado · 60 % humedad</p>
        </div>
      </div>
      <ul className={styles.forecast}>
        {FORECAST.map((f, i) => (
          <li key={i}>
            <span className={styles.day}>{day(i + 1)}</span>
            <WeatherIcon kind={f.kind} size={32} label={f.text} />
            <span>
              {f.max}° <span className={styles.min}>{f.min}°</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const Cloud = ({ x = 0, y = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M18 48h28a10 10 0 0 0 0-20 14 14 0 0 0-27-3 11.5 11.5 0 0 0-1 23z" fill="#fff" stroke="#8fb2cc" strokeWidth="1.5" />
    <path d="M22 30 Q32 22 42 28" fill="none" stroke="#fff" strokeWidth="3" opacity=".9" />
  </g>
);

const Sun = ({ x = 32, y = 32, r = 11 }) => (
  <g>
    {Array.from({ length: 8 }, (_, i) => (
      <line key={i} x1={x} y1={y - r - 3} x2={x} y2={y - r - 8} stroke="#f2b705" strokeWidth="3" strokeLinecap="round" transform={`rotate(${i * 45} ${x} ${y})`} />
    ))}
    <circle cx={x} cy={y} r={r} fill="#ffd43b" stroke="#e8a200" strokeWidth="1.5" />
    <ellipse cx={x - 3} cy={y - 4} rx={r * 0.55} ry={r * 0.32} fill="#fff" opacity=".6" />
  </g>
);

function WeatherIcon({ kind, size, label }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {kind === 'sun' && <Sun />}
      {kind === 'partly' && (
        <>
          <Sun x={24} y={24} r={10} />
          <Cloud x={2} y={6} />
        </>
      )}
      {kind === 'cloud' && <Cloud y={-4} />}
      {kind === 'rain' && (
        <>
          <Cloud y={-10} />
          {[22, 32, 42].map((x) => (
            <path key={x} d={`M${x} 46 q-3 6 0 8 q3 -2 0 -8z`} fill="#27c1d6" stroke="#0a6e9e" />
          ))}
        </>
      )}
    </svg>
  );
}
