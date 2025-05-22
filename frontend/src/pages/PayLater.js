import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/PayLater.css';

const PayLater = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy dữ liệu từ location.state nếu có
  const {
    selectedFlight,
    returnFlight,
    departureDate,
    returnDate,
    tripType,
    voucherDiscount = 0,
    adults = 1,
    childCount = 0,
    infants = 0,
  } = location.state || {}; 

  const [contactInfo, setContactInfo] = useState(null);

  // Fetch contact info from localStorage
  useEffect(() => {
    const savedContactInfo = localStorage.getItem('contactInfo');
    if (savedContactInfo) {
      setContactInfo(JSON.parse(savedContactInfo));
    }
  }, []);

  // Format today date
  const formatDate = (dateString) => {
    const daysOfWeek = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];
    const monthsOfYear = [
      '01', '02', '03', '04', '05', '06',
      '07', '08', '09', '10', '11', '12'
    ];

    const date = new Date(dateString);
    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate();
    const month = monthsOfYear[date.getMonth()];
    const year = date.getFullYear();

    return `${dayOfWeek}, ${day < 10 ? '0' + day : day}/${month}/${year}`;
  };

  // Format time
  const formatTime = (timeString) => {
    const time = new Date(`1970-01-01T${timeString}Z`);
    const hours = time.getHours();
    const minutes = time.getMinutes();
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };

  // Format duration (e.g., "02:05:00" to "2 giờ 5 phút")
  const formatDuration = (duration) => {
    const [hours, minutes] = duration.split(":");
    let result = "";
    if (hours && hours !== "00") {
      result += `${parseInt(hours)} giờ `;
    }
    if (minutes && minutes !== "00") {
      result += `${parseInt(minutes)} phút`;
    }
    return result.trim();
  };

  // Format currency
  const formatCurrency = (num) => `${Number(num).toLocaleString('vi-VN')} VND`;

  // Get today's date
  const today = new Date();
  const todayFormatted = formatDate(today);

  // Calculate the flight cost
  const calcFlightCost = (flight) => {
    const additional = Number(flight.additional_price);
    const taxRate = Number(flight.tax);

    const baseAdult = adults * (Number(flight.price_adult) + additional);
    const baseChild = childCount * (Number(flight.price_child) + additional);
    const baseInfant = infants * (Number(flight.price_infant) + additional);

    const totalBase = baseAdult + baseChild + baseInfant;
    const totalTax = totalBase * taxRate;

    return {
      totalBase,
      totalTax,
      total: totalBase + totalTax,
    };
  };

  const go = selectedFlight ? calcFlightCost(selectedFlight) : { total: 0 };
  const back = returnFlight ? calcFlightCost(returnFlight) : { total: 0 };

  const goDiscount = go.total * (voucherDiscount / 100);
  const backDiscount = back.total * (voucherDiscount / 100);

  const subtotalGo = go.total;
  const subtotalBack = tripType === 'round-trip' ? back.total : 0;
  const subtotal = subtotalGo + subtotalBack;

  const serviceFee = 540000;
  const grandTotal = subtotal - (goDiscount + backDiscount) + serviceFee;

  return (
    <div className="pay-later-page">

      {/* DIV1 */}
      <div className="pay-later-header">
        <img
          src="/images/cute-little-bunny.png"
          alt="Cute Bunny"
          className="pay-later-icon"
        />
        <div className="pay-later-text">
          <h1>ĐẶT VÉ THÀNH CÔNG - THANH TOÁN SAU</h1>
          <p>Mã đặt chỗ của bạn sẽ được giữ trong vòng <strong>06 giờ</strong></p>
          <p>Mã đặt chỗ sẽ bị huỷ nếu không thanh toán.</p>
          <p>{todayFormatted}, {formatTime(selectedFlight?.departure_time)} (GMT +7)</p>
        </div>
      </div>

      {/* DIV2 */}
      <h3 className="booking-title">Thông tin đặt chỗ</h3>
      <div className="booking-info">
        <div className="qr-wrapper">
          <img
            src="/images/qr.png"
            alt="QR Code"
            className="qr-code"
          />
        </div>

        <div className="booking-details">
          <p>
            <strong>Chuyến đi:</strong> <span className="flight-number">{selectedFlight?.flight_number}</span>
            {tripType === 'round-trip' && returnFlight && (
              <span> | <strong>Chuyến về:</strong> <span className="flight-number">{returnFlight?.flight_number}</span></span>
            )}
          </p>

          <div className="detail-row">
            <div className="label-column">
              <p>Họ và tên</p>
              <p>Số điện thoại</p>
              <p>Email</p>
              <p>Địa chỉ</p>
            </div>

            <div className="value-column">
              <p>{contactInfo?.name}</p>
              <p>{contactInfo?.phone}</p>
              <p>{contactInfo?.email}</p>
              <p>{contactInfo?.address}</p>
            </div>
          </div>

          <hr className="divider" />

          <div className="total-line">
            <span>Tổng cộng</span>
            <span className="total-amount">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* DIV3 */}
      <h3 className="booking-title">Thông tin chuyến bay</h3>
      <div className="flight-info">

        {/* Chuyến bay đi */}
        {selectedFlight ? (
          <div className="flight-card">
            <div className="flight-header">Chuyến bay đi</div>
            <div className="flight-body">
              <div className="left-info">
                <div className="flight-date">{formatDate(departureDate)}</div>
                <div className="flight-times">
                  <div className="airport-block">
                    <h2>{selectedFlight?.departure_airport_code}</h2>
                    <p>{formatTime(selectedFlight?.departure_time)}</p>
                  </div>
                  <div className="duration-block">
                    <p>{formatDuration(selectedFlight?.duration)}</p>
                    <span className="plane-icon">✈</span>
                    <p>Chuyến bay thẳng</p>
                  </div>
                  <div className="airport-block">
                    <h2>{selectedFlight?.arrival_airport_code}</h2>
                    <p>{formatTime(selectedFlight?.arrival_time)}</p>
                  </div>
                </div>
              </div>

              <div className="divider" />

              <div className="right-info">
                <img src="/images/eco-icon.png" alt="eco" className="class-logo" />
                <p>{adults + childCount + infants} hành khách</p>
                <p className="price">
                  {formatCurrency(subtotalGo - (goDiscount + backDiscount))}
                </p>
                <p className="fee-disclaimer">
                  (Chưa tính phí dịch vụ)
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p>Không có thông tin chuyến bay đi.</p>
        )}

        {/* Chuyến bay về */}
        {tripType === 'round-trip' && returnFlight ? (
          <div className="flight-card">
            <div className="flight-header">Chuyến bay về</div>
            <div className="flight-body">
              <div className="left-info">
                <div className="flight-date">{formatDate(returnDate)}</div>
                <div className="flight-times">
                  <div className="airport-block">
                    <h2>{returnFlight?.departure_airport_code}</h2>
                    <p>{formatTime(returnFlight?.departure_time)}</p>
                  </div>
                  <div className="duration-block">
                    <p>{formatDuration(returnFlight?.duration)}</p>
                    <span className="plane-icon">✈</span>
                    <p>Chuyến bay thẳng</p>
                  </div>
                  <div className="airport-block">
                    <h2>{returnFlight?.arrival_airport_code}</h2>
                    <p>{formatTime(returnFlight?.arrival_time)}</p>
                  </div>
                </div>
              </div>

              <div className="divider" />

              <div className="right-info">
                <img src="/images/eco-icon.png" alt="eco" className="class-logo" />
                <p>{adults + childCount + infants} hành khách</p>
                <p className="price">
                  {formatCurrency(subtotalBack - (goDiscount + backDiscount))}
                </p>
                <p className="fee-disclaimer">
                  (Chưa tính phí dịch vụ)
                </p>
              </div>
            </div>
          </div>
        ) : (
          tripType === 'round-trip' && <p>Không có thông tin chuyến bay về.</p>
        )}
      </div>

      {/* Quay lại trang chủ */}
      <button className="go-back-button" onClick={() => navigate('/')}>← Trang chủ</button>
    </div>
  );
};

export default PayLater;