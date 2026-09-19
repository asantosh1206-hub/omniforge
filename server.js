import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import * as googleTTS from 'google-tts-api';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// TTS Endpoint
app.get('/api/tts', async (req, res) => {
  const text = req.query.text;
  const lang = req.query.lang || 'en';
  
  if (!text) {
    return res.status(400).send('Missing text');
  }
  
  try {
    const results = await googleTTS.getAllAudioBase64(text, {
      lang: lang,
      slow: false,
      host: 'https://translate.google.com',
      splitPunct: ',.?',
    });
    res.json(results);
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

// Groq Proxy
app.use('/api/groq', createProxyMiddleware({
  target: 'https://api.groq.com',
  changeOrigin: true,
  pathRewrite: { '^/api/groq': '' },
}));

// NVIDIA Proxy
app.use('/api/nvidia', createProxyMiddleware({
  target: 'https://integrate.api.nvidia.com',
  changeOrigin: true,
  pathRewrite: { '^/api/nvidia': '' },
}));

// xAI Proxy
app.use('/api/xai', createProxyMiddleware({
  target: 'https://api.x.ai',
  changeOrigin: true,
  pathRewrite: { '^/api/xai': '' },
}));

// Pollinations Proxy
app.use('/api/pollinations', createProxyMiddleware({
  target: 'https://text.pollinations.ai',
  changeOrigin: true,
  pathRewrite: { '^/api/pollinations': '' },
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*'
  }
}));

// Serve React Static Files
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback for React Router SPA (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
