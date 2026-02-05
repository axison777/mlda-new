import React, { useState, useEffect } from 'react';
import { X, Video as VideoIcon, Save } from 'lucide-react';
import FileUploader from './FileUploader';

const VideoEditor = ({ lesson, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: lesson?.title || '',
        content: lesson?.content || '', // Video URL
        description: lesson?.description || '',
        duration: lesson?.duration || 0,
        audioUrl: lesson?.audioUrl || null,
        pdfUrl: lesson?.pdfUrl || null
    });

    const handleSave = () => {
        if (!formData.title.trim()) {
            alert('Please enter a title');
            return;
        }
        if (!formData.content.trim()) {
            alert('Please enter a video URL');
            return;
        }

        onSave({
            ...lesson,
            ...formData,
            type: 'video'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <VideoIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Video Lesson</h2>
                            <p className="text-sm text-gray-500">Add video content with optional materials</p>
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Introduction to German Grammar"
                        />
                    </div>

                    {/* Video URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Video URL * (YouTube, Vimeo, etc.)
                        </label>
                        <input
                            type="url"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                        {formData.content && (
                            <div className="mt-3 aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={formData.content.replace('watch?v=', 'embed/')}
                                    title="Video preview"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="10"
                            min="0"
                        />
                    </div>

                    {/* Description/Transcript */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description / Transcript
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={6}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Add a description or transcript for this video..."
                        />
                    </div>

                    {/* Audio File (Pronunciation Guide) */}
                    <div>
                        <FileUploader
                            label="Audio File (Optional - Pronunciation Guide)"
                            acceptedTypes="audio"
                            maxSizeMB={20}
                            onUploadComplete={(file) => setFormData({ ...formData, audioUrl: file?.url || null })}
                        />
                    </div>

                    {/* PDF Materials */}
                    <div>
                        <FileUploader
                            label="PDF Materials (Optional - Lesson Notes)"
                            acceptedTypes="pdf"
                            maxSizeMB={10}
                            onUploadComplete={(file) => setFormData({ ...formData, pdfUrl: file?.url || null })}
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
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Lesson
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoEditor;
