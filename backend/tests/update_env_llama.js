const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
let envContent = fs.readFileSync(envPath, 'utf8');

// Replace AI_MODEL
if (envContent.includes('AI_MODEL=')) {
    envContent = envContent.replace(/AI_MODEL=.*/, 'AI_MODEL=meta-llama/llama-3-8b-instruct:free');
} else {
    envContent += '\nAI_MODEL=meta-llama/llama-3-8b-instruct:free';
}

fs.writeFileSync(envPath, envContent);
console.log('✅ Updated AI_MODEL to Llama 3');
