import { useId, useRef, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import Avatar from './Avatar.jsx';
import EmoticonPicker from './EmoticonPicker.jsx';
import styles from './PostComposer.module.css';

const MAX = 500;

/** Caja para crear un post: textarea, selector de emoticones y botón Publicar. */
export default function PostComposer() {
  const { currentUser, actions } = useApp();
  const [text, setText] = useState('');
  const textareaRef = useRef(null);
  const id = useId();
  const trimmed = text.trim();

  const submit = (e) => {
    e.preventDefault();
    if (!trimmed) return;
    actions.publish(trimmed);
    setText('');
  };

  // Inserta el código del emoticón donde está el cursor y devuelve el foco al texto.
  const insert = (code) => {
    const el = textareaRef.current;
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;
    const snippet = `${code} `;
    setText((text.slice(0, start) + snippet + text.slice(end)).slice(0, MAX));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + snippet.length, start + snippet.length);
    });
  };

  return (
    <form className={styles.composer} onSubmit={submit}>
      <div className={styles.row}>
        <Avatar user={currentUser} size={44} decorative />
        <label htmlFor={id} className={styles.label}>
          ¿Qué estás pensando, {currentUser.name}?
        </label>
      </div>
      <textarea
        id={id}
        ref={textareaRef}
        className={`aero-input ${styles.textarea}`}
        value={text}
        maxLength={MAX}
        rows={3}
        placeholder="Escribí algo… probá con :) o (L)"
        aria-describedby={`${id}-hint`}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submit(e);
        }}
      />
      <div className={styles.actions}>
        <EmoticonPicker onPick={insert} />
        <span id={`${id}-hint`} className={styles.counter}>
          {text.length}/{MAX} · Ctrl+Enter para publicar
        </span>
        <button type="submit" className="btn-pill" disabled={!trimmed}>
          Publicar
        </button>
      </div>
    </form>
  );
}
