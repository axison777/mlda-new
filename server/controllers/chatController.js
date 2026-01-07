const Message = require('../models/Message');
const User = require('../models/User');
const { Op } = require('sequelize');

// @desc    Get chat history between two users
// @route   GET /api/chat/messages/:userId
// @access  Private
const getMessages = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const otherUserId = req.params.userId;

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: currentUserId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: currentUserId }
                ]
            },
            order: [['createdAt', 'ASC']],
            include: [
                { model: User, as: 'sender', attributes: ['id', 'name', 'email'] },
                { model: User, as: 'receiver', attributes: ['id', 'name', 'email'] }
            ]
        });

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error fetching messages' });
    }
};

// @desc    Get messages by room ID (for group/context chats)
// @route   GET /api/chat/room/:roomId
// @access  Private
const getRoomMessages = async (req, res) => {
    try {
        const { roomId } = req.params;

        const messages = await Message.findAll({
            where: { roomId },
            order: [['createdAt', 'ASC']],
            include: [
                { model: User, as: 'sender', attributes: ['id', 'name', 'email'] }
            ]
        });

        res.json(messages);
    } catch (error) {
        console.error('Error fetching room messages:', error);
        res.status(500).json({ message: 'Server error fetching room messages' });
    }
};

// @desc    Get all conversations (last message for each contact)
// @route   GET /api/chat/conversations
// @access  Private
const getConversations = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        // This is complex in Sequelize/SQL without raw queries, leveraging a simplified approach:
        // Find all unique interaction partners
        const sentTo = await Message.findAll({
            where: { senderId: currentUserId },
            attributes: ['receiverId'],
            group: ['receiverId']
        });

        const receivedFrom = await Message.findAll({
            where: { receiverId: currentUserId },
            attributes: ['senderId'],
            group: ['senderId']
        });

        const contactIds = new Set([
            ...sentTo.map(m => m.receiverId).filter(id => id),
            ...receivedFrom.map(m => m.senderId).filter(id => id)
        ]);

        const conversations = [];

        for (const contactId of contactIds) {
            const user = await User.findByPk(contactId, {
                attributes: ['id', 'name', 'email', 'role']
            });

            if (user) {
                // Get last message
                const lastMessage = await Message.findOne({
                    where: {
                        [Op.or]: [
                            { senderId: currentUserId, receiverId: contactId },
                            { senderId: contactId, receiverId: currentUserId }
                        ]
                    },
                    order: [['createdAt', 'DESC']]
                });

                // Count unread
                const unreadCount = await Message.count({
                    where: {
                        senderId: contactId,
                        receiverId: currentUserId,
                        read: false
                    }
                });

                conversations.push({
                    contact: user,
                    lastMessage,
                    unreadCount
                });
            }
        }

        // Sort by last message date
        conversations.sort((a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt);

        res.json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'Server error fetching conversations' });
    }
};

module.exports = {
    getMessages,
    getRoomMessages,
    getConversations
};
