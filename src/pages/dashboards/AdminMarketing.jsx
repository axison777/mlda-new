import React, { useState } from 'react';
import {
    Megaphone,
    Plus,
    Search,
    Filter,
    Calendar,
    Image as ImageIcon,
    Link,
    MoreVertical,
    Trash2,
    Eye,
    BarChart2,
    X
} from 'lucide-react';

const AdminMarketing = () => {
    const [showAdModal, setShowAdModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        position: 'home_carousel',
        startDate: '',
        endDate: '',
        image: null
    });

    // Mock Data for Ads
    const ads = [
        { id: 1, name: 'Promo Rentrée', position: 'Accueil - Carrousel', url: '/formations', startDate: '2024-09-01', endDate: '2024-10-01', status: 'active', views: 1250, clicks: 450, image: 'https://via.placeholder.com/150' },
        { id: 2, name: 'Offre iPhone 15', position: 'Sidebar Boutique', url: '/boutique/iphone-15', startDate: '2024-03-01', endDate: '2024-03-31', status: 'active', views: 850, clicks: 120, image: 'https://via.placeholder.com/150' },
        { id: 3, name: 'Webinaire Import', position: 'Haut de page Cours', url: '/formations/webinaire', startDate: '2024-02-15', endDate: '2024-02-28', status: 'expired', views: 2100, clicks: 890, image: 'https://via.placeholder.com/150' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'scheduled': return 'bg-blue-100 text-blue-800';
            case 'expired': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Marketing & Publicités</h1>
                <button
                    onClick={() => setShowAdModal(true)}
                    className="bg-mdla-yellow hover:bg-yellow-400 text-mdla-black px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Nouvelle Campagne
                </button>
            </div>

            {/* Ads Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Campagnes Publicitaires</h2>
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
                                <th className="px-6 py-3">Visuel</th>
                                <th className="px-6 py-3">Campagne</th>
                                <th className="px-6 py-3">Position</th>
                                <th className="px-6 py-3">Période</th>
                                <th className="px-6 py-3">Performance</th>
                                <th className="px-6 py-3">Statut</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ads.map((ad) => (
                                <tr key={ad.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-10 bg-gray-100 rounded-lg overflow-hidden">
                                            <img src={ad.image} alt={ad.name} className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{ad.name}</div>
                                        <div className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                                            <Link className="w-3 h-3" /> {ad.url}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{ad.position}</td>
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
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-3 h-3 text-gray-400" />
                                                <span className="font-medium">{ad.views}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <BarChart2 className="w-3 h-3 text-gray-400" />
                                                <span className="font-medium">{ad.clicks}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`${getStatusColor(ad.status)} text-xs font-medium px-2.5 py-0.5 rounded-full capitalize`}>
                                            {ad.status === 'active' ? 'En cours' : ad.status === 'scheduled' ? 'Planifié' : 'Terminé'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Ad Modal */}
            {showAdModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Nouvelle Publicité</h3>
                            <button onClick={() => setShowAdModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la campagne</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                    placeholder="Ex: Promo Été"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image (Bannière)</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer">
                                    <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">Cliquez pour uploader une image</p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG jusqu'à 2MB</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL de destination</label>
                                <div className="relative">
                                    <Link className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        className="pl-9 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50">
                                    <option value="home_carousel">Accueil - Carrousel Principal</option>
                                    <option value="shop_sidebar">Boutique - Sidebar</option>
                                    <option value="courses_top">Formations - Haut de page</option>
                                    <option value="dashboard_banner">Dashboard - Bannière</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                    />
                                </div>
                            </div>

                            <button
                                className="w-full bg-mdla-yellow hover:bg-yellow-400 text-mdla-black font-bold py-3 rounded-lg transition-colors mt-4"
                                onClick={() => setShowAdModal(false)}
                            >
                                Lancer la campagne
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMarketing;
