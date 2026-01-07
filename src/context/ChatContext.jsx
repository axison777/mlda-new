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

    // Initialize Socket
    useEffect(() => {
        if (!user || !token) return;

        const newSocket = io('http://localhost:5000', {
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
        });

        newSocket.on('disconnect', () => {
            console.log('Socket Disconnected');
            setConnected(false);
        });

        setSocket(newSocket);

        return () => newSocket.close();
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

    return (
        <ChatContext.Provider value={{
            socket,
            connected,
            messages,
            setMessages,
            loadMessages,
            sendMessage,
            activeChat,
            getConversations
        }}>
            {children}
        </ChatContext.Provider>
    );
};
