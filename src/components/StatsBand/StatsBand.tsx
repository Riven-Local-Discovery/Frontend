import { useEffect, useState, type ComponentType } from 'react';
import { formatCount, loadPublicStats, type PublicStats } from '../../lib/publicStats';
import { MapPinIcon, SunIcon } from '../icons';
import type { IconProps } from '../icons';
import styles from './StatsBand.module.scss';

interface BandStat {
  id: string;
  Icon: ComponentType<IconProps>;
  value: string;
  label: string;
}

/**
 * Real totals from the public endpoints. The band previously read "250+
 * Bazaars", "1,200+ Active Vendors", "20+ Cities" and "50K+ Community
 * Members", none of which came from anywhere.
 *
 * Vendors, cities and members have no public count: there is no public vendor
 * list, and the city of a bazaar is a lat/lng rather than a named place, so
 * "cities" cannot be counted at all. They are omitted instead of guessed.
 */
function bandStats(stats: PublicStats): readonly BandStat[] {
  return [
    { id: 'bazaars', Icon: SunIcon, value: formatCount(stats.bazaars), label: 'Bazaars & Events Listed' },
    { id: 'products', Icon: MapPinIcon, value: formatCount(stats.products), label: 'Products Listed' },
  ];
}

export default function StatsBand() {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    let live = true;
    void loadPublicStats().then((result) => {
      if (live) setStats(result);
    });
    return () => {
      live = false;
    };
  }, []);

  // The whole band is a numbers strip; with nothing to show it has no purpose.
  if (!stats) return null;

  return (
    <section className={styles.band} aria-label="Riven by the numbers">
      <span className={styles.ghost} aria-hidden="true" />

      <div className={styles.inner}>
        <ul className={styles.list}>
          {bandStats(stats).map(({ id, Icon, value, label }) => (
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
