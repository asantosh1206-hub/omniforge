const fs = require('fs');
let code = fs.readFileSync('src/services/llmService.js', 'utf8');

const replacement = `  const makeGroqRequest = async (fallbackModelId) => {
    const apiKey = grokApiKey;
    if (!apiKey || apiKey.includes('????')) throw new Error('Invalid Groq API key');

    const payload = {
      model: 'llama-3.1-8b-instant',`;

const searchPattern = /const makeGroqRequest = async \(fallbackModelId\) => \{[\s\S]*?const payload = \{\s+model: targetModel,/m;

code = code.replace(searchPattern, replacement);
fs.writeFileSync('src/services/llmService.js', code);
console.log('Fixed to llama-3.1-8b-instant');
