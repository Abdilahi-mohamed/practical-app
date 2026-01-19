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
// ═══════════════════════════════════════════════════════
// TEST 1: User Registration
// ═══════════════════════════════════════════════════════
async function testRegistration() {
    console.log('\n📝 Test 1: User Registration');
    console.log('─────────────────────────────────────────────────────');

    try {
        const testUser = createTestUser('register');
        const response = await axios.post(`${API_URL}/auth/register`, testUser);

        if (response.data.token) {
            console.log('✅ Registration successful');
            console.log(`   Token: ${response.data.token.substring(0, 20)}...`);
            return { success: true, token: response.data.token };
        } else {
            console.log('❌ Registration failed: No token received');
            return { success: false };
        }
    } catch (error) {
        console.error('❌ Registration failed:', error.response?.data || error.message);
        return { success: false };
    }
}

// ═══════════════════════════════════════════════════════
// TEST 2: Personality Unlock
// ═══════════════════════════════════════════════════════
async function testUnlock(token) {
    console.log('\n🔓 Test 2: Personality Unlock');
    console.log('─────────────────────────────────────────────────────');

    try {
        const response = await axios.post(
            `${API_URL}/personalities/unlock/time-manager`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('✅ Unlock successful');
        console.log(`   ${JSON.stringify(response.data)}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Unlock failed:', error.response?.data || error.message);
        return { success: false };
    }
}

// ═══════════════════════════════════════════════════════
// TEST 3: Free Personality Auto-Unlock
// ═══════════════════════════════════════════════════════
async function testFreePersonalities(token) {
    console.log('\n🆓 Test 3: Free Personalities Auto-Unlock');
    console.log('─────────────────────────────────────────────────────');

    try {
        const response = await axios.get(`${API_URL}/personalities`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const personalities = response.data.personalities;
        const timeManager = personalities.find(p => p.id === 'time-manager');
        const nerdyTutor = personalities.find(p => p.id === 'nerdy-tutor');

        console.log(`   Time Manager unlocked: ${timeManager?.isUnlocked ? '✅' : '❌'}`);
        console.log(`   Nerdy Tutor unlocked: ${nerdyTutor?.isUnlocked ? '✅' : '❌'}`);

        if (timeManager?.isUnlocked && nerdyTutor?.isUnlocked) {
            console.log('✅ Free personalities are auto-unlocked correctly');
            return { success: true };
        } else {
            console.log('❌ Some free personalities are locked (should be unlocked)');
            return { success: false };
        }
    } catch (error) {
        console.error('❌ Free personality check failed:', error.response?.data || error.message);
        return { success: false };
    }
}

// ═══════════════════════════════════════════════════════
// TEST 4: Chat Functionality
// ═══════════════════════════════════════════════════════
async function testChat(token, debug = false) {
    console.log('\n💬 Test 4: Chat Functionality');
    console.log('─────────────────────────────────────────────────────');

    try {
        const response = await axios.post(
            `${API_URL}/chat/message`,
            {
                personalityId: 'nerdy-tutor',
                message: 'Hello, what is 2+2?'
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('✅ Chat successful');
        console.log(`   AI Response: ${response.data.message}`);

        if (debug) {
            console.log('\n   Debug Info:');
            console.log(`   - Status: ${response.status}`);
            console.log(`   - Response keys: ${Object.keys(response.data).join(', ')}`);
        }

        return { success: true };
    } catch (error) {
        console.error('❌ Chat failed:', error.response?.data || error.message);
        if (debug && error.code) {
            console.error(`   Error Code: ${error.code}`);
        }
        return { success: false };
    }
}

// ═══════════════════════════════════════════════════════
// TEST 5: Complete User Flow
// ═══════════════════════════════════════════════════════
async function testCompleteFlow() {
    console.log('\n🔄 Test 5: Complete User Flow');
    console.log('─────────────────────────────────────────────────────');

    try {
        // Register new user
        const testUser = createTestUser('flow');
        console.log('   Step 1: Registering...');
        const registerRes = await axios.post(`${API_URL}/auth/register`, testUser);
        const token = registerRes.data.token;
        console.log('   ✅ Registered');

        // Unlock personality
        console.log('   Step 2: Unlocking personality...');
        await axios.post(
            `${API_URL}/personalities/unlock/time-manager`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('   ✅ Unlocked');

        // Send chat message
        console.log('   Step 3: Sending chat message...');
        const chatRes = await axios.post(
            `${API_URL}/chat/message`,
            {
                personalityId: 'nerdy-tutor',
                message: 'Can you help me with math?'
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('   ✅ Chat successful');
        console.log(`   Response: ${chatRes.data.message.substring(0, 100)}...`);

        console.log('✅ Complete flow test passed');
        return { success: true };
    } catch (error) {
        console.error('❌ Flow test failed:', error.response?.data || error.message);
        return { success: false };
    }
}

// ═══════════════════════════════════════════════════════
// Main Test Runner
// ═══════════════════════════════════════════════════════
async function runAllTests() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🚀 MULTIMIND BACKEND - COMPLETE TEST SUITE');
    console.log('═══════════════════════════════════════════════════════');

    const results = {
        passed: 0,
        failed: 0,
        total: 5
    };

    // Test 1: Registration
    const regResult = await testRegistration();
    regResult.success ? results.passed++ : results.failed++;

    if (!regResult.success || !regResult.token) {
        console.log('\n⚠️  Cannot continue tests without valid token');
        printSummary(results);
        return;
    }

    const token = regResult.token;

    // Test 2: Unlock
    const unlockResult = await testUnlock(token);
    unlockResult.success ? results.passed++ : results.failed++;

    // Test 3: Free Personalities
    const freeResult = await testFreePersonalities(token);
    freeResult.success ? results.passed++ : results.failed++;

    // Test 4: Chat
    const chatResult = await testChat(token, true);
    chatResult.success ? results.passed++ : results.failed++;

    // Test 5: Complete Flow
    const flowResult = await testCompleteFlow();
    flowResult.success ? results.passed++ : results.failed++;

    // Print summary
    printSummary(results);
}

function printSummary(results) {
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📊 TEST SUMMARY');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`   Total Tests: ${results.total}`);
    console.log(`   ✅ Passed: ${results.passed}`);
    console.log(`   ❌ Failed: ${results.failed}`);
    console.log('═══════════════════════════════════════════════════════');

    if (results.failed === 0) {
        console.log('🎉 All tests passed!');
    } else {
        console.log('⚠️  Some tests failed. Please review the output above.');
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests().catch(error => {
        console.error('❌ Unexpected error:', error.message);
        process.exit(1);
    });
}

module.exports = {
    testRegistration,
    testUnlock,
    testFreePersonalities,
    testChat,
    testCompleteFlow,
    runAllTests
};
