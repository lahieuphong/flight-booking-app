const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Cập nhật seat_type_id theo flight_number
router.put('/', async (req, res) => {
  const { flight_number, seat_type_id } = req.body;

  if (!flight_number || !seat_type_id) {
    return res.status(400).json({ message: 'Thiếu flight_number hoặc seat_type_id' });
  }

  try {
    const query = `
      UPDATE flight_results
      SET seat_type_id = ?
      WHERE flight_number = ?
    `;

    const [result] = await db.execute(query, [seat_type_id, flight_number]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy chuyến bay để cập nhật' });
    }

    res.status(200).json({ message: 'Cập nhật loại ghế thành công' });
  } catch (err) {
    console.error('Lỗi khi cập nhật seat_type_id:', err);
    res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật seat_type_id' });
  }
});

module.exports = router;

// TEST API:
// PUT 
// http://localhost:5001/api/update-seat-type

// {
//     "flight_number": "VJ160",
//     "seat_type_id": 2
// }

// RESULTS:
// {
//     "message": "Cập nhật mã ghế thành công",
//     "flight_number": "VJ160",
//     "seat_type_id": 2
// }