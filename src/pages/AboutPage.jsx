import { GraduationCap, Briefcase, Users, CheckCircle } from 'lucide-react';

const AboutPage = () => {
    const targets = [
        {
            icon: GraduationCap,
            title: 'Étudiants',
            description: 'Accompagnement démarches administratives, inscription universitaire, visa. Frais de scolarité bas en Allemagne.',
            features: [
                'Aide aux démarches administratives',
                'Inscription universitaire simplifiée',
                'Assistance visa étudiant',
                'Frais de scolarité abordables'
            ]
        },
        {
            icon: Briefcase,
            title: 'Professionnels',
            description: 'Développement d\'activités, partenariats solides et navigation dans les démarches administratives.',
            features: [
                'Développement d\'activités en Allemagne',
                'Création de partenariats B2B',
                'Support administratif complet',
                'Networking professionnel'
            ]
        },
        {
            icon: Users,
            title: 'Jeunes Talents',
            description: 'Opportunités dans le secteur social, santé (infirmiers) et technique via la formation duale.',
            features: [
                'Formation duale reconnue',
                'Secteur santé et social',
                'Opportunités techniques',
                'Insertion professionnelle garantie'
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-mdla-yellow to-yellow-400 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-mdla-black mb-6">
                        À Propos de MDLA
                    </h1>
                    <p className="text-xl text-mdla-black/80 max-w-3xl mx-auto">
                        La Maison de l'Allemagne - Votre passerelle vers l'excellence germanophone
                    </p>
                </div>
            </section>

            {/* Notre Mission Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-mdla-black mb-8 text-center">
                            Pourquoi choisir la MDLA ?
                        </h2>
                        <div className="bg-mdla-yellow/10 border-l-4 border-mdla-yellow p-8 rounded-r-lg">
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Parce que nous faisons plus que vous enseigner une langue : nous vous connectons à une culture,
                                à un marché, à un avenir. Bénéficiez d'un accompagnement complet et personnalisé pour réussir
                                vos projets en Allemagne, que ce soit pour vos études, votre carrière professionnelle ou votre
                                développement personnel.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mt-12">
                            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
                                <div className="w-16 h-16 bg-mdla-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-mdla-black" />
                                </div>
                                <h3 className="font-bold text-mdla-black mb-2">Expertise</h3>
                                <p className="text-gray-600 text-sm">Plus de 10 ans d'expérience dans l'accompagnement vers l'Allemagne</p>
                            </div>

                            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
                                <div className="w-16 h-16 bg-mdla-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-mdla-black" />
                                </div>
                                <h3 className="font-bold text-mdla-black mb-2">Accompagnement</h3>
                                <p className="text-gray-600 text-sm">Suivi personnalisé de A à Z pour garantir votre réussite</p>
                            </div>

                            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
                                <div className="w-16 h-16 bg-mdla-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-mdla-black" />
                                </div>
                                <h3 className="font-bold text-mdla-black mb-2">Réseau</h3>
                                <p className="text-gray-600 text-sm">Partenariats solides avec institutions et entreprises allemandes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mot du Directeur Section */}
            <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-mdla-black mb-12 text-center">
                        Mot du Directeur
                    </h2>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Director Photo */}
                        <div className="relative">
                            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                                <img
                                    src="https://placehold.co/600x800/1A1A1A/FFCC00?text=Dr.+Amadou+TRAORE%0ADirecteur+MDLA"
                                    alt="Dr. Amadou TRAORE - Directeur MDLA"
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-mdla-black to-transparent p-6">
                                    <h3 className="text-2xl font-bold text-white">Dr. Amadou TRAORE</h3>
                                    <p className="text-mdla-yellow font-semibold">Directeur Général - MDLA</p>
                                </div>
                            </div>
                        </div>

                        {/* Director Message */}
                        <div className="space-y-6">
                            <div className="relative">
                                <div className="absolute -left-4 -top-4 text-8xl text-mdla-yellow/20 font-serif">"</div>
                                <div className="relative z-10 space-y-4 text-gray-700 leading-relaxed">
                                    <p className="text-lg">
                                        Chers amis, chers partenaires,
                                    </p>
                                    <p>
                                        C'est avec une immense fierté que je vous accueille à la <strong className="text-mdla-black">Maison de l'Allemagne (MDLA)</strong>,
                                        un pont culturel et économique entre l'Afrique et l'Allemagne que nous avons bâti avec passion et détermination
                                        depuis plus de 15 ans.
                                    </p>
                                    <p>
                                        Notre mission va bien au-delà de l'enseignement de la langue allemande. Nous sommes des <strong className="text-mdla-black">facilitateurs de rêves</strong>,
                                        des <strong className="text-mdla-black">créateurs d'opportunités</strong> et des <strong className="text-mdla-black">bâtisseurs de ponts</strong> entre deux continents riches en potentiel.
                                    </p>
                                    <p>
                                        Que vous soyez étudiant aspirant à une formation de classe mondiale, professionnel cherchant à développer
                                        votre activité, ou jeune talent en quête d'excellence, sachez que <strong className="text-mdla-black">MDLA est votre partenaire de confiance</strong>.
                                    </p>
                                    <p>
                                        Nous croyons fermement que <strong className="text-mdla-yellow">l'éducation et la collaboration internationale</strong> sont les clés
                                        du développement durable. C'est pourquoi nous mettons tout en œuvre pour vous offrir un accompagnement personnalisé,
                                        des formations de qualité et un réseau solide en Allemagne.
                                    </p>
                                    <p className="italic text-mdla-black font-semibold">
                                        Ensemble, construisons votre avenir. Ensemble, réalisons vos ambitions.
                                    </p>
                                    <p className="text-right">
                                        <span className="block font-bold text-mdla-black">Dr. Amadou TRAORE</span>
                                        <span className="block text-sm text-gray-600">Directeur Général</span>
                                    </p>
                                </div>
                                <div className="absolute -right-4 -bottom-4 text-8xl text-mdla-yellow/20 font-serif">"</div>
                            </div>

                            {/* Signature */}
                            <div className="border-t-2 border-mdla-yellow pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600">
                                            <strong>Diplômé</strong> de l'Université de Munich<br />
                                            <strong>Expert</strong> en coopération Afrique-Europe<br />
                                            <strong>Membre</strong> du Conseil Franco-Allemand
                                        </p>
                                    </div>
                                    <div className="w-32 h-20 bg-mdla-yellow/10 rounded-lg flex items-center justify-center">
                                        <span className="text-4xl font-signature text-mdla-black">AT</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Nos Cibles Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-mdla-black mb-4 text-center">
                        Nos Cibles
                    </h2>
                    <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                        Nous accompagnons différents profils vers la réussite en Allemagne
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {targets.map((target, index) => {
                            const Icon = target.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                                >
                                    <div className="bg-gradient-to-br from-mdla-yellow to-yellow-400 p-8 text-center">
                                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Icon className="w-10 h-10 text-mdla-black" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-mdla-black">
                                            {target.title}
                                        </h3>
                                    </div>

                                    <div className="p-6">
                                        <p className="text-gray-700 mb-6 leading-relaxed">
                                            {target.description}
                                        </p>

                                        <ul className="space-y-3">
                                            {target.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <CheckCircle className="w-5 h-5 text-mdla-yellow flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm text-gray-600">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-mdla-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">
                        Prêt à commencer votre aventure allemande ?
                    </h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        Contactez-nous dès aujourd'hui pour discuter de votre projet et découvrir comment nous pouvons vous aider.
                    </p>
                    <a
                        href="/contact"
                        className="inline-block bg-mdla-yellow text-mdla-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-all transform hover:scale-105"
                    >
                        Nous Contacter
                    </a>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
