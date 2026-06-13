import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, Shield, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const UserProfile = () => {
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleProfileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg('');
        setErrorMsg('');

        try {
            const result = await updateProfile(formData);
            if (result.success) {
                setSuccessMsg('Profil mis à jour avec succès.');
            } else {
                setErrorMsg(result.error || 'Erreur lors de la mise à jour du profil.');
            }
        } catch (error) {
            setErrorMsg('Une erreur inattendue est survenue.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setErrorMsg('Les nouveaux mots de passe ne correspondent pas.');
            return;
        }

        setLoading(true);
        setSuccessMsg('');
        setErrorMsg('');

        try {
            await api.put(`/users/${user.id}/password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setSuccessMsg('Mot de passe modifié avec succès.');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Erreur lors de la modification du mot de passe.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-black text-gray-900 font-outfit uppercase tracking-tight">Mon Profil</h1>
                <p className="text-gray-500 font-medium">Gérez vos informations personnelles et vos paramètres de sécurité.</p>
            </div>

            {successMsg && (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl font-bold border border-green-100 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    {successMsg}
                </div>
            )}
            
            {errorMsg && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl font-bold border border-red-100">
                    {errorMsg}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {/* Profile Information */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-mdla-yellow" />
                        Informations Personnelles
                    </h2>
                    
                    <form onSubmit={handleProfileSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nom Complet</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleProfileChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-mdla-yellow font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl border-none text-gray-500 font-medium cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié.</p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Téléphone</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type="text" 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleProfileChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-mdla-yellow font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Adresse</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type="text" 
                                    name="address"
                                    value={formData.address}
                                    onChange={handleProfileChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-mdla-yellow font-medium"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-mdla-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 mt-4"
                        >
                            <Save className="w-5 h-5" />
                            Sauvegarder le profil
                        </button>
                    </form>
                </div>

                {/* Password Change */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                        <Key className="w-5 h-5 text-mdla-yellow" />
                        Sécurité
                    </h2>
                    
                    <form onSubmit={handlePasswordSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Mot de passe actuel</label>
                            <input 
                                type="password" 
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-mdla-yellow font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nouveau mot de passe</label>
                            <input 
                                type="password" 
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                                minLength="6"
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-mdla-yellow font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Confirmer le nouveau mot de passe</label>
                            <input 
                                type="password" 
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                                minLength="6"
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-mdla-yellow font-medium"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors mt-4"
                        >
                            Mettre à jour le mot de passe
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
