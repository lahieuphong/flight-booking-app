const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Đảm bảo đường dẫn đúng với cấu trúc của bạn

router.get('/', async (req, res) => {
    try {
      const [results] = await db.execute('SELECT * FROM seat_types'); 
      res.json(results);
    } catch (err) {
      console.error('❌ Error fetching cities:', err);
      res.status(500).json({ error: 'Failed to fetch cities' });
    }
  });

// // Join bảng flight_results + seat_types
// router.get('/', async (req, res) => {
//   try {
//     const [results] = await db.execute(`
//       SELECT 
//         fr.*, 
//         st.additional_price
//       FROM 
//         flight_results fr
//       LEFT JOIN 
//         seat_types st ON fr.remaining_seats = st.remaining_seats
//     `);

//     res.json(results);
//   } catch (error) {
//     console.error('Lỗi khi lấy danh sách chuyến bay:', error);
//     res.status(500).json({ error: 'Lỗi máy chủ' });
//   }
// });

module.exports = router;