import { CalendarIcon, MapPinIcon, UserIcon } from '../../icons';
import Modal from '../ui/Modal';
import StatusPill, { applicationTone } from '../ui/StatusPill';
import {
  applicationLabel,
  formatDate,
  formatDateRange,
  formatDistance,
  formatTime,
  formatTimeRange,
} from '../format';
import type { BazaarApplication } from '../types';
import styles from './ApplicationDetails.module.scss';

export interface ApplicationDetailsProps {
  application: BazaarApplication;
  /** Only offered while the application is still PENDING. */
  onWithdraw: (application: BazaarApplication) => void;
  onClose: () => void;
}

export default function ApplicationDetails({
  application,
  onWithdraw,
  onClose,
}: ApplicationDetailsProps) {
  const { bazaar } = application;
  const pending = application.applicationStatus === 'PENDING';

  return (
    <Modal
      title={bazaar.name}
      subtitle={`Applied ${formatDate(application.appliedAt)} at ${formatTime(application.appliedAt)}`}
      onClose={onClose}
      footer={
        <>
          <button type="button" className={styles.close} onClick={onClose}>
            Close
          </button>
          {pending && (
            <button
              type="button"
              className={styles.withdraw}
              onClick={() => onWithdraw(application)}
            >
              Withdraw application
            </button>
          )}
        </>
      }
    >
      <img className={styles.cover} src={bazaar.coverMedia[0]} alt="" />

      <div className={styles.topRow}>
        <StatusPill tone={applicationTone(application.applicationStatus)}>
          {applicationLabel(application.applicationStatus)}
        </StatusPill>
        <ul className={styles.tags}>
          {(application.tags ?? []).map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>

      <dl className={styles.facts}>
        <div>
          <dt>
            <UserIcon size={14} />
            Organizer
          </dt>
          <dd>{application.organizerName ?? '—'}</dd>
        </div>
        <div>
          <dt>
            <MapPinIcon size={14} />
            Location
          </dt>
          <dd>
            {application.locationLabel ?? '—'}
            {application.distanceKm !== undefined && (
              <span> · {formatDistance(application.distanceKm)} away</span>
            )}
          </dd>
        </div>
        <div>
          <dt>
            <CalendarIcon size={14} />
            Dates
          </dt>
          <dd>
            {formatDateRange(bazaar.startDate, bazaar.endDate)}
            <span> · {formatTimeRange(bazaar.startDate, bazaar.endDate)}</span>
          </dd>
        </div>
        <div>
          <dt>Decision</dt>
          <dd>
            {application.decidedAt
              ? `${applicationLabel(application.applicationStatus)} on ${formatDate(application.decidedAt)}`
              : 'Waiting on the organizer'}
          </dd>
        </div>
      </dl>

      {/* Accept and reject are final on the API side, so the state a vendor
          is looking at is the state it will stay in. */}
      {!pending && (
        <p className={styles.finalNote}>
          This decision is final. Organizers can&rsquo;t reverse an accept or a
          reject — apply again next time the bazaar opens.
        </p>
      )}
    </Modal>
  );
}
