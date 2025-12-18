import { useState } from 'react';
import { CreditCard, AlertCircle } from 'lucide-react';

const VisaForm = ({ amount, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
    });
    const [errors, setErrors] = useState({});

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.slice(0, 2) + '/' + v.slice(2, 4);
        }
        return v;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'cardNumber') {
            formattedValue = formatCardNumber(value);
        } else if (name === 'expiryDate') {
            formattedValue = formatExpiryDate(value);
        } else if (name === 'cvv') {
            formattedValue = value.replace(/[^0-9]/gi, '').slice(0, 3);
        }

        setFormData(prev => ({ ...prev, [name]: formattedValue }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.cardNumber.trim()) {
            newErrors.cardNumber = 'Numéro de carte requis';
        } else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
            newErrors.cardNumber = 'Numéro de carte invalide (16 chiffres)';
        }

        if (!formData.cardHolder.trim()) {
            newErrors.cardHolder = 'Nom du titulaire requis';
        }

        if (!formData.expiryDate.trim()) {
            newErrors.expiryDate = 'Date d\'expiration requise';
        } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
            newErrors.expiryDate = 'Format invalide (MM/AA)';
        }

        if (!formData.cvv.trim()) {
            newErrors.cvv = 'CVV requis';
        } else if (formData.cvv.length !== 3) {
            newErrors.cvv = 'CVV invalide (3 chiffres)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            onSubmit({
                ...formData,
                cardNumber: formData.cardNumber.replace(/\s/g, ''),
                amount
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Paiement sécurisé</h4>
                        <p className="text-sm text-blue-800">
                            Vos informations bancaires sont cryptées et sécurisées. Nous n'enregistrons pas vos données de carte.
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Numéro de carte
                </label>
                <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                </div>
                {errors.cardNumber && (
                    <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.cardNumber}
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom du titulaire
                </label>
                <input
                    type="text"
                    name="cardHolder"
                    value={formData.cardHolder}
                    onChange={handleChange}
                    placeholder="JEAN DUPONT"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase ${errors.cardHolder ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.cardHolder && (
                    <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.cardHolder}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date d'expiration
                    </label>
                    <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        placeholder="MM/AA"
                        maxLength="5"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.expiryDate && (
                        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {errors.expiryDate}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CVV
                    </label>
                    <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        maxLength="3"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.cvv ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.cvv && (
                        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {errors.cvv}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Montant</span>
                    <span className="font-semibold">{amount.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Frais (2.5%)</span>
                    <span className="font-semibold">{Math.round(amount * 0.025).toLocaleString()} FCFA</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-bold text-lg text-blue-600">
                            {(amount + Math.round(amount * 0.025)).toLocaleString()} FCFA
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    Payer avec Visa
                </button>
            </div>
        </form>
    );
};

export default VisaForm;
