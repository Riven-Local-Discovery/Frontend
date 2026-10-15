import { MailIcon, PhoneIcon } from '../../icons';
import Modal from '../ui/Modal';
import StatusPill, { orderTone } from '../ui/StatusPill';
import { formatDate, formatMoneyExact, formatTime, orderStatusLabel } from '../format';
import { VENDOR_NEXT_STATUS, type Order, type OrderStatus } from '../types';
import styles from './OrderDetails.module.scss';

/** The happy path, in order. CANCELLED sits outside it. */
const FLOW: OrderStatus[] = ['PENDING', 'PAID', 'FULFILLED', 'SHIPPED', 'DELIVERED'];

export interface OrderDetailsProps {
  order: Order;
  onAdvanceStatus: (orderId: string, next: OrderStatus) => void;
  onClose: () => void;
}

export default function OrderDetails({
  order,
  onAdvanceStatus,
  onClose,
}: OrderDetailsProps) {
  const items = order.items ?? [];
  const next = VENDOR_NEXT_STATUS[order.status];
  const cancelled = order.status === 'CANCELLED';
  const reachedIndex = FLOW.indexOf(order.status);

  return (
    <Modal
      title={`Order #${order.id}`}
      subtitle={`Placed ${formatDate(order.createdAt)} at ${formatTime(order.createdAt)}`}
      size="large"
      onClose={onClose}
      footer={
        <>
          <button type="button" className={styles.close} onClick={onClose}>
            Close
          </button>
          {next && (
            <button
              type="button"
              className={styles.advance}
              onClick={() => {
                onAdvanceStatus(order.id, next);
                onClose();
              }}
            >
              Mark {orderStatusLabel(next)}
            </button>
          )}
        </>
      }
    >
      <div className={styles.topRow}>
        <StatusPill tone={orderTone(order.status)}>
          {orderStatusLabel(order.status)}
        </StatusPill>
        <span className={styles.groupNote}>
          Checkout group <code>{order.orderGroupId}</code>
        </span>
      </div>

      {/* --- Progress --- */}
      {cancelled ? (
        <p className={styles.cancelledNote}>
          This order was cancelled. Cancellations come from the shopper before
          payment, or from an admin — there is nothing for you to action.
        </p>
      ) : (
        <ol className={styles.flow}>
          {FLOW.map((step, index) => (
            <li
              key={step}
              className={`${styles.step} ${index <= reachedIndex ? styles.stepDone : ''}`}
            >
              <span className={styles.stepDot} />
              {orderStatusLabel(step)}
            </li>
          ))}
        </ol>
      )}

      {/* --- Customer --- */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Customer</h3>
        <div className={styles.customer}>
          <span className={styles.avatar} aria-hidden="true">
            {order.user.name.charAt(0)}
          </span>
          <div>
            <strong>{order.user.name}</strong>
            <p>
              <MailIcon size={13} />
              {order.user.email}
            </p>
            <p>
              <PhoneIcon size={13} />
              {order.user.phone ?? 'No phone on file'}
            </p>
          </div>
        </div>
        {/* Flagged rather than hidden: a vendor about to ship needs to know
            why there's no address to ship to. */}
        <p className={styles.note}>
          Orders carry no delivery address yet — contact the shopper to arrange
          delivery.
        </p>
      </section>

      {/* --- Items --- */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Items</h3>
        <div className={styles.items}>
          <div className={`${styles.itemRow} ${styles.itemHead}`}>
            <span />
            <span>Item</span>
            <span>Unit price</span>
            <span>Qty</span>
            <span>Line total</span>
          </div>

          {items.map((item) => (
            <div key={item.id} className={styles.itemRow}>
              <img className={styles.itemThumb} src={item.imageUrl} alt="" />
              {/* Snapshots, not live product data — this is what was bought,
                  at the price it was bought for. */}
              <span className={styles.itemTitle}>{item.titleSnapshot}</span>
              <span>{formatMoneyExact(item.priceSnapshot)}</span>
              <span>{item.quantity}</span>
              <span className={styles.lineTotal}>
                {formatMoneyExact(Number(item.priceSnapshot) * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className={styles.total}>
          <span>Subtotal</span>
          <strong>{formatMoneyExact(order.subtotal)}</strong>
        </div>
      </section>
    </Modal>
  );
}
