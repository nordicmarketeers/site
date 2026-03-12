const express = require('express');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();
const cors = require('cors');

// Multer with memory storage (no size limit)
const upload = multer({ storage: multer.memoryStorage() });

// Handle OPTIONS preflight
router.options('*', cors());

// CORS - exact origin + credentials
router.use(
  cors({
    origin: true,
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  })
);

// Global CORS headers - exact origin + credentials
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

router.use((req, res, next) => {
  console.log('Supabase proxy hit:', req.method, req.originalUrl);
  next();
});

// Upload route
router.post('/upload-pdf', upload.single('file'), async (req, res) => {
  try {
    console.log('Upload request body:', req.body);
    console.log('File received:', req.file ? req.file.originalname : 'No file');

    const { path } = req.body;
    const file = req.file;

    if (!file) {
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.header('Access-Control-Allow-Credentials', 'true');
      return res.status(400).json({ error: 'No file provided' });
    }

    if (!path) {
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.header('Access-Control-Allow-Credentials', 'true');
      return res.status(400).json({ error: 'No path provided' });
    }

    if (file.mimetype !== 'application/pdf') {
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.header('Access-Control-Allow-Credentials', 'true');
      return res.status(400).json({ error: 'Invalid file type - PDF required' });
    }
    // MAX 6MB
    if (file.size > 6 * 1024 * 1024) {
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.header('Access-Control-Allow-Credentials', 'true');
      return res.status(400).json({ error: 'File too large - max 6MB' });
    }

    const { data, error } = await supabase.storage.from('PDF').upload(path, file.buffer, {
      contentType: file.mimetype,
    });

    if (error) {
      console.error('Supabase upload error:', error);
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.header('Access-Control-Allow-Credentials', 'true');
      return res.status(500).json({ error: error.message });
    }

    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/PDF/${path}`;
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.json({ url: publicUrl });
  } catch (err) {
    console.error('Proxy upload error:', err);
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Delete route
router.post('/delete-pdf', async (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { paths } = req.body;

    console.log('Delete request paths:', paths);

    if (!Array.isArray(paths) || paths.length === 0) {
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.header('Access-Control-Allow-Credentials', 'true');
      return res.status(400).json({ error: 'No paths provided' });
    }

    const { data, error } = await supabase.storage.from('PDF').remove(paths);

    if (error) {
      console.error('Supabase delete error:', error);
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.header('Access-Control-Allow-Credentials', 'true');
      return res.status(500).json({ error: error.message });
    }

    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.json({ success: true, deleted: data });
  } catch (err) {
    console.error('Proxy delete error:', err);
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

module.exports = router;
