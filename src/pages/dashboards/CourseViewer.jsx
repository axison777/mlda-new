import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import {
    PlayCircle,
    FileText,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    Lock,
    Music,
    Video,
    CheckCircle,
    Trophy
} from 'lucide-react';

const CourseViewer = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [enrollment, setEnrollment] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [completedLessons, setCompletedLessons] = useState(new Set());

    useEffect(() => {
        fetchEnrollment();
    }, [courseId]);

    const fetchEnrollment = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data: checkData } = await api.get(`/enrollments/check/${courseId}`);

            if (!checkData.isEnrolled) {
                setError('not_enrolled');
                setLoading(false);
                return;
            }

            const { data: enrollmentData } = await api.get(`/enrollments/${checkData.enrollment.id}`);
            setEnrollment(enrollmentData);

            if (enrollmentData.course?.modules && enrollmentData.course.modules.length > 0) {
                const firstModule = enrollmentData.course.modules[0];
                if (firstModule.items && firstModule.items.length > 0) {
                    setActiveLesson(firstModule.items[0]);
                }
            }
        } catch (err) {
            console.error('Error fetching enrollment:', err);
            setError('error');
        } finally {
            setLoading(false);
        }
    };

    const getAllLessons = () => {
        if (!enrollment?.course?.modules) return [];

        const lessons = [];
        enrollment.course.modules
            .sort((a, b) => a.order - b.order)
            .forEach(module => {
                const items = (module.items || []).sort((a, b) => a.order - b.order);
                items.forEach(item => {
                    lessons.push({ ...item, moduleTitle: module.title });
                });
            });
        return lessons;
    };

    const getCurrentLessonIndex = () => {
        const lessons = getAllLessons();
        return lessons.findIndex(lesson => lesson.id === activeLesson?.id);
    };

    const goToPreviousLesson = () => {
        const lessons = getAllLessons();
        const currentIndex = getCurrentLessonIndex();
        if (currentIndex > 0) {
            setActiveLesson(lessons[currentIndex - 1]);
        }
    };

    const goToNextLesson = async () => {
        const lessons = getAllLessons();
        const currentIndex = getCurrentLessonIndex();

        // Mark current lesson as complete
        if (activeLesson) {
            markLessonComplete(activeLesson.id);
        }

        if (currentIndex < lessons.length - 1) {
            setActiveLesson(lessons[currentIndex + 1]);
            await updateProgressOnServer();
        } else {
            await completeCourse();
        }
    };

    const markLessonComplete = (lessonId) => {
        setCompletedLessons(prev => {
            const newSet = new Set(prev);
            newSet.add(lessonId);
            return newSet;
        });
    };

    const calculateProgress = () => {
        const lessons = getAllLessons();
        if (lessons.length === 0) return 0;
        return Math.round((completedLessons.size / lessons.length) * 100);
    };

    const updateProgressOnServer = async () => {
        try {
            const progressPercent = calculateProgress();
            await api.put(`/enrollments/${enrollment.id}/progress`, { progressPercent });
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const completeCourse = async () => {
        try {
            // Mark last lesson as complete
            if (activeLesson) {
                markLessonComplete(activeLesson.id);
            }
            await api.put(`/enrollments/${enrollment.id}/complete`);
            setShowCompletionModal(true);
        } catch (error) {
            console.error('Error completing course:', error);
            setShowCompletionModal(true);
        }
    };

    const isFirstLesson = () => getCurrentLessonIndex() === 0;
    const isLastLesson = () => {
        const lessons = getAllLessons();
        return getCurrentLessonIndex() === lessons.length - 1;
    };

    const isModuleCompleted = (module) => {
        const moduleItems = (module.items || []);
        if (moduleItems.length === 0) return false;
        return moduleItems.every(item => completedLessons.has(item.id));
    };

    const isCourseCompleted = () => {
        const lessons = getAllLessons();
        if (lessons.length === 0) return false;
        return lessons.every(lesson => completedLessons.has(lesson.id));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mdla-yellow mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement du cours...</p>
                </div>
            </div>
        );
    }

    if (error === 'not_enrolled') {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center max-w-md">
                    <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès restreint</h2>
                    <p className="text-gray-600 mb-6">Vous devez vous inscrire à ce cours pour accéder au contenu.</p>
                    <button
                        onClick={() => navigate('/formations')}
                        className="bg-mdla-yellow text-mdla-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
                    >
                        Voir les formations
                    </button>
                </div>
            </div>
        );
    }

    if (error === 'error' || !enrollment) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Erreur lors du chargement du cours</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-mdla-yellow hover:underline"
                    >
                        Retour au dashboard
                    </button>
                </div>
            </div>
        );
    }

    const course = enrollment.course;
    const modules = (course.modules || []).sort((a, b) => a.order - b.order);

    const getContentIcon = (item) => {
        if (item.type === 'video' && item.content) return <Video className="w-4 h-4" />;
        if (item.audioUrl) return <Music className="w-4 h-4" />;
        if (item.pdfUrl) return <FileText className="w-4 h-4" />;
        return <PlayCircle className="w-4 h-4" />;
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Completion Modal */}
            {showCompletionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
                        <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Félicitations ! 🎉</h2>
                        <p className="text-gray-600 mb-6">
                            Vous avez terminé le cours <strong>{course.title}</strong> !
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full bg-mdla-yellow text-mdla-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
                            >
                                Retour au dashboard
                            </button>
                            <button
                                onClick={() => setShowCompletionModal(false)}
                                className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                            >
                                Continuer à réviser
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <aside className={`flex-shrink-0 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-80' : 'w-0'} relative overflow-hidden`}>
                <div className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="font-bold text-gray-800 truncate" title={course.title}>{course.title}</h2>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs text-gray-500">
                            {enrollment.learningMode === 'online' ? '📱 En ligne' : '🏫 Présentiel'}
                        </p>
                        {isCourseCompleted() && (
                            <div className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <CheckCircle className="w-3 h-3" />
                                <span>Cours terminé</span>
                            </div>
                        )}
                        <div>
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                <span>Progression</span>
                                <span className="font-semibold">{calculateProgress()}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${calculateProgress()}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {modules.map((module) => (
                        <div key={module.id} className="border-b border-gray-100 last:border-0">
                            <div className="px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700 flex items-center justify-between">
                                <span>{module.title}</span>
                                {isModuleCompleted(module) && (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                            </div>
                            <div>
                                {(module.items || []).sort((a, b) => a.order - b.order).map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveLesson(item)}
                                        className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${activeLesson?.id === item.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''}`}
                                    >
                                        <div className={`mt-0.5 ${activeLesson?.id === item.id ? 'text-blue-500' : completedLessons.has(item.id) ? 'text-green-500' : 'text-gray-400'}`}>
                                            {completedLessons.has(item.id) ? <CheckCircle className="w-4 h-4" /> : getContentIcon(item)}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm ${activeLesson?.id === item.id ? 'font-medium text-blue-700' : 'text-gray-600'}`}>
                                                {item.title}
                                            </p>
                                            <span className="text-xs text-gray-400">{item.duration ? `${item.duration} min` : item.type}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative w-full">
                <header className="bg-white h-16 border-b border-gray-200 flex items-center px-4 justify-between">
                    <div className="flex items-center gap-4">
                        {!sidebarOpen && (
                            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <Menu className="w-5 h-5 text-gray-600" />
                            </button>
                        )}
                        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                            <ChevronLeft className="w-4 h-4" />
                            Retour au dashboard
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-4xl mx-auto">
                        {activeLesson ? (
                            <div className="space-y-6">
                                {activeLesson.type === 'video' && activeLesson.content && (
                                    <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={activeLesson.content.replace('watch?v=', 'embed/')}
                                            title={activeLesson.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )}

                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{activeLesson.title}</h1>
                                    {activeLesson.description && (
                                        <div className="prose max-w-none text-gray-600 mb-4">{activeLesson.description}</div>
                                    )}

                                    <div className="space-y-2 mt-4">
                                        {activeLesson.audioUrl && (
                                            <a href={activeLesson.audioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-600 hover:text-green-800 hover:underline">
                                                <Music className="w-4 h-4" />
                                                <span>Écouter l'audio</span>
                                            </a>
                                        )}
                                        {activeLesson.pdfUrl && (
                                            <a href={activeLesson.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-red-600 hover:text-red-800 hover:underline">
                                                <FileText className="w-4 h-4" />
                                                <span>Télécharger le PDF</span>
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4">
                                    <button
                                        onClick={goToPreviousLesson}
                                        disabled={isFirstLesson()}
                                        className={`px-6 py-3 border border-gray-300 rounded-lg font-medium flex items-center gap-2 transition-colors ${isFirstLesson() ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Leçon précédente
                                    </button>
                                    <button
                                        onClick={goToNextLesson}
                                        className="px-6 py-3 bg-mdla-yellow text-mdla-black rounded-lg font-medium hover:bg-yellow-400 flex items-center gap-2 transition-colors"
                                    >
                                        {isLastLesson() ? (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                Terminer le cours
                                            </>
                                        ) : (
                                            <>
                                                Leçon suivante
                                                <ChevronRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <PlayCircle className="w-16 h-16 mb-4 text-gray-300" />
                                <p>Sélectionnez une leçon pour commencer</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CourseViewer;
