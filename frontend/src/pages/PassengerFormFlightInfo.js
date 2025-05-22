import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import '../styles/PassengerFormFlightInfo.css';

const AccessibleEmoji = ({ label, symbol }) => (
  <span role="img" aria-label={label} aria-hidden={false}>
    {symbol}
  </span>
);

AccessibleEmoji.propTypes = {
  label: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
};

const PassengerFormFlightInfo = () => {
  const location = useLocation();
  const {
    selectedFlight,
    returnFlight,
    departureDate,
    returnDate,
    tripType
  } = location.state || {};

  const selectedFlightNumber = selectedFlight?.flight_number;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketConditions, setTicketConditions] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!selectedFlightNumber) return;

    fetch(`http://localhost:5001/api/prices/${selectedFlightNumber}`)
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
  }, [selectedFlightNumber]);

  // Tính ngày đến nếu giờ đến nhỏ hơn giờ đi (qua ngày hôm sau)
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

  const FlightBlock = ({ flight, flightDate, label }) => {
    if (!flight) return null;

    return (
      <div className="flight-block">
        <div className="flight-info">
          <div className="flight-header">
            <h3>
              <AccessibleEmoji label={label} symbol="✈️" /> {label}:
            </h3>
            <p className="airport-route">
              <span className="airport-name">{flight.departure_airport_name || 'Không rõ'}</span>
              <img
                src="/images/ic-line-flight.png"
                alt=""
                aria-hidden="true"
                className="flight-arrow-icon"
              />
              <span className="airport-name">{flight.arrival_airport_name || 'Không rõ'}</span>
            </p>
          </div>

          <div className="flight-details">
            <div className="column-img">
              <img
                src={`/images/${flight.airline_logo}`}
                alt={`${flight.airline_name || 'Hãng bay'} logo`}
                className="airline-logo"
                onError={e => {
                  e.target.src = '/images/placeholder.png';
                }}
              />
            </div>

            <div className="column-info">
              <p><strong>Mã C.Bay:</strong> {flight.flight_number}</p>
              <p><strong>Loại vé:</strong> {flight.remaining_seats ?? 'N/A'}</p>
            </div>

            <div className="column-time">
              <p><strong className="label-text">Từ:</strong> {flight.departure_airport_name}</p>
              <p>
                <strong className="highlight-time">{flight.departure_time}</strong>
                <span className="gray-date">, {new Date(flightDate).toLocaleDateString('vi-VN')}</span>
              </p>
            </div>

            <div className="column-arrival">
              <p><strong className="label-text">Tới:</strong> {flight.arrival_airport_name}</p>
              <p>
                <strong className="highlight-time">{flight.arrival_time}</strong>
                <span className="gray-date">
                  , {calculateArrivalDate(flightDate, flight.departure_time, flight.arrival_time)}
                </span>
              </p>
            </div>

            <div className="column-button">
              <button className="condition-button" onClick={openModal}>
                Điều kiện vé
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  FlightBlock.propTypes = {
    flight: PropTypes.shape({
      departure_airport_name: PropTypes.string,
      arrival_airport_name: PropTypes.string,
      airline_logo: PropTypes.string,
      airline_name: PropTypes.string,
      flight_number: PropTypes.string,
      remaining_seats: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      departure_time: PropTypes.string,
      arrival_time: PropTypes.string,
    }),
    flightDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    label: PropTypes.string.isRequired,
  };

  return (
    <>
      <FlightBlock flight={selectedFlight} flightDate={departureDate} label="Chiều đi" />

      {tripType === 'round-trip' && returnFlight && (
        <FlightBlock flight={returnFlight} flightDate={returnDate} label="Chiều về" />
      )}

      {isModalOpen && ticketConditions && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={closeModal}
              aria-label="Đóng modal điều kiện vé"
            >
              ×
            </button>

            <div className="ticket-conditions">
              <h3 id="modal-title">
                <AccessibleEmoji label="Điều kiện vé" symbol="🎫" /> Điều kiện vé
              </h3>

              <p><strong><AccessibleEmoji label="Hành lý" symbol="🧳" /> Hành lý:</strong></p>
              <ul>
                <li>Xách tay: {ticketConditions.baggage_carry_on}kg</li>
                <li>Ký gửi: {ticketConditions.baggage_checked}</li>
              </ul>

              <p><strong><AccessibleEmoji label="Giá vé" symbol="💡" /> Giá vé:</strong></p>
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

              <p><strong><AccessibleEmoji label="Lưu ý" symbol="📌" /> Lưu ý:</strong></p>
              <p>{ticketConditions.note}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PassengerFormFlightInfo;