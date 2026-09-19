const extractContent = (choice) => choice?.message?.content || '';

// Helper to wait
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Robust fetch with exponential backoff for rate limits
const fetchWithRetry = async (url, options, retries = 5, backoff = 5000) => {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options);
    if (response.status === 429) {
      console.warn(`Rate limited (429). Retrying in ${backoff}ms... (${i + 1}/${retries})`);
      await delay(backoff);
      backoff *= 1.5; // Exponential backoff
      continue;
    }
    return response;
  }
  return fetch(url, options); // Final attempt
};

export const generateIntelligence = async (rawText, outputType, apiConfig, language = 'en') => {
  const { grokApiKey, nvidiaApiKey } = apiConfig;
  const primaryProvider = apiConfig.primaryProvider || 'grok';

  const safeText = rawText ? rawText.slice(0, 16000) : '';
  const langInstruction = language !== 'en' ? ` Respond entirely in the language with ISO code: '${language}'.` : '';

  const systemPrompt = "You are OmniForge, a defense-grade threat intelligence AI. Generate structured Markdown output. Do NOT wrap your response in <think> tags or any reasoning blocks. Output ONLY the requested content directly." + langInstruction;

  let userPrompt = `Generate a ${outputType} from this intelligence data. Use Markdown, professional tone, no meta-commentary.\n\nDATA:\n${safeText || "No data provided."}`;

  if (outputType === 'exec-summary') {
    userPrompt = `Generate a concise Executive Summary. Include: Situation Overview, Key Findings, Indicators table, Recommendations.\n\nDATA:\n${safeText}`;
  } else if (outputType === 'threat-advisory') {
    userPrompt = `Generate a Threat Advisory. Include IOC table and mitigation steps.\n\nDATA:\n${safeText}`;
  } else if (outputType === 'linkedin-post') {
    userPrompt = `Generate a professional LinkedIn post about this threat for cybersecurity community.\n\nDATA:\n${safeText}`;
  } else if (outputType === 'twitter-thread') {
    userPrompt = `Generate a concise Twitter/X thread (3-5 tweets) about this threat activity.\n\nDATA:\n${safeText}`;
  } else if (outputType === 'audio-briefing') {
    userPrompt = `Generate a spoken briefing script suitable for audio narration. Use clear, concise language.\n\nDATA:\n${safeText}`;
  } else if (outputType === 'pptx-deck') {
    userPrompt = `Generate a Presentation Deck. Format each slide clearly. Separate each slide with --- on its own line.\n\nDATA:\n${safeText}`;
  } else if (outputType === 'infographic') {
    userPrompt = 'Generate a highly visual Mermaid.js Mindmap summarizing the key messaging, statistics, and impact.\n\nRULES:\n- Start with \`\`\`mermaid\n- Use mindmap syntax\n- DO NOT use node IDs or flowchart shapes like A["Text"]\n- NEVER use double quotes\n- NEVER use parentheses () in the text\n- Use strict spacing indentation like this:\nmindmap\n  root((Topic))\n    Branch\n      Leaf Node\n- End with \`\`\`\n\nDATA:\n' + safeText;
  } else if (outputType === 'arch-diagram') {
    userPrompt = 'Generate a comprehensive Mermaid.js Network Architecture diagram.\n\nRULES:\n- Start with \`\`\`mermaid\n- Use flowchart LR\n- Group components using subgraphs like "External", "DMZ", "Internal"\n- Apply classDef tags: :::external, :::secure, :::internal\n- End with \`\`\`\n\nDATA:\n' + safeText;
  } else if (outputType === 'flowchart') {
    userPrompt = `Generate a rich, diverse, and colorful Mermaid.js flowchart showing a cyber kill chain attack flow based on this data.

RULES:
- Output ONLY a mermaid code block, nothing else
- Start with \`\`\`mermaid on the first line
- Use flowchart TD syntax
- Use DIVERSE SHAPES to make it visually interesting
- Apply classes to nodes using ::: (e.g. A["Recon"]:::malicious)
- End with \`\`\` on the last line

DATA:
${safeText}`;
  }

  const makeGroqRequest = async (modelId) => {
    const apiKey = grokApiKey;
    if (!apiKey) throw new Error('Invalid Groq API key');

    const payload = {
      model: modelId,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: 6000
    };

    const response = await fetchWithRetry('/api/groq/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq API Error (${modelId}): ${response.status} - ${err}`);
    }

    const data = await response.json();
    const content = extractContent(data.choices[0]);
    if (!content || content.trim().length < 5) throw new Error(`Groq model ${modelId} returned empty content`);
    return content + `\n\n*(Generated via ${primaryProvider})*`;
  };

  try {
    return await makeGroqRequest('openai/gpt-oss-20b');
  } catch (error) {
    console.error("LLM Generation Error:", error);
    throw error;
  }
};

export const generateIntelligenceBatch = async () => { throw new Error('Not used'); };
