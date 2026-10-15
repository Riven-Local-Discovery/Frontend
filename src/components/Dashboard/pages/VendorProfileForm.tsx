import { useState, type FormEvent } from 'react';
import Modal from '../ui/Modal';
import Select from '../ui/Select';
import ImageUpload from '../ui/ImageUpload';
import { VENDOR_CATEGORY_OPTIONS } from '../categories';
import { vendorTypeLabel } from '../format';
import type { Vendor, VendorType } from '../types';
import styles from './VendorProfileForm.module.scss';

/**
 * The body of PATCH /vendors/me. Note `businessName`: the API takes the
 * business name under that key but returns it as `name`, so the mapping
 * happens here rather than leaking into the components.
 */
export interface VendorDraft {
  businessName: string;
  category: string;
  vendorType: VendorType;
  description: string;
  brandStory: string;
  returnPolicy: string;
  shippingPolicy: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  coverMedia: string[];
  hasFixedLocation: boolean;
}

export interface VendorProfileFormProps {
  vendor: Vendor;
  onSubmit: (draft: VendorDraft) => void;
  onCancel: () => void;
}

const CATEGORY_OPTIONS = VENDOR_CATEGORY_OPTIONS;

const VENDOR_TYPE_OPTIONS = (['BAZAAR_ONLY', 'MARKETPLACE', 'BOTH'] as VendorType[]).map(
  (type) => ({ value: type, label: vendorTypeLabel(type) }),
);

type Errors = Partial<Record<'businessName' | 'category', string>>;

export default function VendorProfileForm({
  vendor,
  onSubmit,
  onCancel,
}: VendorProfileFormProps) {
  const [draft, setDraft] = useState<VendorDraft>({
    businessName: vendor.name,
    category: vendor.category,
    vendorType: vendor.vendorType,
    description: vendor.description ?? '',
    brandStory: vendor.brandStory ?? '',
    returnPolicy: vendor.returnPolicy ?? '',
    shippingPolicy: vendor.shippingPolicy ?? '',
    logoUrl: vendor.logoUrl,
    bannerUrl: vendor.bannerUrl,
    coverMedia: [...vendor.coverMedia],
    hasFixedLocation: vendor.hasFixedLocation,
  });
  const [errors, setErrors] = useState<Errors>({});

  const set = <K extends keyof VendorDraft>(key: K, value: VendorDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    if (errors[key as keyof Errors]) {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  };


  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found: Errors = {};
    if (!draft.businessName.trim()) found.businessName = 'Enter your business name.';
    if (!draft.category.trim()) found.category = 'Pick a category.';
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSubmit({
      ...draft,
      businessName: draft.businessName.trim(),
      description: draft.description.trim(),
      brandStory: draft.brandStory.trim(),
      returnPolicy: draft.returnPolicy.trim(),
      shippingPolicy: draft.shippingPolicy.trim(),
    });
  };

  return (
    <Modal
      title="Edit profile"
      subtitle="This is what shoppers see on your storefront."
      size="large"
      onClose={onCancel}
      footer={
        <>
          <button type="button" className={styles.cancel} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" form="vendor-form" className={styles.save}>
            Save changes
          </button>
        </>
      }
    >
      <form id="vendor-form" className={styles.form} onSubmit={handleSubmit} noValidate>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Business</h3>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="vendor-name">
                Business name
              </label>
              <input
                id="vendor-name"
                className={`${styles.input} ${errors.businessName ? styles.invalid : ''}`}
                value={draft.businessName}
                onChange={(event) => set('businessName', event.target.value)}
              />
              {errors.businessName && (
                <span className={styles.error}>{errors.businessName}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="vendor-category">
                Category
              </label>
              <Select
                id="vendor-category"
                variant="field"
                label="Category"
                invalid={Boolean(errors.category)}
                value={draft.category}
                options={CATEGORY_OPTIONS}
                onChange={(value) => set('category', value)}
              />
              {errors.category && <span className={styles.error}>{errors.category}</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="vendor-type">
              Vendor type
            </label>
            <Select
              id="vendor-type"
              variant="field"
              label="Vendor type"
              value={draft.vendorType}
              options={VENDOR_TYPE_OPTIONS}
              onChange={(value) => set('vendorType', value as VendorType)}
            />
            <span className={styles.hint}>
              Where you sell — at bazaars, on the marketplace, or both.
            </span>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="vendor-description">
              Description
            </label>
            <textarea
              id="vendor-description"
              className={styles.textarea}
              rows={2}
              value={draft.description}
              onChange={(event) => set('description', event.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="vendor-story">
              Brand story
            </label>
            <textarea
              id="vendor-story"
              className={styles.textarea}
              rows={3}
              value={draft.brandStory}
              onChange={(event) => set('brandStory', event.target.value)}
            />
          </div>

          <label className={styles.checkRow}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={draft.hasFixedLocation}
              onChange={(event) => set('hasFixedLocation', event.target.checked)}
            />
            I trade from a fixed location shoppers can visit
          </label>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Policies</h3>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="vendor-returns">
              Return policy
            </label>
            <textarea
              id="vendor-returns"
              className={styles.textarea}
              rows={2}
              placeholder="How long shoppers have, and in what condition."
              value={draft.returnPolicy}
              onChange={(event) => set('returnPolicy', event.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="vendor-shipping">
              Shipping policy
            </label>
            <textarea
              id="vendor-shipping"
              className={styles.textarea}
              rows={2}
              placeholder="Dispatch time and delivery window."
              value={draft.shippingPolicy}
              onChange={(event) => set('shippingPolicy', event.target.value)}
            />
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Media</h3>

          <div className={styles.field}>
            <span className={styles.label}>Banner</span>
            {/* Signed PUT straight to storage; the API only ever sees the URL. */}
            <ImageUpload
              purpose="VENDOR_COVER"
              label="Upload banner"
              value={draft.bannerUrl ? [draft.bannerUrl] : []}
              onChange={(urls) => set('bannerUrl', urls[0] ?? null)}
            />
          </div>

          <div className={styles.field}>
            <span className={styles.label}>
              Cover media <span className={styles.count}>{draft.coverMedia.length} selected</span>
            </span>
            <ImageUpload
              purpose="VENDOR_COVER"
              label="Upload cover"
              multiple
              max={10}
              value={draft.coverMedia}
              onChange={(urls) => set('coverMedia', urls)}
            />
          </div>
        </section>
      </form>
    </Modal>
  );
}
