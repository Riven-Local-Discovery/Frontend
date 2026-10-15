import styles from './StatusPill.module.scss';
import type {
  ApplicationStatus,
  ApprovalStatus,
  OrderStatus,
  ProductVisibility,
} from '../types';

/** The five tones the dashboard's pills come in. */
export type PillTone = 'green' | 'amber' | 'red' | 'blue' | 'slate';

export interface StatusPillProps {
  children: React.ReactNode;
  tone: PillTone;
  /** Renders the label in caps, as the product table does. */
  uppercase?: boolean;
}

export default function StatusPill({ children, tone, uppercase = false }: StatusPillProps) {
  return (
    <span className={`${styles.pill} ${styles[tone]} ${uppercase ? styles.uppercase : ''}`}>
      {children}
    </span>
  );
}

/* --- Tone maps -----------------------------------------------------------
   Kept beside the component so every screen colours the same status the
   same way. Amber means "waiting on someone", blue "in motion", green
   "done", red "stopped". */

const ORDER_TONES: Record<OrderStatus, PillTone> = {
  PENDING: 'slate',
  PAID: 'amber',
  FULFILLED: 'blue',
  SHIPPED: 'blue',
  DELIVERED: 'green',
  CANCELLED: 'red',
};

export function orderTone(status: OrderStatus): PillTone {
  return ORDER_TONES[status];
}

const VISIBILITY_TONES: Record<ProductVisibility, PillTone> = {
  LIVE: 'green',
  PENDING: 'amber',
  REJECTED: 'red',
  INACTIVE: 'slate',
};

export function visibilityTone(visibility: ProductVisibility): PillTone {
  return VISIBILITY_TONES[visibility];
}

const APPROVAL_TONES: Record<ApprovalStatus, PillTone> = {
  APPROVED: 'green',
  PENDING: 'amber',
  REJECTED: 'red',
};

export function approvalTone(status: ApprovalStatus): PillTone {
  return APPROVAL_TONES[status];
}

const APPLICATION_TONES: Record<ApplicationStatus, PillTone> = {
  ACCEPTED: 'green',
  PENDING: 'amber',
  REJECTED: 'red',
};

export function applicationTone(status: ApplicationStatus): PillTone {
  return APPLICATION_TONES[status];
}
