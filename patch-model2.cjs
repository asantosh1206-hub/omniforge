const fs = require('fs');
let code = fs.readFileSync('src/services/llmService.js', 'utf8');

code = code.replace(/model: 'llama-3\.3-70b-versatile',/g, "model: 'llama3-8b-8192',");
code = code.replace(/return await makeGroqRequest\('llama-3\.3-70b-versatile'\);/g, "return await makeGroqRequest('llama3-8b-8192');");

fs.writeFileSync('src/services/llmService.js', code);
console.log('Done!');
