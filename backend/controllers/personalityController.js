const User = require('../models/User');
const personalities = require('../config/personalities');

// Get all personalities with user's unlock status
exports.getAllPersonalities = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        const personalitiesWithStatus = personalities.map(p => ({
            ...p,
            isUnlocked: !p.isPremium || user.unlockedPersonalities.includes(p.id)
        }));

        res.json({ personalities: personalitiesWithStatus });
    } catch (error) {
        console.error('Error fetching personalities:', error);
        res.status(500).json({
            error: 'Server error',
            details: error.message
        });
    }
};

// Unlock premium personality (simulated payment)
exports.unlockPersonality = async (req, res) => {
    try {
        const { personalityId } = req.params;

        // Find personality
        const personality = personalities.find(p => p.id === personalityId);
        if (!personality) {
            return res.status(404).json({ error: 'Personality not found' });
        }

        // Get user
        const user = await User.findById(req.userId);

        // Check if it's premium
        if (!personality.isPremium) {
            return res.json({
                message: 'Personality is free and unlocked',
                unlockedPersonalities: user.unlockedPersonalities
            });
        }

        // Check if already unlocked
        if (user.unlockedPersonalities.includes(personalityId)) {
            return res.status(400).json({ error: 'Personality already unlocked' });
        }

        // Unlock personality (simulated payment - in real app, integrate payment gateway)
        user.unlockedPersonalities.push(personalityId);
        await user.save();

        res.json({
            message: 'Personality unlocked successfully',
            unlockedPersonalities: user.unlockedPersonalities
        });
    } catch (error) {
        console.error('Error unlocking personality:', error);
        res.status(500).json({
            error: 'Server error',
            details: error.message
        });
    }
};
