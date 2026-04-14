const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

const UPLOAD_DIR = path.join(__dirname, '../../public/uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

// POST /api/admin/upload - upload a single image
router.post('/admin/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No image uploaded' });
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  const url = `${baseUrl}/uploads/${req.file.filename}`;
  res.status(201).json({ success: true, url });
});

// GET /api/admin/images - list uploaded images
router.get('/admin/images', auth, (req, res) => {
  try {
    const files = fs.readdirSync(UPLOAD_DIR);
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const images = files
      .filter(f => /\.(jpe?g|png|gif|webp|svg)$/i.test(f))
      .map(f => ({
        filename: f,
        url: `${baseUrl}/uploads/${f}`
      }));
    res.json({ success: true, data: images });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to list images' });
  }
});

module.exports = router;
