import { useState } from 'react';
import { MapPin, Phone, Clock, Mail, Facebook, Instagram, Send } from 'lucide-react';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: 'Formation',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement form submission logic
        console.log('Form submitted:', formData);
        alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-mdla-yellow to-yellow-400 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-mdla-black mb-6">
                        Contactez-nous
                    </h1>
                    <p className="text-xl text-mdla-black/80 max-w-3xl mx-auto">
                        Nous sommes là pour répondre à toutes vos questions
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Information */}
                        <div>
                            <h2 className="text-3xl font-bold text-mdla-black mb-8">
                                Nos Coordonnées
                            </h2>

                            <div className="space-y-6">
                                {/* Address */}
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-mdla-yellow rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-mdla-black" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-mdla-black mb-2">Adresse</h3>
                                        <p className="text-gray-600">
                                            Burkina Faso, Ouagadougou<br />
                                            Commune de Saaba (non loin de l'USTA)
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-mdla-yellow rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6 text-mdla-black" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-mdla-black mb-2">Téléphones</h3>
                                        <p className="text-gray-600">
                                            <a href="tel:+22650194949" className="hover:text-mdla-yellow transition-colors">
                                                +226 50 19 49 49
                                            </a>
                                            <br />
                                            <a href="tel:+491799281957" className="hover:text-mdla-yellow transition-colors">
                                                +49 179 928 1957
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-mdla-yellow rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-6 h-6 text-mdla-black" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-mdla-black mb-2">Horaires</h3>
                                        <p className="text-gray-600">
                                            Lundi - Vendredi : 08H - 16H<br />
                                            Samedi : 09H - 15H
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-mdla-yellow rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-mdla-black" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-mdla-black mb-2">Email</h3>
                                        <p className="text-gray-600">
                                            <a href="mailto:contact@mdla.bf" className="hover:text-mdla-yellow transition-colors">
                                                contact@mdla.bf
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <h3 className="font-bold text-mdla-black mb-4">Suivez-nous</h3>
                                <div className="flex gap-4">
                                    <a
                                        href="https://facebook.com/mdla"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 bg-mdla-black hover:bg-mdla-yellow rounded-lg flex items-center justify-center transition-all group"
                                    >
                                        <Facebook className="w-6 h-6 text-white group-hover:text-mdla-black transition-colors" />
                                    </a>
                                    <a
                                        href="https://instagram.com/mdla"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 bg-mdla-black hover:bg-mdla-yellow rounded-lg flex items-center justify-center transition-all group"
                                    >
                                        <Instagram className="w-6 h-6 text-white group-hover:text-mdla-black transition-colors" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-gray-50 rounded-xl p-8">
                            <h2 className="text-2xl font-bold text-mdla-black mb-6">
                                Envoyez-nous un message
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nom complet *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all"
                                        placeholder="Votre nom"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all"
                                        placeholder="votre@email.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all"
                                        placeholder="+226 XX XX XX XX"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Sujet *
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all bg-white"
                                    >
                                        <option value="Formation">Formation</option>
                                        <option value="Import Auto">Import Auto</option>
                                        <option value="Traduction">Traduction</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="5"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Décrivez votre demande..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-mdla-yellow text-mdla-black px-6 py-4 rounded-lg font-bold hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    Envoyer le message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-mdla-black mb-8 text-center">
                        Notre Localisation
                    </h2>
                    <div className="rounded-xl overflow-hidden shadow-lg">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31078.89844!2d-1.4929!3d12.3714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xe2ebe2c7e1c5c5d%3A0x7c8b8c8b8c8b8c8b!2sSaaba%2C%20Ouagadougou%2C%20Burkina%20Faso!5e0!3m2!1sen!2s!4v1234567890"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="MDLA Location"
                        ></iframe>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
