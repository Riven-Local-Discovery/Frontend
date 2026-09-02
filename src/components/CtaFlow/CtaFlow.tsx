import type { ComponentType } from 'react';
import ctaImage from '../../assets/img/cta-felucca-nile-sunset.jpg';
import { useInView } from '../../hooks/useInView';
import { ArrowRightIcon, CalendarIcon, MapPinIcon, SpoolIcon } from '../icons';
import type { IconProps } from '../icons';
import styles from './CtaFlow.module.scss';

interface CtaCard {
  id: string;
  Icon: ComponentType<IconProps>;
  lineOne: string;
  lineTwo: string;
  href: string;
}

const CTA_CARDS: readonly CtaCard[] = [
  { id: 'shopper', Icon: MapPinIcon, lineOne: 'Join as a', lineTwo: 'Shopper', href: '#join-shopper' },
  { id: 'vendor', Icon: SpoolIcon, lineOne: 'Sell on', lineTwo: 'Riven', href: '#sell-on-riven' },
  { id: 'organizer', Icon: CalendarIcon, lineOne: 'List Your', lineTwo: 'Bazaar', href: '#list-your-bazaar' },
];

export default function CtaFlow() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.3 });

  const pathClass = [styles.flowPath, inView ? styles.flowPathDrawn : ''].join(' ');
  const glowClass = [styles.flowGlow, inView ? styles.flowPathDrawn : ''].join(' ');

  return (
    <section className={styles.section} id="experiences" ref={ref} aria-labelledby="cta-title">
      <div className={styles.media}>
        <img
          className={styles.image}
          src={ctaImage}
          alt="A felucca sailboat silhouetted on the Nile at sunset in orange and deep blue tones"
        />
      </div>
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true">—</span> Join the movement
          </p>
          <h2 className={styles.title} id="cta-title">
            Be Part of the Flow
          </h2>
          <p className={styles.lede}>
            Whether you want to discover, sell, or organize — Riven is your space.
          </p>
        </div>

        <ul className={styles.cards}>
          {CTA_CARDS.map(({ id, Icon, lineOne, lineTwo, href }) => (
            <li key={id}>
              <a className={styles.card} href={href}>
                <span className={styles.cardTop}>
                  <Icon className={styles.cardIcon} size={38} />
                  <span className={styles.cardLabel}>
                    <span className={styles.cardLabelSmall}>{lineOne}</span>
                    <span className={styles.cardLabelStrong}>{lineTwo}</span>
                  </span>
                </span>
                <ArrowRightIcon className={styles.cardArrow} size={26} />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <svg
        className={styles.flow}
        viewBox="0 0 460 300"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient
            id="ctaLineGradient"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="120"
            y2="300"
          >
            <stop offset="0%" className={styles.stopAccentSoft} />
            <stop offset="100%" className={styles.stopAccent} />
          </linearGradient>
          <filter id="ctaLineGlow" x="-60%" y="-20%" width="220%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        <path
          className={glowClass}
          d="M 60 -8 C 120 40, 230 62, 300 96 C 356 124, 372 168, 330 214 C 300 248, 258 262, 236 268"
          fill="none"
          stroke="url(#ctaLineGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          filter="url(#ctaLineGlow)"
          opacity="0.55"
        />
        <path
          className={pathClass}
          d="M 60 -8 C 120 40, 230 62, 300 96 C 356 124, 372 168, 330 214 C 300 248, 258 262, 236 268"
          fill="none"
          stroke="url(#ctaLineGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </section>
  );
}
