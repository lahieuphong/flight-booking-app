const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', async (req, res) => {
  const {
    first_name,
    last_name,
    gender,
    dob,
    id_number,
    flight_id,
    departure_baggage_id,
    return_baggage_id,
    departure_food_meal_id,
    departure_drink_meal_id,
    return_food_meal_id,
    return_drink_meal_id,
    voucher_id, 
    contact_info_id,
    payment_method_id,
    total_price,
    user_id
  } = req.body;

  const query = `
    INSERT INTO passengers (
      first_name, last_name,
      gender, dob, id_number,
      flight_id, 
      departure_baggage_id, return_baggage_id, 
      departure_food_meal_id, departure_drink_meal_id, 
      return_food_meal_id, return_drink_meal_id,
      voucher_id, contact_info_id, payment_method_id,
      total_price,
      user_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.query(query, [
      first_name,
      last_name,
      gender,
      dob,
      id_number,
      flight_id,
      departure_baggage_id ?? null,
      return_baggage_id ?? null,
      departure_food_meal_id ?? null,
      departure_drink_meal_id ?? null,
      return_food_meal_id ?? null,
      return_drink_meal_id ?? null,
      voucher_id ?? null,
      contact_info_id ?? null,
      payment_method_id ?? null,
      total_price ?? null,
      user_id ?? null,
    ]);
    
    res.status(201).json({ insertId: result.insertId });
  } catch (error) {
    console.error('Database error:', error);  // Ghi log chi tiết lỗi
    res.status(500).send({ message: 'Database error' });
  }

});


// PATCH /api/passengers/payment-method
router.patch('/payment-method', async (req, res) => {
  const { passengerIds, paymentMethodId, totalPrice, userId } = req.body;

  if (!Array.isArray(passengerIds) || !paymentMethodId) {
    return res.status(400).json({ error: 'Thiếu dữ liệu cần thiết' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM payment_method WHERE id = ?', [paymentMethodId]);
    const paymentMethod = rows[0];

    if (!paymentMethod) {
      return res.status(400).json({ error: 'Phương thức thanh toán không hợp lệ.' });
    }

    const additionalCost = totalPrice ?? paymentMethod.fee ?? 0;

    const updateQuery = `
      UPDATE passengers
      SET payment_method_id = ?, total_price = ?, user_id = ?
      WHERE id IN (${passengerIds.map(() => '?').join(',')})
    `;

    const values = [paymentMethodId, additionalCost, userId, ...passengerIds];

    await db.query(updateQuery, values);

    res.status(200).json({ message: 'Cập nhật thành công' });
  } catch (error) {
    console.error('Lỗi khi cập nhật phương thức thanh toán:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});





module.exports = router;