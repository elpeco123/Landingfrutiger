// Emoticones originales en SVG. Se escriben con códigos clásicos (":)", "(L)"...)
// y se renderizan como imagen con nombre accesible, no como emoji del sistema.

export const EMOTICONS = [
  { code: ':)', label: 'sonrisa' },
  { code: ':D', label: 'carcajada' },
  { code: ';)', label: 'guiño' },
  { code: ':P', label: 'lengua afuera' },
  { code: ':O', label: 'sorpresa' },
  { code: ':(', label: 'triste' },
  { code: '(L)', label: 'corazón' },
  { code: '(*)', label: 'estrella' },
];

const BY_CODE = Object.fromEntries(EMOTICONS.map((e) => [e.code, e]));
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PATTERN = new RegExp(`(${EMOTICONS.map((e) => escape(e.code)).join('|')})`, 'i');

/** Convierte texto con códigos en una lista de strings y <Emoticon>. */
export function renderWithEmoticons(text) {
  return text.split(PATTERN).map((part, i) => {
    const e = BY_CODE[part.toUpperCase()];
    return e ? <Emoticon key={i} code={e.code} /> : part;
  });
}

const STROKE = { fill: 'none', stroke: '#6b4500', strokeWidth: 2, strokeLinecap: 'round' };

function Face({ code }) {
  const eyes =
    code === ';)' ? (
      <>
        <path d="M9.5 13 Q12 11 14.5 13" {...STROKE} />
        <ellipse cx="20" cy="12.5" rx="1.8" ry="2.6" fill="#6b4500" />
      </>
    ) : (
      <>
        <ellipse cx="12" cy="12.5" rx="1.8" ry="2.6" fill="#6b4500" />
        <ellipse cx="20" cy="12.5" rx="1.8" ry="2.6" fill="#6b4500" />
      </>
    );

  const mouths = {
    ':)': <path d="M10 19 Q16 24 22 19" {...STROKE} />,
    ';)': <path d="M10 19 Q16 24 22 19" {...STROKE} />,
    ':D': <path d="M9.5 18 H22.5 Q21.5 25 16 25 Q10.5 25 9.5 18Z" fill="#8a2b12" stroke="#6b4500" strokeWidth="1.5" />,
    ':P': (
      <>
        <path d="M10 19 H22" {...STROKE} />
        <path d="M15 19 H21 V22 Q18 26 15 22Z" fill="#e0564b" stroke="#8a2b12" strokeWidth="1" />
      </>
    ),
    ':O': <ellipse cx="16" cy="21" rx="3" ry="3.6" fill="#8a2b12" stroke="#6b4500" strokeWidth="1.5" />,
    ':(': <path d="M10.5 23 Q16 18 21.5 23" {...STROKE} />,
  };

  return (
    <>
      <circle cx="16" cy="16" r="14" fill="#ffd43b" stroke="#c98a00" strokeWidth="1.5" />
      <circle cx="16" cy="17" r="11.5" fill="none" stroke="#f5b400" strokeWidth="3" opacity=".5" />
      {eyes}
      {mouths[code]}
    </>
  );
}

function Shape({ code }) {
  if (code === '(L)') {
    return <path d="M16 28 C4 19 2 13 5 8 C8 3.5 14 4.5 16 9 C18 4.5 24 3.5 27 8 C30 13 28 19 16 28Z" fill="#e0342b" stroke="#8a1a14" strokeWidth="1.5" />;
  }
  if (code === '(*)') {
    return <path d="M16 2.5 L20 11.5 L29.5 12.3 L22.3 18.6 L24.5 28 L16 23 L7.5 28 L9.7 18.6 L2.5 12.3 L12 11.5Z" fill="#ffc21a" stroke="#b77b00" strokeWidth="1.5" strokeLinejoin="round" />;
  }
  return <Face code={code} />;
}

export default function Emoticon({ code, size = 20, decorative = false }) {
  const e = BY_CODE[code];
  return (
    <svg
      className="emoticon"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : e.label}
      aria-hidden={decorative || undefined}
    >
      <Shape code={code} />
      {/* Brillo glossy */}
      <ellipse cx="13" cy="8.5" rx="7" ry="3.5" fill="#fff" opacity=".6" />
    </svg>
  );
}
