import { useState } from 'react';
import coverImage from '../../../assets/img/Header background.jpeg';
import myLogo from '../../../assets/img/logo.png';
import {
  BookIcon,
  CalendarDaysIcon,
  CameraIcon,
  CheckCircleIcon,
  ClockIcon,
  ContactCardIcon,
  CubeIcon,
  FacebookIcon,
  ImageIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  SettingsIcon,
  ShieldCheckIcon,
  TikTokIcon,
} from '../../icons';
import StatCard from '../ui/StatCard';
import DeleteAccountDialog from './DeleteAccountDialog';
import LocationForm from './LocationForm';
import VendorProfileForm, { type VendorDraft } from './VendorProfileForm';
import { joinedLabel, vendorTypeLabel } from '../format';
import type { GeoPoint, Vendor } from '../types';
import styles from './VendorProfile.module.scss';

/** How many media tiles show before the rest collapse into a "+N" tile. */
const MEDIA_TILE_LIMIT = 3;

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'business', label: 'Business Details' },
  { id: 'policies', label: 'Policies' },
  { id: 'location', label: 'Location' },
  { id: 'story', label: 'Brand Story' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export interface VendorProfileProps {
  vendor: Vendor;
  /** Counts shown on the stat row, supplied by the shell. */
  productCount: number;
  activeProductCount: number;
  pendingProductCount: number;
  orderCount: number;
  contactEmail: string;
  contactPhone: string | null;
  /** PATCH /vendors/me. */
  onSave: (draft: VendorDraft) => void;
  /** PATCH /vendors/me/location. */
  onSaveLocation: (location: GeoPoint) => void;
  /** DELETE /users/me — takes the account password. */
  onDeleteAccount: (password: string) => void;
  /**
   * When the location endpoint last accepted a change, as a timestamp. The
   * API allows one update a minute; the form disables itself until then.
   */
  locationUpdatedAt?: number | null;
}

export default function VendorProfile({
  vendor,
  productCount,
  activeProductCount,
  pendingProductCount,
  orderCount,
  contactEmail,
  contactPhone,
  onSave,
  onSaveLocation,
  onDeleteAccount,
  locationUpdatedAt,
}: VendorProfileProps) {
  const [tab, setTab] = useState<TabId>('overview');

  /* Every pencil, "Edit Profile" and "Update Business Info" opens the same
     form — they're all views onto one PATCH /vendors/me body. */
  const [editing, setEditing] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const tiles = vendor.coverMedia.slice(0, MEDIA_TILE_LIMIT);
  const overflow = vendor.coverMedia.length - tiles.length;

  /* Rendered by more than one tab, so it's built once here. */
  const businessCard = (
    <section className={styles.card}>
      <header className={styles.cardHead}>
        <h2 className={styles.cardTitle}>
          <BookIcon size={17} />
          Business Information
        </h2>
      </header>

      <dl className={styles.fields}>
        <div className={styles.field}>
          <dt>Business Name</dt>
          <dd>{vendor.name}</dd>
        </div>
        <div className={styles.field}>
          <dt>Category</dt>
          <dd className={styles.accentValue}>{vendor.category}</dd>
        </div>
        <div className={styles.field}>
          <dt>Vendor Type</dt>
          <dd>{vendorTypeLabel(vendor.vendorType)}</dd>
        </div>
        <div className={styles.field}>
          <dt>Description</dt>
          <dd>{vendor.description ?? '—'}</dd>
        </div>
        <div className={styles.field}>
          <dt>Brand Story</dt>
          <dd>{vendor.brandStory ?? '—'}</dd>
        </div>
        <div className={styles.field}>
          <dt>Website</dt>
          <dd>—</dd>
        </div>
        <div className={styles.field}>
          <dt>Social Media</dt>
          <dd className={styles.socials}>
            <a href="#instagram" aria-label="Instagram">
              <InstagramIcon size={15} />
            </a>
            <a href="#facebook" aria-label="Facebook">
              <FacebookIcon size={15} />
            </a>
            <a href="#tiktok" aria-label="TikTok">
              <TikTokIcon size={15} />
            </a>
          </dd>
        </div>
      </dl>

      <div
        className={`${styles.verification} ${
          vendor.verified ? styles.verified : styles.unverified
        }`}
      >
        {vendor.verified ? <CheckCircleIcon size={20} /> : <ClockIcon size={20} />}
        <div>
          <strong>Verification Status</strong>
          <p>{vendor.verified ? 'Verified Vendor' : 'Awaiting verification'}</p>
          <span>
            {vendor.verified
              ? 'Your business is verified and visible to customers.'
              : 'Your products stay hidden from shoppers until an admin verifies your business.'}
          </span>
        </div>
      </div>
    </section>
  );

  const mediaCard = (
    <section className={styles.card}>
      <header className={styles.cardHead}>
        <h2 className={styles.cardTitle}>
          <ImageIcon size={17} />
          Media
        </h2>
      </header>

      <div className={styles.mediaGroup}>
        <div className={styles.mediaLabel}>
          Logo
          <button
            type="button"
            className={styles.editButton}
            aria-label="Edit logo"
            onClick={() => setEditing(true)}
          >
            <PencilIcon size={14} />
          </button>
        </div>
        <span className={styles.logoTile}>
          <img src={vendor.logoUrl ?? myLogo} alt="" />
        </span>
      </div>

      <div className={styles.mediaGroup}>
        <div className={styles.mediaLabel}>
          Cover Media
          <button
            type="button"
            className={styles.editButton}
            aria-label="Edit cover media"
            onClick={() => setEditing(true)}
          >
            <PencilIcon size={14} />
          </button>
        </div>
        <ul className={styles.mediaTiles}>
          {tiles.map((url, index) => (
            <li key={url}>
              <img src={url} alt={`Cover image ${index + 1}`} />
            </li>
          ))}
          {overflow > 0 && <li className={styles.mediaMore}>+{overflow}</li>}
        </ul>
      </div>

      <div className={styles.mediaGroup}>
        <div className={styles.mediaLabel}>
          Gallery
          <button
            type="button"
            className={styles.editButton}
            aria-label="Edit gallery"
            onClick={() => setEditing(true)}
          >
            <PencilIcon size={14} />
          </button>
        </div>
        <ul className={styles.mediaTiles}>
          {tiles.map((url, index) => (
            <li key={`gallery-${url}`}>
              <img src={url} alt={`Gallery image ${index + 1}`} />
            </li>
          ))}
          {overflow > 0 && <li className={styles.mediaMore}>+{overflow}</li>}
        </ul>
      </div>
    </section>
  );

  const locationCard = (
    <section className={styles.card}>
      <header className={styles.cardHead}>
        <h2 className={styles.cardTitle}>
          <MapPinIcon size={17} />
          Location
        </h2>
      </header>

      {vendor.location ? (
        <>
          {/* A static plate stands in for the map. The spec has no tiles
              endpoint, and PATCH /vendors/me/location takes a lat/lng pair
              rather than a picked point, so there is nothing to render live
              against yet. */}
          <div className={styles.mapPlate} role="img" aria-label="Map placeholder">
            <MapPinIcon size={22} />
            <span>Cairo</span>
          </div>
          <div className={styles.coords}>
            <MapPinIcon size={14} />
            {vendor.location.lat.toFixed(4)}° N, {vendor.location.lng.toFixed(4)}° E
            <button
              type="button"
              className={styles.editButton}
              aria-label="Change location"
              onClick={() => setEditingLocation(true)}
            >
              <PencilIcon size={14} />
            </button>
          </div>
        </>
      ) : (
        <p className={styles.emptyNote}>
          No location set yet. Add one so shoppers nearby can find you.
        </p>
      )}
    </section>
  );

  const dangerCard = (
    <section className={`${styles.card} ${styles.dangerCard}`}>
      <header className={styles.cardHead}>
        <h2 className={styles.cardTitle}>Danger zone</h2>
      </header>
      <p className={styles.dangerNote}>
        Deleting your account closes your Riven sign-in and hides your
        storefront. It can&rsquo;t be undone.
      </p>
      <button
        type="button"
        className={styles.dangerButton}
        onClick={() => setDeletingAccount(true)}
      >
        Delete account
      </button>
    </section>
  );

  const policiesCard = (
    <section className={styles.card}>
      <header className={styles.cardHead}>
        <h2 className={styles.cardTitle}>
          <ShieldCheckIcon size={17} />
          Policies
        </h2>
        <button
          type="button"
          className={styles.editButton}
          aria-label="Edit policies"
          onClick={() => setEditing(true)}
        >
          <PencilIcon size={14} />
        </button>
      </header>

      <dl className={styles.fields}>
        <div className={styles.field}>
          <dt>Return Policy</dt>
          <dd>{vendor.returnPolicy ?? 'Not set yet.'}</dd>
        </div>
        <div className={styles.field}>
          <dt>Shipping Policy</dt>
          <dd>{vendor.shippingPolicy ?? 'Not set yet.'}</dd>
        </div>
      </dl>
    </section>
  );

  const storyCard = (
    <section className={styles.card}>
      <header className={styles.cardHead}>
        <h2 className={styles.cardTitle}>
          <BookIcon size={17} />
          Brand Story
        </h2>
        <button
          type="button"
          className={styles.editButton}
          aria-label="Edit brand story"
          onClick={() => setEditing(true)}
        >
          <PencilIcon size={14} />
        </button>
      </header>
      <p className={styles.story}>{vendor.brandStory ?? 'No brand story yet.'}</p>
    </section>
  );

  return (
    <div className={styles.page}>
      {/* --- Identity header --- */}
      <section className={styles.header}>
        <div className={styles.cover}>
          <img src={vendor.bannerUrl ?? coverImage} alt="" aria-hidden="true" />
        </div>

        <div className={styles.identity}>
          <div className={styles.avatarWrap}>
            <span className={styles.avatar}>
              <img src={vendor.logoUrl ?? myLogo} alt="" />
            </span>
            <button
              type="button"
              className={styles.avatarBadge}
              aria-label="Change logo"
              onClick={() => setEditing(true)}
            >
              <CameraIcon size={13} />
            </button>
          </div>

          <div className={styles.identityText}>
            <h1 className={styles.vendorName}>
              {vendor.name}
              {vendor.verified && (
                <CheckCircleIcon
                  className={styles.verifiedMark}
                  size={19}
                  aria-label="Verified vendor"
                />
              )}
            </h1>
            <p className={styles.tagline}>Handmade • Home Decor • Accessories</p>
            <p className={styles.subMeta}>
              <MapPinIcon size={13} />
              Cairo, Egypt
              <span className={styles.dot} aria-hidden="true" />
              {joinedLabel(vendor)}
            </p>
          </div>

          <button type="button" className={styles.editProfile} onClick={() => setEditing(true)}>
            <PencilIcon size={14} />
            Edit Profile
          </button>
        </div>

        <nav className={styles.tabs} aria-label="Profile sections">
          {TABS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={`${styles.tab} ${tab === entry.id ? styles.tabActive : ''}`}
              aria-current={tab === entry.id ? 'true' : undefined}
              onClick={() => setTab(entry.id)}
            >
              {entry.label}
            </button>
          ))}
        </nav>
      </section>

      <div className={styles.statGrid}>
        <StatCard
          label="Total Products"
          value={productCount}
          icon={CubeIcon}
          tone="slate"
          delta={{ value: '12%', note: 'vs last 30 days', direction: 'up' }}
        />
        <StatCard
          label="Total Orders"
          value={orderCount}
          icon={CalendarDaysIcon}
          tone="blue"
          delta={{ value: '12%', note: 'vs last 30 days', direction: 'up' }}
        />
        <StatCard
          label="Active Products"
          value={activeProductCount}
          icon={CheckCircleIcon}
          tone="green"
          delta={{ value: '20%', note: 'vs last 30 days', direction: 'up' }}
        />
        <StatCard
          label="Pending Approval"
          value={pendingProductCount}
          icon={ClockIcon}
          tone="amber"
          delta={{ value: '1', note: 'this week', direction: 'up', tone: 'negative' }}
        />
      </div>

      {/* --- Tab panels ---
          Overview is the full three-column board; the other tabs narrow to
          the one thing they're about. */}
      {tab === 'overview' && (
        <div className={styles.board}>
          {businessCard}
          {mediaCard}
          <div className={styles.sideColumn}>
            <section className={styles.card}>
              <header className={styles.cardHead}>
                <h2 className={styles.cardTitle}>
                  <ContactCardIcon size={17} />
                  Contact Information
                </h2>
                <button
                  type="button"
                  className={styles.editButton}
                  aria-label="Edit contact information"
                  onClick={() => setEditing(true)}
                >
                  <PencilIcon size={14} />
                </button>
              </header>

              <ul className={styles.contactList}>
                <li>
                  <MailIcon size={15} />
                  <span>Email</span>
                  <strong>{contactEmail}</strong>
                </li>
                <li>
                  <PhoneIcon size={15} />
                  <span>Phone</span>
                  <strong>{contactPhone ?? '—'}</strong>
                </li>
                <li>
                  <MapPinIcon size={15} />
                  <span>Address</span>
                  <strong>Cairo, Egypt</strong>
                </li>
              </ul>
            </section>

            {locationCard}

            <section className={styles.card}>
              <header className={styles.cardHead}>
                <h2 className={styles.cardTitle}>
                  <SettingsIcon size={17} />
                  Quick Actions
                </h2>
              </header>
              <div className={styles.quickActions}>
                <button
                  type="button"
                  className={styles.quickPrimary}
                  onClick={() => setEditing(true)}
                >
                  <PencilIcon size={14} />
                  Update Business Info
                </button>
                <button
                  type="button"
                  className={styles.quickGhost}
                  onClick={() => setEditingLocation(true)}
                >
                  <MapPinIcon size={14} />
                  Change Location
                </button>
              </div>
            </section>

            {dangerCard}
          </div>
        </div>
      )}

      {tab === 'business' && (
        <>
          <div className={styles.pair}>
            {businessCard}
            {mediaCard}
          </div>
          <div className={styles.single}>{dangerCard}</div>
        </>
      )}

      {tab === 'policies' && <div className={styles.single}>{policiesCard}</div>}

      {tab === 'location' && <div className={styles.single}>{locationCard}</div>}

      {tab === 'story' && <div className={styles.single}>{storyCard}</div>}

      {editing && (
        <VendorProfileForm
          vendor={vendor}
          onCancel={() => setEditing(false)}
          onSubmit={(draft) => {
            onSave(draft);
            setEditing(false);
          }}
        />
      )}

      {editingLocation && (
        <LocationForm
          location={vendor.location}
          /* The endpoint allows one change a minute, so the form needs to
             know when the last one landed. */
          rateLimitedUntil={locationUpdatedAt ? locationUpdatedAt + 60_000 : null}
          onCancel={() => setEditingLocation(false)}
          onSubmit={(location) => {
            onSaveLocation(location);
            setEditingLocation(false);
          }}
        />
      )}

      {deletingAccount && (
        <DeleteAccountDialog
          businessName={vendor.name}
          onCancel={() => setDeletingAccount(false)}
          onConfirm={(password) => {
            onDeleteAccount(password);
            setDeletingAccount(false);
          }}
        />
      )}
    </div>
  );
}
