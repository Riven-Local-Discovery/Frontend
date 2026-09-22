import myLogo from '../../assets/img/logo.png';
import sidebarImage from '../../assets/img/Sidebar background.jpeg';
import {
  BagIcon,
  CalendarDaysIcon,
  ClipboardIcon,
  HomeIcon,
  UserIcon,
  type IconProps,
} from '../icons';
import type { ComponentType } from 'react';
import styles from './Sidebar.module.scss';

/** The five destinations of the vendor dashboard. */
export type DashboardView = 'overview' | 'products' | 'orders' | 'applications' | 'profile';

interface NavEntry {
  view: DashboardView;
  label: string;
  icon: ComponentType<IconProps>;
}

const NAV: readonly NavEntry[] = [
  { view: 'overview', label: 'Dashboard', icon: HomeIcon },
  { view: 'products', label: 'Products', icon: BagIcon },
  { view: 'orders', label: 'Orders', icon: ClipboardIcon },
  { view: 'applications', label: 'Bazaar Applications', icon: CalendarDaysIcon },
  { view: 'profile', label: 'Profile', icon: UserIcon },
];

export interface SidebarProps {
  active: DashboardView;
  onNavigate: (view: DashboardView) => void;
  /** Returns to the marketing site from the wordmark. */
  onLogoClick?: () => void;
  /** Mobile only: the drawer is open. Ignored from the tablet breakpoint up. */
  open?: boolean;
  onDismiss?: () => void;
}

export default function Sidebar({
  active,
  onNavigate,
  onLogoClick,
  open = false,
  onDismiss,
}: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
      <img className={styles.backdrop} src={sidebarImage} alt="" aria-hidden="true" />
      <div className={styles.veil} aria-hidden="true" />

      <div className={styles.inner}>
        <button type="button" className={styles.brand} onClick={onLogoClick}>
          <img className={styles.logo} src={myLogo} alt="" />
          <span className={styles.brandText}>
            <span className={styles.wordmark}>iven</span>
            <span className={styles.tagline}>Discover. Connect. Belong.</span>
          </span>
        </button>

        <nav className={styles.nav} aria-label="Dashboard">
          <ul>
            {NAV.map(({ view, label, icon: Icon }) => {
              const isActive = view === active;
              return (
                <li key={view}>
                  <button
                    type="button"
                    className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => {
                      onNavigate(view);
                      onDismiss?.();
                    }}
                  >
                    <Icon size={20} />
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <p className={styles.footer}>
          Local Creators.
          <br />
          Real Communities.
          <br />
          Lasting Impact.
        </p>
      </div>
    </aside>
  );
}
