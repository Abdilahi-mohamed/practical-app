const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    personalityId: {
        type: String,
        required: true
    },
    personalityName: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Create compound index for efficient queries
chatSchema.index({ userId: 1, personalityId: 1 });

module.exports = mongoose.model('Chat', chatSchema);
