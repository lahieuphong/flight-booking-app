const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// Lấy tất cả voucher
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM vouchers');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách voucher' });
  }
});

// Thêm voucher
router.post('/', async (req, res) => {
  const { code, discount, is_active } = req.body;
  try {
    await db.execute(
      'INSERT INTO vouchers (code, discount, is_active) VALUES (?, ?, ?)',
      [code, discount, is_active ?? 1]
    );
    res.json({ message: 'Thêm voucher thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi thêm voucher' });
  }
});

// Sửa voucher
router.put('/:id', async (req, res) => {
  const { code, discount, is_active } = req.body;
  const { id } = req.params;
  try {
    await db.execute(
      'UPDATE vouchers SET code = ?, discount = ?, is_active = ? WHERE id = ?',
      [code, discount, is_active ?? 1, id]
    );
    res.json({ message: 'Cập nhật voucher thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật voucher' });
  }
});

// Xóa voucher
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM vouchers WHERE id = ?', [id]);
    res.json({ message: 'Xóa voucher thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa voucher' });
  }
});

module.exports = router;
