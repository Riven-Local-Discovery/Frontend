import type { ComponentType } from 'react';
import heroImage from '../../assets/img/hero-river-night.jpg';
import { MouseIcon, PeopleIcon, SunIcon, WavesIcon } from '../icons';
import type { IconProps } from '../icons';
import styles from './Hero.module.scss';

interface HeroStat {
  id: string;
  Icon: ComponentType<IconProps>;
  value: string;
  label: string;
}

const HERO_STATS: readonly HeroStat[] = [
  { id: 'communities', Icon: WavesIcon, value: '1,250+', label: 'Communities' },
  { id: 'members', Icon: PeopleIcon, value: '15K+', label: 'Members' },
  { id: 'experiences', Icon: SunIcon, value: '320', label: 'Experiences' },
];

export default function Hero() {
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

          <aside className={styles.statCard} aria-label="Riven in numbers">
            <ul className={styles.statList}>
              {HERO_STATS.map(({ id, Icon, value, label }) => (
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
        </div>

        <div className={styles.scroll}>
          <MouseIcon className={styles.scrollMouse} size={46} />
          <span className={styles.scrollText}>Scroll to discover</span>
        </div>
      </div>
    </section>
  );
}
