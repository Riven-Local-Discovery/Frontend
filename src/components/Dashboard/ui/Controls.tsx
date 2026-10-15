/* ==========================================================================
   RIVEN — the small controls every dashboard list screen shares: the search
   box, the filter selects, the row toggle and the pager. They live together
   because they're always used together, in the filter bar above a table and
   the footer below it.
   ========================================================================== */

import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from '../../icons';
import styles from './Controls.module.scss';

/* --- Search -------------------------------------------------------------- */

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  /** Lets the filter bar's search stretch while the topbar's stays fixed. */
  grow?: boolean;
}

export function SearchField({ value, onChange, placeholder, grow = true }: SearchFieldProps) {
  return (
    <label className={`${styles.shell} ${grow ? styles.grow : ''}`}>
      <SearchIcon size={16} />
      <input
        className={styles.input}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

/* --- Select --------------------------------------------------------------
   The dashboard's select is a custom listbox — see ./Select for why a
   native <select> couldn't be themed. Re-exported under the old name so
   every call site keeps working. */

export { default as SelectField } from './Select';
export type { SelectOption, SelectProps as SelectFieldProps } from './Select';

/* --- Toggle -------------------------------------------------------------- */

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Read out in place of a visible label, e.g. "Deactivate Ceramic Vase". */
  label: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled = false }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.toggleKnob} />
    </button>
  );
}

/* --- Pagination ----------------------------------------------------------
   The API returns { data, total } rather than a page count, so the pager
   derives its own. */

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

/**
 * Page numbers to render, with `null` standing in for a gap. Short runs are
 * listed in full; longer ones keep the first and last page visible and show
 * a window around the current one, so the pager never outgrows its row.
 */
function pageItems(current: number, count: number): (number | null)[] {
  if (count <= 7) {
    return Array.from({ length: count }, (_, index) => index + 1);
  }

  const items: (number | null)[] = [1];
  const from = Math.max(2, current - 1);
  const to = Math.min(count - 1, current + 1);

  if (from > 2) items.push(null);
  for (let page = from; page <= to; page += 1) items.push(page);
  if (to < count - 1) items.push(null);

  items.push(count);
  return items;
}

export function Pagination({ page, pageSize, total, onChange }: PaginationProps) {
  const count = Math.max(1, Math.ceil(total / pageSize));
  if (count <= 1) return null;

  return (
    <nav className={styles.pager} aria-label="Pagination">
      <button
        type="button"
        className={styles.pagerStep}
        disabled={page <= 1}
        aria-label="Previous page"
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeftIcon size={14} />
      </button>

      {pageItems(page, count).map((item, index) =>
        item === null ? (
          <span key={`gap-${index}`} className={styles.pagerGap}>
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`${styles.pagerPage} ${item === page ? styles.pagerPageActive : ''}`}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onChange(item)}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        className={styles.pagerStep}
        disabled={page >= count}
        aria-label="Next page"
        onClick={() => onChange(page + 1)}
      >
        <ChevronRightIcon size={14} />
      </button>
    </nav>
  );
}
