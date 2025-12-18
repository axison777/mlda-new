import React, { useState } from 'react';
import {
    ShoppingBag,
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Image as ImageIcon,
    DollarSign,
    Package,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';

const AdminShop = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [isSourcing, setIsSourcing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        quantity: '',
        description: '',
        image: null
    });

    // Mock Data for Products
    const products = [
        { id: 1, name: 'iPhone 15 Pro Max', category: 'Électronique', price: 850000, stock: 12, type: 'stock', image: 'https://via.placeholder.com/50' },
        { id: 2, name: 'MacBook Air M2', category: 'Informatique', price: 950000, stock: 5, type: 'stock', image: 'https://via.placeholder.com/50' },
        { id: 3, name: 'Conteneur 40ft (Chine)', category: 'Logistique', price: null, stock: null, type: 'sourcing', image: 'https://via.placeholder.com/50' },
        { id: 4, name: 'Toyota Rav4 2023', category: 'Véhicule', price: null, stock: null, type: 'sourcing', image: 'https://via.placeholder.com/50' },
    ];

    const formatCurrency = (value) => {
        if (value === null) return 'Sur Devis';
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(value);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Pôle Boutique</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-mdla-yellow hover:bg-yellow-400 text-mdla-black px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Ajouter un Produit
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Catalogue Produits</h2>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mdla-yellow/50"
                            />
                        </div>
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <Filter className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Produit</th>
                                <th className="px-6 py-3">Catégorie</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Prix</th>
                                <th className="px-6 py-3">Stock</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                            <span className="font-medium text-gray-900">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.type === 'stock' ? (
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                En Stock
                                            </span>
                                        ) : (
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                Sur Commande
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                        {formatCurrency(product.price)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.stock !== null ? (
                                            <span className={`font-medium ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                                                {product.stock} unités
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Ajouter un Produit</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Type Switch */}
                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-gray-900">Type de Produit</h4>
                                    <p className="text-sm text-gray-500">
                                        {isSourcing ? 'Produit sur commande (Sourcing)' : 'Produit en stock immédiat'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsSourcing(!isSourcing)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isSourcing ? 'bg-blue-600' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isSourcing ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                        placeholder="Ex: iPhone 15 Pro"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                                    <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50">
                                        <option>Électronique</option>
                                        <option>Véhicules</option>
                                        <option>Accessoires</option>
                                        <option>Logistique</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center hover:bg-gray-50 cursor-pointer">
                                        <ImageIcon className="w-5 h-5 mx-auto text-gray-400" />
                                        <span className="text-xs text-gray-500">Upload</span>
                                    </div>
                                </div>

                                {!isSourcing && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA)</label>
                                            <div className="relative">
                                                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="number"
                                                    className="pl-9 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantité en stock</label>
                                            <div className="relative">
                                                <Package className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="number"
                                                    className="pl-9 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        rows="3"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                        placeholder="Description détaillée du produit..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    Annuler
                                </button>
                                <button className="px-4 py-2 bg-mdla-yellow hover:bg-yellow-400 text-mdla-black rounded-lg font-bold">
                                    Ajouter le produit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminShop;
