import { BellIcon, CheckCircleIcon, ChevronDownIcon, MenuIcon } from '../icons';
import { SearchField } from './ui/Controls';
import styles from './Topbar.module.scss';

export interface TopbarProps {
  /** Placeholder for the global search — each screen scopes it differently. */
  searchPlaceholder: string;
  search: string;
  onSearchChange: (value: string) => void;
  userName: string;
  userRole: string;
  /** Drives the "Verified Vendor" badge; unverified vendors see a prompt. */
  verified: boolean;
  /** Shows the red dot on the bell. */
  unreadCount?: number;
  onOpenMenu?: () => void;
  onProfileClick?: () => void;
}

/** Initials fallback for the avatar, since vendors have no photo field yet. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function Topbar({
  searchPlaceholder,
  search,
  onSearchChange,
  userName,
  userRole,
  verified,
  unreadCount = 0,
  onOpenMenu,
  onProfileClick,
}: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <button
        type="button"
        className={styles.burger}
        aria-label="Open navigation"
        onClick={onOpenMenu}
      >
        <MenuIcon size={20} />
      </button>

      <div className={styles.search}>
        <SearchField
          value={search}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.bell}
          aria-label={
            unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'
          }
        >
          <BellIcon size={19} />
          {unreadCount > 0 && <span className={styles.dot} />}
        </button>

        {verified ? (
          <span className={styles.badge}>
            <CheckCircleIcon size={15} />
            Verified Vendor
          </span>
        ) : (
          <span className={`${styles.badge} ${styles.badgePending}`}>
            Awaiting verification
          </span>
        )}

        <button type="button" className={styles.account} onClick={onProfileClick}>
          <span className={styles.avatar} aria-hidden="true">
            {initials(userName)}
          </span>
          <span className={styles.identity}>
            <strong>{userName}</strong>
            <span>{userRole}</span>
          </span>
          <ChevronDownIcon size={15} />
        </button>
      </div>
    </header>
  );
}
