import { useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import authImage from '../../assets/img/register-river-sunset.jpg';
import myLogo from '../../assets/img/logo.png';
import {
  CheckIcon,
  DocumentIcon,
  EyeIcon,
  EyeOffIcon,
  FacebookIcon,
  GoogleIcon,
  GridIcon,
  HomeIcon,
  LockIcon,
  MailIcon,
  MapPinIcon,
  PeopleIcon,
  PhoneIcon,
  StoreIcon,
  TagIcon,
  TrendingUpIcon,
  UploadCloudIcon,
  UserIcon,
} from '../icons';
import Select from '../Dashboard/ui/Select';
import styles from './Register.module.scss';

export type VendorType = 'bazaar' | 'marketplace' | 'both';

export interface RegisterValues {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  vendorName: string;
  category: string;
  vendorType: VendorType;
  brandStory: string;
  location: string;
  media: File[];
  agreeToTerms: boolean;
}

export interface RegisterProps {
  /** Called with the form values once client-side validation passes. */
  onSubmit?: (values: RegisterValues) => void | Promise<void>;
  /** "Sign In" link in the header and the footer prompt. */
  onSwitchToSignIn?: () => void;
  onGoogleSignUp?: () => void;
  onFacebookSignUp?: () => void;
  /** Called when the Riven logo/wordmark is clicked, e.g. to return home. */
  onLogoClick?: () => void;
  /** Called by the "Home" button. Falls back to `onLogoClick` when omitted. */
  onHomeClick?: () => void;
  /** Vendor categories shown in the select. */
  categories?: readonly string[];
  /** Surface a server-side error (email already registered, network failure, ...). */
  serverError?: string;
  /** Disable the form while a submit request is in flight. */
  submitting?: boolean;
}

const DEFAULT_CATEGORIES: readonly string[] = [
  'Fashion & Apparel',
  'Home & Living',
  'Food & Beverage',
  'Art & Crafts',
  'Beauty & Wellness',
  'Electronics & Gadgets',
  'Other',
];

const VENDOR_TYPES: readonly { value: VendorType; label: string }[] = [
  { value: 'bazaar', label: 'Bazaar Only' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'both', label: 'Both' },
];

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/png', 'image/jpeg'];

type FieldKey =
  | 'fullName'
  | 'email'
  | 'phone'
  | 'password'
  | 'confirmPassword'
  | 'vendorName'
  | 'category'
  | 'agreeToTerms'
  | 'media';

type FieldErrors = Partial<Record<FieldKey, string>>;

function validate(values: RegisterValues): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.fullName.trim()) errors.fullName = 'Enter your full name.';
  if (!values.email.trim()) {
    errors.email = 'Enter your email address.';
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!values.phone.trim()) errors.phone = 'Enter your phone number.';

  if (!values.password) {
    errors.password = 'Create a password.';
  } else if (values.password.length < 8) {
    errors.password = 'Use at least 8 characters.';
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm your password.';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords don\u2019t match.';
  }

  if (!values.vendorName.trim()) errors.vendorName = 'Enter your business name.';
  if (!values.category) errors.category = 'Select a category.';
  if (!values.agreeToTerms) errors.agreeToTerms = 'You must accept the terms to continue.';

  return errors;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Register({
  onSubmit,
  onSwitchToSignIn,
  onGoogleSignUp,
  onFacebookSignUp,
  onLogoClick,
  onHomeClick,
  categories = DEFAULT_CATEGORIES,
  serverError,
  submitting = false,
}: RegisterProps) {
  const [values, setValues] = useState<RegisterValues>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    vendorName: '',
    category: '',
    vendorType: 'bazaar',
    brandStory: '',
    location: '',
    media: [],
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  const categoryOptions = categories.map((category) => ({
    value: category,
    label: category,
  }));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const setField = <K extends keyof RegisterValues>(key: K, value: RegisterValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key as FieldKey]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const addFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const incoming = Array.from(fileList);
    const rejected = incoming.some(
      (file) => !ACCEPTED_TYPES.includes(file.type) || file.size > MAX_FILE_BYTES,
    );
    if (rejected) {
      setErrors((prev) => ({ ...prev, media: 'Only PNG or JPG files up to 10MB are accepted.' }));
      return;
    }
    setErrors((prev) => ({ ...prev, media: undefined }));
    setValues((prev) => ({ ...prev, media: [...prev.media, ...incoming] }));
  };

  const removeFile = (index: number) => {
    setValues((prev) => ({ ...prev, media: prev.media.filter((_, i) => i !== index) }));
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragActive(false);
    addFiles(event.dataTransfer.files);
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(event.target.files);
    event.target.value = '';
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSubmit?.(values);
    }
  };

  const mediaSummary =
    values.media.length === 0
      ? 'PNG, JPG (Max 10MB)'
      : `${values.media.length} file${values.media.length > 1 ? 's' : ''} selected \u00b7 ${formatFileSize(
          values.media.reduce((total, file) => total + file.size, 0),
        )}`;

  return (
    <div className={styles.page}>
      <div className={styles.media} aria-hidden="true">
        <img className={styles.mediaImage} src={authImage} alt="" />
        <div className={styles.scrim} />
      </div>

      <div style={{ position: 'relative', zIndex: 4, display: 'flex', flexDirection: 'column', flex: 1, width: '100%' }}>
        <header className={styles.header}>
          <a
            className={styles.logo}
            href="#top"
            aria-label="Riven - home"
            onClick={(event) => {
              if (onLogoClick) {
                event.preventDefault();
                onLogoClick();
              }
            }}
          >
            <img src={myLogo} alt="" style={{ height: '36px', width: 'auto', display: 'block' }} />
            <span className={styles.wordmark}>iven</span>
          </a>

          <div className={styles.headerActions}>
            <span>Already have an account?</span>
            <button type="button" className={styles.headerLink} onClick={onSwitchToSignIn}>
              Sign In
            </button>
            <button
              type="button"
              className={styles.homeButton}
              onClick={onHomeClick ?? onLogoClick}
            >
              <HomeIcon size={18} />
              Home
            </button>
          </div>
        </header>

        <div className={styles.body}>
          <motion.div
            className={styles.pitch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <p className={styles.eyebrow}>
              <span aria-hidden="true">—</span> Join Riven as a vendor
            </p>
            <h1 className={styles.title}>
              Turn Your Passion Into <span className={styles.titleAccent}>Opportunity.</span>
            </h1>
            <p className={styles.lede}>
              Showcase your products, reach new customers, and be part of a growing community of
              creators and makers.
            </p>

            <ul className={styles.features}>
              <li className={styles.feature}>
                <span className={styles.featureIcon}>
                  <StoreIcon size={20} />
                </span>
                <div>
                  <p className={styles.featureTitle}>Set Up Your Store</p>
                  <p className={styles.featureCopy}>Create your vendor profile in minutes.</p>
                </div>
              </li>
              <li className={styles.feature}>
                <span className={styles.featureIcon}>
                  <PeopleIcon size={20} />
                </span>
                <div>
                  <p className={styles.featureTitle}>Reach More Customers</p>
                  <p className={styles.featureCopy}>Join a community that supports local and unique brands.</p>
                </div>
              </li>
              <li className={styles.feature}>
                <span className={styles.featureIcon}>
                  <TrendingUpIcon size={20} />
                </span>
                <div>
                  <p className={styles.featureTitle}>Grow Your Business</p>
                  <p className={styles.featureCopy}>Access tools, insights, and opportunities to scale.</p>
                </div>
              </li>
            </ul>

            <span className={styles.flowTag}>Be Part of the Flow</span>
          </motion.div>

          <motion.div
            className={styles.panel}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          >
            <h2 className={styles.panelTitle}>Create Your Vendor Account</h2>
            <p className={styles.panelSubtitle}>Fill in the details below to get started.</p>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="reg-fullname">
                    Full Name
                  </label>
                  <div className={`${styles.inputShell} ${errors.fullName ? styles.inputShellInvalid : ''}`}>
                    <UserIcon className={styles.inputIcon} size={18} />
                    <input
                      id="reg-fullname"
                      className={styles.input}
                      type="text"
                      autoComplete="name"
                      placeholder="Enter your name"
                      value={values.fullName}
                      onChange={(event) => setField('fullName', event.target.value)}
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={errors.fullName ? 'reg-fullname-error' : undefined}
                    />
                  </div>
                  {errors.fullName && (
                    <span id="reg-fullname-error" className={styles.error}>
                      {errors.fullName}
                    </span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="reg-email">
                    Email Address
                  </label>
                  <div className={`${styles.inputShell} ${errors.email ? styles.inputShellInvalid : ''}`}>
                    <MailIcon className={styles.inputIcon} size={18} />
                    <input
                      id="reg-email"
                      className={styles.input}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={values.email}
                      onChange={(event) => setField('email', event.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'reg-email-error' : undefined}
                    />
                  </div>
                  {errors.email && (
                    <span id="reg-email-error" className={styles.error}>
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="reg-phone">
                  Phone Number
                </label>
                <div className={`${styles.inputShell} ${errors.phone ? styles.inputShellInvalid : ''}`}>
                  <PhoneIcon className={styles.inputIcon} size={18} />
                  <input
                    id="reg-phone"
                    className={styles.input}
                    type="tel"
                    autoComplete="tel"
                    placeholder="+20 123 456 7890"
                    value={values.phone}
                    onChange={(event) => setField('phone', event.target.value)}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'reg-phone-error' : undefined}
                  />
                </div>
                {errors.phone && (
                  <span id="reg-phone-error" className={styles.error}>
                    {errors.phone}
                  </span>
                )}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="reg-password">
                    Password
                  </label>
                  <div className={`${styles.inputShell} ${errors.password ? styles.inputShellInvalid : ''}`}>
                    <LockIcon className={styles.inputIcon} size={18} />
                    <input
                      id="reg-password"
                      className={styles.input}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Create a strong password"
                      value={values.password}
                      onChange={(event) => setField('password', event.target.value)}
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={errors.password ? 'reg-password-error' : undefined}
                    />
                    <button
                      type="button"
                      className={styles.iconButton}
                      onClick={() => setShowPassword((show) => !show)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <span id="reg-password-error" className={styles.error}>
                      {errors.password}
                    </span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="reg-confirm-password">
                    Confirm Password
                  </label>
                  <div className={`${styles.inputShell} ${errors.confirmPassword ? styles.inputShellInvalid : ''}`}>
                    <LockIcon className={styles.inputIcon} size={18} />
                    <input
                      id="reg-confirm-password"
                      className={styles.input}
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      value={values.confirmPassword}
                      onChange={(event) => setField('confirmPassword', event.target.value)}
                      aria-invalid={Boolean(errors.confirmPassword)}
                      aria-describedby={errors.confirmPassword ? 'reg-confirm-password-error' : undefined}
                    />
                    <button
                      type="button"
                      className={styles.iconButton}
                      onClick={() => setShowConfirmPassword((show) => !show)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span id="reg-confirm-password-error" className={styles.error}>
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="reg-vendor-name">
                  Vendor Name
                </label>
                <div className={`${styles.inputShell} ${errors.vendorName ? styles.inputShellInvalid : ''}`}>
                  <StoreIcon className={styles.inputIcon} size={18} />
                  <input
                    id="reg-vendor-name"
                    className={styles.input}
                    type="text"
                    placeholder="Your business name"
                    value={values.vendorName}
                    onChange={(event) => setField('vendorName', event.target.value)}
                    aria-invalid={Boolean(errors.vendorName)}
                    aria-describedby={errors.vendorName ? 'reg-vendor-name-error' : undefined}
                  />
                </div>
                {errors.vendorName && (
                  <span id="reg-vendor-name-error" className={styles.error}>
                    {errors.vendorName}
                  </span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="reg-category">
                  Category
                </label>
                <Select
                  id="reg-category"
                  variant="auth"
                  label="Category"
                  placeholder="Select your category"
                  icon={GridIcon}
                  invalid={Boolean(errors.category)}
                  describedBy={errors.category ? 'reg-category-error' : undefined}
                  value={values.category}
                  options={categoryOptions}
                  onChange={(value) => setField('category', value)}
                />
                {errors.category && (
                  <span id="reg-category-error" className={styles.error}>
                    {errors.category}
                  </span>
                )}
              </div>

              <div className={styles.field}>
                <span className={styles.label}>
                  <TagIcon size={14} /> Vendor Type
                </span>
                <div className={styles.pillGroup} role="radiogroup" aria-label="Vendor type">
                  {VENDOR_TYPES.map(({ value, label }) => {
                    const checked = values.vendorType === value;
                    return (
                      <label
                        key={value}
                        className={`${styles.pill} ${checked ? styles.pillChecked : ''}`}
                      >
                        <input
                          className={styles.pillRadio}
                          type="radio"
                          name="vendorType"
                          value={value}
                          checked={checked}
                          onChange={() => setField('vendorType', value)}
                        />
                        <span className={`${styles.pillDot} ${checked ? styles.pillDotChecked : ''}`} aria-hidden="true" />
                        {label}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="reg-brand-story">
                  Brand Story <span className={styles.optional}>(Optional)</span>
                </label>
                <div className={`${styles.inputShell} ${styles.textareaShell}`}>
                  <DocumentIcon className={styles.inputIcon} size={18} />
                  <textarea
                    id="reg-brand-story"
                    className={styles.textarea}
                    placeholder="Tell us your story..."
                    rows={3}
                    value={values.brandStory}
                    onChange={(event) => setField('brandStory', event.target.value)}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="reg-location">
                  Location <span className={styles.optional}>(Optional)</span>
                </label>
                <div className={styles.inputShell}>
                  <MapPinIcon className={styles.inputIcon} size={18} />
                  <input
                    id="reg-location"
                    className={styles.input}
                    type="text"
                    placeholder="Add your location (optional)"
                    value={values.location}
                    onChange={(event) => setField('location', event.target.value)}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Upload Your Logo &amp; Cover Media</span>
                <label
                  className={`${styles.dropzone} ${dragActive ? styles.dropzoneActive : ''}`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                >
                  <input
                    className={styles.dropzoneInput}
                    type="file"
                    accept="image/png,image/jpeg"
                    multiple
                    onChange={handleFileInputChange}
                  />
                  <div className={styles.dropzoneLabel}>
                    <p className={styles.dropzoneTitle}>
                      {values.media.length > 0 ? 'Add more files' : 'Upload Your Logo & Cover Media'}
                    </p>
                    <p className={styles.dropzoneHint}>{mediaSummary}</p>
                  </div>
                  <UploadCloudIcon className={styles.dropzoneIcon} size={20} />
                </label>
                {errors.media && <span className={styles.error}>{errors.media}</span>}
                {values.media.length > 0 && (
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', margin: 0, padding: 0, listStyle: 'none' }}>
                    {values.media.map((file, index) => (
                      <li
                        key={`${file.name}-${index}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          fontSize: '0.8125rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {file.name} <span style={{ opacity: 0.7 }}>({formatFileSize(file.size)})</span>
                        </span>
                        <button
                          type="button"
                          className={styles.iconButton}
                          onClick={() => removeFile(index)}
                          aria-label={`Remove ${file.name}`}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className={styles.checkRow}>
                {/* The Terms/Privacy anchors sit outside the <label> so that
                    following them does not also toggle the checkbox. */}
                <label className={styles.checkboxLabel} htmlFor="reg-terms">
                  <input
                    id="reg-terms"
                    className={styles.checkbox}
                    type="checkbox"
                    checked={values.agreeToTerms}
                    onChange={(event) => setField('agreeToTerms', event.target.checked)}
                    aria-invalid={Boolean(errors.agreeToTerms)}
                    aria-describedby={errors.agreeToTerms ? 'reg-terms-error' : undefined}
                  />
                  <span
                    className={`${styles.checkboxBox} ${values.agreeToTerms ? styles.checkboxBoxChecked : ''}`}
                    aria-hidden="true"
                  >
                    {values.agreeToTerms && <CheckIcon size={11} strokeWidth={2.4} />}
                  </span>
                  I agree to the
                </label>
                <span>
                  <a className={styles.inlineLink} href="#terms">Terms &amp; Conditions</a> and{' '}
                  <a className={styles.inlineLink} href="#privacy">Privacy Policy</a>
                </span>
              </div>
              {errors.agreeToTerms && (
                <span id="reg-terms-error" className={styles.error}>
                  {errors.agreeToTerms}
                </span>
              )}

              {serverError && <p className={styles.formError}>{serverError}</p>}

              <button
                type="submit"
                className={`${styles.submit} ${submitting ? styles.submitDisabled : ''}`}
                disabled={submitting}
              >
                {submitting ? 'Creating Account…' : 'Create Vendor Account'}
              </button>

              <div className={styles.divider}>
                <span>Or continue with</span>
              </div>

              <div className={styles.socialRow}>
                <button type="button" className={styles.socialButton} onClick={onGoogleSignUp}>
                  <GoogleIcon size={18} />
                  Google
                </button>
                <button type="button" className={styles.socialButton} onClick={onFacebookSignUp}>
                  <FacebookIcon size={18} />
                  Facebook
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}