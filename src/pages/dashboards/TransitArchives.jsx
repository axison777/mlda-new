import React from 'react';
import { Archive, Search, FileText, Calendar, Download } from 'lucide-react';

const TransitArchives = () => {
    // Mock Data
    const archives = [
        { id: 'ARC-2022-885', client: 'Société A', ref: 'IMP-001', date: '12 Dec 2022', status: 'Clôturé', type: 'Import' },
        { id: 'ARC-2022-452', client: 'Jean Michel', ref: 'EXP-992', date: '05 Nov 2022', status: 'Clôturé', type: 'Export' },
        { id: 'ARC-2021-112', client: 'Transport Express', ref: 'IMP-882', date: '15 Jan 2021', status: 'Archivé', type: 'Import' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Archives Transit</h1>
                    <p className="text-gray-500">Historique des dossiers clôturés et archivés.</p>
                </div>
                <button className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Exporter tout
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Rechercher un dossier, client, référence..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50"
                        />
                    </div>
                    <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 font-medium">
                        <option>2023</option>
                        <option>2022</option>
                        <option>2021</option>
                    </select>
                </div>

                {/* Table */}
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">ID Dossier</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Date Clôture</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {archives.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900">{item.id}</td>
                                <td className="px-6 py-4 text-gray-700">{item.client}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.type === 'Import' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                        {item.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {item.date}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs font-bold">
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-mdla-black hover:bg-gray-200 p-2 rounded-lg transition-colors">
                                        <FileText className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {archives.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <Archive className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>Aucun dossier archivé trouvé.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransitArchives;
