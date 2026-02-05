import React, { useState } from 'react';
import { X, Calendar, Clock, Users, MapPin, Link as LinkIcon, Save } from 'lucide-react';

const SessionEditor = ({ lesson, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: lesson?.title || '',
        description: lesson?.description || '',
        mode: lesson?.content ? JSON.parse(lesson.content).mode : 'online',
        startTime: lesson?.content ? JSON.parse(lesson.content).startTime : '',
        endTime: lesson?.content ? JSON.parse(lesson.content).endTime : '',
        capacity: lesson?.content ? JSON.parse(lesson.content).capacity : 20,
        meetingLink: lesson?.content ? JSON.parse(lesson.content).meetingLink : '',
        address: lesson?.content ? JSON.parse(lesson.content).address : ''
    });

    const calculateDuration = () => {
        if (formData.startTime && formData.endTime) {
            const start = new Date(`2000-01-01T${formData.startTime}`);
            const end = new Date(`2000-01-01T${formData.endTime}`);
            const diff = (end - start) / (1000 * 60); // minutes
            return diff > 0 ? diff : 0;
        }
        return 0;
    };

    const handleSave = () => {
        if (!formData.title.trim()) {
            alert('Please enter a title');
            return;
        }
        if (!formData.startTime || !formData.endTime) {
            alert('Please set start and end times');
            return;
        }
        if (formData.mode === 'online' && !formData.meetingLink.trim()) {
            alert('Please provide a meeting link for online sessions');
            return;
        }
        if (formData.mode === 'in_person' && !formData.address.trim()) {
            alert('Please provide an address for in-person sessions');
            return;
        }

        const sessionData = {
            mode: formData.mode,
            startTime: formData.startTime,
            endTime: formData.endTime,
            capacity: formData.capacity,
            meetingLink: formData.meetingLink,
            address: formData.address
        };

        onSave({
            ...lesson,
            title: formData.title,
            description: formData.description,
            type: 'live_session',
            content: JSON.stringify(sessionData),
            duration: calculateDuration()
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Live Session</h2>
                            <p className="text-sm text-gray-500">Schedule an online or in-person session</p>
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
                            Session Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., Conversation Practice - Week 3"
                        />
                    </div>

                    {/* Mode */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Session Mode *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, mode: 'online' })}
                                className={`p-4 border-2 rounded-lg transition-all ${formData.mode === 'online'
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <LinkIcon className={`w-6 h-6 mx-auto mb-2 ${formData.mode === 'online' ? 'text-green-600' : 'text-gray-400'}`} />
                                <p className="font-medium text-sm">Online</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, mode: 'in_person' })}
                                className={`p-4 border-2 rounded-lg transition-all ${formData.mode === 'in_person'
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <MapPin className={`w-6 h-6 mx-auto mb-2 ${formData.mode === 'in_person' ? 'text-green-600' : 'text-gray-400'}`} />
                                <p className="font-medium text-sm">In Person</p>
                            </button>
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Time *
                            </label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Time *
                            </label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {calculateDuration() > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-blue-800">
                                Duration: {calculateDuration()} minutes
                            </span>
                        </div>
                    )}

                    {/* Capacity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maximum Capacity *
                        </label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="number"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="20"
                                min="1"
                            />
                        </div>
                    </div>

                    {/* Meeting Link (Online) */}
                    {formData.mode === 'online' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meeting Link * (Zoom, Google Meet, etc.)
                            </label>
                            <input
                                type="url"
                                value={formData.meetingLink}
                                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="https://zoom.us/j/..."
                            />
                        </div>
                    )}

                    {/* Address (In Person) */}
                    {formData.mode === 'in_person' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address *
                            </label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="123 Main Street, City, Country"
                            />
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="What will be covered in this session?"
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
                        className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Session
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionEditor;
