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
