const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ GET: Lấy toàn bộ chuyến bay
router.get('/', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM flight_results');
    res.json(results);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách chuyến bay:', error);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

// ✅ GET: Lấy chi tiết chuyến bay theo flight_number với thông tin điều kiện vé
router.get('/:flightNumber', async (req, res) => {
  const { flightNumber } = req.params;

  try {
    const query = `
      SELECT 
        fr.id,
        fr.airline_id,
        al.logo AS airline_logo,
        al.name AS airline_name,
        fr.flight_number,

        fr.aircraft_type_id,
        at.type_name AS aircraft_type,
        at.description,

        fr.flight_times_id,
        ft.departure_time,
        ft.arrival_time,
        ft.duration,

        fr.departure_airport_id,
        da.name AS departure_airport_name,  
        da.code AS departure_airport_code,  
        fr.arrival_airport_id,
        aa.name AS arrival_airport_name,     
        aa.code AS arrival_airport_code,     

        fp.price_adult AS price,
        fr.seat_type_id,
        st.remaining_seats,
        st.additional_price,

        fp.price_adult AS price_adult,
        fp.price_child,
        fp.price_infant,
        fp.tax,

        fr.ticket_conditions_id,
        tc.baggage_carry_on,
        tc.baggage_checked,
        tc.name_change,
        tc.flight_change,
        tc.upgrade,
        tc.refund,
        tc.no_show,
        tc.note

      FROM flight_results fr
      LEFT JOIN airlines al ON fr.airline_id = al.id
      LEFT JOIN aircraft_types at ON fr.aircraft_type_id = at.id
      LEFT JOIN flight_times ft ON fr.flight_number = ft.flight_number_id
      LEFT JOIN airports da ON fr.departure_airport_id = da.id   
      LEFT JOIN airports aa ON fr.arrival_airport_id = aa.id
      LEFT JOIN seat_types st ON fr.seat_type_id = st.id
      LEFT JOIN flight_prices fp ON fr.flight_number = fp.flight_number_id
      LEFT JOIN ticket_conditions tc ON fr.ticket_conditions_id = tc.id  
      WHERE fr.flight_number = ?
    `;

    const [results] = await db.execute(query, [flightNumber]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy chuyến bay' });
    }

    res.json(results[0]);
  } catch (error) {
    console.error('❌ Lỗi khi lấy chi tiết chuyến bay:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
});

module.exports = router;