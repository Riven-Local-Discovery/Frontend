/* ==========================================================================
   RIVEN — seed data for the vendor dashboard.

   The API in specs/web-dashboard-endpoints.md isn't reachable from this repo
   yet, so the screens render from this module. Everything here is shaped
   exactly like the real payloads, which means swapping in the live client is
   a matter of replacing the imports in each page — no component changes.

   Two deliberate departures from the design mock-ups:
   - Product SKUs read "HCB-001", not "#ORD-1047". The mock-up reused the
     order-ID column; a SKU is a vendor's own stock code and is globally
     unique per the spec.
   - Bazaar applications only carry PENDING / ACCEPTED / REJECTED. The
     mock-up showed "Shipped" and "Cancelled" on that table, which are order
     statuses and are not values the applications endpoint can return.
   ========================================================================== */

import ceramicImage from '../../assets/img/persona-vendor-brass-workshop.jpg';
import bagImage from '../../assets/img/persona-shopper-night-market.jpg';
import bazaarImage from '../../assets/img/persona-organizer-festoon-crowd.jpg';
import rugImage from '../../assets/img/cta-felucca-nile-sunset.jpg';
import artImage from '../../assets/img/register-river-sunset.jpg';
import riverImage from '../../assets/img/signin-river-sunset.jpg';

import type {
  BazaarApplication,
  Category,
  Order,
  OrderItem,
  Product,
  ProductVariant,
  Vendor,
} from './types';

/* Stand-in imagery. Real products carry their own uploaded URLs. */
export const PLACEHOLDER_IMAGES = [
  ceramicImage,
  bagImage,
  rugImage,
  artImage,
  bazaarImage,
  riverImage,
];

export const VENDOR_ID = 'b1f0c2d4-1111-4a2b-9c3d-0e1f2a3b4c5d';

/* --- Vendor -------------------------------------------------------------- */

export const MOCK_VENDOR: Vendor = {
  id: VENDOR_ID,
  ownerId: 'a0e1d2c3-2222-4b3c-8d4e-1f2a3b4c5d6e',
  name: 'Riven Crafts',
  category: 'Home & Living',
  description:
    'Unique handmade products for your home. Crafted with love and inspired by nature.',
  logo: null,
  coverMedia: [ceramicImage, bagImage, rugImage, artImage, bazaarImage],
  hasFixedLocation: true,
  verified: true,
  subscriptionStatus: 'ACTIVE',
  vendorType: 'BOTH',
  brandStory:
    'We believe in the beauty of handmade. Every piece tells a story of tradition, creativity and a sustainable future.',
  logoUrl: null,
  bannerUrl: null,
  returnPolicy: 'Returns accepted within 14 days, provided the item is unused and in its original packaging.',
  shippingPolicy: 'Orders ship within 2 business days. Nationwide delivery in 3–5 days.',
  createdAt: '2025-05-02T09:00:00.000Z',
  updatedAt: '2025-05-18T10:24:00.000Z',
  deletedAt: null,
  location: { lat: 30.0444, lng: 31.2357 },
};

/** The signed-in user behind that vendor, as GET /auth/me returns them. */
export const MOCK_USER = {
  id: MOCK_VENDOR.ownerId,
  name: 'Badawy',
  email: 'Badawy@rivencrafts.com',
  phone: '+20 101 234 5678',
  role: 'VENDOR' as const,
};

/* --- Products ------------------------------------------------------------ */

let variantSeq = 0;

