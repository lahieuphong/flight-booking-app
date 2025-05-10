const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/vouchers - Lấy tất cả mã giảm giá
router.get('/', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM vouchers WHERE is_active = TRUE');
    res.json(results);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách voucher:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

// GET /api/vouchers/:code - Kiểm tra mã giảm giá cụ thể
router.get('/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const [results] = await db.execute('SELECT * FROM vouchers WHERE code = ? AND is_active = TRUE', [code]);
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn' });
    }
  } catch (error) {
    console.error('Lỗi khi kiểm tra mã voucher:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

module.exports = router;