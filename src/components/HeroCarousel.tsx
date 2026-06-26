import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import imageEtudiant from '../assets/image_etudiant.jpg';
import imageProfessionnel from '../assets/image_professionnel.jpg';
import imageVoiture from '../assets/image_voiture.jpg';
import api from '../utils/api';

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
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const defaultSlides: Slide[] = [
    {
      title: "Apprendre l'Allemand devient plus facile",
      subtitle: 'Rejoignez notre programme sur mesure pour étudiants et professionnels. Niveau A1 à C1.',
      buttonText: 'Voir les cours',
      buttonLink: '/formations',
      imageUrl: imageEtudiant,
      imageAlt: 'Étudiants africains apprenant l\'allemand',
    },
    {
      title: 'Votre avenir professionnel en Allemagne',
      subtitle: 'Formation professionnelle (Ausbildung), recrutement infirmiers et techniciens. Nous vous accompagnons.',
      buttonText: 'En savoir plus',
      buttonLink: '/services',
      imageUrl: imageProfessionnel,
      imageAlt: 'Professionnels dans un environnement médical',
    },
    {
      title: 'Import et Export',
      subtitle: 'Électronique, électroménager, agroalimentaire, véhicules, cosmétiques et plus.',
      buttonText: 'Visiter la Boutique',
      buttonLink: '/boutique',
      imageUrl: imageVoiture,
      imageAlt: 'Véhicules allemands et logistique',
    },
  ];

  useEffect(() => {
    const fetchHeroCampaigns = async () => {
      try {
        const { data } = await api.get('/campaigns/active');
        const heroCampaigns = data.filter((c: any) => c.placement === 'hero');
        
        if (heroCampaigns.length > 0) {
          const dynamicSlides = heroCampaigns.map((c: any) => ({
            title: c.title,
            subtitle: c.description || '',
            buttonText: c.buttonText || 'Découvrir',
            buttonLink: c.url || '#',
            imageUrl: c.imageUrl || imageEtudiant, // Fallback image if none provided
            imageAlt: c.title,
            campaignId: c.id // Store campaign id to track clicks
          }));
          setSlides(dynamicSlides);
        } else {
          setSlides(defaultSlides);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des bannières hero:', error);
        setSlides(defaultSlides);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroCampaigns();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
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

  const handleCTA = async (slide: any) => {
    if (slide.campaignId) {
      api.post(`/campaigns/${slide.campaignId}/click`).catch(console.error);
    }
    if (slide.buttonLink.startsWith('http')) {
      window.open(slide.buttonLink, '_blank');
    } else if (slide.buttonLink !== '#') {
      navigate(slide.buttonLink);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[600px] md:h-[700px] bg-mdla-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-mdla-yellow animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${slide.imageUrl}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-mdla-black/80 to-mdla-black/40"></div>
          </div>

          <div className="relative h-full flex items-center">
            <div className="max-w-[90rem] mx-auto px-6 md:px-12 lg:px-20 w-full">
              <div className="text-left">
                <h1 className="max-w-5xl text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="max-w-2xl text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
                  {slide.subtitle}
                </p>
                <button
                  onClick={() => handleCTA(slide)}
                  className="inline-block bg-mdla-red text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105"
                >
                  {slide.buttonText}
                </button>
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
            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-mdla-yellow w-8' : 'bg-white/50 hover:bg-white/75'
              }`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
