import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, Archive, ExternalLink, Calendar } from 'lucide-react';
import api from '../../utils/api';

const TransitArchives = () => {
    const [archives, setArchives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchArchives = async () => {
            try {
                // Fetch all orders for transit, then filter the completed/delivered ones
                const { data } = await api.get('/orders/all');
                const delivered = data.filter(order => order.status === 'delivered');
                setArchives(delivered);
            } catch (error) {
                console.error('Error fetching archives:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArchives();
    }, []);

    const filteredArchives = archives.filter(archive => 
        archive.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        archive.items?.[0]?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mdla-yellow"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 font-outfit uppercase tracking-tight flex items-center gap-3">
                        <Archive className="w-8 h-8 text-gray-400" />
                        Archives
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Historique des dossiers de transit clôturés et livrés.</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher (N° Tracking...)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-mdla-yellow/50 focus:border-mdla-yellow outline-none text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Tracking</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Détails</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Client</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Clôturé le</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredArchives.length > 0 ? (
                                filteredArchives.map((archive) => (
                                    <tr key={archive.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                                                {archive.trackingNumber}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{archive.items?.[0]?.name || archive.type}</p>
                                            <p className="text-xs text-gray-500">{archive.type}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{archive.user?.name || 'N/A'}</p>
                                            <p className="text-xs text-gray-500">{archive.user?.email || 'N/A'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {new Date(archive.updatedAt).toLocaleDateString('fr-FR')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
                                                Archivé
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        Aucune archive trouvée.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TransitArchives;
