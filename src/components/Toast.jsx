import { useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import Avatar from './Avatar.jsx';
import { renderWithEmoticons } from './Emoticon.jsx';
import styles from './Toast.module.css';

const DURATION = 5000;

/** Notificaciones tipo "toast" abajo a la derecha. Se anuncian a lectores de pantalla. */
export default function Toast() {
  const { state, actions } = useApp();

  return (
    <div className={styles.stack} role="status" aria-live="polite">
      {state.toasts.map((t) => (
        <ToastItem
          key={t.id}
          toast={t}
          user={state.users.find((u) => u.id === t.userId)}
          dismiss={actions.dismissToast}
        />
      ))}
    </div>
  );
}

function ToastItem({ toast, user, dismiss }) {
  useEffect(() => {
    const t = setTimeout(() => dismiss(toast.id), DURATION);
    return () => clearTimeout(t);
  }, [toast.id, dismiss]);

  return (
    <div className={styles.toast}>
      <div className={styles.titlebar}>
        <span>Pecows</span>
        <button type="button" className={styles.close} onClick={() => dismiss(toast.id)} aria-label="Cerrar notificación">
          <svg viewBox="0 0 10 10" aria-hidden="true">
            <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" />
          </svg>
        </button>
      </div>
      <div className={styles.body}>
        {user && <Avatar user={user} size={40} decorative />}
        <p className={styles.text}>{renderWithEmoticons(toast.text)}</p>
      </div>
    </div>
  );
}
