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
import { VendorDashboard } from './components/Dashboard';
import { ApiError } from './lib/api';
import { clearSession, loadSession, registerVendor, saveSession, signIn, type Session } from './lib/auth';

type View = 'home' | 'signIn' | 'register' | 'dashboard';

/** SHOPPER -> Shopper. The navbar shows a label, not an enum. */
function roleLabel(role: string): string {
  return role.charAt(0) + role.slice(1).toLowerCase();
}

export default function App() {
  const [view, setView] = useState<View>('home');
  const [session, setSession] = useState<Session | null>(() => loadSession());
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | undefined>(undefined);

  /** Clears a stale error when moving between screens. */
  const go = (next: View) => {
    setServerError(undefined);
    setView(next);
  };

  /**
   * Shared by both auth forms: run the call, surface the API error, and land on
   * the dashboard — which is where a signed-in vendor belongs.
   */
  const runAuth = async (call: () => Promise<Session>) => {
    setSubmitting(true);
    setServerError(undefined);
    try {
      const next = await call();
      saveSession(next);
      setSession(next);
      setView(next.user.role === 'VENDOR' ? 'dashboard' : 'home');
    } catch (error) {
      setServerError(error instanceof ApiError ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = () => {
    clearSession();
    setSession(null);
    setView('home');
  };

  // The dashboard is vendor-only and needs a session: reaching it without one
  // (stale state, a sign-out in another tab) falls back to the landing page.
  if (view === 'dashboard') {
    if (!session) {
      return <HomeView />;
    }
    return <VendorDashboard onExit={() => go('home')} />;
  }

  if (view === 'signIn') {
    return (
      <SignIn
        onLogoClick={() => go('home')}
        onHomeClick={() => go('home')}
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
        onHomeClick={() => go('home')}
        onSwitchToSignIn={() => go('signIn')}
        submitting={submitting}
        serverError={serverError}
        onSubmit={(values) => runAuth(() => registerVendor(values))}
      />
    );
  }

  return <HomeView />;

  function HomeView() {
    return (
      <>
        <Navbar
          onJoinClick={() => go('register')}
          onSignInClick={() => go('signIn')}
          // Only offered to a signed-in vendor. The dev shortcut that opened the
          // dashboard without credentials is gone now that /auth/login is real.
          onDashboardClick={session?.user.role === 'VENDOR' ? () => go('dashboard') : undefined}
          // Passing a label is what swaps Sign In / Join Now for the account block.
          userLabel={session?.user.name}
          userRole={session ? roleLabel(session.user.role) : undefined}
          onSignOutClick={handleSignOut}
        />
        <main>
          {/* سكشن الهيرو يظهر فوراً */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Hero />
          </motion.div>

          {/* السكاشن الباقية مع إعدادات سكرول خفيفة وسريعة */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -50px 0px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Personas />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -50px 0px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <HowItWorks />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -50px 0px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <StatsBand />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -50px 0px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <CtaFlow />
          </motion.div>
        </main>
        <SiteFooter />
      </>
    );
  }
}
