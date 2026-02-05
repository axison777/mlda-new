import React, { useState, useEffect } from 'react';
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
    Ban,
    Loader,
    AlertTriangle,
    Eye,
    Calendar,
    MapPin,
    ArrowRight,
    Package,
    Truck,
    Clock
} from 'lucide-react';
import api from '../../utils/api';

const AdminUsers = () => {
    const [activeTab, setActiveTab] = useState('clients');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'student',
        status: 'active',
        password: ''
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/users');
            setUsers(data);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des utilisateurs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const clients = users.filter(u => ['client', 'student'].includes(u.role));
    const staff = users.filter(u => ['admin', 'prof', 'transit'].includes(u.role));

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
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                role: user.role || 'student',
                status: user.status || 'active',
                password: ''
            });
            setSelectedUserId(user.id);
            setIsEditing(true);
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                role: 'student',
                status: 'active',
                password: ''
            });
            setSelectedUserId(null);
            setIsEditing(false);
        }
        setShowUserModal(true);
    };

    const handleViewDetails = async (userId) => {
        try {
            setDetailsLoading(true);
            setShowDetailsModal(true);
            const { data } = await api.get(`/users/${userId}`);
            setSelectedUser(data);
        } catch (err) {
            console.error(err);
            alert('Erreur lors du chargement des détails');
            setShowDetailsModal(false);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/users/${selectedUserId}`, formData);
            } else {
                await api.post('/users', formData);
            }
            setShowUserModal(false);
            fetchUsers();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Une erreur est survenue');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
        try {
            await api.delete(`/users/${id}`);
            fetchUsers();
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la suppression');
        }
    };

    const handleToggleStatus = async (user) => {
        const newStatus = user.status === 'active' ? 'blocked' : 'active';
        try {
            await api.put(`/users/${user.id}`, { status: newStatus });
            fetchUsers();
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la modification du statut');
        }
    };

    if (loading && !users.length) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader className="w-8 h-8 animate-spin text-mdla-yellow" />
            </div>
        );
    }

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

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('clients')}
                    className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'clients' ? 'border-mdla-yellow text-mdla-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Clients & Étudiants ({clients.length})
                </button>
                <button
                    onClick={() => setActiveTab('staff')}
                    className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'staff' ? 'border-mdla-yellow text-mdla-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Staff & Équipe ({staff.length})
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
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(activeTab === 'clients' ? clients : staff).map((user) => (
                                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold overflow-hidden">
                                                {user.name ? user.name.charAt(0) : '?'}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                <div className="text-xs text-gray-500">Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Mail className="w-3 h-3" /> {user.email}
                                            </div>
                                            {user.phone && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Phone className="w-3 h-3" /> {user.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`${getRoleBadge(user.role)} text-xs font-medium px-2.5 py-0.5 rounded-full capitalize`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleStatus(user)}
                                            className={`${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit hover:opacity-80 transition-opacity`}
                                        >
                                            {user.status === 'active' ? (
                                                <><CheckCircle className="w-3 h-3" /> Actif</>
                                            ) : (
                                                <><Ban className="w-3 h-3" /> Bloqué</>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleViewDetails(user.id)}
                                                className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal(user)}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            >
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

            {/* User Modal (Create/Edit) */}
            {showUserModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-900">
                                {isEditing ? 'Modifier Utilisateur' : 'Nouvel Utilisateur'}
                            </h3>
                            <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50 focus:outline-none transition-all"
                                    placeholder="Ex: Moussa Diop"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50 focus:outline-none transition-all"
                                    placeholder="email@exemple.com"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50 focus:outline-none transition-all"
                                        placeholder="+221 ..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50 focus:outline-none transition-all bg-white"
                                    >
                                        <option value="student">Étudiant</option>
                                        <option value="client">Client</option>
                                        <option value="prof">Professeur</option>
                                        <option value="transit">Responsable Transit</option>
                                        <option value="admin">Administrateur</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe {isEditing && <span className="text-xs text-gray-400 normal-case">(Laissez vide pour ne pas changer)</span>}</label>
                                <input
                                    type="password"
                                    required={!isEditing}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50 focus:outline-none transition-all"
                                    placeholder={isEditing ? '••••••••' : 'Mot de passe sécurisé'}
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowUserModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-mdla-yellow hover:bg-yellow-400 text-mdla-black font-bold py-2 rounded-lg transition-colors shadow-sm"
                                >
                                    {isEditing ? 'Mettre à jour' : 'Créer l\'utilisateur'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {showDetailsModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-[100] transition-all">
                    <div className="bg-gray-50 w-full max-w-2xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                <Users className="w-6 h-6 text-mdla-yellow" />
                                Détails de l'utilisateur
                            </h3>
                            <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {detailsLoading ? (
                                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                    <Loader className="w-10 h-10 animate-spin text-mdla-yellow" />
                                    <p className="text-gray-500 font-medium">Chargement des données...</p>
                                </div>
                            ) : selectedUser ? (
                                <>
                                    {/* Profile Header */}
                                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
                                        <div className="w-32 h-32 rounded-full bg-mdla-yellow flex items-center justify-center text-4xl font-black text-mdla-black shadow-inner">
                                            {selectedUser.name?.charAt(0)}
                                        </div>
                                        <div className="flex-1 text-center md:text-left space-y-4">
                                            <div>
                                                <h4 className="text-3xl font-black text-gray-900">{selectedUser.name}</h4>
                                                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                                                    <span className={`${getRoleBadge(selectedUser.role)} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider`}>
                                                        {selectedUser.role}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${selectedUser.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {selectedUser.status === 'active' ? 'Compte Actif' : 'Compte Bloqué'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-2xl">
                                                    <Mail className="w-5 h-5 text-mdla-yellow" />
                                                    <span className="text-sm font-medium truncate">{selectedUser.email}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-2xl">
                                                    <Phone className="w-5 h-5 text-mdla-yellow" />
                                                    <span className="text-sm font-medium">{selectedUser.phone || 'Non renseigné'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Info Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center space-y-2">
                                            <Calendar className="w-8 h-8 mx-auto text-blue-500" />
                                            <p className="text-xs text-gray-400 font-bold uppercase">Membre depuis</p>
                                            <p className="text-lg font-black text-gray-900">{new Date(selectedUser.createdAt).toLocaleDateString('fr-FR')}</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center space-y-2">
                                            <Package className="w-8 h-8 mx-auto text-orange-500" />
                                            <p className="text-xs text-gray-400 font-bold uppercase">Dossiers</p>
                                            <p className="text-lg font-black text-gray-900">{selectedUser.orders?.length || 0}</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center space-y-2">
                                            <MapPin className="w-8 h-8 mx-auto text-green-500" />
                                            <p className="text-xs text-gray-400 font-bold uppercase">Localisation</p>
                                            <p className="text-lg font-black text-gray-900">{selectedUser.address || 'Inconnue'}</p>
                                        </div>
                                    </div>

                                    {/* Related Content (Orders/History) */}
                                    <div className="space-y-4">
                                        <h5 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-mdla-yellow" />
                                            Dernières activités
                                        </h5>
                                        {['client', 'student'].includes(selectedUser.role) ? (
                                            <div className="space-y-4">
                                                {selectedUser.orders && selectedUser.orders.length > 0 ? (
                                                    selectedUser.orders.map(order => (
                                                        <div key={order.id} className="bg-white p-5 rounded-2xl border border-gray-200 flex justify-between items-center hover:border-mdla-yellow transition-all group">
                                                            <div className="flex items-center gap-4">
                                                                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-yellow-50 transition-colors">
                                                                    {order.type === 'vehicle' ? <Truck className="w-6 h-6 text-blue-600" /> : <Package className="w-6 h-6 text-orange-600" />}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-gray-900">{order.trackingNumber}</p>
                                                                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-black text-sm text-gray-900">{parseFloat(order.totalAmount).toLocaleString()} FCFA</p>
                                                                <span className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-1 rounded text-gray-600">
                                                                    {order.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="bg-white p-12 text-center rounded-3xl border-2 border-dashed border-gray-200 space-y-3">
                                                        <Package className="w-12 h-12 mx-auto text-gray-200" />
                                                        <p className="text-gray-400 font-medium">Aucun dossier trouvé pour cet utilisateur.</p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="bg-white p-12 text-center rounded-3xl border-2 border-dashed border-gray-200 space-y-3">
                                                <Shield className="w-12 h-12 mx-auto text-gray-200" />
                                                <p className="text-gray-400 font-medium">Activités du staff (prochainement disponible)</p>
                                                <p className="text-xs text-gray-300">Historique des actions, messages envoyés, etc.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4 pt-6">
                                        <button
                                            onClick={() => {
                                                setShowDetailsModal(false);
                                                handleOpenModal(selectedUser);
                                            }}
                                            className="grow bg-mdla-black text-white py-4 rounded-2xl font-black hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                            Modifier le profil
                                        </button>
                                        <button
                                            onClick={() => handleToggleStatus(selectedUser)}
                                            className={`grow py-4 rounded-2xl font-black border-2 transition-all flex items-center justify-center gap-2 ${selectedUser.status === 'active' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                                        >
                                            {selectedUser.status === 'active' ? <Ban className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                            {selectedUser.status === 'active' ? 'Bloquer le compte' : 'Débloquer le compte'}
                                        </button>
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
