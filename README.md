# Pecows

Red social pequeña y **ficticia** con estética **Frutiger Aero / Aero Glass / mensajero de 2007**.
Proyecto de portfolio en un entorno cerrado: no tiene backend ni registro real, y todo el arte es CSS/SVG original (sin logos ni íconos de marcas reales).

> "Abrir la PC en 2007": ventanas de vidrio, cielos celestes, burbujas y optimismo tecnológico.

## Cómo correrlo

Requisitos: Node.js 18+ y npm.

```bash
npm install
npm run dev       # servidor de desarrollo en http://localhost:5173
npm run build     # build de producción en dist/
npm run preview   # sirve el build para probarlo
npm test          # chequeo del reducer (runner nativo de Node, sin dependencias)
```

## Qué incluye

- **Inicio de sesión** (a la derecha en pantallas anchas, para que se vea la escena) con 4 usuarios de prueba (sin contraseñas), selector de estado y una barra de carga verde animada.
- **Feed** con avatar, nombre, estado, fecha relativa y contenido. Los códigos `:)` `:D` `;)` `:P` `:O` `:(` `(L)` `(*)` se ven como emoticones SVG.
- **Crear post** en una caja de vidrio con selector de emoticones (se puede usar con teclado), contador y `Ctrl+Enter` para publicar.
- **Me gusta y comentarios** en cada post.
- **Perfil** con foto, estado, mensaje personal editable, **color de avatar a elección** (6 muestras glossy más un selector libre), estadísticas y tus propios posts.
- **Contactos estilo mensajero**, agrupados en conectados y desconectados, con **zumbido** que sacude las ventanas. Si el contacto no está "Ocupado", te lo devuelve.
- **Toasts** abajo a la derecha cuando alguien "reacciona" (simulado 3–8 s después de publicar) o inicia sesión.
- **Gadgets**: reloj analógico y clima de "Ciudad Burbuja".
- **Barra de tareas** con un orbe original (un pez tropical dentro de una esfera de agua) y el menú Inicio (navegar, restablecer la demo, cerrar sesión).
- **Persistencia** en `localStorage` (clave `pecows:v2`). Está envuelta en try/catch, y si no hay datos válidos carga los de prueba.

## Estructura

```
src/
├── main.jsx                 # punto de entrada
├── App.jsx / App.module.css # layout (3/2/1 columnas) y nav inferior
├── styles/aero.css          # variables de la paleta Aero + utilidades globales (píldoras, inputs)
├── context/
│   ├── AppContext.jsx       # Context + useReducer + acciones (y reacciones simuladas)
│   ├── reducer.js           # reducer puro (testeable sin React)
│   └── reducer.test.js
├── hooks/
│   ├── useLocalStorage.js   # persistencia con try/catch
│   ├── useNow.js            # reloj que se actualiza
│   └── useDismiss.js        # cerrar popovers con clic afuera / Escape
├── data/mockData.js         # usuarios, posts y comentarios de prueba
└── components/
    ├── AeroWindow           # ventana reutilizable (minimizar, maximizar, cerrar, zumbido)
    ├── AeroSelect           # desplegable glossy accesible (reemplaza al <select> nativo)
    ├── LoginScreen, Taskbar, ContactList, Feed, PostCard, PostComposer,
    ├── EmoticonPicker, Profile, Gadgets, Toast
    ├── Scenery              # fondo SVG: cielo, sol, globo de vidrio, ciudad, lomas, árboles, burbujas
    ├── SceneryParts         # peces, monitor LCD, CD, MP3 y tira de fotos
    ├── Avatar               # personaje glossy SVG con color elegible + marco de estado + StatusDot
    └── Emoticon             # emoticones SVG + renderWithEmoticons()
```

## Decisiones de diseño

