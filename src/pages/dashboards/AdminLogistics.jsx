import React, { useState, useEffect, useMemo } from 'react';
import {
    Package,
    Truck,
    MapPin,
    Plus,
    Search,
    Filter,
    CheckCircle,
    Clock,
    Ship,
    FileText,
    X,
    Loader2,
    User,
    Globe,
    AlertCircle,
    ArrowUpRight,
    TrendingUp,
    PlusCircle,
    Calendar,
    Anchor,
    Shield,
    Camera
} from 'lucide-react';
import LocationSelector from '../../components/common/LocationSelector';

import { useOrders } from '../../context/OrdersContext';
import { useAuth } from '../../context/AuthContext';
import api, { uploadFile } from '../../utils/api';
import KPICard from '../../components/KPICard';
import { Link, useNavigate } from 'react-router-dom';
import { getClientStatus } from '../../utils/logisticsHelper';

const LOGISTICS_INTERNAL_STATUSES = [
    'DOSSIER_OUVERT', 'RAMASSAGE', 'FORMALITES_EXPORT', 'EMBARQUEMENT',
    'EN_MER', 'EN_VOL', 'ARRIVEE_PORT',
    'DEPOT_DOUANE', 'COTATION', 'VISITE_SCANNER', 'BAE_VALIDE',
    'SORTIE_TERMINAL', 'LIVRAISON_COURS', 'LIVRE'
];

