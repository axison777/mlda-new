import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { usePayment } from '../context/PaymentContext';
import { useOrders } from '../context/OrdersContext';
import { CreditCard, Loader, ArrowRight } from 'lucide-react';

import toast from 'react-hot-toast';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const { processPayment, isProcessing } = usePayment();
    const { createOrder } = useOrders();

    const total = getCartTotal();

    const handlePayment = async () => {
        try {
            // 1. Create order first (unpaid)
            const order = await createOrder({
                items: cartItems,
                totalAmount: total,
                type: 'product',
                shippingDetails: {
                    address: 'Adresse de livraison', // Idéalement à demander à l'utilisateur avant
                    city: 'Ville',
                    phone: user?.phone || ''
                },
                paymentMethod: 'orange_money' // Fallback pour la BDD comme dans PaymentModal
            });

            // 2. Process payment with the created orderId
            const result = await processPayment({
                orderId: order.id,
                amount: total,
                method: 'orange_money' // Fallback pour la BDD
            });

            if (result.success && result.checkoutUrl) {
                clearCart();
                // Redirect user to Yengapay Checkout
                window.location.href = result.checkoutUrl;
            } else {
                toast.error('Erreur: URL de paiement introuvable ou paiement refusé');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Une erreur est survenue lors de la création de la commande');
        }
    };


    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Votre panier est vide</p>
                    <button
                        onClick={() => navigate('/boutique')}
                        className="bg-mdla-yellow text-mdla-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400"
                    >
                        Continuer vos achats
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-mdla-black mb-8">Paiement</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Payment Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-mdla-black mb-6 flex items-center gap-2">
                                <CreditCard className="w-6 h-6 text-mdla-yellow" />
                                Paiement sécurisé
                            </h2>

                            <p className="text-gray-600 mb-8">
                                Vous allez être redirigé vers l'interface sécurisée de notre partenaire de paiement (Yengapay) pour finaliser votre commande. Vous pourrez y choisir votre méthode préférée (Orange Money, Carte Bancaire, etc.).
                            </p>

                            {isProcessing ? (
                                <div className="text-center py-12">
                                    <Loader className="w-12 h-12 text-mdla-yellow animate-spin mx-auto mb-4" />
                                    <p className="text-gray-600">Préparation de la page de paiement sécurisée...</p>
                                </div>
                            ) : (
                                <button
                                    onClick={handlePayment}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-3 text-lg"
                                >
                                    Payer ma commande sur Yengapay
                                    <ArrowRight className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-mdla-black mb-4">Récapitulatif</h3>

                            <div className="space-y-3 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            {item.name} x{item.quantity}
                                        </span>
                                        <span className="font-semibold">
                                            {((item.discount_price || item.price || 0) * item.quantity).toLocaleString()} FCFA
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Sous-total</span>
                                    <span className="font-semibold">{total.toLocaleString()} FCFA</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Livraison</span>
                                    <span className="font-semibold text-green-600">Gratuite</span>
                                </div>
                                <div className="border-t border-gray-200 pt-2 mt-2">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-gray-900">Total</span>
                                        <span className="font-bold text-xl text-mdla-yellow">
                                            {total.toLocaleString()} FCFA
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
