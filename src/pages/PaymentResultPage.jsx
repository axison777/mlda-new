import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowLeft, Package, Home } from 'lucide-react';

const PaymentResultPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('pending'); // 'success', 'failed', 'pending'

    useEffect(() => {
        // Scroll to top
        window.scrollTo(0, 0);

        // Lire le statut depuis l'URL. Si aucun, on suppose 'success' pour Yengapay qui redirige souvent qu'en cas de succès,
        // mais l'idéal est que Yengapay envoie ?status=success ou ?status=failed
        const urlStatus = searchParams.get('status');
        
        if (urlStatus === 'success' || urlStatus === 'completed' || urlStatus === 'DONE') {
            setStatus('success');
        } else if (urlStatus === 'failed' || urlStatus === 'cancelled' || urlStatus === 'error' || urlStatus === 'CANCELED' || urlStatus === 'FAILED') {
            setStatus('failed');
        } else {
            // Par défaut si pas de paramètre de statut explicite mais redirection effectuée
            setStatus('success');
        }
    }, [searchParams]);

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Paiement validé ou en cours de validation !
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Votre transaction a bien été enregistrée. Si elle a été confirmée par Yengapay, vous devriez maintenant y avoir accès.
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
                            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Prochaines étapes
                            </h3>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Si c'était un cours, il sera débloqué dans votre espace "Mes Cours".</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Si c'était une commande, elle sera traitée dans les 24-48 heures.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/dashboard"
                                className="flex-1 bg-mdla-yellow text-mdla-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                            >
                                <Home className="w-5 h-5" />
                                Mon Tableau de Bord
                            </Link>
                            <Link
                                to="/boutique"
                                className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Retour à la boutique
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-12 h-12 text-red-600" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Paiement non abouti
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Il semble que votre paiement ait été annulé ou qu'une erreur se soit produite.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/panier"
                            className="flex-1 bg-mdla-yellow text-mdla-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Retour au panier
                        </Link>
                        <Link
                            to="/contact"
                            className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Contacter le support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentResultPage;