- **Fondo**: una escena Frutiger Aero en SVG. Tiene cielo azul intenso con arcos de luz, sol radiante y reflejos de lente, nubes esponjosas y un globo de vidrio gigante. Debajo, una ciudad costera de cristal que se refleja en el lago, lomas glossy y árboles con copa de "burbujas". Suma detalles tecnológicos de los 2000: una tira de fotos que se aleja hacia la ciudad, un CD iridiscente con nota musical, un reproductor MP3 dentro de una burbuja y un monitor LCD del que salta un pez. Abajo hay agua con peces tropicales, burbujas y destellos. Las piezas detalladas viven en `SceneryParts.jsx`.
- **Avatares**: un personaje glossy (cabeza esférica y cuerpo) generado a partir de un solo color. Las luces y sombras salen de ese tono en HSL, y el cuerpo vira ~45° de tono hacia abajo, como el vidrio aqua→verde de la época.
- **Paleta** (en `src/styles/aero.css`): cielo `#0B3FC9 → #9FD4FF`, agua `#27C1D6`/`#0A6E9E`, pasto `#5FCF2A`, y texto `#0B2545` (≥ 7:1 sobre el vidrio).
- **Vidrio con contraste**: las ventanas usan `rgba(255,255,255,.62)` con `backdrop-filter: blur(18px)`. Si el navegador no soporta blur, o si el usuario pide más contraste (`prefers-contrast: more`), el vidrio se vuelve casi opaco.
- **Brillo "glossy"**: un `::before` con degradado blanco cubre la mitad superior de botones, marcos y barras. El corte nítido al 50% es la firma de la época.
- **Tipografía**: pila Segoe UI → Frutiger → Myriad → Tahoma → Arial. No se descargan fuentes.
- **Estados**: además del color, cada punto de estado tiene su forma (reloj para Ausente, guion para Ocupado, círculo vacío para Desconectado) y siempre va con texto.
- **Desplegables propios** (`AeroSelect`): botón de vidrio con flecha en una esfera aqua y lista translúcida. Siguen el patrón *listbox*: flechas, Inicio/Fin, Enter/Espacio para elegir y Escape para cerrar devolviendo el foco.
- **Volumen 3D y realismo**: sombras proyectadas (`feDropShadow`), degradados de muchas paradas y un sombreado esférico reutilizable (`#volume`). Las texturas son procedurales (`feTurbulence` + `feDisplacementMap` + `feDiffuseLighting`): follaje con bordes de hojas y relieve, corteza, pasto, nubes esponjosas y el reflejo ondulado del lago. Los edificios tienen cara lateral en sombra, techo en perspectiva, reflejos diagonales en el vidrio, oscurecimiento en la base, luces de aviso en las antenas y neblina en la fila de atrás.
- **Rendimiento del fondo**: la escena está en dos `<svg>` superpuestos. Uno es estático, con los filtros pesados, que el navegador calcula una sola vez. El otro es liviano y tiene todo lo animado (peces, burbujas, destellos), así las animaciones no obligan a recalcular las texturas.
- **Emoticones como SVG** y no como emojis del sistema: se ven igual en todos los sistemas operativos y tienen nombre accesible.
- **Accesibilidad**: foco visible en todo, áreas táctiles de 44px en pantallas táctiles, `aria-live` en los toasts, `aria-pressed`/`aria-expanded` en los botones de estado y un link para saltar al contenido. Con `prefers-reduced-motion` las burbujas y nubes quedan quietas, la barra de carga es fija y el zumbido pasa a ser un destello en lugar de una sacudida.
- **Responsive**: 3 columnas (≥ 1100px), 2 columnas (768–1099px) y 1 columna con navegación inferior (< 768px). La barra de tareas va abajo en escritorio y arriba en mobile.

### Dependencias

Solo `react` y `react-dom`, más `vite` y `@vitejs/plugin-react` como herramientas de desarrollo. El plugin es el oficial de la plantilla React de Vite: activa JSX automático y Fast Refresh. No hay librerías de UI, íconos ni estado.

## Cómo extenderlo

### Reemplazar el mock por una API real (Express)

Todo el acceso a datos pasa por las **acciones** de `AppContext.jsx`, así que los componentes no cambian:

1. Crear un servidor, por ejemplo `server/index.js`:
   ```js
   import express from 'express';
   const app = express();
   app.use(express.json());
   const posts = []; // reemplazar por una base de datos

   app.get('/api/posts', (req, res) => res.json(posts));
   app.post('/api/posts', (req, res) => {
     const post = { id: crypto.randomUUID(), ...req.body, createdAt: Date.now(), likes: [], comments: [] };
     posts.unshift(post);
     res.status(201).json(post);
   });
   app.listen(3001);
   ```
2. En `vite.config.js`, agregar un proxy: `server: { proxy: { '/api': 'http://localhost:3001' } }`.
3. En `AppContext.jsx`, cambiar el cuerpo de cada acción por un `fetch` y despachar con la respuesta:
   ```js
   async publish(content) {
     const res = await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ authorId: stateRef.current.currentUserId, content }) });
     dispatch({ type: 'ADD_POST', post: await res.json() });
   }
   ```
4. Cargar el estado inicial con `GET /api/posts` en un `useEffect` (una acción `LOAD` en el reducer) y sacar `useLocalStorage`, o dejarlo como caché offline.
5. Reemplazar las reacciones simuladas por eventos reales (WebSocket o Server-Sent Events) que despachen `LIKE`, `ADD_COMMENT` y `PUSH_TOAST`.
6. Para usuarios reales hace falta autenticación del lado del servidor (sesiones o JWT). La pantalla de login actual es solo un selector de demo.

### Otras ideas

- **Más emoticones**: agregar una entrada en `EMOTICONS` y su forma en `Emoticon.jsx`.
- **Más usuarios de prueba**: agregarlos en `mockData.js` con sus colores de avatar.
- **Ventanas de chat 1 a 1**: reutilizar `AeroWindow` con una lista de mensajes y guardarlos en el reducer.
- **Sonidos de notificación**: generarlos con Web Audio API, sin archivos.
- **Cambios en la forma de los datos guardados**: subir la clave a `pecows:v3` para no romper datos viejos.
