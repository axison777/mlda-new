import React, { useState } from 'react';
import {
    Package,
    Truck,
    MapPin,
    Plus,
    Search,
    Filter,
    MoreVertical,
    CheckCircle,
    Clock,
    Ship,
    Plane,
    FileText,
    X
} from 'lucide-react';

const AdminLogistics = () => {
    const [showTrackingModal, setShowTrackingModal] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(null);

    // Mock Data for Folders
    const folders = [
        { id: 'IMP-2024-001', client: 'Moussa Diop', type: 'Véhicule', description: 'Toyota Rav4 2020', stage: 'Transit Maritime', status: 'active', date: '2024-03-01' },
        { id: 'IMP-2024-002', client: 'Fatou Sow', type: 'Marchandise', description: 'Conteneur 20ft - Textiles', stage: 'Dédouanement', status: 'warning', date: '2024-02-28' },
        { id: 'EXP-2024-003', client: 'Jean Michel', type: 'Marchandise', description: 'Produits Artisanaux', stage: 'Entrepôt Départ', status: 'active', date: '2024-03-10' },
        { id: 'IMP-2024-004', client: 'Saliou Ndiaye', type: 'Véhicule', description: 'Peugeot 3008', stage: 'Livré', status: 'completed', date: '2024-02-15' },
    ];

    // Mock Tracking Steps
    const trackingSteps = [
        { id: 1, label: 'Réception Entrepôt', date: '2024-03-01', completed: true },
        { id: 2, label: 'Chargement Conteneur', date: '2024-03-03', completed: true },
        { id: 3, label: 'Départ Navire', date: '2024-03-05', completed: true },
        { id: 4, label: 'Arrivée Port Dakar', date: '2024-03-20', completed: false },
        { id: 5, label: 'Dédouanement', date: '-', completed: false },
        { id: 6, label: 'Livraison Client', date: '-', completed: false },
    ];

    const handleOpenTracking = (folder) => {
        setSelectedFolder(folder);
        setShowTrackingModal(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-blue-100 text-blue-800';
            case 'warning': return 'bg-orange-100 text-orange-800';
            case 'completed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeIcon = (type) => {
        return type === 'Véhicule' ? <Truck className="w-4 h-4" /> : <Package className="w-4 h-4" />;
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Pôle Logistique</h1>
                <button className="bg-mdla-yellow hover:bg-yellow-400 text-mdla-black px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Nouveau Dossier
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <Ship className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">En Transit</p>
                        <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                        <FileText className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">En Dédouanement</p>
                        <p className="text-2xl font-bold text-gray-900">5</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Livrés ce mois</p>
                        <p className="text-2xl font-bold text-gray-900">28</p>
                    </div>
                </div>
            </div>

            {/* Folders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Dossiers Import/Export</h2>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un dossier..."
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
                                <th className="px-6 py-3">ID Dossier</th>
                                <th className="px-6 py-3">Client</th>
                                <th className="px-6 py-3">Type & Description</th>
                                <th className="px-6 py-3">Étape Actuelle</th>
                                <th className="px-6 py-3">Statut</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {folders.map((folder) => (
                                <tr key={folder.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{folder.id}</td>
                                    <td className="px-6 py-4">{folder.client}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(folder.type)}
                                            <span className="text-gray-600">{folder.description}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            {folder.stage}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`${getStatusColor(folder.status)} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                                            {folder.status === 'active' ? 'En cours' : folder.status === 'warning' ? 'Attention' : 'Terminé'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleOpenTracking(folder)}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-3"
                                        >
                                            Tracking
                                        </button>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tracking Modal */}
            {showTrackingModal && selectedFolder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Suivi Dossier {selectedFolder.id}</h3>
                                <p className="text-sm text-gray-500">{selectedFolder.description} - {selectedFolder.client}</p>
                            </div>
                            <button onClick={() => setShowTrackingModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="relative pl-8 border-l-2 border-gray-200 space-y-8 my-6">
                            {trackingSteps.map((step, index) => (
                                <div key={step.id} className="relative">
                                    <div className={`absolute -left-[41px] w-5 h-5 rounded-full border-4 ${step.completed ? 'bg-green-500 border-green-100' : 'bg-gray-300 border-gray-100'}`}></div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className={`font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>{step.label}</h4>
                                            <p className="text-sm text-gray-500">{step.date}</p>
                                        </div>
                                        {step.completed ? (
                                            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                                                <CheckCircle className="w-4 h-4" /> Complété
                                            </span>
                                        ) : (
                                            <button className="text-sm text-blue-600 hover:underline font-medium">
                                                Marquer comme fait
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                            <button
                                onClick={() => setShowTrackingModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                            >
                                Fermer
                            </button>
                            <button className="px-4 py-2 bg-mdla-yellow hover:bg-yellow-400 text-mdla-black rounded-lg font-bold">
                                Mettre à jour
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLogistics;
