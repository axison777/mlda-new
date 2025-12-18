import { useState } from 'react';
import { Package, Clock, CheckCircle, TrendingUp, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockShipments } from '../../data/mockShipments';
import { trackingSteps } from '../../data/mockOrders';
import UpdateTrackingModal from '../../components/UpdateTrackingModal';
import StatusBadge from '../../components/StatusBadge';

const TransitDashboard = () => {
    const { user } = useAuth();
    const [shipments, setShipments] = useState(mockShipments);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Calculate stats
    const stats = {
        totalShipments: shipments.length,
        inTransit: shipments.filter(s => s.currentStep === 'in_transit_sea' || s.currentStep === 'delivery').length,
        pending: shipments.filter(s => s.currentStep === 'ordered' || s.currentStep === 'customs').length,
        delivered: shipments.filter(s => s.currentStep === 'delivered').length
    };

    // Filter shipments
    const filteredShipments = shipments.filter(shipment => {
        const matchesSearch =
            shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shipment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shipment.vehicle.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'all' || shipment.currentStep === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const handleUpdateClick = (shipment) => {
        setSelectedShipment(shipment);
        setIsModalOpen(true);
    };

    const handleUpdateTracking = (updateData) => {
        // Update shipment in state
        setShipments(prevShipments =>
            prevShipments.map(s =>
                s.trackingNumber === updateData.trackingNumber
                    ? {
                        ...s,
                        currentStep: updateData.newStep,
                        lastUpdate: new Date().toISOString().split('T')[0],
                        comments: updateData.comment
                            ? [...s.comments, { date: new Date().toISOString().split('T')[0], text: updateData.comment }]
                            : s.comments
                    }
                    : s
            )
        );

        // Show success notification (you could use a toast library here)
        alert(`✅ Suivi mis à jour avec succès pour ${updateData.trackingNumber}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-mdla-yellow to-yellow-400 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-mdla-black mb-2">
                        Gestion des Expéditions
                    </h1>
                    <p className="text-mdla-black/80">
                        Bienvenue, {user?.name}
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Stats Overview */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Expéditions</p>
                                <p className="text-3xl font-bold text-mdla-black mt-1">{stats.totalShipments}</p>
                            </div>
                            <div className="w-12 h-12 bg-mdla-yellow rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-mdla-black" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">En Transit</p>
                                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.inTransit}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">En Attente</p>
                                <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Livrées</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">{stats.delivered}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shipments Table */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    {/* Table Header with Search and Filters */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-mdla-black">
                            Liste des Expéditions
                        </h2>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-mdla-yellow outline-none"
                                />
                            </div>

                            {/* Filter */}
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-mdla-yellow outline-none"
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="ordered">Commandé</option>
                                <option value="in_transit_sea">En Mer</option>
                                <option value="customs">À la Douane</option>
                                <option value="delivery">En Livraison</option>
                                <option value="delivered">Livré</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Client</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Véhicule</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Étape Actuelle</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Destination</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredShipments.map((shipment) => (
                                    <tr
                                        key={shipment.id}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <p className="font-mono text-sm font-semibold text-gray-900">
                                                {shipment.trackingNumber}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {shipment.lastUpdate}
                                            </p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="font-medium text-gray-900">{shipment.client}</p>
                                            <p className="text-xs text-gray-500">{shipment.clientPhone}</p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="font-medium text-gray-900">{shipment.vehicle}</p>
                                            <p className="text-xs text-gray-500">Année {shipment.vehicleYear}</p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <StatusBadge status={shipment.currentStep} type="tracking" />
                                            <p className="text-xs text-gray-500 mt-1">{shipment.currentLocation}</p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="text-sm text-gray-900">{shipment.destination}</p>
                                            <p className="text-xs text-gray-500">
                                                Livraison: {shipment.estimatedDelivery}
                                            </p>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <button
                                                onClick={() => handleUpdateClick(shipment)}
                                                className="bg-mdla-yellow text-mdla-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-colors"
                                            >
                                                Mettre à jour
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredShipments.length === 0 && (
                            <div className="text-center py-12">
                                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-600">Aucune expédition trouvée</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Update Tracking Modal */}
            <UpdateTrackingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                shipment={selectedShipment}
                onUpdate={handleUpdateTracking}
            />
        </div>
    );
};

export default TransitDashboard;
