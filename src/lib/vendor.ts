/**
 * Vendor dashboard data access. One function per endpoint the dashboard uses,
 * plus the few adaptations the live API needs that the dashboard's types do
 * not yet reflect:
 *
 * - Lists answer `{ data, meta: { total, ... } }`. The dashboard's `Paginated`
 *   is `{ data, total }`, so `unwrap` flattens it.
 * - `GET /vendors/me/products` does not include variants (only the single-product
 *   read does). Rows arrive with `variants: []` rather than undefined, because
 *   `totalStock()` reduces over that array and would throw.
 * - Product approval was removed from the API on 2026-09-27, so responses carry
 *   no `approvalStatus` / `rejectionReason`. `productVisibility()` already falls
 *   through to isActive + vendor.verified, which is the current rule.
 */

import { apiRequest } from './api';
import { loadSession } from './auth';
import type {
  BazaarApplication,
  Category,
  GeoPoint,
  Order,
  OrderStatus,
  Product,
  ProductVariant,
  Vendor,
} from '../components/Dashboard/types';

/** The signed-in user as GET /users/me returns it. */
export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  interests: string[];
  location: GeoPoint | null;
  createdAt: string;
  updatedAt: string;
};

type PageEnvelope<T> = { data: T[]; meta: { total: number } };

function token(): string | null {
  return loadSession()?.accessToken ?? null;
}

const get = <T>(path: string) => apiRequest<T>(path, { token: token() });
const send = <T>(method: 'POST' | 'PATCH' | 'DELETE', path: string, body?: unknown) =>
  apiRequest<T>(path, { method, body, token: token() });

/** `{ data, meta }` from the API -> `{ data, total }` the pages expect. */
function unwrap<T>(page: PageEnvelope<T>): { data: T[]; total: number } {
  return { data: page.data, total: page.meta?.total ?? page.data.length };
}

/** The list endpoint omits variants; the pages reduce over the array. */
function withVariants(product: Product): Product {
  return { ...product, variants: product.variants ?? [] };
}

/* --- Identity & profile --------------------------------------------------- */

export const getCurrentUser = () => get<CurrentUser>('/users/me');

export const getVendorProfile = () => get<Vendor>('/vendors/me');

/** PATCH /vendors/me. Request says `businessName`, response says `name`. */
export function updateVendorProfile(input: {
  businessName?: string;
  category?: string;
  vendorType?: string;
  description?: string | null;
  brandStory?: string | null;
  returnPolicy?: string | null;
  shippingPolicy?: string | null;
  logo?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  coverMedia?: string[];
  hasFixedLocation?: boolean;
}): Promise<Vendor> {
  // The API rejects nulls on optional string fields, so drop the empties
  // instead of sending them.
  const body: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== null && value !== undefined && value !== '') body[key] = value;
  }
  return send<Vendor>('PATCH', '/vendors/me', body);
}

/** Answers 204. Throttled to one call a minute per user. */
export const updateVendorLocation = (location: GeoPoint) =>
  send<void>('PATCH', '/vendors/me/location', location);

/** Requires the account password; answers 204. */
export const deleteAccount = (password: string) =>
  send<void>('DELETE', '/users/me', { password });

/* --- Products ------------------------------------------------------------- */

export async function listProducts(page = 1, limit = 100) {
  const result = unwrap(await get<PageEnvelope<Product>>(`/vendors/me/products?page=${page}&limit=${limit}`));
  return { ...result, data: result.data.map(withVariants) };
}

/** The only read that includes variants. */
export const getProduct = (productId: string) =>
  get<Product>(`/vendors/me/products/${productId}`).then(withVariants);

export type ProductInput = {
  title: string;
  description: string;
  categoryId: string;
  basePrice: number;
  images: string[];
  isActive?: boolean;
};

export const createProduct = (input: ProductInput) =>
  send<Product>('POST', '/vendors/me/products', input).then(withVariants);

export const updateProduct = (productId: string, input: Partial<ProductInput>) =>
  send<Product>('PATCH', `/vendors/me/products/${productId}`, input).then(withVariants);

/** Soft delete — the row survives behind deletedAt so past orders resolve. */
export const deleteProduct = (productId: string) =>
  send<Product>('DELETE', `/vendors/me/products/${productId}`);

/* --- Variants ------------------------------------------------------------- */

export type VariantInput = {
  sku: string;
  size?: string | null;
  color?: string | null;
  priceOverride?: number | null;
  stockQuantity?: number;
};

function variantBody(input: VariantInput): Record<string, unknown> {
  const body: Record<string, unknown> = { sku: input.sku };
  if (input.size) body.size = input.size;
  if (input.color) body.color = input.color;
  if (input.priceOverride !== null && input.priceOverride !== undefined) {
    body.priceOverride = input.priceOverride;
  }
  if (input.stockQuantity !== undefined) body.stockQuantity = input.stockQuantity;
  return body;
}

export const createVariant = (productId: string, input: VariantInput) =>
  send<ProductVariant>('POST', `/vendors/me/products/${productId}/variants`, variantBody(input));

export const updateVariant = (productId: string, variantId: string, input: VariantInput) =>
  send<ProductVariant>(
    'PATCH',
    `/vendors/me/products/${productId}/variants/${variantId}`,
    variantBody(input),
  );

export const deleteVariant = (productId: string, variantId: string) =>
  send<ProductVariant>('DELETE', `/vendors/me/products/${productId}/variants/${variantId}`);

/* --- Orders --------------------------------------------------------------- */

export const listOrders = (page = 1, limit = 100) =>
  get<PageEnvelope<Order>>(`/vendors/me/orders?page=${page}&limit=${limit}`).then(unwrap);

export const getOrder = (orderId: string) => get<Order>(`/vendors/me/orders/${orderId}`);

/** Only PAID -> FULFILLED and FULFILLED -> SHIPPED are accepted. */
export const updateOrderStatus = (orderId: string, status: OrderStatus) =>
  send<Order>('PATCH', `/vendors/me/orders/${orderId}/status`, { status });

/* --- Bazaar applications -------------------------------------------------- */

export const listApplications = () =>
  get<PageEnvelope<BazaarApplication>>('/vendors/me/bazaar-applications?page=1&limit=100').then(unwrap);

export const applyToBazaar = (bazaarId: string) =>
  send<BazaarApplication>('POST', `/bazaars/${bazaarId}/apply`);

/** Keyed by bazaar id, not application id — the caller maps it. Answers 204. */
export const withdrawApplication = (bazaarId: string) =>
  send<void>('DELETE', `/bazaars/${bazaarId}/apply`);

/* --- Categories ----------------------------------------------------------- */

export const listCategories = () => apiRequest<Category[]>('/categories');
