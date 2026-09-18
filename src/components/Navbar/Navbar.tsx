import { useState, useEffect } from 'react';
import { CloseIcon, MenuIcon } from '../icons';
import styles from './Navbar.module.scss';
import myLogo from '../../assets/img/logo.png'; 
import { motion } from 'framer-motion';

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

export interface NavbarProps {
  /** Called when "Join Now" is clicked, instead of following the #join anchor. */
  onJoinClick?: () => void;
  /** Called when "Sign In" is clicked, instead of following the #signin anchor. */
  onSignInClick?: () => void;
}

export default function Navbar({ onJoinClick, onSignInClick }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock the page behind the mobile overlay and let Escape close it.
  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* أنيميشن كشف اللوجو في مكانه من اليمين للشمال */}
        <motion.a
          className={styles.logo}
          href="#top"
          aria-label="Riven - home"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          initial={{ clipPath: 'inset(0 0 0 100%)', opacity: 0.3 }}
          animate={{ clipPath: 'inset(0 0 0 0%)', opacity: 1 }}
          transition={{
            duration: 1.1,
            ease: [0.25, 1, 0.5, 1],
            delay: 0.15
          }}
        >
          <img 
            src={myLogo} 
            alt="Logo" 
            style={{ height: '36px', width: 'auto', display: 'block' }} 
          />
          <span className={styles.wordmark}>iven</span>
        </motion.a>

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
          <a
            className={styles.signIn}
            href="#signin"
            onClick={(event) => {
              if (onSignInClick) {
                event.preventDefault();
                onSignInClick();
              }
            }}
          >
            Sign In
          </a>
          <a
            className={styles.join}
            href="#join"
            onClick={(event) => {
              if (onJoinClick) {
                event.preventDefault();
                onJoinClick();
              }
            }}
          >
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
            <a
              className={styles.signIn}
              href="#signin"
              onClick={(event) => {
                setMenuOpen(false);
                if (onSignInClick) {
                  event.preventDefault();
                  onSignInClick();
                }
              }}
            >
              Sign In
            </a>
            <a
              className={styles.join}
              href="#join"
              onClick={(event) => {
                setMenuOpen(false);
                if (onJoinClick) {
                  event.preventDefault();
                  onJoinClick();
                }
              }}
            >
              Join Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}