import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import PaymentModal from '../components/PaymentModal';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const CoursesPage = () => {
    const [activeFilter, setActiveFilter] = useState('Tous');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enrollments, setEnrollments] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        fetchPublishedCourses();
        if (user) {
            fetchMyEnrollments();
        }
    }, [user]);

    const fetchPublishedCourses = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/courses?status=published');
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyEnrollments = async () => {
        try {
            const { data } = await api.get('/enrollments');
            setEnrollments(data);
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        }
    };

    const isEnrolled = (courseId) => {
        return enrollments.some(enrollment => enrollment.courseId === courseId);
    };

    const handleEnroll = (course) => {
        if (!user) {
            alert('Veuillez vous connecter pour vous inscrire');
            navigate('/login');
            return;
        }
        setSelectedCourse(course);
        setShowPaymentModal(true);
    };

    const handleEnrollmentSuccess = () => {
        fetchMyEnrollments();
    };

    const filters = [
        'Tous',
        'A1',
        'A2',
        'B1',
        'B2',
        'C1',
        'C2'
    ];

    const filteredCourses = activeFilter === 'Tous'
        ? courses
        : courses.filter(course => course.level === activeFilter);

    const handleCourseAction = (courseId) => {
        navigate(`/formations/${courseId}`);
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
                    {loading ? (
                        <div className="text-center py-16">
                            <p className="text-gray-500 text-lg">Chargement des cours...</p>
                        </div>
                    ) : filteredCourses.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredCourses.map((course) => (
                                <div key={course.id} className="relative">
                                    <CourseCard
                                        course={course}
                                        onAction={handleCourseAction}
                                    />
                                    {/* Enrollment Button Overlay */}
                                    {user && (
                                        <div className="absolute bottom-6 left-6 right-6">
                                            {isEnrolled(course.id) ? (
                                                <button
                                                    disabled
                                                    className="w-full bg-green-100 text-green-800 px-6 py-3 rounded-lg font-bold cursor-not-allowed"
                                                >
                                                    ✓ Déjà inscrit
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEnroll(course);
                                                    }}
                                                    className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105"
                                                >
                                                    S'inscrire
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
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

            {/* Payment Modal */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                course={selectedCourse}
                onSuccess={handleEnrollmentSuccess}
            />

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
