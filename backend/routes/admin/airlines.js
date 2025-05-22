const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../../config/db');
const fs = require('fs');

const imagesDir = path.join(__dirname, '../../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Multer config: lưu file vào public/images, đặt tên dạng airline-<timestamp>.<ext>
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, 'airline-' + Date.now() + ext);
  },
});
const upload = multer({ storage });

// POST tạo mới airline (upload logo)
router.post('/', upload.single('logo'), async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  const logo = req.file ? req.file.filename : null;

  try {
    const [result] = await db.query(
      'INSERT INTO airlines (name, logo) VALUES (?, ?)',
      [name, logo]
    );
    res.status(201).json({ id: result.insertId, name, logo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT cập nhật airline (có thể cập nhật logo hoặc không)
router.put('/:id', upload.single('logo'), async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  const logo = req.file ? req.file.filename : null;

  try {
    // Lấy logo cũ để xóa file nếu cần (nếu cập nhật logo mới)
    if (logo) {
      const [rows] = await db.query('SELECT logo FROM airlines WHERE id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ message: 'Airline not found' });
      if (rows[0].logo) {
        const oldPath = path.join(imagesDir, rows[0].logo);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    const query = logo
      ? 'UPDATE airlines SET name = ?, logo = ? WHERE id = ?'
      : 'UPDATE airlines SET name = ? WHERE id = ?';
    const params = logo ? [name, logo, id] : [name, id];

    const [result] = await db.query(query, params);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Airline not found' });

    res.json({ id, name, logo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE airline (xóa cả file logo nếu có)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Lấy logo cũ để xóa file
    const [rows] = await db.query('SELECT logo FROM airlines WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Airline not found' });

    if (rows[0].logo) {
      const filePath = path.join(imagesDir, rows[0].logo);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    const [result] = await db.query('DELETE FROM airlines WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Airline not found' });

    res.json({ message: 'Airline deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET danh sách airlines
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM airlines');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;