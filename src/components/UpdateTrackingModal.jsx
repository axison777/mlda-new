import { useState } from 'react';
import { X } from 'lucide-react';
import { trackingSteps } from '../data/mockOrders';

const UpdateTrackingModal = ({ isOpen, onClose, shipment, onUpdate }) => {
    const [selectedStep, setSelectedStep] = useState(shipment?.currentStep || 'ordered');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !shipment) return null;

    const steps = ['ordered', 'in_transit_sea', 'customs', 'delivery', 'delivered'];
    const currentStepIndex = steps.indexOf(shipment.currentStep);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        onUpdate({
            trackingNumber: shipment.trackingNumber,
            newStep: selectedStep,
            comment: comment.trim()
        });

        setIsSubmitting(false);
        setComment('');
        onClose();
    };

    const handleClose = () => {
        setComment('');
        setSelectedStep(shipment.currentStep);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-mdla-black">
                            Mettre à jour le suivi
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {shipment.trackingNumber} - {shipment.vehicle}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Current Status */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-2">Statut actuel</p>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{trackingSteps[shipment.currentStep].emoji}</span>
                                <span className="font-semibold text-gray-900">
                                    {trackingSteps[shipment.currentStep].label}
                                </span>
                            </div>
                        </div>

                        {/* Timeline Step Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                Nouvelle étape
                            </label>
                            <div className="space-y-2">
                                {steps.map((step, index) => {
                                    const stepInfo = trackingSteps[step];
                                    const isDisabled = index < currentStepIndex;
                                    const isCurrent = step === shipment.currentStep;

                                    return (
                                        <label
                                            key={step}
                                            className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedStep === step
                                                    ? 'border-mdla-yellow bg-yellow-50'
                                                    : isDisabled
                                                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="trackingStep"
                                                value={step}
                                                checked={selectedStep === step}
                                                onChange={(e) => setSelectedStep(e.target.value)}
                                                disabled={isDisabled}
                                                className="w-4 h-4 text-mdla-yellow focus:ring-mdla-yellow"
                                            />
                                            <span className="text-2xl">{stepInfo.emoji}</span>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">
                                                    {stepInfo.label}
                                                </p>
                                                {isCurrent && (
                                                    <p className="text-xs text-gray-500">Étape actuelle</p>
                                                )}
                                            </div>
                                            {isDisabled && (
                                                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                                    Complété
                                                </span>
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Comment Field */}
                        <div>
                            <label htmlFor="comment" className="block text-sm font-semibold text-gray-900 mb-2">
                                Commentaire (optionnel)
                            </label>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-mdla-yellow outline-none transition-all resize-none"
                                placeholder="Ajouter un commentaire sur cette mise à jour..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {comment.length} / 500 caractères
                            </p>
                        </div>

                        {/* Shipment Info */}
                        <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                            <p className="text-sm font-semibold text-gray-900">Informations de l'expédition</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-gray-600">Client:</span>
                                    <span className="ml-2 font-medium text-gray-900">{shipment.client}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Destination:</span>
                                    <span className="ml-2 font-medium text-gray-900">{shipment.destination}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || selectedStep === shipment.currentStep}
                            className="px-6 py-3 bg-mdla-yellow text-mdla-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateTrackingModal;
