const fs = require('fs');
let code = fs.readFileSync('src/services/llmService.js', 'utf8');

const dynamicModelSelector = `  const makeGroqRequest = async (fallbackModelId) => {
    const apiKey = grokApiKey;
    if (!apiKey || apiKey.includes('????')) throw new Error('Invalid Groq API key');

    let targetModel = fallbackModelId;
    
    // Dynamically fetch available models to find the best one the user has access to
    try {
      const modelRes = await fetchWithRetry('/api/groq/openai/v1/models', {
        method: 'GET',
        headers: { 'Authorization': \`Bearer \${apiKey}\` }
      });
      if (modelRes.ok) {
        const modelData = await modelRes.json();
        const availableModels = modelData.data.map(m => m.id);
        
        // Prioritize large, fast models. Fallback to whatever is available.
        if (availableModels.includes('llama-3.3-70b-versatile')) targetModel = 'llama-3.3-70b-versatile';
        else if (availableModels.includes('llama3-70b-8192')) targetModel = 'llama3-70b-8192';
        else if (availableModels.includes('llama-3.1-8b-instant')) targetModel = 'llama-3.1-8b-instant';
        else if (availableModels.includes('llama3-8b-8192')) targetModel = 'llama3-8b-8192';
        else if (availableModels.includes('mixtral-8x7b-32768')) targetModel = 'mixtral-8x7b-32768';
        else if (availableModels.includes('gemma2-9b-it')) targetModel = 'gemma2-9b-it';
        else if (availableModels.length > 0) targetModel = availableModels[0]; // Desperate fallback
      }
    } catch (e) {
      console.warn("Could not fetch model list, using fallback:", e);
    }

    const payload = {
      model: targetModel,`;

code = code.replace(/const makeGroqRequest = async \(modelId\) => \{\s+const apiKey = grokApiKey;\s+if \(!apiKey \|\| apiKey\.includes\('.+?'\)\) throw new Error\('Invalid Groq API key'\);\s+const payload = \{\s+model: 'llama3-8b-8192',/, dynamicModelSelector);

// Also increase chunk delay to 4000ms just to be absolutely safe with rate limits
let transformCode = fs.readFileSync('src/components/transform/TransformPage.jsx', 'utf8');
transformCode = transformCode.replace(/await new Promise\(r => setTimeout\(r, 2500\)\);/, 'await new Promise(r => setTimeout(r, 4500));');
fs.writeFileSync('src/components/transform/TransformPage.jsx', transformCode);

fs.writeFileSync('src/services/llmService.js', code);
console.log('Done!');
