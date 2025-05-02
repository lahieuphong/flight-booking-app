const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Kết nối cơ sở dữ liệu

// 1. Thêm thông tin liên hệ
router.post('/', async (req, res) => {
  const { name, phone, email, address } = req.body;

  const query = `
    INSERT INTO contact_info (name, phone, email, address)
    VALUES (?, ?, ?, ?)
  `;

  try {
    // Thực hiện truy vấn insert
    const [result] = await db.execute(query, [name, phone, email, address]);

    // Trả về id của thông tin liên hệ vừa được tạo
    res.status(201).json({
      message: 'Thông tin liên hệ đã được thêm',
      contactInfoId: result.insertId, // ID của thông tin liên hệ
    });
  } catch (error) {
    console.error('Lỗi khi thêm thông tin liên hệ:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

module.exports = router;