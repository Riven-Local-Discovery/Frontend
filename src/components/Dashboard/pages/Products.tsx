import { useMemo, useState } from 'react';
import {
  BagIcon,
  CubeIcon,
  DotsHorizontalIcon,
  EyeIcon,
  EyeOffIcon,
  PencilIcon,
  PlusIcon,
  ShieldCheckIcon,
  SlidersIcon,
  TrashIcon,
} from '../../icons';
import ConfirmDialog from '../ui/ConfirmDialog';
import { Pagination, SearchField, SelectField, Toggle } from '../ui/Controls';
import ProductForm, { type ProductDraft } from './ProductForm';
import PageHero from '../ui/PageHero';
import StatCard from '../ui/StatCard';
import StatusPill, { visibilityTone } from '../ui/StatusPill';
import {
  formatDate,
  formatMoney,
  formatTime,
  primarySku,
  productVisibility,
  rangeLabel,
  totalStock,
  variantLabel,
} from '../format';
import type { CategoryOption } from '../categories';
import type { Product, Vendor } from '../types';
import styles from './Products.module.scss';

const PAGE_SIZE = 8;

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'LIVE', label: 'Live' },
  /* PENDING and REJECTED went with product approval (API, 2026-09-27);
     either option would always filter down to nothing. */
  { value: 'INACTIVE', label: 'Inactive' },
] as const;


export interface ProductsProps {
  products: Product[];
  vendor: Vendor;
  /** The real category tree, flattened. From GET /categories. */
  categories: readonly CategoryOption[];
  /** Flips isActive. The real call is PATCH /vendors/me/products/:id. */
  onToggleActive: (productId: string, isActive: boolean) => void;
  /** POST /vendors/me/products. */
  onCreate: (draft: ProductDraft) => void;
  /** PATCH /vendors/me/products/:id. */
  onUpdate: (productId: string, draft: ProductDraft) => void;
  /** DELETE /vendors/me/products/:id — a soft delete on the API side. */
  onDelete: (productId: string) => void;
}

