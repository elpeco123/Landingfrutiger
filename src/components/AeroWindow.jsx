import { useEffect, useId, useState } from 'react';
import styles from './AeroWindow.module.css';

/**
 * Ventana de vidrio Aero reutilizable: barra de título con brillo y botones
 * minimizar (pliega el contenido), maximizar (pantalla completa, Escape restaura)
 * y cerrar (la reemplaza por una píldora para reabrirla).
 * `shake`: cada vez que el número cambia, la ventana se sacude (zumbido).
 */
export default function AeroWindow({ id, title, icon, children, shake = 0, closable = true, className = '' }) {
  const titleId = useId();
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [closed, setClosed] = useState(false);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (!shake) return;
    setShaking(true);
    const t = setTimeout(() => setShaking(false), 650);
    return () => clearTimeout(t);
  }, [shake]);

  useEffect(() => {
    if (!maximized) return;
    const onKey = (e) => e.key === 'Escape' && setMaximized(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [maximized]);

  if (closed) {
    return (
      <section id={id} aria-label={title}>
        <button type="button" className={`btn-pill btn-secondary ${styles.reopen}`} onClick={() => setClosed(false)}>
          Abrir «{title}»
        </button>
      </section>
    );
  }

  const classes = [styles.window, maximized && styles.maximized, shaking && styles.shake, className];

  return (
    <section id={id} aria-labelledby={titleId} className={classes.filter(Boolean).join(' ')}>
      <header className={styles.titlebar} onDoubleClick={() => setMaximized((m) => !m)}>
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.ctrl}
            onClick={() => setMinimized((m) => !m)}
            aria-label={minimized ? `Restaurar ${title}` : `Minimizar ${title}`}
            aria-expanded={!minimized}
          >
            <svg viewBox="0 0 10 10" aria-hidden="true">
              <path d="M2 7.5h6" />
            </svg>
          </button>
          <button
            type="button"
            className={styles.ctrl}
            onClick={() => setMaximized((m) => !m)}
            aria-label={maximized ? `Restaurar tamaño de ${title}` : `Maximizar ${title}`}
            aria-pressed={maximized}
          >
            <svg viewBox="0 0 10 10" aria-hidden="true">
              <rect x="2" y="2" width="6" height="6" />
            </svg>
          </button>
          {closable && (
            <button
              type="button"
              className={`${styles.ctrl} ${styles.close}`}
              onClick={() => setClosed(true)}
              aria-label={`Cerrar ${title}`}
            >
              <svg viewBox="0 0 10 10" aria-hidden="true">
                <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" />
              </svg>
            </button>
          )}
        </div>
      </header>
      {!minimized && <div className={styles.body}>{children}</div>}
    </section>
  );
}
