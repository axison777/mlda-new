import React, { useState, useEffect, useRef } from 'react';
import {
    MessageSquare,
    Mail,
    Search,
    Send,
    Paperclip,
    MoreVertical,
    Phone,
    Video,
    User,
    Clock,
    CheckCheck,
    Plus
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import NewConversationModal from '../../components/NewConversationModal';

const AdminMessages = () => {
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

    const [activeTab, setActiveTab] = useState('chat');
    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [showNewConversationModal, setShowNewConversationModal] = useState(false);
    const messagesEndRef = useRef(null);

    // Mock Data for Inbox (kept as is since it's a different feature)
    const inboxMessages = [
        { id: 1, name: 'Sophie Martin', email: 'sophie@test.com', subject: 'Demande de devis - Import Chine', message: 'Bonjour, je souhaite importer des conteneurs de Chine...', date: '15 Mar 2024', read: false },
        { id: 2, name: 'Paul Ndiaye', email: 'paul@test.com', subject: 'Problème de connexion', message: 'Je n\'arrive pas à accéder à mon cours...', date: '14 Mar 2024', read: true },
        { id: 3, name: 'Entreprise XYZ', email: 'contact@xyz.com', subject: 'Partenariat', message: 'Nous sommes une entreprise de transport...', date: '13 Mar 2024', read: true },
    ];

    // Load conversations on mount
    useEffect(() => {
        if (activeTab === 'chat') {
            loadConversations();
        }
    }, [activeTab]);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
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
            await initiateConversation(selectedUser.id);
            setSelectedChat(selectedUser);
            await loadMessages(selectedUser.id);
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
            <div className="h-[calc(100vh-2rem)] flex flex-col p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Communication</h1>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'chat' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Live Chat
                        </button>
                        <button
                            onClick={() => setActiveTab('inbox')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'inbox' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Inbox Contact
                        </button>
                    </div>
                </div>

                {activeTab === 'chat' ? (
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex">
                        {/* Chat List */}
                        <div className="w-80 border-r border-gray-100 flex flex-col">
                            <div className="p-4 border-b border-gray-100">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-semibold text-gray-900">Conversations</h3>
                                    <button
                                        onClick={() => setShowNewConversationModal(true)}
                                        className="p-1.5 bg-mdla-yellow hover:bg-mdla-yellow/80 rounded-full transition-colors"
                                        title="Nouvelle conversation"
                                    >
                                        <Plus className="w-4 h-4 text-mdla-black" />
                                    </button>
                                </div>
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 w-full p-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-mdla-yellow focus:ring-0 transition-colors"
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
                                    filteredConversations.map((conv) => (
                                        <div
                                            key={conv.contact.id}
                                            onClick={() => handleSelectConversation(conv.contact)}
                                            className={`p-4 flex gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${selectedChat?.id === conv.contact.id ? 'bg-blue-50/50' : ''
                                                } ${conv.unreadCount > 0 ? 'bg-blue-50/20' : ''}`}
                                        >
                                            <div className="relative">
                                                <div className="w-10 h-10 bg-mdla-yellow rounded-full flex items-center justify-center font-bold text-mdla-black text-sm">
                                                    {getInitials(conv.contact.name)}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-semibold text-gray-900 truncate">{conv.contact.name}</h3>
                                                    {conv.lastMessage && (
                                                        <span className="text-xs text-gray-400">{formatTime(conv.lastMessage.createdAt)}</span>
                                                    )}
                                                </div>
                                                {conv.lastMessage && (
                                                    <p className="text-sm text-gray-500 truncate">{conv.lastMessage.content}</p>
                                                )}
                                            </div>
                                            {conv.unreadCount > 0 && (
                                                <div className="flex flex-col justify-center">
                                                    <span className="w-5 h-5 bg-mdla-yellow text-mdla-black text-xs font-bold rounded-full flex items-center justify-center">
                                                        {conv.unreadCount}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 flex flex-col">
                            {selectedChat ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-mdla-yellow rounded-full flex items-center justify-center font-bold text-mdla-black text-sm">
                                                {getInitials(selectedChat.name)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{selectedChat.name}</h3>
                                                <div className="flex items-center gap-2 text-xs">
                                                    {connected && (
                                                        <span className="text-green-500 font-medium flex items-center gap-1">
                                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                            En ligne
                                                        </span>
                                                    )}
                                                    <span className="text-gray-500">{selectedChat.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                                                <Phone className="w-5 h-5" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                                                <Video className="w-5 h-5" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
                                        {messages.length === 0 ? (
                                            <div className="text-center py-12">
                                                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-500">Aucun message pour le moment</p>
                                            </div>
                                        ) : (
                                            <>
                                                {messages.map((msg) => {
                                                    const isMyMessage = msg.senderId === user.id;
                                                    return (
                                                        <div
                                                            key={msg.id}
                                                            className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                                                        >
                                                            <div
                                                                className={`max-w-[70%] p-3 rounded-2xl ${isMyMessage
                                                                        ? 'bg-mdla-yellow text-mdla-black rounded-tr-none'
                                                                        : 'bg-white text-gray-900 border border-gray-100 rounded-tl-none'
                                                                    }`}
                                                            >
                                                                <p className="text-sm">{msg.content}</p>
                                                                <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${isMyMessage ? 'text-black/60' : 'text-gray-400'}`}>
                                                                    {formatTime(msg.createdAt)}
                                                                    {isMyMessage && <CheckCheck className="w-3 h-3" />}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                <div ref={messagesEndRef} />
                                            </>
                                        )}
                                    </div>

                                    {/* Input Area */}
                                    <div className="p-4 bg-white border-t border-gray-100">
                                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                            <button type="button" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                                                <Paperclip className="w-5 h-5" />
                                            </button>
                                            <input
                                                type="text"
                                                placeholder="Écrivez votre message..."
                                                value={messageInput}
                                                onChange={(e) => setMessageInput(e.target.value)}
                                                className="flex-1 p-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-mdla-yellow focus:ring-0 transition-colors"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!messageInput.trim()}
                                                className="p-2 bg-mdla-yellow hover:bg-yellow-400 text-mdla-black rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                ) : (
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 w-10">
                                            <input type="checkbox" className="rounded border-gray-300 text-mdla-yellow focus:ring-mdla-yellow" />
                                        </th>
                                        <th className="px-6 py-3">Expéditeur</th>
                                        <th className="px-6 py-3">Sujet</th>
                                        <th className="px-6 py-3">Message</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inboxMessages.map((msg) => (
                                        <tr key={msg.id} className={`border-b hover:bg-gray-50 cursor-pointer ${!msg.read ? 'bg-blue-50/30' : 'bg-white'}`}>
                                            <td className="px-6 py-4">
                                                <input type="checkbox" className="rounded border-gray-300 text-mdla-yellow focus:ring-mdla-yellow" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{msg.name}</div>
                                                <div className="text-xs text-gray-500">{msg.email}</div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{msg.subject}</td>
                                            <td className="px-6 py-4 text-gray-500 truncate max-w-xs">{msg.message}</td>
                                            <td className="px-6 py-4 text-gray-500">{msg.date}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-gray-400 hover:text-gray-600">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
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

export default AdminMessages;
