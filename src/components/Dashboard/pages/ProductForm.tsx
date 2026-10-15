import { useMemo, useState, type FormEvent } from 'react';
import { PlusIcon, TrashIcon } from '../../icons';
import Modal from '../ui/Modal';
import Select from '../ui/Select';
import { PLACEHOLDER_IMAGES } from '../mockData';
import type { CategoryOption } from '../categories';
import type { Product, ProductVariant } from '../types';
import styles from './ProductForm.module.scss';

/** What the form edits. Mirrors the POST/PATCH body, plus the variants. */
export interface ProductDraft {
  title: string;
  description: string;
  categoryId: string;
  basePrice: string;
  images: string[];
  isActive: boolean;
  variants: ProductVariant[];
}

export interface ProductFormProps {
  /** Omitted when creating. */
  product?: Product;
  /**
   * Every SKU already in use, so a duplicate is caught before submit. The
   * API enforces global uniqueness with a 409/500, which is a poor way for
   * a vendor to find out.
   */
  takenSkus: ReadonlySet<string>;
  /** Real category options from GET /categories — a product’s categoryId is
   *  a foreign key, so an invented id comes back 400 INVALID_REFERENCE. */
  categories: readonly CategoryOption[];
  onSubmit: (draft: ProductDraft) => void;
  onCancel: () => void;
}

type Errors = Partial<Record<'title' | 'categoryId' | 'basePrice' | 'variants', string>>;


let draftVariantSeq = 0;

function blankVariant(): ProductVariant {
  draftVariantSeq += 1;
  return {
    id: `draft-${draftVariantSeq}`,
    productId: '',
    sku: '',
    size: null,
    color: null,
    priceOverride: null,
    stockQuantity: 0,
  };
}

function initialDraft(product: Product | undefined, categories: readonly CategoryOption[]): ProductDraft {
  if (!product) {
    return {
      title: '',
      description: '',
      categoryId: categories[0]?.value ?? '',
      basePrice: '',
      /* A product needs at least one image and there's no uploader yet, so
         a new draft starts on a placeholder the vendor can cycle. */
      images: [PLACEHOLDER_IMAGES[0]],
      isActive: true,
      variants: [blankVariant()],
    };
  }

  return {
    title: product.title,
    description: product.description,
    categoryId: product.categoryId,
    basePrice: product.basePrice,
    images: [...product.images],
    isActive: product.isActive,
    variants: product.variants.map((variant) => ({ ...variant })),
  };
}

