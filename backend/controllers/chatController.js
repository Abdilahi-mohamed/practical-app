const axios = require('axios');
const User = require('../models/User');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const personalities = require('../config/personalities');

// Get chat history for a personality
exports.getHistory = async (req, res) => {
    try {
        const { personalityId } = req.params;

        // Find or create chat
        let chat = await Chat.findOne({
            userId: req.userId,
            personalityId
        });

        if (!chat) {
            return res.json({ messages: [] });
        }

        // Get messages
        const messages = await Message.find({ chatId: chat._id })
            .sort({ createdAt: 1 })
            .select('role content createdAt');

        res.json({ messages });
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Send message and get AI response
exports.sendMessage = async (req, res) => {
    try {
        const { personalityId, message } = req.body;

        if (!message || !personalityId) {
            return res.status(400).json({ error: 'Message and personalityId are required' });
        }

        // Find personality
        const personality = personalities.find(p => p.id === personalityId);
        if (!personality) {
            return res.status(404).json({ error: 'Personality not found' });
        }

        // Check if user exists
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find or create chat
        let chat = await Chat.findOne({
            userId: req.userId,
            personalityId
        });

        if (!chat) {
            chat = new Chat({
                userId: req.userId,
                personalityId,
                personalityName: personality.name
            });
            await chat.save();
        }

        // Save user message
        const userMessage = new Message({
            chatId: chat._id,
            role: 'user',
            content: message
        });
        await userMessage.save();

        // Get recent conversation history (last 10 messages for context)
        const recentMessages = await Message.find({ chatId: chat._id })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('role content');

        // Reverse to get chronological order
        const conversationHistory = recentMessages.reverse().map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        // Call OpenRouter API
        try {
            const apiKey = process.env.OPENROUTER_API_KEY;
            if (!apiKey) {
                console.error('❌ OPENROUTER_API_KEY is missing in environment variables');
                throw new Error('OpenRouter API key is missing');
            }
            console.log('🔑 Using OpenRouter API Key:', apiKey.substring(0, 10) + '...');

            const response = await axios.post(
                'https://openrouter.ai/api/v1/chat/completions',
                {
                    model: process.env.AI_MODEL || 'google/gemma-2-9b-it:free',
                    messages: [
                        { role: 'system', content: personality.systemPrompt },
                        ...conversationHistory
                    ]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'http://localhost:5000',
                        'X-Title': 'MultiMind AI'
                    }
                }
            );

            const aiResponse = response.data.choices[0].message.content;

            // Save AI response
            const assistantMessage = new Message({
                chatId: chat._id,
                role: 'assistant',
                content: aiResponse
            });
            await assistantMessage.save();

            res.json({
                message: aiResponse,
                messageId: assistantMessage._id
            });
        } catch (aiError) {
            console.error('❌ OpenRouter API Error Details:');
            if (aiError.response) {
                console.error('Status:', aiError.response.status);
                console.error('Data:', JSON.stringify(aiError.response.data, null, 2));
            } else {
                console.error('Message:', aiError.message);
            }

            res.status(500).json({
                error: 'Failed to get AI response',
                details: aiError.response?.data?.error?.message || aiError.message || 'AI service unavailable'
            });
        }
    } catch (error) {
        console.error('Error in chat:', error);
        res.status(500).json({
            error: 'Server error',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
