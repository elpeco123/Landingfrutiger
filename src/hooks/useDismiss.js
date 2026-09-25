import { useEffect } from 'react';

// Cierra un popover (menú Inicio, selector de emoticones) al hacer clic afuera o con Escape.
// refs[0] debe ser el botón que lo abre: recibe el foco de vuelta al cerrar con Escape.
export function useDismiss(open, close, refs) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!refs.some((r) => r.current?.contains(e.target))) close();
    };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      close();
      refs[0].current?.focus();
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
}
