/**
 * Complete Backend Test Suite
 * Consolidates: test_endpoints.js + verify_chat.js + verify_chat_debug.js + verify_free_unlock.js + verify_unlock_ok.js
 * Comprehensive testing of all backend endpoints and functionality
 */

const axios = require('axios');

const API_URL = 'http://127.0.0.1:5000/api';

// Test user generator
function createTestUser(prefix = 'test') {
    return {
        username: `${prefix}_${Date.now()}`,
        email: `${prefix}_${Date.now()}@example.com`,
        password: 'password123'
    };
}