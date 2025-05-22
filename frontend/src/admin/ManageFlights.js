import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5001/api/admin/flights';

export default function ManageFlights() {
  const [flights, setFlights] = useState([]);
  const [form, setForm] = useState({
    id: null,
    airline_id: '',
    airline_name: '',
    airline_logo: '',
    aircraft_type_id: '',
    aircraft_type_name: '',
    aircraft_type_description: '',
    departure_airport_id: '',
    departure_airport_name: '',
    departure_airport_code: '',
    arrival_airport_id: '',
    arrival_airport_name: '',
    arrival_airport_code: '',
    seat_type_id: '',
    ticket_conditions_id: '',
    departure_time: '',
    arrival_time: '',
    duration: '',
    price_adult: '',
    price_child: '',
    price_infant: '',
    tax: '',
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setFlights(data);
    } catch (error) {
      alert('Lỗi khi tải danh sách chuyến bay');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!form.flight_number) {
      alert('Vui lòng nhập số hiệu chuyến bay');
      return;
    }

    try {
      if (editing) {
        // Update chuyến bay
        const res = await fetch(`${API_URL}/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Update thất bại');
        alert('Cập nhật chuyến bay thành công');
      } else {
        // Thêm chuyến bay mới
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Thêm thất bại');
        alert('Thêm chuyến bay thành công');
      }

      setForm({
        id: null,
        airline_id: '',
        airline_name: '',
        airline_logo: '',
        aircraft_type_id: '',
        aircraft_type_name: '',
        aircraft_type_description: '',
        departure_airport_id: '',
        departure_airport_name: '',
        departure_airport_code: '',
        arrival_airport_id: '',
        arrival_airport_name: '',
        arrival_airport_code: '',
        seat_type_id: '',
        ticket_conditions_id: '',
        departure_time: '',
        arrival_time: '',
        duration: '',
        price_adult: '',
        price_child: '',
        price_infant: '',
        tax: '',
      });
      setEditing(false);
      fetchFlights();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (flight) => {
    setForm({
      id: flight.id,
      airline_id: flight.airline_id,
      airline_name: flight.airline_name,
      airline_logo: flight.airline_logo,
      aircraft_type_id: flight.aircraft_type_id,
      aircraft_type_name: flight.aircraft_type_name,
      aircraft_type_description: flight.aircraft_type_description,
      departure_airport_id: flight.departure_airport_id,
      departure_airport_name: flight.departure_airport_name,
      departure_airport_code: flight.departure_airport_code,
      arrival_airport_id: flight.arrival_airport_id,
      arrival_airport_name: flight.arrival_airport_name,
      arrival_airport_code: flight.arrival_airport_code,
      seat_type_id: flight.seat_type_id,
      ticket_conditions_id: flight.ticket_conditions_id,
      departure_time: flight.departure_time?.slice(0,5) || '',
      arrival_time: flight.arrival_time?.slice(0,5) || '',
      duration: flight.duration?.slice(0,5) || '',
      price_adult: flight.price_adult,
      price_child: flight.price_child,
      price_infant: flight.price_infant,
      tax: flight.tax,
    });
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa chuyến bay này?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Xóa thất bại');
      alert('Xóa chuyến bay thành công');
      fetchFlights();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: 'auto' }}>
      <h2>Quản lý Chuyến bay</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 30, border: '1px solid #ccc', padding: 20, borderRadius: 6 }}>
        <h3>{editing ? 'Cập nhật chuyến bay' : 'Thêm chuyến bay mới'}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <input
            name="airline_id"
            placeholder="ID hãng hàng không"
            value={form.airline_id}
            onChange={handleChange}
            type="number"
            required
          />
          <input
            name="flight_number"
            placeholder="Số hiệu chuyến bay"
            value={form.flight_number}
            onChange={handleChange}
            required
          />
          <input
            name="aircraft_type_id"
            placeholder="ID loại máy bay"
            value={form.aircraft_type_id}
            onChange={handleChange}
            type="number"
            required
          />
          <input
            name="departure_airport_id"
            placeholder="ID sân bay đi"
            value={form.departure_airport_id}
            onChange={handleChange}
            type="number"
            required
          />
          <input
            name="arrival_airport_id"
            placeholder="ID sân bay đến"
            value={form.arrival_airport_id}
            onChange={handleChange}
            type="number"
            required
          />
          <input
            name="seat_type_id"
            placeholder="ID loại ghế"
            value={form.seat_type_id}
            onChange={handleChange}
            type="number"
            required
          />
          <input
            name="ticket_conditions_id"
            placeholder="ID điều kiện vé"
            value={form.ticket_conditions_id}
            onChange={handleChange}
            type="number"
            required
          />
          <input
            name="departure_time"
            placeholder="Giờ cất cánh (HH:MM)"
            value={form.departure_time}
            onChange={handleChange}
            type="time"
            required
          />
          <input
            name="arrival_time"
            placeholder="Giờ hạ cánh (HH:MM)"
            value={form.arrival_time}
            onChange={handleChange}
            type="time"
            required
          />
          <input
            name="duration"
            placeholder="Thời gian bay (HH:MM)"
            value={form.duration}
            onChange={handleChange}
            type="time"
            required
          />
          <input
            name="price_adult"
            placeholder="Giá người lớn"
            value={form.price_adult}
            onChange={handleChange}
            type="number"
            step="0.01"
            required
          />
          <input
            name="price_child"
            placeholder="Giá trẻ em"
            value={form.price_child}
            onChange={handleChange}
            type="number"
            step="0.01"
            required
          />
          <input
            name="price_infant"
            placeholder="Giá em bé"
            value={form.price_infant}
            onChange={handleChange}
            type="number"
            step="0.01"
            required
          />
          <input
            name="tax"
            placeholder="Thuế"
            value={form.tax}
            onChange={handleChange}
            type="number"
            step="0.01"
            required
          />
        </div>

        <button type="submit" style={{ marginTop: 15 }}>
          {editing ? 'Cập nhật' : 'Thêm'}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setForm({
                id: null,
                airline_id: '',
                flight_number: '',
                aircraft_type_id: '',
                departure_airport_id: '',
                arrival_airport_id: '',
                seat_type_id: '',
                ticket_conditions_id: '',
                departure_time: '',
                arrival_time: '',
                duration: '',
                price_adult: '',
                price_child: '',
                price_infant: '',
                tax: '',
              });
            }}
            style={{ marginLeft: 10 }}
          >
            Hủy
          </button>
        )}
      </form>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Số hiệu chuyến bay</th>
            <th>ID hãng</th>
            <th>Tên hãng</th>
            <th>Logo hãng</th>
            <th>ID loại máy bay</th>
            <th>Tên loại máy bay</th>
            <th>Mô tả loại máy bay</th>
            <th>ID sân bay đi</th>
            <th>Tên sân bay đi</th>
            <th>Mã sân bay đi</th>
            <th>ID sân bay đến</th>
            <th>Tên sân bay đến</th>
            <th>Mã sân bay đến</th>
            <th>Loại ghế (ID)</th>
            <th>Điều kiện vé (ID)</th>
            <th>Cất cánh</th>
            <th>Hạ cánh</th>
            <th>Thời gian bay</th>
            <th>Giá người lớn</th>
            <th>Giá trẻ em</th>
            <th>Giá em bé</th>
            <th>Thuế</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {flights.map(flight => (
            <tr key={flight.id}>
              <td>{flight.id}</td>
              <td>{flight.flight_number}</td>
              <td>{flight.airline_id}</td>
              <td>{flight.airline_name}</td>
              <td>{flight.airline_logo}</td>
              <td>{flight.aircraft_type_id}</td>
              <td>{flight.aircraft_type_name}</td>
              <td>{flight.aircraft_type_description}</td>
              <td>{flight.departure_airport_id}</td>
              <td>{flight.departure_airport_name}</td>
              <td>{flight.departure_airport_code}</td>
              <td>{flight.arrival_airport_id}</td>
              <td>{flight.arrival_airport_name}</td>
              <td>{flight.arrival_airport_code}</td>
              <td>{flight.seat_type_id}</td>
              <td>{flight.ticket_conditions_id}</td>
              <td>{flight.departure_time?.slice(0,5)}</td>
              <td>{flight.arrival_time?.slice(0,5)}</td>
              <td>{flight.duration?.slice(0,5)}</td>
              <td>{flight.price_adult}</td>
              <td>{flight.price_child}</td>
              <td>{flight.price_infant}</td>
              <td>{flight.tax}</td>
              <td>
                <button onClick={() => handleEdit(flight)}>Sửa</button>{' '}
                <button onClick={() => handleDelete(flight.id)}>Xóa</button>
              </td>
            </tr>
          ))}
          {flights.length === 0 && (
            <tr><td colSpan="24" style={{ textAlign: 'center' }}>Không có dữ liệu</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}