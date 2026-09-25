import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { SIM_COMMENTS } from '../data/mockData.js';
import { loadState, makeId, reducer } from './reducer.js';

const STORAGE_KEY = 'pecows:v2';
const AppContext = createContext(null);

const random = (list) => list[Math.floor(Math.random() * list.length)];

export function AppProvider({ children }) {
  const [saved, save] = useLocalStorage(STORAGE_KEY, null);
  const [state, dispatch] = useReducer(reducer, saved, loadState);

  // Los timers de las reacciones simuladas leen el estado más reciente desde esta ref.
  const stateRef = useRef(state);
  const timers = useRef([]);
  useEffect(() => {
    stateRef.current = state;
  });

  // Persistimos solo los datos; toasts y zumbidos son efímeros.
  useEffect(() => {
    save({ currentUserId: state.currentUserId, users: state.users, posts: state.posts });
  }, [state.currentUserId, state.users, state.posts, save]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const actions = useMemo(() => {
    const later = (ms, fn) => timers.current.push(setTimeout(fn, ms));
    const toast = (userId, text) => dispatch({ type: 'PUSH_TOAST', toast: { id: makeId(), userId, text } });
    // Un contacto conectado al azar (distinto del usuario activo).
    const pickContact = () => {
      const { users, currentUserId } = stateRef.current;
      return random(users.filter((u) => u.id !== currentUserId && u.status !== 'offline'));
    };

    return {
      login(userId, status) {
        dispatch({ type: 'LOGIN', userId, status });
        later(2500, () => {
          const c = pickContact();
          if (c) toast(c.id, `${c.name} acaba de iniciar sesión.`);
        });
      },

      logout() {
        timers.current.forEach(clearTimeout);
        timers.current = [];
        dispatch({ type: 'LOGOUT' });
      },

      updateProfile: (changes) => dispatch({ type: 'UPDATE_PROFILE', changes }),

      publish(content) {
        const post = {
          id: makeId(),
          authorId: stateRef.current.currentUserId,
          content,
          createdAt: Date.now(),
          likes: [],
          comments: [],
        };
        dispatch({ type: 'ADD_POST', post });

        // Reacción simulada: entre 3 y 8 s después alguien da "me gusta" y a veces comenta.
        later(3000 + Math.random() * 5000, () => {
          const c = pickContact();
          if (!c) return;
          dispatch({ type: 'LIKE', postId: post.id, userId: c.id, value: true });
          toast(c.id, `A ${c.name} le gusta tu publicación (L)`);
          if (Math.random() < 0.5) {
            later(2500, () => {
              const comment = { id: makeId(), authorId: c.id, content: random(SIM_COMMENTS), createdAt: Date.now() };
              dispatch({ type: 'ADD_COMMENT', postId: post.id, comment });
              toast(c.id, `${c.name} comentó tu publicación.`);
            });
          }
        });
      },

      toggleLike: (postId) => dispatch({ type: 'LIKE', postId, userId: stateRef.current.currentUserId }),

      comment(postId, content) {
        const comment = { id: makeId(), authorId: stateRef.current.currentUserId, content, createdAt: Date.now() };
        dispatch({ type: 'ADD_COMMENT', postId, comment });
      },

      // Zumbido: sacude las ventanas. Si el contacto no está "Ocupado", devuelve el zumbido.
      buzz(contact) {
        dispatch({ type: 'BUZZ' });
        toast(contact.id, `Le enviaste un zumbido a ${contact.name}.`);
        if (contact.status !== 'busy') {
          later(2500, () => {
            dispatch({ type: 'BUZZ' });
            toast(contact.id, `¡${contact.name} te devolvió el zumbido! :P`);
          });
        }
      },

      dismissToast: (id) => dispatch({ type: 'DISMISS_TOAST', id }),

      reset: () => dispatch({ type: 'RESET' }),
    };
  }, []);

  const currentUser = state.users.find((u) => u.id === state.currentUserId) ?? null;
  const value = useMemo(() => ({ state, currentUser, actions }), [state, currentUser, actions]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>');
  return ctx;
}
