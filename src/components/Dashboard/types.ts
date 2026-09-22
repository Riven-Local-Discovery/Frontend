/* ==========================================================================
   RIVEN — vendor dashboard domain types.

   These mirror the shapes in specs/web-dashboard-endpoints.md exactly, so a
   response from the API can be handed to a component without a mapping layer.
   Two things about the API to keep in mind while reading them:

   - Money (basePrice, priceOverride, subtotal, priceSnapshot) arrives as a
     decimal *string* like "249.00". It stays a string here; format it with
     the helpers in ./format rather than parsing it into a float.
   - List endpoints answer { data, total }, not a page envelope. Page count
     is the client's job — see `Paginated` below.
   ========================================================================== */

/* --- Shared -------------------------------------------------------------- */

/** Every paginated list endpoint answers this shape. */
export interface Paginated<T> {
  data: T[];
  total: number;
}

/** `lat`/`lng` are sent flat in request bodies but come back nested. */
export interface GeoPoint {
  lat: number;
  lng: number;
}

/* --- Vendor -------------------------------------------------------------- */

export type VendorType = 'BAZAAR_ONLY' | 'MARKETPLACE' | 'BOTH';

/** Read-only — there are no billing endpoints yet. */
export type SubscriptionStatus = 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED';

export interface Vendor {
  id: string;
  ownerId: string;
  /** Sent as `businessName` on PATCH, returned as `name`. */
  name: string;
  category: string;
  description: string | null;
  logo: string | null;
  coverMedia: string[];
  hasFixedLocation: boolean;
  verified: boolean;
  subscriptionStatus: SubscriptionStatus;
  vendorType: VendorType;
  brandStory: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  returnPolicy: string | null;
  shippingPolicy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  /** null until the vendor sets one. */
  location: GeoPoint | null;
}

/* --- Products ------------------------------------------------------------ */

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ProductVariant {
  id: string;
  productId: string;
  /** Globally unique across the whole catalogue — validate before submit. */
  sku: string;
  size: string | null;
  color: string | null;
  /** null means "use the product's basePrice". */
  priceOverride: string | null;
  stockQuantity: number;
}

export interface Product {
  id: string;
  vendorId: string;
  title: string;
  description: string;
  categoryId: string;
  basePrice: string;
  images: string[];
  approvalStatus: ApprovalStatus;
  /** Filled in when approvalStatus is REJECTED. Always surface it. */
  rejectionReason: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  variants: ProductVariant[];
}

/**
 * A product is publicly visible only when all three of approved, active and
 * vendor-verified hold. The table shows that as one "Live" indicator rather
 * than making the vendor combine the flags themselves.
 */
export type ProductVisibility = 'LIVE' | 'PENDING' | 'REJECTED' | 'INACTIVE';

/* --- Orders -------------------------------------------------------------- */

/**
 * PENDING → PAID → FULFILLED → SHIPPED → DELIVERED, plus CANCELLED.
 * The vendor only drives the two middle transitions; see `VENDOR_NEXT_STATUS`.
 */
export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'FULFILLED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

/**
 * The only two transitions PATCH /vendors/me/orders/:id/status accepts.
 * A status missing from this map has no vendor-driven next step: PAID comes
 * from the payment webhook, DELIVERED from the shopper, CANCELLED from the
 * shopper or an admin.
 */
export const VENDOR_NEXT_STATUS: Partial<Record<OrderStatus, 'FULFILLED' | 'SHIPPED'>> = {
  PAID: 'FULFILLED',
  FULFILLED: 'SHIPPED',
};

/** The shopper's contact block on an order. There is no address field yet. */
export interface OrderCustomer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

/**
 * Snapshots taken at purchase time. Render the snapshot fields — re-fetching
 * the product would show today's title and price, not what was bought.
 */
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  titleSnapshot: string;
  priceSnapshot: string;
  quantity: number;
  /** Not in the API payload; the mock data carries it for the row thumbnails. */
  imageUrl?: string;
}

export interface Order {
  id: string;
  /** Ties the per-vendor orders of one multi-vendor checkout together. */
  orderGroupId: string;
  vendorId: string;
  userId: string;
  status: OrderStatus;
  subtotal: string;
  createdAt: string;
  updatedAt: string;
  user: OrderCustomer;
  /** Only present on the detail endpoint; the list omits items. */
  items?: OrderItem[];
}

/* --- Bazaars & applications ---------------------------------------------- */

export type BazaarStatus = 'DRAFT' | 'PUBLISHED' | 'COMPLETED' | 'CANCELLED';
export type ScheduleType = 'ONE_OFF' | 'RECURRING';
export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

/** The bazaar summary embedded in each application row. */
export interface BazaarSummary {
  id: string;
  name: string;
  coverMedia: string[];
  startDate: string;
  endDate: string | null;
  status: BazaarStatus;
  location: GeoPoint | null;
}

export interface Bazaar extends BazaarSummary {
  organizerId: string;
  description: string | null;
  scheduleType: ScheduleType;
  /** iCal RRULE. Required when scheduleType is RECURRING. */
  recurrenceRule: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface BazaarApplication {
  id: string;
  bazaarId: string;
  vendorId: string;
  applicationStatus: ApplicationStatus;
  appliedAt: string;
  decidedAt: string | null;
  /** Embedded so the list renders without a second request per row. */
  bazaar: BazaarSummary;
  /* Presentation-only extras the mock data supplies. The API does not return
     these yet; the organizer name and distance would need a join. */
  organizerName?: string;
  locationLabel?: string;
  distanceKm?: number;
  tags?: string[];
}

/* --- Categories ---------------------------------------------------------- */

/** GET /categories returns the full tree; any node is a valid categoryId. */
export interface Category {
  id: string;
  name: string;
  slug: string;
  children: Category[];
}
