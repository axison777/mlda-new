import React, { useState } from 'react';
import {
    User,
    Package,
    MapPin,
    ArrowRight,
    CheckCircle,
    Search,
    Plus,
    Truck,
    Plane,
    Ship
} from 'lucide-react';

const CreateFolder = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        client: '',
        clientType: 'existing', // existing or new
        merchandiseType: 'vehicle',
        description: '',
        value: '',
        departure: '',
        arrival: '',
        transportMode: 'sea'
    });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const StepIndicator = ({ number, title, active, completed }) => (
        <div className={`flex items-center gap-2 ${active ? 'text-mdla-black' : completed ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${active ? 'bg-mdla-yellow text-mdla-black' :
                    completed ? 'bg-green-100 text-green-600' : 'bg-gray-100'
                }`}>
                {completed ? <CheckCircle className="w-5 h-5" /> : number}
            </div>
            <span className={`font-medium ${active ? 'font-bold' : ''}`}>{title}</span>
            {number < 3 && <div className="w-12 h-0.5 bg-gray-200 mx-2 hidden md:block"></div>}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Ouvrir un Nouveau Dossier</h1>
                <p className="text-gray-500">Créez un dossier d'import/export pour un client.</p>
            </div>

            {/* Stepper */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex justify-between md:justify-start md:gap-8 overflow-x-auto">
                <StepIndicator number={1} title="Client" active={step === 1} completed={step > 1} />
                <StepIndicator number={2} title="Marchandise" active={step === 2} completed={step > 2} />
                <StepIndicator number={3} title="Logistique" active={step === 3} completed={step > 3} />
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8">
                    {/* Step 1: Client */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Informations Client</h2>

                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={() => setFormData({ ...formData, clientType: 'existing' })}
                                    className={`flex-1 py-3 px-4 rounded-lg border text-center font-medium transition-colors ${formData.clientType === 'existing'
                                            ? 'border-mdla-yellow bg-yellow-50 text-mdla-black ring-1 ring-mdla-yellow'
                                            : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    Client Existant
                                </button>
                                <button
                                    onClick={() => setFormData({ ...formData, clientType: 'new' })}
                                    className={`flex-1 py-3 px-4 rounded-lg border text-center font-medium transition-colors ${formData.clientType === 'new'
                                            ? 'border-mdla-yellow bg-yellow-50 text-mdla-black ring-1 ring-mdla-yellow'
                                            : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    Nouveau Client
                                </button>
                            </div>

                            {formData.clientType === 'existing' ? (
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher un client</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                            placeholder="Nom, Email ou Téléphone..."
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom Complet</label>
                                        <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                        <input type="tel" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Merchandise */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Détails de la Marchandise</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type de Marchandise</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: 'vehicle', label: 'Véhicule', icon: Truck },
                                        { id: 'container', label: 'Conteneur', icon: Ship },
                                        { id: 'parcel', label: 'Colis / Vrac', icon: Package }
                                    ].map((type) => {
                                        const Icon = type.icon;
                                        return (
                                            <button
                                                key={type.id}
                                                onClick={() => setFormData({ ...formData, merchandiseType: type.id })}
                                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.merchandiseType === type.id
                                                        ? 'border-mdla-yellow bg-yellow-50 ring-1 ring-mdla-yellow'
                                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <Icon className={`w-6 h-6 ${formData.merchandiseType === type.id ? 'text-mdla-black' : 'text-gray-400'}`} />
                                                <span className={`font-medium ${formData.merchandiseType === type.id ? 'text-mdla-black' : 'text-gray-600'}`}>
                                                    {type.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description Détaillée</label>
                                <textarea
                                    rows="3"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                    placeholder="Ex: Toyota RAV4 2020, VIN: JTE..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Valeur Déclarée (FCFA)</label>
                                <input type="number" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50" placeholder="0" />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Logistics */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Logistique & Transport</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Point de Départ</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input type="text" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50" placeholder="Ville, Pays" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination Finale</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input type="text" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50" placeholder="Ville, Pays" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mode de Transport Principal</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 flex-1">
                                        <input type="radio" name="transport" className="text-mdla-yellow focus:ring-mdla-yellow" defaultChecked />
                                        <Ship className="w-5 h-5 text-blue-600" />
                                        <span className="font-medium">Maritime</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 flex-1">
                                        <input type="radio" name="transport" className="text-mdla-yellow focus:ring-mdla-yellow" />
                                        <Plane className="w-5 h-5 text-blue-600" />
                                        <span className="font-medium">Aérien</span>
                                    </label>
                                </div>
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-yellow-800 text-sm">Récapitulatif</h4>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        En créant ce dossier, une notification sera envoyée au client avec son numéro de tracking provisoire.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    {step > 1 ? (
                        <button
                            onClick={handleBack}
                            className="text-gray-600 font-medium hover:text-gray-900 px-4 py-2"
                        >
                            Retour
                        </button>
                    ) : (
                        <div></div>
                    )}

                    <button
                        onClick={step < 3 ? handleNext : () => alert('Dossier Créé !')}
                        className="bg-mdla-yellow text-mdla-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        {step < 3 ? (
                            <>
                                Suivant <ArrowRight className="w-5 h-5" />
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" /> Ouvrir le Dossier
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateFolder;
