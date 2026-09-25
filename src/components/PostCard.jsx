import { useId, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { STATUSES } from '../data/mockData.js';
import Avatar, { StatusDot } from './Avatar.jsx';
import { renderWithEmoticons } from './Emoticon.jsx';
import styles from './PostCard.module.css';

const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
const names = new Intl.ListFormat('es', { type: 'conjunction' });

/** "hace 5 minutos", "ayer"… */
export function timeAgo(ts) {
  const s = Math.round((ts - Date.now()) / 1000);
  const abs = Math.abs(s);
  if (abs < 45) return 'hace un momento';
  if (abs < 3600) return rtf.format(Math.round(s / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(s / 3600), 'hour');
  return rtf.format(Math.round(s / 86400), 'day');
}

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 20.5C4.5 15 2.5 11 3.6 7.6 4.8 4 9.5 3.3 12 6.9c2.5-3.6 7.2-2.9 8.4.7C21.5 11 19.5 15 12 20.5Z" />
  </svg>
);

const BubbleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 5h16v11H10l-4.5 3.5V16H4Z" />
  </svg>
);

/** Un post del feed con "me gusta" y comentarios. */
export default function PostCard({ post }) {
  const { state, currentUser, actions } = useApp();
  const [showComments, setShowComments] = useState(false);
  const [draft, setDraft] = useState('');
  const commentsId = useId();
  const inputId = useId();

  const userById = (id) => state.users.find((u) => u.id === id);
  const author = userById(post.authorId);
  if (!author) return null;

  const liked = post.likes.includes(currentUser.id);
  const likers = post.likes.map((id) => userById(id)?.name).filter(Boolean);

  const sendComment = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    actions.comment(post.id, text);
    setDraft('');
  };

  return (
    <article className={styles.card}>
      <header className={styles.head}>
        <Avatar user={author} size={48} />
        <div className={styles.meta}>
          <h3 className={styles.name}>{author.name}</h3>
          <p className={styles.sub}>
            <StatusDot status={author.status} />
            {STATUSES[author.status].label} ·{' '}
            <time dateTime={new Date(post.createdAt).toISOString()}>{timeAgo(post.createdAt)}</time>
          </p>
        </div>
      </header>

      <p className={styles.content}>{renderWithEmoticons(post.content)}</p>

      {likers.length > 0 && (
        <p className={styles.likers}>
          A {names.format(likers)} {likers.length > 1 ? 'les' : 'le'} gusta esto.
        </p>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.action} ${liked ? styles.liked : ''}`}
          aria-pressed={liked}
          onClick={() => actions.toggleLike(post.id)}
        >
          <HeartIcon /> Me gusta <span className={styles.count}>{post.likes.length}</span>
        </button>
        <button
          type="button"
          className={styles.action}
          aria-expanded={showComments}
          aria-controls={commentsId}
          onClick={() => setShowComments((s) => !s)}
        >
          <BubbleIcon /> Comentarios <span className={styles.count}>{post.comments.length}</span>
        </button>
      </div>

      {showComments && (
        <div id={commentsId} className={styles.comments}>
          {post.comments.length > 0 && (
            <ul className={styles.commentList}>
              {post.comments.map((c) => {
                const u = userById(c.authorId);
                if (!u) return null;
                return (
                  <li key={c.id} className={styles.comment}>
                    <Avatar user={u} size={32} showStatus={false} />
                    <div className={styles.bubble}>
                      <div className={styles.bubbleHead}>
                        <strong>{u.name}</strong>
                        <time dateTime={new Date(c.createdAt).toISOString()}>{timeAgo(c.createdAt)}</time>
                      </div>
                      <p>{renderWithEmoticons(c.content)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <form className={styles.commentForm} onSubmit={sendComment}>
            <label htmlFor={inputId} className="sr-only">
              Escribí un comentario
            </label>
            <input
              id={inputId}
              className="aero-input"
              value={draft}
              maxLength={280}
              placeholder="Escribí un comentario…"
              onChange={(e) => setDraft(e.target.value)}
            />
            <button type="submit" className="btn-pill btn-small" disabled={!draft.trim()}>
              Enviar
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
