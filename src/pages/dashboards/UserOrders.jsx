import React, { useState } from 'react';
import { useOrders } from '../../context/OrdersContext';
import { Link } from 'react-router-dom';
import {
    Download,
    Image as ImageIcon,
    FileText,
    AlertCircle,
    Truck,
    BookOpen,
    Package,
    Globe,
    Plus,
    X,
    MapPin,
    Calendar,
    ChevronRight,
    Search,
    User
} from 'lucide-react';
import { getClientStatus, getStatusPhase } from '../../utils/logisticsHelper';

const UserOrders = () => {
    const { orders, loading } = useOrders();
    const [activeTab, setActiveTab] = useState('logistic');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const getStatusTheme = (status) => {
        const info = getClientStatus(status);
        switch (info.color) {
            case 'green': return 'bg-green-100 text-green-700 border-green-200';
            case 'yellow': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'orange': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'blue': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'logistic') return order.type !== 'course';
        return order.type === 'course';
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mdla-yellow"></div>
                <p className="mt-4 text-gray-500 animate-pulse font-medium">Chargement de vos dossiers...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mes Activités</h1>
                    <p className="text-gray-500 mt-1">Gérez vos importations et vos apprentissages.</p>
                </div>
                <Link to="/boutique" className="w-full md:w-auto bg-mdla-yellow text-mdla-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-400/20 flex items-center justify-center gap-2 group">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Nouveau Dossier
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('logistic')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'logistic' ? 'bg-white text-mdla-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Truck className="w-4 h-4" />
                    Logistique
                    <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${activeTab === 'logistic' ? 'bg-mdla-yellow' : 'bg-gray-200'}`}>
                        {orders.filter(o => o.type !== 'course').length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('course')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'course' ? 'bg-white text-mdla-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <BookOpen className="w-4 h-4" />
                    Formations
                    <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${activeTab === 'course' ? 'bg-mdla-yellow' : 'bg-gray-200'}`}>
                        {orders.filter(o => o.type === 'course').length}
                    </span>
                </button>
            </div>

            {/* List */}
            <div className="grid gap-6">
                {filteredOrders.map(order => {
                    const statusInfo = getClientStatus(order.status);
                    const phaseInfo = getStatusPhase(order.status);
                    const progress = phaseInfo.progress;

                    return (
                        <div key={order.id} className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:border-mdla-yellow hover:shadow-xl transition-all duration-300">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
                                <div className="flex items-center gap-5">
                                    <div className={`p-4 rounded-2xl ${order.type === 'vehicle' ? 'bg-blue-50 text-blue-600' : (order.type === 'container' ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600')} group-hover:scale-110 transition-transform`}>
                                        {order.type === 'vehicle' ? <Truck className="w-8 h-8" /> : (order.type === 'container' ? <Globe className="w-8 h-8" /> : <Package className="w-8 h-8" />)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-black text-gray-900 text-xl tracking-tight uppercase">
                                                {order.items?.[0]?.name || order.type}
                                            </h3>
                                            <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded bg-gray-900 text-white tracking-widest`}>
                                                {order.type}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-sm">
                                            <span className="flex items-center gap-1.5 text-gray-500 font-bold">
                                                <div className="w-1.5 h-1.5 rounded-full bg-mdla-yellow"></div>
                                                ID: {order.trackingNumber}
                                            </span>
                                            <span className="text-gray-300">|</span>
                                            <span className="flex items-center gap-1.5 text-gray-900 font-black">
                                                {parseFloat(order.totalAmount).toLocaleString()} {order.currency || 'FCFA'}
                                            </span>
                                            {order.shippingDetails?.city && (
                                                <>
                                                    <span className="text-gray-300">|</span>
                                                    <span className="flex items-center gap-1.5 text-gray-500">
                                                        <MapPin className="w-4 h-4" />
                                                        {order.shippingDetails.city}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 w-full lg:w-auto">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black border uppercase tracking-widest ${getStatusTheme(order.status)} shadow-sm`}>
                                        {statusInfo.clientTitle}
                                    </span>
                                    <span className="text-xs text-gray-400 font-bold uppercase tracking-tighter">
                                        Mis à jour : {new Date(order.updatedAt).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="relative mb-8">
                                <div className="flex justify-between text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-3 px-1">
                                    <span>Départ</span>
                                    <span className="text-mdla-black">{statusInfo.phase}</span>
                                    <span>Livraison</span>
                                </div>
                                <div className="overflow-hidden h-3 flex rounded-full bg-gray-100 p-0.5 relative">
                                    <div
                                        style={{ width: `${progress}%` }}
                                        className="shadow-inner rounded-full bg-gradient-to-r from-yellow-300 to-mdla-yellow transition-all duration-1000 ease-out"
                                    ></div>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 font-medium">
                                    <div className="w-2 h-2 rounded-full bg-mdla-yellow animate-pulse" />
                                    {order.events?.[0]?.comment || 'Dossier en cours de traitement'}
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-between items-center gap-4 border-t border-gray-50 pt-6">
                                <div className="flex -space-x-2">
                                    {/* Small Timeline Dots Preview */}
                                    {order.timeline?.map((step, idx) => (
                                        <div key={idx} className={`w-3 h-3 rounded-full border-2 border-white ${idx < order.currentStep ? 'bg-mdla-yellow' : 'bg-gray-200'}`} title={step.title}></div>
                                    ))}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setIsDetailModalOpen(true);
                                        }}
                                        className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50 hover:text-mdla-black transition-all"
                                    >
                                        Détails
                                    </button>
                                    <Link to={`/suivi/${order.trackingNumber}`} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-mdla-black text-white hover:bg-gray-800 transition-all shadow-lg hover:shadow-gray-400/20 text-sm">
                                        <Search className="w-4 h-4 text-mdla-yellow" />
                                        Suivre mon colis
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredOrders.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-gray-200">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            {activeTab === 'logistic' ? <Truck className="w-12 h-12 text-gray-300" /> : <BookOpen className="w-12 h-12 text-gray-300" />}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {activeTab === 'logistic' ? 'Aucun dossier logistique' : 'Aucune formation active'}
                        </h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium">
                            {activeTab === 'logistic'
                                ? "Vous n'avez pas encore d'importation en cours. Commencez par explorer notre boutique."
                                : "Développez vos compétences en vous inscrivant à l'un de nos cours certifiants."}
                        </p>
                        <Link to={activeTab === 'logistic' ? "/boutique" : "/formations"} className="inline-flex items-center gap-2 bg-mdla-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl group">
                            {activeTab === 'logistic' ? 'Parcourir la boutique' : 'Voir les formations'}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}
            </div>
            {/* Dossier Detail Modal (for Client) */}
            {isDetailModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-mdla-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[40px] shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in duration-300">
                        {/* Header */}
                        <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-mdla-yellow rounded-2xl flex items-center justify-center shadow-lg">
                                    {selectedOrder.type === 'vehicle' ? <Truck className="w-8 h-8 text-mdla-black" /> : <Package className="w-8 h-8 text-mdla-black" />}
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Dossier {selectedOrder.trackingNumber}</h3>
                                    <span className={`px-3 py-0.5 text-[10px] font-black rounded-full border uppercase tracking-widest ${getStatusTheme(selectedOrder.status)} shadow-sm mt-1 inline-block`}>
                                        {getClientStatus(selectedOrder.status).clientTitle}
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setIsDetailModalOpen(false)} className="p-4 bg-white rounded-full text-gray-400 hover:text-gray-600 shadow-sm border border-gray-100 hover:rotate-90 transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-10 overflow-y-auto space-y-10 scrollbar-hide">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Route Info */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">Origine</p>
                                            <div className="flex items-start gap-3">
                                                <Globe className="w-5 h-5 text-blue-600 mt-1" />
                                                <div>
                                                    <p className="font-black text-lg text-gray-900">{selectedOrder.shippingDetails?.departureCountry}</p>
                                                    <p className="text-sm text-gray-500 font-bold">{selectedOrder.shippingDetails?.departureCity}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-green-50/50 rounded-3xl border border-green-100">
                                            <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-3">Destination</p>
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-5 h-5 text-green-600 mt-1" />
                                                <div>
                                                    <p className="font-black text-lg text-gray-900">{selectedOrder.shippingDetails?.arrivalCountry}</p>
                                                    <p className="text-sm text-gray-500 font-bold">{selectedOrder.shippingDetails?.arrivalCity}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Experts & Assets */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Références</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                                    <span className="text-[10px] font-bold text-gray-400">NUMÉRO B/L</span>
                                                    <span className="text-sm font-black text-gray-900">{selectedOrder.blNumber || 'En attente'}</span>
                                                </div>
                                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                                    <span className="text-[10px] font-bold text-gray-400">NUMÉRO BSC</span>
                                                    <span className="text-sm font-black text-gray-900">{selectedOrder.bscNumber || 'En attente'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Documents & GED</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedOrder.attachments?.filter(a => a.type === 'document').map(doc => (
                                                    <a key={doc.id} href={doc.filePath} target="_blank" className="flex items-center gap-2 p-2 bg-gray-900 text-white rounded-xl text-[10px] font-black hover:bg-mdla-yellow hover:text-mdla-black transition-all shadow-md">
                                                        <FileText className="w-3 h-3" />
                                                        DOC
                                                    </a>
                                                )) || <p className="text-[10px] text-gray-400 italic">Aucun document pour le moment</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary Card */}
                                <div className="bg-gray-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-mdla-yellow/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                                    <p className="text-[10px] font-black text-mdla-yellow uppercase tracking-[0.2em] mb-4">Résumé financier</p>
                                    <div className="text-4xl font-black mb-1">
                                        {parseFloat(selectedOrder.totalAmount).toLocaleString()}
                                        <span className="text-sm text-mdla-yellow ml-2">{selectedOrder.currency || 'FCFA'}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 font-medium mb-8">Valeur déclarée de la marchandise</p>

                                    <div className="space-y-4 pt-6 border-t border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                                <CheckCircle className="w-4 h-4 text-mdla-yellow" />
                                            </div>
                                            <span className="text-xs font-bold">{selectedOrder.paymentStatus === 'paid' ? 'Paiement Terminé' : 'Paiement en attente'}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                                <Calendar className="w-4 h-4 text-mdla-yellow" />
                                            </div>
                                            <span className="text-xs font-bold">Créé le {new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="space-y-8">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] text-center">Timeline Technique & Preuves</h4>
                                <div className="space-y-6 max-w-2xl mx-auto pl-4">
                                    {(selectedOrder.events || []).map((event, idx) => {
                                        const theme = getStatusTheme(event.status);
                                        return (
                                            <div key={event.id} className="relative pl-10 pb-8 border-l-2 border-gray-100 last:border-l-0">
                                                <div className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-4 border-white shadow-md ${idx === 0 ? 'bg-mdla-yellow scale-125 animate-pulse' : 'bg-gray-300'}`} />
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${theme}`}>
                                                        {getClientStatus(event.status).label}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-bold">{new Date(event.eventDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <p className="text-base font-black text-gray-900 leading-tight mb-2">{event.comment}</p>
                                                {event.location && (
                                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold mb-3">
                                                        <MapPin className="w-3 h-3" />
                                                        {event.location}
                                                    </div>
                                                )}

                                                {/* Proofs / Photos */}
                                                <div className="flex gap-2">
                                                    {selectedOrder.attachments?.filter(a => a.shipmentEventId === event.id && a.type === 'proof').map(img => (
                                                        <button key={img.id} className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-lg hover:scale-110 transition-all">
                                                            <img src={img.filePath} alt="Preuve" className="w-full h-full object-cover" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-10 py-8 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button onClick={() => setIsDetailModalOpen(false)} className="px-10 py-4 bg-mdla-black text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-gray-800 transition-all shadow-xl hover:scale-105 active:scale-95">
                                Fermer le dossier
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserOrders;
