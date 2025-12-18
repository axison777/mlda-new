import React, { useState } from 'react';
import {
    Users,
    UserPlus,
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
    Shield,
    Mail,
    Phone,
    X,
    CheckCircle,
    Ban
} from 'lucide-react';

const AdminUsers = () => {
    const [activeTab, setActiveTab] = useState('clients');
    const [showUserModal, setShowUserModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'student',
        password: ''
    });

    // Mock Data
    const clients = [
        { id: 1, name: 'Moussa Diop', email: 'moussa@test.com', phone: '+221 77 000 00 00', role: 'student', status: 'active', joinDate: '2024-01-15' },
        { id: 2, name: 'Fatou Sow', email: 'fatou@test.com', phone: '+221 77 111 11 11', role: 'client', status: 'active', joinDate: '2024-02-01' },
        { id: 3, name: 'Jean Michel', email: 'jean@test.com', phone: '+33 6 00 00 00 00', role: 'client', status: 'blocked', joinDate: '2024-03-10' },
    ];

    const staff = [
        { id: 1, name: 'Admin Principal', email: 'admin@mdla.com', phone: '-', role: 'admin', status: 'active', joinDate: '2023-01-01' },
        { id: 2, name: 'Professeur A', email: 'prof.a@mdla.com', phone: '+221 77 222 22 22', role: 'prof', status: 'active', joinDate: '2023-06-15' },
        { id: 3, name: 'Agent Transit', email: 'transit@mdla.com', phone: '+221 77 333 33 33', role: 'transit', status: 'active', joinDate: '2023-09-01' },
    ];

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-800';
            case 'prof': return 'bg-blue-100 text-blue-800';
            case 'transit': return 'bg-orange-100 text-orange-800';
            case 'student': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setFormData({ ...user, password: '' });
            setIsEditing(true);
        } else {
            setFormData({ name: '', email: '', phone: '', role: 'student', password: '' });
            setIsEditing(false);
        }
        setShowUserModal(true);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Utilisateurs & Staff</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-mdla-yellow hover:bg-yellow-400 text-mdla-black px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
                >
                    <UserPlus className="w-5 h-5" />
                    Nouvel Utilisateur
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('clients')}
                    className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'clients' ? 'border-mdla-yellow text-mdla-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Clients & Étudiants
                </button>
                <button
                    onClick={() => setActiveTab('staff')}
                    className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'staff' ? 'border-mdla-yellow text-mdla-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Staff & Équipe
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Liste des {activeTab === 'clients' ? 'Clients' : 'Membres du Staff'}
                    </h2>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mdla-yellow/50"
                            />
                        </div>
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <Filter className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Utilisateur</th>
                                <th className="px-6 py-3">Contact</th>
                                <th className="px-6 py-3">Rôle</th>
                                <th className="px-6 py-3">Statut</th>
                                <th className="px-6 py-3">Date d'inscription</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(activeTab === 'clients' ? clients : staff).map((user) => (
                                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                <div className="text-xs text-gray-500">ID: #{user.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Mail className="w-3 h-3" /> {user.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Phone className="w-3 h-3" /> {user.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`${getRoleBadge(user.role)} text-xs font-medium px-2.5 py-0.5 rounded-full capitalize`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.status === 'active' ? (
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit">
                                                <CheckCircle className="w-3 h-3" /> Actif
                                            </span>
                                        ) : (
                                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit">
                                                <Ban className="w-3 h-3" /> Bloqué
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{user.joinDate}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(user)}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Modal */}
            {showUserModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {isEditing ? 'Modifier Utilisateur' : 'Nouvel Utilisateur'}
                            </h3>
                            <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                >
                                    <option value="student">Étudiant</option>
                                    <option value="client">Client</option>
                                    <option value="prof">Professeur</option>
                                    <option value="transit">Responsable Transit</option>
                                    <option value="admin">Administrateur</option>
                                </select>
                            </div>

                            {!isEditing && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                    />
                                </div>
                            )}

                            <button
                                className="w-full bg-mdla-yellow hover:bg-yellow-400 text-mdla-black font-bold py-3 rounded-lg transition-colors mt-4"
                                onClick={() => setShowUserModal(false)}
                            >
                                {isEditing ? 'Enregistrer les modifications' : 'Créer l\'utilisateur'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
