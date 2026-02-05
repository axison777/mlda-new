import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, Package, Calendar, MapPin, MessageCircle, Phone, ArrowLeft } from 'lucide-react';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';
import LogisticsTimeline from '../components/LogisticsTimeline';

const TrackingPage = () => {
    const { trackingNumber: urlTrackingNumber } = useParams();
    const [trackingNumber, setTrackingNumber] = useState(urlTrackingNumber || '');
    const [orderData, setOrderData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { getOrderByTracking } = useOrders();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (urlTrackingNumber) {
            handleTrack(null, urlTrackingNumber);
        }
    }, [urlTrackingNumber]);

    const handleTrack = async (e, tNumber) => {
        if (e) e.preventDefault();
        const num = tNumber || trackingNumber;
        if (num.trim()) {
            setIsLoading(true);
            try {
                const order = await getOrderByTracking(num.trim());
                setOrderData(order);
            } catch (error) {
                console.error('Tracking error:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-mdla-yellow to-yellow-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-mdla-black mb-4 text-center">
                        Suivi de Commande
                    </h1>
                    <p className="text-mdla-black/80 text-center mb-8">
                        Suivez votre véhicule ou marchandise en temps réel
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleTrack} className="max-w-2xl mx-auto">
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    placeholder="Entrez votre numéro de suivi (ex: MDL-8842)"
                                    className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-transparent focus:border-mdla-black outline-none text-lg"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-mdla-black text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-800 transition-all"
                            >
                                Suivre
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Tracking Results */}
            {orderData ? (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Back to Dashboard Link */}
                    {isAuthenticated && (
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-2 text-mdla-yellow hover:text-yellow-600 font-semibold mb-6"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Retour au tableau de bord
                        </Link>
                    )}

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Vehicle/Product Card */}
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="bg-gradient-to-r from-mdla-yellow to-yellow-400 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-mdla-black">
                                            Détails de la Commande
                                        </h2>
                                        <span className="bg-mdla-black text-white px-4 py-2 rounded-full text-sm font-bold">
                                            {orderData.trackingNumber}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="rounded-lg overflow-hidden">
                                            <img
                                                src={orderData.items?.[0]?.image || 'https://placehold.co/600x400?text=Marchandise'}
                                                alt={orderData.items?.[0]?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-2xl font-bold text-mdla-black mb-1">
                                                    {orderData.items?.[0]?.description || 'Marchandise sans description'}
                                                </h3>
                                                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-2">
                                                    {orderData.type === 'vehicle' ? 'Véhicule' : orderData.type === 'container' ? 'Conteneur' : 'Marchandise'}
                                                </p>
                                                {orderData.metadata?.vin && (
                                                    <p className="text-gray-600 text-sm">
                                                        VIN: {orderData.metadata.vin}
                                                    </p>
                                                )}
                                                <div className="inline-block bg-gray-100 px-3 py-1 rounded-lg">
                                                    <p className="text-xs font-black text-gray-500 uppercase">Valeur Déclarée</p>
                                                    <p className="font-bold text-mdla-black">
                                                        {new Intl.NumberFormat('fr-FR').format(orderData.totalAmount)} FCFA
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-3 pt-2">
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="w-5 h-5 text-mdla-yellow" />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Date de commande</p>
                                                        <p className="font-semibold">{new Date(orderData.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <MapPin className="w-5 h-5 text-mdla-yellow" />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Destination</p>
                                                        <p className="font-semibold">{orderData.shippingDetails?.arrivalCity || orderData.shippingDetails?.city || 'N/A'}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <Package className="w-5 h-5 text-mdla-yellow" />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Arrivée estimée</p>
                                                        <p className="font-semibold text-green-600">
                                                            {orderData.estimatedDelivery || 'En attente'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-2xl font-bold text-mdla-black mb-6">
                                    Suivi de l'Expédition
                                </h2>
                                {/* Ensure we pass the events as 'steps' and map them if necessary, but backend usually sends 'timeline' or 'events' */}
                                {/* Ensure we pass the events as 'steps' and map them if necessary, but backend usually sends 'timeline' or 'events' */}
                                <LogisticsTimeline
                                    steps={(orderData.events || orderData.timeline || []).map((event, index) => ({
                                        title: event.status.toUpperCase(), // Or event.location
                                        date: new Date(event.eventDate).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }),
                                        description: event.description || `Lieu : ${event.location}`,
                                        status: index === 0 ? 'current' : 'completed' // Assume first item is latest/current because of DESC sort
                                    }))}
                                />
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24 space-y-6">
                                {/* Help Widget */}
                                <div>
                                    <h3 className="text-lg font-bold text-mdla-black mb-4">
                                        Besoin d'aide ?
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Notre équipe est disponible pour répondre à toutes vos questions sur votre commande.
                                    </p>

                                    <div className="space-y-3">
                                        <a
                                            href="https://wa.me/22670266464"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-all"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                            <span className="font-semibold">WhatsApp Support</span>
                                        </a>

                                        <a
                                            href="tel:+22670266464"
                                            className="flex items-center gap-3 bg-mdla-yellow text-mdla-black px-4 py-3 rounded-lg hover:bg-yellow-400 transition-all"
                                        >
                                            <Phone className="w-5 h-5" />
                                            <span className="font-semibold">Appeler MDLA</span>
                                        </a>
                                    </div>
                                </div>

                                {/* Info Box */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-bold text-blue-900 mb-2">
                                        ℹ️ Information
                                    </h4>
                                    <p className="text-sm text-blue-800">
                                        Les délais peuvent varier en fonction des conditions maritimes et des procédures douanières.
                                    </p>
                                </div>

                                {/* Quick Stats */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h4 className="font-bold text-mdla-black mb-4">
                                        Statistiques
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Progression</span>
                                            <span className="font-bold text-mdla-black">
                                                {Math.round((orderData.currentStep / (orderData.timeline?.length || 1)) * 100)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-500 h-2 rounded-full"
                                                style={{ width: `${(orderData.currentStep / (orderData.timeline?.length || 1)) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span>{orderData.currentStep}/{orderData.timeline?.length || 0} étapes complétées</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : trackingNumber && !orderData ? (
                /* Not Found State */
                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <Package className="w-24 h-24 text-red-300 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">
                        Commande non trouvée
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Le numéro de suivi "{trackingNumber}" n'existe pas dans notre système.
                    </p>
                    <button
                        onClick={() => {
                            setTrackingNumber('');
                            setOrderData(null);
                        }}
                        className="bg-mdla-yellow text-mdla-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                    >
                        Réessayer
                    </button>
                </div>
            ) : (
                /* Empty State */
                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">
                        Entrez votre numéro de suivi
                    </h2>
                    <p className="text-gray-600">
                        Vous recevrez votre numéro de suivi par email après validation de votre commande.
                    </p>
                </div>
            )}
        </div>
    );
};

export default TrackingPage;
