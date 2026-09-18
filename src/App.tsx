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

type View = 'home' | 'signIn' | 'register';

export default function App() {
  const [view, setView] = useState<View>('home');

  if (view === 'signIn') {
    return (
      <SignIn
        onLogoClick={() => setView('home')}
        onSwitchToRegister={() => setView('register')}
        onSubmit={(values) => {
          console.log('sign in', values);
          // TODO: call the real sign-in endpoint, then setView('home') on success.
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
        onSwitchToSignIn={() => setView('signIn')}
        onSubmit={(values) => {
          console.log('register', values);
          // TODO: call the real vendor sign-up endpoint, then setView('home') on success.
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