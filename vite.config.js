import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as googleTTS from 'google-tts-api';

const ttsPlugin = () => ({
  name: 'tts-plugin',
  configureServer(server) {
    server.middlewares.use('/api/tts', async (req, res) => {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const text = url.searchParams.get('text');
      const lang = url.searchParams.get('lang') || 'en';
      
      if (!text) {
        res.statusCode = 400;
        res.end('Missing text');
        return;
      }
      
      try {
        const results = await googleTTS.getAllAudioBase64(text, {
          lang: lang,
          slow: false,
          host: 'https://translate.google.com',
          splitPunct: ',.?',
        });
        
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(results));
      } catch (e) {
        res.statusCode = 500;
        res.end(e.toString());
      }
    });
  }
});

export default defineConfig({
  plugins: [react(), ttsPlugin()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api/groq': {
        target: 'https://api.groq.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/groq/, ''),
        secure: true
      },
      '/api/nvidia': {
        target: 'https://integrate.api.nvidia.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/nvidia/, ''),
        secure: true
      },
      '/api/xai': {
        target: 'https://api.x.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/xai/, ''),
        secure: true
      },
      '/api/pollinations': {
        target: 'https://text.pollinations.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/pollinations/, ''),
        secure: true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*'
        }
      }
    }
  }
});
