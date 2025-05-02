const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Lấy danh sách loại đồ ăn và uống
router.get('/', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM meals');
    res.json(results);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách món ăn và đồ uống:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

module.exports = router;