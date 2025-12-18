import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Clock, Users, Award, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import QuoteModal from '../../components/QuoteModal';

const FormationServicePage = () => {
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

    const levels = [
        { name: 'A1 - Débutant', duration: '3 mois', price: '150 000 FCFA', description: 'Bases de la langue allemande' },
        { name: 'A2 - Élémentaire', duration: '3 mois', price: '175 000 FCFA', description: 'Communication simple et quotidienne' },
        { name: 'B1 - Intermédiaire', duration: '4 mois', price: '200 000 FCFA', description: 'Conversations courantes et professionnelles' },
        { name: 'B2 - Avancé', duration: '4 mois', price: '225 000 FCFA', description: 'Maîtrise approfondie de la langue' },
        { name: 'C1 - Autonome', duration: '5 mois', price: '250 000 FCFA', description: 'Expression fluide et spontanée' }
    ];

    const advantages = [
        'Professeurs natifs allemands',
        'Petits groupes (max 12 élèves)',
        'Certification reconnue',
        'Matériel pédagogique inclus',
        'Préparation aux examens Goethe',
        'Horaires flexibles'
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-mdla-yellow to-yellow-400 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <GraduationCap className="w-20 h-20 text-mdla-black mx-auto mb-6" />
                        <h1 className="text-5xl font-bold text-mdla-black mb-4">
                            Formation & Langue Allemande
                        </h1>
                        <p className="text-xl text-mdla-black/80 max-w-3xl mx-auto mb-8">
                            Apprenez l'allemand avec des professeurs qualifiés et obtenez une certification reconnue internationalement
                        </p>
                        <button
                            onClick={() => setIsQuoteModalOpen(true)}
                            className="bg-mdla-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-all transform hover:scale-105"
                        >
                            S'inscrire maintenant
                        </button>
                    </div>
                </div>
            </section>

            {/* Description */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-mdla-black mb-6">
                                Pourquoi apprendre l'allemand avec MDLA ?
                            </h2>
                            <p className="text-gray-700 mb-4">
                                L'allemand est la langue la plus parlée en Europe et ouvre de nombreuses opportunités professionnelles et académiques. Nos formations sont conçues pour vous permettre de maîtriser la langue rapidement et efficacement.
                            </p>
                            <p className="text-gray-700 mb-6">
                                Que vous souhaitiez étudier en Allemagne, travailler dans une entreprise allemande ou simplement enrichir vos compétences linguistiques, nos cours s'adaptent à vos objectifs.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                {advantages.map((advantage, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">{advantage}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="text-center">
                                    <Users className="w-12 h-12 text-mdla-yellow mx-auto mb-3" />
                                    <p className="text-3xl font-bold text-mdla-black">500+</p>
                                    <p className="text-sm text-gray-600">Étudiants formés</p>
                                </div>
                                <div className="text-center">
                                    <Award className="w-12 h-12 text-mdla-yellow mx-auto mb-3" />
                                    <p className="text-3xl font-bold text-mdla-black">95%</p>
                                    <p className="text-sm text-gray-600">Taux de réussite</p>
                                </div>
                                <div className="text-center">
                                    <BookOpen className="w-12 h-12 text-mdla-yellow mx-auto mb-3" />
                                    <p className="text-3xl font-bold text-mdla-black">15</p>
                                    <p className="text-sm text-gray-600">Ans d'expérience</p>
                                </div>
                                <div className="text-center">
                                    <Clock className="w-12 h-12 text-mdla-yellow mx-auto mb-3" />
                                    <p className="text-3xl font-bold text-mdla-black">3-5</p>
                                    <p className="text-sm text-gray-600">Mois par niveau</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Levels */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-mdla-black mb-12 text-center">
                        Nos Niveaux de Formation
                    </h2>
                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {levels.map((level, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-mdla-yellow"
                            >
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 bg-mdla-yellow rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span className="text-2xl font-bold text-mdla-black">{level.name.split(' ')[0]}</span>
                                    </div>
                                    <h3 className="font-bold text-mdla-black mb-1">{level.name}</h3>
                                    <p className="text-sm text-gray-600">{level.description}</p>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Durée:</span>
                                        <span className="font-semibold">{level.duration}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Prix:</span>
                                        <span className="font-semibold text-mdla-yellow">{level.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-mdla-black to-gray-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Prêt à commencer votre apprentissage ?
                    </h2>
                    <p className="text-gray-300 mb-8">
                        Rejoignez nos prochaines sessions et commencez votre parcours vers la maîtrise de l'allemand
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => setIsQuoteModalOpen(true)}
                            className="bg-mdla-yellow text-mdla-black px-8 py-4 rounded-lg font-bold hover:bg-yellow-400 transition-all"
                        >
                            Demander un devis
                        </button>
                        <Link
                            to="/contact"
                            className="bg-white text-mdla-black px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all"
                        >
                            Nous contacter
                        </Link>
                    </div>
                </div>
            </section>

            {/* Quote Modal */}
            <QuoteModal
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
                preSelectedService="Formation & Langue Allemande"
            />
        </div>
    );
};

export default FormationServicePage;