const AdminLogistics = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { getAllOrders, updateOrderStatus, createOrder } = useOrders();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showTrackingModal, setShowTrackingModal] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updateForm, setUpdateForm] = useState({
        status: '',
        location: '',
        comment: '',
        visibility: 'public',
        blNumber: '',
        bscNumber: '',
        attachments: [],
        currentStep: 1
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);



    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const data = await getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const stats = useMemo(() => {
        return {
            total: orders.length,
            inTransit: orders.filter(o => o.status === 'En Mer' || o.status === 'processing').length,
            urgent: orders.filter(o => o.status === 'Douane' || o.status === 'warning').length,
            delivered: orders.filter(o => o.status === 'delivered' || o.status === 'Livré').length
        };
    }, [orders]);


    const StatMiniCard = ({ label, value, icon: Icon, color }) => (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</p>
                <p className="text-xl font-black text-gray-900 mt-1">{value}</p>
            </div>
            <div className={`p-2 rounded-lg ${color}`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
        </div>
    );

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setSubmitting(true);
            const { image } = await uploadFile(file);
            setUpdateForm(prev => ({
                ...prev,
                attachments: [...prev.attachments, { url: image, type: 'proof', name: file.name }]
            }));
        } catch (err) {
            console.error(err);
            alert('Erreur lors de l\'upload');
        } finally {
            setSubmitting(false);
        }
    };

    const handleOpenUpdate = (order) => {
        setSelectedOrder(order);
        setUpdateForm({
            status: order.status,
            location: '',
            comment: '',
            visibility: 'public',
            blNumber: order.blNumber || '',
            bscNumber: order.bscNumber || '',
            attachments: [],
            currentStep: order.currentStep || 1
        });
        setIsDetailModalOpen(true);
    };

    const handleConfirmUpdate = async (orderId, overrideForm = null) => {
        const dataToLink = overrideForm || updateForm;
        try {
            setSubmitting(true);
            const updatePayload = {
                status: dataToLink.status,
                location: dataToLink.location,
                comment: dataToLink.comment,
                visibility: dataToLink.visibility,
                attachments: dataToLink.attachments,
                blNumber: dataToLink.blNumber,
                bscNumber: dataToLink.bscNumber,
                currentStep: dataToLink.currentStep || selectedOrder.currentStep
            };

            const res = await updateOrderStatus(orderId, updatePayload);
            if (res.alert) {
                alert(res.alert);
            }
            setIsDetailModalOpen(false);
            setSelectedOrder(null);
            fetchOrders(); // Refresh list
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la mise à jour');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusTheme = (status) => {
        const info = getClientStatus(status);
        switch (info.color) {
            case 'blue': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'orange': return 'bg-orange-50 text-orange-700 border-orange-100';
            case 'yellow': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            case 'green': return 'bg-green-50 text-green-700 border-green-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const getStatusStyle = (status) => {
        return getStatusTheme(status);
    };

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-outfit">Pôle Logistique (Admin)</h1>
                    <p className="text-gray-500">Supervision globale des flux d'import/export.</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard/admin-creation-dossier')}
                    className="bg-mdla-yellow text-mdla-black px-6 py-2.5 rounded-xl font-bold hover:bg-yellow-400 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                    <PlusCircle className="w-5 h-5" />
                    Nouveau Dossier
                </button>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Total Dossiers" value={stats.total} icon={Package} color="yellow" subtitle="Toutes périodes" />
                <KPICard title="En Transit" value={stats.inTransit} icon={Ship} color="blue" subtitle="Mer & Route" />
                <KPICard title="Blocages" value={stats.urgent} icon={AlertCircle} color="red" subtitle="Action requise" />
                <KPICard title="Livraisons" value={stats.delivered} icon={CheckCircle} color="green" subtitle="Ce mois-ci" />
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/20">
                    <h2 className="text-lg font-bold text-gray-900">Suivi des Dossiers</h2>
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-mdla-yellow/30 bg-white"
                            />
                        </div>
                        <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 bg-white">
                            <Filter className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">ID Dossier</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Client</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Type / Article</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Localisation</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                                <th className="px-6 py-4 text-right text-[11px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-mdla-yellow mx-auto" />
                                    </td>
                                </tr>
                            ) : orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-gray-900 text-sm">#{order.trackingNumber}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-gray-900">{order.user?.name || 'Inconnu'}</div>
                                        <div className="flex flex-col gap-1 mt-1">
                                            <div className="text-[10px] text-gray-400 font-medium truncate max-w-[120px]">{order.user?.email}</div>
                                            {order.creator && order.creator.name !== order.user?.name && (
                                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[9px] font-black uppercase tracking-widest w-fit">
                                                    <User className="w-2.5 h-2.5" />
                                                    Par {order.creator.name}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {order.type === 'vehicle' ? <Truck className="w-4 h-4 text-blue-500" /> : <Package className="w-4 h-4 text-orange-500" />}
                                            <span className="text-sm text-gray-700 font-medium truncate max-w-[150px]">
                                                {order.items?.[0]?.name || order.items?.[0]?.description || order.type}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
                                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                            {order.shippingDetails?.arrivalCity || order.shippingDetails?.city || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1.5 text-[11px] font-black rounded-full border ${getStatusTheme(order.status)} uppercase`}>
                                            {getClientStatus(order.status).label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                onClick={() => handleOpenUpdate(order)}
                                                className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-mdla-yellow hover:text-mdla-black transition-all shadow-sm"
                                                title="Détails & Mise à jour"
                                            >
                                                <Search className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => { setSelectedOrder(order); setShowTrackingModal(true); }}
                                                className="p-2 bg-mdla-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-md"
                                                title="Suivi client"
                                            >
                                                <ArrowUpRight className="w-4 h-4 text-mdla-yellow" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tracking Modal */}
            {showTrackingModal && selectedOrder && (
                <div className="fixed inset-0 bg-mdla-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 font-outfit">Suivi Dossier {selectedOrder.trackingNumber}</h3>
                                <p className="text-gray-500 font-medium">{selectedOrder.user?.name}</p>
                            </div>
                            <button onClick={() => setShowTrackingModal(false)} className="p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="relative pl-8 border-l-2 border-dashed border-gray-200 space-y-10 my-10 mx-4">
                            {selectedOrder.timeline?.map((step, index) => (
                                <div key={index} className="relative">
                                    <div className={`absolute -left-[42px] w-5 h-5 rounded-full border-4 ${step.status === 'completed' ? 'bg-green-500 border-green-100' : step.status === 'current' ? 'bg-mdla-yellow border-yellow-100 animate-pulse' : 'bg-gray-300 border-gray-100'}`}></div>
                                    <div>
                                        <h4 className={`text-sm font-black uppercase tracking-wider ${step.status === 'completed' ? 'text-gray-900' : 'text-gray-400'}`}>{step.title}</h4>
                                        <p className="text-xs text-gray-500 font-medium mt-1">{step.description}</p>
                                        {step.date && <p className="text-[10px] text-gray-400 mt-2 font-bold">{step.date}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end pt-6 border-t border-gray-100">
                            <button onClick={() => setShowTrackingModal(false)} className="px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors">
                                Fermer le suivi
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Dossier Detail Modal */}
            {isDetailModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-mdla-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[40px] shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in duration-300">
                        <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <span className={`px-3 py-1 text-[10px] font-black rounded-full border uppercase tracking-widest ${getStatusStyle(selectedOrder.status)} mb-2 inline-block`}>
                                    {selectedOrder.status}
                                </span>
                                <h3 className="text-3xl font-black text-gray-900 font-outfit uppercase tracking-tighter">Dossier {selectedOrder.trackingNumber}</h3>
                            </div>
                            <button onClick={() => setIsDetailModalOpen(false)} className="p-4 bg-white rounded-full text-gray-400 hover:text-gray-600 shadow-sm border border-gray-100">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-10 overflow-y-auto space-y-10 scrollbar-hide">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Client Info */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-2">Client</h4>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-mdla-yellow/10 rounded-2xl flex items-center justify-center">
                                            <User className="w-6 h-6 text-mdla-yellow" />
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900">{selectedOrder.user?.name || 'Inconnu'}</p>
                                            <p className="text-xs text-gray-500 font-medium">{selectedOrder.user?.email}</p>
                                        </div>
                                    </div>
                                    {selectedOrder.creator && (
                                        <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ouvert par</p>
                                            <p className="text-xs font-bold text-gray-700">{selectedOrder.creator.name} ({selectedOrder.creator.role})</p>
                                        </div>
                                    )}
                                </div>

                                {/* Logistics Info */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-2">Logistique</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                                <Globe className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-black uppercase">Origine</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedOrder.shippingDetails?.departureCountry || 'N/A'} - {selectedOrder.shippingDetails?.departureCity}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                                <MapPin className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-black uppercase">Destination</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedOrder.shippingDetails?.arrivalCountry || 'Sénégal'} - {selectedOrder.shippingDetails?.arrivalCity}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Merchandise Info */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-2">Marchandise</h4>
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                                            {selectedOrder.type === 'vehicle' ? <Truck className="w-6 h-6 text-blue-600" /> : <Package className="w-6 h-6 text-orange-600" />}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900">{selectedOrder.items?.[0]?.name || selectedOrder.items?.[0]?.description || 'Sans description'}</p>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter mt-1">{selectedOrder.type}</p>
                                            <div className="mt-2 text-lg font-black text-mdla-black">
                                                {new Intl.NumberFormat('fr-FR').format(selectedOrder.totalAmount)} <span className="text-xs font-bold text-gray-400">FCFA</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Section */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-2">Timeline Technique & Preuves</h4>
                                <div className="space-y-8 relative pl-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                                    {(selectedOrder.events || []).map((event, idx) => (
                                        <div key={event.id} className="relative">
                                            <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full border-4 border-white shadow-md flex items-center justify-center z-10 ${idx === 0 ? 'bg-mdla-yellow animate-pulse scale-125' : 'bg-gray-300'}`}>
                                                {idx === 0 && <Clock className="w-3 h-3 text-mdla-black" />}
                                            </div>
                                            <div className="bg-white rounded-2xl p-4 border border-gray-50 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${getStatusStyle(event.status)}`}>
                                                        {getClientStatus(event.status).label}
                                                    </span>
                                                    <span className="text-[9px] text-gray-400 font-bold">{new Date(event.eventDate).toLocaleString('fr-FR')}</span>
                                                </div>
                                                <p className="text-sm font-black text-gray-900 mt-1 uppercase tracking-tighter">{event.comment || 'Mise à jour sans commentaire'}</p>

                                                {/* Proofs for this event */}
                                                <div className="flex gap-2 mt-3">
                                                    {(selectedOrder.attachments || [])
                                                        .filter(a => a.shipmentEventId === event.id && a.type === 'proof')
                                                        .map(img => (
                                                            <button key={img.id} className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-lg hover:scale-105 transition-all">
                                                                <img src={img.filePath} alt="Preuve" className="w-full h-full object-cover" />
                                                            </button>
                                                        ))}
                                                </div>

                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold uppercase">
                                                        <MapPin className="w-3 h-3" /> {event.location || 'N/A'}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold uppercase">
                                                        <User className="w-3 h-3" /> {event.agent?.name || 'Agent MDLA'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Expert Refs Block */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Numéro B/L (Bill of Lading)</label>
                                    <p className="text-sm font-black text-gray-900">{selectedOrder.blNumber || 'Non renseigné'}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Numéro BSC / BESC</label>
                                    <p className="text-sm font-black text-gray-900">{selectedOrder.bscNumber || 'Non renseigné'}</p>
                                </div>
                            </div>

                            {/* Action Section (Update Status) */}
                            <div className="bg-gray-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group/action">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover/action:scale-110 transition-transform">
                                    <TrendingUp className="w-24 h-24" />
                                </div>
                                <div className="relative z-10 space-y-6">
                                    <h4 className="text-[11px] font-black text-mdla-yellow uppercase tracking-[0.3em]">Mise à jour du dossier (Admin)</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Statut Interne</label>
                                                <select
                                                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-3 font-bold text-white focus:outline-none focus:ring-2 focus:ring-mdla-yellow/50 appearance-none text-sm"
                                                    value={updateForm.status}
                                                    onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                                                >
                                                    {LOGISTICS_INTERNAL_STATUSES.map(s => (
                                                        <option key={s} value={s} className="text-gray-900">{s} ({getClientStatus(s).label})</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Localisation Actuelle</label>
                                                <LocationSelector
                                                    label=""
                                                    onLocationSelect={({ city, country }) => setUpdateForm({ ...updateForm, location: `${city}, ${country}` })}
                                                    defaultCountry="Sénégal"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">N° B/L</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-3 font-bold text-white focus:outline-none focus:ring-2 focus:ring-mdla-yellow/50 text-xs"
                                                        value={updateForm.blNumber}
                                                        onChange={(e) => setUpdateForm({ ...updateForm, blNumber: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">N° BSC</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-3 font-bold text-white focus:outline-none focus:ring-2 focus:ring-mdla-yellow/50 text-xs"
                                                        value={updateForm.bscNumber}
                                                        onChange={(e) => setUpdateForm({ ...updateForm, bscNumber: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Visibilité Client</label>
                                                <select
                                                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-3 font-bold text-white focus:outline-none focus:ring-2 focus:ring-mdla-yellow/50 appearance-none text-sm"
                                                    value={updateForm.visibility}
                                                    onChange={(e) => setUpdateForm({ ...updateForm, visibility: e.target.value })}
                                                >
                                                    <option value="public" className="text-gray-900">Public (Visible client)</option>
                                                    <option value="internal" className="text-gray-900">Interne (MDLA uniquement)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Commentaire / Instructions</label>
                                        <textarea
                                            className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-3 font-medium text-white focus:outline-none focus:ring-2 focus:ring-mdla-yellow/50 text-sm"
                                            rows="2"
                                            value={updateForm.comment}
                                            onChange={(e) => setUpdateForm({ ...updateForm, comment: e.target.value })}
                                        />
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Preuves Photos (Proofs)</label>
                                            <div className="flex flex-wrap gap-2">
                                                {updateForm.attachments.map((att, idx) => (
                                                    <div key={idx} className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/20">
                                                        <img src={att.url} alt="Proof" className="w-full h-full object-cover" />
                                                        <button
                                                            onClick={() => setUpdateForm(prev => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== idx) }))}
                                                            className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg"
                                                        >
                                                            <X className="w-2 h-2" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <label className="w-12 h-12 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-mdla-yellow transition-colors bg-white/5">
                                                    <Camera className="w-4 h-4 text-white/40" />
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={submitting} />
                                                </label>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleConfirmUpdate(selectedOrder.id)}
                                            disabled={submitting}
                                            className="bg-mdla-yellow text-mdla-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-yellow-400 transition-all shadow-lg flex items-center gap-2 group/btn disabled:opacity-50"
                                        >
                                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                                <>
                                                    Enregistrer
                                                    <CheckCircle className="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <Shield className="w-5 h-5 text-mdla-yellow" />
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-white">Sécurité & Traçabilité</p>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase">Cette action sera enregistrée au nom de {user?.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-10 py-8 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-tighter">Créé le {new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <button onClick={() => setIsDetailModalOpen(false)} className="px-10 py-4 bg-mdla-black text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-gray-800 transition-all shadow-lg text-white">
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLogistics;
