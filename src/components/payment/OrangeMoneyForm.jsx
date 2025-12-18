import { useState } from 'react';
import { Smartphone, AlertCircle } from 'lucide-react';

const OrangeMoneyForm = ({ amount, onSubmit, onCancel }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');

    const validatePhone = (phone) => {
        // Format: +226 XX XX XX XX (Burkina Faso)
        const regex = /^(\+226|00226|0)?[567]\d{7}$/;
        return regex.test(phone.replace(/\s/g, ''));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!phoneNumber.trim()) {
            setError('Le numéro de téléphone est requis');
            return;
        }

        if (!validatePhone(phoneNumber)) {
            setError('Numéro de téléphone invalide (format: 70 XX XX XX)');
            return;
        }

        onSubmit({
            phoneNumber: phoneNumber.trim(),
            amount
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <Smartphone className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-orange-900 mb-1">Instructions Orange Money</h4>
                        <ol className="text-sm text-orange-800 space-y-1 list-decimal list-inside">
                            <li>Composez #144# sur votre téléphone Orange Money</li>
                            <li>Sélectionnez "Payer un marchand"</li>
                            <li>Entrez le code marchand: <strong>MDLA2025</strong></li>
                            <li>Confirmez le montant de <strong>{amount.toLocaleString()} FCFA</strong></li>
                            <li>Entrez votre code PIN</li>
                        </ol>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Numéro Orange Money
                </label>
                <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="70 XX XX XX"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                </div>
                {error && (
                    <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Montant</span>
                    <span className="font-semibold">{amount.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Frais (1.5%)</span>
                    <span className="font-semibold">{Math.round(amount * 0.015).toLocaleString()} FCFA</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-bold text-lg text-orange-600">
                            {(amount + Math.round(amount * 0.015)).toLocaleString()} FCFA
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
                    className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                    Payer avec Orange Money
                </button>
            </div>
        </form>
    );
};

export default OrangeMoneyForm;
