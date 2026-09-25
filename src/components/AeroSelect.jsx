import { useEffect, useId, useRef, useState } from 'react';
import { useDismiss } from '../hooks/useDismiss.js';
import styles from './AeroSelect.module.css';

/**
 * Desplegable estilo Aero que reemplaza al <select> nativo.
 * Sigue el patrón "listbox" accesible: el botón abre la lista, las flechas/Inicio/Fin
 * mueven la opción activa, Enter o Espacio eligen y Escape cierra devolviendo el foco.
 *
 * options: [{ value, label, icon? }]
 */
export default function AeroSelect({ label, value, options, onChange, hideLabel = false, compact = false, grow = false }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const id = useId();
  const selected = options.find((o) => o.value === value) ?? options[0];

  useDismiss(open, () => setOpen(false), [buttonRef, listRef]);

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  const openList = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  const choose = (i) => {
    onChange(options[i].value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onButtonKey = (e) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
      openList();
    }
  };

  // Escape lo maneja useDismiss (cierra y devuelve el foco al botón).
  const onListKey = (e) => {
    const last = options.length - 1;
    const moves = { ArrowDown: Math.min(active + 1, last), ArrowUp: Math.max(active - 1, 0), Home: 0, End: last };
    if (e.key in moves) {
      e.preventDefault();
      setActive(moves[e.key]);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      choose(active);
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  const classes = [styles.wrap, compact && styles.compact, grow && styles.grow].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <span id={`${id}-label`} className={hideLabel ? 'sr-only' : styles.label}>
        {label}
      </span>
      <div className={styles.field}>
        <button
          ref={buttonRef}
          id={`${id}-button`}
          type="button"
          className={styles.button}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={`${id}-label ${id}-button`}
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={onButtonKey}
        >
          {selected.icon}
          <span className={styles.value}>{selected.label}</span>
          <span className={styles.chevron} aria-hidden="true">
            <svg viewBox="0 0 10 6">
              <path d="M1 1l4 4 4-4" />
            </svg>
          </span>
        </button>

        {open && (
          <ul
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={`${id}-label`}
            aria-activedescendant={`${id}-opt-${active}`}
            className={styles.list}
            onKeyDown={onListKey}
          >
            {options.map((o, i) => (
              <li
                key={o.value}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={o.value === value}
                className={`${styles.option} ${i === active ? styles.active : ''}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(i)}
              >
                {o.icon}
                <span>{o.label}</span>
                {o.value === value && (
                  <svg className={styles.check} viewBox="0 0 12 10" aria-hidden="true">
                    <path d="M1 5l3.5 3.5L11 1" />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
