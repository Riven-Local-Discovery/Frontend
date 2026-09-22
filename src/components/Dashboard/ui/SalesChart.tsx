import { useId } from 'react';
import type { SalesPoint } from '../mockData';
import styles from './SalesChart.module.scss';

export interface SalesChartProps {
  points: SalesPoint[];
  /** Ticks on the sales (left) axis. */
  salesTicks?: number[];
  /** Ticks on the orders (right) axis. */
  orderTicks?: number[];
}

/* The drawing is done in a fixed coordinate space and scaled by the SVG's
   viewBox, so the geometry below never has to know the rendered width. */
const W = 760;
const H = 280;
const PAD = { top: 16, right: 40, bottom: 30, left: 52 };

const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

const DEFAULT_SALES_TICKS = [0, 2000, 4000, 6000, 8000];
const DEFAULT_ORDER_TICKS = [0, 5, 10, 15, 20];

/**
 * Smooths the sales line with a Catmull-Rom spline converted to cubic
 * béziers. A polyline through daily figures reads as noise; the spline keeps
 * every actual data point on the curve while making the trend legible.
 */
function smoothPath(coords: { x: number; y: number }[]): string {
  if (coords.length === 0) return '';
  if (coords.length < 3) {
    return coords.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ');
  }

  let d = `M${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i += 1) {
    const p0 = coords[i - 1] ?? coords[i];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[i + 2] ?? p2;

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
  }
  return d;
}

const AXIS_DATE = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

export default function SalesChart({
  points,
  salesTicks = DEFAULT_SALES_TICKS,
  orderTicks = DEFAULT_ORDER_TICKS,
}: SalesChartProps) {
  /* useId emits colons, which aren't valid inside a url(#...) reference. */
  const gradientId = `salesFill-${useId().replace(/:/g, '')}`;

  if (points.length === 0) return null;

  const salesMax = Math.max(...salesTicks, ...points.map((p) => p.sales));
  const orderMax = Math.max(...orderTicks, ...points.map((p) => p.orders));

  const step = PLOT_W / points.length;
  const barWidth = Math.min(10, step * 0.42);

  const x = (index: number) => PAD.left + step * index + step / 2;
  const salesY = (value: number) => PAD.top + PLOT_H - (value / salesMax) * PLOT_H;
  const orderY = (value: number) => PAD.top + PLOT_H - (value / orderMax) * PLOT_H;

  const coords = points.map((point, index) => ({
    x: x(index),
    y: salesY(point.sales),
  }));

  const line = smoothPath(coords);
  const area = `${line} L${coords[coords.length - 1].x} ${PAD.top + PLOT_H} L${coords[0].x} ${PAD.top + PLOT_H} Z`;

  /* Roughly one label per five days, so they never collide. */
  const labelEvery = Math.max(1, Math.round(points.length / 6));

  return (
    <figure className={styles.figure}>
      <figcaption className={styles.legend}>
        <span>
          <i className={styles.swatchLine} aria-hidden="true" />
          Total Sales (EGP)
        </span>
        <span>
          <i className={styles.swatchBar} aria-hidden="true" />
          Orders
        </span>
      </figcaption>

      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Sales and orders over the last ${points.length} days`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Gridlines and the sales axis */}
        {salesTicks.map((tick) => (
          <g key={tick}>
            <line
              className={styles.grid}
              x1={PAD.left}
              y1={salesY(tick)}
              x2={W - PAD.right}
              y2={salesY(tick)}
            />
            <text
              className={styles.axisLabel}
              x={PAD.left - 10}
              y={salesY(tick)}
              textAnchor="end"
              dominantBaseline="middle"
            >
              {tick.toLocaleString('en-US')}
            </text>
          </g>
        ))}

        {/* Orders axis, on the right */}
        {orderTicks.map((tick) => (
          <text
            key={tick}
            className={styles.axisLabel}
            x={W - PAD.right + 10}
            y={orderY(tick)}
            textAnchor="start"
            dominantBaseline="middle"
          >
            {tick}
          </text>
        ))}

        {/* Order bars sit behind the sales line so the line stays readable */}
        {points.map((point, index) => {
          const top = orderY(point.orders);
          return (
            <rect
              key={point.date}
              className={styles.bar}
              x={x(index) - barWidth / 2}
              y={top}
              width={barWidth}
              height={Math.max(0, PAD.top + PLOT_H - top)}
              rx={2}
            />
          );
        })}

        <path className={styles.area} d={area} fill={`url(#${gradientId})`} />
        <path className={styles.line} d={line} />

        {/* Date labels */}
        {points.map((point, index) =>
          index % labelEvery === 0 ? (
            <text
              key={`label-${point.date}`}
              className={styles.axisLabel}
              x={x(index)}
              y={H - 8}
              textAnchor="middle"
            >
              {AXIS_DATE.format(new Date(point.date))}
            </text>
          ) : null,
        )}
      </svg>
    </figure>
  );
}
