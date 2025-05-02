import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/PassengerInfo.css';

const PassengerInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    selectedFlight,
    returnFlight,
    adults,
    childCount,
    infants,
    departureDate,
    returnDate,
    tripType
  } = location.state || {};

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString('vi-VN') : '');

  if (!selectedFlight) {
    return <div className="error-message">Không có thông tin chuyến bay được chọn!</div>;
  }

  const calcPrice = (flight) => {
    const adultPrice = (Number(flight.price_adult) + Number(flight.additional_price)) * adults;
    const adultTax = adultPrice * Number(flight.tax);
    const childCountSafe = childCount > 0 ? childCount : 0;
    const childPrice = (Number(flight.price_child) + Number(flight.additional_price)) * childCountSafe;
    const childTax = childPrice * Number(flight.tax);
    const infantCountSafe = infants > 0 ? infants : 0;
    const infantPrice = (Number(flight.price_infant) + Number(flight.additional_price)) * infantCountSafe;
    const infantTax = infantPrice * Number(flight.tax);

    return adultPrice + adultTax + childPrice + childTax + infantPrice + infantTax;
  };

  const renderFlightDetails = (flight, label, date) => {
    const total = calcPrice(flight);
    return (
      <div className="flight-block">
        <h2>{label}: ✈️ {flight.airline_name} ({flight.flight_number})</h2>
        <p><strong>Loại máy bay:</strong> {flight.aircraft_type}</p>
        <p><strong>Tuyến bay:</strong> {flight.departure_airport_name || 'Chưa có thông tin'} ({flight.departure_airport_code || 'XX'}) → {flight.arrival_airport_name || 'Chưa có thông tin'} ({flight.arrival_airport_code || 'XX'})</p>
        <p><strong>Thời gian:</strong> {flight.departure_time} → {flight.arrival_time} ({flight.duration})</p>
        <p><strong>Ngày bay:</strong> {formatDate(date)}</p>
        <p><strong>Loại ghế:</strong> {flight.remaining_seats}</p>
        <p><strong>Phụ phí:</strong> {Number(flight.additional_price).toLocaleString('vi-VN')} VND</p>

        <div className="passenger-summary">
          <h3>👥 Thông tin hành khách</h3>
          <p>👤 Người lớn: {adults}</p>
          <p>🧒 Trẻ em: {childCount}</p>
          <p>👶 Em bé: {infants}</p>
        </div>

        <div className="price-summary">
          <h3>💰 Tóm tắt giá vé</h3>
          <p>🎫 Giá người lớn: {Number(flight.price_adult).toLocaleString('vi-VN')} VND</p>
          <p>🎫 Giá trẻ em: {Number(flight.price_child).toLocaleString('vi-VN')} VND</p>
          <p>🎫 Giá em bé: {Number(flight.price_infant).toLocaleString('vi-VN')} VND</p>
          <p>💼 Phụ phí: {Number(flight.additional_price).toLocaleString('vi-VN')} VND</p>
          <p>🧾 Thuế: {(Number(flight.tax) * 100).toFixed(0)}%</p>
          <p><strong>💵 Tổng cộng:</strong> {total.toLocaleString('vi-VN')} VND</p>
        </div>
      </div>
    );
  };

  const totalAll = calcPrice(selectedFlight) + (tripType === 'round-trip' && returnFlight ? calcPrice(returnFlight) : 0);

  return (
    <div className="passenger-info-container">
      <h1>Thông tin hành khách & chuyến bay</h1>

      {/* Chiều đi */}
      {renderFlightDetails(selectedFlight, 'Chuyến bay chiều đi', departureDate)}

      {/* Chiều về nếu có */}
      {tripType === 'round-trip' && returnFlight && (
        <>
          <hr />
          {renderFlightDetails(returnFlight, 'Chuyến bay chiều về', returnDate)}

          <div className="grand-total">
            <h2>💵 Tổng cộng giá vé:</h2>
            <p>
              💵 Chiều đi: {calcPrice(selectedFlight).toLocaleString('vi-VN')} VND + 💵 Chiều về: {calcPrice(returnFlight).toLocaleString('vi-VN')} VND
            </p>
            <p><strong>🧾 Tổng cộng tất cả: {totalAll.toLocaleString('vi-VN')} VND</strong></p>
          </div>
        </>
      )}

      <div className="next-step">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>

        <button
          className="continue-btn"
          onClick={() =>
            navigate('/booking/flight-result/passenger-info/passenger-form', {
              state: {
                selectedFlight,
                returnFlight,
                departureDate,
                returnDate,
                tripType,
                adults,
                childCount,
                infants
              },
            })
          }
        >
          Tiếp tục nhập thông tin hành khách →
        </button>

      </div>
    </div>
  );
};

export default PassengerInfo;