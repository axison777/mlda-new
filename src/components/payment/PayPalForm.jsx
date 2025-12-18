import { useState } from 'react';
import { Wallet, AlertCircle } from 'lucide-react';

const PayPalForm = ({ amount, onSubmit, onCancel }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('L\'email PayPal est requis');
            return;
        }

        if (!validateEmail(email)) {
            setError('Email invalide');
            return;
        }

        onSubmit({
            email: email.trim(),
            amount
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <Wallet className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Paiement PayPal</h4>
                        <p className="text-sm text-blue-800 mb-2">
                            Vous serez redirigé vers PayPal pour finaliser votre paiement en toute sécurité.
                        </p>
                        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                            <li>Connexion sécurisée à votre compte PayPal</li>
                            <li>Paiement instantané</li>
                            <li>Protection des achats PayPal</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email PayPal
                </label>
                <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre.email@example.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <span className="text-gray-600">Frais PayPal (2.9%)</span>
                    <span className="font-semibold">{Math.round(amount * 0.029).toLocaleString()} FCFA</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-bold text-lg text-blue-600">
                            {(amount + Math.round(amount * 0.029)).toLocaleString()} FCFA
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Le montant sera converti en USD selon le taux de change PayPal au moment du paiement.
                </p>
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
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                    <Wallet className="w-5 h-5" />
                    Continuer avec PayPal
                </button>
            </div>
        </form>
    );
};

export default PayPalForm;
