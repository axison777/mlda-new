import React, { useState, useRef } from 'react';
import { Upload, X, File, Music, FileText, Check, Loader } from 'lucide-react';
import api from '../../utils/api';

const FileUploader = ({
    onUploadComplete,
    acceptedTypes = 'all', // 'image', 'audio', 'pdf', 'all'
    maxSizeMB = 10,
    label = 'Upload File'
}) => {
    const [uploading, setUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const getAcceptString = () => {
        switch (acceptedTypes) {
            case 'image':
                return 'image/jpeg,image/png,image/gif,image/webp';
            case 'audio':
                return 'audio/mpeg,audio/wav,audio/ogg,audio/mp4';
            case 'pdf':
                return 'application/pdf';
            default:
                return '*/*';
        }
    };

    const getEndpoint = (file) => {
        if (file.type.startsWith('image/')) return '/upload/image';
        if (file.type.startsWith('audio/')) return '/upload/audio';
        if (file.type === 'application/pdf') return '/upload/pdf';
        return '/upload';
    };

    const getFileIcon = (type) => {
        if (type?.startsWith('image/')) return <File className="w-8 h-8 text-blue-500" />;
        if (type?.startsWith('audio/')) return <Music className="w-8 h-8 text-purple-500" />;
        if (type === 'application/pdf') return <FileText className="w-8 h-8 text-red-500" />;
        return <File className="w-8 h-8 text-gray-500" />;
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const handleFile = async (file) => {
        setError(null);

        // Validate file size
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`File size must be less than ${maxSizeMB}MB`);
            return;
        }

        // Validate file type
        const acceptString = getAcceptString();
        if (acceptString !== '*/*' && !acceptString.split(',').some(type => file.type.match(type))) {
            setError('Invalid file type');
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            const fieldName = file.type.startsWith('image/') ? 'image' :
                file.type.startsWith('audio/') ? 'audio' :
                    file.type === 'application/pdf' ? 'pdf' : 'file';

            formData.append(fieldName, file);

            const endpoint = getEndpoint(file);
            const { data } = await api.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const fileData = {
                name: file.name,
                url: data.url,
                type: file.type,
                size: file.size
            };

            setUploadedFile(fileData);
            if (onUploadComplete) onUploadComplete(fileData);
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleRemove = () => {
        setUploadedFile(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (onUploadComplete) onUploadComplete(null);
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

            {!uploadedFile ? (
                <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                            ? 'border-mdla-yellow bg-yellow-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept={getAcceptString()}
                        onChange={handleChange}
                        disabled={uploading}
                    />

                    {uploading ? (
                        <div className="flex flex-col items-center gap-3">
                            <Loader className="w-10 h-10 text-mdla-yellow animate-spin" />
                            <p className="text-sm text-gray-600">Uploading...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <Upload className="w-10 h-10 text-gray-400" />
                            <div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-mdla-yellow hover:text-yellow-600 font-medium"
                                >
                                    Click to upload
                                </button>
                                <span className="text-gray-500"> or drag and drop</span>
                            </div>
                            <p className="text-xs text-gray-500">
                                {acceptedTypes === 'image' && 'PNG, JPG, GIF up to 5MB'}
                                {acceptedTypes === 'audio' && 'MP3, WAV up to 20MB'}
                                {acceptedTypes === 'pdf' && 'PDF up to 10MB'}
                                {acceptedTypes === 'all' && `Max ${maxSizeMB}MB`}
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-3">
                        {getFileIcon(uploadedFile.type)}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {uploadedFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {formatFileSize(uploadedFile.size)}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-500" />
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default FileUploader;
