import { useRef, useState, type ChangeEvent } from 'react';
import { ApiError } from '../../../lib/api';
import { ALLOWED_IMAGE_TYPES, uploadImage, type UploadPurpose } from '../../../lib/media';
import { UploadCloudIcon } from '../../icons';
import styles from './ImageUpload.module.scss';

export interface ImageUploadProps {
  /** Decides the storage key prefix on the API side. */
  purpose: UploadPurpose;
  /** Already-uploaded URLs to show as tiles. */
  value: string[];
  onChange: (urls: string[]) => void;
  /** One image (a banner or logo) or several (cover media, product images). */
  multiple?: boolean;
  /** Refused beyond this count, so the API's own array limits are not hit. */
  max?: number;
  label?: string;
}

/**
 * Uploads straight to object storage through a signed URL and reports back the
 * public URLs. Replaces the bundled placeholder library the forms used to pick
 * from, which could only ever store one of a handful of stock images.
 */
export default function ImageUpload({
  purpose,
  value,
  onChange,
  multiple = false,
  max = multiple ? 10 : 1,
  label = 'Upload image',
}: ImageUploadProps) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const atCapacity = value.length >= max;

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    // Let the same file be chosen again after a failure.
    event.target.value = '';
    if (files.length === 0) return;

    setBusy(true);
    setError(null);
    try {
      const room = max - value.length;
      const accepted = multiple ? files.slice(0, room) : files.slice(0, 1);
      const uploaded: string[] = [];
      for (const file of accepted) {
        uploaded.push(await uploadImage(file, purpose));
      }
      onChange(multiple ? [...value, ...uploaded] : uploaded);

      if (multiple && files.length > room) {
        setError(`Only ${room} more image${room === 1 ? '' : 's'} could be added.`);
      }
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Upload failed. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const remove = (url: string) => onChange(value.filter((candidate) => candidate !== url));

  return (
    <div className={styles.wrap}>
      <ul className={styles.tiles}>
        {value.map((url) => (
          <li key={url} className={styles.tile}>
            <img src={url} alt="" />
            <button
              type="button"
              className={styles.remove}
              aria-label="Remove image"
              onClick={() => remove(url)}
            >
              ×
            </button>
          </li>
        ))}

        {!atCapacity && (
          <li>
            <button
              type="button"
              className={styles.add}
              onClick={() => input.current?.click()}
              disabled={busy}
            >
              <UploadCloudIcon />
              <span>{busy ? 'Uploading…' : label}</span>
            </button>
          </li>
        )}
      </ul>

      <input
        ref={input}
        className={styles.input}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        multiple={multiple}
        onChange={(event) => void handleFiles(event)}
      />

      <p className={styles.hint}>
        {value.length}/{max} · JPEG, PNG or WebP, up to 5 MB
      </p>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
