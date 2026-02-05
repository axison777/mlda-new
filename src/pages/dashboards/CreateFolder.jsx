import React, { useState, useEffect } from 'react';
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
    Ship,
    Loader,
    X
} from 'lucide-react';
import { useOrders } from '../../context/OrdersContext';
import api from '../../utils/api';
import LocationSelector from '../../components/common/LocationSelector';

const CreateFolder = () => {
    const { createOrder } = useOrders();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserResults, setShowUserResults] = useState(false);
    const [formData, setFormData] = useState({
        userId: '',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        clientType: 'existing', // existing or new
        merchandiseType: 'vehicle',
        description: '',
        value: '',
        departureCountry: 'France',
        departureCity: '',
        arrivalCountry: 'Sénégal',
        arrivalCity: '',
        estimatedDelivery: '', // Add this
        transportMode: 'sea'
    });

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length > 1) {
            try {
                const { data } = await api.get(`/users/search/clients?query=${query}`);
                setUsers(data);
                setShowUserResults(true);
            } catch (err) {
                console.error(err);
            }
        } else {
            setUsers([]);
        }
    };

    const handleSelectUser = (user) => {
        setFormData({
            ...formData,
            userId: user.id,
            clientName: user.name,
            clientEmail: user.email,
            clientPhone: user.phone || ''
        });
        setSearchQuery(user.name);
        setShowUserResults(false);
    };

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const countries = [
        "Sénégal", "France", "États-Unis", "Chine", "Dubaï", "Belgique", "Espagne", "Italie", "Allemagne", "Canada", "Maroc", "Côte d'Ivoire"
    ].sort();

    const handleSubmit = async () => {
        try {
            setLoading(true);

            // Validation
            if (formData.clientType === 'existing' && !formData.userId) {
                alert('Veuillez sélectionner un client existant');
                return;
            }

            if (!formData.departureCity || !formData.arrivalCity) {
                alert('Veuillez renseigner la ville de départ et de destination');
                return;
            }

            // Prepare order data
            const orderData = {
                userId: formData.clientType === 'existing' ? formData.userId : null,
                newClientData: formData.clientType === 'new' ? {
                    name: formData.clientName,
                    email: formData.clientEmail,
                    phone: formData.clientPhone,
                    company: formData.clientCompany,
                    address: formData.clientAddress
                } : null,
                type: formData.merchandiseType,
                totalAmount: formData.value || 0,
                blNumber: formData.blNumber,
                bscNumber: formData.bscNumber,
                items: [
                    {
                        description: formData.description || 'Marchandise',
                        quantity: 1
                    }
                ],
                shippingDetails: {
                    departureCountry: formData.departureCountry || 'France',
                    departureCity: formData.departureCity || '',
                    arrivalCountry: formData.arrivalCountry || 'Sénégal',
                    arrivalCity: formData.arrivalCity || '',
                    transportMode: formData.transportMode
                },
                estimatedDelivery: formData.estimatedDelivery // Add this
            };

            const newOrder = await createOrder(orderData);
            if (newOrder) {
                alert(`Dossier #${newOrder.trackingNumber} créé avec succès !`);
                window.location.href = '/dashboard/transit-dossiers';
            }
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la création du dossier');
        } finally {
            setLoading(false);
        }
    };

    const StepIndicator = ({ number, title, active, completed }) => (
        <div className="flex items-center group">
            <div className="flex flex-col items-center gap-2 relative">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 shadow-lg ${active
                    ? 'bg-mdla-yellow text-mdla-black ring-4 ring-mdla-yellow/20 scale-110'
                    : completed
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-400 border-2 border-gray-100'
                    }`}>
                    {completed ? <CheckCircle className="w-6 h-6" /> : number}
                </div>
                <span className={`absolute -bottom-6 whitespace-nowrap text-[10px] font-black uppercase tracking-widest ${active ? 'text-mdla-black' : 'text-gray-400'
                    }`}>
                    {title}
                </span>
            </div>
            {number < 3 && (
                <div className="w-16 md:w-24 h-[2px] mx-4 self-center mt-[-18px] bg-gray-100 relative overflow-hidden">
                    <div className={`absolute inset-0 bg-mdla-yellow transition-transform duration-1000 ${completed ? 'translate-x-0' : '-translate-x-full'
                        }`} />
                </div>
            )}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 font-outfit uppercase tracking-tighter">Nouveau Dossier</h1>
                    <p className="text-gray-500 font-medium">Assistant de création de dossier Import/Export.</p>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl shadow-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Système Actif</span>
                </div>
            </div>

            {/* Stepper */}
            <div className="flex justify-center items-center py-12 mb-12">
                <StepIndicator number={1} title="Client" active={step === 1} completed={step > 1} />
                <StepIndicator number={2} title="Marchandise" active={step === 2} completed={step > 2} />
                <StepIndicator number={3} title="Logistique" active={step === 3} completed={step > 3} />
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-[48px] shadow-2xl border border-gray-100 overflow-hidden relative">
                <div className="p-12 pb-24">
                    {/* Step 1: Client */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Informations Client</h2>

                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <button
                                    onClick={() => setFormData({ ...formData, clientType: 'existing' })}
                                    className={`relative p-6 rounded-[24px] border-2 transition-all duration-300 group ${formData.clientType === 'existing'
                                        ? 'border-mdla-yellow bg-yellow-50/30'
                                        : 'border-gray-100 hover:border-gray-200 bg-white'
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${formData.clientType === 'existing' ? 'bg-mdla-yellow text-mdla-black' : 'bg-gray-100 text-gray-400'}`}>
                                            <Search className="w-6 h-6" />
                                        </div>
                                        <span className={`text-sm font-black uppercase tracking-widest ${formData.clientType === 'existing' ? 'text-mdla-black' : 'text-gray-500'}`}>Client Existant</span>
                                    </div>
                                    {formData.clientType === 'existing' && (
                                        <div className="absolute top-3 right-3 w-6 h-6 bg-mdla-yellow rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-mdla-black" />
                                        </div>
                                    )}
                                </button>
                                <button
                                    onClick={() => setFormData({ ...formData, clientType: 'new' })}
                                    className={`relative p-6 rounded-[24px] border-2 transition-all duration-300 group ${formData.clientType === 'new'
                                        ? 'border-mdla-yellow bg-yellow-50/30'
                                        : 'border-gray-100 hover:border-gray-200 bg-white'
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${formData.clientType === 'new' ? 'bg-mdla-yellow text-mdla-black' : 'bg-gray-100 text-gray-400'}`}>
                                            <Plus className="w-6 h-6" />
                                        </div>
                                        <span className={`text-sm font-black uppercase tracking-widest ${formData.clientType === 'new' ? 'text-mdla-black' : 'text-gray-500'}`}>Nouveau Client</span>
                                    </div>
                                    {formData.clientType === 'new' && (
                                        <div className="absolute top-3 right-3 w-6 h-6 bg-mdla-yellow rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-mdla-black" />
                                        </div>
                                    )}
                                </button>
                            </div>

                            {formData.clientType === 'existing' ? (
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher un client</label>
                                    <div className="relative group">
                                        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-mdla-yellow transition-colors" />
                                        <input
                                            type="text"
                                            className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-[24px] font-bold text-gray-900 focus:bg-white focus:border-mdla-yellow focus:ring-4 focus:ring-mdla-yellow/10 transition-all outline-none"
                                            placeholder="Nom, Email ou Téléphone..."
                                            value={searchQuery}
                                            onChange={(e) => {
                                                handleSearch(e.target.value);
                                            }}
                                            onFocus={() => {
                                                if (searchQuery) setShowUserResults(true);
                                            }}
                                        />
                                    </div>
                                    {showUserResults && searchQuery && (
                                        <div className="absolute z-10 w-full mt-3 bg-white border-2 border-gray-100 rounded-[24px] shadow-2xl max-h-72 overflow-y-auto scrollbar-hide animate-in fade-in zoom-in duration-200 p-2">
                                            {users.map(user => (
                                                <button
                                                    key={user.id}
                                                    className="w-full text-left p-4 hover:bg-yellow-50 rounded-2xl flex items-center gap-4 transition-colors group"
                                                    onClick={() => handleSelectUser(user)}
                                                >
                                                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-mdla-yellow group-hover:text-mdla-black transition-colors">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900">{user.name}</p>
                                                        <p className="text-xs text-gray-500 font-bold">{user.email} {user.phone && `• ${user.phone}`}</p>
                                                    </div>
                                                </button>
                                            ))}
                                            {users.length === 0 && (
                                                <div className="p-8 text-center">
                                                    <p className="text-gray-400 font-bold italic">Aucun client trouvé</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {formData.userId && (
                                        <div className="mt-8 p-6 bg-gray-900 rounded-[32px] text-white flex justify-between items-center shadow-xl animate-in slide-in-from-top-4">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 bg-mdla-yellow text-mdla-black rounded-2xl flex items-center justify-center shadow-lg">
                                                    <User className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-mdla-yellow uppercase tracking-widest mb-1">Dossier pour</p>
                                                    <h3 className="text-xl font-black">{formData.clientName}</h3>
                                                    <p className="text-sm text-gray-400 font-medium">{formData.clientEmail}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setFormData({ ...formData, userId: '', clientName: '' });
                                                    setSearchQuery('');
                                                }}
                                                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-colors group"
                                            >
                                                <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in duration-500">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom Complet</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] font-bold text-gray-900 focus:bg-white focus:border-mdla-yellow transition-all outline-none"
                                            placeholder="Ex: Jean Dupont"
                                            value={formData.clientName}
                                            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] font-bold text-gray-900 focus:bg-white focus:border-mdla-yellow transition-all outline-none"
                                            placeholder="client@email.com"
                                            value={formData.clientEmail}
                                            onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Téléphone</label>
                                        <input
                                            type="tel"
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] font-bold text-gray-900 focus:bg-white focus:border-mdla-yellow transition-all outline-none"
                                            placeholder="+221 ..."
                                            value={formData.clientPhone}
                                            onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Entreprise</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] font-bold text-gray-900 focus:bg-white focus:border-mdla-yellow transition-all outline-none"
                                            placeholder="Nom de la société"
                                            value={formData.clientCompany}
                                            onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Adresse Complète</label>
                                        <textarea
                                            rows="2"
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] font-bold text-gray-900 focus:bg-white focus:border-mdla-yellow transition-all outline-none"
                                            placeholder="Quartier, Ville, Pays..."
                                            value={formData.clientAddress}
                                            onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <div className="md:col-span-2 p-4 bg-amber-50 rounded-2xl flex items-start gap-4 border border-amber-100">
                                        <div className="w-10 h-10 bg-mdla-yellow rounded-xl flex items-center justify-center shrink-0">
                                            <CheckCircle className="w-5 h-5 text-mdla-black" />
                                        </div>
                                        <p className="text-[11px] text-amber-900 font-medium leading-relaxed">
                                            ⚙️ <span className="font-black uppercase">Auto-Onboarding :</span> Un compte client sera créé automatiquement. Il recevra ses accès par email pour suivre ce dossier.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Merchandise */}
                    {step === 2 && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-xl font-black text-gray-900 mb-6">Type de Marchandise</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                        { id: 'vehicle', label: 'Véhicule', icon: Truck, desc: 'Voitures, motos, engins' },
                                        { id: 'container', label: 'Conteneur', icon: Ship, desc: '20ft, 40ft, Groupage' },
                                        { id: 'bulk', label: 'Colis / Vrac', icon: Package, desc: 'Effets personnels, cartons' }
                                    ].map((type) => {
                                        const Icon = type.icon;
                                        const isSelected = formData.merchandiseType === type.id;
                                        return (
                                            <button
                                                key={type.id}
                                                onClick={() => setFormData({ ...formData, merchandiseType: type.id })}
                                                className={`relative p-8 rounded-[32px] border-2 transition-all duration-300 flex flex-col items-center text-center gap-4 group ${isSelected
                                                    ? 'border-mdla-yellow bg-yellow-50/30'
                                                    : 'border-gray-100 hover:border-gray-200 bg-white'
                                                    }`}
                                            >
                                                <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-mdla-yellow text-mdla-black scale-110 shadow-lg' : 'bg-gray-50 text-gray-400 group-hover:scale-110'
                                                    }`}>
                                                    <Icon className="w-8 h-8" />
                                                </div>
                                                <div>
                                                    <span className={`block font-black uppercase tracking-widest text-sm ${isSelected ? 'text-mdla-black' : 'text-gray-500'}`}>
                                                        {type.label}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-bold mt-1 block uppercase tracking-tighter">{type.desc}</span>
                                                </div>
                                                {isSelected && (
                                                    <div className="absolute top-4 right-4 w-6 h-6 bg-mdla-yellow rounded-full flex items-center justify-center shadow-sm">
                                                        <CheckCircle className="w-4 h-4 text-mdla-black" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description Détaillée</label>
                                    <textarea
                                        rows="4"
                                        className="w-full p-6 bg-gray-50 border-2 border-transparent rounded-[24px] font-bold text-gray-900 focus:bg-white focus:border-mdla-yellow focus:ring-4 focus:ring-mdla-yellow/10 transition-all outline-none"
                                        placeholder="Ex: Toyota RAV4 2020, VIN: JTE..., contenu du colis..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Valeur Déclarée estimée</label>
                                    <div className="relative group">
                                        <input
                                            type="number"
                                            className="w-full pl-6 pr-20 py-5 bg-gray-50 border-2 border-transparent rounded-[24px] font-black text-gray-900 focus:bg-white focus:border-mdla-yellow focus:ring-4 focus:ring-mdla-yellow/10 transition-all outline-none text-2xl"
                                            placeholder="0"
                                            value={formData.value}
                                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-200 rounded-lg text-xs font-black text-gray-600 uppercase tracking-tighter pointer-events-none group-focus-within:bg-mdla-yellow group-focus-within:text-mdla-black transition-colors">
                                            FCFA
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Logistics */}
                    {step === 3 && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-2">Origine</h3>
                                    <div className="space-y-4">
                                        <LocationSelector
                                            label="Pays et Ville de Départ"
                                            defaultCountry={formData.departureCountry}
                                            defaultCity={formData.departureCity}
                                            onLocationSelect={({ country, city }) => setFormData({ ...formData, departureCountry: country, departureCity: city })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-2">Destination</h3>
                                    <div className="space-y-4">
                                        <LocationSelector
                                            label="Pays et Ville d'Arrivée"
                                            defaultCountry={formData.arrivalCountry}
                                            defaultCity={formData.arrivalCity}
                                            onLocationSelect={({ country, city }) => setFormData({ ...formData, arrivalCountry: country, arrivalCity: city })}
                                        />
                                    </div>
                                    <div className="space-y-1 mt-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date d'Arrivée Estimée</label>
                                        <input
                                            type="date"
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[24px] font-bold text-gray-900 focus:bg-white focus:border-mdla-yellow outline-none uppercase"
                                            value={formData.estimatedDelivery}
                                            onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-2">Informations Experts</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Numéro B/L (Bill of Lading)</label>
                                            <input
                                                type="text"
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-mdla-yellow outline-none"
                                                placeholder="Ex: MAEU123456789"
                                                value={formData.blNumber}
                                                onChange={(e) => setFormData({ ...formData, blNumber: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Numéro BSC (Bordereau Suivi)</label>
                                            <input
                                                type="text"
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-mdla-yellow outline-none"
                                                placeholder="Ex: BSC-2024-XXXX"
                                                value={formData.bscNumber}
                                                onChange={(e) => setFormData({ ...formData, bscNumber: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-2">Mode de Transport</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {[
                                            { id: 'sea', label: 'Maritime', icon: Ship },
                                            { id: 'air', label: 'Aérien', icon: Plane }
                                        ].map((mode) => {
                                            const Icon = mode.icon;
                                            const isSelected = formData.transportMode === mode.id;
                                            return (
                                                <button
                                                    key={mode.id}
                                                    onClick={() => setFormData({ ...formData, transportMode: mode.id })}
                                                    className={`relative p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${isSelected ? 'border-mdla-yellow bg-yellow-50/30' : 'border-gray-50 bg-white'}`}
                                                >
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-mdla-yellow text-mdla-black' : 'bg-gray-100 text-gray-400'}`}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <span className={`text-xs font-black uppercase tracking-widest ${isSelected ? 'text-mdla-black' : 'text-gray-500'}`}>{mode.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900 p-8 rounded-[32px] text-white flex items-center gap-6 shadow-2xl animate-in slide-in-from-bottom-4">
                                <div className="w-16 h-16 bg-white/10 rounded-[20px] flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-mdla-yellow" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-[10px] font-black text-mdla-yellow uppercase tracking-[0.2em] mb-1">Prêt pour l'envoi</h4>
                                    <p className="text-sm text-gray-400 font-medium">
                                        Un numéro de tracking sera généré et envoyé au client dès la validation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gray-50/80 backdrop-blur-md border-t border-gray-100 flex justify-between items-center px-12 h-24">
                    {step > 1 ? (
                        <button
                            onClick={handleBack}
                            className="text-gray-400 font-black uppercase tracking-widest text-xs hover:text-gray-900 transition-colors flex items-center gap-2 group"
                        >
                            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                            Retour
                        </button>
                    ) : (
                        <div />
                    )}

                    <button
                        onClick={step < 3 ? handleNext : handleSubmit}
                        disabled={loading}
                        className="bg-mdla-yellow text-mdla-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-yellow-400 transition-all flex items-center gap-3 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 group"
                    >
                        {loading ? (
                            <Loader className="w-5 h-5 animate-spin" />
                        ) : step < 3 ? (
                            <>
                                Étape Suivante
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        ) : (
                            <>
                                Confirmer la création
                                <CheckCircle className="w-5 h-5 group-hover:scale-125 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateFolder;
