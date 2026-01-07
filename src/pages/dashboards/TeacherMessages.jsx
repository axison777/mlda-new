import React, { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import {
    Search,
    Send,
    Paperclip,
    MoreVertical,
    Phone,
    Video,
    User,
    CheckCheck,
    BookOpen
} from 'lucide-react';

const TeacherMessages = () => {
    const { messages, sendMessage, loadMessages, getConversations } = useChat();
    const { user } = useAuth();

    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchChats = async () => {
            const convos = await getConversations();
            const mapped = convos.map(c => ({
                id: c.contact.id,
                name: c.contact.name || c.contact.email,
                course: 'Allemand A1', // Mock course for now, ideally fetched from enrollments
                lastMessage: c.lastMessage?.content || '',
                time: c.lastMessage ? new Date(c.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                unread: c.unreadCount,
                status: 'offline' // Needs socket status
            }));
            setChats(mapped);

            // Auto-select first if available and none selected
            if (mapped.length > 0 && !selectedChat) {
                // optional: setSelectedChat(mapped[0].id);
            }
        };
        fetchChats();
    }, []);

    const handleSelectChat = (chatId) => {
        setSelectedChat(chatId);
        loadMessages(chatId);
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedChat) return;
        sendMessage(newMessage, selectedChat);
        setNewMessage('');
    };

    // Find current selected chat details
    const activeChatDetails = chats.find(c => c.id === selectedChat);

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Messagerie Étudiants</h1>
                    <p className="text-gray-500">Support et accompagnement pédagogique</p>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex">
                {/* Chat List */}
                <div className="w-80 border-r border-gray-100 flex flex-col">
                    <div className="p-4 border-b border-gray-100">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un élève..."
                                className="pl-9 w-full p-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-mdla-yellow focus:ring-0 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {chats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => handleSelectChat(chat.id)}
                                className={`p-4 flex gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${selectedChat === chat.id ? 'bg-blue-50/50' : ''}`}
                            >
                                <div className="relative">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-gray-500" />
                                    </div>
                                    {chat.status === 'online' && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                                        <span className="text-xs text-gray-400">{chat.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-blue-600 mb-1">
                                        <BookOpen className="w-3 h-3" />
                                        {chat.course}
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                                </div>
                                {chat.unread > 0 && (
                                    <div className="flex flex-col justify-center">
                                        <span className="w-5 h-5 bg-mdla-yellow text-mdla-black text-xs font-bold rounded-full flex items-center justify-center">
                                            {chat.unread}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                        {chats.length === 0 && (
                            <div className="p-8 text-center text-gray-400">
                                Aucun étudiant trouvé
                            </div>
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
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{activeChatDetails?.name}</h3>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-green-500 font-medium flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                En ligne
                                            </span>
                                            <span className="text-gray-300">|</span>
                                            <span className="text-gray-500">{activeChatDetails?.course}</span>
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
                                {messages.map((msg, index) => (
                                    <div
                                        key={msg.id || index}
                                        className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[70%] p-3 rounded-2xl ${msg.senderId === user?.id
                                                ? 'bg-mdla-yellow text-mdla-black rounded-tr-none'
                                                : 'bg-white text-gray-900 border border-gray-100 rounded-tl-none'
                                                }`}
                                        >
                                            <p className="text-sm">{msg.content}</p>
                                            <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${msg.senderId === user?.id ? 'text-black/60' : 'text-gray-400'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {msg.senderId === user?.id && <CheckCheck className="w-3 h-3" />}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSendMessage();
                                        }}
                                        placeholder="Écrivez votre message..."
                                        className="flex-1 p-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-mdla-yellow focus:ring-0 transition-colors"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="p-2 bg-mdla-yellow hover:bg-yellow-400 text-mdla-black rounded-lg transition-colors"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <p>Sélectionnez un étudiant pour commencer</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherMessages;