export default function Products({
  products,
  vendor,
  categories,
  onToggleActive,
  onCreate,
  onUpdate,
  onDelete,
}: ProductsProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());

  /* `editing` doubles as the form's mode: a product means edit, the literal
     'new' means create, null means the form is closed. */
  const [editing, setEditing] = useState<Product | 'new' | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);

  /* SKUs are unique across the whole catalogue, so the form checks against
     every one already spoken for. */
  const takenSkus = useMemo(
    () => new Set(products.flatMap((item) => item.variants.map((v) => v.sku))),
    [products],
  );

  /* The four stat cards count the whole catalogue, not the filtered view —
     they're a summary of the store, and would be meaningless if they moved
     every time someone typed in the search box. */
  /**
   * The API dropped product approval on 2026-09-27, so there is no PENDING or
   * REJECTED state left to count — a product is live when it is active and its
   * vendor is verified. The remaining split worth showing is live vs hidden,
   * plus how much stock is behind it all.
   *
   * `addedThisWeek` is computed from createdAt rather than hardcoded: the stat
   * cards previously shipped literal deltas ('3 this week'), which read as a
   * contradiction next to a total of 0.
   */
  /* Built from the real tree rather than a module constant, so the filter
     and the row labels agree with what the API will accept. */
  const categoryFilterOptions = useMemo(
    () => [{ value: 'all', label: 'All Categories' }, ...categories],
    [categories],
  );
  const categoryLabels = useMemo(
    () => Object.fromEntries(categories.map((option) => [option.value, option.label])),
    [categories],
  );

  const stats = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    let live = 0;
    let addedThisWeek = 0;
    let stock = 0;

    for (const product of products) {
      if (productVisibility(product, vendor.verified) === 'LIVE') live += 1;
      if (new Date(product.createdAt).getTime() >= weekAgo) addedThisWeek += 1;
      stock += totalStock(product);
    }

    return {
      total: products.length,
      live,
      hidden: products.length - live,
      addedThisWeek,
      stock,
    };
  }, [products, vendor.verified]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return products.filter((product) => {
      if (category !== 'all' && product.categoryId !== category) return false;
      if (status !== 'all' && productVisibility(product, vendor.verified) !== status) {
        return false;
      }
      if (!needle) return true;

      /* Search covers what's printed on the row — title, category and every
         variant SKU — so a vendor can paste a stock code straight in. */
      return (
        product.title.toLowerCase().includes(needle) ||
        (categoryLabels[product.categoryId] ?? '').toLowerCase().includes(needle) ||
        product.variants.some((variant) => variant.sku.toLowerCase().includes(needle))
      );
    });
  }, [products, search, category, status, vendor.verified]);

  /* Clamp rather than reset: deactivating the last item on page 3 should
     leave you on page 2, not throw you back to the start of the list. */
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const allOnPageSelected =
    visible.length > 0 && visible.every((product) => selected.has(product.id));

  const toggleAllOnPage = () => {
    const next = new Set(selected);
    if (allOnPageSelected) visible.forEach((product) => next.delete(product.id));
    else visible.forEach((product) => next.add(product.id));
    setSelected(next);
  };

  const toggleOne = (productId: string) => {
    const next = new Set(selected);
    if (next.has(productId)) next.delete(productId);
    else next.add(productId);
    setSelected(next);
  };

  const filtersDirty = search !== '' || category !== 'all' || status !== 'all';

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    setStatus('all');
    setPage(1);
  };

  return (
    <div className={styles.page}>
      <PageHero
        eyebrow="Manage your store"
        title="Products"
        lede="Add, manage and track your products. Keep your catalog up to date and ready for your community."
        action={
          <button
            type="button"
            className={styles.addButton}
            onClick={() => setEditing('new')}
          >
            <PlusIcon size={16} />
            Add Product
          </button>
        }
      />

      <div className={styles.statGrid}>
        <StatCard
          label="Total Products"
          value={stats.total}
          icon={CubeIcon}
          tone="slate"
          delta={{
            value: String(stats.addedThisWeek),
            note: 'this week',
            direction: stats.addedThisWeek > 0 ? 'up' : 'flat',
          }}
        />
        <StatCard
          label="Live Products"
          value={stats.live}
          icon={EyeIcon}
          tone="green"
        />
        <StatCard
          label="Hidden Products"
          value={stats.hidden}
          icon={EyeOffIcon}
          tone="amber"
        />
        <StatCard
          label="Units in Stock"
          value={stats.stock}
          icon={BagIcon}
          tone="blue"
        />
      </div>

      <div className={styles.filters}>
        <SearchField
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search by product name, SKU, or category..."
        />
        <SelectField
          label="Filter by category"
          value={category}
          onChange={(value) => {
            setCategory(value);
            setPage(1);
          }}
          options={categoryFilterOptions}
          icon={CubeIcon}
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
        <button
          type="button"
          className={styles.clear}
          onClick={clearFilters}
          disabled={!filtersDirty}
        >
          <SlidersIcon size={15} />
          Clear Filters
        </button>
      </div>

      <section className={styles.table}>
        <div className={`${styles.row} ${styles.head}`}>
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={allOnPageSelected}
            onChange={toggleAllOnPage}
            aria-label="Select all products on this page"
          />
          <span>Product</span>
          <span>SKU / Variants</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Approval Status</span>
          <span>Active</span>
          <span>Created At</span>
          <span>Actions</span>
        </div>

        {visible.length === 0 ? (
          <div className={styles.empty}>
            <strong>No products match these filters</strong>
            <span>Try a different category or status, or clear the filters.</span>
          </div>
        ) : (
          visible.map((product) => {
            const visibility = productVisibility(product, vendor.verified);
            const stock = totalStock(product);

            return (
              <div key={product.id} className={styles.row}>
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  checked={selected.has(product.id)}
                  onChange={() => toggleOne(product.id)}
                  aria-label={`Select ${product.title}`}
                />

                <div className={styles.product}>
                  <img className={styles.thumb} src={product.images[0]} alt="" />
                  <div className={styles.productText}>
                    <strong>{product.title}</strong>
                    <span>{categoryLabels[product.categoryId] ?? 'Uncategorised'}</span>
                  </div>
                </div>

                <div className={styles.sku}>
                  <strong>{primarySku(product)}</strong>
                  <span>{variantLabel(product.variants.length)}</span>
                </div>

                <span className={styles.price}>{formatMoney(product.basePrice)}</span>

                <span className={stock === 0 ? styles.stockOut : undefined}>
                  {stock === 0 ? 'Out of stock' : stock}
                </span>

                <span>
                  <StatusPill tone={visibilityTone(visibility)} uppercase>
                    {visibility}
                  </StatusPill>
                </span>

                <span>
                  <Toggle
                    checked={product.isActive}
                    onChange={(next) => onToggleActive(product.id, next)}
                    label={`${product.isActive ? 'Deactivate' : 'Activate'} ${product.title}`}
                    /* A rejected product can't be shown whatever this says,
                       so the control is disabled rather than misleading. */
                    disabled={product.approvalStatus === 'REJECTED'}
                  />
                </span>

                <span className={styles.timestamp}>
                  {formatDate(product.createdAt)}
                  <span>{formatTime(product.createdAt)}</span>
                </span>

                <span className={styles.actions}>
                  <button type="button" className={styles.iconButton} aria-label={`More actions for ${product.title}`}>
                    <DotsHorizontalIcon size={15} />
                  </button>
                  <button
                    type="button"
                    className={styles.iconButton}
                    aria-label={`Edit ${product.title}`}
                    onClick={() => setEditing(product)}
                  >
                    <PencilIcon size={15} />
                  </button>
                  <button
                    type="button"
                    className={`${styles.iconButton} ${styles.danger}`}
                    aria-label={`Delete ${product.title}`}
                    onClick={() => setDeleting(product)}
                  >
                    <TrashIcon size={15} />
                  </button>
                </span>
              </div>
            );
          })
        )}
      </section>

      <footer className={styles.tableFooter}>
        <p>{rangeLabel(currentPage, PAGE_SIZE, filtered.length, 'products')}</p>
        <Pagination
          page={currentPage}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onChange={setPage}
        />
      </footer>

      {editing && (
        <ProductForm
          product={editing === 'new' ? undefined : editing}
          takenSkus={takenSkus}
          categories={categories}
          onCancel={() => setEditing(null)}
          onSubmit={(draft) => {
            if (editing === 'new') onCreate(draft);
            else onUpdate(editing.id, draft);
            setEditing(null);
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete product"
          message={`"${deleting.title}" and its ${deleting.variants.length} variant(s) will be removed from your catalogue. Orders that already include it keep their own copy of the details.`}
          confirmLabel="Delete product"
          destructive
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            onDelete(deleting.id);
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
}
