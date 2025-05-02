const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Kết nối tới MySQL

// Thêm chuyến bay vào database
router.post('/insertBooking', async (req, res) => {
  const {
    departure_airport,
    departure_airport_code,
    arrival_airport,
    arrival_airport_code,
    departureDate,
    returnDate,
    tripType,
    adults,
    children,
    infants
  } = req.body;

  if (!departure_airport || !arrival_airport || !departureDate) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO bookings 
      (departure_airport, departure_airport_code, arrival_airport, arrival_airport_code, departure_date, return_date, trip_type, adults, children, infants) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        departure_airport,
        departure_airport_code,
        arrival_airport,
        arrival_airport_code,
        departureDate,
        returnDate,
        tripType,
        adults,
        children,
        infants
      ]
    );

    return res.status(201).json({ success: true, message: 'Đặt vé thành công', bookingId: result.insertId });
  } catch (error) {
    console.error('Lỗi khi thêm dữ liệu:', error);
    return res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi thêm dữ liệu' });
  }
});

module.exports = router;
