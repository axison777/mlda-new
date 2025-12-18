import {
    DollarSign,
    Users,
    Package,
    AlertCircle,
    UserPlus,
    ShoppingCart,
    TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockRecentActions } from '../../data/mockActions';
import KPICard from '../../components/KPICard';

const AdminDashboard = () => {
    const { user } = useAuth();

    // Mock KPI data
    const kpiData = {
        revenue: 45780000, // CFA
        totalStudents: 247,
        totalOrders: 156,
        alerts: 5
    };

    // Format currency
    const formatCurrency = (amount) => {
        return `${(amount / 1000000).toFixed(1)}M F CFA`;
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-mdla-yellow to-yellow-400 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-mdla-black mb-2">
                        Tableau de Bord Administrateur
                    </h1>
                    <p className="text-mdla-black/80">
                        Bienvenue, {user?.name}
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* KPI Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <KPICard
                        title="Chiffre d'Affaires"
                        value={formatCurrency(kpiData.revenue)}
                        icon={DollarSign}
                        color="green"
                        trend={{ positive: true, value: '+12.5%' }}
                    />
                    <KPICard
                        title="Total Élèves"
                        value={kpiData.totalStudents}
                        icon={Users}
                        color="blue"
                        subtitle="Inscrits actifs"
                    />
                    <KPICard
                        title="Total Commandes"
                        value={kpiData.totalOrders}
                        icon={Package}
                        color="yellow"
                        subtitle="Ce mois"
                    />
                    <KPICard
                        title="Alertes"
                        value={kpiData.alerts}
                        icon={AlertCircle}
                        color="red"
                        subtitle="Nécessitent attention"
                    />
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - 2/3 width */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Dernières Actions Table */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-mdla-black">
                                    Dernières Actions
                                </h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">
                                        {mockRecentActions.length} actions récentes
                                    </span>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Utilisateur</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Montant</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mockRecentActions.map((action) => (
                                            <tr
                                                key={action.id}
                                                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${action.type === 'registration' ? 'bg-green-50/30' : 'bg-blue-50/30'
                                                    }`}
                                            >
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2">
                                                        {action.type === 'registration' ? (
                                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                                <UserPlus className="w-4 h-4 text-green-600" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                <ShoppingCart className="w-4 h-4 text-blue-600" />
                                                            </div>
                                                        )}
                                                        <span className={`text-xs font-semibold ${action.type === 'registration' ? 'text-green-700' : 'text-blue-700'
                                                            }`}>
                                                            {action.type === 'registration' ? 'Inscription' : 'Commande'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <p className="font-medium text-gray-900">
                                                        {action.type === 'registration'
                                                            ? action.course
                                                            : action.product}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{action.user.name}</p>
                                                        <p className="text-xs text-gray-500">{action.user.email}</p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <p className="text-sm text-gray-600">{formatDate(action.date)}</p>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    {action.amount ? (
                                                        <p className="font-semibold text-green-600">
                                                            {formatCurrency(action.amount)}
                                                        </p>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Revenue Chart Placeholder */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-mdla-black">
                                    Revenus Mensuels
                                </h2>
                                <TrendingUp className="w-6 h-6 text-gray-400" />
                            </div>
                            <div className="h-64 bg-gradient-to-t from-mdla-yellow/10 to-transparent rounded-lg flex items-center justify-center">
                                <div className="text-center">
                                    <TrendingUp className="w-16 h-16 text-mdla-yellow mx-auto mb-4" />
                                    <p className="text-gray-600">Graphique des revenus</p>
                                    <p className="text-sm text-gray-500">(À implémenter avec Chart.js)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - 1/3 width */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-bold text-mdla-black mb-4">
                                Actions Rapides
                            </h3>
                            <div className="space-y-2">
                                <button className="w-full text-left px-4 py-3 bg-mdla-yellow hover:bg-yellow-400 rounded-lg transition-colors font-semibold text-mdla-black">
                                    Ajouter un Utilisateur
                                </button>
                                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors font-semibold text-gray-900">
                                    Ajouter un Produit
                                </button>
                                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors font-semibold text-gray-900">
                                    Gérer les Rôles
                                </button>
                                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors font-semibold text-gray-900">
                                    Voir les Rapports
                                </button>
                            </div>
                        </div>

                        {/* Recent Alerts */}
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                <h3 className="text-lg font-bold text-red-900">
                                    Alertes Récentes
                                </h3>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-sm font-semibold text-gray-900">Stock faible</p>
                                    <p className="text-xs text-gray-600">3 véhicules en rupture</p>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-sm font-semibold text-gray-900">Paiement en attente</p>
                                    <p className="text-xs text-gray-600">2 commandes non payées</p>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-sm font-semibold text-gray-900">Cours à valider</p>
                                    <p className="text-xs text-gray-600">3 cours en attente</p>
                                </div>
                            </div>
                        </div>

                        {/* System Health */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-bold text-mdla-black mb-4">
                                État du Système
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Serveur</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm font-semibold text-green-600">Opérationnel</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Base de données</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm font-semibold text-green-600">Opérationnel</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">API</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm font-semibold text-green-600">Opérationnel</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
