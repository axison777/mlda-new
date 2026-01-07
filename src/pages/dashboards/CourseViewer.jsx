import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourses } from '../../context/CoursesContext';
import {
    PlayCircle,
    FileText,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    Menu,
    X,
    MessageSquare,
    Star
} from 'lucide-react';

const CourseViewer = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { getCourseById } = useCourses();
    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            setLoading(true);
            const data = await getCourseById(courseId);
            if (data) {
                setCourse(data);
                if (data.courseLessons && data.courseLessons.length > 0) {
                    setActiveLesson(data.courseLessons[0]);
                }
            }
            setLoading(false);
        };
        fetchCourse();
    }, [courseId]);

    if (loading) return <div className="flex justify-center items-center h-screen">Chargement...</div>;
    if (!course) return <div className="flex justify-center items-center h-screen">Cours non trouvé</div>;

    // Group lessons by section
    const sections = {};
    course.courseLessons?.forEach(lesson => {
        const section = lesson.section || 'Module 1';
        if (!sections[section]) sections[section] = [];
        sections[section].push(lesson);
    });

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar with Course Content */}
            <aside
                className={`flex-shrink-0 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-80' : 'w-0'
                    } relative`}
            >
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-bold text-gray-800 truncate" title={course.title}>
                        {course.title}
                    </h2>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {Object.entries(sections).map(([sectionTitle, lessons]) => (
                        <div key={sectionTitle} className="border-b border-gray-100 last:border-0">
                            <div className="px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700">
                                {sectionTitle}
                            </div>
                            <div>
                                {lessons.map(lesson => (
                                    <button
                                        key={lesson.id}
                                        onClick={() => setActiveLesson(lesson)}
                                        className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${activeLesson?.id === lesson.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                                            }`}
                                    >
                                        <div className={`mt-0.5 ${activeLesson?.id === lesson.id ? 'text-blue-500' : 'text-gray-400'}`}>
                                            {lesson.videoUrl ? <PlayCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className={`text-sm ${activeLesson?.id === lesson.id ? 'font-medium text-blue-700' : 'text-gray-600'}`}>
                                                {lesson.title}
                                            </p>
                                            <span className="text-xs text-gray-400">{lesson.duration} min</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative w-full">
                {/* Top Bar */}
                <header className="bg-white h-16 border-b border-gray-200 flex items-center px-4 justify-between">
                    <div className="flex items-center gap-4">
                        {!sidebarOpen && (
                            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <Menu className="w-5 h-5 text-gray-600" />
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/dashboard/mes-cours')}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Retour
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-4xl mx-auto">
                        {activeLesson ? (
                            <div className="space-y-6">
                                {activeLesson.videoUrl && (
                                    <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={activeLesson.videoUrl.replace("watch?v=", "embed/")}
                                            title={activeLesson.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )}

                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{activeLesson.title}</h1>
                                    <div className="prose max-w-none text-gray-600">
                                        {activeLesson.content}
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4">
                                    <button className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                        <ChevronLeft className="w-4 h-4" />
                                        Leçon précédente
                                    </button>
                                    <button className="px-6 py-3 bg-mdla-black text-white rounded-lg font-medium hover:bg-gray-800 flex items-center gap-2">
                                        Leçon suivante
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
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
