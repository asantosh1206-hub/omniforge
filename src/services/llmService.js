const extractContent = (choice) => choice?.message?.content || '';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url, options, retries = 3, backoff = 3000) => {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options);
    if (response.status === 429 || response.status === 503) {
      console.warn(`Retryable error (${response.status}). Retrying in ${backoff}ms... (${i + 1}/${retries})`);
      await delay(backoff);
      backoff *= 1.5;
      continue;
    }
    return response;
  }
  return fetch(url, options);
};

export const generateIntelligence = async (rawText, outputType, apiConfig, language = 'en') => {
  const { grokApiKey, nvidiaApiKey } = apiConfig || {};
  const activeNvidiaKey = nvidiaApiKey || import.meta.env.VITE_NVIDIA_API_KEY;
  const activeGrokKey = grokApiKey || import.meta.env.VITE_GROK_API_KEY;

  if (!activeNvidiaKey && !activeGrokKey) {
    throw new Error('No API key configured. Please set VITE_NVIDIA_API_KEY or VITE_GROK_API_KEY in environment variables.');
  }

  const safeText = rawText ? rawText.slice(0, 16000) : '';
  const langInstruction = language !== 'en' ? ` Respond entirely in the language with ISO code: '${language}'.` : '';

  // ── MODEL ROUTING ────────────────────────────────────────────────
  const diagramTypes = ['infographic', 'arch-diagram', 'flowchart'];
  const isDiagram = diagramTypes.includes(outputType);

  // ── SYSTEM PROMPTS ───────────────────────────────────────────────
  const systemPrompt = isDiagram
    ? "You are OmniForge. Output ONLY the requested Mermaid code block. No reasoning, no explanation, no commentary." + langInstruction
    : "You are OmniForge, a defense-grade threat intelligence AI. Generate structured Markdown output. Do NOT wrap your response in <think> tags or any reasoning blocks. Output ONLY the requested content directly." + langInstruction;

  // ── USER PROMPTS ─────────────────────────────────────────────────
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
  } else if (outputType === 'video-script') {
    userPrompt = `Generate a Video Script. Include visual cues and voiceover.\n\nDATA:\n${safeText}`;
  } else if (outputType === 'pptx-deck') {
    userPrompt = `Generate a Presentation Deck. Format each slide clearly. Separate each slide with --- on its own line.\n\nDATA:\n${safeText}`;
  } else if (outputType === 'infographic') {
    userPrompt = `Generate a Mermaid mindmap. Output ONLY \`\`\`mermaid code block.\n\nRULES:\nmindmap\n  root((Topic))\n    Branch\n      Leaf\n\nDATA:\n${safeText}`;
  } else if (outputType === 'arch-diagram') {
    userPrompt = `Generate a Mermaid flowchart LR network architecture diagram. Output ONLY \`\`\`mermaid code block. Use subgraphs.\n\nDATA:\n${safeText}`;
  } else if (outputType === 'flowchart') {
    userPrompt = `Generate a Mermaid flowchart TD showing cyber kill chain. Output ONLY \`\`\`mermaid code block. No text.\n\nDATA:\n${safeText}`;
  }

  // ── PROVIDER DISPATCH ────────────────────────────────────────────
  if (activeNvidiaKey) {
    const modelId = isDiagram
      ? 'nvidia/nemotron-3-super-120b-a12b'
      : 'meta/llama-3.2-11b-vision-instruct';

    const maxTokens = isDiagram ? 4096 : 1024;
    const payload = {
      model: modelId,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: maxTokens
    };

    const response = await fetchWithRetry('/api/nvidia/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeNvidiaKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`NVIDIA API Error (${modelId}): ${response.status} - ${err}`);
    }

    const data = await response.json();
    const content = extractContent(data.choices[0]);
    if (!content || content.trim().length < 5) {
      throw new Error(`Model ${modelId} returned empty content`);
    }

    return content + `\n\n*(Generated via NVIDIA ${modelId.split('/')[1]})*`;
  }

  // Groq fallback if only Groq key is configured
  const groqModel = isDiagram ? 'llama-3.3-70b-versatile' : 'llama-3.1-8b-instant';
  const payload = {
    model: groqModel,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.2,
    max_tokens: 3000
  };

  const response = await fetchWithRetry('/api/groq/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${activeGrokKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API Error (${groqModel}): ${response.status} - ${err}`);
  }

  const data = await response.json();
  const content = extractContent(data.choices[0]);
  if (!content || content.trim().length < 5) {
    throw new Error(`Groq model ${groqModel} returned empty content`);
  }

  return content + `\n\n*(Generated via Groq ${groqModel})*`;
};

export const generateIntelligenceBatch = async () => { throw new Error('Not used'); };
