import { Link } from 'react-router-dom';
import { FileText, Languages, Award, Clock, CheckCircle, Globe } from 'lucide-react';
import { useState } from 'react';
import QuoteModal from '../../components/QuoteModal';

const TraductionServicePage = () => {
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

    const translationTypes = [
        {
            icon: FileText,
            title: 'Documents officiels',
            description: 'Actes de naissance, diplômes, certificats',
            price: 'À partir de 25€'
        },
        {
            icon: Globe,
            title: 'Documents commerciaux',
            description: 'Contrats, factures, documents d\'entreprise',
            price: 'À partir de 30€'
        },
        {
            icon: Award,
            title: 'Documents académiques',
            description: 'Relevés de notes, lettres de motivation',
            price: 'À partir de 20€'
        },
        {
            icon: Languages,
            title: 'Traduction technique',
            description: 'Manuels, spécifications, rapports',
            price: 'Sur devis'
        }
    ];

    const services = [
        {
            title: 'Traduction certifiée',
            description: 'Traductions officielles reconnues par les autorités allemandes et africaines',
            features: ['Cachet officiel', 'Signature du traducteur', 'Valeur légale', 'Acceptée partout']
        },
        {
            title: 'Démarches administratives',
            description: 'Assistance complète pour vos formalités en Allemagne',
            features: ['Visa étudiant/travail', 'Inscription universitaire', 'Reconnaissance de diplômes', 'Permis de séjour']
        },
        {
            title: 'Légalisation de documents',
            description: 'Apostille et légalisation pour vos documents officiels',
            features: ['Apostille de La Haye', 'Légalisation consulaire', 'Certification conforme', 'Envoi sécurisé']
        }
    ];

    const languages = [
        'Allemand ↔ Français',
        'Allemand ↔ Anglais',
        'Français ↔ Anglais',
        'Allemand ↔ Mooré',
        'Allemand ↔ Dioula',
        'Autres langues sur demande'
    ];

    const advantages = [
        { icon: Award, title: 'Traducteurs certifiés', description: 'Assermentés et reconnus' },
        { icon: Clock, title: 'Délais rapides', description: '24-72h selon urgence' },
        { icon: CheckCircle, title: 'Qualité garantie', description: 'Relecture systématique' },
        { icon: Globe, title: 'Service complet', description: 'De la traduction à la légalisation' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-mdla-yellow to-yellow-400 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <Languages className="w-20 h-20 text-mdla-black mx-auto mb-6" />
                        <h1 className="text-5xl font-bold text-mdla-black mb-4">
                            Traduction & Démarches
                        </h1>
                        <p className="text-xl text-mdla-black/80 max-w-3xl mx-auto mb-8">
                            Traductions certifiées et accompagnement pour toutes vos démarches administratives
                        </p>
                        <button
                            onClick={() => setIsQuoteModalOpen(true)}
                            className="bg-mdla-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-all transform hover:scale-105"
                        >
                            Demander une traduction
                        </button>
                    </div>
                </div>
            </section>

            {/* Translation Types */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-mdla-black mb-12 text-center">
                        Types de Traductions
                    </h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        {translationTypes.map((type, index) => {
                            const Icon = type.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-mdla-yellow text-center"
                                >
                                    <div className="w-16 h-16 bg-mdla-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-8 h-8 text-mdla-black" />
                                    </div>
                                    <h3 className="font-bold text-mdla-black mb-2">{type.title}</h3>
                                    <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                                    <p className="text-mdla-yellow font-bold">{type.price}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-mdla-black mb-12 text-center">
                        Nos Services
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-8 hover:shadow-lg transition-shadow"
                            >
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
                        ))}
                    </div>
                </div>
            </section>

            {/* Languages */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-mdla-black mb-12 text-center">
                        Combinaisons de Langues
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                        {languages.map((lang, index) => (
                            <div
                                key={index}
                                className="bg-mdla-yellow/10 border border-mdla-yellow rounded-lg p-4 text-center font-semibold text-mdla-black hover:bg-mdla-yellow hover:text-mdla-black transition-colors"
                            >
                                {lang}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Advantages */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-mdla-black mb-12 text-center">
                        Nos Avantages
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

            {/* Process */}
            <section className="py-16 bg-gradient-to-br from-mdla-black to-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white mb-12 text-center">
                        Comment ça marche ?
                    </h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { step: 1, title: 'Envoi documents', description: 'Par email ou en personne' },
                            { step: 2, title: 'Devis gratuit', description: 'Sous 24h ouvrées' },
                            { step: 3, title: 'Traduction', description: 'Par traducteur certifié' },
                            { step: 4, title: 'Livraison', description: 'Format papier ou numérique' }
                        ].map((item, index) => (
                            <div key={index} className="text-center text-white">
                                <div className="w-16 h-16 bg-mdla-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-mdla-black">{item.step}</span>
                                </div>
                                <h3 className="font-bold mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-300">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-mdla-black mb-12 text-center">
                        Tarification
                    </h2>
                    <div className="bg-gradient-to-br from-mdla-yellow to-yellow-400 rounded-xl p-8">
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-white rounded-lg p-6">
                                <h3 className="font-bold text-mdla-black mb-4">Traduction standard</h3>
                                <p className="text-3xl font-bold text-mdla-black mb-2">0,08€</p>
                                <p className="text-sm text-gray-600 mb-4">par mot</p>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-mdla-yellow" />
                                        Délai: 3-5 jours
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-mdla-yellow" />
                                        Relecture incluse
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-white rounded-lg p-6">
                                <h3 className="font-bold text-mdla-black mb-4">Traduction express</h3>
                                <p className="text-3xl font-bold text-mdla-black mb-2">0,12€</p>
                                <p className="text-sm text-gray-600 mb-4">par mot</p>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-mdla-yellow" />
                                        Délai: 24-48h
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-mdla-yellow" />
                                        Priorité maximale
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <p className="text-center text-sm text-mdla-black">
                            Certification officielle: +15€ par document
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-mdla-black">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Besoin d'une traduction ?
                    </h2>
                    <p className="text-gray-300 mb-8">
                        Envoyez-nous vos documents pour un devis gratuit et sans engagement
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
                preSelectedService="Traduction & Démarches"
            />
        </div>
    );
};

export default TraductionServicePage;
