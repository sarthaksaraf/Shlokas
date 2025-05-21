require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = process.env.DATA_DIR || __dirname;
const EMOTIONS_FILE = path.join(DATA_DIR, 'Emotions.json');
const BASE_URL = process.env.API_BASE_URL || `http://localhost:${PORT}`;

// CORS setup for React/Vite and Flutter
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:8080').split(',');
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS not allowed'), false);
    }
    return callback(null, true);
  },  credentials: true
}));

app.use(express.json({ limit: '2mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs
  message: 'Too many requests, please try again later.'
});
app.use('/api/emotions/update', limiter);

// Basic Auth Middleware
const basicAuth = (req, res, next) => {
  const auth = req.headers['authorization'];
  const expected = 'Basic ' + Buffer.from(process.env.API_USER + ':' + process.env.API_PASS).toString('base64');
  if (!auth || auth !== expected) {
    res.set('WWW-Authenticate', 'Basic realm="Emotions API"');
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Helper: Validate emotion schema
function isValidEmotion(obj) {
  return obj && typeof obj.emotion === 'string' && typeof obj.quote === 'string' &&
    typeof obj.output === 'string' && typeof obj.realization_prompt === 'string' &&
    typeof obj.playful_task === 'string';
}

// GET all emotions (grouped by emotion type)
app.get('/api/emotions', (req, res) => {
  fs.readFile(EMOTIONS_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read emotions file' });
    }
    try {
      const emotions = JSON.parse(data);
      // Group by emotion type
      const grouped = {};
      for (const e of emotions) {
        if (e.emotion) {
          if (!grouped[e.emotion]) { grouped[e.emotion] = []; }
          grouped[e.emotion].push(e);
        }
      }
      res.json(grouped);
    } catch (e) {
      res.status(500).json({ error: 'Malformed emotions file' });
    }
  });
});

// GET emotion by ID (index)
app.get('/api/emotions/:id', (req, res) => {
  fs.readFile(EMOTIONS_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read emotions file' });
    }
    try {
      const emotions = JSON.parse(data);
      const idx = parseInt(req.params.id, 10);
      if (isNaN(idx) || idx < 0 || idx >= emotions.length) {
        return res.status(404).json({ error: 'Emotion not found' });
      }
      res.json(emotions[idx]);
    } catch (e) {
      res.status(500).json({ error: 'Malformed emotions file' });
    }
  });});

// In-memory cache to track served chits per emotion
const servedChitsMap = {};

// GET random emotion object for a given emotion type, no repeats until all are served
app.get('/api/emotions/random/:emotion', (req, res) => {
  fs.readFile(EMOTIONS_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read emotions file' });
    }
    try {
      const emotions = JSON.parse(data);
      const filtered = emotions.filter(e => e.emotion === req.params.emotion);
      if (!filtered.length) {
        return res.status(404).json({ error: 'Emotion not found' });
      }
      // Track served indices for this emotion
      const emotionKey = req.params.emotion;
      if (!servedChitsMap[emotionKey]) {
        servedChitsMap[emotionKey] = new Set();
      }
      // Find available indices
      const servedIndices = servedChitsMap[emotionKey];
      const availableIndices = filtered
        .map((_, idx) => idx)
        .filter(idx => !servedIndices.has(idx));
      // If all have been served, reset
      if (availableIndices.length === 0) {
        servedChitsMap[emotionKey] = new Set();
        availableIndices.push(...filtered.map((_, idx) => idx));
      }
      // Pick a random available index
      const randomIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      servedChitsMap[emotionKey].add(randomIdx);
      res.json(filtered[randomIdx]);
    } catch (e) {
      res.status(500).json({ error: 'Malformed emotions file' });
    }
  });
});

// POST update emotions.json (with backup/versioning)
app.post('/api/emotions/update', basicAuth, (req, res) => {
  const newEmotions = req.body;
  if (!Array.isArray(newEmotions) || !newEmotions.every(isValidEmotion)) {
    return res.status(400).json({ error: 'Invalid emotions JSON structure' });
  }
  // Backup current file
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(DATA_DIR, `Emotions_${timestamp}.json`);
  fs.copyFile(EMOTIONS_FILE, backupFile, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to backup emotions file' });
    }
    // Write new file
    fs.writeFile(EMOTIONS_FILE, JSON.stringify(newEmotions, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update emotions file' });
      }
      res.json({ success: true, backup: path.basename(backupFile) });
    });
  });
});

// GET version history
app.get('/api/emotions/versions', (req, res) => {
  fs.readdir(DATA_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to list versions' });
    }
    const backups = files.filter(f => /^Emotions_\d{4}-\d{2}-\d{2}T/.test(f)).sort().reverse();
    res.json(backups);
  });
});

// GET a specific backup version
app.get('/api/emotions/version/:filename', (req, res) => {
  const file = path.join(DATA_DIR, req.params.filename);
  if (!/^Emotions_\d{4}-\d{2}-\d{2}T.*\.json$/.test(req.params.filename)) {
    return res.status(400).json({ error: 'Invalid version filename' });
  }
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).json({ error: 'Version not found' });
    }
    try {
      const emotions = JSON.parse(data);
      res.json(emotions);
    } catch (e) {
      res.status(500).json({ error: 'Malformed backup file' });
    }
  });
});

// Swagger docs (basic)
app.use('/api/docs', express.static(path.join(__dirname, 'swagger')));

// Serve a simple landing page for root (useful for browser test)
app.get('/', (req, res) => {
  res.send('<h2>Emotions API is running.<br>See <a href="/api/docs">/api/docs</a> for API documentation.</h2>');
});

app.listen(PORT, () => {
  console.log(`Emotions API running on ${BASE_URL}`);
});

module.exports = app;
