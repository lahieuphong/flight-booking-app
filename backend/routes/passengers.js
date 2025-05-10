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
    contact_info_id 
  } = req.body;

  const query = `
    INSERT INTO passengers (
      first_name, last_name,
      gender, dob, id_number,
      flight_id, 
      departure_baggage_id, return_baggage_id, 
      departure_food_meal_id, departure_drink_meal_id, 
      return_food_meal_id, return_drink_meal_id,
      voucher_id, contact_info_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    await db.query(query, [
      first_name,
      last_name,
      gender,
      dob,
      id_number,
      flight_id,
      departure_baggage_id || null,
      return_baggage_id || null,
      departure_food_meal_id || null,
      departure_drink_meal_id || null,
      return_food_meal_id || null,
      return_drink_meal_id || null,
      voucher_id || null,
      contact_info_id, 
    ]);

    res.status(200).send({ message: 'Passenger inserted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).send({ message: 'Database error' });
  }
});

module.exports = router;