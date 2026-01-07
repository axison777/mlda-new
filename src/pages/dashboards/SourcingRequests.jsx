import React, { useState } from 'react';
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
    UploadCloud
} from 'lucide-react';

const SourcingRequests = () => {
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Mock Data
    const requests = [
        { id: 'REQ-001', client: 'Ahmed Sylla', item: 'Toyota Land Cruiser V8', year: '2020-2022', budget: '45.000.000 FCFA', date: '2023-10-28', status: 'En attente' },
        { id: 'REQ-002', client: 'Entreprise BTP', item: 'Caterpillar 320D', year: '2015+', budget: '60.000.000 FCFA', date: '2023-10-27', status: 'En cours' },
        { id: 'REQ-003', client: 'Sarah Konan', item: 'Range Rover Evoque', year: '2019', budget: '25.000.000 FCFA', date: '2023-10-26', status: 'En attente' },
        { id: 'REQ-004', client: 'Garage Moderne', item: 'Moteur Mercedes OM651', year: 'N/A', budget: '2.500.000 FCFA', date: '2023-10-25', status: 'Traité' },
    ];

    const handleOpenOffer = (request) => {
        setSelectedRequest(request);
        setIsOfferModalOpen(true);
    };

    const handleCloseOffer = () => {
        setIsOfferModalOpen(false);
        setSelectedRequest(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Demandes de Devis (Sourcing)</h1>
                    <p className="text-gray-500">Répondez aux demandes de recherche de véhicules et marchandises.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-mdla-black text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    <Search className="w-4 h-4" />
                    Créer une demande
                </button>
            </div>

            {/* Request List */}
            <div className="grid grid-cols-1 gap-4">
                {requests.map((request) => (
                    <div key={request.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-yellow-50 rounded-lg">
                                <Car className="w-6 h-6 text-mdla-yellow" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-gray-900 text-lg">{request.item}</span>
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">{request.id}</span>
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                    Client: <span className="font-medium text-gray-900">{request.client}</span> • Année: {request.year}
                                </div>
                                <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-bold">
                                    <DollarSign className="w-4 h-4" />
                                    Budget Max: {request.budget}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                            <span className="text-xs text-gray-400">Reçu le {request.date}</span>
                            {request.status === 'Traité' ? (
                                <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg font-bold flex items-center gap-2 cursor-not-allowed">
                                    <CheckCircle className="w-4 h-4" />
                                    Offre Envoyée
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleOpenOffer(request)}
                                    className="px-6 py-2 bg-mdla-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
                                >
                                    <Send className="w-4 h-4" />
                                    Répondre / Faire une Offre
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Offer Modal */}
            {isOfferModalOpen && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">Envoyer une Offre</h3>
                            <button onClick={handleCloseOffer} className="text-gray-400 hover:text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6">
                            {/* Context */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex justify-between items-center">
                                <div>
                                    <div className="text-sm text-blue-600 font-bold uppercase tracking-wider mb-1">Demande Client</div>
                                    <div className="font-bold text-blue-900">{selectedRequest.item} ({selectedRequest.year})</div>
                                    <div className="text-sm text-blue-700">Budget: {selectedRequest.budget}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column: Vehicle Details */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-gray-900 border-b pb-2">Détails du Véhicule Trouvé</h4>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Modèle Exact & Année</label>
                                        <input type="text" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50" placeholder="Ex: Toyota Land Cruiser V8 2021" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kilométrage</label>
                                        <input type="text" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50" placeholder="Ex: 45.000 km" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Photos (Max 5)</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors">
                                            <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <span className="text-sm text-gray-500">Cliquez pour uploader</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Pricing */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-gray-900 border-b pb-2">Offre Financière</h4>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Prix Achat (EUR/USD)</label>
                                        <input type="number" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50" placeholder="0" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Frais Logistique & Douane (Estimé)</label>
                                        <input type="number" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50" placeholder="0" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Commission MDLA</label>
                                        <input type="number" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50" placeholder="0" />
                                    </div>

                                    <div className="pt-4 border-t">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-gray-700">Total Rendu Port (CFA)</span>
                                            <span className="font-bold text-xl text-mdla-yellow">0 FCFA</span>
                                        </div>
                                        <p className="text-xs text-gray-400 text-right">Ce montant sera envoyé au client.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button onClick={handleCloseOffer} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
                                Annuler
                            </button>
                            <button onClick={handleCloseOffer} className="px-6 py-2 bg-mdla-yellow text-mdla-black font-bold rounded-lg hover:bg-yellow-400 flex items-center gap-2">
                                <Send className="w-4 h-4" />
                                Envoyer l'Offre au Client
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Request Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">Nouvelle Demande de Sourcing</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Client</label>
                                <input type="text" className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Nom complet" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Véhicule / Marchandise recherchée</label>
                                <input type="text" className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Ex: Toyota RAV4 2020" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Max (FCFA)</label>
                                <input type="text" className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Ex: 15.000.000" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Détails supplémentaires</label>
                                <textarea className="w-full p-2 border border-gray-300 rounded-lg h-24" placeholder="Couleur, options, etc."></textarea>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
                                Annuler
                            </button>
                            <button onClick={() => setIsCreateModalOpen(false)} className="px-6 py-2 bg-mdla-yellow text-mdla-black font-bold rounded-lg hover:bg-yellow-400">
                                Créer la demande
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SourcingRequests;
