import { useEffect, useState, type ComponentType } from 'react';
import heroImage from '../../assets/img/hero-river-night.jpg';
import { formatCount, loadPublicStats, type PublicStats } from '../../lib/publicStats';
import { MouseIcon, SunIcon, WavesIcon } from '../icons';
import type { IconProps } from '../icons';
import styles from './Hero.module.scss';

interface HeroStat {
  id: string;
  Icon: ComponentType<IconProps>;
  value: string;
  label: string;
}

/**
 * Counted from the public catalogue instead of written by hand. This card used
 * to claim "1,250+ Communities" and "15K+ Members" against a database holding
 * a handful of rows.
 *
 * Only what a logged-out visitor can genuinely read appears here. There is no
 * public vendor or member count — /admin/overview is ADMIN-only and
 * /search/vendors needs a query, so its hit count is not a total — so those
 * tiles are gone rather than invented.
 */
function heroStats(stats: PublicStats): readonly HeroStat[] {
  return [
    { id: 'bazaars', Icon: WavesIcon, value: formatCount(stats.bazaars), label: 'Bazaars & Events' },
    { id: 'products', Icon: SunIcon, value: formatCount(stats.products), label: 'Products Listed' },
  ];
}

export default function Hero() {
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

  const tiles = stats ? heroStats(stats) : [];

  return (
    <section className={styles.hero} id="top" aria-labelledby="hero-title">
      <div className={styles.media}>
        <img
          className={styles.image}
          src={heroImage}
          alt="Aerial night view of a glowing river winding through dark mountains as the sun sets on the horizon"
        />
      </div>
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.content}>
          <div className={styles.copy}>
            <h1 className={styles.title} id="hero-title">
              Find Your <span className={styles.titleAccent}>Flow.</span>
            </h1>

            <p className={styles.lede}>
              Discover places, connect with people,
              <br />
              and belong to communities inspired
              <br />
              by the journey.
            </p>

            <div className={styles.buttons}>
              <a className={styles.btnFilled} href="#explore">
                Explore
              </a>
              <a className={styles.btnOutline} href="#learn-more">
                Learn More
              </a>
            </div>
          </div>

          {/* Hidden until the counts arrive: an empty card is better than one
              showing zeros that really mean "not loaded yet". */}
          {tiles.length > 0 && (
            <aside className={styles.statCard} aria-label="Riven in numbers">
              <ul className={styles.statList}>
                {tiles.map(({ id, Icon, value, label }) => (
                  <li className={styles.statRow} key={id}>
                    <Icon className={styles.statIcon} size={38} />
                    <div className={styles.statText}>
                      <span className={styles.statValue}>{value}</span>
                      <span className={styles.statLabel}>{label}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>

        <div className={styles.scroll}>
          <MouseIcon className={styles.scrollMouse} size={46} />
          <span className={styles.scrollText}>Scroll to discover</span>
        </div>
      </div>
    </section>
  );
}
