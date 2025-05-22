const express = require('express');
const router = express.Router();
const db = require('../../config/db'); // Cấu hình kết nối MySQL

// API lấy danh sách chuyến bay
router.get('', async (req, res) => {
  const query = `
    SELECT fr.*, ft.departure_time, ft.arrival_time, ft.duration,
           fp.price_adult, fp.price_child, fp.price_infant, fp.tax,
           st.remaining_seats, st.additional_price,
           tc.baggage_carry_on, tc.baggage_checked, tc.name_change,
           tc.flight_change, tc.upgrade, tc.refund, tc.no_show, tc.note,
           a.name AS airline_name, 
           a.logo AS airline_logo,
           at.type_name AS aircraft_type_name,
           at.description AS aircraft_type_description,
           da.name AS departure_airport_name, 
           da.code AS departure_airport_code,
           aa.name AS arrival_airport_name, 
           aa.code AS arrival_airport_code
    FROM flight_results fr
    JOIN flight_times ft ON fr.flight_times_id = ft.id
    JOIN flight_prices fp ON fr.flight_number = fp.flight_number_id
    JOIN seat_types st ON fr.seat_type_id = st.id
    JOIN ticket_conditions tc ON fr.ticket_conditions_id = tc.id
    JOIN airlines a ON fr.airline_id = a.id
    JOIN aircraft_types at ON fr.aircraft_type_id = at.id
    JOIN airports da ON fr.departure_airport_id = da.id
    JOIN airports aa ON fr.arrival_airport_id = aa.id
  `;
  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API thêm chuyến bay
router.post('', async (req, res) => {
  const {
    airline_id, flight_number, aircraft_type_id, departure_airport_id,
    arrival_airport_id, seat_type_id, ticket_conditions_id,
    departure_time, arrival_time, duration,
    price_adult, price_child, price_infant, tax
  } = req.body;

  const insertFlightTime = `
    INSERT INTO flight_times (flight_number_id, departure_time, arrival_time, duration)
    VALUES (?, ?, ?, ?)
  `;
  try {
    const [flightTimeResult] = await db.query(insertFlightTime, [flight_number, departure_time, arrival_time, duration]);
    const flight_times_id = flightTimeResult.insertId;

    const insertFlightResult = `
      INSERT INTO flight_results (airline_id, flight_number, aircraft_type_id, flight_times_id,
        departure_airport_id, arrival_airport_id, seat_type_id, ticket_conditions_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(insertFlightResult, [
      airline_id, flight_number, aircraft_type_id, flight_times_id,
      departure_airport_id, arrival_airport_id, seat_type_id, ticket_conditions_id
    ]);

    const insertFlightPrice = `
      INSERT INTO flight_prices (flight_number_id, price_adult, price_child, price_infant, tax)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.query(insertFlightPrice, [flight_number, price_adult, price_child, price_infant, tax]);

    res.json({ message: 'Thêm chuyến bay thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API cập nhật chuyến bay
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    airline_id, flight_number, aircraft_type_id, departure_airport_id,
    arrival_airport_id, seat_type_id, ticket_conditions_id,
    departure_time, arrival_time, duration,
    price_adult, price_child, price_infant, tax
  } = req.body;

  const updateFlightResult = `
    UPDATE flight_results
    SET airline_id = ?, flight_number = ?, aircraft_type_id = ?, departure_airport_id = ?,
        arrival_airport_id = ?, seat_type_id = ?, ticket_conditions_id = ?
    WHERE id = ?
  `;
  try {
    await db.query(updateFlightResult, [
      airline_id, flight_number, aircraft_type_id, departure_airport_id,
      arrival_airport_id, seat_type_id, ticket_conditions_id, id
    ]);

    const updateFlightTime = `
      UPDATE flight_times
      SET departure_time = ?, arrival_time = ?, duration = ?
      WHERE flight_number_id = ?
    `;
    await db.query(updateFlightTime, [departure_time, arrival_time, duration, flight_number]);

    const updateFlightPrice = `
      UPDATE flight_prices
      SET price_adult = ?, price_child = ?, price_infant = ?, tax = ?
      WHERE flight_number_id = ?
    `;
    await db.query(updateFlightPrice, [price_adult, price_child, price_infant, tax, flight_number]);

    res.json({ message: 'Cập nhật chuyến bay thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API xóa chuyến bay
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const getFlightNumber = `SELECT flight_number FROM flight_results WHERE id = ?`;
  try {
    const [results] = await db.query(getFlightNumber, [id]);
    if (results.length === 0) return res.status(404).json({ error: 'Flight not found' });

    const flight_number = results[0].flight_number;

    const deleteFlightPrice = `DELETE FROM flight_prices WHERE flight_number_id = ?`;
    await db.query(deleteFlightPrice, [flight_number]);

    const deleteFlightTime = `DELETE FROM flight_times WHERE flight_number_id = ?`;
    await db.query(deleteFlightTime, [flight_number]);

    const deleteFlightResult = `DELETE FROM flight_results WHERE id = ?`;
    await db.query(deleteFlightResult, [id]);

    res.json({ message: 'Xóa chuyến bay thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;