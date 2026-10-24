import { useEffect, useRef } from 'react';

// Wraps the native <dialog>. Children mount only while open, so forms start fresh each time.
export default function Modal({ open, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} onClose={onClose}>
      {open && children}
    </dialog>
  );
}
