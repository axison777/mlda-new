import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import AboutSection from './components/AboutSection';
import TargetsSection from './components/TargetsSection';
import WhyGermanySection from './components/WhyGermanySection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroCarousel />
      <AboutSection />
      <TargetsSection />
      <WhyGermanySection />
      <Footer />
    </div>
  );
}

export default App;
