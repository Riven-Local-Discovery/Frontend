/* ==========================================================================
   RIVEN — hand-written inline SVG icons
   Every icon is a plain function component. No icon package is used.
   ========================================================================== */

import { useId } from 'react';

export interface IconProps {
  className?: string;
  /** Size in design pixels; emitted as rem so icons scale with the layout. */
  size?: number;
  strokeWidth?: number;
}

/** Design pixels -> rem, so every icon scales with the root font size. */
const rem = (px: number): string => `${px / 16}rem`;

/* --- Brand -------------------------------------------------------------- */

/**
 * The Riven "R": a calligraphic ribbon mark built from two tapered strokes —
 * a crescent bowl that runs from a hairline at the left into a thick right
 * hook, and a swash leg that sweeps out of the bowl's tail down to a point.
 */
export function RivenMark({ className, size = 28 }: IconProps) {
  /* useId() emits colons, which are unsafe inside a url(#...) reference. */
  const gradientId = `rivenMarkGradient-${useId().replace(/:/g, '')}`;

  return (
    <svg
      className={className}
      width={rem((size * 42) / 48)}
      height={rem(size)}
      viewBox="0 0 42 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FBF7F2" />
        <stop offset="55%" stopColor="#F0E4D8" />
        <stop offset="100%" stopColor="#E8C5A4" />
      </linearGradient>
      <path
        d="M2.6 9.8C13 5.8 24.4 5 28.8 10.6C32.6 15.6 29 22.9 19.8 26.2L12.6 28.4C21.6 25.2 26.8 21.6 26.4 15.2C26 10.6 14 8.6 2.6 9.8Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M12.6 28.4L18.8 25.8C20.6 32.6 26.8 37.9 38.8 43.2C24.4 38.6 16.4 33.6 12.6 28.4Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
}

/* --- Hero stat card ----------------------------------------------------- */

/** Three stacked wavy lines. */
export function WavesIcon({ className, size = 20, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 7c2.2-2.4 4.3-2.4 6.5 0S13 9.4 15.2 7 19.8 4.6 22 7" />
      <path d="M2 12c2.2-2.4 4.3-2.4 6.5 0s4.5 2.4 6.7 0 4.6-2.4 6.8 0" />
      <path d="M2 17c2.2-2.4 4.3-2.4 6.5 0s4.5 2.4 6.7 0 4.6-2.4 6.8 0" />
    </svg>
  );
}

/** Two-person group. */
export function PeopleIcon({ className, size = 20, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="9.5" cy="8" r="3.2" />
      <path d="M3.5 19c0-3.1 2.7-5.3 6-5.3s6 2.2 6 5.3" />
      <path d="M16.4 5.2a3.2 3.2 0 0 1 0 6.1" />
      <path d="M18 13.9c1.8.8 3 2.5 3 4.6" />
    </svg>
  );
}

/** Sun with rays. */
export function SunIcon({ className, size = 20, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.6M12 19.4V22M2 12h2.6M19.4 12H22M4.9 4.9l1.9 1.9M17.2 17.2l1.9 1.9M19.1 4.9l-1.9 1.9M6.8 17.2l-1.9 1.9" />
    </svg>
  );
}

/** Outlined mouse with an animated dot inside. */
export function MouseIcon({ className, size = 20, strokeWidth = 1.2 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size * 0.62)}
      height={rem(size)}
      viewBox="0 0 14 22"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="0.8" y="0.8" width="12.4" height="20.4" rx="6.2" />
      <circle cx="7" cy="6" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* --- How it works ------------------------------------------------------- */

/** Magnifier. */
export function SearchIcon({ className, size = 20, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.4 15.4 21 21" />
    </svg>
  );
}

/** Heart. */
export function HeartIcon({ className, size = 20, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 20.2s-7.6-4.6-7.6-9.7A4.5 4.5 0 0 1 12 7.6a4.5 4.5 0 0 1 7.6 2.9c0 5.1-7.6 9.7-7.6 9.7Z" />
    </svg>
  );
}

/* --- Stats band / CTA --------------------------------------------------- */

/** Map pin. */
export function MapPinIcon({ className, size = 20, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 21.5c4.2-4.4 6.4-7.8 6.4-10.8a6.4 6.4 0 1 0-12.8 0c0 3 2.2 6.4 6.4 10.8Z" />
      <circle cx="12" cy="10.4" r="2.4" />
    </svg>
  );
}

/** Calendar. */
export function CalendarIcon({ className, size = 20, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3.2" y="4.8" width="17.6" height="16" rx="2.4" />
      <path d="M3.2 9.6h17.6M8 2.8v4M16 2.8v4" />
    </svg>
  );
}

/** Thread spool. */
export function SpoolIcon({ className, size = 20, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7.5 2.8h9v18.4h-9z" />
      <path d="M6 2.8h12M6 21.2h12" />
      <path d="M7.5 7.2h9M7.5 10.4h9M7.5 13.6h9M7.5 16.8h9" />
    </svg>
  );
}

/** Right arrow. */
export function ArrowRightIcon({ className, size = 14, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2.5 8h11M9.5 4l4 4-4 4" />
    </svg>
  );
}

/* --- Navbar ------------------------------------------------------------- */

export function MenuIcon({ className, size = 22, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
    </svg>
  );
}

export function CloseIcon({ className, size = 22, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
    </svg>
  );
}

/* --- Social ------------------------------------------------------------- */

export function InstagramIcon({ className, size = 16, strokeWidth = 1.3 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ className, size = 16 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M13.6 21.5v-8.4h2.8l.42-3.26H13.6V7.76c0-.94.26-1.58 1.61-1.58h1.72V3.26c-.3-.04-1.32-.13-2.5-.13-2.48 0-4.18 1.51-4.18 4.29v2.42H7.44v3.26h2.81v8.4h3.35Z" />
    </svg>
  );
}

export function TikTokIcon({ className, size = 16 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M14.1 2.5h2.7c.2 1.5.9 2.8 2 3.6.8.6 1.7.9 2.7 1v2.8a7.6 7.6 0 0 1-4.6-1.6v6.4a5.8 5.8 0 1 1-5.8-5.8c.3 0 .6 0 .9.06v2.85a3 3 0 1 0 2.1 2.86V2.5Z" />
    </svg>
  );
}

export function YouTubeIcon({ className, size = 16 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M22.2 8.2a2.9 2.9 0 0 0-2-2C18.4 5.7 12 5.7 12 5.7s-6.4 0-8.2.5a2.9 2.9 0 0 0-2 2A30.5 30.5 0 0 0 1.3 12c0 1.3.1 2.6.5 3.8a2.9 2.9 0 0 0 2 2c1.8.5 8.2.5 8.2.5s6.4 0 8.2-.5a2.9 2.9 0 0 0 2-2c.4-1.2.5-2.5.5-3.8s-.1-2.6-.5-3.8ZM10 15.1V8.9l5.3 3.1-5.3 3.1Z" />
    </svg>
  );
}

/* --- Auth (Sign In / Register) ------------------------------------------ */

/** Envelope. */
export function MailIcon({ className, size = 18, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2.5" y="5" width="19" height="14" rx="2.4" />
      <path d="M3.2 6.3 12 13l8.8-6.7" />
    </svg>
  );
}

/** Phone handset. */
export function PhoneIcon({ className, size = 18, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5.2 3.6h3.1l1.4 3.9-2 1.6a13.6 13.6 0 0 0 6.2 6.2l1.6-2 3.9 1.4v3.1c0 1-.9 1.8-1.9 1.6-4-.6-7.8-2.5-10.7-5.4S3.5 8 2.9 4c-.2-1 .6-1.9 1.6-1.9Z" />
    </svg>
  );
}

/** Padlock. */
export function LockIcon({ className, size = 18, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="4.2" y="10.4" width="15.6" height="10.4" rx="2.2" />
      <path d="M7.4 10.4V7.2a4.6 4.6 0 1 1 9.2 0v3.2" />
      <path d="M12 14.4v3" />
    </svg>
  );
}

/** Open eye — "show password". */
export function EyeIcon({ className, size = 18, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 12s3.6-6.8 10-6.8S22 12 22 12s-3.6 6.8-10 6.8S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  );
}

/** Crossed-out eye — "hide password". */
export function EyeOffIcon({ className, size = 18, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3.5 3.5l17 17" />
      <path d="M10.6 5.4A10.8 10.8 0 0 1 12 5.2c6.4 0 10 6.8 10 6.8a13.6 13.6 0 0 1-3.4 4.1M6.5 6.8A13.5 13.5 0 0 0 2 12s3.6 6.8 10 6.8a10.4 10.4 0 0 0 4.3-.9" />
      <path d="M9.9 10.1a2.8 2.8 0 0 0 3.9 3.9" />
    </svg>
  );
}

/** Rounded outline of a person — "full name". */
export function UserIcon({ className, size = 18, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="7.8" r="4" />
      <path d="M4.4 20.4c0-4 3.4-6.8 7.6-6.8s7.6 2.8 7.6 6.8" />
    </svg>
  );
}

/** Storefront. */
export function StoreIcon({ className, size = 18, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3.4 9.4 4.6 4h14.8l1.2 5.4" />
      <path d="M3.4 9.4a2.6 2.6 0 0 0 5.1.5 2.6 2.6 0 0 0 5 0 2.6 2.6 0 0 0 5 0 2.6 2.6 0 0 0 5.1-.5" />
      <path d="M4.6 10v10.4h14.8V10" />
      <path d="M9.6 20.4v-5.6h4.8v5.6" />
    </svg>
  );
}

/** 2x2 grid — "category". */
export function GridIcon({ className, size = 18, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3.2" y="3.2" width="7.6" height="7.6" rx="1.6" />
      <rect x="13.2" y="3.2" width="7.6" height="7.6" rx="1.6" />
      <rect x="3.2" y="13.2" width="7.6" height="7.6" rx="1.6" />
      <rect x="13.2" y="13.2" width="7.6" height="7.6" rx="1.6" />
    </svg>
  );
}

/** Price tag — "vendor type". */
export function TagIcon({ className, size = 18, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20.4 12.9 12.9 20.4a1.8 1.8 0 0 1-2.5 0l-6.8-6.8a1.8 1.8 0 0 1-.5-1.6L4.4 4.4l7.6-.7c.6-.1 1.2.1 1.6.5l6.8 6.8a1.8 1.8 0 0 1 0 2.5Z" />
      <circle cx="9" cy="9" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Lined document — "brand story". */
export function DocumentIcon({ className, size = 18, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 2.8h8l4.6 4.6v13.8H6Z" />
      <path d="M14 2.8v4.6h4.6" />
      <path d="M8.6 13h6.8M8.6 16.4h6.8" />
    </svg>
  );
}

/** Cloud with an upload arrow. */
export function UploadCloudIcon({ className, size = 20, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7.2 18.4a4.4 4.4 0 0 1-.6-8.76 5.6 5.6 0 0 1 10.9-1.86A4.2 4.2 0 0 1 17 18.4H7.2Z" />
      <path d="M12 9.6v8M9 12.4l3-3 3 3" />
    </svg>
  );
}

/** Checkmark, for checked checkboxes. */
export function CheckIcon({ className, size = 14, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 8.5 6.3 12 13 4" />
    </svg>
  );
}

/** Chevron pointing down, for selects. */
export function ChevronDownIcon({ className, size = 16, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3.5 6 8 10.5 12.5 6" />
    </svg>
  );
}

/** Trending-up arrow with a small chart, in a circle — "grow your business". */
export function TrendingUpIcon({ className, size = 20, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 17 9.5 10.5 13.5 14.5 21 7" />
      <path d="M15 7h6v6" />
    </svg>
  );
}

/** Multi-colour "G" mark, used only on the Google auth button. */
export function GoogleIcon({ className, size = 18 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.87c2.27-2.09 3.57-5.17 3.57-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.87-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54V6.62H1.27a12 12 0 0 0 0 10.76l4-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.18 15.24 0 12 0A12 12 0 0 0 1.27 6.62l4 3.11C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}
/** House outline, for the "Home" action in the auth page headers. */
export function HomeIcon({ className, size = 18, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 10.5 12 3.5l9 7" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M9.75 20v-5.5h4.5V20" />
    </svg>
  );
}

/* --- Dashboard ---------------------------------------------------------- */

/** Bell, for the notifications button in the dashboard topbar. */
export function BellIcon({ className, size = 20, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M18 8.5a6 6 0 1 0-12 0c0 5.5-2 7-2 7h16s-2-1.5-2-7" />
      <path d="M13.7 19a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

/** Plus, for "Add Product" and other create actions. */
export function PlusIcon({ className, size = 18, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/** Pencil, for inline edit actions in table rows and card headers. */
export function PencilIcon({ className, size = 16, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7.5 18.5 3.5 20l1.5-4Z" />
      <path d="m14.5 5.5 3 3" />
    </svg>
  );
}

/** Waste bin, for destructive row actions. */
export function TrashIcon({ className, size = 16, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 6.5h16" />
      <path d="M9.5 6.5V4.8a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1.7" />
      <path d="M6.5 6.5 7.3 19a1.4 1.4 0 0 0 1.4 1.3h6.6a1.4 1.4 0 0 0 1.4-1.3l.8-12.5" />
      <path d="M10.5 10v6.5M13.5 10v6.5" />
    </svg>
  );
}

/** Three dots in a row — the "more actions" affordance. */
export function DotsHorizontalIcon({ className, size = 16 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}

/** Three stacked dots — the vertical variant of the same menu affordance. */
export function DotsVerticalIcon({ className, size = 16 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  );
}

/** Chevron pointing left, for the "previous page" pagination control. */
export function ChevronLeftIcon({ className, size = 16, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M10 3.5 5.5 8 10 12.5" />
    </svg>
  );
}

/** Chevron pointing right, for "next page" and row drill-in links. */
export function ChevronRightIcon({ className, size = 16, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 3.5 10.5 8 6 12.5" />
    </svg>
  );
}

/** Sliders, for the "Clear Filters" control on list screens. */
export function SlidersIcon({ className, size = 16, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 7.5h10M18 7.5h2M4 16.5h4M12 16.5h8" />
      <circle cx="16" cy="7.5" r="2" />
      <circle cx="10" cy="16.5" r="2" />
    </svg>
  );
}

/** Tray with a down arrow, for the export buttons. */
export function DownloadIcon({ className, size = 16, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 3.5v10" />
      <path d="m8 10 4 3.5 4-3.5" />
      <path d="M4.5 16v2.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V16" />
    </svg>
  );
}

/** Small up arrow for a positive delta on a stat card. */
export function ArrowUpIcon({ className, size = 12, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 10V2M2.5 5.5 6 2l3.5 3.5" />
    </svg>
  );
}

/** Small down arrow for a negative delta on a stat card. */
export function ArrowDownIcon({ className, size = 12, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 2v8M2.5 6.5 6 10l3.5-3.5" />
    </svg>
  );
}

/** Small right arrow for a flat (zero) delta on a stat card. */
export function ArrowFlatIcon({ className, size = 12, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 6h8M6.5 2.5 10 6l-3.5 3.5" />
    </svg>
  );
}

/** Clock in a circle — "pending" stat cards and timestamps. */
export function ClockIcon({ className, size = 20, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.2l3.2 1.9" />
    </svg>
  );
}

/** Cross in a circle — "rejected" / "cancelled" stat cards. */
export function XCircleIcon({ className, size = 20, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="m9.4 9.4 5.2 5.2M14.6 9.4l-5.2 5.2" />
    </svg>
  );
}

/** Tick in a circle — "accepted" / "delivered" stat cards and verified badges. */
export function CheckCircleIcon({ className, size = 20, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.4 12.2 2.5 2.5 4.7-5" />
    </svg>
  );
}

/** Delivery van — the "shipped" stat card. */
export function TruckIcon({ className, size = 20, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2.5 6.5h10v9h-10z" />
      <path d="M12.5 10h3.6l2.9 3v2.5h-6.5z" />
      <circle cx="6.5" cy="17.5" r="1.8" />
      <circle cx="16" cy="17.5" r="1.8" />
    </svg>
  );
}

/** Isometric box — product counts and the "needs packing" queue. */
export function CubeIcon({ className, size = 20, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 3.2 20 7.6v8.8L12 20.8 4 16.4V7.6Z" />
      <path d="M4 7.6 12 12l8-4.4M12 12v8.8" />
    </svg>
  );
}

/** Shield with a tick — verification state and the status filter. */
export function ShieldCheckIcon({ className, size = 18, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 3.2 5 6v5.5c0 4 2.9 7.4 7 8.8 4.1-1.4 7-4.8 7-8.8V6Z" />
      <path d="m9 11.8 2.2 2.2L15 10.2" />
    </svg>
  );
}

/** Camera, for the avatar/logo replace badge on the profile screen. */
export function CameraIcon({ className, size = 16, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3.5 8.5h3l1.4-2.2h8.2l1.4 2.2h3v10h-17z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  );
}

/** Framed picture, for the Media card heading. */
export function ImageIcon({ className, size = 18, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <circle cx="8.6" cy="9.8" r="1.5" />
      <path d="m4.5 16.5 4.3-4 3.4 3.1 2.9-2.4 4.4 3.8" />
    </svg>
  );
}

/** Shopping bag — the Products entry in the sidebar. */
export function BagIcon({ className, size = 20, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4.5 7.5h15l-1.1 12.3a1 1 0 0 1-1 .9H6.6a1 1 0 0 1-1-.9Z" />
      <path d="M8.8 10V7a3.2 3.2 0 0 1 6.4 0v3" />
    </svg>
  );
}

/** Clipboard — the Orders entry in the sidebar. */
export function ClipboardIcon({ className, size = 20, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="4.5" y="4.5" width="15" height="16" rx="2" />
      <path d="M9 3.2h6a1 1 0 0 1 1 1v1.6H8V4.2a1 1 0 0 1 1-1Z" />
      <path d="M8.5 11h7M8.5 15h4.5" />
    </svg>
  );
}

/** Calendar with a day grid — the Bazaar Applications entry in the sidebar. */
export function CalendarDaysIcon({ className, size = 20, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3.5" y="5.5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3.5v4M16 3.5v4" />
      <path d="M7.5 13.5h2M11 13.5h2M14.5 13.5h2M7.5 17h2M11 17h2" />
    </svg>
  );
}

/** Exclamation in a circle — the "Needs attention" panel heading. */
export function AlertCircleIcon({ className, size = 18, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.8v4.8" />
      <circle cx="12" cy="16" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Cog — the Quick Actions panel heading. */
export function SettingsIcon({ className, size = 18, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="2.8" />
      <path d="M12 3.2v2.1M12 18.7v2.1M20.8 12h-2.1M5.3 12H3.2M18.2 5.8l-1.5 1.5M7.3 16.7l-1.5 1.5M18.2 18.2l-1.5-1.5M7.3 7.3 5.8 5.8" />
    </svg>
  );
}

/** Payment card — the "Paid Orders" stat card. */
export function CreditCardIcon({ className, size = 20, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2.8" y="5.5" width="18.4" height="13" rx="2" />
      <path d="M2.8 9.8h18.4M6.2 14.6h3.2" />
    </svg>
  );
}

/** Contact card — the Contact Information panel heading. */
export function ContactCardIcon({ className, size = 18, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2.8" y="4.8" width="18.4" height="14.4" rx="2" />
      <circle cx="8.6" cy="10.5" r="2" />
      <path d="M5.4 15.6c.5-1.5 1.8-2.3 3.2-2.3s2.7.8 3.2 2.3M14.8 9.8h3.8M14.8 13.4h3.8" />
    </svg>
  );
}

/** Open book — the Business Information panel heading. */
export function BookIcon({ className, size = 18, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      className={className}
      width={rem(size)}
      height={rem(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 5.2h5a2.5 2.5 0 0 1 2.5 2.5v11a2 2 0 0 0-2-2H4Z" />
      <path d="M20 5.2h-5a2.5 2.5 0 0 0-2.5 2.5v11a2 2 0 0 1 2-2H20Z" />
    </svg>
  );
}
