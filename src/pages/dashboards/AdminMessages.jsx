import React, { useState } from 'react';
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
    CheckCheck
} from 'lucide-react';

const AdminMessages = () => {
    const [activeTab, setActiveTab] = useState('chat');
    const [selectedChat, setSelectedChat] = useState(1);

    // Mock Data for Live Chat
    const chats = [
        { id: 1, name: 'Moussa Diop', lastMessage: 'Bonjour, mon colis est-il arrivé ?', time: '10:30', unread: 2, status: 'online', avatar: null },
        { id: 2, name: 'Fatou Sow', lastMessage: 'Merci pour votre réponse.', time: 'Hier', unread: 0, status: 'offline', avatar: null },
        { id: 3, name: 'Jean Michel', lastMessage: 'Je voudrais commander 100 unités.', time: 'Hier', unread: 0, status: 'online', avatar: null },
    ];

    // Mock Messages for Selected Chat
    const messages = [
        { id: 1, sender: 'user', text: 'Bonjour, je voudrais savoir où en est mon colis #IMP-2024-001.', time: '10:25' },
        { id: 2, sender: 'admin', text: 'Bonjour Moussa, je vérifie cela tout de suite.', time: '10:28' },
        { id: 3, sender: 'user', text: 'Bonjour, mon colis est-il arrivé ?', time: '10:30' },
    ];

    // Mock Data for Inbox
    const inboxMessages = [
        { id: 1, name: 'Sophie Martin', email: 'sophie@test.com', subject: 'Demande de devis - Import Chine', message: 'Bonjour, je souhaite importer des conteneurs de Chine...', date: '15 Mar 2024', read: false },
        { id: 2, name: 'Paul Ndiaye', email: 'paul@test.com', subject: 'Problème de connexion', message: 'Je n\'arrive pas à accéder à mon cours...', date: '14 Mar 2024', read: true },
        { id: 3, name: 'Entreprise XYZ', email: 'contact@xyz.com', subject: 'Partenariat', message: 'Nous sommes une entreprise de transport...', date: '13 Mar 2024', read: true },
    ];

    return (
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
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    className="pl-9 w-full p-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-mdla-yellow focus:ring-0 transition-colors"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {chats.map((chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() => setSelectedChat(chat.id)}
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
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-gray-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Moussa Diop</h3>
                                    <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                        En ligne
                                    </span>
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
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] p-3 rounded-2xl ${msg.sender === 'admin'
                                                ? 'bg-mdla-yellow text-mdla-black rounded-tr-none'
                                                : 'bg-white text-gray-900 border border-gray-100 rounded-tl-none'
                                            }`}
                                    >
                                        <p className="text-sm">{msg.text}</p>
                                        <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${msg.sender === 'admin' ? 'text-black/60' : 'text-gray-400'}`}>
                                            {msg.time}
                                            {msg.sender === 'admin' && <CheckCheck className="w-3 h-3" />}
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
                                    placeholder="Écrivez votre message..."
                                    className="flex-1 p-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-mdla-yellow focus:ring-0 transition-colors"
                                />
                                <button className="p-2 bg-mdla-yellow hover:bg-yellow-400 text-mdla-black rounded-lg transition-colors">
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
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
    );
};

export default AdminMessages;
