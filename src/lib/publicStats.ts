/**
 * Real counts for the public landing page.
 *
 * The landing page shipped with invented figures — "1,250+ Communities",
 * "50K+ Community Members" — against a database holding a handful of rows.
 * These are the only totals a logged-out visitor can actually obtain:
 * every list endpoint answers { data, meta: { total } }, and asking for one
 * row is enough to read the total.
 *
 * There is deliberately no vendor or member count here. `GET /vendors/:id` is
 * the only public vendor route, /admin/overview is ADMIN-only, and
 * /search/vendors needs a query string so its hit count is not a total.
 * Showing those would mean inventing them again; a public stats endpoint on
 * the API is what they need.
 */

import { apiRequest } from './api';

export type PublicStats = {
  products: number;
  bazaars: number;
};

type Totals = { meta?: { total?: number } };

const total = async (path: string): Promise<number> => {
  const page = await apiRequest<Totals>(path);
  return page.meta?.total ?? 0;
};

/**
 * Resolves with whatever could be read. A landing page must still render if
 * the API is asleep — Render's free instance takes up to a minute to wake —
 * so a failure yields null and the caller omits the figure rather than
 * showing a zero that is really "unknown".
 */
export async function loadPublicStats(): Promise<PublicStats | null> {
  try {
    const [products, bazaars] = await Promise.all([
      total('/products?page=1&limit=1'),
      total('/bazaars?page=1&limit=1'),
    ]);
    return { products, bazaars };
  } catch {
    return null;
  }
}

/** 0 -> "0", 1250 -> "1,250", 15000 -> "15K". Plain counts, no "+" flourish. */
export function formatCount(value: number): string {
  if (value >= 10_000) return `${Math.round(value / 1000)}K`;
  return value.toLocaleString('en-US');
}
