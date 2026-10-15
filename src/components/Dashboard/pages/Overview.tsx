import { useMemo, useState } from 'react';
import heroImage from '../../../assets/img/Dashboard background.jpeg';
import {
  AlertCircleIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  CalendarIcon,
  ChevronRightIcon,
  ClockIcon,
  CreditCardIcon,
  CubeIcon,
  EyeIcon,
  HeartIcon,
  MapPinIcon,
  XCircleIcon,
} from '../../icons';
import { SelectField } from '../ui/Controls';
import SalesChart from '../ui/SalesChart';
import StatCard from '../ui/StatCard';
import StatusPill, { orderTone } from '../ui/StatusPill';
import {
  approvalLabel,
  formatDate,
  formatDateRange,
  formatMoney,
  greeting,
  orderStatusLabel,
  productVisibility,
} from '../format';

import type { Order, Product, SalesPoint, UpcomingBazaar, Vendor } from '../types';
import type { DashboardView } from '../Sidebar';
import styles from './Overview.module.scss';

const PERIOD_OPTIONS = [
  { value: '30', label: 'Last 30 days' },
  { value: '14', label: 'Last 14 days' },
  { value: '7', label: 'Last 7 days' },
] as const;

const RECENT_ORDER_COUNT = 5;
const FEATURED_PRODUCT_COUNT = 4;

const BAZAAR_STATE_LABELS: Record<UpcomingBazaar['state'], string> = {
  APPLICATION_SUBMITTED: 'Application submitted',
  OPEN_FOR_APPLICATIONS: 'Open for applications',
  UPCOMING: 'Upcoming',
};

const BAZAAR_STATE_TONES: Record<UpcomingBazaar['state'], string> = {
  APPLICATION_SUBMITTED: 'stateBlue',
  OPEN_FOR_APPLICATIONS: 'stateGreen',
  UPCOMING: 'stateAmber',
};

export interface OverviewProps {
  vendor: Vendor;
  userName: string;
  products: Product[];
  orders: Order[];
  sales: SalesPoint[];
  bazaars: UpcomingBazaar[];
  onNavigate: (view: DashboardView) => void;
}

