import { useState } from 'react';
import { Package, FileText, Headphones, Plane, MessageSquare } from 'lucide-react';
import QuoteModal from '../components/QuoteModal';

const ServicesPage = () => {
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState('');

    const handleQuoteClick = (serviceType) => {
        setSelectedService(serviceType);
        setIsQuoteModalOpen(true);
    };

    const services = [
        {
            icon: Package,
            title: 'Représentation & Sourcing',
            description: 'Représentation de produits sur le marché germanophone (agroalimentaire, santé...). Recherche de véhicules et pièces détachées.',
            details: [
                'Représentation commerciale en Allemagne',
                'Sourcing de produits agroalimentaires',
                'Import de véhicules allemands',
                'Recherche de pièces détachées',
                'Négociation avec fournisseurs'
            ]
        },
        {
            icon: FileText,
            title: 'Traduction Certifiée',
            description: 'Pour vos documents personnels, administratifs ou professionnels.',
            details: [
                'Traduction certifiée français-allemand',
                'Documents administratifs',
                'Dossiers professionnels',
                'Actes d\'état civil',
                'Certification officielle'
            ]
        },
        {
            icon: Headphones,
            title: 'Services Pratiques',
            description: 'Assistance administrative & logistique. Services postaux et courriers fiables pour vos échanges transfrontaliers.',
            details: [
                'Assistance administrative complète',
                'Gestion logistique',
                'Services postaux internationaux',
                'Courrier sécurisé',
                'Suivi de colis'
            ]
        },
        {
            icon: Plane,
            title: 'Immersion & Culture',
            description: 'Voyages linguistiques et séjours d\'immersion totale. Formation interculturelle pour réussir votre intégration.',
            details: [
                'Voyages linguistiques en Allemagne',
                'Séjours d\'immersion totale',
                'Formation interculturelle',
                'Découverte culturelle',
                'Accompagnement sur place'
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-mdla-yellow to-yellow-400 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-mdla-black mb-6">
                        Nos Services
                    </h1>
                    <p className="text-xl text-mdla-black/80 max-w-3xl mx-auto">
                        Des solutions complètes pour tous vos besoins liés à l'Allemagne
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-mdla-yellow hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-16 h-16 bg-mdla-yellow rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-8 h-8 text-mdla-black" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-mdla-black mb-2">
                                                {service.title}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="font-semibold text-mdla-black mb-3">Ce que nous offrons :</h4>
                                        <ul className="space-y-2">
                                            {service.details.map((detail, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 bg-mdla-yellow rounded-full mt-2 flex-shrink-0"></span>
                                                    <span className="text-gray-700 text-sm">{detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <button
                                        onClick={() => handleQuoteClick(service.title)}
                                        className="w-full bg-mdla-yellow text-mdla-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        Demander un devis
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Quote Modal */}
            <QuoteModal
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
                preSelectedService={selectedService}
            />

            {/* Additional Services Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-mdla-black mb-6">
                            Besoin d'un service personnalisé ?
                        </h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Chaque projet est unique. Si vous ne trouvez pas exactement ce que vous cherchez,
                            n'hésitez pas à nous contacter. Nous étudierons ensemble vos besoins spécifiques
                            et vous proposerons une solution sur mesure.
                        </p>
                        <a
                            href="/contact"
                            className="inline-block bg-mdla-black text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-800 transition-all transform hover:scale-105"
                        >
                            Contactez-nous
                        </a>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16 bg-mdla-black text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        Pourquoi choisir nos services ?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-mdla-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-mdla-black">1</span>
                            </div>
                            <h3 className="font-bold text-xl mb-3">Expertise Reconnue</h3>
                            <p className="text-gray-300">
                                Des années d'expérience dans les relations franco-allemandes
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-mdla-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-mdla-black">2</span>
                            </div>
                            <h3 className="font-bold text-xl mb-3">Service Personnalisé</h3>
                            <p className="text-gray-300">
                                Un accompagnement adapté à vos besoins spécifiques
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-mdla-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-mdla-black">3</span>
                            </div>
                            <h3 className="font-bold text-xl mb-3">Résultats Garantis</h3>
                            <p className="text-gray-300">
                                Nous nous engageons pour votre réussite
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
