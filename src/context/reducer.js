// Reducer puro de la app: sin React, así se puede testear con `npm test`.
import { createInitialData } from '../data/mockData.js';

// IDs cortos. No usamos crypto.randomUUID porque no existe fuera de contextos seguros (http por IP).
export const makeId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const uiDefaults = { toasts: [], buzz: 0 };

// Convierte lo guardado en localStorage en un estado válido; si no sirve, usa los datos de prueba.
export function loadState(saved) {
  const ok = saved && Array.isArray(saved.users) && saved.users.length > 0 && Array.isArray(saved.posts);
  const data = ok ? saved : createInitialData();
  const currentUserId = data.users.some((u) => u.id === data.currentUserId) ? data.currentUserId : null;
  return { ...data, currentUserId, ...uiDefaults };
}

const updateUser = (users, id, changes) => users.map((u) => (u.id === id ? { ...u, ...changes } : u));
const updatePost = (posts, id, fn) => posts.map((p) => (p.id === id ? fn(p) : p));

export function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        currentUserId: action.userId,
        users: updateUser(state.users, action.userId, { status: action.status }),
        toasts: [],
      };

    case 'LOGOUT':
      return {
        ...state,
        currentUserId: null,
        users: updateUser(state.users, state.currentUserId, { status: 'offline' }),
        toasts: [],
      };

    case 'UPDATE_PROFILE':
      return { ...state, users: updateUser(state.users, state.currentUserId, action.changes) };

    case 'ADD_POST':
      return { ...state, posts: [action.post, ...state.posts] };

    // value: true/false fuerza el estado; sin value, alterna.
    case 'LIKE':
      return {
        ...state,
        posts: updatePost(state.posts, action.postId, (p) => {
          const liked = action.value ?? !p.likes.includes(action.userId);
          const rest = p.likes.filter((id) => id !== action.userId);
          return { ...p, likes: liked ? [...rest, action.userId] : rest };
        }),
      };

    case 'ADD_COMMENT':
      return {
        ...state,
        posts: updatePost(state.posts, action.postId, (p) => ({ ...p, comments: [...p.comments, action.comment] })),
      };

    case 'PUSH_TOAST':
      return { ...state, toasts: [...state.toasts, action.toast].slice(-4) };

    case 'DISMISS_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };

    case 'BUZZ':
      return { ...state, buzz: state.buzz + 1 };

    case 'RESET':
      return { ...loadState(null), currentUserId: state.currentUserId };

    default:
      return state;
  }
}
