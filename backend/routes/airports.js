const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ Hàm lấy ID sân bay theo tên
async function getAirportId(airportName) {
  try {
    const [rows] = await db.execute('SELECT id FROM airports WHERE name = ?', [airportName]);
    return rows.length > 0 ? rows[0].id : null;
  } catch (error) {
    console.error('❌ Lỗi khi lấy ID sân bay:', error);
    throw error;  // để nơi gọi biết là lỗi
  }
}

// ✅ API lấy danh sách tất cả các sân bay
router.get('/', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM airports');
    res.json(results);
  } catch (err) {
    console.error('❌ Error fetching airports:', err);
    res.status(500).json({ error: 'Failed to fetch airports' });
  }
});

module.exports = { 
  router,      // export router để app.js import
  getAirportId // export thêm hàm này cho search.js import
};