export default function Overview({
  vendor,
  userName,
  products,
  orders,
  sales,
  bazaars,
  onNavigate,
}: OverviewProps) {
  const [period, setPeriod] = useState('30');

  const stats = useMemo(() => {
    let active = 0;
    let pending = 0;
    let rejected = 0;
    for (const product of products) {
      const visibility = productVisibility(product, vendor.verified);
      if (visibility === 'LIVE') active += 1;
      else if (visibility === 'PENDING') pending += 1;
      else if (visibility === 'REJECTED') rejected += 1;
    }

    const paid = orders.filter((order) => order.status === 'PAID').length;

    return { active, pending, rejected, paid };
  }, [products, orders, vendor.verified]);

  /* The chart window is a client-side slice: the spec has no analytics
     endpoint, so there's nothing to re-request when the period changes. */
  const chartPoints = useMemo(
    () => sales.slice(Math.max(0, sales.length - Number(period))),
    [sales, period],
  );

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
        .slice(0, RECENT_ORDER_COUNT),
    [orders],
  );

  const featured = products.slice(0, FEATURED_PRODUCT_COUNT);

  /* Only the rows that actually need doing appear, so an empty panel means
     an empty queue rather than three zeroes. */
  const attention = [
    {
      key: 'pending',
      icon: CubeIcon,
      tone: 'amber' as const,
      title: 'Products pending approval',
      count: stats.pending,
      noun: stats.pending === 1 ? 'product' : 'products',
      view: 'products' as DashboardView,
    },
    {
      key: 'rejected',
      icon: XCircleIcon,
      tone: 'red' as const,
      title: 'Products rejected',
      count: stats.rejected,
      noun: stats.rejected === 1 ? 'product' : 'products',
      view: 'products' as DashboardView,
    },
    {
      key: 'packing',
      icon: CreditCardIcon,
      tone: 'blue' as const,
      title: 'Paid orders need packing',
      count: stats.paid,
      noun: stats.paid === 1 ? 'order' : 'orders',
      view: 'orders' as DashboardView,
    },
  ].filter((row) => row.count > 0);

  return (
    <div className={styles.page}>
      <div className={styles.columns}>
        <div className={styles.main}>
          <section className={styles.greeting}>
            <div className={styles.greetingMedia} aria-hidden="true">
              <img className={styles.greetingImage} src={heroImage} alt="" />
              <div className={styles.greetingScrim} />
            </div>
            <div className={styles.greetingCopy}>
              <p className={styles.greetingEyebrow}>{greeting()}</p>
              <h1 className={styles.greetingName}>{userName}</h1>
              <p className={styles.greetingLede}>
                Your products create real impact in local communities.
              </p>
            </div>
            <p className={styles.greetingMotto}>Together we grow</p>
          </section>

          <div className={styles.statGrid}>
            <StatCard
              label="Active Products"
              value={stats.active}
              icon={CubeIcon}
              tone="slate"
              delta={{ value: '2', note: 'this week', direction: 'up' }}
            />
            <StatCard
              label="Pending Approval"
              value={stats.pending}
              icon={ClockIcon}
              tone="amber"
              delta={{ value: '1', note: 'this week', direction: 'up', tone: 'negative' }}
            />
            <StatCard
              label="Paid Orders"
              value={stats.paid}
              icon={CreditCardIcon}
              tone="green"
              delta={{ value: '3', note: 'this week', direction: 'up' }}
            />
            <StatCard
              label="Bazaar Applications"
              value={bazaars.length}
              icon={CalendarDaysIcon}
              tone="blue"
              delta={{ value: '1', note: 'this week', direction: 'up' }}
            />
          </div>

          <div className={styles.chartRow}>
            <section className={styles.card}>
              <header className={styles.cardHead}>
                <h2 className={styles.cardTitle}>Sales &amp; Orders Overview</h2>
                <SelectField
                  label="Chart period"
                  value={period}
                  onChange={setPeriod}
                  options={PERIOD_OPTIONS}
                />
              </header>
              <SalesChart points={chartPoints} />
            </section>

            <section className={styles.card}>
              <header className={styles.cardHead}>
                <h2 className={styles.cardTitle}>
                  <AlertCircleIcon className={styles.alertIcon} size={17} />
                  Needs attention
                </h2>
                <button
                  type="button"
                  className={styles.cardLink}
                  onClick={() => onNavigate('products')}
                >
                  View all
                  <ArrowRightIcon size={12} />
                </button>
              </header>

              {attention.length === 0 ? (
                <p className={styles.allClear}>
                  Nothing needs your attention right now.
                </p>
              ) : (
                <ul className={styles.attentionList}>
                  {attention.map(({ key, icon: Icon, tone, title, count, noun, view }) => (
                    <li key={key}>
                      <button
                        type="button"
                        className={styles.attentionRow}
                        onClick={() => onNavigate(view)}
                      >
                        <span className={`${styles.attentionIcon} ${styles[tone]}`}>
                          <Icon size={17} />
                        </span>
                        <span className={styles.attentionText}>
                          <strong>{title}</strong>
                          <span>
                            {count} {noun}
                          </span>
                        </span>
                        <ChevronRightIcon size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <div className={styles.bottomRow}>
            <section className={styles.card}>
              <header className={styles.cardHead}>
                <h2 className={styles.cardTitle}>Recent Orders</h2>
                <button
                  type="button"
                  className={styles.cardLink}
                  onClick={() => onNavigate('orders')}
                >
                  View all
                  <ArrowRightIcon size={12} />
                </button>
              </header>

              <div className={styles.miniTable}>
                <div className={`${styles.miniRow} ${styles.miniHead}`}>
                  <span>Order #</span>
                  <span>Customer</span>
                  <span>Items</span>
                  <span>Amount</span>
                  <span>Status</span>
                  <span>Date</span>
                  <span />
                </div>

                {recentOrders.map((order) => {
                  const itemCount = (order.items ?? []).reduce(
                    (sum, item) => sum + item.quantity,
                    0,
                  );
                  return (
                    <button
                      key={order.id}
                      type="button"
                      className={styles.miniRow}
                      onClick={() => onNavigate('orders')}
                    >
                      <span className={styles.strong}>#{order.id}</span>
                      <span>{order.user.name}</span>
                      <span>
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </span>
                      <span className={styles.strong}>{formatMoney(order.subtotal)}</span>
                      <span>
                        <StatusPill tone={orderTone(order.status)} uppercase>
                          {orderStatusLabel(order.status)}
                        </StatusPill>
                      </span>
                      <span>{formatDate(order.createdAt)}</span>
                      <ChevronRightIcon size={14} />
                    </button>
                  );
                })}
              </div>
            </section>

            <section className={styles.card}>
              <header className={styles.cardHead}>
                <h2 className={styles.cardTitle}>Your Products</h2>
                <button
                  type="button"
                  className={styles.cardLink}
                  onClick={() => onNavigate('products')}
                >
                  View all
                  <ArrowRightIcon size={12} />
                </button>
              </header>

              <ul className={styles.productGrid}>
                {featured.map((product) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      className={styles.productCard}
                      onClick={() => onNavigate('products')}
                    >
                      <span className={styles.productMedia}>
                        <img src={product.images[0]} alt="" />
                        <span
                          className={`${styles.productBadge} ${
                            product.approvalStatus === 'APPROVED'
                              ? styles.badgeApproved
                              : styles.badgePending
                          }`}
                        >
                          {approvalLabel(product.approvalStatus)}
                        </span>
                      </span>
                      <span className={styles.productBody}>
                        <strong>{product.title}</strong>
                        <span className={styles.productPrice}>
                          {formatMoney(product.basePrice)}
                        </span>
                        <span className={styles.productMeta}>
                          <HeartIcon size={12} />
                          {product.variants.length * 6}
                          <EyeIcon size={12} />
                          {product.variants.length * 78}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* --- Right rail --- */}
        <aside className={styles.rail}>
          <header className={styles.railHead}>
            <h2 className={styles.cardTitle}>Upcoming Bazaars</h2>
            <button
              type="button"
              className={styles.cardLink}
              onClick={() => onNavigate('applications')}
            >
              View all
              <ArrowRightIcon size={12} />
            </button>
          </header>

          <ul className={styles.bazaarList}>
            {bazaars.map((bazaar) => (
              <li key={bazaar.id}>
                <button
                  type="button"
                  className={styles.bazaarCard}
                  onClick={() => onNavigate('applications')}
                >
                  <img className={styles.bazaarThumb} src={bazaar.image} alt="" />
                  <span className={styles.bazaarBody}>
                    <span
                      className={`${styles.bazaarState} ${
                        styles[BAZAAR_STATE_TONES[bazaar.state]]
                      }`}
                    >
                      {BAZAAR_STATE_LABELS[bazaar.state]}
                    </span>
                    <strong>{bazaar.name}</strong>
                    <span className={styles.bazaarMeta}>
                      <CalendarIcon size={12} />
                      {formatDateRange(bazaar.startDate, bazaar.endDate)}
                    </span>
                    <span className={styles.bazaarMeta}>
                      <MapPinIcon size={12} />
                      {bazaar.locationLabel}
                    </span>
                  </span>
                  <ChevronRightIcon size={14} />
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
