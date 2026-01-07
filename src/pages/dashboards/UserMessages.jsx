import React from 'react';
import { MessageSquare, Search, Send, File, Clock } from 'lucide-react';

const UserMessages = () => {
    // Mock Data
    const conversations = [
        { id: 1, name: 'Service Client', lastMessage: 'Votre dossier a été validé.', time: '10:30', unread: 2, avatar: 'SC' },
        { id: 2, name: 'Prof. Schmidt', lastMessage: 'N\'oubliez pas le devoir pour demain.', time: 'Hier', unread: 0, avatar: 'PS' },
    ];

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {/* Sidebar List */}
            <div className="w-full md:w-80 border-r border-gray-100 flex flex-col">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-mdla-yellow/50"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(conv => (
                        <div key={conv.id} className={`p-4 hover:bg-gray-50 cursor-pointer flex gap-3 border-b border-gray-50 ${conv.unread > 0 ? 'bg-blue-50/30' : ''}`}>
                            <div className="w-10 h-10 bg-mdla-yellow rounded-full flex items-center justify-center font-bold text-mdla-black text-sm">
                                {conv.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`font-bold text-sm truncate ${conv.unread > 0 ? 'text-gray-900' : 'text-gray-700'}`}>{conv.name}</h4>
                                    <span className="text-xs text-gray-400 whitespace-nowrap">{conv.time}</span>
                                </div>
                                <p className={`text-sm truncate ${conv.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{conv.lastMessage}</p>
                            </div>
                            {conv.unread > 0 && (
                                <div className="w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                                    {conv.unread}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-50/50">
                {/* Header */}
                <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-mdla-yellow rounded-full flex items-center justify-center font-bold text-mdla-black text-sm">
                            SC
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Service Client</h3>
                            <div className="flex items-center gap-1 text-xs text-green-600">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                En ligne
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="flex justify-center">
                        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Aujourd'hui</span>
                    </div>

                    <div className="flex gap-4 max-w-[80%]">
                        <div className="w-8 h-8 rounded-full bg-mdla-yellow flex items-center justify-center text-xs font-bold shrink-0">SC</div>
                        <div>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm text-gray-700 text-sm">
                                Bonjour, comment puis-je vous aider aujourd'hui ?
                            </div>
                            <span className="text-xs text-gray-400 mt-1 block">10:00</span>
                        </div>
                    </div>

                    <div className="flex gap-4 max-w-[80%] ml-auto flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0">MOI</div>
                        <div>
                            <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm shadow-sm text-sm">
                                Bonjour, je voudrais savoir où en est ma commande #ORD-2023-001.
                            </div>
                            <span className="text-xs text-gray-400 mt-1 block text-right">10:05</span>
                        </div>
                    </div>

                    <div className="flex gap-4 max-w-[80%]">
                        <div className="w-8 h-8 rounded-full bg-mdla-yellow flex items-center justify-center text-xs font-bold shrink-0">SC</div>
                        <div>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm text-gray-700 text-sm">
                                Votre dossier a été validé. Le navire devrait arriver le 15 Novembre.
                            </div>
                            <span className="text-xs text-gray-400 mt-1 block">10:30</span>
                        </div>
                    </div>
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                            <File className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            placeholder="Écrivez votre message..."
                            className="flex-1 bg-gray-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-mdla-yellow/50"
                        />
                        <button className="p-3 bg-mdla-black text-white rounded-xl hover:bg-gray-800 transition-colors">
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserMessages;
