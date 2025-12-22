import React, { useState } from 'react';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    BookOpen,
    ShoppingCart,
    Truck,
    Calendar,
    Download,
    Filter,
    Search,
    Eye,
    CheckCircle,
    Clock,
    XCircle
} from 'lucide-react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

const AdminFinance = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Mock Data - KPIs
    const kpiData = {
        totalRevenue: 125450000, // FCFA
        coursesRevenue: 45780000,
        shopRevenue: 58920000,
        importsRevenue: 20750000,
        monthlyGrowth: 12.5,
        pendingPayments: 8500000,
        completedTransactions: 156,
        pendingTransactions: 12
    };

    // Mock Data - Revenue Evolution
    const revenueEvolution = [
        { month: 'Jan', cours: 3200000, boutique: 4500000, import: 1800000 },
        { month: 'Fév', cours: 3800000, boutique: 5200000, import: 2100000 },
        { month: 'Mar', cours: 4100000, boutique: 4800000, import: 1950000 },
        { month: 'Avr', cours: 3900000, boutique: 5500000, import: 2300000 },
        { month: 'Mai', cours: 4500000, boutique: 6100000, import: 2450000 },
        { month: 'Juin', cours: 4200000, boutique: 5800000, import: 2200000 },
        { month: 'Juil', cours: 4578000, boutique: 5892000, import: 2075000 },
    ];

    // Mock Data - Revenue Distribution
    const revenueDistribution = [
        { name: 'Formations', value: 45780000, color: '#3B82F6' },
        { name: 'Boutique', value: 58920000, color: '#FFCC00' },
        { name: 'Import/Export', value: 20750000, color: '#10B981' },
    ];

    // Mock Data - Recent Transactions
    const recentTransactions = [
        { id: 'TRX-8821', date: '2024-03-15', client: 'Jean Dupont', category: 'cours', item: 'Allemand B1 - Complet', amount: 125000, status: 'completed', method: 'Orange Money' },
        { id: 'TRX-8822', date: '2024-03-15', client: 'Marie Koné', category: 'boutique', item: 'iPhone 15 Pro', amount: 850000, status: 'completed', method: 'Visa' },
        { id: 'TRX-8823', date: '2024-03-14', client: 'SARL Transport', category: 'import', item: 'Toyota RAV4 2020', amount: 12500000, status: 'pending', method: 'Virement' },
        { id: 'TRX-8824', date: '2024-03-14', client: 'Sophie Martin', category: 'cours', item: 'Allemand A2', amount: 85000, status: 'completed', method: 'PayPal' },
        { id: 'TRX-8825', date: '2024-03-13', client: 'Auto Import', category: 'import', item: 'Mercedes C300', amount: 15200000, status: 'completed', method: 'Virement' },
        { id: 'TRX-8826', date: '2024-03-13', client: 'Fatou Sow', category: 'boutique', item: 'MacBook Pro M3', amount: 1250000, status: 'pending', method: 'Orange Money' },
        { id: 'TRX-8827', date: '2024-03-12', client: 'Paul Diallo', category: 'cours', item: 'Business Allemand', amount: 150000, status: 'completed', method: 'Visa' },
        { id: 'TRX-8828', date: '2024-03-12', client: 'BTP Construction', category: 'import', item: 'Matériel Lourd', amount: 8900000, status: 'failed', method: 'Virement' },
    ];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(value);
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'cours': return <BookOpen className="w-4 h-4" />;
            case 'boutique': return <ShoppingCart className="w-4 h-4" />;
            case 'import': return <Truck className="w-4 h-4" />;
            default: return <DollarSign className="w-4 h-4" />;
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'cours': return 'bg-blue-100 text-blue-800';
            case 'boutique': return 'bg-yellow-100 text-yellow-800';
            case 'import': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    <CheckCircle className="w-3 h-3" /> Complété
                </span>;
            case 'pending':
                return <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    <Clock className="w-3 h-3" /> En attente
                </span>;
            case 'failed':
                return <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                    <XCircle className="w-3 h-3" /> Échoué
                </span>;
            default:
                return null;
        }
    };

    const filteredTransactions = selectedCategory === 'all'
        ? recentTransactions
        : recentTransactions.filter(t => t.category === selectedCategory);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Finances & Revenus</h1>
                    <p className="text-gray-500">Vue d'ensemble des revenus par catégorie</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">Ce mois</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-mdla-yellow text-mdla-black rounded-lg hover:bg-yellow-400 transition-colors font-bold">
                        <Download className="w-4 h-4" />
                        Exporter
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Revenue */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-sm text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded-full">
                            <TrendingUp className="w-4 h-4" />
                            +{kpiData.monthlyGrowth}%
                        </div>
                    </div>
                    <h3 className="text-sm font-medium opacity-90 mb-1">Revenu Total</h3>
                    <p className="text-2xl font-bold">{formatCurrency(kpiData.totalRevenue)}</p>
                </div>

                {/* Courses Revenue */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Formations</h3>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(kpiData.coursesRevenue)}</p>
                    <p className="text-xs text-gray-500 mt-2">
                        {((kpiData.coursesRevenue / kpiData.totalRevenue) * 100).toFixed(1)}% du total
                    </p>
                </div>

                {/* Shop Revenue */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <ShoppingCart className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Boutique</h3>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(kpiData.shopRevenue)}</p>
                    <p className="text-xs text-gray-500 mt-2">
                        {((kpiData.shopRevenue / kpiData.totalRevenue) * 100).toFixed(1)}% du total
                    </p>
                </div>

                {/* Imports Revenue */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <Truck className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Import/Export</h3>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(kpiData.importsRevenue)}</p>
                    <p className="text-xs text-gray-500 mt-2">
                        {((kpiData.importsRevenue / kpiData.totalRevenue) * 100).toFixed(1)}% du total
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Evolution Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Évolution des Revenus</h2>
                        <div className="flex gap-2">
                            {['week', 'month', 'year'].map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setSelectedPeriod(period)}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${selectedPeriod === period
                                            ? 'bg-mdla-black text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {period === 'week' ? 'Semaine' : period === 'month' ? 'Mois' : 'Année'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueEvolution}>
                                <defs>
                                    <linearGradient id="colorCours" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorBoutique" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FFCC00" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#FFCC00" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorImport" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000000}M`} />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                                <Area type="monotone" dataKey="cours" name="Formations" stroke="#3B82F6" fillOpacity={1} fill="url(#colorCours)" />
                                <Area type="monotone" dataKey="boutique" name="Boutique" stroke="#FFCC00" fillOpacity={1} fill="url(#colorBoutique)" />
                                <Area type="monotone" dataKey="import" name="Import/Export" stroke="#10B981" fillOpacity={1} fill="url(#colorImport)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Distribution Pie Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Répartition des Revenus</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={revenueDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {revenueDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 mt-6">
                        {revenueDistribution.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-sm text-gray-600">{item.name}</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.value)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h2 className="text-lg font-semibold text-gray-900">Transactions Récentes</h2>
                        <div className="flex gap-2 flex-wrap">
                            {['all', 'cours', 'boutique', 'import'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat
                                            ? 'bg-mdla-yellow text-mdla-black'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat === 'all' ? 'Tous' : cat === 'cours' ? 'Formations' : cat === 'boutique' ? 'Boutique' : 'Import/Export'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Transaction</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredTransactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-medium text-gray-900">
                                        {transaction.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {transaction.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {transaction.client}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                                            {getCategoryIcon(transaction.category)}
                                            {transaction.category === 'cours' ? 'Formation' : transaction.category === 'boutique' ? 'Boutique' : 'Import'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                        {transaction.item}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        {formatCurrency(transaction.amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {transaction.method}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(transaction.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900 flex items-center gap-1 ml-auto">
                                            <Eye className="w-4 h-4" />
                                            Détails
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

export default AdminFinance;
