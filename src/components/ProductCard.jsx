import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
    const {
        id,
        name,
        price,
        discount_price,
        image,
        category,
        description,
        badge,
        rating
    } = product;

    const handleAddToCart = () => {
        onAddToCart(product);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group relative">
            {/* Badge */}
            {badge && (
                <div className="absolute top-4 left-4 z-10">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${badge === 'Nouveau' ? 'bg-green-500 text-white' :
                            badge === 'Promo' ? 'bg-mdla-red text-white' :
                                'bg-mdla-yellow text-mdla-black'
                        }`}>
                        {badge}
                    </span>
                </div>
            )}

            {/* Product Image */}
            <div className="relative overflow-hidden h-64">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <ShoppingCart className="w-16 h-16 text-gray-400" />
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-6">
                {/* Category */}
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    {category}
                </p>

                {/* Name */}
                <h3 className="text-lg font-bold text-mdla-black mb-2 line-clamp-2 group-hover:text-mdla-yellow transition-colors">
                    {name}
                </h3>

                {/* Description */}
                {description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {description}
                    </p>
                )}

                {/* Rating */}
                {rating && (
                    <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < rating ? 'text-mdla-yellow' : 'text-gray-300'}>
                                ★
                            </span>
                        ))}
                        <span className="text-xs text-gray-500 ml-1">({rating}/5)</span>
                    </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-baseline gap-2">
                        {discount_price ? (
                            <>
                                <span className="text-gray-400 text-sm line-through">
                                    {price.toLocaleString()} FCFA
                                </span>
                                <span className="text-mdla-red text-xl font-bold">
                                    {discount_price.toLocaleString()} FCFA
                                </span>
                            </>
                        ) : (
                            <span className="text-mdla-black text-xl font-bold">
                                {price.toLocaleString()} FCFA
                            </span>
                        )}
                    </div>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-mdla-yellow text-mdla-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                    <ShoppingCart className="w-5 h-5" />
                    Ajouter au panier
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
