const express = require('express');
const router = express.Router();
const { getMessages, getRoomMessages, getConversations } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/conversations', protect, getConversations);
router.get('/messages/:userId', protect, getMessages);
router.get('/room/:roomId', protect, getRoomMessages);

module.exports = router;
