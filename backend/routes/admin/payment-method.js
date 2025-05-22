const express = require('express');
const router = express.Router();
const db = require('../../config/db'); // mysql2/promise pool
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Thư mục lưu icon
const iconDir = path.join(__dirname, '../../public/icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Cấu hình multer lưu file icon
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, iconDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, 'upload-' + Date.now() + ext);
  },
});
const upload = multer({ storage });

// Upload icon riêng
router.post('/icon', upload.single('icon'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Không có file được tải lên' });
  }
  res.json({
    message: 'Tải ảnh thành công',
    filename: req.file.filename,
    url: `/icons/${req.file.filename}`,
  });
});

// Thêm mới phương thức thanh toán
router.post('/', async (req, res) => {
  const { code, name, description, icon_url, is_active } = req.body;
  const iconFilename = icon_url || null;

  try {
    await db.query(
      'INSERT INTO payment_method (code, name, description, icon_url, is_active) VALUES (?, ?, ?, ?, ?)',
      [code, name, description, iconFilename, is_active ?? 1]
    );
    res.json({ message: 'Thêm phương thức thanh toán thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cập nhật phương thức thanh toán
router.put('/:id', async (req, res) => {
  const { code, name, description, icon_url, is_active } = req.body;
  const newIconFilename = icon_url || null;

  try {
    // Xóa icon cũ nếu khác icon mới
    if (newIconFilename) {
      const [rows] = await db.query('SELECT icon_url FROM payment_method WHERE id = ?', [req.params.id]);
      if (rows.length) {
        const oldIcon = rows[0].icon_url;
        if (oldIcon && oldIcon !== newIconFilename && oldIcon.startsWith('upload-')) {
          const oldPath = path.join(iconDir, oldIcon);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
      }
    }

    const query = newIconFilename
      ? 'UPDATE payment_method SET code=?, name=?, description=?, icon_url=?, is_active=? WHERE id=?'
      : 'UPDATE payment_method SET code=?, name=?, description=?, is_active=? WHERE id=?';

    const params = newIconFilename
      ? [code, name, description, newIconFilename, is_active, req.params.id]
      : [code, name, description, is_active, req.params.id];

    await db.query(query, params);
    res.json({ message: 'Cập nhật phương thức thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Xóa phương thức thanh toán
router.delete('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT icon_url FROM payment_method WHERE id = ?', [req.params.id]);
    if (rows.length) {
      const icon = rows[0].icon_url;
      if (icon && icon.startsWith('upload-')) {
        const filePath = path.join(iconDir, icon);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    await db.query('DELETE FROM payment_method WHERE id = ?', [req.params.id]);
    res.json({ message: 'Xóa phương thức thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lấy danh sách phương thức thanh toán
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM payment_method ORDER BY id DESC');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;