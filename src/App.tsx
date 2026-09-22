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

type View = 'home' | 'signIn' | 'register' | 'dashboard';

export default function App() {
  const [view, setView] = useState<View>('home');

  if (view === 'dashboard') {
    return <VendorDashboard onExit={() => setView('home')} />;
  }

  if (view === 'signIn') {
    return (
      <SignIn
        onLogoClick={() => setView('home')}
        onHomeClick={() => setView('home')}
        onSwitchToRegister={() => setView('register')}
        onSubmit={() => {
          // TODO: POST /auth/login, store the token pair, then continue.
          // Do not log `values` here — it carries the plaintext password.
          setView('dashboard');
        }}
        onForgotPassword={() => {
          // TODO: route to a "forgot password" flow.
        }}
        onGoogleSignIn={() => {
          // TODO: kick off Google OAuth.
        }}
        onFacebookSignIn={() => {
          // TODO: kick off Facebook OAuth.
        }}
      />
    );
  }

  if (view === 'register') {
    return (
      <Register
        onLogoClick={() => setView('home')}
        onHomeClick={() => setView('home')}
        onSwitchToSignIn={() => setView('signIn')}
        onSubmit={() => {
          // TODO: POST /auth/register/vendor, store the token pair, then continue.
          // Do not log `values` here — it carries the plaintext password.
          // New vendors start unverified — the dashboard shows that state.
          setView('dashboard');
        }}
        onGoogleSignUp={() => {
          // TODO: kick off Google OAuth.
        }}
        onFacebookSignUp={() => {
          // TODO: kick off Facebook OAuth.
        }}
      />
    );
  }

  return (
    <>
      <Navbar
        onJoinClick={() => setView('register')}
        onSignInClick={() => setView('signIn')}
        /* Dev shortcut: opens the vendor dashboard without signing in.
           Remove this prop once /auth/login is wired up. */
        onDashboardClick={() => setView('dashboard')}
      />
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