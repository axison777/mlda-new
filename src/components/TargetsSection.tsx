import { BookOpen, Briefcase, Settings } from 'lucide-react';

const TargetsSection = () => {
  const targets = [
    {
      icon: BookOpen,
      title: 'Élèves et Étudiants',
      description: 'Accompagnement inscriptions universitaires, frais de scolarité réduits.',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Briefcase,
      title: 'Entreprises',
      description: 'Partenariats B2B, développement d\'activités en Allemagne.',
      bgColor: 'bg-green-50',
    },
    {
      icon: Settings,
      title: 'Candidats Ausbildung',
      description: 'Formation duale rémunérée (Santé, Social, Technique).',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-mdla-black mb-4">Nos Cibles</h2>
          <p className="text-xl text-gray-600">Des solutions adaptées pour chaque profil</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {targets.map((target, index) => {
            const Icon = target.icon;
            return (
              <div
                key={index}
                className={`${target.bgColor} rounded-lg p-8 transition-transform hover:scale-105 hover:shadow-lg`}
              >
                <div className="flex justify-center mb-6">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-mdla-yellow">
                    <Icon className="h-8 w-8 text-mdla-black" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-mdla-black text-center mb-4">{target.title}</h3>
                <p className="text-gray-700 text-center leading-relaxed">{target.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TargetsSection;
