import React from 'react';
import { Package, Truck, Search, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserOrders = () => {
    // Mock Data
    const orders = [
        {
            id: 'ORD-2023-001',
            item: 'Mercedes C300',
            status: 'shipping',
            tracking: 'TRK-9988',
            location: 'En Mer',
            eta: '15 Nov 2023',
            progress: 2, // 0-4
            price: '12.500.000 FCFA'
        },
        {
            id: 'ORD-2023-002',
            item: 'Pièces Détachées BMW',
            status: 'delivered',
            tracking: 'TRK-8877',
            location: 'Livré',
            eta: '10 Oct 2023',
            progress: 4,
            price: '850.000 FCFA'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'shipping': return 'bg-blue-100 text-blue-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mes Commandes</h1>
                    <p className="text-gray-500">Suivez vos achats et importations en temps réel.</p>
                </div>
                <Link to="/boutique" className="bg-mdla-black text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Nouvelle Commande
                </Link>
            </div>

            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <Truck className="w-8 h-8 text-mdla-yellow" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{order.item}</h3>
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="text-gray-500">ID: {order.id}</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="font-medium text-gray-900">{order.price}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)} uppercase tracking-wide`}>
                                    {order.location}
                                </span>
                                <span className="text-sm text-gray-500">Arrivée: {order.eta}</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative mb-6 mx-2">
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
                                <div style={{ width: `${(order.progress / 4) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-mdla-yellow transition-all duration-500"></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 font-medium">
                                <span>Commande</span>
                                <span>Expédition</span>
                                <span>Transit</span>
                                <span>Douane</span>
                                <span>Livraison</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t pt-4">
                            <Link to={`/suivi/${order.tracking}`} className="text-gray-600 hover:text-mdla-black font-bold text-sm px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors">
                                Détails
                            </Link>
                            <Link to={`/suivi/${order.tracking}`} className="bg-white border-2 border-gray-100 text-mdla-black px-4 py-2 rounded-lg font-bold hover:border-mdla-yellow hover:bg-yellow-50 transition-colors flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4" />
                                Suivre
                            </Link>
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Aucune commande en cours</h3>
                        <p className="text-gray-500 mb-6">Visitez notre boutique pour passer votre première commande.</p>
                        <Link to="/boutique" className="bg-mdla-yellow text-mdla-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors">
                            Visiter la boutique
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserOrders;