export default function ProductForm({
  product,
  takenSkus,
  categories,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [draft, setDraft] = useState<ProductDraft>(() => initialDraft(product, categories));
  const [errors, setErrors] = useState<Errors>({});

  const isEdit = product !== undefined;

  /* A product's own SKUs aren't "taken" as far as editing it goes. */
  const ownSkus = useMemo(
    () => new Set((product?.variants ?? []).map((variant) => variant.sku)),
    [product],
  );

  const set = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    if (errors[key as keyof Errors]) {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  };

  const setVariant = <K extends keyof ProductVariant>(
    index: number,
    key: K,
    value: ProductVariant[K],
  ) => {
    setDraft((current) => ({
      ...current,
      variants: current.variants.map((variant, i) =>
        i === index ? { ...variant, [key]: value } : variant,
      ),
    }));
    setErrors((current) => ({ ...current, variants: undefined }));
  };

  const validate = (): Errors => {
    const next: Errors = {};

    if (!draft.title.trim()) next.title = 'Enter a product title.';
    if (!draft.categoryId) next.categoryId = 'Pick a category.';

    const price = Number.parseFloat(draft.basePrice);
    if (!draft.basePrice.trim()) next.basePrice = 'Enter a base price.';
    else if (!Number.isFinite(price) || price <= 0) {
      next.basePrice = 'Enter a price greater than zero.';
    }

    const skus = draft.variants.map((variant) => variant.sku.trim());
    if (skus.some((sku) => !sku)) {
      next.variants = 'Every variant needs a SKU.';
    } else if (new Set(skus).size !== skus.length) {
      next.variants = 'Two variants share a SKU.';
    } else {
      const clash = skus.find((sku) => takenSkus.has(sku) && !ownSkus.has(sku));
      if (clash) next.variants = `SKU "${clash}" is already in use.`;
    }

    return next;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSubmit({
      ...draft,
      title: draft.title.trim(),
      description: draft.description.trim(),
      /* The API takes money as a number and answers with a decimal string;
         normalising here keeps both sides of that consistent. */
      basePrice: Number.parseFloat(draft.basePrice).toFixed(2),
      variants: draft.variants.map((variant) => ({
        ...variant,
        sku: variant.sku.trim(),
        size: variant.size?.trim() || null,
        color: variant.color?.trim() || null,
        priceOverride: variant.priceOverride
          ? Number.parseFloat(variant.priceOverride).toFixed(2)
          : null,
      })),
    });
  };

  return (
    <Modal
      title={isEdit ? 'Edit product' : 'Add product'}
      subtitle={
        isEdit
          ? 'Changes go back for approval before they reach shoppers.'
          : 'New products start as Pending until an admin approves them.'
      }
      size="large"
      onClose={onCancel}
      footer={
        <>
          <button type="button" className={styles.cancel} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" form="product-form" className={styles.save}>
            {isEdit ? 'Save changes' : 'Create product'}
          </button>
        </>
      }
    >
      <form id="product-form" className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="product-title">
            Product title
          </label>
          <input
            id="product-title"
            className={`${styles.input} ${errors.title ? styles.invalid : ''}`}
            value={draft.title}
            placeholder="Handmade Ceramic Bowl"
            onChange={(event) => set('title', event.target.value)}
          />
          {errors.title && <span className={styles.error}>{errors.title}</span>}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="product-category">
              Category
            </label>
            <Select
              id="product-category"
              variant="field"
              label="Category"
              invalid={Boolean(errors.categoryId)}
              value={draft.categoryId}
              options={categories}
              onChange={(value) => set('categoryId', value)}
            />
            {errors.categoryId && <span className={styles.error}>{errors.categoryId}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="product-price">
              Base price (EGP)
            </label>
            <input
              id="product-price"
              className={`${styles.input} ${errors.basePrice ? styles.invalid : ''}`}
              type="number"
              min="0"
              step="0.01"
              value={draft.basePrice}
              placeholder="320.00"
              onChange={(event) => set('basePrice', event.target.value)}
            />
            {errors.basePrice && <span className={styles.error}>{errors.basePrice}</span>}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="product-description">
            Description
          </label>
          <textarea
            id="product-description"
            className={styles.textarea}
            rows={3}
            value={draft.description}
            placeholder="What it's made of, how it's made, what makes it yours."
            onChange={(event) => set('description', event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Image</span>
          {/* POST /media/upload-url then PUT to storage is the real flow;
              until that's wired, the form picks from bundled stand-ins so a
              product always has the image the API requires. */}
          <ul className={styles.imagePicker}>
            {PLACEHOLDER_IMAGES.map((url) => (
              <li key={url}>
                <button
                  type="button"
                  className={`${styles.imageTile} ${
                    draft.images[0] === url ? styles.imageTileActive : ''
                  }`}
                  aria-label="Use this image"
                  aria-pressed={draft.images[0] === url}
                  onClick={() => set('images', [url])}
                >
                  <img src={url} alt="" />
                </button>
              </li>
            ))}
          </ul>
          <span className={styles.hint}>
            Placeholder library — swap for real uploads once /media/upload-url is wired.
          </span>
        </div>

        <label className={styles.checkRow}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={draft.isActive}
            onChange={(event) => set('isActive', event.target.checked)}
          />
          Active — show this product once it's approved
        </label>

        {/* --- Variants --- */}
        <div className={styles.variants}>
          <div className={styles.variantsHead}>
            <span className={styles.label}>Variants</span>
            <button
              type="button"
              className={styles.addVariant}
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  variants: [...current.variants, blankVariant()],
                }))
              }
            >
              <PlusIcon size={14} />
              Add variant
            </button>
          </div>

          <div className={styles.variantHeadRow}>
            <span>SKU</span>
            <span>Size</span>
            <span>Colour</span>
            <span>Price override</span>
            <span>Stock</span>
            <span />
          </div>

          {draft.variants.map((variant, index) => (
            <div key={variant.id} className={styles.variantRow}>
              <input
                className={styles.input}
                value={variant.sku}
                placeholder="HCB-M-BLU"
                aria-label={`Variant ${index + 1} SKU`}
                onChange={(event) => setVariant(index, 'sku', event.target.value)}
              />
              <input
                className={styles.input}
                value={variant.size ?? ''}
                placeholder="Medium"
                aria-label={`Variant ${index + 1} size`}
                onChange={(event) => setVariant(index, 'size', event.target.value)}
              />
              <input
                className={styles.input}
                value={variant.color ?? ''}
                placeholder="Blue"
                aria-label={`Variant ${index + 1} colour`}
                onChange={(event) => setVariant(index, 'color', event.target.value)}
              />
              <input
                className={styles.input}
                type="number"
                min="0"
                step="0.01"
                value={variant.priceOverride ?? ''}
                placeholder="Base"
                aria-label={`Variant ${index + 1} price override`}
                onChange={(event) =>
                  setVariant(index, 'priceOverride', event.target.value || null)
                }
              />
              <input
                className={styles.input}
                type="number"
                min="0"
                value={variant.stockQuantity}
                aria-label={`Variant ${index + 1} stock`}
                onChange={(event) =>
                  setVariant(index, 'stockQuantity', Number(event.target.value) || 0)
                }
              />
              <button
                type="button"
                className={styles.removeVariant}
                aria-label={`Remove variant ${index + 1}`}
                /* A product with no variants has no stock and no SKU, so the
                   last row can't be removed. */
                disabled={draft.variants.length === 1}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    variants: current.variants.filter((_, i) => i !== index),
                  }))
                }
              >
                <TrashIcon size={14} />
              </button>
            </div>
          ))}

          {errors.variants && <span className={styles.error}>{errors.variants}</span>}
        </div>
      </form>
    </Modal>
  );
}
