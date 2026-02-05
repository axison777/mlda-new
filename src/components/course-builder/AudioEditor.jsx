import React, { useState } from 'react';
import { X, Music, Save } from 'lucide-react';
import FileUploader from './FileUploader';

const AudioEditor = ({ lesson, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: lesson?.title || '',
        audioUrl: lesson?.audioUrl || lesson?.content || null,
        description: lesson?.description || '',
        duration: lesson?.duration || 0
    });

    const handleSave = () => {
        if (!formData.title.trim()) {
            alert('Please enter a title');
            return;
        }
        if (!formData.audioUrl) {
            alert('Please upload an audio file');
            return;
        }

        onSave({
            ...lesson,
            title: formData.title,
            type: 'audio',
            audioUrl: formData.audioUrl,
            content: formData.audioUrl, // Store in content as well for compatibility
            description: formData.description,
            duration: formData.duration
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Music className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Audio Lesson</h2>
                            <p className="text-sm text-gray-500">Upload audio content for listening practice</p>
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
                            Lesson Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="e.g., Listening Practice - Dialogue 1"
                        />
                    </div>

                    {/* Audio File Upload */}
                    <div>
                        <FileUploader
                            label="Audio File * (MP3, WAV, OGG)"
                            acceptedTypes="audio"
                            maxSizeMB={20}
                            onUploadComplete={(file) => setFormData({ ...formData, audioUrl: file?.url || null })}
                        />

                        {formData.audioUrl && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <audio controls className="w-full">
                                    <source src={formData.audioUrl} />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        )}
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration (minutes)
                        </label>
                        <input
                            type="number"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="5"
                            min="0"
                        />
                    </div>

                    {/* Transcript/Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Transcript / Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={8}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                            placeholder="Add a transcript or description of the audio content..."
                        />
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
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Lesson
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AudioEditor;
