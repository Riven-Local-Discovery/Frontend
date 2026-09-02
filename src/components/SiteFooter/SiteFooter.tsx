import type { ComponentType } from 'react';
import {
  FacebookIcon,
  InstagramIcon,
  RivenMark,
  TikTokIcon,
  YouTubeIcon,
} from '../icons';
import type { IconProps } from '../icons';
import styles from './SiteFooter.module.scss';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  heading: string;
  links: readonly FooterLink[];
}

interface SocialLink {
  id: string;
  label: string;
  href: string;
  Icon: ComponentType<IconProps>;
}

const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    heading: 'For Shoppers',
    links: [
      { label: 'Bazaars & Events', href: '#bazaars-events' },
      { label: 'Explore Cities', href: '#explore-cities' },
      { label: 'Brands', href: '#brands' },
      { label: 'Riven Community', href: '#riven-community' },
    ],
  },
  {
    heading: 'For Vendors',
    links: [
      { label: 'Sell on Riven', href: '#sell-on-riven' },
      { label: 'Vendor Resources', href: '#vendor-resources' },
      { label: 'Success Stories', href: '#success-stories' },
      { label: 'Vendor Community', href: '#vendor-community' },
    ],
  },
  {
    heading: 'For Organizers',
    links: [
      { label: 'List Your Bazaar', href: '#list-your-bazaar' },
      { label: 'Organizer Guide', href: '#organizer-guide' },
      { label: 'Resources', href: '#resources' },
      { label: 'Organizer Community', href: '#organizer-community' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Riven', href: '#about-riven' },
      { label: 'Our Story', href: '#our-story' },
      { label: 'Careers', href: '#careers' },
      { label: 'Contact Us', href: '#contact-us' },
    ],
  },
];

const SOCIAL_LINKS: readonly SocialLink[] = [
  { id: 'instagram', label: 'Riven on Instagram', href: '#instagram', Icon: InstagramIcon },
  { id: 'facebook', label: 'Riven on Facebook', href: '#facebook', Icon: FacebookIcon },
  { id: 'tiktok', label: 'Riven on TikTok', href: '#tiktok', Icon: TikTokIcon },
  { id: 'youtube', label: 'Riven on YouTube', href: '#youtube', Icon: YouTubeIcon },
];

export default function SiteFooter() {
  return (
    <footer className={styles.footer} id="about">
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <a className={styles.logo} href="#top" aria-label="Riven — home">
              <RivenMark className={styles.mark} size={44} />
              <span className={styles.wordmark}>Riven</span>
            </a>
            <p className={styles.tagline}>
              Riven is the digital Nile — connecting Egypt&apos;s bazaars, brands, and people.
            </p>
            <ul className={styles.socials}>
              {SOCIAL_LINKS.map(({ id, label, href, Icon }) => (
                <li key={id}>
                  <a className={styles.social} href={href} aria-label={label}>
                    <Icon size={22} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav className={styles.column} key={column.heading} aria-label={column.heading}>
              <h2 className={styles.columnHeading}>{column.heading}</h2>
              <ul className={styles.columnList}>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a className={styles.columnLink} href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className={styles.mantra}>
            <span className={styles.mantraWord}>Discover</span>
            <span className={styles.mantraWord}>
              <span className={styles.dot} aria-hidden="true" />
              Connect
            </span>
            <span className={styles.mantraWord}>
              <span className={styles.dot} aria-hidden="true" />
              Belong
            </span>

            <svg
              className={styles.ripple}
              viewBox="0 0 120 60"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <filter id="footerRippleGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" />
                </filter>
              </defs>
              <ellipse className={styles.rippleRing} cx="60" cy="30" rx="30" ry="9" opacity="0.22" />
              <ellipse className={styles.rippleRing} cx="60" cy="30" rx="19" ry="6" opacity="0.4" />
              <ellipse className={styles.rippleRingInner} cx="60" cy="30" rx="9" ry="3" opacity="0.7" />
              <circle className={styles.rippleCore} cx="60" cy="30" r="3" filter="url(#footerRippleGlow)" />
              <circle cx="60" cy="30" r="1.8" fill="#ffd7c4" />
            </svg>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>© 2025 Riven. All rights reserved.</p>
          <p className={styles.lang}>
            <span className={styles.langInactive}>AR</span>
            <span className={styles.langSep} aria-hidden="true">
              |
            </span>
            <span className={styles.langActive}>EN</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
