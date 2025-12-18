import { Send, Phone, Mail, MapPin } from 'lucide-react';
import { useState } from 'react';

const QuotePage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        service: '',
        description: '',
        budget: '',
        urgency: 'normal',
        company: '',
        city: ''
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
        // TODO: Send to backend
        // Reset form
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            service: '',
            description: '',
            budget: '',
            urgency: 'normal',
            company: '',
            city: ''
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-mdla-yellow to-yellow-400 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-bold text-mdla-black mb-4">
                        Demande de Devis
                    </h1>
                    <p className="text-xl text-mdla-black/80 max-w-2xl mx-auto">
                        Obtenez un devis personnalisé pour votre projet. Réponse garantie sous 24h.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md p-8">
                            <h2 className="text-2xl font-bold text-mdla-black mb-6">
                                Informations du projet
                            </h2>

                            <form onSubmit={handleSubmit}>
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

                                    {/* Company */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Entreprise (optionnel)
                                        </label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all"
                                            placeholder="Nom de votre entreprise"
                                        />
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Ville
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all"
                                            placeholder="Ouagadougou"
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
                                            rows="6"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all resize-none"
                                            placeholder="Décrivez en détail votre projet, vos besoins, vos attentes..."
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="mt-8">
                                    <button
                                        type="submit"
                                        className="w-full bg-mdla-yellow text-mdla-black px-8 py-4 rounded-lg font-bold hover:bg-yellow-400 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                                    >
                                        <Send className="w-5 h-5" />
                                        Envoyer la demande de devis
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-mdla-black mb-6">
                                Pourquoi MDLA ?
                            </h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-mdla-yellow rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-mdla-black font-bold">✓</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-mdla-black">Réponse rapide</p>
                                        <p className="text-sm text-gray-600">Devis sous 24h maximum</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-mdla-yellow rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-mdla-black font-bold">✓</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-mdla-black">Prix compétitifs</p>
                                        <p className="text-sm text-gray-600">Meilleur rapport qualité/prix</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-mdla-yellow rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-mdla-black font-bold">✓</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-mdla-black">Expertise</p>
                                        <p className="text-sm text-gray-600">15 ans d'expérience</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-mdla-yellow rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-mdla-black font-bold">✓</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-mdla-black">Accompagnement</p>
                                        <p className="text-sm text-gray-600">Suivi personnalisé</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h4 className="font-bold text-mdla-black mb-4">Nous contacter</h4>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="w-5 h-5 text-mdla-yellow" />
                                        <div>
                                            <p className="text-gray-600">+226 25 36 29 52</p>
                                            <p className="text-gray-600">+226 70 26 64 64</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail className="w-5 h-5 text-mdla-yellow" />
                                        <p className="text-gray-600">contact@mdla.bf</p>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="w-5 h-5 text-mdla-yellow" />
                                        <p className="text-gray-600">Saaba, Ouagadougou</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuotePage;
