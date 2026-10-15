import { useMemo, useState } from 'react';
import { periodChange } from '../derive';
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  CubeIcon,
  DotsVerticalIcon,
  DownloadIcon,
  ShieldCheckIcon,
  TruckIcon,
  XCircleIcon,
} from '../../icons';
import { Pagination, SearchField, SelectField } from '../ui/Controls';
import OrderDetails from './OrderDetails';
import PageHero from '../ui/PageHero';
import StatCard from '../ui/StatCard';
import StatusPill, { orderTone } from '../ui/StatusPill';
import {
  formatDate,
  formatMoneyExact,
  formatTime,
  orderStatusLabel,
  rangeLabel,
} from '../format';
import { VENDOR_NEXT_STATUS, type Order, type OrderStatus } from '../types';
import styles from './Orders.module.scss';

const PAGE_SIZE = 8;

/** How many item thumbnails fit on a row before they collapse into "+N". */
const THUMB_LIMIT = 2;

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAID', label: 'Paid' },
  { value: 'FULFILLED', label: 'Fulfilled' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
] as const;

const PERIOD_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
] as const;

export interface OrdersProps {
  orders: Order[];
  /**
   * Advances an order one step. The API only accepts FULFILLED and SHIPPED,
   * so the row offers exactly one next step and nothing else.
   */
  onAdvanceStatus: (orderId: string, next: OrderStatus) => void;
  onExport?: () => void;
}

