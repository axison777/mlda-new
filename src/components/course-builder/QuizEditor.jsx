import React, { useState } from 'react';
import { X, Plus, Trash2, Save, HelpCircle, CheckCircle } from 'lucide-react';

const QuizEditor = ({ lesson, onSave, onCancel }) => {
    const initialQuiz = lesson?.content ? JSON.parse(lesson.content) : {
        passingScore: 80,
        questions: []
    };

    const [formData, setFormData] = useState({
        title: lesson?.title || '',
        description: lesson?.description || '',
        passingScore: initialQuiz.passingScore,
        questions: initialQuiz.questions
    });

    const [editingQuestion, setEditingQuestion] = useState(null);

    const questionTypes = [
        { value: 'multiple_choice', label: 'Multiple Choice (QCM)', icon: '☑️' },
        { value: 'fill_blanks', label: 'Fill in the Blanks', icon: '📝' }
    ];

    const addQuestion = () => {
        setEditingQuestion({
            id: `q-${Date.now()}`,
            type: 'multiple_choice',
            text: '',
            options: ['', ''],
            correctAnswer: '',
            explanation: ''
        });
    };

    const saveQuestion = () => {
        if (!editingQuestion.text.trim()) {
            alert('Please enter a question');
            return;
        }

        if (editingQuestion.type === 'multiple_choice') {
            if (editingQuestion.options.filter(o => o.trim()).length < 2) {
                alert('Please provide at least 2 options');
                return;
            }
            if (!editingQuestion.correctAnswer.trim()) {
                alert('Please select the correct answer');
                return;
            }
        } else if (editingQuestion.type === 'fill_blanks') {
            if (!editingQuestion.correctAnswer.trim()) {
                alert('Please provide the correct answer');
                return;
            }
        }

        const existingIndex = formData.questions.findIndex(q => q.id === editingQuestion.id);
        if (existingIndex >= 0) {
            const updated = [...formData.questions];
            updated[existingIndex] = editingQuestion;
            setFormData({ ...formData, questions: updated });
        } else {
            setFormData({ ...formData, questions: [...formData.questions, editingQuestion] });
        }
        setEditingQuestion(null);
    };

    const deleteQuestion = (id) => {
        if (confirm('Delete this question?')) {
            setFormData({ ...formData, questions: formData.questions.filter(q => q.id !== id) });
        }
    };

    const handleSave = () => {
        if (!formData.title.trim()) {
            alert('Please enter a title');
            return;
        }
        if (formData.questions.length === 0) {
            alert('Please add at least one question');
            return;
        }

        onSave({
            ...lesson,
            title: formData.title,
            description: formData.description,
            type: 'quiz',
            content: JSON.stringify({
                passingScore: formData.passingScore,
                questions: formData.questions
            }),
            duration: formData.questions.length * 2 // Estimate 2 min per question
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <HelpCircle className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Quiz Builder</h2>
                            <p className="text-sm text-gray-500">Create interactive quiz questions</p>
                        </div>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quiz Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="e.g., Grammar Test - Chapter 1"
                        />
                    </div>

                    {/* Passing Score */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Passing Score (%)
                        </label>
                        <input
                            type="number"
                            value={formData.passingScore}
                            onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) || 80 })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            min="0"
                            max="100"
                        />
                    </div>

                    {/* Questions List */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Questions ({formData.questions.length})
                            </label>
                            <button
                                onClick={addQuestion}
                                className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Question
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.questions.map((q, index) => (
                                <div key={q.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-bold text-gray-700">Q{index + 1}.</span>
                                                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                                    {questionTypes.find(t => t.value === q.type)?.label}
                                                </span>
                                            </div>
                                            <p className="text-gray-900">{q.text}</p>
                                            {q.type === 'multiple_choice' && (
                                                <div className="mt-2 space-y-1">
                                                    {q.options.filter(o => o.trim()).map((opt, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-sm">
                                                            {opt === q.correctAnswer ? (
                                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                            ) : (
                                                                <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                                                            )}
                                                            <span className={opt === q.correctAnswer ? 'text-green-700 font-medium' : 'text-gray-600'}>
                                                                {opt}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {q.type === 'fill_blanks' && (
                                                <p className="mt-2 text-sm text-green-700">
                                                    ✓ Answer: <span className="font-medium">{q.correctAnswer}</span>
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingQuestion(q)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            >
                                                <span className="text-sm">Edit</span>
                                            </button>
                                            <button
                                                onClick={() => deleteQuestion(q.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Quiz
                    </button>
                </div>
            </div>

            {/* Question Editor Modal */}
            {editingQuestion && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6 space-y-4">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingQuestion.id.startsWith('q-') ? 'Add Question' : 'Edit Question'}
                            </h3>

                            {/* Question Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                <select
                                    value={editingQuestion.type}
                                    onChange={(e) => setEditingQuestion({ ...editingQuestion, type: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                                >
                                    {questionTypes.map(t => (
                                        <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Question Text */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Question *</label>
                                <textarea
                                    value={editingQuestion.text}
                                    onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                                    placeholder="Enter your question..."
                                />
                            </div>

                            {/* Multiple Choice Options */}
                            {editingQuestion.type === 'multiple_choice' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Options *</label>
                                    <div className="space-y-2">
                                        {editingQuestion.options.map((opt, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={opt}
                                                    onChange={(e) => {
                                                        const newOpts = [...editingQuestion.options];
                                                        newOpts[i] = e.target.value;
                                                        setEditingQuestion({ ...editingQuestion, options: newOpts });
                                                    }}
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                                                    placeholder={`Option ${i + 1}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newOpts = editingQuestion.options.filter((_, idx) => idx !== i);
                                                        setEditingQuestion({ ...editingQuestion, options: newOpts });
                                                    }}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setEditingQuestion({ ...editingQuestion, options: [...editingQuestion.options, ''] })}
                                            className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                                        >
                                            + Add Option
                                        </button>
                                    </div>

                                    <div className="mt-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer *</label>
                                        <select
                                            value={editingQuestion.correctAnswer}
                                            onChange={(e) => setEditingQuestion({ ...editingQuestion, correctAnswer: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                                        >
                                            <option value="">Select correct answer</option>
                                            {editingQuestion.options.filter(o => o.trim()).map((opt, i) => (
                                                <option key={i} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Fill in the Blanks Answer */}
                            {editingQuestion.type === 'fill_blanks' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer *</label>
                                    <input
                                        type="text"
                                        value={editingQuestion.correctAnswer}
                                        onChange={(e) => setEditingQuestion({ ...editingQuestion, correctAnswer: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                                        placeholder="Enter the correct answer"
                                    />
                                </div>
                            )}

                            {/* Explanation */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (Optional)</label>
                                <textarea
                                    value={editingQuestion.explanation}
                                    onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                                    placeholder="Explain why this is the correct answer..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setEditingQuestion(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveQuestion}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600"
                                >
                                    Save Question
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizEditor;
