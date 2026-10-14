import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Personas from './components/Personas/Personas';
import HowItWorks from './components/HowItWorks/HowItWorks';
import StatsBand from './components/StatsBand/StatsBand';
import CtaFlow from './components/CtaFlow/CtaFlow';
import SiteFooter from './components/SiteFooter/SiteFooter';
import SignIn from './components/Auth/SignIn';
import Register from './components/Auth/Register';
import { ApiError } from './lib/api';
import { clearSession, loadSession, registerVendor, saveSession, signIn, type Session } from './lib/auth';

type View = 'home' | 'signIn' | 'register';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [session, setSession] = useState<Session | null>(() => loadSession());
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | undefined>(undefined);

  /** Shared by both auth forms: run the call, surface the API error, land on success. */
  const runAuth = async (call: () => Promise<Session>) => {
    setSubmitting(true);
    setServerError(undefined);
    try {
      const next = await call();
      saveSession(next);
      setSession(next);
      setView('home');
    } catch (error) {
      setServerError(
        error instanceof ApiError ? error.message : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = () => {
    clearSession();
    setSession(null);
  };

  /** Clears a stale error when moving between the two auth screens. */
  const go = (next: View) => {
    setServerError(undefined);
    setView(next);
  };

  if (view === 'signIn') {
    return (
      <SignIn
        onLogoClick={() => go('home')}
        onSwitchToRegister={() => go('register')}
        submitting={submitting}
        serverError={serverError}
        onSubmit={(values) => runAuth(() => signIn(values))}
      />
    );
  }

  if (view === 'register') {
    return (
      <Register
        onLogoClick={() => go('home')}
        onSwitchToSignIn={() => go('signIn')}
        submitting={submitting}
        serverError={serverError}
        onSubmit={(values) => runAuth(() => registerVendor(values))}
      />
    );
  }

  return (
    <>
      <Navbar
        onJoinClick={() => go('register')}
        onSignInClick={() => go('signIn')}
      />
      {session && (
        <p style={{ textAlign: 'center', padding: '0.75rem', margin: 0 }}>
          Signed in as {session.user.name} ({session.user.role}){' '}
          <button type="button" onClick={handleSignOut}>Sign out</button>
        </p>
      )}
      <main>
        {/* سكشن الهيرو يظهر فوراً */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Hero />
        </motion.div>

        {/* السكاشن الباقية مع إعدادات سكرول خفيفة وسريعة */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Personas />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <HowItWorks />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <StatsBand />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <CtaFlow />
        </motion.div>
      </main>
      <SiteFooter />
    </>
  );
}