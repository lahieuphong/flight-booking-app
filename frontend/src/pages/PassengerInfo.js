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
        <h2>
          {label}: <span role="img" aria-label="máy bay">✈️</span> {flight.airline_name} ({flight.flight_number})
        </h2>
        <p><strong>Loại máy bay:</strong> {flight.aircraft_type}</p>
        <p><strong>Tuyến bay:</strong> {flight.departure_airport_name || 'Chưa có thông tin'} ({flight.departure_airport_code || 'XX'}) → {flight.arrival_airport_name || 'Chưa có thông tin'} ({flight.arrival_airport_code || 'XX'})</p>
        <p><strong>Thời gian:</strong> {flight.departure_time} → {flight.arrival_time} ({flight.duration})</p>
        <p><strong>Ngày bay:</strong> {formatDate(date)}</p>
        <p><strong>Loại ghế:</strong> {flight.remaining_seats}</p>
        <p><strong>Phụ phí:</strong> {Number(flight.additional_price).toLocaleString('vi-VN')} VND</p>

        <div className="passenger-summary">
          <h3><span role="img" aria-label="thông tin hành khách">👥</span> Thông tin hành khách</h3>
          <p><span role="img" aria-label="người lớn">👤</span> Người lớn: {adults}</p>
          <p><span role="img" aria-label="trẻ em">🧒</span> Trẻ em: {childCount}</p>
          <p><span role="img" aria-label="em bé">👶</span> Em bé: {infants}</p>
        </div>

        <div className="price-summary">
          <h3><span role="img" aria-label="tóm tắt giá vé">💰</span> Tóm tắt giá vé</h3>
          <p><span role="img" aria-label="giá người lớn">🎫</span> Giá người lớn: {Number(flight.price_adult).toLocaleString('vi-VN')} VND</p>
          <p><span role="img" aria-label="giá trẻ em">🎫</span> Giá trẻ em: {Number(flight.price_child).toLocaleString('vi-VN')} VND</p>
          <p><span role="img" aria-label="giá em bé">🎫</span> Giá em bé: {Number(flight.price_infant).toLocaleString('vi-VN')} VND</p>
          <p><span role="img" aria-label="phụ phí">💼</span> Phụ phí: {Number(flight.additional_price).toLocaleString('vi-VN')} VND</p>
          <p><span role="img" aria-label="thuế">🧾</span> Thuế: {(Number(flight.tax) * 100).toFixed(0)}%</p>
          <p><strong><span role="img" aria-label="tổng cộng">💵</span> Tổng cộng:</strong> {total.toLocaleString('vi-VN')} VND</p>
        </div>
      </div>
    );
  };

  const totalAll = calcPrice(selectedFlight) + (tripType === 'round-trip' && returnFlight ? calcPrice(returnFlight) : 0);

  return (
    <div className="passenger-info-container">
      <h1>Thông tin hành khách & chuyến bay</h1>

      {renderFlightDetails(selectedFlight, 'Chuyến bay chiều đi', departureDate)}

      {tripType === 'round-trip' && returnFlight && (
        <>
          <hr />
          {renderFlightDetails(returnFlight, 'Chuyến bay chiều về', returnDate)}

          <div className="grand-total">
            <h2><span role="img" aria-label="tổng cộng">💵</span> Tổng cộng giá vé:</h2>
            <p>
              <span role="img" aria-label="chiều đi">💵</span> Chiều đi: {calcPrice(selectedFlight).toLocaleString('vi-VN')} VND +{' '}
              <span role="img" aria-label="chiều về">💵</span> Chiều về: {calcPrice(returnFlight).toLocaleString('vi-VN')} VND
            </p>
            <p><strong><span role="img" aria-label="tổng tất cả">🧾</span> Tổng cộng tất cả: {totalAll.toLocaleString('vi-VN')} VND</strong></p>
          </div>
        </>
      )}

      <div className="next-step">
        {/* <button className="back-btn" onClick={() => navigate(-1)}>
          ← Quay lại
        </button> */}

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