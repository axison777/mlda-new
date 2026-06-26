import { Link } from 'react-router-dom';
import {
    GraduationCap, BookOpen, Clock, Users, Award, CheckCircle,
    Wifi, Wind, Monitor, Video, Sun, Moon, FileText, CreditCard,
    MapPin, Coffee, Sliders
} from 'lucide-react';
import { useState } from 'react';
import QuoteModal from '../../components/QuoteModal';

const levelGroups = [
    {
        key: 'A1A2',
        label: 'A1 / A2',
        sublabel: 'Débutant & Élémentaire',
        inscriptionFee: 10000,
        trainingCost: 130000,
        duration: '6 à 8 semaines',
        showInscriptionFee: true,
        features: [
            { icon: Video,    text: 'Cours en ligne et en présentiel' },
            { icon: Users,    text: 'Salle adaptée à l\'apprentissage' },
            { icon: Wind,     text: 'Climatisation' },
            { icon: Wifi,     text: 'Wi-Fi haut débit' },
            { icon: Monitor,  text: 'Technologie de dernière génération' },
            { icon: BookOpen, text: 'Cours interactifs' },
            { icon: Sun,      text: 'Cours en journée' },
            { icon: Moon,     text: 'Cours en soirée' },
            { icon: Clock,    text: 'Durée : 6 à 8 semaines' },
            { icon: FileText, text: 'Documents de formation inclus' },
        ],
    },
    {
        key: 'B1B2',
        label: 'B1 / B2',
        sublabel: 'Intermédiaire & Avancé',
        inscriptionFee: 10000,
        trainingCost: 150000,
        duration: '6 semaines',
        showInscriptionFee: true,
        features: [
            { icon: Video,    text: 'Cours en ligne et en présentiel' },
            { icon: MapPin,   text: 'Lieu accessible et sécurisé' },
            { icon: Users,    text: 'Salle adaptée à l\'apprentissage' },
            { icon: Wind,     text: 'Climatisation' },
            { icon: Wifi,     text: 'Wi-Fi haut débit' },
            { icon: Coffee,   text: 'Cuisine équipée pour pause-café' },
            { icon: Monitor,  text: 'Technologie de cours de dernière génération' },
            { icon: BookOpen, text: 'Cours interactifs' },
            { icon: Sliders,  text: 'Approche sur mesure' },
            { icon: Clock,    text: 'Horaires flexibles' },
            { icon: Sun,      text: 'Cours en journée' },
            { icon: Moon,     text: 'Cours en soirée' },
            { icon: FileText, text: 'Documents de formation inclus' },
        ],
    },
    {
        key: 'C1C2',
        label: 'C1 / C2',
        sublabel: 'Autonome & Maîtrise',
        inscriptionFee: null,
        trainingCost: 170000,
        duration: '6 semaines',
        showInscriptionFee: false,
        features: [
            { icon: Video,    text: 'Cours en ligne et en présentiel' },
            { icon: MapPin,   text: 'Lieu accessible et sécurisé' },
            { icon: Users,    text: 'Salle adaptée à l\'apprentissage' },
            { icon: Wind,     text: 'Climatisation' },
            { icon: Wifi,     text: 'Wi-Fi haut débit' },
            { icon: Coffee,   text: 'Cuisine équipée pour pause-café' },
            { icon: Monitor,  text: 'Technologie de cours de dernière génération' },
            { icon: BookOpen, text: 'Cours interactifs' },
            { icon: Sliders,  text: 'Approche sur mesure' },
            { icon: Clock,    text: 'Horaires flexibles' },
            { icon: Sun,      text: 'Cours en journée' },
            { icon: Moon,     text: 'Cours en soirée' },
            { icon: FileText, text: 'Documents de formation inclus' },
        ],
    },
];

const allLevels = [
    { name: 'A1', label: 'Débutant',      duration: '6 à 8 semaines' },
    { name: 'A2', label: 'Élémentaire',   duration: '6 à 8 semaines' },
    { name: 'B1', label: 'Intermédiaire', duration: '6 semaines' },
    { name: 'B2', label: 'Avancé',        duration: '6 semaines' },
    { name: 'C1', label: 'Autonome',      duration: '6 semaines' },
    { name: 'C2', label: 'Maîtrise',      duration: '6 semaines' },
];

