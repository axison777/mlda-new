import React, { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import {
    Search,
    MessageSquare,
    Paperclip,
    Send,
    X,
    Info,
    MoreVertical,
    Phone,
    Video,
    ChevronLeft,
    FileText,
    DollarSign,
    MapPin,
    Truck
} from 'lucide-react';

const TransitChat = () => {
    const { messages, sendMessage, loadMessages, activeChat, getConversations } = useChat();
    const { user } = useAuth();

    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [showContext, setShowContext] = useState(true);
    const [mobileView, setMobileView] = useState('list');
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchConvos = async () => {
            const convos = await getConversations();
            // Transform to match UI expectation somewhat or adapt UI
            // For now, let's map it
            const mapped = convos.map(c => ({
                id: c.contact.id,
                client: c.contact.name || c.contact.email,
                avatar: (c.contact.name || c.contact.email).substring(0, 2).toUpperCase(),
                lastMessage: c.lastMessage?.content || '',
                time: c.lastMessage ? new Date(c.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                unread: c.unreadCount,
                online: false, // Need socket for real-time online status
                // Mock folder data for now as backend doesn't link it yet
                folder: {
                    id: 'TRK-9821',
                    item: 'Dossier Import',
                    status: 'En cours',
                    location: 'Port',
                    balance: '0 FCFA',
                    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb'
                }
            }));
            setConversations(mapped);
        };
        fetchConvos();

        // Refresh every 30s? Or rely on socket events updating global state?
        // Ideally socket events should update a "last message" store.
    }, []);

    const handleSelectChat = (chat) => {
        setSelectedChat(chat);
        setMobileView('chat');
        loadMessages(chat.id); // Load history
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedChat) return;
        sendMessage(newMessage, selectedChat.id);
        setNewMessage('');
    };

    return (
        <div className="flex h-[calc(100vh-100px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

            {/* Column 1: Conversations List */}
            <div className={`w-full md:w-1/4 border-r border-gray-200 flex flex-col ${mobileView !== 'list' ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Messagerie</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Chercher un client..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mdla-yellow/50"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => handleSelectChat(chat)}
                            className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${selectedChat?.id === chat.id ? 'bg-yellow-50/50' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 relative">
                                        {chat.avatar}
                                        {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{chat.client}</h3>
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">
                                                {chat.folder.item}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">{chat.time}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2 pl-13">
                                <p className="text-sm text-gray-500 truncate max-w-[180px]">{chat.lastMessage}</p>
                                {chat.unread > 0 && (
                                    <span className="w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {chat.unread}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                    {conversations.length === 0 && (
                        <div className="p-8 text-center text-gray-400">
                            Aucune conversation
                        </div>
                    )}
                </div>
            </div>

            {/* Column 2: Chat Zone */}
            <div className={`w-full md:w-1/2 flex flex-col bg-gray-50 ${mobileView !== 'chat' ? 'hidden md:flex' : 'flex'}`}>
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm z-10">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setMobileView('list')} className="md:hidden p-1 hover:bg-gray-100 rounded-full">
                                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                                </button>
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                    {selectedChat.avatar}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{selectedChat.client}</h3>
                                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div> En ligne
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                                    <Phone className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                                    <Video className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => {
                                        setShowContext(!showContext);
                                        if (window.innerWidth < 768) setMobileView('context');
                                    }}
                                    className={`p-2 rounded-full ${showContext ? 'text-mdla-yellow bg-black' : 'text-gray-400 hover:bg-gray-100'}`}
                                >
                                    <Info className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, index) => {
                                const isMe = msg.senderId === user?.id;
                                return (
                                    <div key={msg.id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${isMe
                                            ? 'bg-mdla-yellow text-mdla-black rounded-tr-none'
                                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                            }`}>
                                            <p className="text-sm">{msg.content}</p>
                                            <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-yellow-800/60' : 'text-gray-400'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-200">
                            <div className="flex items-end gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-mdla-yellow/50 focus-within:border-mdla-yellow">
                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <textarea
                                    placeholder="Écrivez votre message..."
                                    rows="1"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    // Submit on Enter (shift+enter for newline)
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2 max-h-32 text-sm"
                                    style={{ minHeight: '40px' }}
                                ></textarea>
                                <button
                                    onClick={handleSendMessage}
                                    className="p-2 bg-mdla-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                        <p>Sélectionnez une conversation pour commencer</p>
                    </div>
                )}
            </div>

            {/* Column 3: Context (Right Sidebar) */}
            {selectedChat && (
                <div className={`w-full md:w-1/4 bg-white border-l border-gray-200 flex flex-col ${showContext ? (mobileView === 'context' ? 'flex fixed inset-0 z-50' : 'hidden md:flex') : 'hidden'
                    }`}>
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Dossier Associé</h3>
                        <button
                            onClick={() => {
                                setShowContext(false);
                                if (window.innerWidth < 768) setMobileView('chat');
                            }}
                            className="p-1 hover:bg-gray-100 rounded-full"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {/* Product Image */}
                        <div className="mb-6 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                            <img src={selectedChat.folder.image} alt="Product" className="w-full h-40 object-cover" />
                            <div className="p-3 bg-gray-50">
                                <h4 className="font-bold text-gray-900">{selectedChat.folder.item}</h4>
                                <div className="text-xs text-gray-500 font-mono mt-1">{selectedChat.folder.id}</div>
                            </div>
                        </div>

                        {/* Status Timeline Mini */}
                        <div className="mb-6">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Statut Actuel</h4>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{selectedChat.folder.status}</div>
                                    <div className="text-gray-500 text-xs">{selectedChat.folder.location}</div>
                                </div>
                            </div>
                        </div>

                        {/* Finances */}
                        <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100">
                            <div className="flex items-center gap-2 text-red-800 font-bold mb-1">
                                <DollarSign className="w-4 h-4" />
                                Reste à Payer
                            </div>
                            <div className="text-2xl font-bold text-red-600">{selectedChat.folder.balance}</div>
                            <button className="w-full mt-3 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors">
                                Envoyer Rappel Paiement
                            </button>
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-2">
                            <button className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center justify-center gap-2">
                                <FileText className="w-4 h-4" />
                                Voir le Dossier Complet
                            </button>
                            <button className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center justify-center gap-2">
                                <Truck className="w-4 h-4" />
                                Mettre à jour Statut
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransitChat;
