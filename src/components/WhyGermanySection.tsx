import { useState, useEffect } from 'react';
import imageAllemagne from '../assets/image_allemagne.jpg';

const WhyGermanySection = () => {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('why-germany-section');
      if (element) {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight) {
          const offset = (windowHeight - elementTop) * 0.3;
          setOffsetY(offset);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="why-germany-section"
      className="relative py-20 md:py-32 overflow-hidden"
      style={{
        backgroundImage: `url(${imageAllemagne})`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-mdla-black/85 to-mdla-black/60"
        style={{ transform: `translateY(${offsetY}px)` }}
      ></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-mdla-yellow mb-6">Pourquoi l'Allemagne ?</h2>

        <p className="text-xl md:text-2xl text-white leading-relaxed mb-8">
          Première puissance économique d'Europe. Un pays qui recrute activement des jeunes talents africains.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-mdla-yellow/20 backdrop-blur-sm rounded-lg p-6 border border-mdla-yellow/40">
            <div className="text-4xl font-bold text-mdla-yellow mb-2">82M+</div>
            <p className="text-white text-sm">Population active en Europe</p>
          </div>

          <div className="bg-mdla-yellow/20 backdrop-blur-sm rounded-lg p-6 border border-mdla-yellow/40">
            <div className="text-4xl font-bold text-mdla-yellow mb-2">4.5T€</div>
            <p className="text-white text-sm">PIB de l'Allemagne</p>
          </div>

          <div className="bg-mdla-yellow/20 backdrop-blur-sm rounded-lg p-6 border border-mdla-yellow/40">
            <div className="text-4xl font-bold text-mdla-yellow mb-2">250K+</div>
            <p className="text-white text-sm">Postes vacants par an</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyGermanySection;
