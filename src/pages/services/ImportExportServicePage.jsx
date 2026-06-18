import { Link } from 'react-router-dom';
import { Car, Ship, CheckCircle, Clock, Shield, TrendingUp, Smartphone, Home, Coffee, Sparkles } from 'lucide-react';
import { useState } from 'react';
import QuoteModal from '../../components/QuoteModal';

const ImportExportServicePage = () => {
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

    const productTypes = [
        { name: 'Électronique', description: 'Smartphones, ordinateurs, accessoires', icon: Smartphone },
        { name: 'Électroménager', description: 'Réfrigérateurs, fours, climatiseurs', icon: Home },
        { name: 'Agroalimentaire', description: 'Produits transformés, denrées', icon: Coffee },
        { name: 'Véhicules', description: 'Berlines, SUV, utilitaires', icon: Car },
        { name: 'Cosmétiques', description: 'Soins, beauté, parfums', icon: Sparkles }
    ];

    const processSteps = [
        { step: 1, title: 'Consultation', description: 'Définition de vos besoins et budget' },
        { step: 2, title: 'Recherche', description: 'Sourcing des marchandises en Allemagne' },
        { step: 3, title: 'Achat', description: 'Négociation et acquisition' },
        { step: 4, title: 'Transport', description: 'Acheminement maritime vers l\'Afrique' },
        { step: 5, title: 'Livraison', description: 'Réception de vos marchandises' }
    ];

    const advantages = [
        { icon: Shield, title: 'Garantie qualité', description: 'Marchandises vérifiées et certifiées' },
        { icon: Clock, title: 'Délais respectés', description: 'Livraison en 4-8 semaines' },
        { icon: CheckCircle, title: 'Service complet', description: 'De A à Z sans souci' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-mdla-black to-gray-800 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <Ship className="w-20 h-20 text-mdla-yellow mx-auto mb-6" />
                        <h1 className="text-5xl font-bold text-white mb-4">
                            Import et Export
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            Importez vos marchandises d'Allemagne en toute sérénité. Qualité allemande, prix abordables.
                        </p>
                        <button
                            onClick={() => setIsQuoteModalOpen(true)}
                            className="bg-mdla-yellow text-mdla-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-all transform hover:scale-105"
                        >
                            Commander des marchandises
                        </button>
                    </div>
                </div>
            </section>

            {/* Advantages */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-mdla-black mb-12 text-center">
                        Pourquoi importer avec MDLA ?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {advantages.map((advantage, index) => {
                            const Icon = advantage.icon;
                            return (
                                <div key={index} className="text-center">
                                    <div className="w-16 h-16 bg-mdla-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-8 h-8 text-mdla-black" />
                                    </div>
                                    <h3 className="font-bold text-mdla-black mb-2">{advantage.title}</h3>
                                    <p className="text-sm text-gray-600">{advantage.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Vehicle Types */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-mdla-black mb-12 text-center">
                        Types de Produits Disponibles
                    </h2>
                    <div className="grid md:grid-cols-5 gap-6">
                        {productTypes.map((type, index) => {
                            const Icon = type.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-mdla-yellow"
                                >
                                    <Icon className="w-12 h-12 text-mdla-yellow mb-4" />
                                    <h3 className="font-bold text-mdla-black mb-2">{type.name}</h3>
                                    <p className="text-sm text-gray-600">{type.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Process */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-mdla-black mb-12 text-center">
                        Notre Processus d'Import
                    </h2>
                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {processSteps.map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="w-16 h-16 bg-mdla-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-mdla-black">{item.step}</span>
                                </div>
                                <h3 className="font-bold text-mdla-black mb-2">{item.title}</h3>
                                <p className="text-xs text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* CTA Section */}
            <section className="py-16 bg-mdla-black">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Prêt à importer vos marchandises ?
                    </h2>
                    <p className="text-gray-300 mb-8">
                        Contactez-nous pour une consultation gratuite et un devis personnalisé
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => setIsQuoteModalOpen(true)}
                            className="bg-mdla-yellow text-mdla-black px-8 py-4 rounded-lg font-bold hover:bg-yellow-400 transition-all"
                        >
                            Commander maintenant
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
                preSelectedService="Import et Export"
            />
        </div>
    );
};

export default ImportExportServicePage;
