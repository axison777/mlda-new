import React, { useState } from 'react';
import {
    Plus,
    Trash2,
    Save,
    X,
    Image as ImageIcon,
    Type,
    HelpCircle,
    GripVertical,
    ArrowLeft
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import PhonePreview from './PhonePreview';

const InteractiveLessonEditor = ({ initialContent, onSave, onCancel }) => {
    const [slides, setSlides] = useState(initialContent?.slides || []);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);

    const activeSlide = slides[activeSlideIndex];

    const addSlide = (type) => {
        const newSlide = {
            id: `slide-${Date.now()}`,
            type: type,
            // Default values based on type
            ...(type === 'vocab' && { de: '', fr: '', image: '' }),
            ...(type === 'flashcard' && { front: '', back: '' }),
            ...(type === 'quiz' && { question: '', options: ['', '', ''], answer: 0 })
        };
        const newSlides = [...slides, newSlide];
        setSlides(newSlides);
        setActiveSlideIndex(newSlides.length - 1);
    };

    const updateSlide = (field, value) => {
        const newSlides = [...slides];
        newSlides[activeSlideIndex] = { ...newSlides[activeSlideIndex], [field]: value };
        setSlides(newSlides);
    };

    const updateQuizOption = (index, value) => {
        const newSlides = [...slides];
        const options = [...newSlides[activeSlideIndex].options];
        options[index] = value;
        newSlides[activeSlideIndex] = { ...newSlides[activeSlideIndex], options };
        setSlides(newSlides);
    };

    const deleteSlide = (index) => {
        if (slides.length <= 1) return alert('La leçon doit contenir au moins une carte.');
        const newSlides = slides.filter((_, i) => i !== index);
        setSlides(newSlides);
        if (activeSlideIndex >= newSlides.length) {
            setActiveSlideIndex(newSlides.length - 1);
        }
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(slides);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setSlides(items);
        setActiveSlideIndex(result.destination.index);
    };

    const handleSave = () => {
        onSave({ type: 'interactive', slides });
    };

    return (
        <div className="fixed inset-0 bg-gray-100 z-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Éditeur de Leçon Interactive</h1>
                </div>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
                        Annuler
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-mdla-yellow text-mdla-black rounded-lg font-bold hover:bg-yellow-400 flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Enregistrer
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar: Timeline */}
                <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-700 mb-2">Cartes ({slides.length})</h3>
                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => addSlide('vocab')} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex flex-col items-center gap-1 text-xs" title="Vocabulaire">
                                <Type className="w-4 h-4" /> Vocab
                            </button>
                            <button onClick={() => addSlide('flashcard')} className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 flex flex-col items-center gap-1 text-xs" title="Flashcard">
                                <Image as ImageIcon className="w-4 h-4" /> Flash
                            </button>
                            <button onClick={() => addSlide('quiz')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex flex-col items-center gap-1 text-xs" title="Quiz">
                                <HelpCircle className="w-4 h-4" /> Quiz
                            </button>
                        </div>
                    </div>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="slides">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="flex-1 overflow-y-auto p-2 space-y-2"
                                >
                                    {slides.map((slide, index) => (
                                        <Draggable key={slide.id} draggableId={slide.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    onClick={() => setActiveSlideIndex(index)}
                                                    className={`p-3 rounded-lg border cursor-pointer flex items-center gap-2 ${activeSlideIndex === index
                                                            ? 'border-mdla-yellow bg-yellow-50 ring-1 ring-mdla-yellow'
                                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div {...provided.dragHandleProps} className="text-gray-400">
                                                        <GripVertical className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-xs font-bold uppercase text-gray-500 mb-0.5">{slide.type}</div>
                                                        <div className="text-sm font-medium truncate">
                                                            {slide.type === 'vocab' ? (slide.de || 'Nouveau mot') :
                                                                slide.type === 'flashcard' ? (slide.front || 'Nouvelle carte') :
                                                                    (slide.question || 'Nouvelle question')}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); deleteSlide(index); }}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>

                {/* Center: Editor Form */}
                <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
                    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        {activeSlide ? (
                            <>
                                <h2 className="text-lg font-bold text-gray-900 mb-6 border-b pb-4 capitalize">
                                    Éditer Carte {activeSlide.type}
                                </h2>

                                {activeSlide.type === 'vocab' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mot/Phrase en Allemand</label>
                                            <input
                                                type="text"
                                                value={activeSlide.de}
                                                onChange={(e) => updateSlide('de', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                                placeholder="Ex: Der Apfel"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Traduction Française</label>
                                            <input
                                                type="text"
                                                value={activeSlide.fr}
                                                onChange={(e) => updateSlide('fr', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                                placeholder="Ex: La pomme"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">URL Image</label>
                                            <input
                                                type="text"
                                                value={activeSlide.image}
                                                onChange={(e) => updateSlide('image', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeSlide.type === 'flashcard' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Recto (Question/Face A)</label>
                                            <textarea
                                                value={activeSlide.front}
                                                onChange={(e) => updateSlide('front', e.target.value)}
                                                rows={3}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                                placeholder="Texte visible au début..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Verso (Réponse/Face B)</label>
                                            <textarea
                                                value={activeSlide.back}
                                                onChange={(e) => updateSlide('back', e.target.value)}
                                                rows={3}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                                placeholder="Texte révélé au clic..."
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeSlide.type === 'quiz' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                                            <input
                                                type="text"
                                                value={activeSlide.question}
                                                onChange={(e) => updateSlide('question', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                                placeholder="Posez votre question..."
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-gray-700">Options de réponse</label>
                                            {activeSlide.options.map((option, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="correct-answer"
                                                        checked={activeSlide.answer === idx}
                                                        onChange={() => updateSlide('answer', idx)}
                                                        className="text-mdla-yellow focus:ring-mdla-yellow"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) => updateQuizOption(idx, e.target.value)}
                                                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                                        placeholder={`Option ${idx + 1}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center text-gray-500 py-12">
                                Ajoutez une carte pour commencer
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Phone Preview */}
                <div className="w-[400px] bg-gray-100 border-l border-gray-200 p-8 flex flex-col items-center justify-center">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Aperçu Mobile</h3>
                    <PhonePreview
                        slide={activeSlide}
                        totalSlides={slides.length}
                        currentIndex={activeSlideIndex}
                    />
                </div>
            </div>
        </div>
    );
};

export default InteractiveLessonEditor;
