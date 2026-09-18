import type { ComponentType } from "react";
import {
  FacebookIcon,
  InstagramIcon,
  RivenMark,
  TikTokIcon,
  YouTubeIcon,
} from "../icons";
import type { IconProps } from "../icons";
import styles from "./SiteFooter.module.scss";
import myLogo from "../../assets/img/logo.png";

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
    heading: "For Shoppers",
    links: [
      { label: "Bazaars & Events", href: "#bazaars-events" },
      { label: "Explore Cities", href: "#explore-cities" },
      { label: "Brands", href: "#brands" },
      { label: "Riven Community", href: "#riven-community" },
    ],
  },
  {
    heading: "For Vendors",
    links: [
      { label: "Sell on Riven", href: "#sell-on-riven" },
      { label: "Vendor Resources", href: "#vendor-resources" },
      { label: "Success Stories", href: "#success-stories" },
      { label: "Vendor Community", href: "#vendor-community" },
    ],
  },
  {
    heading: "For Organizers",
    links: [
      { label: "List Your Bazaar", href: "#list-your-bazaar" },
      { label: "Organizer Guide", href: "#organizer-guide" },
      { label: "Resources", href: "#resources" },
      { label: "Organizer Community", href: "#organizer-community" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Riven", href: "#about-riven" },
      { label: "Our Story", href: "#our-story" },
      { label: "Careers", href: "#careers" },
      { label: "Contact Us", href: "#contact-us" },
    ],
  },
];

const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    id: "instagram",
    label: "Riven on Instagram",
    href: "https://www.instagram.com/riven.discover?igsi=eHI5amxlYWhiaXNr",
    Icon: InstagramIcon,
  },
  {
    id: "facebook",
    label: "Riven on Facebook",
    href: "https://www.facebook.com/share/18rwu32LcX/",
    Icon: FacebookIcon,
  },
  {
    id: "tiktok",
    label: "Riven on TikTok",
    href: "https://www.tiktok.com/@riven.local.disco?_r=1&_t=ZS-99PLw7sxuhZ",
    Icon: TikTokIcon,
  },
];

export default function SiteFooter() {
  return (
    <footer className={styles.footer} id="about">
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <a
              className={styles.logo}
              href="#top"
              aria-label="Riven - home"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <img
                src={myLogo}
                alt="Logo"
                style={{ height: "20px", width: "auto", display: "block" }}
              />

              <span className={styles.wordmark}>iven</span>
            </a>
            <p className={styles.tagline}>
              Riven is the digital Nile — connecting Egypt&apos;s bazaars,
              brands, and people.
            </p>
            <ul className={styles.socials}>
              {SOCIAL_LINKS.map(({ id, label, href, Icon }) => (
                <li key={id}>
                  <a className={styles.social} href={href} aria-label={label}>
                    <Icon size={30} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav
              className={styles.column}
              key={column.heading}
              aria-label={column.heading}
            >
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
             <span className={styles.mantraWord}>
              <span className={styles.dot} aria-hidden="true" />
              Discover
            </span>
            <span className={styles.mantraWord}>
              <span className={styles.dot} aria-hidden="true" />
              Connect
            </span>
            <span className={styles.mantraWord}>
              <span  aria-hidden="true" />
              
            <svg
              className={styles.ripple}
              viewBox="0 0 120 60"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <filter
                  id="footerRippleGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="3" />
                </filter>
              </defs>
              <ellipse
                className={styles.rippleRing}
                cx="60"
                cy="30"
                rx="30"
                ry="9"
                opacity="0.22"
              />
              <ellipse
                className={styles.rippleRing}
                cx="60"
                cy="30"
                rx="19"
                ry="6"
                opacity="0.4"
              />
              <ellipse
                className={styles.rippleRingInner}
                cx="60"
                cy="30"
                rx="9"
                ry="3"
                opacity="0.7"
              />
              <circle
                className={styles.rippleCore}
                cx="60"
                cy="30"
                r="3"
                filter="url(#footerRippleGlow)"
              />
              <circle cx="60" cy="30" r="1.8" fill="#ffd7c4" />
            </svg>
              <span id="belong" className={styles.belongText}>Belong</span>
            </span>

          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>© 2025 Riven. All rights reserved.</p>
         
        </div>
      </div>
    </footer>
  );
}
