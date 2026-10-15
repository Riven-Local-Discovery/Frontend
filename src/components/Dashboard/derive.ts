/* ==========================================================================
   RIVEN — view models the API does not provide directly.

   Both of these were mock data. Neither has an endpoint behind it, but both
   can be computed from data we do fetch, which is better than inventing
   numbers: a chart showing EGP 3,400 of sales for a vendor with no orders is
   worse than an empty chart.
   ========================================================================== */

import type { BazaarApplication, Order, SalesPoint, UpcomingBazaar } from './types';
import type { BazaarWithLocation } from '../../lib/vendor';

/** Orders that represent money actually taken. PENDING is not yet paid. */
const EARNING_STATUSES = new Set(['PAID', 'FULFILLED', 'SHIPPED', 'DELIVERED']);

const isoDay = (value: string | Date) => new Date(value).toISOString().slice(0, 10);

/**
 * A continuous daily series over the trailing `days`, so the chart keeps its
 * shape when a day has no orders rather than collapsing the x-axis.
 *
 * `subtotal` is a decimal string from Prisma; it is summed as a number here
 * only for charting, never for anything that matters financially.
 */
export function salesSeries(orders: Order[], days = 14): SalesPoint[] {
  const totals = new Map<string, { sales: number; orders: number }>();

  for (const order of orders) {
    if (!EARNING_STATUSES.has(order.status)) continue;
    const day = isoDay(order.createdAt);
    const entry = totals.get(day) ?? { sales: 0, orders: 0 };
    entry.sales += Number(order.subtotal) || 0;
    entry.orders += 1;
    totals.set(day, entry);
  }

  const series: SalesPoint[] = [];
  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);
  cursor.setUTCDate(cursor.getUTCDate() - (days - 1));

  for (let i = 0; i < days; i += 1) {
    const day = cursor.toISOString().slice(0, 10);
    const entry = totals.get(day);
    series.push({ date: day, sales: entry?.sales ?? 0, orders: entry?.orders ?? 0 });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return series;
}

/** "30.044, 31.236" — the API has coordinates, not a place name. */
function locationLabel(bazaar: BazaarWithLocation): string {
  if (!bazaar.location) return 'Location not set';
  return `${bazaar.location.lat.toFixed(3)}, ${bazaar.location.lng.toFixed(3)}`;
}

/**
 * Published bazaars, soonest first, annotated with where this vendor stands.
 * Only PUBLISHED bazaars come back from GET /bazaars, and those are exactly
 * the ones POST /bazaars/:id/apply accepts — so anything not already applied
 * to is open.
 */
export function upcomingBazaars(
  bazaars: BazaarWithLocation[],
  applications: BazaarApplication[],
  limit = 4,
): UpcomingBazaar[] {
  const appliedTo = new Set(applications.map((application) => application.bazaarId));

  return [...bazaars]
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, limit)
    .map((bazaar) => ({
      id: bazaar.id,
      name: bazaar.name,
      image: bazaar.coverMedia?.[0] ?? '',
      startDate: bazaar.startDate,
      // The card's type wants a string; the API allows a null end date.
      endDate: bazaar.endDate ?? bazaar.startDate,
      locationLabel: locationLabel(bazaar),
      state: appliedTo.has(bazaar.id) ? 'APPLICATION_SUBMITTED' : 'OPEN_FOR_APPLICATIONS',
    }));
}