function variant(
  productId: string,
  sku: string,
  size: string | null,
  color: string | null,
  stockQuantity: number,
  priceOverride: string | null = null,
): ProductVariant {
  variantSeq += 1;
  return {
    id: `var-${String(variantSeq).padStart(4, '0')}`,
    productId,
    sku,
    size,
    color,
    priceOverride,
    stockQuantity,
  };
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1047',
    vendorId: VENDOR_ID,
    title: 'Handmade Ceramic Bowl',
    description:
      'Wheel-thrown stoneware bowl finished in a reactive glaze. No two pieces share the same pattern.',
    categoryId: 'cat-home-living',
    basePrice: '320.00',
    images: [ceramicImage],
    approvalStatus: 'APPROVED',
    rejectionReason: null,
    isActive: true,
    createdAt: '2025-05-18T10:24:00.000Z',
    updatedAt: '2025-05-18T10:24:00.000Z',
    deletedAt: null,
    variants: [
      variant('prod-1047', 'HCB-S-BLU', 'Small', 'Blue', 9),
      variant('prod-1047', 'HCB-M-BLU', 'Medium', 'Blue', 8),
      variant('prod-1047', 'HCB-M-SND', 'Medium', 'Sand', 7, '345.00'),
    ],
  },
  {
    id: 'prod-1046',
    vendorId: VENDOR_ID,
    title: 'Woven Straw Bag',
    description: 'Hand-woven palm-leaf tote with a cotton lining and leather handles.',
    categoryId: 'cat-accessories',
    basePrice: '450.00',
    images: [bagImage],
    approvalStatus: 'PENDING',
    rejectionReason: null,
    isActive: true,
    createdAt: '2025-05-17T15:12:00.000Z',
    updatedAt: '2025-05-17T15:12:00.000Z',
    deletedAt: null,
    variants: [
      variant('prod-1046', 'WSB-STD-NAT', 'Standard', 'Natural', 7),
      variant('prod-1046', 'WSB-LRG-NAT', 'Large', 'Natural', 5),
    ],
  },
  {
    id: 'prod-1045',
    vendorId: VENDOR_ID,
    title: 'Scented Candle Set',
    description: 'Set of three soy candles: jasmine, amber and fig.',
    categoryId: 'cat-home-living',
    basePrice: '280.00',
    images: [rugImage],
    approvalStatus: 'APPROVED',
    rejectionReason: null,
    isActive: true,
    createdAt: '2025-05-15T11:03:00.000Z',
    updatedAt: '2025-05-15T11:03:00.000Z',
    deletedAt: null,
    variants: [
      variant('prod-1045', 'SCS-JAS', null, 'Jasmine', 2),
      variant('prod-1045', 'SCS-AMB', null, 'Amber', 2),
      variant('prod-1045', 'SCS-FIG', null, 'Fig', 2),
      variant('prod-1045', 'SCS-TRIO', null, 'Trio', 2),
    ],
  },
  {
    id: 'prod-1044',
    vendorId: VENDOR_ID,
    title: 'Embroidered Tote Bag',
    description: 'Canvas tote with hand-embroidered Siwa motifs.',
    categoryId: 'cat-bags',
    basePrice: '380.00',
    images: [artImage],
    approvalStatus: 'REJECTED',
    rejectionReason:
      'Product photography shows a competitor watermark. Re-upload with your own images.',
    isActive: false,
    createdAt: '2025-05-15T09:47:00.000Z',
    updatedAt: '2025-05-16T08:10:00.000Z',
    deletedAt: null,
    variants: [
      variant('prod-1044', 'ETB-NAT', null, 'Natural', 8),
      variant('prod-1044', 'ETB-BLK', null, 'Black', 7),
    ],
  },
  {
    id: 'prod-1043',
    vendorId: VENDOR_ID,
    title: 'Handwoven Rug',
    description: 'Flat-weave wool rug on a cotton warp, woven in Fowa.',
    categoryId: 'cat-home-living',
    basePrice: '1200.00',
    images: [bazaarImage],
    approvalStatus: 'APPROVED',
    rejectionReason: null,
    isActive: true,
    createdAt: '2025-05-14T16:21:00.000Z',
    updatedAt: '2025-05-14T16:21:00.000Z',
    deletedAt: null,
    variants: [variant('prod-1043', 'HWR-120180', '120x180', 'Terracotta', 6)],
  },
  {
    id: 'prod-1042',
    vendorId: VENDOR_ID,
    title: 'Ceramic Vase',
    description: 'Tall matte-glazed vase, thrown and trimmed by hand.',
    categoryId: 'cat-home-living',
    basePrice: '650.00',
    images: [riverImage],
    approvalStatus: 'PENDING',
    rejectionReason: null,
    isActive: true,
    createdAt: '2025-05-12T14:18:00.000Z',
    updatedAt: '2025-05-12T14:18:00.000Z',
    deletedAt: null,
    variants: [
      variant('prod-1042', 'CVS-SM-SAG', 'Small', 'Sage', 4),
      variant('prod-1042', 'CVS-MD-SAG', 'Medium', 'Sage', 3),
      variant('prod-1042', 'CVS-MD-CLY', 'Medium', 'Clay', 3),
    ],
  },
  {
    id: 'prod-1041',
    vendorId: VENDOR_ID,
    title: 'Leather Wallet',
    description: 'Full-grain leather bifold, saddle-stitched with waxed linen thread.',
    categoryId: 'cat-accessories',
    basePrice: '420.00',
    images: [ceramicImage],
    approvalStatus: 'APPROVED',
    rejectionReason: null,
    isActive: true,
    createdAt: '2025-05-10T11:32:00.000Z',
    updatedAt: '2025-05-10T11:32:00.000Z',
    deletedAt: null,
    variants: [
      variant('prod-1041', 'LWL-TAN', null, 'Tan', 10),
      variant('prod-1041', 'LWL-ESP', null, 'Espresso', 8),
    ],
  },
  {
    id: 'prod-1040',
    vendorId: VENDOR_ID,
    title: 'Wall Art Print',
    description: 'Giclée print on cotton rag paper, signed and numbered.',
    categoryId: 'cat-art',
    basePrice: '340.00',
    images: [artImage],
    approvalStatus: 'APPROVED',
    rejectionReason: null,
    isActive: true,
    createdAt: '2025-05-08T18:17:00.000Z',
    updatedAt: '2025-05-08T18:17:00.000Z',
    deletedAt: null,
    variants: [variant('prod-1040', 'WAP-A3', 'A3', null, 9)],
  },
];

