import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useOrders } from '../../context/OrdersContext';
import {
    Search,
    MapPin,
    Truck,
    Package,
    CheckCircle,
    X,
    Loader,
    PlusCircle,
    ArrowUpRight,
    User,
    Calendar,
    Globe,
    Ship,
    AlertCircle,
    Anchor,
    Shield,
    Camera
} from 'lucide-react';
import { getClientStatus } from '../../utils/logisticsHelper';
import { uploadFile } from '../../utils/api';

const LOGISTICS_INTERNAL_STATUSES = [
    'DOSSIER_OUVERT', 'RAMASSAGE', 'FORMALITES_EXPORT', 'EMBARQUEMENT',
    'EN_MER', 'EN_VOL', 'ARRIVEE_PORT',
    'DEPOT_DOUANE', 'COTATION', 'VISITE_SCANNER', 'BAE_VALIDE',
    'SORTIE_TERMINAL', 'LIVRAISON_COURS', 'LIVRE'
];

const ActiveShipments = () => {
    const { orders, loading, updateOrderStatus } = useOrders();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Auto-open modal if navigated from another page with state
    useEffect(() => {
        if (location.state?.openTrackingNumber && orders.length > 0) {
            const target = orders.find(o => o.trackingNumber === location.state.openTrackingNumber);
            if (target) {
                setSelectedShipment(target);
                setIsDetailModalOpen(true);
                // Clear state to prevent reopening on reload/refocus (optional but good practice)
                window.history.replaceState({}, document.title);
            }
        }
    }, [location.state, orders]);
    const [updateForm, setUpdateForm] = useState({
        status: '',
        location: '',
        comment: '',
        visibility: 'public',
        blNumber: '',
        bscNumber: '',
        attachments: [] // For proofs
    });
    const [submitting, setSubmitting] = useState(false);

    const logisticsOrders = useMemo(() =>
        orders.filter(o => ['vehicle', 'container', 'bulk'].includes(o.type)),
        [orders]);

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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'En Mer': return Ship;
            case 'Douane': return AlertCircle;
            case 'Livraison': return Truck;
            case 'Livré': return CheckCircle;
            default: return Package;
        }
    };

    const handleOpenUpdate = (shipment) => {
        setSelectedShipment(shipment);
        setUpdateForm({
            status: shipment.status,
            location: '',
            comment: '',
            visibility: 'public',
            blNumber: shipment.blNumber || '',
            bscNumber: shipment.bscNumber || '',
            attachments: []
        });
        setIsUpdateModalOpen(true);
    };

    const handleCloseUpdate = () => {
        setIsUpdateModalOpen(false);
        setSelectedShipment(null);
    };

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

    const handleConfirmUpdate = async () => {
        try {
            setSubmitting(true);
            const res = await updateOrderStatus(selectedShipment.id, updateForm);

            if (res.alert) {
                alert(res.alert);
            }

            setIsUpdateModalOpen(false);
            setIsDetailModalOpen(false);
            setSelectedShipment(null);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Erreur lors de la mise à jour');
        } finally {
            setSubmitting(false);
        }
    };

    // Mini KPIs for top section
    const stats = useMemo(() => ({
        total: logisticsOrders.length,
        inTransit: logisticsOrders.filter(o => ['EN_MER', 'EN_VOL'].includes(o.status)).length,
        atPort: logisticsOrders.filter(o => o.status === 'ARRIVEE_PORT').length,
        completed: logisticsOrders.filter(o => o.status === 'LIVRE').length
    }), [logisticsOrders]);

    const filteredShipments = logisticsOrders.filter(shipment => {
        const clientName = shipment.user?.name || '';
        const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (shipment.items?.[0]?.description || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = statusFilter === 'all' || shipment.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

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

    if (loading && !orders.length) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader className="w-8 h-8 animate-spin text-mdla-yellow" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-outfit">Pôle Expéditions</h1>
                    <p className="text-gray-500">Suivi détaillé des dossiers import/export.</p>
                </div>
                <Link
                    to="/dashboard/transit-nouveau"
                    className="bg-mdla-black text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                    <PlusCircle className="w-5 h-5 text-mdla-yellow" />
                    Ouvrir un Dossier
                </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatMiniCard label="Total Dossiers" value={stats.total} icon={Package} color="bg-mdla-black" />
                <StatMiniCard label="En Transit" value={stats.inTransit} icon={Anchor} color="bg-blue-600" />
                <StatMiniCard label="Arrivée Port" value={stats.atPort} icon={MapPin} color="bg-orange-600" />
                <StatMiniCard label="Livrés" value={stats.completed} icon={CheckCircle} color="bg-green-600" />
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Filters Row */}
                <div className="p-4 border-b border-gray-50 flex flex-col md:flex-row gap-4 bg-gray-50/30">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Rechercher par ID, Client, Article..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mdla-yellow/30 text-sm transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {['all', 'DOSSIER_OUVERT', 'EMBARQUEMENT', 'EN_MER', 'COTATION', 'LIVRE'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all uppercase tracking-tighter ${statusFilter === status
                                    ? 'bg-mdla-yellow text-mdla-black shadow-md'
                                    : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-100 shadow-sm'
                                    }`}
                            >
                                {status === 'all' ? 'Tous les dossiers' : getClientStatus(status).label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Tracking ID</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Client & Destination</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Marchandise</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">MAJ</th>
                                <th className="px-6 py-4 text-right text-[11px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredShipments.map((shipment) => {
                                const StatusIcon = getStatusIcon(shipment.status);
                                return (
                                    <tr
                                        key={shipment.id}
                                        className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                        onClick={() => {
                                            setSelectedShipment(shipment);
                                            setIsDetailModalOpen(true);
                                        }}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-600">
                                                    #{shipment.id.toString().slice(-2)}
                                                </div>
                                                <span className="font-bold text-gray-900 text-sm">{shipment.trackingNumber}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">{shipment.user?.name || 'Inconnu'}</div>
                                            <div className="flex flex-col gap-1 mt-1">
                                                <div className="text-[10px] text-gray-500 flex items-center gap-1 font-bold">
                                                    <MapPin className="w-3 h-3" /> {shipment.shippingDetails?.arrivalCountry || shipment.shippingDetails?.city || 'Sénégal'}
                                                </div>
                                                {shipment.creator && shipment.creator.name !== shipment.user?.name && (
                                                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[9px] font-black uppercase tracking-widest w-fit">
                                                        <User className="w-2.5 h-2.5" />
                                                        Par {shipment.creator.name}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700 font-medium truncate max-w-[180px]">{shipment.items?.[0]?.description || shipment.items?.[0]?.name || 'Sans description'}</div>
                                            <div className="flex items-center gap-1 mt-1">
                                                {shipment.type === 'vehicle' ? <Truck className="w-3 h-3 text-blue-500" /> : <Package className="w-3 h-3 text-orange-500" />}
                                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">{shipment.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1.5 inline-flex items-center gap-1.5 text-[10px] font-black rounded-full border uppercase tracking-widest ${getStatusTheme(shipment.status)}`}>
                                                {getClientStatus(shipment.status).label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                                            {new Date(shipment.updatedAt).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => {
                                                        setSelectedShipment(shipment);
                                                        setIsDetailModalOpen(true);
                                                    }}
                                                    className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-mdla-yellow hover:text-mdla-black transition-all shadow-sm"
                                                    title="Détails"
                                                >
                                                    <Search className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenUpdate(shipment)}
                                                    className="px-4 py-2 bg-mdla-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-md"
                                                >
                                                    MAJ
                                                    <ArrowUpRight className="w-3 h-3 text-mdla-yellow" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredShipments.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center">
                                        <div className="max-w-xs mx-auto">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Search className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="text-gray-400 font-bold">Aucun dossier trouvé</p>
                                            <p className="text-xs text-gray-300 mt-1">Essayez d'ajuster vos filtres de recherche</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Update Modal */}
            {isUpdateModalOpen && selectedShipment && (
                <div className="fixed inset-0 bg-mdla-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-8 duration-300">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-black text-gray-900">Mise à jour Dossier</h3>
                            <button onClick={handleCloseUpdate} className="p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8 space-y-5">
                            {/* Selected Info */}
                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                    {selectedShipment.type === 'vehicle' ? <Truck className="w-6 h-6 text-blue-600" /> : <Package className="w-6 h-6 text-orange-600" />}
                                </div>
                                <div className="flex-1">
                                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{selectedShipment.trackingNumber}</div>
                                    <div className="text-gray-900 font-black text-sm uppercase">{selectedShipment.items?.[0]?.description?.substring(0, 30)}...</div>
                                    <div className="text-[10px] text-gray-500 font-bold">{selectedShipment.user?.name}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Statut Logistique</label>
                                    <select
                                        className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-mdla-yellow/50 text-gray-900 font-bold appearance-none cursor-pointer text-xs"
                                        value={updateForm.status}
                                        onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                                    >
                                        {LOGISTICS_INTERNAL_STATUSES.map(s => (
                                            <option key={s} value={s}>{getClientStatus(s).label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Localisation</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-mdla-yellow/50 font-bold text-xs"
                                        placeholder="Ville, Port..."
                                        value={updateForm.location}
                                        onChange={(e) => setUpdateForm({ ...updateForm, location: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Commentaire / Timeline</label>
                                <textarea
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-mdla-yellow/50 font-medium text-xs h-20"
                                    placeholder="Expliquez ce qui se passe pour le client..."
                                    value={updateForm.comment}
                                    onChange={(e) => setUpdateForm({ ...updateForm, comment: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400">Numéro B/L</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold"
                                        value={updateForm.blNumber}
                                        onChange={(e) => setUpdateForm({ ...updateForm, blNumber: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400">Numéro BSC</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold"
                                        value={updateForm.bscNumber}
                                        onChange={(e) => setUpdateForm({ ...updateForm, bscNumber: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Preuves Photos (Proofs)</label>
                                <div className="flex flex-wrap gap-2">
                                    {updateForm.attachments.map((att, idx) => (
                                        <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                            <img src={att.url} alt="Proof" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => setUpdateForm(prev => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== idx) }))}
                                                className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-mdla-yellow transition-colors bg-gray-50">
                                        <Camera className="w-5 h-5 text-gray-400" />
                                        <span className="text-[8px] font-black text-gray-400 mt-1 uppercase">Ajouter</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={submitting} />
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center justify-between bg-amber-50 p-4 rounded-2xl border border-amber-100">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <p className="text-xs font-black text-amber-900 uppercase">Visibilité Client</p>
                                        <p className="text-[10px] text-amber-600 font-bold">Le client voit cette étape</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setUpdateForm({ ...updateForm, visibility: updateForm.visibility === 'public' ? 'internal' : 'public' })}
                                    className={`w-12 h-6 rounded-full transition-all relative ${updateForm.visibility === 'public' ? 'bg-amber-500' : 'bg-gray-300'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${updateForm.visibility === 'public' ? 'right-1' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>

                        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex gap-4">
                            <button
                                onClick={handleCloseUpdate}
                                className="flex-1 px-4 py-4 text-gray-500 font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 rounded-2xl transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleConfirmUpdate}
                                className="flex-[2] px-4 py-4 bg-mdla-black text-white font-black uppercase text-[10px] tracking-widest hover:bg-gray-800 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group"
                                disabled={submitting}
                            >
                                {submitting ? <Loader className="w-5 h-5 animate-spin" /> : 'Enregistrer la MAJ'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Dossier Detail Modal */}
            {isDetailModalOpen && selectedShipment && (
                <div className="fixed inset-0 bg-mdla-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[40px] shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in duration-300">
                        <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <span className={`px-3 py-1 text-[10px] font-black rounded-full border uppercase tracking-widest ${getStatusTheme(selectedShipment.status)} mb-2 inline-block`}>
                                    {selectedShipment.status}
                                </span>
                                <h3 className="text-3xl font-black text-gray-900 font-outfit uppercase tracking-tighter">Dossier {selectedShipment.trackingNumber}</h3>
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
                                            <p className="font-black text-gray-900">{selectedShipment.user?.name || 'Inconnu'}</p>
                                            <p className="text-xs text-gray-500 font-medium">{selectedShipment.user?.email}</p>
                                        </div>
                                    </div>
                                    {selectedShipment.creator && (
                                        <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ouvert par</p>
                                            <p className="text-xs font-bold text-gray-700">{selectedShipment.creator.name} ({selectedShipment.creator.role})</p>
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
                                                <p className="text-sm font-bold text-gray-900">{selectedShipment.shippingDetails?.departureCountry || 'N/A'} - {selectedShipment.shippingDetails?.departureCity}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                                <MapPin className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-black uppercase">Destination</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedShipment.shippingDetails?.arrivalCountry || 'Sénégal'} - {selectedShipment.shippingDetails?.arrivalCity}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Merchandise Info */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-2">Marchandise</h4>
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                                            {selectedShipment.type === 'vehicle' ? <Truck className="w-6 h-6 text-blue-600" /> : <Package className="w-6 h-6 text-orange-600" />}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900">{selectedShipment.items?.[0]?.description || 'Sans description'}</p>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter mt-1">{selectedShipment.type}</p>
                                            <div className="mt-2 text-lg font-black text-mdla-black">
                                                {new Intl.NumberFormat('fr-FR').format(selectedShipment.totalAmount)} <span className="text-xs font-bold text-gray-400">FCFA</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Technique Section */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-2">Timeline Technique (Journal d'agence)</h4>
                                <div className="space-y-4">
                                    {(selectedShipment.events || []).map((event, idx) => (
                                        <div key={event.id} className="flex gap-4 items-start p-4 bg-gray-50 rounded-2xl border border-gray-100 group/ev">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 font-black text-[10px] text-gray-400 uppercase">
                                                {new Date(event.eventDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${getStatusTheme(event.status)}`}>
                                                        {event.status}
                                                    </span>
                                                    <span className="text-[9px] text-gray-400 font-bold">{new Date(event.eventDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <p className="text-xs font-black text-gray-900 mt-1 uppercase tracking-tighter">{event.comment || 'Mise à jour sans commentaire'}</p>

                                                {/* Proofs for this event */}
                                                <div className="flex gap-2 mt-3">
                                                    {(selectedShipment.attachments || [])
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
                                                        <User className="w-3 h-3" /> {event.agent?.name || 'Agent'}
                                                    </div>
                                                    {event.visibility === 'internal' && (
                                                        <div className="flex items-center gap-1 text-[9px] text-red-400 font-black uppercase">
                                                            <Shield className="w-3 h-3" /> Interne
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="px-10 py-8 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-tighter">Créé le {new Date(selectedShipment.createdAt).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <button onClick={() => setIsDetailModalOpen(false)} className="px-10 py-4 bg-mdla-black text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-gray-800 transition-all shadow-lg">
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActiveShipments;
