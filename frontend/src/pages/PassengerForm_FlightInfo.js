import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/PassengerForm_FlightInfo.css';

const PassengerForm_FlightInfo = () => {
  // 🧭 Lấy dữ liệu chuyến bay từ location state (gửi từ trang trước)
  const location = useLocation();
  const {
    selectedFlight,
    returnFlight,
    departureDate,
    returnDate,
    tripType
  } = location.state || {};

  // 📦 Quản lý trạng thái modal điều kiện vé và dữ liệu điều kiện vé
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketConditions, setTicketConditions] = useState(null);

  // ⚙️ Hàm mở / đóng modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 🌐 Lấy điều kiện vé từ API dựa theo mã chuyến bay
  useEffect(() => {
    if (!selectedFlight?.flight_number) return;

    fetch(`http://localhost:5001/api/prices/${selectedFlight.flight_number}`)
      .then(res => {
        if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setTicketConditions({
          baggage_carry_on: data.baggage_carry_on,
          baggage_checked: data.baggage_checked,
          name_change: data.name_change,
          flight_change: data.flight_change,
          upgrade: data.upgrade,
          refund: data.refund,
          no_show: data.no_show,
          note: data.note
        });
      })
      .catch(err => {
        console.error('Lỗi khi lấy điều kiện vé và chuyến bay:', err);
      });
  }, [selectedFlight?.flight_number]);

  // 🧮 Tính ngày đến nếu giờ đến nhỏ hơn giờ đi (qua ngày hôm sau)
  const calculateArrivalDate = (date, departureTime, arrivalTime) => {
    if (!departureTime || !arrivalTime) return '';
    const [depHour, depMin] = departureTime.split('h').map(Number);
    const [arrHour, arrMin] = arrivalTime.split('h').map(Number);
    const arrivalDate = new Date(date);

    if (arrHour < depHour || (arrHour === depHour && arrMin < depMin)) {
      arrivalDate.setDate(arrivalDate.getDate() + 1);
    }

    return arrivalDate.toLocaleDateString('vi-VN');
  };

  return (
    <>
      {/* 🛫 Hiển thị thông tin chiều đi */}
      {selectedFlight && (
        <div className="flight-block">
          <div className="flight-info">
            <div className="flight-header">
              <h3>✈️ Chiều đi:</h3>
              <p className="airport-route">
                <span className="airport-name">{selectedFlight?.departure_airport_name || 'Không rõ'}</span>
                <img src="/images/ic-line-flight.png" alt="Flight arrow" className="flight-arrow-icon" />
                <span className="airport-name">{selectedFlight?.arrival_airport_name || 'Không rõ'}</span>
              </p>
            </div>

            <div className="flight-details">
              {/* Logo hãng bay */}
              <div className="column-img">
                <img
                  src={`/images/${selectedFlight?.airline_logo}`}
                  alt={selectedFlight?.airline_name}
                  className="airline-logo"
                  onError={(e) => { e.target.src = '/images/placeholder.png'; }}
                />
              </div>

              {/* Mã chuyến bay & loại vé */}
              <div className="column-info">
                <p><strong>Mã C.Bay:</strong> {selectedFlight?.flight_number}</p>
                <p><strong>Loại vé:</strong> {selectedFlight?.remaining_seats || 'N/A'}</p>
              </div>

              {/* Giờ khởi hành */}
              <div className="column-time">
                <p><strong className="label-text">Từ:</strong> {selectedFlight?.departure_airport_name}</p>
                <p>
                  <strong className="highlight-time">{selectedFlight?.departure_time}</strong>
                  <span className="gray-date">, {new Date(departureDate).toLocaleDateString('vi-VN')}</span>
                </p>
              </div>

              {/* Giờ đến */}
              <div className="column-arrival">
                <p><strong className="label-text">Tới:</strong> {selectedFlight?.arrival_airport_name}</p>
                <p>
                  <strong className="highlight-time">{selectedFlight?.arrival_time}</strong>
                  <span className="gray-date">, {calculateArrivalDate(departureDate, selectedFlight?.departure_time, selectedFlight?.arrival_time)}</span>
                </p>
              </div>

              {/* Nút xem điều kiện vé */}
              <div className="column-button">
                <button className="condition-button" onClick={openModal}>Điều kiện vé</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔁 Hiển thị thông tin chiều về nếu là khứ hồi */}
      {tripType === 'round-trip' && returnFlight && (
        <div className="flight-block">
          <div className="flight-info">
            <div className="flight-header">
              <h3>✈️ Chiều về:</h3>
              <p className="airport-route">
                <span className="airport-name">{returnFlight?.departure_airport_name || 'Không rõ'}</span>
                <img src="/images/ic-line-flight.png" alt="Flight arrow" className="flight-arrow-icon" />
                <span className="airport-name">{returnFlight?.arrival_airport_name || 'Không rõ'}</span>
              </p>
            </div>

            <div className="flight-details">
              <div className="column-img">
                <img
                  src={`/images/${returnFlight?.airline_logo}`}
                  alt={returnFlight?.airline_name}
                  className="airline-logo"
                  onError={(e) => { e.target.src = '/images/placeholder.png'; }}
                />
              </div>

              <div className="column-info">
                <p><strong>Mã C.Bay:</strong> {returnFlight?.flight_number}</p>
                <p><strong>Loại vé:</strong> {returnFlight?.remaining_seats || 'N/A'}</p>
              </div>

              <div className="column-time">
                <p><strong className="label-text">Từ:</strong> {returnFlight?.departure_airport_name}</p>
                <p>
                  <strong className="highlight-time">{returnFlight?.departure_time}</strong>
                  <span className="gray-date">, {new Date(returnDate).toLocaleDateString('vi-VN')}</span>
                </p>
              </div>

              <div className="column-arrival">
                <p><strong className="label-text">Tới:</strong> {returnFlight?.arrival_airport_name}</p>
                <p>
                  <strong className="highlight-time">{returnFlight?.arrival_time}</strong>
                  <span className="gray-date">, {calculateArrivalDate(returnDate, returnFlight?.departure_time, returnFlight?.arrival_time)}</span>
                </p>
              </div>

              <div className="column-button">
                <button className="condition-button" onClick={openModal}>Điều kiện vé</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📋 Hiển thị modal điều kiện vé */}
      {isModalOpen && ticketConditions && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={closeModal}>×</button>
            <div className="ticket-conditions">
              <h3>🎫 Điều kiện vé</h3>

              <p><strong>🧳 Hành lý:</strong></p>
              <ul>
                <li>Xách tay: {ticketConditions.baggage_carry_on}kg</li>
                <li>Ký gửi: {ticketConditions.baggage_checked}</li>
              </ul>

              <p><strong>💡 Giá vé:</strong></p>
              <ul>
                <li>Thay đổi tên khách: {ticketConditions.name_change}</li>
                <li>
                  Đổi chuyến: Trước 3 tiếng. Phí đổi: {Number(ticketConditions.flight_change).toLocaleString('vi-VN')} VND + chênh lệch vé.
                </li>
                <li>
                  Nâng hạng: {Number(ticketConditions.upgrade).toLocaleString('vi-VN')} VND + chênh lệch vé.
                </li>
                <li>
                  Hoàn vé: Trước 24h. Bảo lưu 365 ngày. Phí: {Number(ticketConditions.refund).toLocaleString('vi-VN')} VND.
                </li>
                <li>No Show: {ticketConditions.no_show}</li>
              </ul>

              <p><strong>📌 Lưu ý:</strong></p>
              <p>{ticketConditions.note}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PassengerForm_FlightInfo;