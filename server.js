const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const OpenAI = require('openai');
const cors = require('cors');

// Load environment variables with explicit path (and manual fallback parser)
const envPath = path.resolve(__dirname, '.env');
console.log('Loading .env from:', envPath);

let loadedWithDotenv = false;
if (fs.existsSync(envPath)) {
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.error('dotenv failed to load .env:', result.error);
  } else {
    loadedWithDotenv = true;
    console.log('dotenv loaded .env');
  }

  // If OPENAI_API_KEY is still not visible, manually parse to handle hidden chars/BOM/CRLF issues
  const needsManualParse = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === '';
  if (needsManualParse) {
    try {
      // Read raw bytes and detect BOM/encoding
      const buf = fs.readFileSync(envPath);
      let raw = '';
      let detected = 'utf8';
      if (buf.length >= 2 && buf[0] === 0xFF && buf[1] === 0xFE) {
        detected = 'utf16le';
        raw = buf.toString('utf16le');
      } else if (buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
        detected = 'utf8-bom';
        raw = buf.slice(3).toString('utf8');
      } else {
        raw = buf.toString('utf8');
      }
      console.log('Detected .env encoding:', detected);

      const lines = raw.split(/\r\n|\n|\r/);
      const parsed = {};
      for (const line of lines) {
        const clean = line.replace(/\r/g, '').replace(/^\uFEFF/, '').trim();
        if (!clean || clean.startsWith('#')) continue;
        const normalized = clean.normalize('NFKC');
        const match = normalized.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
        if (!match) continue;
        const key = match[1].trim();
        let value = match[2].trim();
        // Remove surrounding quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        // Final cleanup
        value = value.replace(/\u0000/g, '').trim();
        if (key) {
          parsed[key] = value;
          if (!process.env[key]) process.env[key] = value;
        }
      }
      const keys = Object.keys(parsed);
      console.log('Manually parsed .env keys:', keys.length ? keys.join(', ') : '(none)');
    } catch (e) {
      console.error('Manual parse of .env failed:', e.message);
    }
  }
} else {
  console.error('.env file not found at:', envPath);
}

console.log('Environment variables (post-load):', {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '***' : 'Not set',
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY ? '***' : 'Not set',
  PORT: process.env.PORT || '(unset)',
  NODE_ENV: process.env.NODE_ENV || '(unset)'
});

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Initialize OpenAI / OpenRouter
const API_KEY = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
console.log('Initializing OpenAI with API key:', API_KEY ? '***' : 'Not set');

if (!API_KEY) {
  console.error('ERROR: OPENAI_API_KEY or OPENROUTER_API_KEY is not set in environment variables');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: API_KEY,
  baseURL: process.env.OPENROUTER_API_KEY ? 'https://openrouter.ai/api/v1' : (process.env.OPENAI_BASE_URL || undefined),
});

// Default model (can be overridden via env)
const MODEL_NAME = process.env.MODEL_NAME || (process.env.OPENROUTER_API_KEY ? 'openai/gpt-3.5-turbo' : 'gpt-3.5-turbo-1106');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(limiter);

// Serve static files from the frontend directory
app.use('/js', express.static(path.join(__dirname, 'frontend', 'js'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Also fix SVG, ICO, etc. (bonus)
app.use(express.static(path.join(__dirname, 'frontend'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.svg')) res.setHeader('Content-Type', 'image/svg+xml');
    if (path.endsWith('.ico')) res.setHeader('Content-Type', 'image/x-icon');
    if (path.endsWith('.xml')) res.setHeader('Content-Type', 'application/xml');
  }
}));

// API Routes
app.post('/api/enhance-prompt', async (req, res) => {
  try {
    const { prompt, tone = 'professional', length = 'medium' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ 
        success: false, 
        error: 'Prompt is required' 
      });
    }

    const completion = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "system",
          content: `You are a prompt enhancement AI. Enhance the following prompt to be more ${tone} and ${length} in length.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    res.json({
      success: true,
      enhancedPrompt: completion.choices[0].message.content,
      tokensUsed: completion.usage ? completion.usage.total_tokens : undefined
    });
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to enhance prompt',
      details: error.message 
    });
  }
});

app.post('/api/generate-social-post', async (req, res) => {
  try {
    const { platform, topic, style = 'informative', tone = 'friendly' } = req.body;
    
    if (!platform || !topic) {
      return res.status(400).json({ 
        success: false, 
        error: 'Platform and topic are required' 
      });
    }

    const completion = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "system",
          content: `You are a social media content creator. Generate a ${style} ${tone} post for ${platform} about: ${topic}.`
        }
      ],
      temperature: 0.7,
    });

    res.json({
      success: true,
      post: completion.choices[0].message.content,
      tokensUsed: completion.usage ? completion.usage.total_tokens : undefined
    });
  } catch (error) {
    console.error('Error generating social post:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate social post',
      details: error.message 
    });
  }
});

// SPA fallback route - serve index.html for any other GET requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Something went wrong!',
    details: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start the server locally; Vercel serverless will handle the listener
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app; // For testing
