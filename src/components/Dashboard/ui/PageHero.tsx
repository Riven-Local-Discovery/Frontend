import type { ReactNode } from 'react';
import heroImage from '../../../assets/img/Header background.jpeg';
import styles from './PageHero.module.scss';

export interface PageHeroProps {
  /** The small line above the title, e.g. "Manage your store". */
  eyebrow: string;
  title: string;
  lede?: string;
  /** The button or date picker pinned to the right end of the band. */
  action?: ReactNode;
}

/**
 * The dark photographic band at the top of each dashboard screen. The photo
 * is decorative, so it carries an empty alt and the whole layer is hidden
 * from assistive tech; the scrim behind the copy does the legibility work.
 */
export default function PageHero({ eyebrow, title, lede, action }: PageHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.media} aria-hidden="true">
        <img className={styles.image} src={heroImage} alt="" />
        <div className={styles.scrim} />
      </div>

      <div className={styles.copy}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        {lede && <p className={styles.lede}>{lede}</p>}
      </div>

      {action && <div className={styles.action}>{action}</div>}
    </section>
  );
}
