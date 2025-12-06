import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  imageAlt: string;
}

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      title: "Apprendre l'Allemand devient plus facile",
      subtitle: 'Rejoignez notre programme sur mesure pour étudiants et professionnels. Niveau A1 à C1.',
      buttonText: 'Voir les cours',
      buttonLink: '/formations',
      imageUrl: 'https://placehold.co/1920x800/1A1A1A/FFCC00?text=Etudiants+Africains',
      imageAlt: 'Étudiants africains apprenant l\'allemand',
    },
    {
      title: 'Votre avenir professionnel en Allemagne',
      subtitle: 'Formation professionnelle (Ausbildung), recrutement infirmiers et techniciens. Nous vous accompagnons.',
      buttonText: 'En savoir plus',
      buttonLink: '/services',
      imageUrl: 'https://placehold.co/1920x800/1A1A1A/FFCC00?text=Professionnel+Medical',
      imageAlt: 'Professionnels dans un environnement médical',
    },
    {
      title: 'Import-Export & Véhicules Allemands',
      subtitle: 'Achat de véhicules, pièces détachées et représentation commerciale.',
      buttonText: 'Visiter la Boutique',
      buttonLink: '/boutique',
      imageUrl: 'https://placehold.co/1920x800/1A1A1A/FFCC00?text=Vehicules+Allemands',
      imageAlt: 'Véhicules allemands et logistique',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${slide.imageUrl}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-mdla-black/80 to-mdla-black/40"></div>
          </div>

          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
                  {slide.subtitle}
                </p>
                <a
                  href={slide.buttonLink}
                  className="inline-block bg-mdla-red text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105"
                >
                  {slide.buttonText}
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-mdla-yellow/90 hover:bg-mdla-yellow text-mdla-black p-3 rounded-full transition-all z-10"
        aria-label="Slide précédent"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-mdla-yellow/90 hover:bg-mdla-yellow text-mdla-black p-3 rounded-full transition-all z-10"
        aria-label="Slide suivant"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-mdla-yellow w-8' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
