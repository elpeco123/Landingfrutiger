import { useApp } from '../context/AppContext.jsx';
import PostComposer from './PostComposer.jsx';
import PostCard from './PostCard.jsx';
import styles from './Feed.module.css';

/** Feed principal: caja para publicar + posts de todos (los nuevos se agregan arriba). */
export default function Feed() {
  const { state } = useApp();

  return (
    <>
      <PostComposer />
      <h3 className="sr-only">Publicaciones recientes</h3>
      {state.posts.length > 0 ? (
        <ol className={styles.list}>
          {state.posts.map((p) => (
            <li key={p.id}>
              <PostCard post={p} />
            </li>
          ))}
        </ol>
      ) : (
        <p className={styles.empty}>Todavía no hay publicaciones. ¡Sé el primero!</p>
      )}
    </>
  );
}