export default function Orders({ orders, onAdvanceStatus, onExport }: OrdersProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [period, setPeriod] = useState('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [detailId, setDetailId] = useState<string | null>(null);

  /* Real 30-day comparison, and undefined when there is no prior period to
     compare against — the status cards get none at all, because a status is
     current state: an order delivered today may have been created months ago. */
  const ordersChange = useMemo(
    () => periodChange(orders.map((order) => order.createdAt)),
    [orders],
  );

  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const order of orders) {
      counts[order.status] = (counts[order.status] ?? 0) + 1;
    }
    return {
      total: orders.length,
      /* "Pending" on the stat row means "money in, nothing packed" — the
         PAID state — which is the queue a vendor actually works from. An
         order still at PENDING hasn't been paid for and isn't actionable. */
      pending: counts.PAID ?? 0,
      shipped: counts.SHIPPED ?? 0,
      delivered: counts.DELIVERED ?? 0,
      cancelled: counts.CANCELLED ?? 0,
    };
  }, [orders]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const cutoff =
      period === 'all' ? null : Date.now() - Number(period) * 24 * 60 * 60 * 1000;

    return orders.filter((order) => {
      if (status !== 'all' && order.status !== status) return false;
      if (cutoff !== null && new Date(order.createdAt).getTime() < cutoff) return false;
      if (!needle) return true;

      return (
        order.id.toLowerCase().includes(needle) ||
        order.user.name.toLowerCase().includes(needle) ||
        (order.items ?? []).some((item) =>
          item.titleSnapshot.toLowerCase().includes(needle),
        )
      );
    });
  }, [orders, search, status, period]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const detail = detailId ? orders.find((order) => order.id === detailId) : undefined;

  const allOnPageSelected =
    visible.length > 0 && visible.every((order) => selected.has(order.id));

  const toggleAllOnPage = () => {
    const next = new Set(selected);
    if (allOnPageSelected) visible.forEach((order) => next.delete(order.id));
    else visible.forEach((order) => next.add(order.id));
    setSelected(next);
  };

  const toggleOne = (orderId: string) => {
    const next = new Set(selected);
    if (next.has(orderId)) next.delete(orderId);
    else next.add(orderId);
    setSelected(next);
  };

  return (
    <div className={styles.page}>
      <PageHero
        eyebrow="Track & manage your sales"
        title="Orders"
        lede="View, filter, and update your orders. Keep your customers happy and your business running smoothly."
        action={
          <SelectField
            label="Date range"
            value={period}
            onChange={(value) => {
              setPeriod(value);
              setPage(1);
            }}
            options={PERIOD_OPTIONS}
            icon={CalendarIcon}
          />
        }
      />

      <div className={styles.statGrid}>
        <StatCard
          label="Total Orders"
          value={stats.total}
          icon={CubeIcon}
          tone="slate"
          delta={
            ordersChange && { ...ordersChange, note: 'vs last 30 days' }
          }
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={ClockIcon}
          tone="amber"
        />
        <StatCard
          label="Shipped"
          value={stats.shipped}
          icon={TruckIcon}
          tone="blue"
        />
        <StatCard
          label="Delivered"
          value={stats.delivered}
          icon={CheckCircleIcon}
          tone="green"
        />
        <StatCard
          label="Cancelled"
          value={stats.cancelled}
          icon={XCircleIcon}
          tone="red"
          /* Fewer cancellations is good news, so a fall reads as positive
             here even though the arrow points down. */
        />
      </div>

      <div className={styles.filters}>
        <SearchField
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search by order ID, customer name, or product..."
        />
        <SelectField
          label="Filter by status"
          value={status}
          onChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          options={STATUS_OPTIONS}
          icon={ShieldCheckIcon}
        />
        <SelectField
          label="Filter by period"
          value={period}
          onChange={(value) => {
            setPeriod(value);
            setPage(1);
          }}
          options={PERIOD_OPTIONS}
          icon={CalendarIcon}
        />
        <button type="button" className={styles.export} onClick={onExport}>
          <DownloadIcon size={15} />
          Export Orders
        </button>
      </div>

      <section className={styles.table}>
        <div className={`${styles.row} ${styles.head}`}>
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={allOnPageSelected}
            onChange={toggleAllOnPage}
            aria-label="Select all orders on this page"
          />
          <span>Order ID</span>
          <span>Customer</span>
          <span>Items</span>
          <span>Total Amount</span>
          <span>Status</span>
          <span>Created At</span>
          <span>Actions</span>
        </div>

        {visible.length === 0 ? (
          <div className={styles.empty}>
            <strong>No orders match these filters</strong>
            <span>Try a wider date range or a different status.</span>
          </div>
        ) : (
          visible.map((order) => {
            const items = order.items ?? [];
            const shown = items.slice(0, THUMB_LIMIT);
            const overflow = items.length - shown.length;
            const next = VENDOR_NEXT_STATUS[order.status];

            return (
              <div key={order.id} className={styles.row}>
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  checked={selected.has(order.id)}
                  onChange={() => toggleOne(order.id)}
                  aria-label={`Select order ${order.id}`}
                />

                <span className={styles.orderId}>#{order.id}</span>

                <div className={styles.customer}>
                  <span className={styles.avatar} aria-hidden="true">
                    {order.user.name.charAt(0)}
                  </span>
                  <div className={styles.customerText}>
                    <strong>{order.user.name}</strong>
                    {/* phone is nullable in the API; the email is the only
                        contact guaranteed to be there. */}
                    <span>{order.user.phone ?? order.user.email}</span>
                  </div>
                </div>

                <div className={styles.items}>
                  {shown.map((item) => (
                    <img
                      key={item.id}
                      className={styles.itemThumb}
                      src={item.imageUrl}
                      alt=""
                      title={item.titleSnapshot}
                    />
                  ))}
                  {overflow > 0 && <span className={styles.overflow}>+{overflow}</span>}
                </div>

                <span className={styles.amount}>{formatMoneyExact(order.subtotal)}</span>

                <span>
                  <StatusPill tone={orderTone(order.status)}>
                    {orderStatusLabel(order.status)}
                  </StatusPill>
                </span>

                <span className={styles.timestamp}>
                  {formatDate(order.createdAt)}
                  <span>{formatTime(order.createdAt)}</span>
                </span>

                <span className={styles.actions}>
                  {/* Stacked, not side by side: two full labels in a row
                      need more width than this column can be given without
                      pushing the table wider than the page. */}
                  <span className={styles.actionStack}>
                    <button
                      type="button"
                      className={styles.viewButton}
                      onClick={() => setDetailId(order.id)}
                    >
                      View Details
                    </button>
                    {/* The one transition this order can make, if any. PAID
                        arrives from the payment webhook and DELIVERED from
                        the shopper, so those rows get no button. */}
                    {next && (
                      <button
                        type="button"
                        className={styles.advanceButton}
                        onClick={() => onAdvanceStatus(order.id, next)}
                      >
                        Mark {orderStatusLabel(next)}
                      </button>
                    )}
                  </span>
                  <button
                    type="button"
                    className={styles.iconButton}
                    aria-label={`More actions for order ${order.id}`}
                  >
                    <DotsVerticalIcon size={15} />
                  </button>
                </span>
              </div>
            );
          })
        )}
      </section>

      <footer className={styles.tableFooter}>
        <p>{rangeLabel(currentPage, PAGE_SIZE, filtered.length, 'orders')}</p>
        <Pagination
          page={currentPage}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onChange={setPage}
        />
      </footer>

      {/* Looked up by id rather than held as an object, so advancing the
          status from inside the dialog re-renders it with the new state. */}
      {detail && (
        <OrderDetails
          order={detail}
          onAdvanceStatus={onAdvanceStatus}
          onClose={() => setDetailId(null)}
        />
      )}
    </div>
  );
}
