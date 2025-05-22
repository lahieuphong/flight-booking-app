import React, { useState } from 'react';
import axios from 'axios';
import '../styles/CheckinOnline.css'; // CSS cho phần layout, form, bảng

const CheckinOnline = () => {
  const [email, setEmail] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [data, setData] = useState([]);

    const handleSearch = () => {
    // Nếu cả email và flightNumber đều trống => không gọi API, không làm gì
    if (!email.trim() && !flightNumber.trim()) {
        setData([]); // có thể xóa kết quả cũ hoặc giữ nguyên
        return;
    }

    axios
        .get('http://localhost:5001/api/admin/dashboard/with-flight-info', {
        params: {
            email: email.trim() || undefined, // nếu trống thì undefined để API ko nhận tham số đó
            flight_number: flightNumber.trim() || undefined,
        },
        })
        .then((res) => setData(res.data))
        .catch((err) => console.error('Error fetching data:', err));
    };

  return (
    <div
      className="checkin-container checkin-online-page"
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: '40px 20px',
        color: '#fff',
        backgroundImage: "url('/images/plane_1.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Overlay mờ nền */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.45)',
          zIndex: 0,
        }}
      />
      
      {/* Nội dung chính */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 10 }}>Trang Checkin Online</h2>
        <p style={{ textAlign: 'center', marginBottom: 30 }}>
          Chức năng check-in trực tuyến đang phát triển. Tuy nhiên, bạn có thể tra cứu thông tin chuyến bay đã đặt bên dưới.
        </p>

        <div className="search-section">
          <input
            type="text"
            placeholder="Tìm kiếm theo email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã chuyến bay"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            Tìm kiếm
          </button>
        </div>

        <h3 style={{ marginTop: 40, marginBottom: 15 }}>Thông Tin Chuyến Bay</h3>

        <table className="flight-table">
          <thead>
            <tr>
              <th>Hành Khách</th>
              <th>Tài Khoản</th>
              <th>Vai Trò</th>
              <th>Hãng Hàng Không</th>
              <th>Mã Chuyến Bay</th>
              <th>Loại Máy Bay</th>
              <th>Khởi Hành</th>
              <th>Đến Nơi</th>
              <th>Tổng Giá</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.first_name} {row.last_name}</td>
                  <td>{row.username}</td>
                  <td>{row.role}</td>
                  <td>{row.airline_name}</td>
                  <td>{row.flight_number}</td>
                  <td>{row.aircraft_type_name}</td>
                  <td>{row.departure_airport_name} ({row.departure_airport_code}) - {row.departure_time}</td>
                  <td>{row.arrival_airport_name} ({row.arrival_airport_code}) - {row.arrival_time}</td>
                  <td>{Number(row.total_price).toLocaleString('vi-VN')} VND</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-result">
                  Không tìm thấy kết quả.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CheckinOnline;