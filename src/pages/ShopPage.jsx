import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const ShopPage = () => {
    const [activeFilter, setActiveFilter] = useState('Tous');
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const categories = [
        'Tous',
        ...new Set(products.map(p => p.category))
    ];

    const filteredProducts = activeFilter === 'Tous'
        ? products
        : products.filter(product => product.category === activeFilter);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-mdla-yellow to-yellow-400 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-mdla-black mb-6">
                        Notre Boutique
                    </h1>
                    <p className="text-xl text-mdla-black/80 max-w-3xl mx-auto">
                        Produits de qualité importés d'Allemagne - Électronique, Alimentation, Ustensiles et plus
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="py-8 bg-gray-50 sticky top-20 z-40 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveFilter(category)}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${activeFilter === category
                                    ? 'bg-mdla-yellow text-mdla-black shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-gray-600">
                            <span className="font-bold text-mdla-black">{filteredProducts.length}</span> produit{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredProducts.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={addToCart}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-gray-500 text-lg">
                                Aucun produit disponible dans cette catégorie.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-mdla-black text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        Besoin d'un produit spécifique ?
                    </h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        Nous pouvons importer sur demande des produits spécifiques d'Allemagne.
                        Contactez-nous pour discuter de vos besoins.
                    </p>
                    <a
                        href="/contact"
                        className="inline-block bg-mdla-yellow text-mdla-black px-8 py-4 rounded-lg font-bold hover:bg-yellow-400 transition-all transform hover:scale-105"
                    >
                        Nous Contacter
                    </a>
                </div>
            </section>
        </div>
    );
};

export default ShopPage;
