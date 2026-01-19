const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register new users
router.post('/register', authController.register);

// Login users
router.post('/login', authController.login);

module.exports = router;
