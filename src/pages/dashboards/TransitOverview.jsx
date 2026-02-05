import React, { useMemo } from 'react';
import {
    Truck,
    Anchor,
    AlertTriangle,
    CheckCircle,
    Clock,
    ArrowRight,
    Package,
    Loader,
    PlusCircle,
    ShoppingBag,
    MessageSquare,
    TrendingUp
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { useOrders } from '../../context/OrdersContext';
import KPICard from '../../components/KPICard';
import { Link, useNavigate } from 'react-router-dom';

const TransitOverview = () => {
    const { orders, loading } = useOrders();
    const navigate = useNavigate();

    // Calculate real KPIs
    const kpiData = useMemo(() => {
        const logisticsOrders = orders.filter(o => ['vehicle', 'merchandise'].includes(o.type));
        return {
            pendingDeparture: logisticsOrders.filter(o => o.status === 'En attente départ').length,
            inTransit: logisticsOrders.filter(o => o.status === 'En Mer').length,
            customsBlocked: logisticsOrders.filter(o => o.status === 'Douane').length,
            delivered: logisticsOrders.filter(o => o.status === 'Livré').length,
            totalLogistics: logisticsOrders.length
        };
    }, [orders]);

    // Mock Data for Activity Chart (Dossiers crees par mois)
    const activityData = [
        { name: 'Jan', dossiers: 4 },
        { name: 'Fév', dossiers: 7 },
        { name: 'Mar', dossiers: 5 },
        { name: 'Avr', dossiers: 8 },
        { name: 'Mai', dossiers: 12 },
        { name: 'Juin', dossiers: 9 },
    ];

    // Identify urgent shipments
    const urgentShipments = useMemo(() => {
        return orders
            .filter(o => ['Douane', 'En attente départ'].includes(o.status))
            .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
            .slice(0, 5);
    }, [orders]);

    const QuickAction = ({ icon: Icon, label, path, color }) => (
        <Link
            to={path}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-mdla-yellow group"
        >
            <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-700">{label}</span>
        </Link>
    );

    if (loading && !orders.length) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader className="w-8 h-8 animate-spin text-mdla-yellow" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-outfit">Tableau de Bord Transit</h1>
                    <p className="text-gray-500">Gestion des pôles logistiques & sourcing.</p>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-600">Performance: <span className="text-green-600">+15%</span></span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickAction
                    icon={PlusCircle}
                    label="Nouveau Dossier"
                    path="/dashboard/transit-nouveau"
                    color="bg-mdla-black"
                />
                <QuickAction
                    icon={Package}
                    label="Suivi Expéditions"
                    path="/dashboard/transit-dossiers"
                    color="bg-blue-600"
                />
                <QuickAction
                    icon={ShoppingBag}
                    label="Sourcing / Devis"
                    path="/dashboard/transit-sourcing"
                    color="bg-orange-500"
                />
                <QuickAction
                    icon={MessageSquare}
                    label="Messagerie"
                    path="/dashboard/transit-messagerie"
                    color="bg-green-600"
                />
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="En attente départ"
                    value={kpiData.pendingDeparture}
                    icon={Clock}
                    color="blue"
                    subtitle="Dossiers à expédier"
                />
                <KPICard
                    title="En Mer / Transit"
                    value={kpiData.inTransit}
                    icon={Anchor}
                    color="purple"
                    subtitle="Suivi temps réel"
                />
                <KPICard
                    title="Bloqués Douane"
                    value={kpiData.customsBlocked}
                    icon={AlertTriangle}
                    color="red"
                    subtitle="Action urgente requise"
                />
                <KPICard
                    title="Dossiers Livrés"
                    value={kpiData.delivered}
                    icon={CheckCircle}
                    color="green"
                    subtitle="Total clôturés"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Activité Logistique</h2>
                        <select className="text-sm bg-gray-50 border-none rounded-lg px-2 py-1 outline-none text-gray-500">
                            <option>Derniers 6 mois</option>
                        </select>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f9fafb' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="dossiers" radius={[6, 6, 0, 0]} barSize={35}>
                                    {activityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === activityData.length - 1 ? '#FCD34D' : '#111827'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Urgent Tasks (Small Table style) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            Urgences
                        </h2>
                        <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-lg">
                            {urgentShipments.length} dossiers
                        </span>
                    </div>
                    <div className="space-y-4">
                        {urgentShipments.length > 0 ? urgentShipments.map((shipment) => (
                            <div
                                key={shipment.id}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group cursor-pointer"
                                onClick={() => navigate('/dashboard/transit-dossiers', { state: { openTrackingNumber: shipment.trackingNumber } })}
                            >
                                <div className={`p-2 rounded-lg ${shipment.status === 'Douane' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                    {shipment.type === 'vehicle' ? <Truck className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">{shipment.trackingNumber}</p>
                                    <p className="text-xs text-gray-500 truncate">{shipment.user?.name || 'Client'}</p>
                                </div>
                                <div className="p-2 text-gray-400 hover:text-mdla-yellow transition-colors">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        )) : (
                            <div className="py-8 text-center">
                                <CheckCircle className="w-10 h-10 text-green-200 mx-auto mb-2" />
                                <p className="text-sm text-gray-400">Tout est à jour !</p>
                            </div>
                        )}
                    </div>
                    <Link
                        to="/dashboard/transit-dossiers"
                        className="block w-full text-center mt-6 py-3 text-sm font-bold text-gray-600 hover:text-mdla-black transition-colors bg-gray-50 rounded-xl"
                    >
                        Voir tout le pôle
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TransitOverview;
