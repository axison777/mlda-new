import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Download } from 'lucide-react';

const PaymentSuccessPage = () => {
    const { transactionId } = useParams();

    useEffect(() => {
        // Scroll to top
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    {/* Success Icon */}
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>

                    {/* Success Message */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Paiement réussi !
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Votre paiement a été traité avec succès. Vous recevrez un email de confirmation sous peu.
                    </p>

                    {/* Transaction Details */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                        <h2 className="text-sm font-semibold text-gray-700 mb-4">Détails de la transaction</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Numéro de transaction</span>
                                <span className="font-mono font-semibold text-mdla-black">{transactionId}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Date</span>
                                <span className="font-semibold">{new Date().toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Statut</span>
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                                    <CheckCircle className="w-4 h-4" />
                                    Confirmé
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
                        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Prochaines étapes
                        </h3>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Vous recevrez un email de confirmation avec les détails de votre commande</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Votre commande sera traitée dans les 24-48 heures</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Vous pouvez suivre votre commande depuis votre tableau de bord</span>
                            </li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/client-dashboard"
                            className="flex-1 bg-mdla-yellow text-mdla-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                        >
                            <Package className="w-5 h-5" />
                            Voir mes commandes
                        </Link>
                        <Link
                            to="/"
                            className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Retour à l'accueil
                        </Link>
                    </div>

                    {/* Download Receipt */}
                    <button className="mt-6 text-sm text-mdla-yellow hover:text-yellow-600 font-semibold flex items-center gap-2 mx-auto">
                        <Download className="w-4 h-4" />
                        Télécharger le reçu (PDF)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
