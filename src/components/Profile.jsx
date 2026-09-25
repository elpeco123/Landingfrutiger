import { useId, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { AVATAR_COLORS } from '../data/mockData.js';
import AeroSelect from './AeroSelect.jsx';
import Avatar, { STATUS_OPTIONS } from './Avatar.jsx';
import { renderWithEmoticons } from './Emoticon.jsx';
import PostCard from './PostCard.jsx';
import styles from './Profile.module.css';

/** Selector de estado del usuario activo (también se usa en la lista de contactos). */
export function StatusSelect({ compact = false }) {
  const { currentUser, actions } = useApp();
  return (
    <AeroSelect
      label="Estado"
      hideLabel={compact}
      compact={compact}
      value={currentUser.status}
      options={STATUS_OPTIONS}
      onChange={(status) => actions.updateProfile({ status })}
    />
  );
}

/** Color del avatar: muestras rápidas + selector nativo para cualquier color. */
function AvatarColor() {
  const { currentUser, actions } = useApp();
  const color = (currentUser.avatar?.color ?? '#27c1d6').toLowerCase();
  const pickerId = useId();
  const setColor = (hex) => actions.updateProfile({ avatar: { ...currentUser.avatar, color: hex } });

  return (
    <fieldset className={styles.colors}>
      <legend className={styles.statusLabel}>Color de tu avatar</legend>
      <div className={styles.swatches}>
        {AVATAR_COLORS.map(([hex, name]) => (
          <button
            key={hex}
            type="button"
            className={styles.swatch}
            style={{ '--c': hex }}
            aria-label={name}
            aria-pressed={color === hex}
            onClick={() => setColor(hex)}
          />
        ))}
        <label htmlFor={pickerId} className={styles.custom} title="Elegir otro color">
          <input id={pickerId} type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          <span className="sr-only">Elegir otro color</span>
        </label>
      </div>
    </fieldset>
  );
}

const PencilIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 20l1-4L16 5l3 3L8 19Z M14 7l3 3" />
  </svg>
);

/** Perfil del usuario activo: foto, estado, mensaje personal editable y sus posts. */
export default function Profile() {
  const { state, currentUser, actions } = useApp();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputId = useId();

  const myPosts = state.posts.filter((p) => p.authorId === currentUser.id);
  const likesReceived = myPosts.reduce((n, p) => n + p.likes.length, 0);

  const startEditing = () => {
    setDraft(currentUser.personalMessage);
    setEditing(true);
  };

  const save = (e) => {
    e.preventDefault();
    actions.updateProfile({ personalMessage: draft.trim() });
    setEditing(false);
  };

  return (
    <div>
      <div className={styles.card}>
        <Avatar user={currentUser} size={96} />
        <div className={styles.identity}>
          <p className={styles.name}>{currentUser.name}</p>
          <StatusSelect />
        </div>
      </div>

      {editing ? (
        <form className={styles.pmForm} onSubmit={save}>
          <label htmlFor={inputId} className={styles.statusLabel}>
            Mensaje personal
          </label>
          <input
            id={inputId}
            className="aero-input"
            value={draft}
            maxLength={80}
            autoFocus
            placeholder="♫ Escuchando: …"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && setEditing(false)}
          />
          <div className={styles.pmActions}>
            <button type="submit" className="btn-pill btn-small">
              Guardar
            </button>
            <button type="button" className="btn-pill btn-small btn-secondary" onClick={() => setEditing(false)}>
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.pm}>
          <p>
            {currentUser.personalMessage ? (
              renderWithEmoticons(currentUser.personalMessage)
            ) : (
              <span>Escribí un mensaje personal</span>
            )}
          </p>
          <button type="button" className={styles.edit} onClick={startEditing} aria-label="Editar mensaje personal">
            <PencilIcon />
          </button>
        </div>
      )}

      <AvatarColor />

      <dl className={styles.stats}>
        <div>
          <dt>Publicaciones</dt>
          <dd>{myPosts.length}</dd>
        </div>
        <div>
          <dt>Me gusta recibidos</dt>
          <dd>{likesReceived}</dd>
        </div>
      </dl>

      <h3 className={styles.subtitle}>Mis publicaciones</h3>
      {myPosts.length > 0 ? (
        <ol className={styles.posts}>
          {myPosts.map((p) => (
            <li key={p.id}>
              <PostCard post={p} />
            </li>
          ))}
        </ol>
      ) : (
        <p className={styles.empty}>Todavía no publicaste nada.</p>
      )}
    </div>
  );
}
