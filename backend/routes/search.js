const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const { getAirportId } = require('./airports');  // ✅ Import 

// ✅ API tìm kiếm chuyến bay
router.post('/', async (req, res) => {
  const { departure_airport, arrival_airport } = req.body;

  console.log('Request body:', req.body);

  try {
    const departureAirportId = await getAirportId(departure_airport);
    const arrivalAirportId = await getAirportId(arrival_airport);

    console.log('Departure ID:', departureAirportId);
    console.log('Arrival ID:', arrivalAirportId);

    if (!departureAirportId || !arrivalAirportId) {
      return res.status(404).json({ success: false, message: 'Sân bay không tìm thấy.' });
    }

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
      WHERE fr.departure_airport_id = ? AND fr.arrival_airport_id = ?
    `;

    const [results] = await db.execute(query, [departureAirportId, arrivalAirportId]);

    if (results.length > 0) {
      res.status(200).json({ success: true, flights: results });
    } else {
      res.status(404).json({ success: false, message: 'Chuyến bay đã hết.' });
    }
  } catch (error) {
    console.error('Lỗi khi tìm kiếm chuyến bay:', error);
    res.status(500).json({ message: 'Lỗi server.' });
  }
});

module.exports = router;


// TEST API:
// POST 
// http://localhost:5001/api/search

// {
//   "departure_airport": "Hà Nội",
//   "arrival_airport": "Hồ Chí Minh"
// }

// RESULTS:
// {
//   "success": true,
//   "flights": [
//     {
//       "id": 1,
//       "flight_number": "VN123",
//       "airline_name": "Vietnam Airlines",
//       "departure_time": "08:00",
//       "arrival_time": "10:30",
//       "price": 1500000,
//       "remaining_seats": 50,
//       "departure_city": "Hà Nội",
//       "arrival_city": "Hồ Chí Minh"
//     }
//   ]
// }