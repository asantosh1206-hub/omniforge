const fs = require('fs');
let code = fs.readFileSync('src/services/llmService.js', 'utf8');
code = code.replace(/retries = 2/g, 'retries = 5');

const addPrompts = `  } else if (outputType === 'infographic') {
    userPrompt = 'Generate a highly visual Mermaid.js Mindmap summarizing the key messaging, statistics, and impact.\\n\\nRULES:\\n- Start with \\\`\\\`\\\`mermaid\\n- Use mindmap syntax\\n- DO NOT use node IDs or flowchart shapes like A["Text"]\\n- NEVER use double quotes\\n- NEVER use parentheses () in the text\\n- Use strict spacing indentation like this:\\nmindmap\\n  root((Topic))\\n    Branch\\n      Leaf Node\\n- End with \\\`\\\`\\\`\\n\\nDATA:\\n' + safeText;
  } else if (outputType === 'arch-diagram') {
    userPrompt = 'Generate a comprehensive Mermaid.js Network Architecture diagram.\\n\\nRULES:\\n- Start with \\\`\\\`\\\`mermaid\\n- Use flowchart LR\\n- Group components using subgraphs like "External", "DMZ", "Internal"\\n- Apply classDef tags: :::external, :::secure, :::internal\\n- End with \\\`\\\`\\\`\\n\\nDATA:\\n' + safeText;
  } else if (outputType === 'flowchart') {`;

code = code.replace(/\} else if \(outputType === 'flowchart'\) \{/, addPrompts);
fs.writeFileSync('src/services/llmService.js', code);
console.log('Done!');
