const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Kết nối cơ sở dữ liệu

// ✅ API: Lấy danh sách tất cả các thời gian chuyến bay
router.get('/', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM flight_times');
    res.status(200).json(results);
  } catch (err) {
    console.error('❌ Lỗi khi lấy dữ liệu flight_times:', err);
    res.status(500).json({ error: 'Không thể lấy dữ liệu thời gian chuyến bay' });
  }
});

// ✅ API: Lấy thời gian chuyến bay theo MÃ chuyến bay (vd: VJ160, QH201...)
router.get('/by-flight-number/:flight_number_id', async (req, res) => {
  const { flight_number_id } = req.params;

  try {
    const [results] = await db.execute(
      'SELECT * FROM flight_times WHERE flight_number_id = ?',
      [flight_number_id]
    );

    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ error: 'Không tìm thấy thời gian chuyến bay' });
    }
  } catch (err) {
    console.error('❌ Lỗi khi lấy thời gian chuyến bay:', err);
    res.status(500).json({ error: 'Lỗi server khi lấy thời gian chuyến bay' });
  }
});

module.exports = router;