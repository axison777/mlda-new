import React from 'react';
import { AlertCircle } from 'lucide-react';

const ConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = 'Confirmer la suppression', 
    message = 'Êtes-vous sûr de vouloir continuer ? Cette action est irréversible.',
    confirmText = 'Supprimer',
    cancelText = 'Annuler',
    isDanger = true
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDanger ? 'bg-red-100' : 'bg-mdla-yellow/20'}`}>
                        <AlertCircle className={`w-6 h-6 ${isDanger ? 'text-red-600' : 'text-mdla-yellow'}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                </div>
                <p className="text-gray-600 mb-6">
                    {message}
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 font-bold py-3 rounded-lg transition-colors text-white ${isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-mdla-black hover:bg-gray-800'}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
