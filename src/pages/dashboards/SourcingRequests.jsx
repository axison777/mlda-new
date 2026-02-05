import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    MessageSquare,
    Camera,
    DollarSign,
    Send,
    Car,
    CheckCircle,
    X,
    UploadCloud,
    Loader,
    Clock,
    PlusCircle,
    ArrowUpRight,
    Tag,
    Briefcase
} from 'lucide-react';
import api from '../../utils/api';

const SourcingRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [offerForm, setOfferForm] = useState({
        price: '',
        estimatedTime: '',
        notes: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/sourcing');
            setRequests(data);
        } catch (err) {
            console.error('Erreur lors du chargement des demandes', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleOpenOffer = (request) => {
        setSelectedRequest(request);
        setOfferForm({
            price: '',
            estimatedTime: '',
            notes: ''
        });
        setIsOfferModalOpen(true);
    };

    const handleCloseOffer = () => {
        setIsOfferModalOpen(false);
        setSelectedRequest(null);
    };

    const handleSubmitOffer = async () => {
        if (!selectedRequest) return;
        try {
            setSubmitting(true);
            await api.post(`/sourcing/${selectedRequest.id}/offer`, offerForm);
            alert('Offre envoyée avec succès !');
            handleCloseOffer();
            fetchRequests();
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'envoi de l'offre");
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            case 'offer_sent': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'accepted': return 'bg-green-50 text-green-700 border-green-100';
            case 'rejected': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'En Recherche';
            case 'offer_sent': return 'Offre Envoyée';
            case 'accepted': return 'Acceptée';
            case 'rejected': return 'Refusée';
            default: return status;
        }
    };

    if (loading && !requests.length) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader className="w-10 h-10 animate-spin text-mdla-yellow" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 font-outfit">Sourcing & Devis</h1>
                    <p className="text-gray-500 font-medium">Réponses aux demandes de recherche personnalisées.</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
                        <Filter className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="bg-mdla-black text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg">
                        <PlusCircle className="w-5 h-5 text-mdla-yellow" />
                        Nouvelle Demande
                    </button>
                </div>
            </div>

            {/* Request Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {requests.length > 0 ? requests.map((request) => (
                    <div key={request.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div className={`p-3 rounded-2xl ${request.type === 'vehicle' ? 'bg-blue-50' : 'bg-orange-50'}`}>
                                    <Car className={`w-6 h-6 ${request.type === 'vehicle' ? 'text-blue-600' : 'text-orange-600'}`} />
                                </div>
                                <span className={`px-3 py-1 text-[10px] font-black rounded-full border uppercase tracking-wider ${getStatusStyle(request.status)}`}>
                                    {getStatusLabel(request.status)}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-xl font-black text-gray-900 group-hover:text-mdla-black transition-colors">{request.itemRequested}</h3>
                                <div className="flex items-center gap-2 mt-1 text-gray-400 font-bold text-xs uppercase tracking-widest">
                                    <Briefcase className="w-3 h-3" />
                                    {request.clientName}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Budget Max</p>
                                    <p className="text-gray-900 font-black flex items-center gap-1">
                                        {new Intl.NumberFormat('fr-FR').format(request.budget)}
                                        <span className="text-xs font-bold text-gray-400">FCFA</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Délai Souhaité</p>
                                    <p className="text-gray-900 font-bold flex items-center gap-1">
                                        <Clock className="w-4 h-4 text-mdla-yellow" />
                                        Asap
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                Reçu le {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                            {request.status === 'offer_sent' || request.status === 'accepted' ? (
                                <button disabled className="px-6 py-2.5 bg-gray-50 text-gray-400 rounded-xl font-black text-xs flex items-center gap-2 border border-gray-100 cursor-not-allowed uppercase tracking-widest">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Offre Transmise
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleOpenOffer(request)}
                                    className="px-6 py-2.5 bg-mdla-black text-white rounded-xl font-black text-xs hover:bg-gray-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg uppercase tracking-widest group/btn"
                                >
                                    <Send className="w-4 h-4 text-mdla-yellow" />
                                    Faire une Offre
                                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-opacity ml-1" />
                                </button>
                            )}
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full bg-white p-20 text-center rounded-[40px] border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Tag className="w-10 h-10 text-gray-200" />
                        </div>
                        <h2 className="text-xl font-black text-gray-900">Aucune demande en attente</h2>
                        <p className="text-gray-400 font-medium mt-2 max-w-sm mx-auto">Toutes les demandes de sourcing ont été traitées ou sont archivées.</p>
                    </div>
                )}
            </div>

            {/* Offer Modal */}
            {isOfferModalOpen && selectedRequest && (
                <div className="fixed inset-0 bg-mdla-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[40px] shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in duration-300">
                        <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 font-outfit">Proposition Commerciale</h3>
                                <p className="text-gray-500 font-medium">Soumission d'offre pour {selectedRequest.itemRequested}</p>
                            </div>
                            <button onClick={handleCloseOffer} className="p-3 bg-white rounded-full text-gray-400 hover:text-gray-600 shadow-sm border border-gray-100">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-10 overflow-y-auto space-y-8 scrollbar-hide">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-2">Informations Financières</h4>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-600 ml-1">Prix de vente proposé (FCFA)</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-mdla-yellow w-5 h-5" />
                                                <input
                                                    type="number"
                                                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-mdla-yellow/50 font-black text-lg placeholder:text-gray-300"
                                                    placeholder="0.00"
                                                    value={offerForm.price}
                                                    onChange={(e) => setOfferForm({ ...offerForm, price: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-600 ml-1">Délai estimé de livraison</label>
                                            <div className="relative">
                                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                <input
                                                    type="text"
                                                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-mdla-yellow/50 font-bold"
                                                    placeholder="Ex: 14 jours ouvrés"
                                                    value={offerForm.estimatedTime}
                                                    onChange={(e) => setOfferForm({ ...offerForm, estimatedTime: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-2">Détails Techniques & Photos</h4>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-600 ml-1">Description détaillée de l'offre</label>
                                            <textarea
                                                className="w-full p-5 bg-gray-50 border-none rounded-2xl h-32 focus:ring-2 focus:ring-mdla-yellow/50 font-medium placeholder:text-gray-300 resize-none"
                                                placeholder="Précisez l'état, les options, le modèle exact..."
                                                value={offerForm.notes}
                                                onChange={(e) => setOfferForm({ ...offerForm, notes: e.target.value })}
                                            ></textarea>
                                        </div>
                                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-50 transition-all cursor-pointer group">
                                            <UploadCloud className="w-10 h-10 text-gray-300 mx-auto mb-2 group-hover:text-mdla-yellow transition-colors" />
                                            <p className="text-xs font-bold text-gray-400 group-hover:text-gray-600">Ajouter des photos du produit</p>
                                            <p className="text-[9px] text-gray-300 uppercase tracking-widest mt-1">Format JPG, PNG (Max 5Mo)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-10 py-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
                            <button onClick={handleCloseOffer} className="px-8 py-4 text-gray-500 font-black uppercase tracking-widest text-xs hover:bg-gray-100 rounded-2xl transition-all" disabled={submitting}>
                                Annuler
                            </button>
                            <button
                                onClick={handleSubmitOffer}
                                className="px-10 py-4 bg-mdla-black text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-gray-800 flex items-center gap-3 shadow-2xl hover:shadow-mdla-yellow/20 disabled:opacity-50 transition-all"
                                disabled={submitting}
                            >
                                {submitting ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 text-mdla-yellow" />}
                                Transmettre au Client
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SourcingRequests;
