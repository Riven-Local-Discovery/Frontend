import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '../../icons';
import styles from './Modal.module.scss';

export interface ModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  /** Pinned to the bottom of the dialog, outside the scrolling body. */
  footer?: ReactNode;
  size?: 'small' | 'medium' | 'large';
}

/**
 * The dashboard's dialog. Rendered through a portal onto document.body so
 * it can't be clipped by the shell's `overflow: hidden`, which means it has
 * to carry the light palette itself — the --dash-* tokens live on .shell
 * and a portalled node is not inside it.
 */
export default function Modal({
  title,
  subtitle,
  onClose,
  children,
  footer,
  size = 'medium',
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    /* Stop the page behind the dialog from scrolling under it. */
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    /* Move focus into the dialog so the keyboard doesn't stay behind it. */
    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      className={styles.overlay}
      /* Only a click that both starts and ends on the backdrop closes the
         dialog — otherwise a text selection that drifts outside the panel
         would dismiss it and throw away what was typed. */
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className={`${styles.panel} ${styles[size]}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <header className={styles.head}>
          <div className={styles.headText}>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          <button
            type="button"
            className={styles.close}
            aria-label="Close dialog"
            onClick={onClose}
          >
            <CloseIcon size={18} />
          </button>
        </header>

        <div className={styles.body}>{children}</div>

        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
