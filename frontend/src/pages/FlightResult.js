import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/FlightResult.css';
import FlightResultInfo from './FlightResultInfo';

const FlightResult = () => {
  const location = useLocation();

  // ✅ Lấy dữ liệu từ location.state
  const {
    departure_airport,  
    departure_airport_code, 
    arrival_airport,   
    arrival_airport_code,  
    departureDate,
    returnDate,
    tripType,
    adults: initialAdults,
    children: initialChildren, 
    infants: initialInfants
  } = location.state || {};

  // ✅ Khởi tạo state
  const [adults, setAdults] = useState(initialAdults || 1);
  const [numChildren, setNumChildren] = useState(initialChildren || 0); 
  const [infants, setInfants] = useState(initialInfants || 0);

  if (!departure_airport || !arrival_airport) {
    return (
      <div className="flight-result-container">
        <h2>Kết quả tìm kiếm chuyến bay</h2>
        <p>Không có dữ liệu hiển thị!</p>
      </div>
    );
  }

  return (
    <div className="flight-result-container">
      <h2>Kết quả tìm kiếm chuyến bay</h2>

      {/* ✅ FlightResultInfo */}
        <FlightResultInfo
          departure_airport={departure_airport}  
          departure_airport_code={departure_airport_code}  
          arrival_airport={arrival_airport}      
          arrival_airport_code={arrival_airport_code}  
          departureDate={departureDate}
          returnDate={returnDate}
          tripType={tripType}
          adults={adults}
          setAdults={setAdults}
          childCount={numChildren} 
          setChildCount={setNumChildren} 
          infants={infants}
          setInfants={setInfants}
        />
    </div>
  );
};

export default FlightResult;