/* --- Orders -------------------------------------------------------------- */

function item(orderId: string, index: number, product: Product, quantity: number): OrderItem {
  const first = product.variants[0];
  return {
    id: `${orderId}-item-${index}`,
    orderId,
    productId: product.id,
    variantId: first.id,
    titleSnapshot: first.size
      ? `${product.title} — ${first.size}${first.color ? ` / ${first.color}` : ''}`
      : product.title,
    priceSnapshot: product.basePrice,
    quantity,
    imageUrl: product.images[0],
  };
}

const [bowl, straw, candles, tote, rug, vase, wallet] = MOCK_PRODUCTS;

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-1047',
    orderGroupId: 'grp-3301',
    vendorId: VENDOR_ID,
    userId: 'usr-01',
    status: 'DELIVERED',
    subtotal: '1250.00',
    createdAt: '2025-05-18T10:24:00.000Z',
    updatedAt: '2025-05-20T12:00:00.000Z',
    user: {
      id: 'usr-01',
      name: 'Sara Alghamdi',
      email: 'sara@example.com',
      phone: '+20 100 123 4667',
    },
    items: [item('ORD-1047', 1, bowl, 2), item('ORD-1047', 2, straw, 1), item('ORD-1047', 3, candles, 1)],
  },
  {
    id: 'ORD-1046',
    orderGroupId: 'grp-3300',
    vendorId: VENDOR_ID,
    userId: 'usr-02',
    status: 'SHIPPED',
    subtotal: '680.00',
    createdAt: '2025-05-17T15:12:00.000Z',
    updatedAt: '2025-05-18T09:00:00.000Z',
    user: {
      id: 'usr-02',
      name: 'Ahmed Rashed',
      email: 'ahmed@example.com',
      phone: '+20 111 987 6543',
    },
    items: [item('ORD-1046', 1, candles, 1), item('ORD-1046', 2, tote, 1), item('ORD-1046', 3, wallet, 1)],
  },
  {
    id: 'ORD-1045',
    orderGroupId: 'grp-3299',
    vendorId: VENDOR_ID,
    userId: 'usr-03',
    status: 'PAID',
    subtotal: '2430.00',
    createdAt: '2025-05-15T11:03:00.000Z',
    updatedAt: '2025-05-15T11:05:00.000Z',
    user: {
      id: 'usr-03',
      name: 'Lama Khalid',
      email: 'lama@example.com',
      phone: '+20 122 334 5566',
    },
    items: [item('ORD-1045', 1, vase, 2), item('ORD-1045', 2, straw, 1), item('ORD-1045', 3, rug, 1)],
  },
  {
    id: 'ORD-1044',
    orderGroupId: 'grp-3298',
    vendorId: VENDOR_ID,
    userId: 'usr-04',
    status: 'CANCELLED',
    subtotal: '1120.00',
    createdAt: '2025-05-15T09:47:00.000Z',
    updatedAt: '2025-05-15T18:30:00.000Z',
    user: {
      id: 'usr-04',
      name: 'Nour Faisal',
      email: 'nour@example.com',
      phone: '+20 155 667 8899',
    },
    items: [item('ORD-1044', 1, tote, 1), item('ORD-1044', 2, bowl, 2)],
  },
  {
    id: 'ORD-1043',
    orderGroupId: 'grp-3297',
    vendorId: VENDOR_ID,
    userId: 'usr-05',
    status: 'SHIPPED',
    subtotal: '540.00',
    createdAt: '2025-05-14T16:21:00.000Z',
    updatedAt: '2025-05-15T10:00:00.000Z',
    user: {
      id: 'usr-05',
      name: 'Omar Ali',
      email: 'omar.ali@example.com',
      phone: '+20 100 222 3344',
    },
    items: [item('ORD-1043', 1, bowl, 1), item('ORD-1043', 2, straw, 1)],
  },
  {
    id: 'ORD-1042',
    orderGroupId: 'grp-3296',
    vendorId: VENDOR_ID,
    userId: 'usr-06',
    status: 'PAID',
    subtotal: '1980.00',
    createdAt: '2025-05-13T13:16:00.000Z',
    updatedAt: '2025-05-13T13:18:00.000Z',
    user: {
      id: 'usr-06',
      name: 'Reem Hassan',
      email: 'reem@example.com',
      phone: '+20 113 445 6677',
    },
    items: [item('ORD-1042', 1, candles, 3), item('ORD-1042', 2, rug, 1)],
  },
  {
    id: 'ORD-1041',
    orderGroupId: 'grp-3295',
    vendorId: VENDOR_ID,
    userId: 'usr-07',
    status: 'CANCELLED',
    subtotal: '760.00',
    createdAt: '2025-05-12T09:32:00.000Z',
    updatedAt: '2025-05-12T11:00:00.000Z',
    user: {
      id: 'usr-07',
      name: 'Youssef Nabil',
      email: 'youssef@example.com',
      phone: '+20 120 778 9900',
    },
    items: [item('ORD-1041', 1, wallet, 1), item('ORD-1041', 2, bowl, 1)],
  },
  {
    id: 'ORD-1040',
    orderGroupId: 'grp-3294',
    vendorId: VENDOR_ID,
    userId: 'usr-08',
    status: 'DELIVERED',
    subtotal: '1540.00',
    createdAt: '2025-05-10T18:17:00.000Z',
    updatedAt: '2025-05-13T14:00:00.000Z',
    user: {
      id: 'usr-08',
      name: 'Nada Mustafa',
      email: 'nada@example.com',
      phone: '+20 101 667 8890',
    },
    items: [item('ORD-1040', 1, tote, 2), item('ORD-1040', 2, candles, 1), item('ORD-1040', 3, vase, 1)],
  },
  {
    id: 'ORD-1039',
    orderGroupId: 'grp-3293',
    vendorId: VENDOR_ID,
    userId: 'usr-09',
    status: 'FULFILLED',
    subtotal: '890.00',
    createdAt: '2025-05-09T12:05:00.000Z',
    updatedAt: '2025-05-09T16:40:00.000Z',
    user: {
      id: 'usr-09',
      name: 'Hana Sobhy',
      email: 'hana@example.com',
      phone: '+20 106 552 1177',
    },
    items: [item('ORD-1039', 1, vase, 1), item('ORD-1039', 2, wallet, 1)],
  },
  {
    id: 'ORD-1038',
    orderGroupId: 'grp-3292',
    vendorId: VENDOR_ID,
    userId: 'usr-10',
    status: 'PENDING',
    subtotal: '320.00',
    createdAt: '2025-05-08T08:45:00.000Z',
    updatedAt: '2025-05-08T08:45:00.000Z',
    user: {
      id: 'usr-10',
      name: 'Karim Adel',
      email: 'karim@example.com',
      phone: null,
    },
    items: [item('ORD-1038', 1, bowl, 1)],
  },
];

