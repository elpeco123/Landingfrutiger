import { useRef, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { STATUSES } from '../data/mockData.js';
import { useDismiss } from '../hooks/useDismiss.js';
import { useNow } from '../hooks/useNow.js';
import Avatar, { StatusDot, useSvgId } from './Avatar.jsx';
import styles from './Taskbar.module.css';

/** Orbe de inicio original: esfera de agua con un pez tropical glossy adentro. */
export function Orb({ size = 44 }) {
  const id = useSvgId();
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}b`} cx="50%" cy="38%" r="62%">
          <stop offset="0" stopColor="#e9fdff" />
          <stop offset=".45" stopColor="#4fd2e6" />
          <stop offset=".8" stopColor="#0e8fc4" />
          <stop offset="1" stopColor="#07507a" />
        </radialGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset=".45" stopColor="#ff9a2e" />
          <stop offset="1" stopColor="#e0561a" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill={`url(#${id}b)`} stroke="#063a5a" strokeWidth="1.5" />
      {/* Burbujitas */}
      <circle cx="46" cy="22" r="2.4" fill="#fff" fillOpacity=".25" stroke="#fff" strokeOpacity=".9" />
      <circle cx="49.5" cy="15.5" r="1.5" fill="#fff" fillOpacity=".25" stroke="#fff" strokeOpacity=".9" />
      {/* Pez: cola, aletas, cuerpo, franja, ojo */}
      <path d="M17 35 8 26.5Q11 35 8 43.5Z" fill="#ff9a2e" stroke="#b8400f" strokeWidth="1" strokeLinejoin="round" />
      <path d="M25 28Q29 19.5 37 26" fill="#ffb347" stroke="#b8400f" strokeWidth="1" />
      <path d="M28 41Q30 47 35 43" fill="#ffb347" stroke="#b8400f" strokeWidth="1" />
      <path d="M16.5 35C21 25.5 34 23.5 43 31C46 33.5 46 36.5 43 39C34 46.5 21 44.5 16.5 35Z" fill={`url(#${id}f)`} stroke="#b8400f" strokeWidth="1" />
      <path d="M30 25.6Q27 35 30 44.4" fill="none" stroke="#fff" strokeWidth="2.6" />
      <path d="M22 28.6Q20 35 22 41.4" fill="none" stroke="#fff" strokeWidth="1.8" opacity=".85" />
      <circle cx="38.5" cy="32.5" r="2.4" fill="#fff" />
      <circle cx="39" cy="32.8" r="1.3" fill="#0b2545" />
      <ellipse cx="31" cy="29" rx="9" ry="2.6" fill="#fff" opacity=".55" />
      {/* Vidrio de la esfera */}
      <ellipse cx="32" cy="17" rx="21" ry="11" fill={`url(#${id}g)`} opacity=".8" />
      <path d="M12 42a22 22 0 0 0 40 0" fill="none" stroke="#bff3fa" strokeOpacity=".7" strokeWidth="2" />
    </svg>
  );
}

const icon = (d) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={d} />
  </svg>
);

// Secciones navegables: las usa la barra de tareas y la navegación inferior en mobile.
export const NAV_ITEMS = [
  { tab: 'feed', target: 'inicio', label: 'Inicio', icon: icon('M3 11 12 3l9 8M5 9.5V21h5v-6h4v6h5V9.5') },
  {
    tab: 'contacts',
    target: 'contactos',
    label: 'Contactos',
    icon: icon('M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2.5 20c0-4 3-6 6.5-6s6.5 2 6.5 6M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14c2 .6 3.5 2.5 3.5 6'),
  },
  {
    tab: 'profile',
    target: 'perfil',
    label: 'Perfil',
    icon: icon('M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM4 21c0-4.5 3.5-7 8-7s8 2.5 8 7'),
  },
  {
    tab: 'gadgets',
    target: 'gadgets',
    label: 'Gadgets',
    icon: icon('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2'),
  },
];

/** Barra de tareas de vidrio: orbe con menú Inicio, ventanas, usuario activo y reloj. */
export default function Taskbar({ tab, onNavigate }) {
  const { currentUser, actions } = useApp();
  const now = useNow(15_000);
  const [menuOpen, setMenuOpen] = useState(false);
  const orbRef = useRef(null);
  const menuRef = useRef(null);

  useDismiss(menuOpen, () => setMenuOpen(false), [orbRef, menuRef]);

  const go = (next) => {
    setMenuOpen(false);
    onNavigate(next);
  };

  const reset = () => {
    if (window.confirm('¿Restablecer los datos de prueba? Se perderán los posts y cambios de esta demo.')) {
      actions.reset();
      setMenuOpen(false);
    }
  };

  return (
    <header className={styles.taskbar}>
      <div className={styles.startWrap}>
        <button
          ref={orbRef}
          type="button"
          className={styles.orb}
          aria-label="Menú Inicio"
          aria-expanded={menuOpen}
          aria-controls="start-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <Orb />
        </button>

        {menuOpen && (
          <div ref={menuRef} id="start-menu" className={styles.menu}>
            <div className={styles.menuHead}>
              <Avatar user={currentUser} size={48} />
              <div>
                <strong>{currentUser.name}</strong>
                <span className={styles.menuStatus}>
                  <StatusDot status={currentUser.status} /> {STATUSES[currentUser.status].label}
                </span>
              </div>
            </div>
            <ul className={styles.menuList}>
              {NAV_ITEMS.map((item) => (
                <li key={item.tab}>
                  <button type="button" className={styles.menuItem} onClick={() => go(item.tab)}>
                    {item.icon}
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className={styles.menuFoot}>
              <button type="button" className={styles.footBtn} onClick={reset}>
                Restablecer demo
              </button>
              <button type="button" className={`${styles.footBtn} ${styles.logout}`} onClick={actions.logout}>
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>

      <span className={styles.brand}>Pecows</span>

      <nav className={styles.tasks} aria-label="Ventanas">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.tab}
            type="button"
            className={styles.task}
            aria-current={tab === item.tab ? 'true' : undefined}
            onClick={() => onNavigate(item.tab)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className={styles.tray}>
        <span className={styles.me}>
          <Avatar user={currentUser} size={28} decorative />
          <span className={styles.meName}>{currentUser.name}</span>
        </span>
        <time className={styles.clock} dateTime={now.toISOString()}>
          <span>{now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
          <span className={styles.date}>
            {now.toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: '2-digit' })}
          </span>
        </time>
      </div>
    </header>
  );
}
