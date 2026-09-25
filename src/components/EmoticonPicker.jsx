import { useEffect, useId, useRef, useState } from 'react';
import Emoticon, { EMOTICONS } from './Emoticon.jsx';
import { useDismiss } from '../hooks/useDismiss.js';
import styles from './EmoticonPicker.module.css';

/** Botón + panel de emoticones. Llama a onPick(código) y se cierra. */
export default function EmoticonPicker({ onPick }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const panelId = useId();

  useDismiss(open, () => setOpen(false), [triggerRef, panelRef]);

  // Al abrir, el foco pasa al primer emoticón para poder elegir con teclado.
  useEffect(() => {
    if (open) panelRef.current?.querySelector('button')?.focus();
  }, [open]);

  return (
    <div className={styles.wrap}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <Emoticon code=":)" size={20} decorative />
        <span>Emoticones</span>
      </button>

      {open && (
        <div ref={panelRef} id={panelId} className={styles.panel} role="group" aria-label="Elegí un emoticón">
          {EMOTICONS.map((e) => (
            <button
              key={e.code}
              type="button"
              className={styles.item}
              title={e.code}
              aria-label={`${e.label} ${e.code}`}
              onClick={() => {
                onPick(e.code);
                setOpen(false);
              }}
            >
              <Emoticon code={e.code} size={26} decorative />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
