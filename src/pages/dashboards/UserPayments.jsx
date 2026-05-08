import React, { useState, useEffect } from 'react';
import {
    DollarSign,
    Calendar,
    CheckCircle,
    Clock,
    XCircle,
    Download,
    CreditCard
} from 'lucide-react';
import api from '../../utils/api';

const UserPayments = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const { data } = await api.get('/payments/transactions');
            // Transformer les données de l'API pour matcher le format d'affichage
            const formattedData = data.map(payment => {
                const isCourse = payment.metadata?.courseId || payment.metadata?.learningMode;
                const type = isCourse ? 'cours' : (payment.order?.type === 'vehicle' || payment.order?.type === 'container' ? 'import' : 'boutique');
                let itemName = 'Article / Service non spécifié';
                
                if (isCourse && payment.metadata?.courseId) itemName = `Inscription Formation`;
                else if (payment.order?.type) itemName = `Commande ${payment.order.type.toUpperCase()}`;

                return {
                    id: payment.transactionId || `TRX-${payment.id}`,
                    date: new Date(payment.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(value || 0);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
            case 'DONE':
                return <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase tracking-widest rounded-full w-fit">
                    <CheckCircle className="w-3 h-3" /> Payé
                </span>;
            case 'pending':
            case 'INITIALIZED':
                return <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold uppercase tracking-widest rounded-full w-fit">
                    <Clock className="w-3 h-3" /> En attente
                </span>;
            case 'failed':
            case 'FAILED':
            case 'CANCELED':
                return <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-xs font-bold uppercase tracking-widest rounded-full w-fit">
                    <XCircle className="w-3 h-3" /> Échoué
                </span>;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mdla-yellow"></div>
                <p className="mt-4 text-gray-500 animate-pulse font-medium">Chargement de vos paiements...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mes Paiements</h1>
                    <p className="text-gray-500 mt-1">Consultez l'historique de vos factures et transactions.</p>
                </div>
            </div>

            {/* List */}
            <div className="grid gap-6">
                {transactions.length > 0 ? transactions.map((transaction, index) => (
                    <div key={index} className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:border-mdla-yellow hover:shadow-xl transition-all duration-300">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex items-center gap-5">
                                <div className={`p-4 rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform`}>
                                    <CreditCard className="w-8 h-8" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-black text-gray-900 text-xl tracking-tight uppercase">
                                            {transaction.item}
                                        </h3>
                                        <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-gray-900 text-white tracking-widest">
                                            {transaction.category}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                        <span className="flex items-center gap-1.5 text-gray-500 font-bold">
                                            <div className="w-1.5 h-1.5 rounded-full bg-mdla-yellow"></div>
                                            Réf: {transaction.id}
                                        </span>
                                        <span className="text-gray-300">|</span>
                                        <span className="flex items-center gap-1.5 text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            {transaction.date}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                                <span className="text-2xl font-black text-gray-900 tracking-tight">
                                    {formatCurrency(transaction.amount)}
                                </span>
                                {getStatusBadge(transaction.status)}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-gray-200">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <DollarSign className="w-12 h-12 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucune transaction trouvée</h3>
                        <p className="text-gray-500 max-w-sm mx-auto font-medium">
                            Vous n'avez pas encore effectué de paiement sur la plateforme.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPayments;
