// Datos de prueba de Pecows. Todo es ficticio: usuarios, posts y comentarios.

// Etiquetas de estado. Los colores viven en CSS (--status-*).
export const STATUSES = {
  online: { label: 'Disponible' },
  away: { label: 'Ausente' },
  busy: { label: 'Ocupado' },
  offline: { label: 'Desconectado' },
};

// Cada usuario tiene el color de su avatar glossy (editable desde el perfil).
export const USERS = [
  {
    id: 'lucia',
    name: 'Lucía',
    status: 'online',
    personalMessage: '♫ Escuchando: Burbujas FM – Cielo de cristal',
    avatar: { color: '#27c1d6' },
  },
  {
    id: 'tomas',
    name: 'Tomás',
    status: 'away',
    personalMessage: 'Instalando gadgets nuevos, vuelvo en 5 (*)',
    avatar: { color: '#4a8fe7' },
  },
  {
    id: 'marina',
    name: 'Marina',
    status: 'busy',
    personalMessage: 'Rindiendo finales :( no molestar',
    avatar: { color: '#ff8a3d' },
  },
  {
    id: 'nico',
    name: 'Nico',
    status: 'offline',
    personalMessage: '♫ Escuchando: Pixel Lagoon – Aqua Drive',
    avatar: { color: '#9b7bff' },
  },
];

// Colores rápidos para el avatar (además hay un selector libre).
export const AVATAR_COLORS = [
  ['#27c1d6', 'Aqua'],
  ['#3cc43c', 'Verde'],
  ['#4a8fe7', 'Azul'],
  ['#9b7bff', 'Violeta'],
  ['#ff6fae', 'Rosa'],
  ['#ff8a3d', 'Naranja'],
];

const MIN = 60_000;
const HOUR = 60 * MIN;

// Estado inicial completo. Las fechas son relativas al primer arranque.
export function createInitialData(now = Date.now()) {
  return {
    currentUserId: null,
    users: USERS.map((u) => ({ ...u })),
    posts: [
      {
        id: 'p1',
        authorId: 'tomas',
        content: 'Hoy el cielo está tan celeste que parece un fondo de pantalla :D',
        createdAt: now - 5 * MIN,
        likes: ['marina'],
        comments: [
          { id: 'c1', authorId: 'marina', content: '¡Mandá foto! (L)', createdAt: now - 3 * MIN },
        ],
      },
      {
        id: 'p2',
        authorId: 'marina',
        content: 'Tip de estudio: una ventana para apuntes, otra para música ♫ y cero distracciones ;)',
        createdAt: now - 50 * MIN,
        likes: ['tomas', 'nico'],
        comments: [],
      },
      {
        id: 'p3',
        authorId: 'nico',
        content: '¿Alguien más extraña las barras de carga verdes? Eran pura esperanza (*)',
        createdAt: now - 3 * HOUR,
        likes: ['lucia', 'tomas'],
        comments: [
          {
            id: 'c2',
            authorId: 'tomas',
            content: 'Yo las miraba como si fueran una carrera :P',
            createdAt: now - 2 * HOUR,
          },
        ],
      },
      {
        id: 'p4',
        authorId: 'lucia',
        content: 'Primer post en Pecows. Esto huele a PC nueva :)',
        createdAt: now - 26 * HOUR,
        likes: ['tomas'],
        comments: [{ id: 'c3', authorId: 'nico', content: '¡Bienvenida! :D', createdAt: now - 25 * HOUR }],
      },
    ],
  };
}

// Comentarios que usan los contactos en las reacciones simuladas.
export const SIM_COMMENTS = [
  '¡Me encanta! :D',
  'Jajaja, totalmente :P',
  'Qué lindo (L)',
  '¡Buenísimo! (*)',
  'Coincido ;)',
];
