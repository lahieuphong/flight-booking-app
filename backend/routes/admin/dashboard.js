const express = require('express');
const router = express.Router();
const db = require('../../config/db'); // Kết nối MySQL

router.get('/with-flight-info', async (req, res) => {
  const { email, flight_number } = req.query; // Lấy email và flight_number từ query string

  let query = `
    SELECT 
      p.id AS passenger_id,
      p.first_name,
      p.last_name,
      a.name AS airline_name,
      f.flight_number,
      ac.type_name AS aircraft_type_name,
      ft.departure_time,
      ft.arrival_time,
      dap.name AS departure_airport_name,
      dap.code AS departure_airport_code,
      aap.name AS arrival_airport_name,
      aap.code AS arrival_airport_code,
      p.total_price,
      u.username,
      u.email,
      u.role
    FROM passengers p
    JOIN flight_results f ON p.flight_id = f.id
    JOIN airlines a ON f.airline_id = a.id
    JOIN aircraft_types ac ON f.aircraft_type_id = ac.id
    JOIN flight_times ft ON f.flight_times_id = ft.id
    JOIN airports dap ON f.departure_airport_id = dap.id
    JOIN airports aap ON f.arrival_airport_id = aap.id
    JOIN users u ON p.user_id = u.id
    WHERE 1=1
  `;

  // Thêm điều kiện tìm kiếm nếu có email hoặc flight_number
  if (email) {
    query += ` AND u.email LIKE '%${email}%'`;
  }
  if (flight_number) {
    query += ` AND f.flight_number LIKE '%${flight_number}%'`;
  }

  try {
    const [rows] = await db.execute(query);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching passengers with full flight and user info:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;