const fs = require('fs');
let code = fs.readFileSync('src/services/llmService.js', 'utf8');

code = code.replace(/model: 'groq\/compound-mini',/g, "model: 'llama-3.3-70b-versatile',");
code = code.replace(/return await makeGroqRequest\('openai\/gpt-oss-20b'\);/g, "return await makeGroqRequest('llama-3.3-70b-versatile');");

fs.writeFileSync('src/services/llmService.js', code);
console.log('Done!');
