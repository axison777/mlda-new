import { Users, Award, Handshake } from 'lucide-react';

const AboutSection = () => {
  const strengths = [
    {
      icon: Users,
      title: 'Formateurs Natifs',
      description: 'Enseignement authentique par des experts allemands expérimentés',
    },
    {
      icon: Award,
      title: 'Rigueur Allemande',
      description: 'Standards de qualité élevés et certifications reconnues',
    },
    {
      icon: Handshake,
      title: 'Ancrage Africain',
      description: 'Compréhension culturelle et adaptation locale',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-gray-300 rounded-lg overflow-hidden h-96 md:h-full">
              <img
                src="https://placehold.co/600x500/1A1A1A/FFCC00?text=Equipe+MDLA"
                alt="Équipe MDLA"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-mdla-black mb-6">
              La MDLA : Votre passerelle vers le monde germanophone
            </h2>

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              La Maison de l'Allemagne est un institut d'excellence spécialisé dans l'enseignement de la
              langue allemande et la promotion de services personnalisés. Notre équipe de formateurs natifs
              et bilingues vous connecte à une culture et un marché.
            </p>

            <div className="space-y-6">
              {strengths.map((strength, index) => {
                const Icon = strength.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-mdla-yellow">
                        <Icon className="h-6 w-6 text-mdla-black" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-mdla-black mb-2">{strength.title}</h3>
                      <p className="text-gray-600">{strength.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
