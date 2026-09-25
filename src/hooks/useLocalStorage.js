import { useCallback, useState } from 'react';

// Estado sincronizado con localStorage. Si el storage está bloqueado (modo privado, cuota llena)
// o el JSON está corrupto, la app sigue funcionando en memoria con el valor inicial.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw);
    } catch {
      /* sin storage o JSON inválido: usamos el valor inicial */
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  const save = useCallback(
    (next) => {
      setValue(next);
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* no se pudo guardar: los datos quedan solo en memoria */
      }
    },
    [key],
  );

  return [value, save];
}
