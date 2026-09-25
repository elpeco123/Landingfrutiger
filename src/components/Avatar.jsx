import { useId } from 'react';
import { STATUSES } from '../data/mockData.js';
import styles from './Avatar.module.css';

// useId devuelve caracteres (":", "«") que rompen url(#id) en SVG: los limpiamos.
export function useSvgId() {
  return 'svg' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
}

const DEFAULT_COLOR = '#27c1d6';

/** "#rrggbb" → [h, s, l]. Colores inválidos caen en el aqua por defecto. */
function hexToHsl(hex) {
  const n = parseInt(/^#[0-9a-f]{6}$/i.test(hex) ? hex.slice(1) : DEFAULT_COLOR.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (!d) return [0, 0, l * 100];
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h *= 60;
  return [h < 0 ? h + 360 : h, s * 100, l * 100];
}

const hsl = (h, s, l) => `hsl(${(h + 360) % 360} ${s}% ${l}%)`;

/**
 * Foto de perfil: personaje glossy (cabeza esférica + cuerpo) cuyo color elige el usuario.
 * El cuerpo vira hacia otro tono abajo, como el vidrio aqua→verde de la época.
 * El marco toma el color del estado.
 */
export default function Avatar({ user, size = 48, showStatus = true, decorative = false }) {
  const id = useSvgId();
  const [h, s] = hexToHsl(user.avatar?.color ?? DEFAULT_COLOR);
  const sat = Math.max(s, 8);

  return (
    <span
      className={styles.frame}
      data-status={showStatus ? user.status : undefined}
      style={{ '--size': `${size}px` }}
    >
      <svg
        viewBox="0 0 64 64"
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : `Foto de ${user.name}`}
        aria-hidden={decorative || undefined}
      >
        <defs>
          <radialGradient id={`${id}bg`} cx="78%" cy="12%" r="110%">
            <stop offset="0" stopColor={hsl(h, Math.min(sat, 55), 36)} />
            <stop offset="1" stopColor={hsl(h, Math.min(sat, 60), 12)} />
          </radialGradient>
          <radialGradient id={`${id}head`} cx="38%" cy="28%" r="78%">
            <stop offset="0" stopColor={hsl(h, sat, 90)} />
            <stop offset=".5" stopColor={hsl(h, sat, 60)} />
            <stop offset="1" stopColor={hsl(h, sat, 36)} />
          </radialGradient>
          <linearGradient id={`${id}body`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={hsl(h, sat, 66)} />
            <stop offset=".65" stopColor={hsl(h - 45, sat, 56)} />
            <stop offset="1" stopColor={hsl(h - 45, sat, 34)} />
          </linearGradient>
        </defs>

        {/* Fondo oscuro con estela de luz */}
        <rect width="64" height="64" fill={`url(#${id}bg)`} />
        <path d="M18 0C32 11 48 9 64 2V11C47 19 29 16 18 0Z" fill="#fff" opacity=".14" />
        <path d="M26 0C38 13 53 13 64 8M34 0C44 9 55 9 64 5" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth=".8" />

        {/* Cuerpo */}
        <path
          d="M13 60C13 44 21 37 32 37C43 37 51 44 51 60C51 63 49 64 46 64H18C15 64 13 63 13 60Z"
          fill={`url(#${id}body)`}
        />
        <path d="M18.5 47C20.5 41 25.5 39.5 32 39.5C38.5 39.5 43.5 41 45.5 47C40 44.3 24 44.3 18.5 47Z" fill="#fff" opacity=".55" />

        {/* Cabeza */}
        <ellipse cx="32" cy="35.5" rx="9" ry="2" fill="#000" opacity=".22" />
        <circle cx="32" cy="22" r="12.5" fill={`url(#${id}head)`} />
        <ellipse cx="29" cy="15.5" rx="7.5" ry="4.3" fill="#fff" opacity=".75" />
        <path d="M22.5 27A11 11 0 0 0 41.5 27" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1" />
      </svg>
    </span>
  );
}

/** Punto de estado: además del color, cada estado tiene su forma (no depende solo del color). */
export function StatusDot({ status }) {
  return (
    <svg className={styles.dot} data-status={status} viewBox="0 0 12 12" aria-hidden="true">
      <circle cx="6" cy="6" r="5" />
      {status === 'away' && <path d="M6 3.2V6.2L7.8 7.4" className={styles.mark} />}
      {status === 'busy' && <path d="M3.4 6H8.6" className={styles.mark} />}
      {status !== 'offline' && <ellipse cx="6" cy="4" rx="3" ry="1.6" fill="#fff" opacity=".55" />}
    </svg>
  );
}

/** Opciones de estado para AeroSelect (cada una con su StatusDot). */
export const STATUS_OPTIONS = Object.entries(STATUSES).map(([value, s]) => ({
  value,
  label: s.label,
  icon: <StatusDot status={value} />,
}));
