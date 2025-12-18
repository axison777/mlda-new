import { Link } from 'react-router-dom';
import { Handshake, Globe, TrendingUp, Users, CheckCircle, Target } from 'lucide-react';
import { useState } from 'react';
import QuoteModal from '../../components/QuoteModal';

const RepresentationServicePage = () => {
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

    const services = [
        {
            icon: Handshake,
            title: 'Représentation Commerciale',
            description: 'Nous représentons votre entreprise en Allemagne ou en Afrique',
            features: ['Prospection de clients', 'Négociation commerciale', 'Suivi des contrats', 'Reporting régulier']
        },
        {
            icon: Globe,
            title: 'Sourcing de Produits',
            description: 'Trouvez les meilleurs fournisseurs allemands pour vos besoins',
            features: ['Recherche de fournisseurs', 'Vérification qualité', 'Négociation prix', 'Logistique']
        },
        {
            icon: TrendingUp,
            title: 'Développement B2B',
            description: 'Développez votre activité à l\'international',
            features: ['Étude de marché', 'Stratégie d\'entrée', 'Partenariats stratégiques', 'Accompagnement continu']
        }
    ];

    const sectors = [
        'Automobile & Pièces détachées',
        'Machines & Équipements industriels',
        'Électronique & Technologies',
        'Agroalimentaire',
        'Cosmétiques & Produits de beauté',
        'Textile & Mode',
        'Énergie renouvelable',
        'Construction & BTP'
    ];

    const advantages = [
        { icon: Users, title: 'Réseau étendu', description: 'Plus de 200 partenaires en Allemagne et en Afrique' },
        { icon: CheckCircle, title: 'Expertise sectorielle', description: '15 ans d\'expérience dans le commerce international' },
        { icon: Target, title: 'Approche personnalisée', description: 'Solutions adaptées à vos objectifs spécifiques' },
        { icon: Globe, title: 'Présence locale', description: 'Bureaux en Allemagne et en Afrique de l\'Ouest' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-mdla-yellow to-yellow-400 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <Handshake className="w-20 h-20 text-mdla-black mx-auto mb-6" />
                        <h1 className="text-5xl font-bold text-mdla-black mb-4">
                            Représentation & B2B
                        </h1>
                        <p className="text-xl text-mdla-black/80 max-w-3xl mx-auto mb-8">
                            Votre partenaire de confiance pour développer votre business entre l'Allemagne et l'Afrique
                        </p>
                        <button
                            onClick={() => setIsQuoteModalOpen(true)}
                            className="bg-mdla-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-all transform hover:scale-105"
                        >
                            Devenir partenaire
                        </button>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-mdla-black mb-12 text-center">
                        Nos Services B2B
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-mdla-yellow"
                                >
                                    <div className="w-16 h-16 bg-mdla-yellow rounded-full flex items-center justify-center mb-6">
                                        <Icon className="w-8 h-8 text-mdla-black" />
                                    </div>
                                    <h3 className="text-xl font-bold text-mdla-black mb-3">{service.title}</h3>
                                    <p className="text-gray-700 mb-6">{service.description}</p>
                                    <ul className="space-y-2">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                                <CheckCircle className="w-4 h-4 text-mdla-yellow flex-shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Sectors */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-mdla-black mb-12 text-center">
                        Secteurs d'Activité
                    </h2>
                    <div className="grid md:grid-cols-4 gap-4">
                        {sectors.map((sector, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg p-4 text-center hover:bg-mdla-yellow hover:text-mdla-black transition-colors cursor-pointer"
                            >
                                <p className="font-semibold">{sector}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Advantages */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-mdla-black mb-12 text-center">
                        Pourquoi Choisir MDLA ?
                    </h2>
                    <div className="grid md:grid-cols-4 gap-8">
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

            {/* Success Stories */}
            <section className="py-16 bg-gradient-to-br from-mdla-black to-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white mb-12 text-center">
                        Cas de Succès
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-white">
                            <p className="text-4xl font-bold text-mdla-yellow mb-2">50+</p>
                            <p className="text-lg font-semibold mb-2">Partenariats créés</p>
                            <p className="text-sm text-gray-300">Entre entreprises africaines et allemandes</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-white">
                            <p className="text-4xl font-bold text-mdla-yellow mb-2">€5M+</p>
                            <p className="text-lg font-semibold mb-2">Volume d'affaires</p>
                            <p className="text-sm text-gray-300">Généré pour nos clients en 2024</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-white">
                            <p className="text-4xl font-bold text-mdla-yellow mb-2">95%</p>
                            <p className="text-lg font-semibold mb-2">Taux de satisfaction</p>
                            <p className="text-sm text-gray-300">Clients satisfaits et fidèles</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-mdla-yellow">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-mdla-black mb-4">
                        Développez votre business international
                    </h2>
                    <p className="text-mdla-black/80 mb-8">
                        Contactez-nous pour une consultation gratuite et découvrez comment nous pouvons vous aider
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => setIsQuoteModalOpen(true)}
                            className="bg-mdla-black text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-800 transition-all"
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
                preSelectedService="Représentation & B2B"
            />
        </div>
    );
};

export default RepresentationServicePage;
