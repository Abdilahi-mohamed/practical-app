/**
 * API Configuration Tests
 * Consolidates: test_key.js + test_models.js
 * Tests OpenRouter API key and available AI models
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const axios = require('axios');

const MODELS_TO_TEST = [
    'meta-llama/llama-3.1-8b-instruct:free',
    'meta-llama/llama-3-8b-instruct:free',
    'microsoft/phi-3-mini-128k-instruct:free',
    'google/gemma-2-9b-it:free',
    'mistralai/mistral-7b-instruct:free',
    'huggingfaceh4/zephyr-7b-beta:free'
];

async function testAPIKey() {
    console.log('\n🔍 Testing OpenRouter API Key...');

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        console.error('❌ ERROR: OPENROUTER_API_KEY is missing in .env file');
        return false;
    }

    console.log(`🔑 Key found: ${apiKey.substring(0, 10)}...`);

    try {
        console.log('📡 Sending test request...');
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'meta-llama/llama-3.1-8b-instruct:free',
                messages: [
                    { role: 'user', content: 'Hello, are you working?' }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:5000',
                    'X-Title': 'MultiMind AI Test'
                }
            }
        );

        console.log('✅ API Key is valid! Response:');
        console.log(response.data.choices[0].message.content);
        return true;
    } catch (error) {
        console.error('❌ API Key validation failed');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
        return false;
    }
}

async function testModel(model) {
    console.log(`\n  Testing model: ${model}...`);
    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: model,
                messages: [{ role: 'user', content: 'Hello, are you working?' }]
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:5000',
                    'X-Title': 'MultiMind AI Test'
                },
                timeout: 10000 // 10 second timeout
            }
        );
        const responseText = response.data.choices[0].message.content.substring(0, 50);
        console.log(`  ✅ SUCCESS! Response: ${responseText}...`);
        return true;
    } catch (error) {
        if (error.response) {
            console.log(`  ❌ FAILED. Status: ${error.response.status}`);
        } else {
            console.log(`  ❌ FAILED. Error: ${error.message}`);
        }
        return false;
    }
}

async function testModels() {
    console.log('\n🚀 Testing Available AI Models...');

    for (const model of MODELS_TO_TEST) {
        const success = await testModel(model);
        if (success) {
            console.log(`\n🎉 Found working model: ${model}`);
            console.log('You can update your .env file with this model if needed.');
            break;
        }
    }
}

async function runAPITests() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🧪 API CONFIGURATION TESTS');
    console.log('═══════════════════════════════════════════════════════');

    // Test 1: API Key
    const keyValid = await testAPIKey();
    if (!keyValid) {
        console.log('\n❌ API Key test failed. Cannot proceed with model tests.');
        return;
    }

    // Test 2: Models
    await testModels();

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ API Configuration Tests Complete');
    console.log('═══════════════════════════════════════════════════════');
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAPITests();
}

module.exports = { testAPIKey, testModels, runAPITests };
