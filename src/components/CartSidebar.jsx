import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEffect } from 'react';

const CartSidebar = () => {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        getCartCount,
        isCartOpen,
        setIsCartOpen,
    } = useCart();

    // Emergency escape key handler to close cart
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isCartOpen) {
                setIsCartOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isCartOpen, setIsCartOpen]);

    if (!isCartOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                onClick={() => setIsCartOpen(false)}
            ></div>

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
                {/* Header */}
                <div className="bg-mdla-yellow p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-6 h-6 text-mdla-black" />
                        <h2 className="text-2xl font-bold text-mdla-black">
                            Mon Panier ({getCartCount()})
                        </h2>
                    </div>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-mdla-black hover:text-mdla-red transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Votre panier est vide</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="mt-4 text-mdla-yellow hover:text-yellow-600 font-semibold"
                            >
                                Continuer vos achats
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-gray-50 rounded-lg p-4 flex gap-4"
                                >
                                    {/* Product Image */}
                                    <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="w-8 h-8 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-mdla-black mb-1 line-clamp-2">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-2">{item.category}</p>

                                        <div className="flex items-center justify-between">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-7 h-7 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center font-semibold">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-7 h-7 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                <p className="font-bold text-mdla-black">
                                                    {((item.discount_price || item.price) * item.quantity).toLocaleString()} FCFA
                                                </p>
                                                {item.discount_price && (
                                                    <p className="text-xs text-gray-400 line-through">
                                                        {(item.price * item.quantity).toLocaleString()} FCFA
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-xs text-mdla-red hover:underline mt-2"
                                        >
                                            Retirer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                        {/* Total */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-semibold text-gray-700">Total:</span>
                            <span className="text-2xl font-bold text-mdla-black">
                                {getCartTotal().toLocaleString()} FCFA
                            </span>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-3">
                            <a
                                href="/panier"
                                className="block w-full bg-mdla-yellow text-mdla-black px-6 py-3 rounded-lg font-bold text-center hover:bg-yellow-400 transition-all"
                                onClick={() => setIsCartOpen(false)}
                            >
                                Voir le panier
                            </a>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="w-full bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                            >
                                Continuer mes achats
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartSidebar;
