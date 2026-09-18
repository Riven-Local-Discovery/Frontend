import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import authImage from '../../assets/img/signin-river-sunset.jpg';
import myLogo from '../../assets/img/logo.png';
import {
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  FacebookIcon,
  GoogleIcon,
  LockIcon,
  MailIcon,
} from '../icons';
import styles from './SignIn.module.scss';

export interface SignInValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignInProps {
  /** Called with the form values once client-side validation passes. */
  onSubmit?: (values: SignInValues) => void | Promise<void>;
  /** "Sign Up" link in the header and the footer prompt. */
  onSwitchToRegister?: () => void;
  onForgotPassword?: () => void;
  onGoogleSignIn?: () => void;
  onFacebookSignIn?: () => void;
  /** Called when the Riven logo/wordmark is clicked, e.g. to return home. */
  onLogoClick?: () => void;
  /** Surface a server-side error (bad credentials, network failure, ...). */
  serverError?: string;
  /** Disable the form while a submit request is in flight. */
  submitting?: boolean;
}

type FieldErrors = Partial<Record<'email' | 'password', string>>;

function validate(values: SignInValues): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.email.trim()) {
    errors.email = 'Enter your email address.';
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Enter your password.';
  }

  return errors;
}

export default function SignIn({
  onSubmit,
  onSwitchToRegister,
  onForgotPassword,
  onGoogleSignIn,
  onFacebookSignIn,
  onLogoClick,
  serverError,
  submitting = false,
}: SignInProps) {
  const [values, setValues] = useState<SignInValues>({
    email: '',
    password: '',
    rememberMe: true,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const setField = <K extends keyof SignInValues>(key: K, value: SignInValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSubmit?.(values);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.media} aria-hidden="true">
        <img className={styles.mediaImage} src={authImage} alt="" />
        <div className={styles.scrim} />
      </div>

      <div style={{ position: 'relative', zIndex: 4, display: 'flex', flexDirection: 'column', flex: 1 }}>
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
            <span>Don&rsquo;t have an account?</span>
            <button type="button" className={styles.headerLink} onClick={onSwitchToRegister}>
              Sign Up
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
              <span aria-hidden="true">—</span> Welcome back
            </p>
            <h1 className={styles.title}>
              Sign In to <span className={styles.titleAccent}>Riven</span>
            </h1>
            <p className={styles.lede}>
              Continue your journey and explore amazing experiences, products and communities.
            </p>
            <span className={styles.flowTag}>Be Part of the Flow</span>
          </motion.div>

          <motion.div
            className={styles.panel}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          >
            <h2 className={styles.panelTitle}>Welcome back</h2>
            <p className={styles.panelSubtitle}>Sign in to your Riven account</p>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="signin-email">
                  Email Address
                </label>
                <div className={`${styles.inputShell} ${errors.email ? styles.inputShellInvalid : ''}`}>
                  <MailIcon className={styles.inputIcon} size={18} />
                  <input
                    id="signin-email"
                    className={styles.input}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={(event) => setField('email', event.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'signin-email-error' : undefined}
                  />
                </div>
                {errors.email && (
                  <span id="signin-email-error" className={styles.error}>
                    {errors.email}
                  </span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="signin-password">
                  Password
                </label>
                <div className={`${styles.inputShell} ${errors.password ? styles.inputShellInvalid : ''}`}>
                  <LockIcon className={styles.inputIcon} size={18} />
                  <input
                    id="signin-password"
                    className={styles.input}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={(event) => setField('password', event.target.value)}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'signin-password-error' : undefined}
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
                  <span id="signin-password-error" className={styles.error}>
                    {errors.password}
                  </span>
                )}
              </div>

              <div className={styles.checkRow}>
                <label className={styles.checkboxLabel}>
                  <input
                    className={styles.checkbox}
                    type="checkbox"
                    checked={values.rememberMe}
                    onChange={(event) => setField('rememberMe', event.target.checked)}
                  />
                  <span
                    className={`${styles.checkboxBox} ${values.rememberMe ? styles.checkboxBoxChecked : ''}`}
                    aria-hidden="true"
                  >
                    {values.rememberMe && <CheckIcon size={11} strokeWidth={2.4} />}
                  </span>
                  Remember me
                </label>
                <button type="button" className={styles.inlineLink} onClick={onForgotPassword}>
                  Forgot password?
                </button>
              </div>

              {serverError && <p className={styles.formError}>{serverError}</p>}

              <button
                type="submit"
                className={`${styles.submit} ${submitting ? styles.submitDisabled : ''}`}
                disabled={submitting}
              >
                {submitting ? 'Signing In…' : 'Sign In'}
              </button>

              <div className={styles.divider}>
                <span>or</span>
              </div>

              <div className={styles.socialRow}>
                <button type="button" className={styles.socialButton} onClick={onGoogleSignIn}>
                  <GoogleIcon size={18} />
                  Google
                </button>
                <button type="button" className={styles.socialButton} onClick={onFacebookSignIn}>
                  <FacebookIcon size={18} />
                  Facebook
                </button>
              </div>
            </form>

            <p className={styles.footnote}>
              By signing in, you agree to our <a className={styles.inlineLink} href="#terms">Terms &amp; Conditions</a> and{' '}
              <a className={styles.inlineLink} href="#privacy">Privacy Policy</a>.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}