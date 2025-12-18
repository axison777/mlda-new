import React, { useState } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    MapPin,
    Truck,
    Ship,
    Package,
    CheckCircle,
    AlertCircle,
    X,
    Bell
} from 'lucide-react';

const ActiveShipments = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    // Mock Data
    const shipments = [
        { id: 'TRK-9821', client: 'Jean Dupont', type: 'Véhicule', description: 'Toyota RAV4 2020', status: 'Douane', lastUpdate: '2023-10-25', location: 'Port d\'Abidjan' },
        { id: 'TRK-4432', client: 'SARL Transport', type: 'Conteneur', description: 'Conteneur 40ft - Pièces', status: 'En Mer', lastUpdate: '2023-10-28', location: 'Océan Atlantique' },
        { id: 'TRK-1129', client: 'Marie Koné', type: 'Colis', description: 'Effets Personnels', status: 'Douane', lastUpdate: '2023-10-26', location: 'Aéroport FHB' },
        { id: 'TRK-8873', client: 'Auto Import', type: 'Véhicule', description: 'Mercedes C300', status: 'En attente départ', lastUpdate: '2023-10-20', location: 'Entrepôt Anvers' },
        { id: 'TRK-3321', client: 'BTP Construction', type: 'Matériel', description: 'Grue Mobile', status: 'Livraison', lastUpdate: '2023-10-30', location: 'Route du Nord' },
        { id: 'TRK-5564', client: 'Koffi Paul', type: 'Véhicule', description: 'Hyundai Tucson', status: 'Livré', lastUpdate: '2023-10-15', location: 'Client' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'En Mer': return 'bg-blue-100 text-blue-800';
            case 'Douane': return 'bg-orange-100 text-orange-800';
            case 'Livraison': return 'bg-green-100 text-green-800';
            case 'Livré': return 'bg-gray-100 text-gray-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'En Mer': return Ship;
            case 'Douane': return AlertCircle;
            case 'Livraison': return Truck;
            case 'Livré': return CheckCircle;
            default: return Package;
        }
    };

    const handleOpenUpdate = (shipment) => {
        setSelectedShipment(shipment);
        setIsUpdateModalOpen(true);
    };

    const handleCloseUpdate = () => {
        setIsUpdateModalOpen(false);
        setSelectedShipment(null);
    };

    const filteredShipments = shipments.filter(shipment => {
        const matchesSearch = shipment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shipment.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = statusFilter === 'all' || shipment.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dossiers en Cours</h1>
                    <p className="text-gray-500">Gérez le suivi et les mises à jour des expéditions.</p>
                </div>
                <button className="bg-mdla-yellow text-mdla-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Nouveau Dossier
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Rechercher par ID, Client ou Description..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mdla-yellow/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                    {['all', 'En attente départ', 'En Mer', 'Douane', 'Livraison', 'Livré'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === status
                                    ? 'bg-mdla-black text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {status === 'all' ? 'Tous' : status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Tracking</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type & Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étape Actuelle</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière MAJ</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredShipments.map((shipment) => {
                                const StatusIcon = getStatusIcon(shipment.status);
                                return (
                                    <tr key={shipment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{shipment.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{shipment.client}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-medium">{shipment.description}</div>
                                            <div className="text-xs text-gray-500">{shipment.type}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs font-medium rounded-full ${getStatusColor(shipment.status)}`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {shipment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {shipment.lastUpdate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleOpenUpdate(shipment)}
                                                className="text-mdla-black bg-mdla-yellow hover:bg-yellow-400 px-3 py-1.5 rounded-lg font-bold transition-colors"
                                            >
                                                Mettre à jour
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Update Modal */}
            {isUpdateModalOpen && selectedShipment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Mise à jour Tracking</h3>
                            <button onClick={handleCloseUpdate} className="text-gray-400 hover:text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Current Status Info */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <div className="text-sm text-blue-600 font-medium mb-1">Dossier {selectedShipment.id}</div>
                                <div className="text-blue-900 font-bold">{selectedShipment.description}</div>
                                <div className="text-sm text-blue-700 mt-2 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Actuellement : {selectedShipment.location} ({selectedShipment.status})
                                </div>
                            </div>

                            {/* New Status Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nouvelle Étape</label>
                                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50 bg-white">
                                    <option>Départ Entrepôt</option>
                                    <option>Arrivée Port Départ</option>
                                    <option>Embarquement (Sur Navire)</option>
                                    <option>En Mer</option>
                                    <option>Arrivée Port Destination</option>
                                    <option>Arrivée Douane</option>
                                    <option>Dédouané / Sortie Port</option>
                                    <option>En Livraison</option>
                                    <option>Livré au Client</option>
                                </select>
                            </div>

                            {/* Details Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Détails / Commentaire (Optionnel)</label>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                    rows="3"
                                    placeholder="Ex: Navire MSC Lirica, Conteneur #4588..."
                                ></textarea>
                            </div>

                            {/* Notification Checkbox */}
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="notify"
                                    defaultChecked
                                    className="w-5 h-5 text-mdla-yellow rounded focus:ring-mdla-yellow border-gray-300"
                                />
                                <label htmlFor="notify" className="text-sm font-medium text-gray-700 flex items-center gap-2 cursor-pointer">
                                    <Bell className="w-4 h-4 text-gray-500" />
                                    Notifier le client (SMS & Email)
                                </label>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={handleCloseUpdate}
                                className="flex-1 px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleCloseUpdate}
                                className="flex-1 px-4 py-3 bg-mdla-yellow text-mdla-black font-bold hover:bg-yellow-400 rounded-lg shadow-sm"
                            >
                                Confirmer la MAJ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActiveShipments;
