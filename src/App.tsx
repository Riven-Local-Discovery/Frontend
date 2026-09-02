import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Personas from './components/Personas/Personas';
import HowItWorks from './components/HowItWorks/HowItWorks';
import StatsBand from './components/StatsBand/StatsBand';
import CtaFlow from './components/CtaFlow/CtaFlow';
import SiteFooter from './components/SiteFooter/SiteFooter';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Personas />
        <HowItWorks />
        <StatsBand />
        <CtaFlow />
      </main>
      <SiteFooter />
    </>
  );
}
