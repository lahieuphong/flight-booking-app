const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Đường dẫn tới file kết nối DB của bạn

// [GET] Lấy tất cả điều kiện vé
router.get('/', (req, res) => {
  const query = 'SELECT * FROM ticket_conditions';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Lỗi khi truy vấn tất cả điều kiện vé:', err);
      return res.status(500).json({ error: 'Lỗi truy vấn dữ liệu từ cơ sở dữ liệu.' });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy điều kiện vé nào.' });
    }

    res.json(results); // Trả về mảng kết quả
  });
});

// [GET] Lấy điều kiện vé theo ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM ticket_conditions WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Lỗi khi truy vấn điều kiện vé theo ID:', err);
      return res.status(500).json({ error: 'Lỗi truy vấn dữ liệu từ cơ sở dữ liệu.' });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy điều kiện vé.' });
    }

    res.json(results[0]); // Trả về 1 dòng (object)
  });
});

module.exports = router;