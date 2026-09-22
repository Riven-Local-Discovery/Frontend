import type { ComponentType } from 'react';
import { ArrowDownIcon, ArrowFlatIcon, ArrowUpIcon, type IconProps } from '../../icons';
import styles from './StatCard.module.scss';

/** Tints the icon bubble. Matches the status pill tones. */
export type StatTone = 'green' | 'amber' | 'red' | 'blue' | 'slate';

/**
 * The delta line under a stat. `direction` is stated rather than derived from
 * the sign of `value`, because "0 this week" is flat, not negative, and
 * because a falling cancellation count is good news while a falling sales
 * figure is not — the caller decides which reading applies.
 */
export interface StatDelta {
  /** The figure itself — "3", "12%". Takes the direction's colour. */
  value: string;
  /** The qualifier after it — "this week", "vs last 30 days". Stays muted. */
  note: string;
  direction: 'up' | 'down' | 'flat';
  /** Overrides the default colour (up = green, down = red, flat = muted). */
  tone?: 'positive' | 'negative' | 'neutral';
}

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: ComponentType<IconProps>;
  tone?: StatTone;
  delta?: StatDelta;
}

const ARROWS = {
  up: ArrowUpIcon,
  down: ArrowDownIcon,
  flat: ArrowFlatIcon,
} as const;

const DEFAULT_TONES = {
  up: 'positive',
  down: 'negative',
  flat: 'neutral',
} as const;

export default function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'slate',
  delta,
}: StatCardProps) {
  const Arrow = delta ? ARROWS[delta.direction] : null;
  const deltaTone = delta ? (delta.tone ?? DEFAULT_TONES[delta.direction]) : 'neutral';

  return (
    <article className={styles.card}>
      <span className={`${styles.bubble} ${styles[tone]}`} aria-hidden="true">
        <Icon size={20} />
      </span>

      <div className={styles.body}>
        <p className={styles.label}>{label}</p>
        <p className={styles.value}>{value}</p>

        {delta && Arrow && (
          <p className={styles.delta}>
            <span className={styles[deltaTone]}>
              <Arrow size={11} />
              {delta.value}
            </span>
            {delta.note}
          </p>
        )}
      </div>
    </article>
  );
}
