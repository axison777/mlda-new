import React, { useState } from 'react';
import { X, CreditCard, Smartphone, DollarSign, ArrowRight, ArrowLeft, Monitor, Users } from 'lucide-react';
import api from '../utils/api';

const PaymentModal = ({ isOpen, onClose, course, onSuccess }) => {
    const [step, setStep] = useState(1); // 1 = Learning Mode, 2 = Payment
    const [learningMode, setLearningMode] = useState('online');
    const [paymentMethod, setPaymentMethod] = useState('orange_money');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !course) return null;

    const handleContinue = () => {
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleConfirmPayment = async () => {
        try {
            setLoading(true);

            // Call enrollment API
            const { data } = await api.post('/enrollments', {
                courseId: course.id,
                learningMode
            });

            // Show success message
            alert(`✅ ${data.message}\nMode: ${learningMode === 'online' ? 'En ligne' : 'Présentiel'}`);

            // Reset and close
            setStep(1);
            setLearningMode('online');
            setPaymentMethod('orange_money');
            onClose();

            // Call success callback
            if (onSuccess) {
                onSuccess(data.enrollment);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    const displayPrice = course.discount_price || course.price || 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {step === 1 ? 'Inscription au cours' : 'Paiement du cours'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Course Info */}
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <div className="flex gap-4">
                        {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className="w-20 h-20 object-cover rounded-lg" />
                        ) : (
                            <div className="w-20 h-20 bg-gradient-to-br from-mdla-yellow to-yellow-400 rounded-lg flex items-center justify-center">
                                <Monitor className="w-10 h-10 text-mdla-black opacity-50" />
                            </div>
                        )}
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">{course.title}</h3>
                            <p className="text-sm text-gray-600 mb-1">Par: {course.teacher?.name || 'N/A'}</p>
                            {step === 2 && (
                                <p className="text-sm text-blue-600 font-medium">
                                    Mode: {learningMode === 'online' ? '📱 En ligne' : '🏫 Présentiel'}
                                </p>
                            )}
                            <p className="text-lg font-bold text-mdla-yellow mt-1">
                                {displayPrice.toLocaleString()} FCFA
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 1: Learning Mode Selection */}
                {step === 1 && (
                    <div className="p-6 space-y-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Choisissez votre mode d'apprentissage:</h3>

                        {/* Online Option */}
                        <div
                            onClick={() => setLearningMode('online')}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${learningMode === 'online'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${learningMode === 'online' ? 'border-blue-500' : 'border-gray-300'
                                    }`}>
                                    {learningMode === 'online' && (
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Monitor className="w-5 h-5 text-blue-600" />
                                        <span className="font-semibold text-gray-900">En ligne</span>
                                    </div>
                                    <p className="text-sm text-gray-600">Accédez au cours depuis n'importe où</p>
                                    <p className="text-sm text-gray-600">Vidéos, audios, PDFs disponibles 24/7</p>
                                </div>
                            </div>
                        </div>

                        {/* In-Person Option */}
                        <div
                            onClick={() => setLearningMode('in_person')}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${learningMode === 'in_person'
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${learningMode === 'in_person' ? 'border-green-500' : 'border-gray-300'
                                    }`}>
                                    {learningMode === 'in_person' && (
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="w-5 h-5 text-green-600" />
                                        <span className="font-semibold text-gray-900">Présentiel</span>
                                    </div>
                                    <p className="text-sm text-gray-600">Cours en salle avec l'instructeur</p>
                                    <p className="text-sm text-gray-600">Interaction directe et pratique</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Payment Method */}
                {step === 2 && (
                    <div className="p-6 space-y-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Méthode de paiement:</h3>

                        {/* Orange Money */}
                        <div
                            onClick={() => setPaymentMethod('orange_money')}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'orange_money'
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'orange_money' ? 'border-orange-500' : 'border-gray-300'
                                    }`}>
                                    {paymentMethod === 'orange_money' && (
                                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                    )}
                                </div>
                                <Smartphone className="w-5 h-5 text-orange-600" />
                                <span className="font-medium text-gray-900">Orange Money</span>
                            </div>
                        </div>

                        {/* Visa/Mastercard */}
                        <div
                            onClick={() => setPaymentMethod('card')}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'card'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-blue-500' : 'border-gray-300'
                                    }`}>
                                    {paymentMethod === 'card' && (
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    )}
                                </div>
                                <CreditCard className="w-5 h-5 text-blue-600" />
                                <span className="font-medium text-gray-900">Visa / Mastercard</span>
                            </div>
                        </div>

                        {/* PayPal */}
                        <div
                            onClick={() => setPaymentMethod('paypal')}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'paypal'
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'paypal' ? 'border-indigo-500' : 'border-gray-300'
                                    }`}>
                                    {paymentMethod === 'paypal' && (
                                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                                    )}
                                </div>
                                <DollarSign className="w-5 h-5 text-indigo-600" />
                                <span className="font-medium text-gray-900">PayPal</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
                    {step === 1 ? (
                        <>
                            <button
                                onClick={onClose}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleContinue}
                                className="flex-1 bg-mdla-yellow hover:bg-yellow-400 text-mdla-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                Continuer
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleBack}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Retour
                            </button>
                            <button
                                onClick={handleConfirmPayment}
                                disabled={loading}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Traitement...' : 'Confirmer le paiement'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
