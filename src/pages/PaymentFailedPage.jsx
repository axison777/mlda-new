import { useLocation, Link } from 'react-router-dom';
import { XCircle, RefreshCw, HelpCircle } from 'lucide-react';

const PaymentFailedPage = () => {
    const location = useLocation();
    const error = location.state?.error || 'Une erreur est survenue lors du paiement';

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    {/* Error Icon */}
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-12 h-12 text-red-600" />
                    </div>

                    {/* Error Message */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Paiement échoué
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Nous n'avons pas pu traiter votre paiement. Veuillez réessayer.
                    </p>

                    {/* Error Details */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                        <h2 className="text-sm font-semibold text-red-900 mb-2">Raison de l'échec</h2>
                        <p className="text-red-800">{error}</p>
                    </div>

                    {/* Common Issues */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <HelpCircle className="w-5 h-5" />
                            Problèmes courants
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-gray-400 mt-0.5">•</span>
                                <span>Solde insuffisant sur votre compte</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-gray-400 mt-0.5">•</span>
                                <span>Informations de paiement incorrectes</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-gray-400 mt-0.5">•</span>
                                <span>Carte expirée ou bloquée</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-gray-400 mt-0.5">•</span>
                                <span>Problème de connexion réseau</span>
                            </li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/checkout"
                            className="flex-1 bg-mdla-yellow text-mdla-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Réessayer le paiement
                        </Link>
                        <Link
                            to="/contact"
                            className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Contacter le support
                        </Link>
                    </div>

                    {/* Back to Cart */}
                    <Link
                        to="/panier"
                        className="mt-6 text-sm text-gray-600 hover:text-mdla-black font-semibold inline-block"
                    >
                        ← Retour au panier
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailedPage;
