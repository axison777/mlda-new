import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourses } from '../../context/CoursesContext';
import {
    ChevronRight,
    Save,
    Send,
    Layout,
    List,
    CheckCircle,
    ArrowLeft,
    Upload,
    X
} from 'lucide-react';
import CurriculumEditor from '../../components/course-builder/CurriculumEditor';
import api from '../../utils/api';

const CourseBuilder = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const {
        getCourseById,
        createCourse,
        submitForReview,
        createModule,
        updateModule,
        createItem,
        updateItem
    } = useCourses();
    const [activeStep, setActiveStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Initial state
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        level: 'A1',
        thumbnail: null,
        modules: []
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        if (courseId) {
            loadCourse();
        }
    }, [courseId]);

    const loadCourse = async () => {
        setLoading(true);
        const data = await getCourseById(courseId);
        if (data) {
            // Backend now returns: { ..., modules: [ { ..., items: [] } ] }
            const mappedModules = (data.modules || []).map(mod => ({
                id: mod.id,
                title: mod.title,
                order: mod.order,
                lessons: (mod.items || []).map(item => ({
                    id: item.id,
                    title: item.title,
                    type: item.type,
                    content: item.content,
                    duration: item.duration,
                    order: item.order,
                    isRequired: item.isRequired,
                    audioUrl: item.audioUrl,
                    pdfUrl: item.pdfUrl,
                    description: item.description,
                    videoUrl: item.type === 'video' ? item.content : null
                })).sort((a, b) => a.order - b.order)
            })).sort((a, b) => a.order - b.order);

            setCourseData({
                ...data,
                modules: mappedModules
            });

            // Set image preview if thumbnail exists
            if (data.thumbnail) {
                setImagePreview(data.thumbnail);
            }
        }
        setLoading(false);
    };

    const steps = [
        { id: 1, title: 'Informations Générales', icon: Layout },
        { id: 2, title: 'Programme du Cours', icon: List },
        { id: 3, title: 'Révision & Publication', icon: CheckCircle },
    ];

    const saveCurriculum = async () => {
        setLoading(true);
        try {
            // This is a naive implementation: it saves everything. 
            // In a real app, we should track dirty states or use a bulk endpoint.
            // For now, checks if ID is temp or real.

            for (let modIndex = 0; modIndex < courseData.modules.length; modIndex++) {
                const module = courseData.modules[modIndex];
                let moduleId = module.id;

                // Create or Update Module
                if (typeof moduleId === 'string' && moduleId.startsWith('module-')) {
                    const result = await createModule(courseId, {
                        title: module.title,
                        order: modIndex + 1
                    });
                    if (result.success) moduleId = result.module.id;
                } else {
                    await updateModule(moduleId, {
                        title: module.title,
                        order: modIndex + 1
                    });
                }

                // Handle Lessons (CurriculumItems)
                for (let itemIndex = 0; itemIndex < module.lessons.length; itemIndex++) {
                    const lesson = module.lessons[itemIndex];
                    const itemData = {
                        title: lesson.title,
                        type: lesson.type || 'video',
                        content: lesson.type === 'video' ? (lesson.videoUrl || lesson.content) : lesson.content,
                        order: itemIndex + 1,
                        isRequired: true
                    };

                    if (lesson.id && !lesson.id.toString().startsWith('lesson-')) {
                        await updateItem(lesson.id, itemData);
                    } else if (moduleId) {
                        // Only create item if we have a valid module ID
                        await createItem(moduleId, itemData);
                    }
                }
            }

            await loadCourse(); // Refresh to get real IDs back
            alert('Programme sauvegardé avec succès !');
        } catch (error) {
            console.error('Error saving curriculum:', error);
            alert('Erreur lors de la sauvegarde du programme');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDraft = async () => {
        setLoading(true);
        try {
            // Create new course if no courseId exists
            if (!courseId) {
                const result = await createCourse({
                    ...courseData,
                    status: 'draft'
                });
                if (result.success) {
                    alert('Cours créé et sauvegardé comme brouillon !');
                    navigate(`/dashboard/editer-cours/${result.course.id}`);
                    return;
                }
            }

            // Update existing course
            if (courseId) {
                // Save curriculum if on step 3 (curriculum editor)
                if (activeStep === 3) {
                    await saveCurriculum();
                } else {
                    // Update basic course info for steps 1 and 2
                    await api.put(`/courses/${courseId}`, {
                        ...courseData,
                        status: 'draft' // Keep as draft
                    });
                }
                alert('Brouillon sauvegardé !');
            }
        } catch (error) {
            console.error('Error saving draft:', error);
            alert(error.response?.data?.message || 'Erreur lors de la sauvegarde');
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        if (!courseData.title || !courseData.description || !courseData.level) {
            alert('Veuillez remplir tous les champs requis (titre, description, niveau)');
            return;
        }

        setLoading(true);
        try {
            let currentCourseId = courseId;

            // If no courseId, create the course first
            if (!currentCourseId) {
                const result = await createCourse({
                    ...courseData,
                    status: 'draft'
                });
                if (result.success) {
                    currentCourseId = result.course.id;
                } else {
                    throw new Error('Impossible de créer le cours');
                }
            }

            // Save curriculum if on step 3
            if (activeStep === 3) {
                await saveCurriculum();
            } else if (activeStep === 1 || activeStep === 2) {
                // Update basic info if on steps 1 or 2
                await api.put(`/courses/${currentCourseId}`, {
                    ...courseData,
                    status: 'draft'
                });
            }

            // Submit for review
            await api.post(`/courses/${currentCourseId}/submit`);
            alert('Cours envoyé pour validation !');
            navigate('/dashboard/mes-cours');
        } catch (error) {
            console.error('Error submitting course:', error);
            alert(error.response?.data?.message || 'Erreur lors de la soumission');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard/mes-cours')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            {courseId ? 'Éditer le cours' : 'Créer un nouveau cours'}
                        </h1>
                        <p className="text-xs text-gray-500">
                            {courseData.title || 'Sans titre'} • {courseData.level}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSaveDraft}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Sauvegarder
                    </button>
                    <button
                        onClick={handlePublish}
                        className="px-4 py-2 text-mdla-black bg-mdla-yellow hover:bg-yellow-400 rounded-lg font-bold transition-colors flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Envoyer pour validation
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Steps Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto hidden lg:block">
                    <div className="p-6">
                        <div className="space-y-1">
                            {steps.map((step) => (
                                <button
                                    key={step.id}
                                    onClick={() => setActiveStep(step.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeStep === step.id
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <step.icon className={`w-5 h-5 ${activeStep === step.id ? 'text-blue-600' : 'text-gray-400'}`} />
                                    {step.title}
                                    {activeStep === step.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Step 1: General Info */}
                        {activeStep === 1 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations du Cours</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre du cours</label>
                                    <input
                                        type="text"
                                        value={courseData.title}
                                        onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                        placeholder="Ex: Allemand Débutant - Les bases"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={courseData.description}
                                        onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                                        rows={4}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                        placeholder="Décrivez ce que les étudiants vont apprendre..."
                                    />
                                </div>

                                {/* Cover Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Image de couverture</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-mdla-yellow transition-colors">
                                        {imagePreview ? (
                                            <div className="relative">
                                                <img src={imagePreview} alt="Cover preview" className="max-h-48 mx-auto rounded-lg" />
                                                <button
                                                    onClick={() => {
                                                        setImagePreview(null);
                                                        setCourseData({ ...courseData, thumbnail: null });
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-600 mb-2">Cliquez pour télécharger une image</p>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 5MB</p>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            setUploadingImage(true);
                                                            try {
                                                                const formData = new FormData();
                                                                formData.append('image', file);
                                                                const { data } = await api.post('/upload/image', formData, {
                                                                    headers: { 'Content-Type': 'multipart/form-data' }
                                                                });
                                                                setCourseData({ ...courseData, thumbnail: data.url });
                                                                setImagePreview(data.url);
                                                            } catch (error) {
                                                                alert('Erreur lors du téléchargement de l\'image');
                                                            } finally {
                                                                setUploadingImage(false);
                                                            }
                                                        }
                                                    }}
                                                    className="hidden"
                                                    id="cover-upload"
                                                />
                                                <label
                                                    htmlFor="cover-upload"
                                                    className="mt-3 inline-block px-4 py-2 bg-mdla-yellow text-mdla-black rounded-lg font-medium cursor-pointer hover:bg-yellow-400 transition-colors"
                                                >
                                                    {uploadingImage ? 'Téléchargement...' : 'Choisir une image'}
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                                        <select
                                            value={courseData.level}
                                            onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                        >
                                            <option value="A1">A1 - Débutant</option>
                                            <option value="A2">A2 - Élémentaire</option>
                                            <option value="B1">B1 - Intermédiaire</option>
                                            <option value="B2">B2 - Intermédiaire Supérieur</option>
                                            <option value="C1">C1 - Avancé</option>
                                            <option value="Business">Allemand des Affaires</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Image de couverture</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:bg-gray-50 cursor-pointer transition-colors">
                                            <p className="text-sm text-gray-500">Cliquez pour uploader</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                                    <strong>Note sur la tarification :</strong> Le prix du cours sera défini par l'administration après validation du contenu.
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={() => setActiveStep(2)}
                                        className="bg-mdla-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
                                    >
                                        Suivant : Programme
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Curriculum */}
                        {activeStep === 2 && (
                            <CurriculumEditor
                                modules={courseData.modules}
                                setModules={(modules) => setCourseData({ ...courseData, modules })}
                                onNext={() => setActiveStep(3)}
                                onBack={() => setActiveStep(1)}
                            />
                        )}

                        {/* Step 3: Review */}
                        {activeStep === 3 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center space-y-6">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Prêt à publier ?</h2>
                                <p className="text-gray-600 max-w-md mx-auto">
                                    Votre cours "{courseData.title}" contient {courseData.modules.length} modules.
                                    Une fois envoyé, l'équipe administrative examinera le contenu avant la mise en ligne.
                                </p>

                                <div className="bg-gray-50 p-6 rounded-xl text-left max-w-lg mx-auto space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Titre :</span>
                                        <span className="font-medium">{courseData.title || 'Non défini'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Niveau :</span>
                                        <span className="font-medium">{courseData.level}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Modules :</span>
                                        <span className="font-medium">{courseData.modules.length}</span>
                                    </div>
                                </div>

                                <div className="flex justify-center gap-4 pt-4">
                                    <button
                                        onClick={() => setActiveStep(2)}
                                        className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Retour au programme
                                    </button>
                                    <button
                                        onClick={handlePublish}
                                        className="bg-mdla-yellow hover:bg-yellow-400 text-mdla-black px-8 py-3 rounded-lg font-bold transition-colors"
                                    >
                                        Envoyer pour validation
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CourseBuilder;
