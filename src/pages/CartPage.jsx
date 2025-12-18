import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const navigate = useNavigate();
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
    } = useCart();

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <section className="bg-gradient-to-r from-mdla-yellow to-yellow-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-mdla-black mb-2">
                        Mon Panier
                    </h1>
                    <p className="text-mdla-black/80 text-lg">
                        {cartItems.length} article{cartItems.length > 1 ? 's' : ''} dans votre panier
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {cartItems.length === 0 ? (
                    /* Empty Cart State */
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">
                            Votre panier est vide
                        </h2>
                        <p className="text-gray-500 mb-8">
                            Découvrez nos produits et ajoutez-les à votre panier
                        </p>
                        <a
                            href="/boutique"
                            className="inline-flex items-center gap-2 bg-mdla-yellow text-mdla-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Retour à la boutique
                        </a>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Clear Cart Button */}
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-mdla-black">
                                    Articles ({cartItems.length})
                                </h2>
                                <button
                                    onClick={clearCart}
                                    className="text-mdla-red hover:underline text-sm font-semibold flex items-center gap-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Vider le panier
                                </button>
                            </div>

                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl shadow-md p-6 flex gap-6"
                                >
                                    {/* Product Image */}
                                    <div className="w-32 h-32 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="w-12 h-12 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-lg font-bold text-mdla-black mb-1">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">{item.category}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-mdla-red hover:bg-red-50 p-2 rounded transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-gray-600">Quantité:</span>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-12 text-center font-semibold text-lg">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-mdla-black">
                                                    {((item.discount_price || item.price) * item.quantity).toLocaleString()} FCFA
                                                </p>
                                                {item.discount_price && (
                                                    <p className="text-sm text-gray-400 line-through">
                                                        {(item.price * item.quantity).toLocaleString()} FCFA
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {(item.discount_price || item.price).toLocaleString()} FCFA / unité
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Continue Shopping */}
                            <a
                                href="/boutique"
                                className="inline-flex items-center gap-2 text-mdla-yellow hover:text-yellow-600 font-semibold mt-4"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Continuer mes achats
                            </a>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-md p-6 sticky top-28">
                                <h2 className="text-xl font-bold text-mdla-black mb-6">
                                    Résumé de la commande
                                </h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Sous-total</span>
                                        <span className="font-semibold">
                                            {getCartTotal().toLocaleString()} FCFA
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Livraison</span>
                                        <span className="font-semibold text-green-600">Gratuite</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-mdla-black">Total</span>
                                            <span className="text-2xl font-bold text-mdla-black">
                                                {getCartTotal().toLocaleString()} FCFA
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-mdla-yellow text-mdla-black px-6 py-4 rounded-lg font-bold hover:bg-yellow-400 transition-all transform hover:scale-105 mb-3"
                                >
                                    Passer la commande
                                </button>

                                <p className="text-xs text-gray-500 text-center">
                                    Paiement sécurisé • Livraison rapide
                                </p>

                                {/* Promo Code (Optional) */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">
                                        Code promo
                                    </p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Entrez votre code"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none"
                                        />
                                        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors">
                                            Appliquer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
