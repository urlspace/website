import { useEffect, useRef } from "react";
import styles from "./Drawer.module.css";
import Icon from "../Icons/Icons";

function Dialog({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: dialog backdrop is pointer-only; Escape closes via the built-in close event
    <dialog
      ref={ref}
      className={styles.drawer}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close dialog"
        >
          <Icon.Close />
        </button>
      </div>

      <div className={styles.content}>{children}</div>
    </dialog>
  );
}

export default Dialog;
