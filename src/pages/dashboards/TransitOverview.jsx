import React from 'react';
import {
    Truck,
    Anchor,
    AlertTriangle,
    CheckCircle,
    Clock,
    ArrowRight,
    Package
} from 'lucide-react';

const TransitOverview = () => {
    // Mock Data for KPIs
    const kpiData = {
        pendingDeparture: 12,
        inTransit: 8,
        customsBlocked: 3,
        delivered: 45
    };

    // Mock Data for Urgencies
    const urgentShipments = [
        { id: 'TRK-9821', client: 'Jean Dupont', item: 'Toyota RAV4', status: 'Douane', daysStuck: 12, location: 'Port d\'Abidjan' },
        { id: 'TRK-4432', client: 'SARL Transport', item: 'Conteneur 40ft', status: 'En attente départ', daysStuck: 15, location: 'Entrepôt Munich' },
        { id: 'TRK-1129', client: 'Marie Koné', item: 'Colis Personnel', status: 'Douane', daysStuck: 11, location: 'Aéroport' },
        { id: 'TRK-8873', client: 'Auto Import', item: 'Mercedes C300', status: 'En attente départ', daysStuck: 18, location: 'Entrepôt Anvers' },
        { id: 'TRK-3321', client: 'BTP Construction', item: 'Matériel Lourd', status: 'Douane', daysStuck: 14, location: 'Port de Lomé' },
    ];

    const KPICard = ({ title, value, icon: Icon, color, subtext }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{value}</span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Vue d'ensemble Transit</h1>
                <p className="text-gray-500">Suivi de l'activité logistique et des alertes.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="En attente de départ"
                    value={kpiData.pendingDeparture}
                    icon={Clock}
                    color="bg-blue-500"
                    subtext="Allemagne & Belgique"
                />
                <KPICard
                    title="En Mer / Transit"
                    value={kpiData.inTransit}
                    icon={Anchor}
                    color="bg-indigo-500"
                    subtext="Navires en cours"
                />
                <KPICard
                    title="Bloqués Douane"
                    value={kpiData.customsBlocked}
                    icon={AlertTriangle}
                    color="bg-red-500"
                    subtext="Action requise > 48h"
                />
                <KPICard
                    title="Livrés ce mois"
                    value={kpiData.delivered}
                    icon={CheckCircle}
                    color="bg-green-500"
                    subtext="+12% vs mois dernier"
                />
            </div>

            {/* Urgent Tasks Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        Dossiers Urgents (&gt; 10 jours sans mouvement)
                    </h2>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                        Voir tout <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marchandise</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut Actuel</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jours Bloqué</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localisation</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {urgentShipments.map((shipment) => (
                                <tr key={shipment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{shipment.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{shipment.client}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 flex items-center gap-2">
                                        <Package className="w-4 h-4 text-gray-400" />
                                        {shipment.item}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${shipment.status === 'Douane' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {shipment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-red-600 font-bold">{shipment.daysStuck} jours</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{shipment.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button className="text-blue-600 hover:text-blue-900 font-medium text-sm">
                                            Gérer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TransitOverview;
