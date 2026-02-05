import React, { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { Search, Send, MoreVertical, ArrowLeft } from 'lucide-react';
import api from '../utils/api';

const Messages = () => {
    const { user } = useAuth();
    const { messages, loadMessages, sendMessage, connected, activeChat, fetchUnreadCount } = useChat();
    const [conversations, setConversations] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/chat/conversations');
            setConversations(data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectContact = async (contact) => {
        setSelectedContact(contact);
        await loadMessages(contact.id);
        // Mark messages as read
        await api.put(`/chat/read/${contact.id}`);
        // Refresh conversations and unread count
        fetchConversations();
        fetchUnreadCount();
    };

    const handleSendMessage = () => {
        if (!messageInput.trim() || !selectedContact) return;

        sendMessage(messageInput, selectedContact.id);
        setMessageInput('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    };

    const filteredConversations = conversations.filter(conv =>
        conv.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.contact.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Conversations List */}
            <div className={`${selectedContact ? 'hidden md:flex' : 'flex'} w-full md:w-96 bg-white border-r border-gray-200 flex-col`}>
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Rechercher une conversation..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Conversations */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500">Chargement...</div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            {searchQuery ? 'Aucune conversation trouvée' : 'Aucune conversation'}
                        </div>
                    ) : (
                        filteredConversations.map((conv) => (
                            <button
                                key={conv.contact.id}
                                onClick={() => handleSelectContact(conv.contact)}
                                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${selectedContact?.id === conv.contact.id ? 'bg-blue-50' : ''
                                    }`}
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                    {conv.contact.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 text-left overflow-hidden">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-semibold text-gray-900 truncate">{conv.contact.name}</h3>
                                        {conv.lastMessage && (
                                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                                {formatTime(conv.lastMessage.createdAt)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-600 truncate">
                                            {conv.lastMessage?.content || 'Aucun message'}
                                        </p>
                                        {conv.unreadCount > 0 && (
                                            <span className="ml-2 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`${selectedContact ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-white`}>
                {selectedContact ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedContact(null)}
                                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                    {selectedContact.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-900">{selectedContact.name}</h2>
                                    <p className="text-sm text-gray-500">{selectedContact.role}</p>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <MoreVertical className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => {
                                const isSent = message.senderId === user.id;
                                return (
                                    <div
                                        key={message.id}
                                        className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isSent
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200 text-gray-900'
                                                }`}
                                        >
                                            <p className="text-sm">{message.content}</p>
                                            <span className={`text-xs ${isSent ? 'text-blue-100' : 'text-gray-500'} mt-1 block`}>
                                                {formatTime(message.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Tapez votre message..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!messageInput.trim()}
                                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                            {!connected && (
                                <p className="text-xs text-red-500 mt-2">Déconnecté - Reconnexion...</p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Sélectionnez une conversation</h3>
                            <p className="text-sm text-gray-500">Choisissez un contact pour commencer à discuter</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
