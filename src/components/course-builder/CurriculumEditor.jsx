import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
    GripVertical,
    Plus,
    Trash2,
    Edit2,
    Video,
    FileText,
    Gamepad2,
    ChevronDown,
    ChevronRight,
    X,
    Music,
    Calendar,
    HelpCircle
} from 'lucide-react';
import VideoEditor from './VideoEditor';
import QuizEditor from './QuizEditor';
import SessionEditor from './SessionEditor';
import AudioEditor from './AudioEditor';
import InteractiveLessonEditor from './InteractiveLessonEditor';

const CurriculumEditor = ({ modules, setModules, onNext, onBack }) => {
    const [expandedModules, setExpandedModules] = useState({});
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [activeModuleId, setActiveModuleId] = useState(null);
    const [editingLesson, setEditingLesson] = useState(null);
    const [editorType, setEditorType] = useState(null); // 'video', 'quiz', 'session', 'audio', 'interactive'

    // Toggle module expansion
    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    // Add new module
    const addModule = () => {
        const newModule = {
            id: `module-${Date.now()}`,
            title: `Nouveau Module ${modules.length + 1}`,
            lessons: []
        };
        setModules([...modules, newModule]);
        setExpandedModules(prev => ({ ...prev, [newModule.id]: true }));
    };

    // Delete module
    const deleteModule = (moduleId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) {
            setModules(modules.filter(m => m.id !== moduleId));
        }
    };

    // Update module title
    const updateModuleTitle = (moduleId, newTitle) => {
        setModules(modules.map(m =>
            m.id === moduleId ? { ...m, title: newTitle } : m
        ));
    };

    // Open add lesson modal
    const openAddLessonModal = (moduleId) => {
        setActiveModuleId(moduleId);
        setShowLessonModal(true);
    };

    // Add lesson - now opens appropriate editor
    const addLesson = (type) => {
        const newLesson = {
            id: `lesson-${Date.now()}`,
            title: '',
            type: type,
            content: null,
            order: modules.find(m => m.id === activeModuleId)?.lessons?.length || 0
        };

        setShowLessonModal(false);
        setEditingLesson({ moduleId: activeModuleId, lesson: newLesson });
        setEditorType(type);
    };

    // Save lesson from editor
    const saveLessonFromEditor = (updatedLesson) => {
        setModules(modules.map(m =>
            m.id === editingLesson.moduleId
                ? {
                    ...m,
                    lessons: m.lessons.some(l => l.id === updatedLesson.id)
                        ? m.lessons.map(l => l.id === updatedLesson.id ? updatedLesson : l)
                        : [...m.lessons, updatedLesson]
                }
                : m
        ));
        setEditingLesson(null);
        setEditorType(null);
    };

    // Edit existing lesson
    const editLesson = (moduleId, lesson) => {
        setEditingLesson({ moduleId, lesson });
        setEditorType(lesson.type);
    };

    // Delete lesson
    const deleteLesson = (moduleId, lessonId) => {
        if (confirm('Supprimer cette leçon ?')) {
            setModules(modules.map(m =>
                m.id === moduleId
                    ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
                    : m
            ));
        }
    };

    // Handle Drag & Drop
    const onDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination, type } = result;

        if (type === 'module') {
            const newModules = Array.from(modules);
            const [reorderedModule] = newModules.splice(source.index, 1);
            newModules.splice(destination.index, 0, reorderedModule);
            setModules(newModules);
        } else {
            // Reordering lessons
            const sourceModuleIndex = modules.findIndex(m => m.id === source.droppableId);
            const destModuleIndex = modules.findIndex(m => m.id === destination.droppableId);

            const newModules = [...modules];
            const sourceModule = newModules[sourceModuleIndex];
            const destModule = newModules[destModuleIndex];

            const [movedLesson] = sourceModule.lessons.splice(source.index, 1);
            destModule.lessons.splice(destination.index, 0, movedLesson);

            setModules(newModules);
        }
    };

    // Get icon for lesson type
    const getLessonIcon = (type) => {
        switch (type) {
            case 'video': return <Video className="w-4 h-4" />;
            case 'audio': return <Music className="w-4 h-4" />;
            case 'pdf': return <FileText className="w-4 h-4" />;
            case 'quiz': return <HelpCircle className="w-4 h-4" />;
            case 'live_session': return <Calendar className="w-4 h-4" />;
            case 'interactive': return <Gamepad2 className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    // Get color for lesson type
    const getLessonColor = (type) => {
        switch (type) {
            case 'video': return 'bg-blue-100 text-blue-600';
            case 'audio': return 'bg-purple-100 text-purple-600';
            case 'pdf': return 'bg-red-100 text-red-600';
            case 'quiz': return 'bg-yellow-100 text-yellow-600';
            case 'live_session': return 'bg-green-100 text-green-600';
            case 'interactive': return 'bg-yellow-100 text-yellow-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    // Render appropriate editor based on type
    const renderEditor = () => {
        if (!editingLesson || !editorType) return null;

        const commonProps = {
            lesson: editingLesson.lesson,
            onSave: saveLessonFromEditor,
            onCancel: () => {
                setEditingLesson(null);
                setEditorType(null);
            }
        };

        switch (editorType) {
            case 'video':
                return <VideoEditor {...commonProps} />;
            case 'quiz':
                return <QuizEditor {...commonProps} />;
            case 'live_session':
                return <SessionEditor {...commonProps} />;
            case 'audio':
                return <AudioEditor {...commonProps} />;
            case 'interactive':
                return (
                    <InteractiveLessonEditor
                        initialContent={editingLesson.lesson.content}
                        onSave={(content) => saveLessonFromEditor({ ...editingLesson.lesson, content })}
                        onCancel={() => {
                            setEditingLesson(null);
                            setEditorType(null);
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Programme du Cours</h2>
                <button
                    onClick={addModule}
                    className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Ajouter un Module
                </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="curriculum" type="module">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-4 flex-1"
                        >
                            {modules.map((module, index) => (
                                <Draggable key={module.id} draggableId={module.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden"
                                        >
                                            {/* Module Header */}
                                            <div className="p-4 flex items-center gap-3 bg-white border-b border-gray-100">
                                                <div {...provided.dragHandleProps} className="cursor-grab text-gray-400 hover:text-gray-600">
                                                    <GripVertical className="w-5 h-5" />
                                                </div>
                                                <button onClick={() => toggleModule(module.id)}>
                                                    {expandedModules[module.id] ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                                </button>
                                                <input
                                                    type="text"
                                                    value={module.title}
                                                    onChange={(e) => updateModuleTitle(module.id, e.target.value)}
                                                    className="font-bold text-gray-900 bg-transparent border-none focus:ring-0 p-0 w-full"
                                                />
                                                <div className="ml-auto flex items-center gap-2">
                                                    <button
                                                        onClick={() => deleteModule(module.id)}
                                                        className="text-gray-400 hover:text-red-600 p-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Lessons List */}
                                            {expandedModules[module.id] && (
                                                <Droppable droppableId={module.id} type="lesson">
                                                    {(provided) => (
                                                        <div
                                                            {...provided.droppableProps}
                                                            ref={provided.innerRef}
                                                            className="p-4 space-y-2 min-h-[50px]"
                                                        >
                                                            {module.lessons.map((lesson, index) => (
                                                                <Draggable key={lesson.id} draggableId={lesson.id} index={index}>
                                                                    {(provided) => (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-mdla-yellow transition-colors group"
                                                                        >
                                                                            <GripVertical className="w-4 h-4 text-gray-300" />
                                                                            <div className={`p-2 rounded-lg ${getLessonColor(lesson.type)}`}>
                                                                                {getLessonIcon(lesson.type)}
                                                                            </div>
                                                                            <span className="font-medium text-gray-700">{lesson.title || 'Untitled'}</span>
                                                                            <div className="ml-auto flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                <button
                                                                                    onClick={() => editLesson(module.id, lesson)}
                                                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                                                    title="Edit"
                                                                                >
                                                                                    <Edit2 className="w-4 h-4" />
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => deleteLesson(module.id, lesson.id)}
                                                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                                                    title="Delete"
                                                                                >
                                                                                    <Trash2 className="w-4 h-4" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                            {provided.placeholder}
                                                            <button
                                                                onClick={() => openAddLessonModal(module.id)}
                                                                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-mdla-yellow hover:text-mdla-yellow hover:bg-yellow-50 transition-colors flex items-center justify-center gap-2 font-medium"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                                Ajouter une leçon
                                                            </button>
                                                        </div>
                                                    )}
                                                </Droppable>
                                            )}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <div className="flex justify-between pt-6 border-t border-gray-100 mt-auto">
                <button
                    onClick={onBack}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                    Retour
                </button>
                <button
                    onClick={onNext}
                    className="bg-mdla-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    Suivant : Révision
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Add Lesson Modal */}
            {showLessonModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Type de Leçon</h3>
                            <button onClick={() => setShowLessonModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => addLesson('video')}
                                className="p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                            >
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors mb-2">
                                    <Video className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-gray-900 text-sm">Vidéo</h4>
                                <p className="text-xs text-gray-500">YouTube, Vimeo</p>
                            </button>

                            <button
                                onClick={() => addLesson('audio')}
                                className="p-4 border border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
                            >
                                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors mb-2">
                                    <Music className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-gray-900 text-sm">Audio</h4>
                                <p className="text-xs text-gray-500">MP3, WAV</p>
                            </button>

                            <button
                                onClick={() => addLesson('quiz')}
                                className="p-4 border border-mdla-yellow rounded-xl bg-yellow-50 hover:bg-yellow-100 transition-all text-left group"
                            >
                                <div className="w-10 h-10 bg-mdla-yellow text-mdla-black rounded-lg flex items-center justify-center mb-2">
                                    <HelpCircle className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-gray-900 text-sm">Quiz</h4>
                                <p className="text-xs text-gray-600">QCM, Texte à trou</p>
                            </button>

                            <button
                                onClick={() => addLesson('live_session')}
                                className="p-4 border border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left group"
                            >
                                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors mb-2">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-gray-900 text-sm">Session Live</h4>
                                <p className="text-xs text-gray-500">En ligne / Présentiel</p>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Render Editor */}
            {renderEditor()}
        </div>
    );
};

export default CurriculumEditor;
