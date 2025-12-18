import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

const ShopPage = () => {
    const [activeFilter, setActiveFilter] = useState('Tous');
    const { addToCart } = useCart();

    // Mock product data with various categories
    const products = [
        // Alimentaire & Boissons
        {
            id: 1,
            name: 'Vin Rouge Allemand - Spätburgunder',
            price: 25000,
            discount_price: null,
            image: '/api/placeholder/400/400',
            category: 'Alimentaire & Boissons',
            description: 'Vin rouge premium de la région du Bade, arômes fruités et élégants.',
            badge: 'Nouveau',
            rating: 5
        },
        {
            id: 2,
            name: 'Bière Allemande Assortiment (6x)',
            price: 18000,
            discount_price: 15000,
            image: '/api/placeholder/400/400',
            category: 'Alimentaire & Boissons',
            description: 'Pack de 6 bières allemandes traditionnelles variées.',
            badge: 'Promo',
            rating: 5
        },
        {
            id: 3,
            name: 'Chocolat Ritter Sport - Assortiment',
            price: 8000,
            discount_price: null,
            image: '/api/placeholder/400/400',
            category: 'Alimentaire & Boissons',
            description: 'Assortiment de 10 tablettes de chocolat Ritter Sport.',
            badge: null,
            rating: 4
        },
        {
            id: 4,
            name: 'Saucisses Bratwurst (Pack de 6)',
            price: 12000,
            discount_price: 10000,
            image: '/api/placeholder/400/400',
            category: 'Alimentaire & Boissons',
            description: 'Authentiques saucisses allemandes Bratwurst, prêtes à griller.',
            badge: 'Promo',
            rating: 5
        },

        // Électronique
        {
            id: 5,
            name: 'Smartphone Samsung Galaxy S23',
            price: 450000,
            discount_price: 420000,
            image: '/api/placeholder/400/400',
            category: 'Électronique',
            description: 'Smartphone haut de gamme, 256GB, importé d\'Allemagne.',
            badge: 'Promo',
            rating: 5
        },
        {
            id: 6,
            name: 'Ordinateur Portable HP Pavilion',
            price: 550000,
            discount_price: null,
            image: '/api/placeholder/400/400',
            category: 'Électronique',
            description: 'PC portable 15.6", Intel i5, 16GB RAM, 512GB SSD.',
            badge: 'Nouveau',
            rating: 4
        },
        {
            id: 7,
            name: 'Écouteurs Bluetooth Sony WH-1000XM5',
            price: 180000,
            discount_price: 160000,
            image: '/api/placeholder/400/400',
            category: 'Électronique',
            description: 'Casque sans fil avec réduction de bruit active.',
            badge: 'Promo',
            rating: 5
        },
        {
            id: 8,
            name: 'Tablette Apple iPad Air',
            price: 380000,
            discount_price: null,
            image: '/api/placeholder/400/400',
            category: 'Électronique',
            description: 'iPad Air 10.9", 64GB, WiFi, dernière génération.',
            badge: null,
            rating: 5
        },

        // Ustensiles de Cuisine
        {
            id: 9,
            name: 'Set Couteaux WMF Professional',
            price: 85000,
            discount_price: 75000,
            image: '/api/placeholder/400/400',
            category: 'Ustensiles de Cuisine',
            description: 'Set de 5 couteaux professionnels en acier inoxydable.',
            badge: 'Promo',
            rating: 5
        },
        {
            id: 10,
            name: 'Batterie de Cuisine Fissler',
            price: 120000,
            discount_price: null,
            image: '/api/placeholder/400/400',
            category: 'Ustensiles de Cuisine',
            description: 'Set complet de casseroles et poêles haut de gamme.',
            badge: 'Nouveau',
            rating: 5
        },
        {
            id: 11,
            name: 'Machine à Café Bosch Tassimo',
            price: 95000,
            discount_price: 80000,
            image: '/api/placeholder/400/400',
            category: 'Ustensiles de Cuisine',
            description: 'Machine à café à capsules, préparation rapide et facile.',
            badge: 'Promo',
            rating: 4
        },

        // Gadgets
        {
            id: 12,
            name: 'Montre Connectée Garmin Fenix 7',
            price: 280000,
            discount_price: null,
            image: '/api/placeholder/400/400',
            category: 'Gadgets',
            description: 'Montre GPS multisport avec suivi santé avancé.',
            badge: 'Nouveau',
            rating: 5
        },
        {
            id: 13,
            name: 'Enceinte Bluetooth JBL Charge 5',
            price: 75000,
            discount_price: 65000,
            image: '/api/placeholder/400/400',
            category: 'Gadgets',
            description: 'Enceinte portable étanche avec autonomie 20h.',
            badge: 'Promo',
            rating: 4
        },
        {
            id: 14,
            name: 'Appareil Photo Canon EOS R50',
            price: 520000,
            discount_price: null,
            image: '/api/placeholder/400/400',
            category: 'Gadgets',
            description: 'Appareil photo hybride 24MP avec objectif 18-45mm.',
            badge: null,
            rating: 5
        },
        {
            id: 15,
            name: 'Drone DJI Mini 3 Pro',
            price: 420000,
            discount_price: 390000,
            image: '/api/placeholder/400/400',
            category: 'Gadgets',
            description: 'Drone compact avec caméra 4K et autonomie 34 min.',
            badge: 'Promo',
            rating: 5
        }
    ];

    const categories = [
        'Tous',
        'Alimentaire & Boissons',
        'Électronique',
        'Ustensiles de Cuisine',
        'Gadgets'
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
