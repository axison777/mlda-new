import { useState } from 'react';
import { X, Upload, Send } from 'lucide-react';

const QuoteModal = ({ isOpen, onClose, preSelectedService = '' }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        service: preSelectedService,
        description: '',
        budget: '',
        urgency: 'normal'
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Quote request:', formData);
        alert('Votre demande de devis a été envoyée avec succès ! Nous vous contacterons sous 24h.');
        onClose();
        // TODO: Send to backend
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-mdla-red transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Header */}
                    <div className="bg-gradient-to-r from-mdla-yellow to-yellow-400 p-8">
                        <h2 className="text-3xl font-bold text-mdla-black">
                            Demande de Devis
                        </h2>
                        <p className="text-mdla-black/80 mt-2">
                            Remplissez ce formulaire et nous vous répondrons sous 24h
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Prénom *
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all"
                                    placeholder="Votre prénom"
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nom *
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all"
                                    placeholder="Votre nom"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all"
                                    placeholder="votre@email.com"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Téléphone *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all"
                                    placeholder="+226 XX XX XX XX"
                                />
                            </div>

                            {/* Service Type */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Type de service *
                                </label>
                                <select
                                    name="service"
                                    value={formData.service}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all"
                                >
                                    <option value="">Sélectionnez un service</option>
                                    <option value="formation">Formation & Langue Allemande</option>
                                    <option value="import-export">Import/Export & Véhicules</option>
                                    <option value="representation">Représentation & B2B</option>
                                    <option value="traduction">Traduction & Démarches</option>
                                    <option value="autre">Autre</option>
                                </select>
                            </div>

                            {/* Budget */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Budget estimé
                                </label>
                                <select
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all"
                                >
                                    <option value="">Sélectionnez une fourchette</option>
                                    <option value="moins-100k">Moins de 100 000 FCFA</option>
                                    <option value="100k-500k">100 000 - 500 000 FCFA</option>
                                    <option value="500k-1m">500 000 - 1 000 000 FCFA</option>
                                    <option value="1m-5m">1 000 000 - 5 000 000 FCFA</option>
                                    <option value="plus-5m">Plus de 5 000 000 FCFA</option>
                                </select>
                            </div>

                            {/* Urgency */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Urgence
                                </label>
                                <select
                                    name="urgency"
                                    value={formData.urgency}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all"
                                >
                                    <option value="normal">Normal (1-2 semaines)</option>
                                    <option value="urgent">Urgent (3-5 jours)</option>
                                    <option value="tres-urgent">Très urgent (24-48h)</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description de votre besoin *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="Décrivez en détail votre projet ou besoin..."
                                ></textarea>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 flex gap-4">
                            <button
                                type="submit"
                                className="flex-1 bg-mdla-yellow text-mdla-black px-8 py-4 rounded-lg font-bold hover:bg-yellow-400 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                                <Send className="w-5 h-5" />
                                Envoyer la demande
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default QuoteModal;
