const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đảm bảo thư mục logos tồn tại
const logoDir = path.join(__dirname, '../../public/logos');
if (!fs.existsSync(logoDir)) {
  fs.mkdirSync(logoDir, { recursive: true });
}

// Cấu hình multer lưu file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, logoDir);
  },
  filename: (req, file, cb) => {
    // Đặt tên file theo format partner-timestamp.ext
    cb(null, 'partner-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Thêm đối tác
router.post('/partners', upload.single('logo'), async (req, res) => {
  const { name, description, payment_method_code, is_active } = req.body;
  const logo_url = req.file ? req.file.filename : ''; // chỉ lưu tên file
  try {
    await db.query(
      `INSERT INTO postpaid_partner (name, description, logo_url, payment_method_code, is_active) VALUES (?, ?, ?, ?, ?)`,
      [name, description, logo_url, payment_method_code, is_active]
    );
    res.json({ message: 'Thêm đối tác thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi thêm đối tác' });
  }
});

// Cập nhật đối tác
router.put('/partners/:id', upload.single('logo'), async (req, res) => {
  const { name, description, payment_method_code, is_active, logo_url: oldLogo } = req.body;
  const logo_url = req.file ? req.file.filename : oldLogo; // giữ logo cũ nếu không upload mới
  try {
    await db.query(
      `UPDATE postpaid_partner SET name=?, description=?, logo_url=?, payment_method_code=?, is_active=? WHERE id=?`,
      [name, description, logo_url, payment_method_code, is_active, req.params.id]
    );
    res.json({ message: 'Cập nhật đối tác thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi cập nhật đối tác' });
  }
});

// Xóa đối tác
router.delete('/partners/:id', async (req, res) => {
  try {
    await db.query(`DELETE FROM postpaid_partner WHERE id = ?`, [req.params.id]);
    res.json({ message: 'Xóa đối tác thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi xóa đối tác' });
  }
});

// Lấy danh sách đối tác
router.get('/partners', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM postpaid_partner`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đối tác' });
  }
});




// Lấy danh sách đơn đăng ký
router.get('/applications', async (req, res) => {
  try {
    const [applications] = await db.query(`
      SELECT a.*, p.name AS partner_name
      FROM postpaid_application a
      JOIN postpaid_partner p ON a.postpaid_partner_id = p.id
    `);
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn đăng ký' });
  }
});

// Phê duyệt hoặc từ chối đơn (giả định thêm cột status nếu cần)
router.put('/applications/:id/status', async (req, res) => {
  const { status } = req.body; // 'approved' | 'rejected'
  try {
    await db.query(`UPDATE postpaid_application SET status = ? WHERE id = ?`, [status, req.params.id]);
    res.json({ message: 'Cập nhật trạng thái thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái' });
  }
});



module.exports = router;