const advantages = [
    'Cours en ligne et en présentiel',
    'Salle adaptée et climatisée',
    'Wi-Fi haut débit inclus',
    'Technologie de dernière génération',
    'Cours interactifs',
    'Horaires flexibles (journée & soirée)',
    'Documents de formation inclus',
    'Approche pédagogique sur mesure',
];

const FormationServicePage = () => {
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('A1A2');

    const activeGroup = levelGroups.find(g => g.key === activeTab);

    const total = activeGroup
        ? (activeGroup.inscriptionFee || 0) + activeGroup.trainingCost
        : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-mdla-yellow to-yellow-400 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <GraduationCap className="w-20 h-20 text-mdla-black mx-auto mb-6" />
                        <h1 className="text-5xl font-bold text-mdla-black mb-4">
                            Formation &amp; Langue Allemande
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

            {/* ===== Tarifs par niveau ===== */}
            <section className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-mdla-black mb-2 text-center">
                        Informations par niveau
                    </h2>
                    <p className="text-gray-500 text-center mb-10">
                        Sélectionnez votre niveau pour voir les détails et tarifs
                    </p>

                    {/* Onglets */}
                    <div className="flex justify-center gap-3 mb-10 flex-wrap">
                        {levelGroups.map(group => (
                            <button
                                key={group.key}
                                onClick={() => setActiveTab(group.key)}
                                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                                    activeTab === group.key
                                        ? 'bg-mdla-yellow text-mdla-black shadow-lg scale-105'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {group.label}
                                <span className="block text-xs font-normal opacity-70">{group.sublabel}</span>
                            </button>
                        ))}
                    </div>

                    {/* Contenu du niveau sélectionné */}
                    {activeGroup && (
                        <div className="grid md:grid-cols-2 gap-8 items-start animate-fade-in">

                            {/* Carte Tarifs */}
                            <div className="bg-gradient-to-br from-mdla-black to-gray-800 rounded-2xl p-8 text-white shadow-2xl">
                                <h3 className="text-xl font-bold text-mdla-yellow mb-6 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Tarification — {activeGroup.label}
                                </h3>

                                <div className="space-y-5">
                                    {/* Frais d'inscription (seulement si présents) */}
                                    {activeGroup.showInscriptionFee && (
                                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                            <div>
                                                <p className="text-white/70 text-sm">Frais d'inscription</p>
                                                <p className="text-white font-semibold">À régler à l'inscription</p>
                                            </div>
                                            <span className="text-mdla-yellow text-2xl font-extrabold whitespace-nowrap">
                                                {activeGroup.inscriptionFee.toLocaleString('fr-FR')} F
                                            </span>
                                        </div>
                                    )}

                                    {/* Coût de formation */}
                                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                        <div>
                                            <p className="text-white/70 text-sm">Coût de formation</p>
                                            <p className="text-white/60 text-xs mt-0.5 flex items-center gap-1">
                                                <FileText className="w-3 h-3" />
                                                Documents inclus
                                            </p>
                                        </div>
                                        <span className="text-mdla-yellow text-2xl font-extrabold whitespace-nowrap">
                                            {activeGroup.trainingCost.toLocaleString('fr-FR')} F
                                        </span>
                                    </div>

                                    {/* Durée */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white/70 text-sm">Durée de la formation</p>
                                            <p className="text-white font-semibold">Par niveau</p>
                                        </div>
                                        <span className="text-mdla-yellow text-xl font-extrabold whitespace-nowrap">
                                            {activeGroup.duration}
                                        </span>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="mt-8 bg-mdla-yellow/10 border border-mdla-yellow/30 rounded-xl p-4 flex items-center justify-between">
                                    <p className="text-white font-bold text-lg">
                                        {activeGroup.showInscriptionFee ? 'Total à prévoir' : 'Coût total'}
                                    </p>
                                    <p className="text-mdla-yellow text-3xl font-extrabold">
                                        {total.toLocaleString('fr-FR')} F
                                    </p>
                                </div>

                                <button
                                    onClick={() => setIsQuoteModalOpen(true)}
                                    className="w-full mt-6 bg-mdla-yellow text-mdla-black py-3 rounded-xl font-bold hover:bg-yellow-300 transition-all"
                                >
                                    S'inscrire — {activeGroup.label}
                                </button>
                            </div>

                            {/* Ce qui est inclus */}
                            <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-lg">
                                <h3 className="text-xl font-bold text-mdla-black mb-6 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    Ce qui est inclus
                                </h3>
                                <ul className="space-y-3">
                                    {activeGroup.features.map(({ icon: Icon, text }, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-mdla-yellow/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-4 h-4 text-mdla-black" />
                                            </div>
                                            <span className="text-gray-700 font-medium">{text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Description / Pourquoi MDLA */}
            <section className="py-16 bg-gray-50">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {advantages.map((advantage, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">{advantage}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tableau récapitulatif tous niveaux */}
            <section className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-mdla-black mb-4 text-center">
                        Récapitulatif des niveaux
                    </h2>
                    <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
                        Comparez les niveaux et choisissez votre parcours
                    </p>

                    <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-100">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-mdla-black text-white">
                                    <th className="px-6 py-4 text-left font-bold">Niveau</th>
                                    <th className="px-6 py-4 text-center font-bold">Inscription</th>
                                    <th className="px-6 py-4 text-center font-bold">Formation</th>
                                    <th className="px-6 py-4 text-center font-bold">Total</th>
                                    <th className="px-6 py-4 text-center font-bold">Durée</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { level: 'A1 — Débutant',      group: 'A1A2', inscription: 10000, formation: 130000, duration: '6 à 8 sem.' },
                                    { level: 'A2 — Élémentaire',   group: 'A1A2', inscription: 10000, formation: 130000, duration: '6 à 8 sem.' },
                                    { level: 'B1 — Intermédiaire', group: 'B1B2', inscription: 10000, formation: 150000, duration: '6 sem.' },
                                    { level: 'B2 — Avancé',        group: 'B1B2', inscription: 10000, formation: 150000, duration: '6 sem.' },
                                    { level: 'C1 — Autonome',      group: 'C1C2', inscription: null,  formation: 170000, duration: '6 sem.' },
                                    { level: 'C2 — Maîtrise',      group: 'C1C2', inscription: null,  formation: 170000, duration: '6 sem.' },
                                ].map((row, i) => (
                                    <tr
                                        key={i}
                                        className={`border-t border-gray-100 cursor-pointer transition-colors ${
                                            activeTab === row.group
                                                ? 'bg-mdla-yellow/10'
                                                : i % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                        onClick={() => setActiveTab(row.group)}
                                    >
                                        <td className="px-6 py-4 font-semibold text-mdla-black">{row.level}</td>
                                        <td className="px-6 py-4 text-center text-gray-600">
                                            {row.inscription ? `${row.inscription.toLocaleString('fr-FR')} F` : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-600">
                                            {row.formation.toLocaleString('fr-FR')} F
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-mdla-black">
                                            {((row.inscription || 0) + row.formation).toLocaleString('fr-FR')} F
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-mdla-yellow/20 text-mdla-black text-xs font-bold px-3 py-1 rounded-full">
                                                {row.duration}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-4">
                        * Cliquez sur une ligne pour afficher les détails du niveau correspondant
                    </p>
                </div>
            </section>

            {/* Tous les niveaux — cartes */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-mdla-black mb-12 text-center">
                        Nos Niveaux de Formation
                    </h2>
                    <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {allLevels.map((level, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-mdla-yellow text-center"
                            >
                                <div className="w-14 h-14 bg-mdla-yellow rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-xl font-bold text-mdla-black">{level.name}</span>
                                </div>
                                <h3 className="font-bold text-mdla-black text-sm mb-1">{level.label}</h3>
                                <div className="flex items-center justify-center gap-1 text-xs text-mdla-black font-semibold bg-mdla-yellow/20 rounded-full px-2 py-1 mt-2">
                                    <Clock className="w-3 h-3" />
                                    {level.duration}
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
                    <div className="flex gap-4 justify-center flex-wrap">
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
                preSelectedService="Formation &amp; Langue Allemande"
            />
        </div>
    );
};

export default FormationServicePage;
