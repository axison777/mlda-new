import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Key, Save, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    // Mock form state
    const [formData, setFormData] = useState({
        name: user?.name || 'Utilisateur Test',
        email: user?.email || 'test@example.com',
        phone: '+228 90 00 00 00',
        address: 'Lomé, Togo',
        bio: 'Passionné de mécanique et de langues.'
    });

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>

            {/* Profile Header */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=300" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <button className="absolute bottom-0 right-0 bg-mdla-yellow p-2 rounded-full text-mdla-black hover:bg-yellow-400 transition-colors shadow">
                        <Camera className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-center md:text-left flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{formData.name}</h2>
                    <p className="text-gray-500 mb-4">{user?.role ? user.role.toUpperCase() : 'MEMBRE'}</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">Client Premium</span>
                        <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-bold">Étudiant A2</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-6 py-2 rounded-lg font-bold transition-all ${isEditing ? 'bg-gray-100 text-gray-600' : 'bg-mdla-black text-white hover:bg-gray-800'}`}
                >
                    {isEditing ? 'Annuler' : 'Modifier'}
                </button>
            </div>

            {/* Personal Info Form */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6 border-b pb-4">
                    <User className="w-6 h-6 text-mdla-yellow" />
                    <h3 className="text-lg font-bold text-gray-900">Informations Personnelles</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom Complet</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                value={formData.name}
                                disabled={!isEditing}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${isEditing ? 'bg-white border-gray-300 focus:ring-2 focus:ring-mdla-yellow/50' : 'bg-gray-50 border-transparent'}`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="email"
                                value={formData.email}
                                disabled={true} // Email usually uneditable
                                className="w-full pl-10 pr-4 py-2 border border-transparent bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="tel"
                                value={formData.phone}
                                disabled={!isEditing}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${isEditing ? 'bg-white border-gray-300 focus:ring-2 focus:ring-mdla-yellow/50' : 'bg-gray-50 border-transparent'}`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                value={formData.address}
                                disabled={!isEditing}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${isEditing ? 'bg-white border-gray-300 focus:ring-2 focus:ring-mdla-yellow/50' : 'bg-gray-50 border-transparent'}`}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                            value={formData.bio}
                            disabled={!isEditing}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className={`w-full p-4 border rounded-lg h-24 ${isEditing ? 'bg-white border-gray-300 focus:ring-2 focus:ring-mdla-yellow/50' : 'bg-gray-50 border-transparent'}`}
                        />
                    </div>
                </div>

                {isEditing && (
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="bg-mdla-yellow text-mdla-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors shadow-lg"
                        >
                            <Save className="w-5 h-5" />
                            Enregistrer les modifications
                        </button>
                    </div>
                )}
            </div>

            {/* Security Section (Read Only Mock) */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 opacity-80">
                <div className="flex items-center gap-3 mb-6 border-b pb-4">
                    <Key className="w-6 h-6 text-gray-600" />
                    <h3 className="text-lg font-bold text-gray-900">Sécurité</h3>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-medium text-gray-900">Mot de passe</p>
                        <p className="text-sm text-gray-500">Dernière modification il y a 3 mois</p>
                    </div>
                    <button className="text-blue-600 font-bold text-sm hover:underline">Modifier</button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
