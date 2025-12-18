import { useState } from 'react';
import CourseCard from '../components/CourseCard';

const CoursesPage = () => {
    const [activeFilter, setActiveFilter] = useState('Tous');

    // Mock course data
    const courses = [
        {
            id: 1,
            title: 'Allemand pour Débutants - Niveau A1',
            instructor: 'Prof. Schmidt',
            level: 'A1',
            price: 150000,
            discount_price: null,
            image: '/api/placeholder/400/300',
            description: 'Apprenez les bases de l\'allemand : alphabet, grammaire de base, vocabulaire essentiel.',
            category: 'Débutant'
        },
        {
            id: 2,
            title: 'Allemand Élémentaire - Niveau A2',
            instructor: 'Prof. Müller',
            level: 'A2',
            price: 175000,
            discount_price: 140000,
            image: '/api/placeholder/400/300',
            description: 'Consolidez vos bases et développez vos compétences en communication quotidienne.',
            category: 'Débutant'
        },
        {
            id: 3,
            title: 'Allemand Intermédiaire - Niveau B1',
            instructor: 'Prof. Weber',
            level: 'B1',
            price: 200000,
            discount_price: null,
            image: '/api/placeholder/400/300',
            description: 'Maîtrisez les situations courantes et exprimez-vous avec plus de fluidité.',
            category: 'Intermédiaire'
        },
        {
            id: 4,
            title: 'Allemand Avancé - Niveau B2',
            instructor: 'Prof. Fischer',
            level: 'B2',
            price: 225000,
            discount_price: 180000,
            image: '/api/placeholder/400/300',
            description: 'Perfectionnez votre allemand pour des échanges professionnels et académiques.',
            category: 'Intermédiaire'
        },
        {
            id: 5,
            title: 'Allemand Professionnel - Business',
            instructor: 'Prof. Becker',
            level: 'B2-C1',
            price: 250000,
            discount_price: null,
            image: '/api/placeholder/400/300',
            description: 'Allemand des affaires : négociations, présentations, correspondance professionnelle.',
            category: 'Professionnel'
        },
        {
            id: 6,
            title: 'Préparation Visa Étudiant',
            instructor: 'Prof. Hoffmann',
            level: 'A2-B1',
            price: 180000,
            discount_price: 150000,
            image: '/api/placeholder/400/300',
            description: 'Préparez-vous aux examens requis pour votre visa étudiant en Allemagne.',
            category: 'Préparation Visa'
        },
        {
            id: 7,
            title: 'Allemand Médical - Secteur Santé',
            instructor: 'Dr. Klein',
            level: 'B2',
            price: 275000,
            discount_price: null,
            image: '/api/placeholder/400/300',
            description: 'Vocabulaire médical et communication pour professionnels de la santé.',
            category: 'Professionnel'
        },
        {
            id: 8,
            title: 'Allemand Technique - Ingénierie',
            instructor: 'Ing. Schneider',
            level: 'B1-B2',
            price: 260000,
            discount_price: 220000,
            image: '/api/placeholder/400/300',
            description: 'Terminologie technique pour ingénieurs et techniciens.',
            category: 'Professionnel'
        }
    ];

    const filters = [
        'Tous',
        'Débutant',
        'Intermédiaire',
        'Professionnel',
        'Préparation Visa'
    ];

    const filteredCourses = activeFilter === 'Tous'
        ? courses
        : courses.filter(course => course.category === activeFilter);

    const handleCourseAction = (courseId) => {
        console.log('View course:', courseId);
        // TODO: Navigate to course detail page
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section with Background Image */}
            <section
                className="relative bg-cover bg-center py-32"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/api/placeholder/1920/600")',
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Nos Cours d'Allemand
                    </h1>
                    <p className="text-xl text-white/90 max-w-3xl mx-auto">
                        Des formations de qualité pour tous les niveaux, du débutant au professionnel
                    </p>
                </div>
            </section>

            {/* Filters Section */}
            <section className="py-8 bg-gray-50 sticky top-20 z-40 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${activeFilter === filter
                                        ? 'bg-mdla-yellow text-mdla-black shadow-lg'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Results Count */}
                    <div className="text-center mt-4">
                        <p className="text-gray-600">
                            <span className="font-bold text-mdla-black">{filteredCourses.length}</span> cours disponible{filteredCourses.length > 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            </section>

            {/* Courses Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredCourses.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredCourses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    onAction={handleCourseAction}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-gray-500 text-lg">
                                Aucun cours disponible dans cette catégorie.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-mdla-black text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        Vous ne trouvez pas le cours qui vous convient ?
                    </h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        Contactez-nous pour discuter de vos besoins spécifiques. Nous proposons également des formations sur mesure.
                    </p>
                    <a
                        href="/contact"
                        className="inline-block bg-mdla-yellow text-mdla-black px-8 py-4 rounded-lg font-bold hover:bg-yellow-400 transition-all transform hover:scale-105"
                    >
                        Nous Contacter
                    </a>
                </div>
            </section>
        </div>
    );
};

export default CoursesPage;
