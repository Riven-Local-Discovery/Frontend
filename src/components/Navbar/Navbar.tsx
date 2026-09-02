import { useState } from 'react';
import { CloseIcon, MenuIcon, RivenMark } from '../icons';
import styles from './Navbar.module.scss';

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: readonly NavLink[] = [
  { label: 'Explore', href: '#explore' },
  { label: 'Communities', href: '#communities' },
  { label: 'Experiences', href: '#experiences' },
  { label: 'About', href: '#about' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.logo} href="#top" aria-label="Riven — home">
          <RivenMark className={styles.mark} size={76} />
          <span className={styles.wordmark}>Riven</span>
        </a>

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a className={styles.navLink} href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a className={styles.signIn} href="#sign-in">
            Sign In
          </a>
          <a className={styles.join} href="#join">
            Join Now
          </a>
        </div>

        <button
          className={styles.burger}
          type="button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {menuOpen && (
        <div className={styles.overlay}>
          <nav aria-label="Mobile">
            <ul className={styles.overlayList}>
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    className={styles.overlayLink}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.overlayActions}>
            <a className={styles.signIn} href="#sign-in" onClick={() => setMenuOpen(false)}>
              Sign In
            </a>
            <a className={styles.join} href="#join" onClick={() => setMenuOpen(false)}>
              Join Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
