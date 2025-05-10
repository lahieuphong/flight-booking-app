const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Kết nối CSDL

// Lấy danh sách hành lý
router.get('/', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM baggage');
    res.json(results);
  } catch (error) {
    console.error('Lỗi khi lấy hành lí:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

module.exports = router;