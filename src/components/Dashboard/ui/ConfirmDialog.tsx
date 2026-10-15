import Modal from './Modal';
import styles from './ConfirmDialog.module.scss';

export interface ConfirmDialogProps {
  title: string;
  /** The consequence, stated plainly. Shown as the dialog's body. */
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** Paints the confirm button red, for anything that destroys data. */
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * The one-question dialog used before anything irreversible — deleting a
 * product, withdrawing an application. Both of those are one-way doors in
 * the API, so neither happens on a single click.
 */
export default function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      title={title}
      size="small"
      onClose={onCancel}
      footer={
        <>
          <button type="button" className={styles.cancel} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={destructive ? styles.confirmDanger : styles.confirm}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className={styles.message}>{message}</p>
    </Modal>
  );
}
