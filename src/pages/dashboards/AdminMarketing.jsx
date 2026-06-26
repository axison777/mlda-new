import React, { useState, useEffect } from 'react';
import {
    Megaphone,
    Plus,
    Search,
    Filter,
    Calendar,
    Image as ImageIcon,
    Link,
    Trash2,
    Eye,
    BarChart2,
    X,
    Loader2,
    Edit,
    CheckCircle,
    PauseCircle
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/ConfirmModal';

const AdminMarketing = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdModal, setShowAdModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    
    // Modal de confirmation
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
    
    const [formData, setFormData] = useState({
        id: null,
        title: '',
        description: '',
        promoPrice: '',
        url: '',
        placement: 'hero',
        startDate: '',
        endDate: '',
        eventDate: '',
        location: '',
        imageUrl: '',
        status: 'scheduled',
        buttonText: 'En savoir plus',
        isPermanent: false,
        displayOrder: 0
    });

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/campaigns');
            setCampaigns(data);
        } catch (error) {
            console.error('Erreur chargement campagnes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const uploadData = new FormData();
            uploadData.append('image', file);
            
            const { data } = await api.post('/upload/image', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setFormData({ ...formData, imageUrl: data.url });
        } catch (error) {
            console.error('Erreur upload:', error);
            toast.error('Erreur lors de l\'upload de l\'image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.title) {
            toast.error('Veuillez remplir les champs obligatoires (Titre).');
            return;
        }

        try {
            const payload = {
                ...formData,
                promoPrice: formData.promoPrice ? parseFloat(formData.promoPrice) : null,
                eventDate: formData.eventDate || null,
                startDate: formData.startDate || null,
                endDate: formData.isPermanent ? '2099-12-31' : (formData.endDate || null)
            };
            
            // On ne veut pas envoyer isPermanent à la base de données (ce n'est pas dans le schéma)
            delete payload.isPermanent;

            if (isEditing) {
                await api.put(`/campaigns/${formData.id}`, payload);
            } else {
                delete payload.id;
                await api.post('/campaigns', payload);
            }
            
            fetchCampaigns();
            setShowAdModal(false);
            resetForm();
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
            toast.error('Erreur lors de la sauvegarde de la campagne.');
        }
    };

    const handleDelete = (id) => {
        setDeleteConfirm({ show: true, id });
    };

    const executeDelete = async () => {
        try {
            await api.delete(`/campaigns/${deleteConfirm.id}`);
            toast.success('Campagne supprimée');
            fetchCampaigns();
        } catch (error) {
            console.error('Erreur suppression:', error);
            toast.error('Erreur lors de la suppression.');
        } finally {
            setDeleteConfirm({ show: false, id: null });
        }
    };

    const toggleStatus = async (campaign) => {
        const newStatus = campaign.status === 'active' ? 'paused' : 'active';
        try {
            await api.put(`/campaigns/${campaign.id}`, { status: newStatus });
            fetchCampaigns();
        } catch (error) {
            console.error('Erreur maj statut:', error);
        }
    };

    const openEditModal = (campaign) => {
        setFormData({
            id: campaign.id,
            title: campaign.title,
            description: campaign.description || '',
            promoPrice: campaign.promoPrice || '',
            url: campaign.url || '',
            placement: campaign.placement,
            startDate: new Date(campaign.startDate).toISOString().split('T')[0],
            endDate: new Date(campaign.endDate).toISOString().split('T')[0],
            eventDate: campaign.eventDate ? new Date(campaign.eventDate).toISOString().split('T')[0] : '',
            location: campaign.location || '',
            imageUrl: campaign.imageUrl || '',
            status: campaign.status,
            buttonText: campaign.buttonText || 'En savoir plus',
            isPermanent: new Date(campaign.endDate).getFullYear() >= 2098,
            displayOrder: campaign.displayOrder || 0
        });
        setIsEditing(true);
        setShowAdModal(true);
    };

    const resetForm = () => {
        setFormData({
            id: null,
            title: '',
            description: '',
            promoPrice: '',
            url: '',
            placement: 'hero',
            startDate: '',
            endDate: '',
            eventDate: '',
            location: '',
            imageUrl: '',
            status: 'scheduled',
            buttonText: 'En savoir plus',
            isPermanent: false,
            displayOrder: 0
        });
        setIsEditing(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'scheduled': return 'bg-blue-100 text-blue-800';
            case 'expired': return 'bg-gray-100 text-gray-800';
            case 'paused': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPlacementName = (placement) => {
        const map = {
            'hero': 'Bannière Principale (Hero)',
            'top_banner': 'Banderole Haut de site',
            'horizontal_middle': 'Encart Horizontal',
            'sidebar': 'Sidebar Verticale',
            'popup': 'Popup'
        };
        return map[placement] || placement;
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Megaphone className="w-6 h-6 text-mdla-yellow" /> Marketing & Publicités
                </h1>
                <button
                    onClick={() => { resetForm(); setShowAdModal(true); }}
                    className="bg-mdla-yellow hover:bg-yellow-400 text-mdla-black px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Nouvelle Campagne
                </button>
            </div>

            {/* Ads Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Toutes les campagnes</h2>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mdla-yellow/50"
                            />
                        </div>
                    </div>
                </div>
                
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Chargement...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Visuel</th>
                                    <th className="px-6 py-3">Campagne & Détails</th>
                                    <th className="px-6 py-3">Position</th>
                                    <th className="px-6 py-3">Ordre</th>
                                    <th className="px-6 py-3">Période</th>
                                    <th className="px-6 py-3">Performance</th>
                                    <th className="px-6 py-3">Statut</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campaigns.length === 0 ? (
                                    <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">Aucune campagne configurée.</td></tr>
                                ) : campaigns.map((ad) => (
                                    <tr key={ad.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="w-16 h-10 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                                {ad.imageUrl ? (
                                                    <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{ad.title}</div>
                                            {ad.promoPrice && (
                                                <div className="text-xs text-mdla-red font-bold">Prix Promo: {parseFloat(ad.promoPrice).toLocaleString()} F</div>
                                            )}
                                            {ad.url && (
                                                <div className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1 truncate max-w-xs">
                                                    <Link className="w-3 h-3" /> {ad.url}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">{getPlacementName(ad.placement)}</td>
                                        <td className="px-6 py-4 text-gray-600 font-medium text-center">{ad.displayOrder}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="w-3 h-3" />
                                                <span className="text-xs">
                                                    {new Date(ad.startDate).toLocaleDateString()} - {new Date(ad.endDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4 text-xs">
                                                <div className="flex items-center gap-1" title="Vues">
                                                    <Eye className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium">{ad.views}</span>
                                                </div>
                                                <div className="flex items-center gap-1" title="Clics">
                                                    <BarChart2 className="w-4 h-4 text-mdla-yellow" />
                                                    <span className="font-medium">{ad.clicks}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`${getStatusColor(ad.status)} text-xs font-bold px-2.5 py-1 rounded-full capitalize`}>
                                                {ad.status === 'active' ? 'En cours' : ad.status === 'scheduled' ? 'Planifié' : ad.status === 'paused' ? 'En pause' : 'Terminé'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <button 
                                                onClick={() => toggleStatus(ad)}
                                                className="text-gray-400 hover:text-blue-600 p-1"
                                                title={ad.status === 'active' ? 'Mettre en pause' : 'Activer'}
                                            >
                                                {ad.status === 'active' ? <PauseCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                            </button>
                                            <button onClick={() => openEditModal(ad)} className="text-gray-400 hover:text-mdla-yellow p-1">
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(ad.id)} className="text-gray-400 hover:text-red-600 p-1">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Campagne */}
            {showAdModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center z-50 overflow-y-auto py-8">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4">
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                            <h3 className="text-xl font-bold text-gray-900">{isEditing ? 'Modifier la Campagne' : 'Nouvelle Campagne'}</h3>
                            <button onClick={() => setShowAdModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            
                            <div className="grid grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la campagne *</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50 focus:border-mdla-yellow"
                                            placeholder="Ex: Promo Été, Webinaire Import/Export..."
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description courte</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            rows={3}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                            placeholder="Description pour la bannière ou l'encart..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Prix Promotionnel</label>
                                            <input
                                                type="number"
                                                value={formData.promoPrice}
                                                onChange={(e) => setFormData({...formData, promoPrice: e.target.value})}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                                placeholder="Ex: 50000"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Lieu (Si événement)</label>
                                            <input
                                                type="text"
                                                value={formData.location}
                                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                                placeholder="Ex: Siège MLDA"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">URL de destination</label>
                                        <div className="relative">
                                            <Link className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.url}
                                                onChange={(e) => setFormData({...formData, url: e.target.value})}
                                                className="pl-9 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                                placeholder="https://... ou /formations"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Texte du bouton</label>
                                            <input
                                                type="text"
                                                value={formData.buttonText}
                                                onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                                placeholder="Ex: S'inscrire"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d'affichage</label>
                                            <input
                                                type="number"
                                                value={formData.displayOrder}
                                                onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value) || 0})}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                                placeholder="Ex: 1, 2, 3..."
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Statut Initial</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                        >
                                            <option value="active">Actif</option>
                                            <option value="scheduled">Planifié</option>
                                            <option value="paused">En pause</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Emplacement</label>
                                        <select
                                            value={formData.placement}
                                            onChange={(e) => setFormData({...formData, placement: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50 font-medium"
                                        >
                                            <option value="hero">Bannière Principale (Hero - Accueil)</option>
                                            <option value="top_banner">Banderole Haut de site (Petit texte)</option>
                                            <option value="horizontal_middle">Encart Horizontal (Milieu de page)</option>
                                            <option value="sidebar">Sidebar Verticale (Boutique/Cours)</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Début (Diffusion)</label>
                                            <input
                                                type="date"
                                                value={formData.startDate}
                                                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-sm font-medium text-gray-700">Fin (Retrait)</label>
                                            </div>
                                            <input
                                                type="date"
                                                value={formData.isPermanent ? '2099-12-31' : formData.endDate}
                                                disabled={formData.isPermanent}
                                                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                                className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50 ${formData.isPermanent ? 'bg-gray-100 text-gray-400' : ''}`}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center mt-2">
                                        <input
                                            type="checkbox"
                                            id="isPermanent"
                                            checked={formData.isPermanent}
                                            onChange={(e) => setFormData({...formData, isPermanent: e.target.checked})}
                                            className="w-4 h-4 text-mdla-yellow border-gray-300 rounded focus:ring-mdla-yellow"
                                        />
                                        <label htmlFor="isPermanent" className="ml-2 text-sm text-gray-700 font-medium">
                                            Diffusion permanente (ne pas retirer automatiquement)
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date de l'événement (Optionnel)</label>
                                        <input
                                            type="date"
                                            value={formData.eventDate}
                                            onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Si la campagne promeut un événement à une date précise.</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Image (Visuel principal)</label>
                                        
                                        {formData.imageUrl ? (
                                            <div className="relative rounded-lg overflow-hidden border border-gray-200">
                                                <img src={formData.imageUrl} alt="Preview" className="w-full h-32 object-cover" />
                                                <button 
                                                    onClick={() => setFormData({...formData, imageUrl: ''})}
                                                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer">
                                                <input 
                                                    type="file" 
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    disabled={uploading}
                                                />
                                                {uploading ? (
                                                    <Loader2 className="w-8 h-8 mx-auto text-mdla-yellow animate-spin mb-2" />
                                                ) : (
                                                    <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                                )}
                                                <p className="text-sm font-medium text-gray-600">
                                                    {uploading ? 'Upload en cours...' : 'Cliquez ou glissez une image'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => setShowAdModal(false)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-lg transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 bg-mdla-yellow hover:bg-yellow-400 text-mdla-black font-bold py-3 rounded-lg transition-colors"
                                >
                                    {isEditing ? 'Mettre à jour la campagne' : 'Lancer la campagne'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal 
                isOpen={deleteConfirm.show}
                onClose={() => setDeleteConfirm({ show: false, id: null })}
                onConfirm={executeDelete}
                message="Êtes-vous sûr de vouloir supprimer cette campagne ? Cette action est irréversible."
            />
        </div>
    );
};

export default AdminMarketing;
