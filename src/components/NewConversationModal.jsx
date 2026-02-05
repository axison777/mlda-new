import React, { useState, useEffect } from 'react';
import { X, Search, User, Mail } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const NewConversationModal = ({ isOpen, onClose, onSelectUser }) => {
    const { getAvailableUsers } = useChat();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadUsers();
        }
    }, [isOpen]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredUsers(users);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.role.toLowerCase().includes(query)
            );
            setFilteredUsers(filtered);
        }
    }, [searchQuery, users]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const availableUsers = await getAvailableUsers();
            setUsers(availableUsers);
            setFilteredUsers(availableUsers);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectUser = (user) => {
        onSelectUser(user);
        setSearchQuery('');
        onClose();
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-700';
            case 'teacher':
                return 'bg-blue-100 text-blue-700';
            case 'user':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'admin':
                return 'Admin';
            case 'teacher':
                return 'Enseignant';
            case 'user':
                return 'Utilisateur';
            default:
                return role;
        }
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Nouvelle conversation</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-6 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, email ou rôle..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-mdla-yellow/50"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Users List */}
                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mdla-yellow"></div>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-12">
                            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">
                                {searchQuery ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur disponible'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredUsers.map(user => (
                                <button
                                    key={user.id}
                                    onClick={() => handleSelectUser(user)}
                                    className="w-full p-4 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-4 text-left group"
                                >
                                    <div className="w-12 h-12 bg-mdla-yellow rounded-full flex items-center justify-center font-bold text-mdla-black shrink-0 group-hover:scale-105 transition-transform">
                                        {getInitials(user.name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-gray-900 truncate">
                                                {user.name}
                                            </h4>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleBadgeColor(user.role)}`}>
                                                {getRoleLabel(user.role)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Mail className="w-3 h-3" />
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewConversationModal;
