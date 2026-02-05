import { useState, useEffect } from 'react';
import { Mail, Search, Eye, Trash2, CheckCircle, MessageSquare, Filter, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const AdminContactMessages = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [counts, setCounts] = useState({ new: 0, read: 0, replied: 0, total: 0 });
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

    useEffect(() => {
        fetchMessages();
    }, [statusFilter, pagination.page, searchQuery]);

    const fetchMessages = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                ...(statusFilter !== 'all' && { status: statusFilter }),
                ...(searchQuery && { search: searchQuery })
            });

            console.log('🔍 Fetching contact messages...');
            const { data } = await api.get(`/contact?${params}`);

            console.log('✅ Data received:', data);
            setMessages(data.messages);
            setPagination(data.pagination);
            setCounts(data.counts);
        } catch (error) {
            console.error('❌ Fetch error:', error);
            setError(`Erreur réseau: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleViewMessage = async (message) => {
        setSelectedMessage(message);

        // Mark as read if it's new
        if (message.status === 'new') {
            await updateMessageStatus(message.id, 'read');
        }
    };

    const updateMessageStatus = async (id, status) => {
        try {
            await api.put(`/contact/${id}/status`, { status });

            fetchMessages();
            if (selectedMessage && selectedMessage.id === id) {
                setSelectedMessage({ ...selectedMessage, status });
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDeleteMessage = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;

        try {
            await api.delete(`/contact/${id}`);

            if (selectedMessage && selectedMessage.id === id) {
                setSelectedMessage(null);
            }
            fetchMessages();
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            new: 'bg-blue-100 text-blue-800',
            read: 'bg-gray-100 text-gray-800',
            replied: 'bg-green-100 text-green-800'
        };
        const labels = {
            new: 'Nouveau',
            read: 'Lu',
            replied: 'Répondu'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredMessages = messages;

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Messages de Contact</h1>
                <p className="text-gray-600">Gérez les demandes de contact des visiteurs</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
                        </div>
                        <Mail className="w-8 h-8 text-gray-400" />
                    </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200 bg-blue-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600">Nouveaux</p>
                            <p className="text-2xl font-bold text-blue-900">{counts.new}</p>
                        </div>
                        <MessageSquare className="w-8 h-8 text-blue-400" />
                    </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Lus</p>
                            <p className="text-2xl font-bold text-gray-900">{counts.read}</p>
                        </div>
                        <Eye className="w-8 h-8 text-gray-400" />
                    </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200 bg-green-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600">Répondus</p>
                            <p className="text-2xl font-bold text-green-900">{counts.replied}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <X className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                {error}
                            </p>
                        </div>
                    </div>
                </div>
            )
            }

            {/* Filters and Search */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, email ou sujet..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'all'
                                ? 'bg-mdla-yellow text-mdla-black'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Tous
                        </button>
                        <button
                            onClick={() => setStatusFilter('new')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'new'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Nouveaux
                        </button>
                        <button
                            onClick={() => setStatusFilter('read')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'read'
                                ? 'bg-gray-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Lus
                        </button>
                        <button
                            onClick={() => setStatusFilter('replied')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'replied'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Répondus
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages Table */}
            <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mdla-yellow"></div>
                        </div>
                    ) : filteredMessages.length === 0 ? (
                        <div className="text-center py-12">
                            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Aucun message trouvé</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Expéditeur
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sujet
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Message
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredMessages.map((message) => (
                                    <tr
                                        key={message.id}
                                        className={`hover:bg-gray-50 cursor-pointer ${message.status === 'new' ? 'bg-blue-50/30' : ''
                                            }`}
                                        onClick={() => handleViewMessage(message)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{message.name}</div>
                                            <div className="text-sm text-gray-500">{message.email}</div>
                                            {message.phone && (
                                                <div className="text-xs text-gray-400">{message.phone}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{message.subject}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                            {message.message}
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(message.status)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(message.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleViewMessage(message);
                                                }}
                                                className="text-mdla-yellow hover:text-yellow-600 mr-3"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Page {pagination.page} sur {pagination.pages} ({pagination.total} messages)
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                                disabled={pagination.page === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Précédent
                            </button>
                            <button
                                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                                disabled={pagination.page === pagination.pages}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Message Detail Modal */}
            {
                selectedMessage && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedMessage.subject}</h2>
                                    <div className="flex items-center gap-3">
                                        {getStatusBadge(selectedMessage.status)}
                                        <span className="text-sm text-gray-500">
                                            {formatDate(selectedMessage.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Expéditeur</h3>
                                    <p className="text-gray-900 font-medium">{selectedMessage.name}</p>
                                    <p className="text-gray-600">{selectedMessage.email}</p>
                                    {selectedMessage.phone && (
                                        <p className="text-gray-600">{selectedMessage.phone}</p>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Message</h3>
                                    <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-200 flex justify-between">
                                <button
                                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Supprimer
                                </button>
                                <div className="flex gap-2">
                                    {selectedMessage.status !== 'replied' && (
                                        <button
                                            onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Marquer comme répondu
                                        </button>
                                    )}
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                        className="px-4 py-2 bg-mdla-yellow text-mdla-black rounded-lg hover:bg-yellow-400 transition-colors flex items-center gap-2"
                                    >
                                        <Mail className="w-4 h-4" />
                                        Répondre par email
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default AdminContactMessages;
