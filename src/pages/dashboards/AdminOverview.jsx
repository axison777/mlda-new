import React from 'react';
import {
    DollarSign,
    Users,
    ShoppingCart,
    AlertTriangle,
    TrendingUp,
    Clock,
    CheckCircle,
    Truck
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import KPICard from '../../components/KPICard';

const AdminOverview = () => {
    // Mock Data for KPIs
    const kpiData = {
        revenue: 45780000,
        orders: 12,
        activeStudents: 247,
        alerts: 5
    };

    // Mock Data for Chart
    const revenueData = [
        { name: 'Jan', ca: 2500000 },
        { name: 'Fév', ca: 3200000 },
        { name: 'Mar', ca: 4100000 },
        { name: 'Avr', ca: 3800000 },
        { name: 'Mai', ca: 5200000 },
        { name: 'Juin', ca: 4800000 },
        { name: 'Juil', ca: 6100000 },
    ];

    // Mock Data for Urgences Table
    const urgencies = [
        { id: 1, type: 'formation', task: 'Cours "Import Chine" à valider', status: 'pending', date: '2024-03-15', priority: 'high' },
        { id: 2, type: 'logistique', task: 'Véhicule bloqué douane (Dossier #452)', status: 'urgent', date: '2024-03-14', priority: 'critical' },
        { id: 3, type: 'boutique', task: 'Rupture stock "iPhone 15 Pro"', status: 'warning', date: '2024-03-15', priority: 'medium' },
        { id: 4, type: 'support', task: 'Message non lu (Client VIP)', status: 'pending', date: '2024-03-15', priority: 'high' },
        { id: 5, type: 'finance', task: 'Paiement en attente validation', status: 'pending', date: '2024-03-13', priority: 'medium' },
    ];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(value);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical': return 'bg-red-100 text-red-800 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'formation': return <Users className="w-4 h-4" />;
            case 'logistique': return <Truck className="w-4 h-4" />;
            case 'boutique': return <ShoppingCart className="w-4 h-4" />;
            default: return <AlertTriangle className="w-4 h-4" />;
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h1>
                <div className="text-sm text-gray-500">
                    Dernière mise à jour: {new Date().toLocaleDateString()}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Chiffre d'Affaires"
                    value={formatCurrency(kpiData.revenue)}
                    icon={DollarSign}
                    color="green"
                    trend={{ positive: true, value: "+12.5%" }}
                />
                <KPICard
                    title="Commandes en cours"
                    value={kpiData.orders}
                    icon={ShoppingCart}
                    color="blue"
                    subtitle="À traiter"
                />
                <KPICard
                    title="Élèves Actifs"
                    value={kpiData.activeStudents}
                    icon={Users}
                    color="purple"
                    subtitle="+5 cette semaine"
                />
                <KPICard
                    title="Alertes"
                    value={kpiData.alerts}
                    icon={AlertTriangle}
                    color="red"
                    subtitle="Nécessitent attention"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Évolution du Chiffre d'Affaires</h2>
                        <button className="text-sm text-mdla-yellow hover:text-yellow-600 font-medium">Voir détails</button>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000000}M`} />
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="ca" fill="#FCD34D" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Urgencies Table */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Urgences & Tâches</h2>
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {urgencies.length} en attente
                        </span>
                    </div>
                    <div className="space-y-4">
                        {urgencies.map((item) => (
                            <div key={item.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                <div className={`p-2 rounded-lg ${getPriorityColor(item.priority)} bg-opacity-20`}>
                                    {getTypeIcon(item.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {item.task}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs text-gray-500">{item.date}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(item.priority)}`}>
                                            {item.priority}
                                        </span>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-green-600 transition-colors">
                                    <CheckCircle className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        Voir toutes les tâches
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