/* --- Bazaar applications ------------------------------------------------- */

function application(
  id: string,
  name: string,
  organizerName: string,
  locationLabel: string,
  distanceKm: number,
  tags: string[],
  startDate: string,
  endDate: string,
  applicationStatus: BazaarApplication['applicationStatus'],
  appliedAt: string,
  decidedAt: string | null,
): BazaarApplication {
  return {
    id,
    bazaarId: `bz-${id}`,
    vendorId: VENDOR_ID,
    applicationStatus,
    appliedAt,
    decidedAt,
    organizerName,
    locationLabel,
    distanceKm,
    tags,
    bazaar: {
      id: `bz-${id}`,
      name,
      coverMedia: [bazaarImage],
      startDate,
      endDate,
      status: 'PUBLISHED',
      location: { lat: 30.78, lng: 31.0 },
    },
  };
}

export const MOCK_APPLICATIONS: BazaarApplication[] = [
  application('app-1047', 'Tanta Spring Market', 'Tanta Community', 'Tanta, Egypt', 12.4,
    ['Fashion', 'Crafts'], '2025-05-24T10:00:00.000Z', '2025-05-24T18:00:00.000Z',
    'ACCEPTED', '2025-05-12T11:32:00.000Z', '2025-05-14T09:00:00.000Z'),
  application('app-1046', 'Alex Art Bazaar', 'Alex Makers', 'Alexandria, Egypt', 85.6,
    ['Art', 'Handmade'], '2025-05-17T09:00:00.000Z', '2025-05-17T17:00:00.000Z',
    'PENDING', '2025-05-10T16:21:00.000Z', null),
  application('app-1045', 'Cairo Creative Market', 'Cairo Events', 'Cairo, Egypt', 22.7,
    ['Handmade', 'Home'], '2025-05-15T10:00:00.000Z', '2025-05-15T19:00:00.000Z',
    'ACCEPTED', '2025-05-08T13:14:00.000Z', '2025-05-09T10:20:00.000Z'),
  application('app-1044', 'Hurghada Summer Bazaar', 'Red Sea Events', 'Hurghada, Egypt', 320.5,
    ['Fashion', 'Accessories'], '2025-05-12T09:00:00.000Z', '2025-05-12T18:00:00.000Z',
    'REJECTED', '2025-05-05T18:47:00.000Z', '2025-05-07T11:00:00.000Z'),
  application('app-1043', 'Mansoura Local Fair', 'Mansoura Collective', 'Mansoura, Egypt', 102.3,
    ['Food', 'Crafts'], '2025-05-10T10:00:00.000Z', '2025-05-10T17:00:00.000Z',
    'ACCEPTED', '2025-05-03T14:16:00.000Z', '2025-05-04T08:30:00.000Z'),
  application('app-1042', 'New Cairo Lifestyle Market', 'Cairo District', 'New Cairo, Egypt', 28.9,
    ['Lifestyle', 'Home'], '2025-05-08T11:00:00.000Z', '2025-05-08T20:00:00.000Z',
    'PENDING', '2025-04-30T09:42:00.000Z', null),
  application('app-1041', 'Zamalek Arts & Crafts', 'Zamalek Arts', 'Zamalek, Egypt', 14.8,
    ['Art', 'Crafts'], '2025-05-05T10:00:00.000Z', '2025-05-05T18:00:00.000Z',
    'PENDING', '2025-04-28T17:33:00.000Z', null),
  application('app-1040', 'Aswan Cultural Bazaar', 'Aswan Collective', 'Aswan, Egypt', 628.7,
    ['Culture', 'Handmade'], '2025-05-01T09:00:00.000Z', '2025-05-01T17:00:00.000Z',
    'REJECTED', '2025-04-25T11:07:00.000Z', '2025-04-27T15:00:00.000Z'),
];

