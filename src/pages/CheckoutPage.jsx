import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { usePayment } from '../context/PaymentContext';
import { useOrders } from '../context/OrdersContext';
import { Smartphone, CreditCard, Wallet, Loader, CheckCircle } from 'lucide-react';
import OrangeMoneyForm from '../components/payment/OrangeMoneyForm';
import VisaForm from '../components/payment/VisaForm';
import PayPalForm from '../components/payment/PayPalForm';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const { processPayment, isProcessing } = usePayment();
    const { createOrder } = useOrders();

    const [selectedMethod, setSelectedMethod] = useState(null);
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const paymentMethods = [
        { id: 'orange_money', name: 'Orange Money', icon: Smartphone, color: 'orange' },
        { id: 'visa', name: 'Carte Visa', icon: CreditCard, color: 'blue' },
        { id: 'paypal', name: 'PayPal', icon: Wallet, color: 'blue' }
    ];

    const handleMethodSelect = (methodId) => {
        setSelectedMethod(methodId);
        setShowPaymentForm(true);
    };

    const handlePayment = async (paymentData) => {
        try {
            // 1. Create order first (unpaid)
            const order = await createOrder({
                items: cartItems,
                totalAmount: total,
                type: 'product', // or dynamic based on cart items
                shippingDetails: {
                    address: paymentData.address || 'Adresse Test',
                    city: paymentData.city || 'Ville Test',
                    phone: paymentData.phone || user?.phone
                },
                paymentMethod: selectedMethod
            });

            // 2. Process payment with the created orderId
            const result = await processPayment({
                ...paymentData,
                orderId: order.id,
                amount: total,
                method: selectedMethod
            });

            if (result.success) {
                clearCart();
                navigate(`/payment/success/${result.transactionId}`);
            } else {
                navigate('/payment/failed', { state: { error: result.error } });
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Une erreur est survenue lors de la commande');
        }
    };

    const total = getCartTotal();

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
                        {!showPaymentForm ? (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-bold text-mdla-black mb-6">
                                    Choisissez votre méthode de paiement
                                </h2>
                                <div className="space-y-4">
                                    {paymentMethods.map((method) => {
                                        const Icon = method.icon;
                                        return (
                                            <button
                                                key={method.id}
                                                onClick={() => handleMethodSelect(method.id)}
                                                className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-mdla-yellow transition-colors"
                                            >
                                                <div className={`w-12 h-12 bg-${method.color}-100 rounded-lg flex items-center justify-center`}>
                                                    <Icon className={`w-6 h-6 text-${method.color}-600`} />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="font-semibold text-gray-900">{method.name}</p>
                                                </div>
                                                <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-mdla-black">
                                        {paymentMethods.find(m => m.id === selectedMethod)?.name}
                                    </h2>
                                    <button
                                        onClick={() => setShowPaymentForm(false)}
                                        className="text-sm text-gray-600 hover:text-mdla-black"
                                    >
                                        Changer
                                    </button>
                                </div>

                                {isProcessing ? (
                                    <div className="text-center py-12">
                                        <Loader className="w-12 h-12 text-mdla-yellow animate-spin mx-auto mb-4" />
                                        <p className="text-gray-600">Traitement du paiement en cours...</p>
                                    </div>
                                ) : (
                                    <>
                                        {selectedMethod === 'orange_money' && (
                                            <OrangeMoneyForm
                                                amount={total}
                                                onSubmit={handlePayment}
                                                onCancel={() => setShowPaymentForm(false)}
                                            />
                                        )}
                                        {selectedMethod === 'visa' && (
                                            <VisaForm
                                                amount={total}
                                                onSubmit={handlePayment}
                                                onCancel={() => setShowPaymentForm(false)}
                                            />
                                        )}
                                        {selectedMethod === 'paypal' && (
                                            <PayPalForm
                                                amount={total}
                                                onSubmit={handlePayment}
                                                onCancel={() => setShowPaymentForm(false)}
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        )}
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
                                            {(item.price * item.quantity).toLocaleString()} FCFA
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
