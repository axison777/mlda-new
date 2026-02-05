import React, { useState, useEffect } from 'react';
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
    ToggleRight,
    Loader2
} from 'lucide-react';
import api from '../../utils/api';

const AdminShop = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isSourcing, setIsSourcing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Électronique',
        price: '',
        stock: '',
        description: '',
        image: '',
        type: 'stock',
        badge: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);
        setIsUploading(true);

        try {
            const { data } = await api.post('/upload/', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setFormData({ ...formData, image: data.image });
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Erreur lors du chargement de l\'image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price || '',
            stock: product.stock || '',
            description: product.description || '',
            image: product.image || '',
            type: product.type,
            badge: product.badge || ''
        });
        setIsSourcing(product.type === 'sourcing');
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            type: isSourcing ? 'sourcing' : 'stock',
            price: isSourcing ? null : (formData.price || 0),
            stock: isSourcing ? null : (formData.stock || 0)
        };

        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, payload);
            } else {
                await api.post('/products', payload);
            }
            setShowAddModal(false);
            setEditingProduct(null);
            setFormData({
                name: '',
                category: 'Électronique',
                price: '',
                stock: '',
                description: '',
                image: '',
                type: 'stock',
                badge: ''
            });
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const formatCurrency = (value) => {
        if (value === null || value === undefined || value === 0) return 'Sur Devis';
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(value);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Pôle Boutique</h1>
                <button
                    onClick={() => {
                        setEditingProduct(null);
                        setFormData({
                            name: '',
                            category: 'Électronique',
                            price: '',
                            stock: '',
                            description: '',
                            image: '',
                            type: 'stock',
                            badge: ''
                        });
                        setIsSourcing(false);
                        setShowAddModal(true);
                    }}
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
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-10 h-10 text-mdla-yellow animate-spin" />
                        </div>
                    ) : (
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
                                            {product.stock !== null && product.stock !== undefined ? (
                                                <span className={`font-medium ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                                                    {product.stock} unités
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEdit(product)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Add/Edit Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingProduct ? 'Modifier le Produit' : 'Ajouter un Produit'}
                            </h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Type Switch */}
                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-gray-900">Type de Produit</h4>
                                    <p className="text-sm text-gray-500">
                                        {isSourcing ? 'Produit sur commande (Sourcing)' : 'Produit en stock immédiat'}
                                    </p>
                                </div>
                                <button
                                    type="button"
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
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                        placeholder="Ex: iPhone 15 Pro"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                    >
                                        <option>Électronique</option>
                                        <option>Véhicules</option>
                                        <option>Accessoires</option>
                                        <option>Logistique</option>
                                        <option>Alimentaire & Boissons</option>
                                        <option>Ustensiles de Cuisine</option>
                                        <option>Gadgets</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image du produit</label>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="relative flex-1">
                                                <input
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    id="product-image-upload"
                                                    accept="image/*"
                                                />
                                                <label
                                                    htmlFor="product-image-upload"
                                                    className={`flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                                                >
                                                    {isUploading ? (
                                                        <Loader2 className="w-5 h-5 animate-spin text-mdla-yellow" />
                                                    ) : (
                                                        <Plus className="w-5 h-5 text-gray-400" />
                                                    )}
                                                    <span className="text-sm text-gray-600">
                                                        {isUploading ? 'Chargement...' : 'Charger une image'}
                                                    </span>
                                                </label>
                                            </div>
                                            {formData.image && (
                                                <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center">
                                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <ImageIcon className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                name="image"
                                                value={formData.image}
                                                onChange={handleChange}
                                                className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50 text-xs"
                                                placeholder="Ou collez l'URL de l'image"
                                            />
                                        </div>
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
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleChange}
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
                                                    name="stock"
                                                    value={formData.stock}
                                                    onChange={handleChange}
                                                    className="pl-9 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Badge (ex: Nouveau, Promo)</label>
                                    <input
                                        type="text"
                                        name="badge"
                                        value={formData.badge}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                        placeholder="Nouveau"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        rows="3"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                                        placeholder="Description détaillée du produit..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    Annuler
                                </button>
                                <button type="submit" className="px-4 py-2 bg-mdla-yellow hover:bg-yellow-400 text-mdla-black rounded-lg font-bold">
                                    {editingProduct ? 'Enregistrer les modifications' : 'Ajouter le produit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminShop;
