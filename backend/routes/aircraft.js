const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Kết nối CSDL

// Lấy danh sách loại máy bay
router.get('/types', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM aircraft_types');
    res.json(results);
  } catch (error) {
    console.error('Lỗi khi lấy loại máy bay:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

module.exports = router;
