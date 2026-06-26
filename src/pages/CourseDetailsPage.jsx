import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, User, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';
import api from '../utils/api';
import { Helmet } from 'react-helmet-async';

const CourseDetailsPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [enrollments, setEnrollments] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchCourseDetails();
        if (user) {
            fetchMyEnrollments();
        }
    }, [courseId, user]);

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/courses/${courseId}`);
            setCourse(data);
        } catch (err) {
            console.error('Error fetching course:', err);
            setError('Cours introuvable');
        } finally {
            setLoading(false);
        }
    };

    const fetchMyEnrollments = async () => {
        try {
            const { data } = await api.get('/enrollments');
            setEnrollments(data);
        } catch (err) {
            console.error('Error fetching enrollments:', err);
        }
    };

    const isEnrolled = () => {
        return enrollments.some(enrollment => enrollment.courseId === courseId);
    };

    const handleEnroll = () => {
        if (!user) {
            alert('Veuillez vous connecter pour vous inscrire');
            navigate('/login');
            return;
        }
        setShowPaymentModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-16 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mdla-yellow"></div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen pt-32 pb-16 flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold mb-4">{error || "Erreur"}</h1>
                <button onClick={() => navigate('/formations')} className="text-mdla-yellow hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Retour aux formations
                </button>
            </div>
        );
    }

    const price = course.price ? parseFloat(course.price) : 0;
    const discountPrice = course.discount_price ? parseFloat(course.discount_price) : price;
    const inscriptionFee = course.inscription_fee ? parseFloat(course.inscription_fee) : 0;
    const total = discountPrice + inscriptionFee;
    const featuresList = Array.isArray(course.features) ? course.features : [];

    return (
        <div className="bg-gray-50 min-h-screen pb-16">
            <Helmet>
                <title>{course.title} | MDLA Services</title>
                <meta name="description" content={course.description ? course.description.substring(0, 160) : `Découvrez notre formation ${course.title} de niveau ${course.level}.`} />
                <meta property="og:title" content={`${course.title} | MDLA Services`} />
                {course.thumbnail && <meta property="og:image" content={course.thumbnail} />}
            </Helmet>
            {/* Hero Banner */}
            <div 
                className="relative pt-32 pb-16 text-white bg-mdla-black overflow-hidden"
            >
                {/* Background Image with Overlay */}
                {course.thumbnail && (
                    <div 
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: `url(${course.thumbnail})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-mdla-black via-mdla-black/80 to-transparent"></div>
                    </div>
                )}
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <button onClick={() => navigate('/formations')} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Retour aux formations
                    </button>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="bg-mdla-yellow text-mdla-black px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                            Niveau {course.level}
                        </span>
                        {course.duration && (
                            <span className="bg-black/50 backdrop-blur-sm text-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-1 border border-gray-700/50">
                                <Clock className="w-4 h-4" /> {course.duration}
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight drop-shadow-md">
                        {course.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-300">
                        <User className="w-5 h-5" />
                        <span className="font-medium">Instructeur</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Main Content: Description and Curriculum */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">À propos de ce cours</h2>
                            <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {course.description || "Aucune description détaillée n'est disponible pour ce cours."}
                            </div>
                        </div>

                        {course.modules && course.modules.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Programme du cours</h2>
                                <div className="space-y-4">
                                    {course.modules.sort((a,b) => a.order - b.order).map((module, idx) => (
                                        <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                                            <h3 className="font-bold text-gray-800">Module {idx + 1}: {module.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {module.items ? module.items.length : 0} leçon(s)
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar: Pricing and Enrollment */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-28 overflow-hidden">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">S'inscrire maintenant</h3>
                            
                            <div className="space-y-4 mb-6">
                                {inscriptionFee > 0 && (
                                    <div className="flex justify-between items-center text-gray-600">
                                        <span>Frais d'inscription</span>
                                        <span className="font-semibold">{inscriptionFee.toLocaleString('fr-FR')} F</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Coût de formation</span>
                                    <div className="text-right">
                                        {course.discount_price && (
                                            <span className="line-through text-gray-400 text-sm block">
                                                {price.toLocaleString('fr-FR')} F
                                            </span>
                                        )}
                                        <span className="font-semibold">{discountPrice.toLocaleString('fr-FR')} F</span>
                                    </div>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                    <span className="font-bold text-gray-800">Total à prévoir</span>
                                    <span className="text-2xl font-bold text-mdla-black">
                                        {total.toLocaleString('fr-FR')} F
                                    </span>
                                </div>
                            </div>

                            {user && isEnrolled() ? (
                                <button
                                    disabled
                                    className="w-full bg-green-100 text-green-800 px-6 py-4 rounded-lg font-bold flex justify-center items-center gap-2"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Vous êtes déjà inscrit
                                </button>
                            ) : (
                                <button
                                    onClick={handleEnroll}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-bold transition-all transform hover:scale-105 shadow-md"
                                >
                                    S'inscrire à ce cours
                                </button>
                            )}

                            {/* Features list */}
                            <div className="mt-8 space-y-3">
                                <h4 className="font-semibold text-gray-900 mb-4">Ce cours inclut :</h4>
                                {featuresList.length > 0 ? (
                                    featuresList.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> 
                                            <span>{feature}</span>
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500" /> Cours interactifs
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500" /> Support formateur
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500" /> Accès aux ressources
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                course={course}
                onSuccess={fetchMyEnrollments}
            />
        </div>
    );
};

export default CourseDetailsPage;
