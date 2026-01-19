const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const personalityController = require('../controllers/personalityController');

// Get all personalities with user's unlock status
router.get('/', authMiddleware, personalityController.getAllPersonalities);


// Unlock premium personality (simulated payment)
router.post('/unlock/:personalityId', authMiddleware, personalityController.unlockPersonality);

module.exports = router;
