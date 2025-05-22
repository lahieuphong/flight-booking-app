import React, { useState, useEffect } from 'react';
import '../styles/Booking.css'; 
import { useNavigate } from 'react-router-dom';
import BookingFeaturedFlights from './BookingFeaturedFlights'; 

const Booking = () => {
  const [departure_airport, setDepartureAirport] = useState('');
  const [departure_airport_code, setDepartureAirportCode] = useState('');
  const [arrival_airport, setArrivalAirport] = useState('');
  const [arrival_airport_code, setArrivalAirportCode] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [tripType, setTripType] = useState('one-way');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [airports, setAirports] = useState([]);

  const navigate = useNavigate();

  // Lấy danh sách sân bay từ API
  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/airports');
        const data = await response.json();
        setAirports(data);
      } catch (error) {
        console.error('Error fetching airports:', error);
      }
    };

    fetchAirports();
  }, []);

  // Xử lý thay đổi điểm đi
  const handleDepartureChange = (e) => {
    const selectedCode = e.target.value;
    const selectedAirport = e.target.options[e.target.selectedIndex].getAttribute('data-name');

    setDepartureAirport(selectedAirport);
    setDepartureAirportCode(selectedCode);

    // Nếu điểm đi trùng điểm đến, reset điểm đến
    if (selectedAirport === arrival_airport) {
      setArrivalAirport('');
      setArrivalAirportCode('');
    }
  };

  // Xử lý thay đổi điểm đến
  const handleArrivalChange = (e) => {
    const selectedCode = e.target.value;
    const selectedAirport = e.target.options[e.target.selectedIndex].getAttribute('data-name');

    setArrivalAirport(selectedAirport);
    setArrivalAirportCode(selectedCode);

    // Nếu điểm đến trùng điểm đi, reset điểm đi
    if (selectedAirport === departure_airport) {
      setDepartureAirport('');
      setDepartureAirportCode('');
    }
  };

  // Hàm kiểm tra ngày hợp lệ: ngày đi phải là ngày hôm nay hoặc sau, ngày về phải sau ngày đi
  const isValidDates = () => {
    if (!departureDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const depDate = new Date(departureDate);
    depDate.setHours(0, 0, 0, 0);

    if (depDate < today) return false; // Ngày đi không được trước hôm nay

    if (tripType === 'round-trip') {
      if (!returnDate) return false;
      const retDate = new Date(returnDate);
      retDate.setHours(0, 0, 0, 0);
      if (retDate <= depDate) return false; // Ngày về phải sau ngày đi
    }

    return true;
  };

  // Xử lý tìm kiếm
  const handleSearch = async () => {
    // Kiểm tra nhập liệu bắt buộc
    if (!departure_airport || !arrival_airport) {
      alert('Vui lòng chọn điểm đi và điểm đến!');
      return;
    }

    if (!isValidDates()) {
      alert('Vui lòng chọn ngày đi và ngày về hợp lệ!\nNgày đi phải là hôm nay hoặc sau hôm nay.\nNgày về phải sau ngày đi.');
      return;
    }

    if (infants > adults) {
      alert('Số em bé không được vượt quá số người lớn!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departure_airport, arrival_airport }),
      });

      const result = await response.json();

      if (result.success) {
        navigate('/booking/flight-result', {
          state: {
            departure_airport,
            departure_airport_code,
            arrival_airport,
            arrival_airport_code,
            departureDate,
            returnDate,
            tripType,
            adults,
            children,
            infants,
          },
        });
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error);
      alert('Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại!');
    }
  };

  return (
    <div className="booking-container">
      {/* Chọn hành trình */}
      <div className="booking-box">
        <h3>1. Chọn hành trình</h3>

        <h4>Điểm đi:</h4>
        <select value={departure_airport_code} onChange={handleDepartureChange}>
          <option value="">Chọn điểm đi...</option>
          {airports
            .filter((airport) => airport.name !== arrival_airport)
            .map((airport) => (
              <option key={airport.id} value={airport.code} data-name={airport.name}>
                {airport.name} ({airport.code})
              </option>
            ))}
        </select>

        <h4>Điểm đến:</h4>
        <select value={arrival_airport_code} onChange={handleArrivalChange}>
          <option value="">Chọn điểm đến...</option>
          {airports
            .filter((airport) => airport.name !== departure_airport)
            .map((airport) => (
              <option key={airport.id} value={airport.code} data-name={airport.name}>
                {airport.name} ({airport.code})
              </option>
            ))}
        </select>
      </div>

      {/* Chọn ngày bay */}
      <div className="booking-box">
        <h3>2. Chọn ngày bay</h3>

        <h4>Ngày đi:</h4>
        <input
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]} // Ngày đi không thể chọn trước hôm nay
        />

        <h4>Ngày về:</h4>
        <input
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          disabled={tripType === 'one-way'}
          min={departureDate || new Date().toISOString().split('T')[0]} // Ngày về phải sau ngày đi
        />

        <div className="trip-type-container">
          <label className="trip-type-option">
            <input
              type="radio"
              id="one-way"
              name="tripType"
              value="one-way"
              checked={tripType === 'one-way'}
              onChange={() => {
                setTripType('one-way');
                setReturnDate(''); // reset ngày về khi chuyển về một chiều
              }}
            />
            <label htmlFor="one-way">Một chiều</label>
          </label>

          <label className="trip-type-option">
            <input
              type="radio"
              id="round-trip"
              name="tripType"
              value="round-trip"
              checked={tripType === 'round-trip'}
              onChange={() => setTripType('round-trip')}
            />
            <label htmlFor="round-trip">Hai chiều</label>
          </label>
        </div>
      </div>

      {/* Chọn hành khách */}
      <div className="booking-box">
        <h3>3. Chọn hành khách</h3>

        <div className="passenger-box">
          <div className="passenger-row">
            <span className="passenger-label">Người lớn:</span>
            <div className="passenger-controls">
              <button onClick={() => setAdults(adults > 1 ? adults - 1 : 1)}>−</button>
              <span className="passenger-count">{adults}</span>
              <button onClick={() => setAdults(adults + 1)}>+</button>
            </div>
          </div>

          <div className="passenger-row">
            <span className="passenger-label">Trẻ em:</span>
            <div className="passenger-controls">
              <button onClick={() => setChildren(children > 0 ? children - 1 : 0)}>−</button>
              <span className="passenger-count">{children}</span>
              <button onClick={() => setChildren(children + 1)}>+</button>
            </div>
          </div>

          <div className="passenger-row">
            <span className="passenger-label">Em bé:</span>
            <div className="passenger-controls">
              <button onClick={() => setInfants(infants > 0 ? infants - 1 : 0)}>−</button>
              <span className="passenger-count">{infants}</span>
              <button
                onClick={() => {
                  if (infants < adults) setInfants(infants + 1);
                }}
                disabled={infants >= adults}
                title={infants >= adults ? 'Em bé không được vượt quá người lớn' : ''}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Nút Tìm kiếm */}
        <button className="booking-btn" onClick={handleSearch}>
          Tìm kiếm
        </button>
      </div>

      <div className="booking-details">
        {/* Ưu đãi và lợi ích */}
        <div className="offers-container">
          <h3>Tại sao chọn dịch vụ của chúng tôi?</h3>
          <ul className="offer-list">
            <li>
              <strong>Bảo đảm dịch vụ toàn diện:</strong> Giá vé được đảm bảo theo thanh toán đã xác nhận.
            </li>
            <li>
              <strong>Thanh toán bảo mật:</strong> Hệ thống đặt chỗ và thanh toán tiện lợi và uy tín.
            </li>
            <li>
              <strong>Tìm kiếm và thanh toán dễ dàng:</strong> So sánh và đặt vé nhanh chóng giữa các hãng bay.
            </li>
            <li>
              <strong>Đảm bảo giá vé rẻ nhất:</strong> Bay khắp mọi nơi với giá cực rẻ.
            </li>
          </ul>
        </div>

        {/* Chuyến bay nổi bật */}
        <div className="offers-container">
          <BookingFeaturedFlights />
        </div>
      </div>
    </div>
  );
};

export default Booking;