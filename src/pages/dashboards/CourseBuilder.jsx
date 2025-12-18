import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    Save,
    Send,
    Layout,
    List,
    CheckCircle,
    ArrowLeft
} from 'lucide-react';
import CurriculumEditor from '../../components/course-builder/CurriculumEditor';

const CourseBuilder = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(1);
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        level: 'A1',
        image: null,
        modules: []
    });

    const steps = [
        { id: 1, title: 'Informations Générales', icon: Layout },
        { id: 2, title: 'Programme du Cours', icon: List },
        { id: 3, title: 'Révision & Publication', icon: CheckCircle },
    ];

    const handleSaveDraft = () => {
        // TODO: Save to backend
        console.log('Saving draft:', courseData);
        alert('Brouillon sauvegardé !');
    };

    const handlePublish = () => {
        // TODO: Send to backend
        console.log('Publishing:', courseData);
        alert('Cours envoyé pour validation !');
        navigate('/dashboard/mes-cours');
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
