import type { ComponentType } from 'react';
import { CalendarIcon, MapPinIcon, PeopleIcon, SunIcon } from '../icons';
import type { IconProps } from '../icons';
import styles from './StatsBand.module.scss';

interface BandStat {
  id: string;
  Icon: ComponentType<IconProps>;
  value: string;
  label: string;
}

const BAND_STATS: readonly BandStat[] = [
  { id: 'bazaars', Icon: SunIcon, value: '250+', label: 'Bazaars & Events Listed' },
  { id: 'vendors', Icon: PeopleIcon, value: '1,200+', label: 'Active Vendors' },
  { id: 'cities', Icon: MapPinIcon, value: '20+', label: 'Cities Across Egypt' },
  { id: 'members', Icon: CalendarIcon, value: '50K+', label: 'Community Members' },
];

export default function StatsBand() {
  return (
    <section className={styles.band} aria-label="Riven by the numbers">
      <span className={styles.ghost} aria-hidden="true">
        03
      </span>

      <div className={styles.inner}>
        <ul className={styles.list}>
          {BAND_STATS.map(({ id, Icon, value, label }) => (
            <li className={styles.item} key={id}>
              <Icon className={styles.icon} size={36} />
              <div className={styles.text}>
                <span className={styles.value}>{value}</span>
                <span className={styles.label}>{label}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
