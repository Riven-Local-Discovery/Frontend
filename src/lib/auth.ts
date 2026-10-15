/**
 * Auth calls plus the mapping between what the forms collect and what the API
 * accepts. The API's global validation pipe runs `forbidNonWhitelisted`, so any
 * field it does not declare is a 400 — every payload here is built explicitly
 * rather than spread from form values.
 */

import { apiRequest, setRefreshHandler } from './api';
import type { SignInValues } from '../components/Auth/SignIn';
import type { RegisterValues, VendorType } from '../components/Auth/Register';

export type Role = 'SHOPPER' | 'VENDOR' | 'ORGANIZER' | 'ADMIN';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export type Session = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

/** The API's VendorType enum. The form uses its own lowercase labels. */
const VENDOR_TYPES: Record<VendorType, 'BAZAAR_ONLY' | 'MARKETPLACE' | 'BOTH'> = {
  bazaar: 'BAZAAR_ONLY',
  marketplace: 'MARKETPLACE',
  both: 'BOTH',
};

/**
 * The API's VendorCategory enum keyed by the labels the form offers.
 * "Electronics & Gadgets" has no equivalent on the API side, and the API's
 * ACCESSORIES and KIDS have no form option — anything unmapped becomes OTHER
 * rather than failing the request.
 */
const VENDOR_CATEGORIES: Record<string, string> = {
  'Fashion & Apparel': 'FASHION',
  'Home & Living': 'HOME_CRAFTS',
  'Food & Beverage': 'FOOD',
  'Art & Crafts': 'ART',
  'Beauty & Wellness': 'BEAUTY',
  'Electronics & Gadgets': 'OTHER',
  Other: 'OTHER',
};

export function toVendorCategory(label: string): string {
  return VENDOR_CATEGORIES[label] ?? 'OTHER';
}

const STORAGE_KEY = 'riven.session';

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    // Private mode or blocked site data — behave as a signed-out visitor.
    return null;
  }
}

export function saveSession(session: Session): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Not fatal: the session simply does not survive a reload.
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to clear */
  }
}

export function signIn(values: SignInValues): Promise<Session> {
  return apiRequest<Session>('/auth/login', {
    method: 'POST',
    body: { email: values.email.trim().toLowerCase(), password: values.password },
  });
}

/**
 * Creates the User + Vendor rows in one request and returns tokens, so the
 * vendor is signed in immediately. The account still needs admin approval
 * before its storefront or products become publicly visible.
 *
 * `phone`, `brandStory`, `location` and `media` are collected by the form but
 * are not part of this endpoint: phone belongs to PATCH /users/me, brandStory
 * to PATCH /vendors/me, media to the POST /media/upload-url signed-upload flow,
 * and location needs lat/lng rather than the free-text value the form holds.
 */
export function registerVendor(values: RegisterValues): Promise<Session> {
  return apiRequest<Session>('/auth/register/vendor', {
    method: 'POST',
    body: {
      email: values.email.trim().toLowerCase(),
      password: values.password,
      name: values.fullName.trim(),
      businessName: values.vendorName.trim(),
      category: toVendorCategory(values.category),
      vendorType: VENDOR_TYPES[values.vendorType],
      ...(values.brandStory.trim() ? { description: values.brandStory.trim() } : {}),
    },
  });
}

export function signOut(refreshToken: string): Promise<void> {
  return apiRequest<void>('/auth/logout', { method: 'POST', body: { refreshToken } });
}

/**
 * Trades the stored refresh token for a new pair. The API rotates on every
 * call — the old refresh token is revoked — so the new pair must be stored
 * even though only the access token is returned to the caller.
 *
 * Registered with the api module so any 401 on an authenticated request
 * retries itself once. A failure here means the session is genuinely over
 * (refresh expired, revoked, or the account was deactivated), so the stored
 * session is cleared and the caller sees the original 401.
 */
async function refreshSession(): Promise<string | null> {
  const current = loadSession();
  if (!current?.refreshToken) return null;

  try {
    const next = await apiRequest<Session>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken: current.refreshToken },
    });
    saveSession(next);
    return next.accessToken;
  } catch {
    clearSession();
    return null;
  }
}

setRefreshHandler(refreshSession);
