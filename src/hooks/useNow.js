import { useEffect, useState } from 'react';

// Fecha actual que se refresca cada `ms` milisegundos (reloj de la barra y gadget).
export function useNow(ms = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}
