import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Search, Send, File, Clock, Plus, User } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import NewConversationModal from '../../components/NewConversationModal';

const UserMessages = () => {
    const { user } = useAuth();
    const {
        messages,
        loadMessages,
        sendMessage,
        getConversations,
        connected,
        markMessagesAsRead,
        initiateConversation
    } = useChat();

    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [showNewConversationModal, setShowNewConversationModal] = useState(false);
    const messagesEndRef = useRef(null);

    // Load conversations on mount
    useEffect(() => {
        loadConversations();
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Reload conversations when new messages arrive
    useEffect(() => {
        if (messages.length > 0 && selectedChat) {
            // Refresh conversations to update last message
            loadConversations();
        }
    }, [messages]);

    const loadConversations = async () => {
        setLoading(true);
        try {
            const convs = await getConversations();
            setConversations(convs);
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSelectConversation = async (contact) => {
        setSelectedChat(contact);
        await loadMessages(contact.id);
        await markMessagesAsRead(contact.id);
        await loadConversations(); // Refresh to update unread count
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedChat) return;

        sendMessage(messageInput, selectedChat.id);
        setMessageInput('');
    };

    const handleNewConversation = async (selectedUser) => {
        try {
            // Initiate conversation
            await initiateConversation(selectedUser.id);

            // Set as selected chat
            setSelectedChat(selectedUser);

            // Load messages (will be empty for new conversation)
            await loadMessages(selectedUser.id);

            // Refresh conversations
            await loadConversations();
        } catch (error) {
            console.error('Error starting new conversation:', error);
        }
    };

    const getInitials = (name) => {
        if (!name) return '??';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        } else if (diffInHours < 48) {
            return 'Hier';
        } else {
            return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        }
    };

    const filteredConversations = conversations.filter(conv =>
        conv.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.contact.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                {/* Sidebar List */}
                <div className="w-full md:w-80 border-r border-gray-100 flex flex-col">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Messages</h2>
                            <button
                                onClick={() => setShowNewConversationModal(true)}
                                className="p-2 bg-mdla-yellow hover:bg-mdla-yellow/80 rounded-full transition-colors"
                                title="Nouvelle conversation"
                            >
                                <Plus className="w-5 h-5 text-mdla-black" />
                            </button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-mdla-yellow/50"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mdla-yellow"></div>
                            </div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm mb-4">
                                    {searchQuery ? 'Aucune conversation trouvée' : 'Aucune conversation'}
                                </p>
                                {!searchQuery && (
                                    <button
                                        onClick={() => setShowNewConversationModal(true)}
                                        className="text-sm text-mdla-yellow hover:underline"
                                    >
                                        Démarrer une conversation
                                    </button>
                                )}
                            </div>
                        ) : (
                            filteredConversations.map(conv => (
                                <div
                                    key={conv.contact.id}
                                    onClick={() => handleSelectConversation(conv.contact)}
                                    className={`p-4 hover:bg-gray-50 cursor-pointer flex gap-3 border-b border-gray-50 transition-colors ${selectedChat?.id === conv.contact.id ? 'bg-blue-50/30' : ''
                                        } ${conv.unreadCount > 0 ? 'bg-blue-50/20' : ''}`}
                                >
                                    <div className="w-10 h-10 bg-mdla-yellow rounded-full flex items-center justify-center font-bold text-mdla-black text-sm shrink-0">
                                        {getInitials(conv.contact.name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`font-bold text-sm truncate ${conv.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                                                {conv.contact.name}
                                            </h4>
                                            {conv.lastMessage && (
                                                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                                    {formatTime(conv.lastMessage.createdAt)}
                                                </span>
                                            )}
                                        </div>
                                        {conv.lastMessage && (
                                            <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                                {conv.lastMessage.content}
                                            </p>
                                        )}
                                    </div>
                                    {conv.unreadCount > 0 && (
                                        <div className="w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-bold shrink-0">
                                            {conv.unreadCount}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-gray-50/50">
                    {selectedChat ? (
                        <>
                            {/* Header */}
                            <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-mdla-yellow rounded-full flex items-center justify-center font-bold text-mdla-black text-sm">
                                        {getInitials(selectedChat.name)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{selectedChat.name}</h3>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            {selectedChat.email}
                                        </div>
                                    </div>
                                </div>
                                {connected && (
                                    <div className="flex items-center gap-1 text-xs text-green-600">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        Connecté
                                    </div>
                                )}
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {messages.length === 0 ? (
                                    <div className="text-center py-12">
                                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">Aucun message pour le moment</p>
                                        <p className="text-sm text-gray-400 mt-1">Envoyez un message pour démarrer la conversation</p>
                                    </div>
                                ) : (
                                    <>
                                        {messages.map((message, index) => {
                                            const isMyMessage = message.senderId === user.id;
                                            const showDateDivider = index === 0 ||
                                                new Date(messages[index - 1].createdAt).toDateString() !== new Date(message.createdAt).toDateString();

                                            return (
                                                <React.Fragment key={message.id}>
                                                    {showDateDivider && (
                                                        <div className="flex justify-center">
                                                            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                                                {new Date(message.createdAt).toLocaleDateString('fr-FR', {
                                                                    weekday: 'long',
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className={`flex gap-4 max-w-[80%] ${isMyMessage ? 'ml-auto flex-row-reverse' : ''}`}>
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isMyMessage ? 'bg-gray-900 text-white' : 'bg-mdla-yellow text-mdla-black'
                                                            }`}>
                                                            {isMyMessage ? getInitials(user.name) : getInitials(selectedChat.name)}
                                                        </div>
                                                        <div>
                                                            <div className={`p-4 rounded-2xl shadow-sm text-sm ${isMyMessage
                                                                    ? 'bg-blue-600 text-white rounded-tr-sm'
                                                                    : 'bg-white text-gray-700 rounded-tl-sm'
                                                                }`}>
                                                                {message.content}
                                                            </div>
                                                            <span className={`text-xs text-gray-400 mt-1 block ${isMyMessage ? 'text-right' : ''}`}>
                                                                {formatTime(message.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </>
                                )}
                            </div>

                            {/* Input */}
                            <div className="p-4 bg-white border-t border-gray-100">
                                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <File className="w-5 h-5" />
                                    </button>
                                    <input
                                        type="text"
                                        placeholder="Écrivez votre message..."
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        className="flex-1 bg-gray-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-mdla-yellow/50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!messageInput.trim()}
                                        className="p-3 bg-mdla-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Sélectionnez une conversation</h3>
                                <p className="text-gray-500 mb-6">Choisissez une conversation existante ou démarrez-en une nouvelle</p>
                                <button
                                    onClick={() => setShowNewConversationModal(true)}
                                    className="px-6 py-3 bg-mdla-yellow hover:bg-mdla-yellow/80 text-mdla-black font-bold rounded-xl transition-colors inline-flex items-center gap-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    Nouvelle conversation
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* New Conversation Modal */}
            <NewConversationModal
                isOpen={showNewConversationModal}
                onClose={() => setShowNewConversationModal(false)}
                onSelectUser={handleNewConversation}
            />
        </>
    );
};

export default UserMessages;
