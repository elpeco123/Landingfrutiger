import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { STATUSES } from '../data/mockData.js';
import Avatar, { StatusDot } from './Avatar.jsx';
import { renderWithEmoticons } from './Emoticon.jsx';
import { StatusSelect } from './Profile.jsx';
import styles from './ContactList.module.css';

const BuzzIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M13 2 5 13.5h6L10 22l9-12h-6.5Z" />
  </svg>
);

/** Panel de contactos estilo Messenger: tu estado arriba y los contactos agrupados. */
export default function ContactList() {
  const { state, currentUser, actions } = useApp();
  const others = state.users.filter((u) => u.id !== currentUser.id);

  return (
    <div>
      <div className={styles.me}>
        <Avatar user={currentUser} size={56} />
        <div className={styles.meInfo}>
          <p className={styles.meName}>{currentUser.name}</p>
          <StatusSelect compact />
          <p className={styles.pm}>{renderWithEmoticons(currentUser.personalMessage || 'Sin mensaje personal')}</p>
        </div>
      </div>

      <Group title="Conectados" users={others.filter((u) => u.status !== 'offline')} onBuzz={actions.buzz} />
      <Group title="Desconectados" users={others.filter((u) => u.status === 'offline')} />
    </div>
  );
}

function Group({ title, users, onBuzz }) {
  const [open, setOpen] = useState(true);

  return (
    <section className={styles.group}>
      <h3 className={styles.groupTitle}>
        <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span className={styles.caret} aria-hidden="true">
            ▸
          </span>
          {title} ({users.length})
        </button>
      </h3>
      {open && (
        <ul className={styles.list}>
          {users.map((u) => (
            <li key={u.id} className={styles.contact}>
              <Avatar user={u} size={40} />
              <div className={styles.info}>
                <span className={styles.name}>{u.name}</span>
                <span className={styles.status}>
                  <StatusDot status={u.status} />
                  {STATUSES[u.status].label}
                </span>
                {u.personalMessage && <span className={styles.pm}>{renderWithEmoticons(u.personalMessage)}</span>}
              </div>
              {onBuzz && (
                <button
                  type="button"
                  className={styles.buzz}
                  title="Enviar zumbido"
                  aria-label={`Enviar un zumbido a ${u.name}`}
                  onClick={() => onBuzz(u)}
                >
                  <BuzzIcon />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