/* --- Upcoming bazaars (dashboard right rail) ----------------------------- */

export interface UpcomingBazaar {
  id: string;
  name: string;
  image: string;
  startDate: string;
  endDate: string;
  locationLabel: string;
  /** How this vendor stands with it, not the bazaar's own status. */
  state: 'APPLICATION_SUBMITTED' | 'OPEN_FOR_APPLICATIONS' | 'UPCOMING';
}

export const MOCK_UPCOMING_BAZAARS: UpcomingBazaar[] = [
  {
    id: 'bz-up-1',
    name: 'Riyadh Handmade Bazaar',
    image: bazaarImage,
    startDate: '2025-05-25T09:00:00.000Z',
    endDate: '2025-05-28T18:00:00.000Z',
    locationLabel: 'Riyadh, KSA',
    state: 'APPLICATION_SUBMITTED',
  },
  {
    id: 'bz-up-2',
    name: 'Jeddah Local Market',
    image: riverImage,
    startDate: '2025-06-10T09:00:00.000Z',
    endDate: '2025-06-15T18:00:00.000Z',
    locationLabel: 'Jeddah, KSA',
    state: 'OPEN_FOR_APPLICATIONS',
  },
  {
    id: 'bz-up-3',
    name: 'Al Khobar Community Bazaar',
    image: artImage,
    startDate: '2025-07-05T09:00:00.000Z',
    endDate: '2025-07-10T18:00:00.000Z',
    locationLabel: 'Al Khobar, KSA',
    state: 'UPCOMING',
  },
];

