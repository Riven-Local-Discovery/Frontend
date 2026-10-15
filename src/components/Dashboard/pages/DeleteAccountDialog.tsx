import { useState, type FormEvent } from 'react';
import Modal from '../ui/Modal';
import styles from './DeleteAccountDialog.module.scss';

export interface DeleteAccountDialogProps {
  businessName: string;
  /** DELETE /users/me takes the account password in the body. */
  onConfirm: (password: string) => void;
  onCancel: () => void;
  /** A rejected password comes back from the server, not from validation. */
  serverError?: string;
}

export default function DeleteAccountDialog({
  businessName,
  onConfirm,
  onCancel,
  serverError,
}: DeleteAccountDialogProps) {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState<string | undefined>();

  /* Typing the business name is deliberate friction. This deletes the
     account behind the storefront, not just the vendor profile, and the
     API offers nothing to undo it. */
  const nameMatches = confirmation.trim() === businessName;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password) {
      setError('Enter your password to confirm.');
      return;
    }
    if (!nameMatches) {
      setError(`Type "${businessName}" exactly to confirm.`);
      return;
    }

    setError(undefined);
    onConfirm(password);
  };

  return (
    <Modal
      title="Delete account"
      subtitle="This closes your Riven account, not just this profile."
      size="small"
      onClose={onCancel}
      footer={
        <>
          <button type="button" className={styles.cancel} onClick={onCancel}>
            Keep my account
          </button>
          <button
            type="submit"
            form="delete-account-form"
            className={styles.delete}
            disabled={!password || !nameMatches}
          >
            Delete account
          </button>
        </>
      }
    >
      <form
        id="delete-account-form"
        className={styles.form}
        onSubmit={handleSubmit}
        noValidate
      >
        <p className={styles.warning}>
          Your storefront, products and bazaar applications stop being visible
          to shoppers. Orders already placed are kept for the buyers&rsquo;
          records. There is no way to undo this.
        </p>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="delete-password">
            Password
          </label>
          <input
            id="delete-password"
            className={styles.input}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="delete-confirm">
            Type <strong>{businessName}</strong> to confirm
          </label>
          <input
            id="delete-confirm"
            className={styles.input}
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
          />
        </div>

        {(error || serverError) && (
          <span className={styles.error}>{serverError ?? error}</span>
        )}
      </form>
    </Modal>
  );
}
