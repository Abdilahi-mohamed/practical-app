const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Index for efficient message retrieval
messageSchema.index({ chatId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
