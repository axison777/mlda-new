import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
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
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const { data } = await api.get('/payments/all');
            // Transformer les données de l'API pour matcher le format d'affichage
            const formattedData = data.map(payment => {
                const isCourse = payment.metadata?.courseId || payment.metadata?.learningMode;
                const type = isCourse ? 'cours' : (payment.order?.type === 'vehicle' || payment.order?.type === 'container' ? 'import' : 'boutique');
                let itemName = 'Article/Service';
                
                if (isCourse && payment.metadata?.courseId) itemName = `Formation ID: ${payment.metadata.courseId}`;
                else if (payment.order?.type) itemName = payment.order.type;

                return {
                    id: payment.transactionId || `TRX-${payment.id}`,
                    date: new Date(payment.createdAt).toLocaleDateString('fr-FR'),
                    client: payment.user?.name || 'Inconnu',
                    category: type,
                    item: itemName,
                    amount: parseFloat(payment.amount),
                    status: payment.status,
                    method: payment.method
                };
            });
            setTransactions(formattedData);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate KPIs dynamically
    const totalRevenue = transactions.filter(t => t.status === 'completed' || t.status === 'DONE').reduce((acc, t) => acc + t.amount, 0);
    const coursesRevenue = transactions.filter(t => (t.status === 'completed' || t.status === 'DONE') && t.category === 'cours').reduce((acc, t) => acc + t.amount, 0);
    const shopRevenue = transactions.filter(t => (t.status === 'completed' || t.status === 'DONE') && t.category === 'boutique').reduce((acc, t) => acc + t.amount, 0);
    const importsRevenue = transactions.filter(t => (t.status === 'completed' || t.status === 'DONE') && t.category === 'import').reduce((acc, t) => acc + t.amount, 0);
    
    const kpiData = {
        totalRevenue,
        coursesRevenue,
        shopRevenue,
        importsRevenue,
        monthlyGrowth: 0, // Needs historical data comparison
        pendingPayments: transactions.filter(t => t.status === 'pending' || t.status === 'INITIALIZED').reduce((acc, t) => acc + t.amount, 0),
        completedTransactions: transactions.filter(t => t.status === 'completed' || t.status === 'DONE').length,
        pendingTransactions: transactions.filter(t => t.status === 'pending' || t.status === 'INITIALIZED').length
    };

    // Keep Mock Data for Chart Evolution for now until we have real month-by-month history API
    const revenueEvolution = [
        { month: 'Jan', cours: 3200000, boutique: 4500000, import: 1800000 },
        { month: 'Fév', cours: 3800000, boutique: 5200000, import: 2100000 },
        { month: 'Mar', cours: 4100000, boutique: 4800000, import: 1950000 },
        { month: 'Avr', cours: 3900000, boutique: 5500000, import: 2300000 },
        { month: 'Mai', cours: 4500000, boutique: 6100000, import: 2450000 },
        { month: 'Juin', cours: 4200000, boutique: 5800000, import: 2200000 },
        { month: 'Juil', cours: 4578000, boutique: 5892000, import: 2075000 },
    ];

    const revenueDistribution = [
        { name: 'Formations', value: coursesRevenue, color: '#3B82F6' },
        { name: 'Boutique', value: shopRevenue, color: '#FFCC00' },
        { name: 'Import/Export', value: importsRevenue, color: '#10B981' },
    ];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(value || 0);
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
            case 'DONE':
                return <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full w-fit">
                    <CheckCircle className="w-3 h-3" /> Complété
                </span>;
            case 'pending':
            case 'INITIALIZED':
                return <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full w-fit">
                    <Clock className="w-3 h-3" /> En attente
                </span>;
            case 'failed':
            case 'FAILED':
            case 'CANCELED':
                return <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full w-fit">
                    <XCircle className="w-3 h-3" /> Échoué
                </span>;
            default:
                return null;
        }
    };

    const filteredTransactions = selectedCategory === 'all'
        ? transactions
        : transactions.filter(t => t.category === selectedCategory);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mdla-yellow"></div>
                <p className="mt-4 text-gray-500 animate-pulse font-medium">Chargement des données financières...</p>
            </div>
        );
    }

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
