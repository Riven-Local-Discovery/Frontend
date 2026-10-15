/* ==========================================================================
   RIVEN — dashboard formatting helpers.

   Money arrives from the API as a decimal string ("249.00"). These helpers
   keep the string as the source of truth and only parse for display, so a
   value never picks up a floating-point artefact on its way to the screen.
   ========================================================================== */

import type {
  ApplicationStatus,
  ApprovalStatus,
  OrderStatus,
  Product,
  ProductVisibility,
  Vendor,
  VendorType,
} from './types';

const MONEY = new Intl.NumberFormat('en-EG', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** "450.00" -> "EGP 450". Trailing ".00" is dropped; piastres are kept. */
export function formatMoney(value: string | number): string {
  const amount = typeof value === 'number' ? value : Number.parseFloat(value);
  if (!Number.isFinite(amount)) return '—';
  return `EGP ${MONEY.format(amount)}`;
}

/** Same as formatMoney but always two decimals, for order totals. */
export function formatMoneyExact(value: string | number): string {
  const amount = typeof value === 'number' ? value : Number.parseFloat(value);
  if (!Number.isFinite(amount)) return '—';
  return `EGP ${amount.toLocaleString('en-EG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const DATE = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const TIME = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

/** ISO string -> "May 18, 2025". */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '—' : DATE.format(date);
}

/** ISO string -> "10:24 AM". */
export function formatTime(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : TIME.format(date);
}

/**
 * A bazaar's run, collapsed the way the applications table shows it:
 * "May 24, 2025" for a single day, "May 24 – May 26, 2025" for a range.
 */
export function formatDateRange(startIso: string, endIso: string | null): string {
  if (!endIso) return formatDate(startIso);

  const start = new Date(startIso);
  const end = new Date(endIso);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '—';

  if (start.toDateString() === end.toDateString()) return formatDate(startIso);

  const sameYear = start.getFullYear() === end.getFullYear();
  const startLabel = sameYear
    ? start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : formatDate(startIso);
  return `${startLabel} – ${formatDate(endIso)}`;
}

/** The opening hours line under a bazaar's dates: "09:00 AM - 06:00 PM". */
export function formatTimeRange(startIso: string, endIso: string | null): string {
  if (!endIso) return formatTime(startIso);
  return `${formatTime(startIso)} - ${formatTime(endIso)}`;
}

/** "12.4 km" — the distance hint on bazaar rows. */
export function formatDistance(km: number | undefined): string {
  if (km === undefined) return '';
  return `${km.toFixed(1)} km`;
}

/**
 * Collapses the three independent flags the API exposes into the single
 * indicator the table shows. Order matters: a rejected product is rejected
 * whatever its isActive flag says, and an unverified vendor's approved
 * product still isn't public.
 */
export function productVisibility(product: Product, vendorVerified: boolean): ProductVisibility {
  if (product.approvalStatus === 'REJECTED') return 'REJECTED';
  if (product.approvalStatus === 'PENDING') return 'PENDING';
  if (!product.isActive || !vendorVerified) return 'INACTIVE';
  return 'LIVE';
}

/** Total units in stock across a product's variants. */
export function totalStock(product: Product): number {
  return product.variants.reduce((sum, variant) => sum + variant.stockQuantity, 0);
}

/** "3 variants" / "1 variant" — the line under a product's SKU. */
export function variantLabel(count: number): string {
  return `${count} ${count === 1 ? 'variant' : 'variants'}`;
}

/** The SKU shown on a product row: the first variant's, or a placeholder. */
export function primarySku(product: Product): string {
  return product.variants[0]?.sku ?? '—';
}

/* --- Enum labels ---------------------------------------------------------
   The API's SCREAMING_SNAKE values are not what a vendor should read. */

const VENDOR_TYPE_LABELS: Record<VendorType, string> = {
  BAZAAR_ONLY: 'Bazaar Only',
  MARKETPLACE: 'Marketplace',
  BOTH: 'Both',
};

export function vendorTypeLabel(type: VendorType): string {
  return VENDOR_TYPE_LABELS[type];
}

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  PAID: 'Paid',
  FULFILLED: 'Fulfilled',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export function orderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status];
}

const APPROVAL_LABELS: Record<ApprovalStatus, string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

export function approvalLabel(status: ApprovalStatus): string {
  return APPROVAL_LABELS[status];
}

const APPLICATION_LABELS: Record<ApplicationStatus, string> = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
};

export function applicationLabel(status: ApplicationStatus): string {
  return APPLICATION_LABELS[status];
}

/** "Joined May 2025" on the profile header. */
export function joinedLabel(vendor: Vendor): string {
  const date = new Date(vendor.createdAt);
  if (Number.isNaN(date.getTime())) return '';
  return `Joined ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
}

/** Greets by time of day, for the dashboard hero. */
export function greeting(now: Date = new Date()): string {
  const hour = now.getHours();
  if (hour < 12) return 'Good morning.';
  if (hour < 18) return 'Good afternoon.';
  return 'Good evening.';
}

/** "Showing 1–8 of 24 products" under a table. */
export function rangeLabel(
  page: number,
  pageSize: number,
  total: number,
  noun: string,
): string {
  if (total === 0) return `No ${noun}`;
  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);
  return `Showing ${first}–${last} of ${total} ${noun}`;
}
