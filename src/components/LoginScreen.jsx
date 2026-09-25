import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import AeroSelect from './AeroSelect.jsx';
import AeroWindow from './AeroWindow.jsx';
import Avatar, { STATUS_OPTIONS } from './Avatar.jsx';
import { Orb } from './Taskbar.jsx';
import styles from './LoginScreen.module.css';

/** Inicio de sesión de demostración: elegir usuario de prueba y estado. Sin contraseñas. */
export default function LoginScreen() {
  const { state, actions } = useApp();
  const [userId, setUserId] = useState(state.users[0].id);
  const [status, setStatus] = useState('online');
  const [loading, setLoading] = useState(false);
  const selected = state.users.find((u) => u.id === userId);

  // Barra de carga "de época" antes de entrar (más corta si se prefiere menos movimiento).
  useEffect(() => {
    if (!loading) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(() => actions.login(userId, status), reduce ? 400 : 1800);
    return () => clearTimeout(t);
  }, [loading, userId, status, actions]);

  return (
    <main className={styles.screen}>
      <div className={styles.panel}>
        <div className={styles.brand}>
          <Orb size={72} />
          <div>
            <h1 className={styles.logo}>Pecows</h1>
            <p className={styles.tagline}>Tu cielo social, siempre conectado.</p>
          </div>
        </div>

        <AeroWindow title="Iniciar sesión en Pecows" closable={false} className={styles.window}>
          {loading ? (
            <div className={styles.loading} role="status">
              <Avatar user={selected} size={96} showStatus={false} />
              <p>
                Iniciando sesión como <strong>{selected.name}</strong>…
              </p>
              <div className={styles.bar} aria-hidden="true">
                <span />
              </div>
              <button type="button" className="btn-pill btn-secondary" onClick={() => setLoading(false)}>
                Cancelar
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setLoading(true);
              }}
            >
              <fieldset className={styles.users}>
                <legend className={styles.legend}>Elegí un usuario de prueba</legend>
                <div className={styles.userGrid}>
                  {state.users.map((u) => (
                    <label key={u.id} className={styles.userTile}>
                      <input
                        type="radio"
                        name="user"
                        value={u.id}
                        checked={userId === u.id}
                        onChange={() => setUserId(u.id)}
                        className="sr-only"
                      />
                      <Avatar user={u} size={72} showStatus={false} decorative />
                      <span className={styles.userName}>{u.name}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className={styles.field}>
                <AeroSelect label="Iniciar sesión como:" grow value={status} options={STATUS_OPTIONS} onChange={setStatus} />
              </div>

              <p className={styles.note}>Entorno de demostración: no hay contraseñas ni datos reales.</p>

              <div className={styles.submitRow}>
                <button type="submit" className="btn-pill btn-large">
                  Iniciar sesión
                </button>
              </div>
            </form>
          )}
        </AeroWindow>
      </div>
    </main>
  );
}
