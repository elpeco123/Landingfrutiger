import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import AeroWindow from './components/AeroWindow.jsx';
import ContactList from './components/ContactList.jsx';
import Feed from './components/Feed.jsx';
import Gadgets from './components/Gadgets.jsx';
import LoginScreen from './components/LoginScreen.jsx';
import Profile from './components/Profile.jsx';
import Scenery from './components/Scenery.jsx';
import Taskbar, { NAV_ITEMS, Orb } from './components/Taskbar.jsx';
import Toast from './components/Toast.jsx';
import styles from './App.module.css';

export default function App() {
  return (
    <AppProvider>
      <Scenery />
      <Shell />
    </AppProvider>
  );
}

const iconFor = (tab) => NAV_ITEMS.find((i) => i.tab === tab).icon;

/** Escritorio: 3 columnas en escritorio, 2 en tablet, 1 con pestañas inferiores en mobile. */
function Shell() {
  const { state, currentUser } = useApp();
  const [tab, setTab] = useState('feed');

  if (!currentUser) return <LoginScreen />;

  const navigate = (next) => {
    setTab(next);
    const target = NAV_ITEMS.find((i) => i.tab === next).target;
    requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ block: 'start' }));
  };

  // En mobile solo se ve la sección activa (data-active="false" se oculta por CSS).
  const active = (t) => tab === t;

  return (
    <div className={styles.app}>
      <a className="skip-link" href="#inicio" onClick={() => setTab('feed')}>
        Saltar a las publicaciones
      </a>
      <Taskbar tab={tab} onNavigate={navigate} />

      <main className={styles.desktop}>
        <h1 className="sr-only">Pecows</h1>
        <div className={styles.contacts} data-active={active('contacts')}>
          <AeroWindow id="contactos" title="Contactos" icon={iconFor('contacts')} shake={state.buzz}>
            <ContactList />
          </AeroWindow>
        </div>
        <div className={styles.feed} data-active={active('feed')}>
          <AeroWindow id="inicio" title="Pecows · Inicio" icon={<Orb size={18} />} shake={state.buzz}>
            <Feed />
          </AeroWindow>
        </div>
        <div className={styles.side}>
          <div data-active={active('profile')}>
            <AeroWindow id="perfil" title="Mi perfil" icon={iconFor('profile')}>
              <Profile />
            </AeroWindow>
          </div>
          <div data-active={active('gadgets')}>
            <Gadgets />
          </div>
        </div>
      </main>

      <nav className={styles.bottomNav} aria-label="Navegación principal">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.tab}
            type="button"
            className={styles.navBtn}
            aria-current={active(item.tab) ? 'page' : undefined}
            onClick={() => navigate(item.tab)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <Toast />
    </div>
  );
}
