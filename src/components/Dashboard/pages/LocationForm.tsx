import { useState, type FormEvent } from 'react';
import { MapPinIcon } from '../../icons';
import Modal from '../ui/Modal';
import type { GeoPoint } from '../types';
import styles from './LocationForm.module.scss';

export interface LocationFormProps {
  location: GeoPoint | null;
  onSubmit: (location: GeoPoint) => void;
  onCancel: () => void;
  /**
   * Set while PATCH /vendors/me/location is rate-limited. The endpoint
   * allows one update a minute and answers 429 LOCATION_RATE_LIMITED
   * otherwise, so the form says so rather than letting the save fail.
   */
  rateLimitedUntil?: number | null;
}

/** Cairo, as a sane starting point for a vendor with no location yet. */
const DEFAULT_POINT: GeoPoint = { lat: 30.0444, lng: 31.2357 };

type Errors = Partial<Record<'lat' | 'lng', string>>;

export default function LocationForm({
  location,
  onSubmit,
  onCancel,
  rateLimitedUntil,
}: LocationFormProps) {
  const start = location ?? DEFAULT_POINT;
  const [lat, setLat] = useState(String(start.lat));
  const [lng, setLng] = useState(String(start.lng));
  const [errors, setErrors] = useState<Errors>({});

  const waitSeconds =
    rateLimitedUntil && rateLimitedUntil > Date.now()
      ? Math.ceil((rateLimitedUntil - Date.now()) / 1000)
      : 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found: Errors = {};
    const latValue = Number.parseFloat(lat);
    const lngValue = Number.parseFloat(lng);

    if (!Number.isFinite(latValue) || latValue < -90 || latValue > 90) {
      found.lat = 'Latitude must be between -90 and 90.';
    }
    if (!Number.isFinite(lngValue) || lngValue < -180 || lngValue > 180) {
      found.lng = 'Longitude must be between -180 and 180.';
    }

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSubmit({ lat: latValue, lng: lngValue });
  };

  return (
    <Modal
      title="Change location"
      subtitle="Shoppers use this to find bazaars and vendors near them."
      onClose={onCancel}
      footer={
        <>
          <button type="button" className={styles.cancel} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="submit"
            form="location-form"
            className={styles.save}
            disabled={waitSeconds > 0}
          >
            {waitSeconds > 0 ? `Wait ${waitSeconds}s` : 'Save location'}
          </button>
        </>
      }
    >
      <form id="location-form" className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* A picker needs map tiles, and the spec has no tiles endpoint — so
            the coordinates are entered directly, which is also exactly what
            the API takes. */}
        <div className={styles.plate} role="img" aria-label="Map placeholder">
          <MapPinIcon size={22} />
          <span>
            {lat || '—'}, {lng || '—'}
          </span>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="location-lat">
              Latitude
            </label>
            <input
              id="location-lat"
              className={`${styles.input} ${errors.lat ? styles.invalid : ''}`}
              type="number"
              step="0.0001"
              value={lat}
              onChange={(event) => setLat(event.target.value)}
            />
            {errors.lat && <span className={styles.error}>{errors.lat}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="location-lng">
              Longitude
            </label>
            <input
              id="location-lng"
              className={`${styles.input} ${errors.lng ? styles.invalid : ''}`}
              type="number"
              step="0.0001"
              value={lng}
              onChange={(event) => setLng(event.target.value)}
            />
            {errors.lng && <span className={styles.error}>{errors.lng}</span>}
          </div>
        </div>

        <p className={waitSeconds > 0 ? styles.limitWarning : styles.hint}>
          {waitSeconds > 0
            ? `You just moved your location. The API allows one change a minute — try again in ${waitSeconds}s.`
            : 'Location can be changed once a minute.'}
        </p>
      </form>
    </Modal>
  );
}
