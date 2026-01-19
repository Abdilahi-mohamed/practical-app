const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const chatController = require('../controllers/chatController');

// Get chat history for a personality
router.get('/history/:personalityId', authMiddleware, chatController.getHistory);


// Send message and get AI response
router.post('/message', authMiddleware, chatController.sendMessage);

module.exports = router;
