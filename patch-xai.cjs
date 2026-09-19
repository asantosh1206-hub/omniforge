const fs = require('fs');
let code = fs.readFileSync('src/services/llmService.js', 'utf8');

const xaiFunction = `  const makeXAIRequest = async () => {
    const apiKey = grokApiKey;
    if (!apiKey) throw new Error('Missing xAI API key');

    const payload = {
      model: 'grok-beta',
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.2
    };

    const response = await fetchWithRetry('/api/xai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${apiKey}\` },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(\`xAI API Error: \${response.status} - \${err}\`);
    }

    const data = await response.json();
    const content = extractContent(data.choices[0]);
    if (!content || content.trim().length < 5) throw new Error(\`xAI model returned empty content\`);
    
    return content + '\\n\\n*(Generated via Grok)*';
  };

  const makeGroqRequest = async (modelId) => {`;

code = code.replace(/const makeGroqRequest = async \(modelId\) => \{/, xaiFunction);
code = code.replace(/return await makeGroqRequest\('llama-3\.1-8b-instant'\);/, 'return await makeXAIRequest();');

fs.writeFileSync('src/services/llmService.js', code);
console.log('Patched to use real xAI Grok API!');