/* --- Sales series (dashboard chart) --------------------------------------
   One point per day. `sales` is EGP, `orders` a count — the chart plots
   sales as a line against the left axis and orders as bars against the
   right, which is why the two are kept on one record. */

export interface SalesPoint {
  date: string;
  sales: number;
  orders: number;
}

const SALES_SERIES: readonly [string, number, number][] = [
  ['2025-04-20', 1100, 3], ['2025-04-21', 1450, 4], ['2025-04-22', 1300, 3],
  ['2025-04-23', 1900, 5], ['2025-04-24', 2300, 6], ['2025-04-25', 2150, 5],
  ['2025-04-26', 2600, 7], ['2025-04-27', 2500, 6], ['2025-04-28', 2900, 8],
  ['2025-04-29', 2750, 7], ['2025-04-30', 3100, 8], ['2025-05-01', 3400, 9],
  ['2025-05-02', 3250, 8], ['2025-05-03', 3600, 10], ['2025-05-04', 3900, 11],
  ['2025-05-05', 3700, 9], ['2025-05-06', 4200, 12], ['2025-05-07', 4050, 11],
  ['2025-05-08', 4600, 13], ['2025-05-09', 4400, 12], ['2025-05-10', 5100, 14],
  ['2025-05-11', 5400, 15], ['2025-05-12', 5050, 13], ['2025-05-13', 5600, 16],
  ['2025-05-14', 6300, 18], ['2025-05-15', 5900, 15], ['2025-05-16', 5500, 14],
  ['2025-05-17', 5200, 13], ['2025-05-18', 5700, 15], ['2025-05-19', 5400, 14],
  ['2025-05-20', 5300, 13],
];

export const MOCK_SALES: SalesPoint[] = SALES_SERIES.map(([date, sales, orders]) => ({
  date,
  sales,
  orders,
}));

/* --- Categories ---------------------------------------------------------- */

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-home-living', name: 'Home & Living', slug: 'home-living', children: [] },
  { id: 'cat-accessories', name: 'Accessories', slug: 'accessories', children: [] },
  { id: 'cat-bags', name: 'Bags & Luggage', slug: 'bags-luggage', children: [] },
  { id: 'cat-art', name: 'Art & Collectibles', slug: 'art-collectibles', children: [] },
];

/** Flat lookup so a row can print a category name from its id in one step. */
export const CATEGORY_NAMES: Record<string, string> = Object.fromEntries(
  MOCK_CATEGORIES.map((category) => [category.id, category.name]),
);
