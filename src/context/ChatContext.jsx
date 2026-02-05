import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import axios from '../utils/api'; // Use your configured axios instance

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [activeChat, setActiveChat] = useState(null); // Could be userID or roomID
    const [connected, setConnected] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Initialize Socket
    useEffect(() => {
        if (!user || !token) return;

        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:55761';
        const newSocket = io(socketUrl, {
            auth: { token },
            reconnection: true,
        });

        newSocket.on('connect', () => {
            console.log('Socket Connected');
            setConnected(true);
            // Join my own user room for private messages
            newSocket.emit('join_room', `user_${user.id}`);
        });

        newSocket.on('receive_message', (message) => {
            setMessages((prev) => [...prev, message]);
            // Increment unread count if message is for me and I'm not in that chat
            if (message.receiverId === user.id && message.senderId !== activeChat) {
                setUnreadCount(prev => prev + 1);
            }
        });

        newSocket.on('disconnect', () => {
            console.log('Socket Disconnected');
            setConnected(false);
        });

        setSocket(newSocket);

        return () => newSocket.close();
    }, [user, token]);

    // Fetch unread count on mount
    useEffect(() => {
        if (user && token) {
            fetchUnreadCount();
        }
    }, [user, token]);

    // Fetch conversation history
    const loadMessages = async (userIdOrRoomId, isRoom = false) => {
        try {
            let res;
            if (isRoom) {
                res = await axios.get(`/api/chat/room/${userIdOrRoomId}`);
            } else {
                res = await axios.get(`/api/chat/messages/${userIdOrRoomId}`);
            }
            // Ensure we don't have duplicates if socket pushed some
            // For simplicity, just set the history. 
            // In a real app, merge intelligently.
            setMessages(res.data);
            setActiveChat(userIdOrRoomId);

            // If connected, join specific room if applicable
            if (isRoom && socket) {
                socket.emit('join_room', userIdOrRoomId);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    // Fetch list of conversations
    const getConversations = async () => {
        try {
            const res = await axios.get('/api/chat/conversations');
            return res.data;
        } catch (error) {
            console.error('Error loading conversations:', error);
            return [];
        }
    };

    // Fetch unread count
    const fetchUnreadCount = async () => {
        try {
            const res = await axios.get('/api/chat/unread');
            setUnreadCount(res.data.total);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const sendMessage = (content, receiverId, roomId = null) => {
        if (!socket) return;

        const messageData = {
            content,
            receiverId,
            roomId,
            type: 'text'
        };

        socket.emit('send_message', messageData);
        // Note: We wait for 'receive_message' to add to state to ensure consistency
        // OR add optimistically here
    };

    // Get available users to chat with
    const getAvailableUsers = async () => {
        try {
            const res = await axios.get('/api/chat/users');
            return res.data;
        } catch (error) {
            console.error('Error loading available users:', error);
            return [];
        }
    };

    // Initiate a new conversation
    const initiateConversation = async (userId) => {
        try {
            const res = await axios.post('/api/chat/initiate', { userId });
            return res.data;
        } catch (error) {
            console.error('Error initiating conversation:', error);
            throw error;
        }
    };

    // Mark messages as read
    const markMessagesAsRead = async (userId) => {
        try {
            await axios.put(`/api/chat/read/${userId}`);
            await fetchUnreadCount();
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    };

    return (
        <ChatContext.Provider value={{
            socket,
            connected,
            messages,
            setMessages,
            loadMessages,
            sendMessage,
            activeChat,
            getConversations,
            unreadCount,
            fetchUnreadCount,
            getAvailableUsers,
            initiateConversation,
            markMessagesAsRead
        }}>
            {children}
        </ChatContext.Provider>
    );
};
