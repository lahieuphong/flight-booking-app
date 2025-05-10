










// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import PropTypes from 'prop-types';
// import '../styles/FlightResult_Info.css';
// import '../styles/FlightResult_List.css';
// import FlightResult_List from './FlightResult_List';

// import FilterAirlines from './FilterAirlines';
// import FilterAircraft from './FilterAircraft';
// import '../styles/FilterAirlines_FilterAirlines.css';

// import FilterPrice from './FilterPrice';

// const FlightResult_Info = ({
//   departure_airport,
//   departure_airport_code,
//   arrival_airport,
//   arrival_airport_code,
//   departureDate,
//   returnDate,
//   tripType,
//   adults,
//   setAdults,
//   childCount,
//   setChildCount,
//   infants,
//   setInfants,
// }) => {
//   const [showDetails, setShowDetails] = useState(false);
//   const [flights, setFlights] = useState([]);
  
//   // ✅ Lấy dữ liệu chuyến bay từ API
//   useEffect(() => {
//     const fetchFlights = async () => {
//       try {
//         const response = await axios.get('http://localhost:5001/api/results/flights');
//         console.log('Data fetched:', response.data);
//         setFlights(response.data || []);
//       } catch (error) {
//         console.error('Error fetching flight data:', error);
//       }
//     };

//     fetchFlights();
//   }, []);

  

//   const [selectedAirlines, setSelectedAirlines] = useState([]);
//   const [selectedAircrafts, setSelectedAircrafts] = useState([]);

//   const [selectedPrice, setSelectedPrice] = useState(0);
  
//   // ✅ Lọc các chuyến bay khớp với điểm đi, điểm đến và hãng hàng không đã chọn
//   const filteredFlights = flights.filter(
//     (flight) =>
//       flight.departure_airport === departure_airport &&
//       flight.arrival_airport === arrival_airport &&
//       (selectedAirlines.length === 0 || selectedAirlines.includes(flight.airline_name)) &&
//       (selectedAircrafts.length === 0 || selectedAircrafts.includes(flight.aircraft_type)) &&
//       flight.price <= selectedPrice
//   );
  

//   // ✅ Định dạng ngày từ YYYY-MM-DD → DD/MM/YYYY
//   const formatDate = (date) =>
//     date ? new Date(date).toLocaleDateString('vi-VN') : '';

//   // ✅ Toggle mở/đóng chi tiết hành khách
//   const toggleDetails = () => setShowDetails(!showDetails);

  // const [selectedFlight, setSelectedFlight] = useState(null);

  // // ✅ Lấy thông tin chi tiết khi nhấn nút "Chọn"
  // const handleSelectFlight = async (flightNumber) => {
  //   if (selectedFlight && selectedFlight.flight_number === flightNumber) {
  //     setSelectedFlight(null); // Bỏ chọn nếu chuyến bay đã được chọn
  //     return;
  //   }

  //   try {
  //     const res = await fetch(`http://localhost:5001/api/prices/${flightNumber}`);
  //     if (!res.ok) throw new Error('Không tìm thấy chuyến bay');
  //     const data = await res.json();
  //     setSelectedFlight(data);
  //   } catch (err) {
  //     console.error('Error fetching flight details:', err);
  //     alert('Không tìm thấy chuyến bay hoặc lỗi kết nối');
  //   }
  // };

//   return (
//     <>
//       <div className="flight-result-info-container">

//         {/* ✅ Thông tin chuyến bay */}
//         <div className="flight-info-group">
//           <span className="flight-info-item">
//             <strong>Điểm đi:</strong> {departure_airport} ({departure_airport_code})
//           </span>
//           <span className="flight-info-item">
//             <strong>Điểm đến:</strong> {arrival_airport} ({arrival_airport_code})
//           </span>
//           <span className="flight-info-item">
//             <strong>Ngày đi:</strong> {formatDate(departureDate)}
//           </span>
//           {tripType === 'round-trip' && (
//             <span className="flight-info-item">
//               <strong>Ngày về:</strong> {formatDate(returnDate)}
//             </span>
//           )}
//           <span className="flight-info-item">
//             <strong>Loại vé:</strong> {tripType === 'one-way' ? 'Một chiều' : 'Khứ hồi'}
//           </span>
//         </div>

//         {/* ✅ Toggle mở/đóng chi tiết vé */}
//         <span
//           className={`flight-info-item summary-box ${showDetails ? 'active' : ''}`}
//           role="button"
//           tabIndex={0}
//           onClick={toggleDetails}
//           onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleDetails()}
//         >
//           <strong>Tổng số vé:</strong> {adults} Người lớn, {childCount} Trẻ em, {infants} Em bé
//           <span className={`arrow-icon ${showDetails ? 'open' : ''}`}>
//             {showDetails ? '▲' : '▼'}
//           </span>
//         </span>

//         {/* ✅ Hiển thị số lượng hành khách */}
//         {showDetails && (
//           <div className="passenger-box">
//             <PassengerRow label="Người lớn" count={adults} setCount={setAdults} min={1} />
//             <PassengerRow label="Trẻ em" count={childCount} setCount={setChildCount} min={0} />
//             <PassengerRow label="Em bé" count={infants} setCount={setInfants} min={0} />
//           </div>
//         )}
//       </div>
      
//       <div className="flight-result-list-container">
//         <div className="filter-wrapper">
//           {/* Bộ lọc Hãng hàng không */}
//           <FilterAirlines onFilterChange={setSelectedAirlines} />

//           {/* Bộ lọc Loại máy bay */}
//           <FilterAircraft onFilterChange={setSelectedAircrafts} />

//           {/* Bộ lọc Giá vé */}
//           <FilterPrice onFilterChange={setSelectedPrice} />
//         </div>

//         {/* ✅ Danh sách chuyến bay */}
//         <div className="flight-list-container">
//           {filteredFlights.length > 0 ? (
//             filteredFlights.map((flight) => (
//               <div key={flight.flight_number} className="flight-item">
//                 <div className="flight-list">
                
//                   <div className="airline-logo-wrapper">
//                     <img 
//                       src={`/images/${flight.airline_logo}`} 
//                       alt={flight.airline_name} 
//                       className="airline-logo"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = `/images/placeholder.png`;
//                       }}
//                     />
//                   </div>

//                   <div className="flight-info">
//                     <div className="flight-details">
//                       <span className="airline-name">{flight.airline_name}</span>
//                       <span>{flight.flight_number} | {flight.aircraft_type}</span>
//                     </div>
//                     <div className="flight-time">
//                       <span className="departure-time">{flight.departure_time || 'N/A'}</span>
//                       <span className="duration">{flight.duration || 'N/A'}</span>
//                       <span className="arrival-time">{flight.arrival_time || 'N/A'}</span>
//                     </div>
//                     <div className="flight-route">
//                       {flight.departure_airport_code} → {flight.arrival_airport_code}
//                     </div>
//                   </div>

//                   <div className="flight-price-wrapper">
//                     <span className="price">
//                       {flight.price && !isNaN(flight.price)
//                         ? `${Number(flight.price).toLocaleString()} VND`
//                         : 'N/A'}
//                     </span>

//                     <button
//                       className="choose-btn"
//                       onClick={() => handleSelectFlight(flight.flight_number)}
//                     >
//                       {selectedFlight && selectedFlight.flight_number === flight.flight_number
//                         ? 'Bỏ Chọn'
//                         : 'Chọn'}
//                     </button>
//                   </div>

//                 </div>


                // {selectedFlight?.flight_number === flight.flight_number && (
                //   <div className="selected-flight">
                //     <h2>Chi tiết chuyến bay</h2>
                //     <div className="flight-card">
                //       <img
                //         src={`/images/${selectedFlight.airline_logo}`}
                //         alt={selectedFlight.airline_name}
                //         className="airline-logo"
                //         onError={(e) => {
                //           e.target.onerror = null;
                //           e.target.src = `/images/placeholder.png`;
                //         }}
                //       />
                //       <h3>
                //         {selectedFlight.airline_name} ({selectedFlight.flight_number})
                //       </h3>
                //       <p>
                //         ✈️ {selectedFlight.departure_airport} ({selectedFlight.departure_airport_code}) → {selectedFlight.arrival_airport} ({selectedFlight.arrival_airport_code})
                //       </p>
                //       <p>🕒 {selectedFlight.departure_time} → {selectedFlight.arrival_time} ({selectedFlight.duration})</p>
                //       <p>💺 Còn lại: {selectedFlight.remaining_seats}</p>
                //       <p>💲 Phụ phí: {Number(selectedFlight.additional_price).toLocaleString('vi-VN')} VND</p>
                //       <p>
                //         💰 Giá vé người lớn: {selectedFlight.price_adult 
                //           ? `${Number(selectedFlight.price_adult).toLocaleString()} VND` 
                //           : 'Không khả dụng'}
                //       </p>
                //       <p>
                //         👶 Giá vé trẻ em: {selectedFlight.price_child 
                //           ? `${Number(selectedFlight.price_child).toLocaleString()} VND` 
                //           : 'Không khả dụng'}
                //       </p>
                //       <p>
                //         🍼 Giá vé em bé: {selectedFlight.price_infant 
                //           ? `${Number(selectedFlight.price_infant).toLocaleString()} VND` 
                //           : 'Không khả dụng'}
                //       </p>
                //       <p>
                //         🧾 Thuế: {selectedFlight.tax 
                //           ? `${(Number(selectedFlight.tax) * 100).toFixed(0)}%` 
                //           : 'Không khả dụng'}
                //       </p>
                //       <p>👤 Người lớn: {adults}</p>
                //       <p>🧒 Trẻ em: {childCount}</p>
                //       <p>👶 Em bé: {infants}</p>
                //       <p>Ngày đi: {formatDate(departureDate)}</p>
                //       {tripType === 'round-trip' && (
                //         <p>Ngày về: {formatDate(returnDate)}</p>
                //       )}

                //       {/* ✅ Tính tổng tiền người lớn */}
                //       {selectedFlight.price_adult && (
                //         <p>
                //           🧑 Tổng số tiền người lớn:{" "}
                //           {(
                //             (Number(selectedFlight.price_adult) + Number(selectedFlight.additional_price)) * adults +
                //             (Number(selectedFlight.price_adult) + Number(selectedFlight.additional_price)) * adults * Number(selectedFlight.tax)
                //           ).toLocaleString('vi-VN')} VND
                //         </p>
                //       )}

                //       {/* ✅ Tính tổng tiền trẻ em */}
                //       {selectedFlight.price_child && (
                //         <p>
                //           🧒 Tổng số tiền trẻ em:{" "}
                //           {childCount > 0 
                //             ? (
                //                 (Number(selectedFlight.price_child) + Number(selectedFlight.additional_price)) * childCount +
                //                 (Number(selectedFlight.price_child) + Number(selectedFlight.additional_price)) * childCount * Number(selectedFlight.tax)
                //               ).toLocaleString('vi-VN') 
                //             : (
                //                 (Number(selectedFlight.price_child) + Number(selectedFlight.additional_price)) +
                //                 (Number(selectedFlight.price_child) + Number(selectedFlight.additional_price)) * Number(selectedFlight.tax)
                //               ).toLocaleString('vi-VN')
                //           } VND
                //         </p>
                //       )}

                //       {/* ✅ Tính tổng tiền em bé */}
                //       {selectedFlight.price_infant && (
                //         <p>
                //           👶 Tổng số tiền em bé:{" "}
                //           {infants > 0 
                //             ? (
                //                 (Number(selectedFlight.price_infant) + Number(selectedFlight.additional_price)) * infants +
                //                 (Number(selectedFlight.price_infant) + Number(selectedFlight.additional_price)) * infants * Number(selectedFlight.tax)
                //               ).toLocaleString('vi-VN') 
                //             : (
                //                 (Number(selectedFlight.price_infant) + Number(selectedFlight.additional_price)) +
                //                 (Number(selectedFlight.price_infant) + Number(selectedFlight.additional_price)) * Number(selectedFlight.tax)
                //               ).toLocaleString('vi-VN')
                //           } VND
                //         </p>
                //       )}

                //       {/* ✅ Tính tổng cộng */}
                //       <p>
                //         💵 **Tổng số tiền:**{" "}
                //         {(
                //           (Number(selectedFlight.price_adult) + Number(selectedFlight.additional_price)) * adults +
                //           (Number(selectedFlight.price_adult) + Number(selectedFlight.additional_price)) * adults * Number(selectedFlight.tax) +
                          
                //           (Number(selectedFlight.price_child) + Number(selectedFlight.additional_price)) * (childCount > 0 ? childCount : 1) +
                //           (Number(selectedFlight.price_child) + Number(selectedFlight.additional_price)) * (childCount > 0 ? childCount : 1) * Number(selectedFlight.tax) +
                          
                //           (Number(selectedFlight.price_infant) + Number(selectedFlight.additional_price)) * (infants > 0 ? infants : 1) +
                //           (Number(selectedFlight.price_infant) + Number(selectedFlight.additional_price)) * (infants > 0 ? infants : 1) * Number(selectedFlight.tax)
                //         ).toLocaleString('vi-VN')} VND
                //       </p>
                //     </div>
                //   </div>
                // )}

//               </div>

//             ))
//           ) : (
//             <p>Không tìm thấy chuyến bay nào!</p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// // ✅ Component số lượng hành khách
// const PassengerRow = ({ label, count, setCount, min }) => (
//   <div className="passenger-row">
//     <span className="passenger-label">{label}:</span>
//     <div className="passenger-controls">
//       <button
//         onClick={() => setCount(count - 1)}
//         disabled={count <= min}
//         className="control-btn"
//       >
//         -
//       </button>
//       <span className="passenger-count">{count}</span>
//       <button onClick={() => setCount(count + 1)} className="control-btn">
//         +
//       </button>
//     </div>
//   </div>
// );

// PassengerRow.propTypes = {
//   label: PropTypes.string.isRequired,
//   count: PropTypes.number.isRequired,
//   setCount: PropTypes.func.isRequired,
//   min: PropTypes.number.isRequired,
// };

// // ✅ Kiểm tra prop truyền vào
// FlightResult_Info.propTypes = {
//   departure_airport: PropTypes.string.isRequired,
//   departure_airport_code: PropTypes.string.isRequired,
//   arrival_airport: PropTypes.string.isRequired,
//   arrival_airport_code: PropTypes.string.isRequired,
//   departureDate: PropTypes.string.isRequired,
//   returnDate: PropTypes.string,
//   tripType: PropTypes.oneOf(['one-way', 'round-trip']).isRequired,
//   adults: PropTypes.number.isRequired,
//   setAdults: PropTypes.func.isRequired,
//   childCount: PropTypes.number.isRequired,
//   setChildCount: PropTypes.func.isRequired,
//   infants: PropTypes.number.isRequired,
//   setInfants: PropTypes.func.isRequired,
// };

// FlightResult_List.propTypes = {
//   filteredFlights: PropTypes.arrayOf(
//     PropTypes.shape({
//       flight_number: PropTypes.string.isRequired,
//       airline_logo: PropTypes.string.isRequired,
//       airline_name: PropTypes.string.isRequired,
//       aircraft_type: PropTypes.string.isRequired,
//       departure_time: PropTypes.string,
//       arrival_time: PropTypes.string,
//       duration: PropTypes.string,
//       departure_airport: PropTypes.string.isRequired,
//       departure_airport_code: PropTypes.string.isRequired,
//       arrival_airport: PropTypes.string.isRequired,
//       arrival_airport_code: PropTypes.string.isRequired,
//       base_price: PropTypes.number,
//     })
//   ).isRequired,
// };

// export default FlightResult_Info;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../styles/FlightResult_Info.css';
// import '../styles/FlightResult_List.css';
import FlightResult_List from './FlightResult_List';

import FilterAirlines from './FilterAirlines';
import FilterAircraft from './FilterAircraft';
import FilterPrice from './FilterPrice';
import '../styles/FilterComponents.css';

import { useNavigate } from 'react-router-dom';

const FlightResult_Info = ({
  departure_airport,
  departure_airport_code,
  arrival_airport,
  arrival_airport_code,
  departureDate,
  returnDate,
  tripType,
  adults,
  setAdults,
  childCount,
  setChildCount,
  infants,
  setInfants,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [flights, setFlights] = useState([]);
  const navigate = useNavigate();

  // Lấy dữ liệu chuyến bay từ API
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/results/flights');
        console.log('Data fetched:', response.data);
        setFlights(response.data || []);
      } catch (error) {
        console.error('Error fetching flight data:', error);
      }
    };

    fetchFlights();
  }, []);

  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedAircrafts, setSelectedAircrafts] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(0);

  // Lọc các chuyến bay khớp với điểm đ i, điểm đến và các bộ lọc
  const filteredFlights = flights.filter(
    (flight) =>
      flight.departure_airport_name === departure_airport &&
      flight.arrival_airport_name === arrival_airport &&
      (selectedAirlines.length === 0 || selectedAirlines.includes(flight.airline_name)) &&
      (selectedAircrafts.length === 0 || selectedAircrafts.includes(flight.aircraft_type)) &&
      (selectedPrice === 0 || parseFloat(flight.price) <= selectedPrice)
  );

  const returnFlights = flights.filter(
    (flight) =>
      flight.departure_airport_name === arrival_airport &&
      flight.arrival_airport_name === departure_airport
  );
  
  
  // Định dạng ngày từ YYYY-MM-DD → DD/MM/YYYY
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString('vi-VN') : '';

  // Toggle mở/đóng chi tiết hành khách
  const toggleDetails = () => setShowDetails(!showDetails);

  // Tạo 2 trạng thái riêng biệt cho chuyến bay một chiều và khứ hồi
  const [selectedOneWayFlight, setSelectedOneWayFlight] = useState(null);
  const [selectedRoundTripFlight, setSelectedRoundTripFlight] = useState(null);  // Đảm bảo chỉ khai báo một lần



  // Lấy thông tin chi tiết khi nhấn nút "Chọn"
  const handleSelectFlight = async (flightNumber, tripType) => {
    const flight = filteredFlights.find((f) => f.flight_number === flightNumber);
  
    if (tripType === 'one-way') {
      if (selectedOneWayFlight && selectedOneWayFlight.flight_number === flightNumber) {
        setSelectedOneWayFlight(null);
      } else {
        setSelectedOneWayFlight(flight);
      }
    } else if (tripType === 'round-trip') {
      if (selectedRoundTripFlight && selectedRoundTripFlight.flight_number === flightNumber) {
        setSelectedRoundTripFlight(null);
      } else {
        setSelectedRoundTripFlight(flight);
      }
    }
  };
  
  const handleSelectRoundTripFlight = (flightNumber) => {
    const flight = returnFlights.find((f) => f.flight_number === flightNumber); // <-- Sửa chỗ này
    setSelectedRoundTripFlight(flight);
  };
  

  return (
    <>
      <div className="flight-summary-container">
        <div className="flight-info-container">
          {/* Thông tin chuyến bay */}
          <div className="flight-info-group">
            <span className="flight-info-item">
              <strong>Điểm đi:</strong> {departure_airport} ({departure_airport_code})
            </span>
            <span className="flight-info-item">
              <strong>Điểm đến:</strong> {arrival_airport} ({arrival_airport_code})
            </span>
            <span className="flight-info-item">
              <strong>Ngày đi:</strong> {formatDate(departureDate)}
            </span>
            {tripType === 'round-trip' && (
              <span className="flight-info-item">
                <strong>Ngày về:</strong> {formatDate(returnDate)}
              </span>
            )}
            <span className="flight-info-item">
              <strong>Loại vé:</strong> {tripType === 'one-way' ? 'Một chiều' : 'Khứ hồi'}
            </span>
          </div>
          
          {/* Toggle mở/đóng chi tiết vé */}
          <span
            className={`flight-info-item summary-box ${showDetails ? 'active' : ''}`}
            role="button"
            tabIndex={0}
            onClick={toggleDetails}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleDetails()}
          >
            <strong>Tổng số vé</strong> : {adults} Người lớn, {childCount} Trẻ em, {infants} Em bé
            <span className={`arrow-icon ${showDetails ? 'open' : ''}`}>
              {showDetails ? '▲' : '▼'}
            </span>
          </span>

          {/* Hiển thị số lượng hành khách */}
          {showDetails && (
            <div className={`passenger-box ${showDetails ? 'show' : ''}`}>
              <PassengerRow label="Người lớn" count={adults} setCount={setAdults} min={1} />
              <PassengerRow label="Trẻ em" count={childCount} setCount={setChildCount} min={0} />
              <PassengerRow label="Em bé" count={infants} setCount={setInfants} min={0} />
            </div>
          )}
        </div>
      </div> 
      
      <div className="flight-summary-container">
        <div className="filter-wrapper">
          {/* Bộ lọc Hãng hàng không */}
          <FilterAirlines onFilterChange={setSelectedAirlines} />
          {/* Bộ lọc Loại máy bay */}
          <FilterAircraft onFilterChange={setSelectedAircrafts} />
          {/* Bộ lọc Giá vé */}
          <FilterPrice onFilterChange={setSelectedPrice} />
        </div>

        <div className="filter-flight">
          {/* Header loại chuyến bay */}
          <div className="flight-type">
            {tripType === 'round-trip' ? (
              <>
                <h2>
                  Chuyến bay khứ hồi{' '}
                  {filteredFlights[0]?.departure_airport_name || 'Chưa có thông tin'} (
                  {filteredFlights[0]?.departure_airport_code || 'XX'}) →{' '}
                  {filteredFlights[0]?.arrival_airport_name || 'Chưa có thông tin'} (
                  {filteredFlights[0]?.arrival_airport_code || 'XX'})
                </h2>
                <h3>
                  Ngày đi: {formatDate(departureDate)} | Ngày về: {formatDate(returnDate)} | Tổng số vé: {adults + childCount + infants}
                </h3>
              </>
            ) : (
              <>
                <h2>
                  Chuyến bay một chiều{' '}
                  {filteredFlights[0]?.departure_airport_name || 'Chưa có thông tin'} (
                  {filteredFlights[0]?.departure_airport_code || 'XX'}) →{' '}
                  {filteredFlights[0]?.arrival_airport_name || 'Chưa có thông tin'} (
                  {filteredFlights[0]?.arrival_airport_code || 'XX'})
                </h2>
                <h3>
                  Ngày đi: {formatDate(departureDate)} | Tổng số vé: {adults + childCount + infants}
                </h3>
              </>
            )}
          </div>


          {/* Chuyến bay chiều đi */}
          <h4 className="flight-choice">Chọn chuyến bay chiều đi</h4>
          <FlightResult_List
            flights={filteredFlights}
            setFlights={setFlights}
            selectedFlight={selectedOneWayFlight}
            handleSelectFlight={(flightNumber) => handleSelectFlight(flightNumber, 'one-way')}
            adults={adults}
            childCount={childCount}
            infants={infants}
            formatDate={formatDate}
            departureDate={departureDate}
            returnDate={returnDate}
            tripType={tripType}
            excludedFlight={null}  // Truyền chuyến bay chiều đi đã chọn
            onContinue={(selectedFlight) => {
              setSelectedOneWayFlight(selectedFlight);

              // Nếu là một chiều thì điều hướng luôn
              if (tripType === 'one-way') {
                navigate('/booking/flight-result/passenger-info', {
                  state: {
                    selectedFlight,
                    adults,
                    childCount,
                    infants,
                    departureDate,
                    returnDate,
                    tripType
                  }
                });
              }
            }}
          />

          {/* Chuyến bay chiều về (chỉ khi khứ hồi và đã chọn chiều đi) */}
          {tripType === 'round-trip' && selectedOneWayFlight && (
            <>
              <h4 className="flight-choice">Chọn chuyến bay chiều về</h4>
              {returnFlights.length > 0 ? (
                <FlightResult_List
                  flights={returnFlights}
                  setFlights={setFlights}
                  selectedFlight={selectedRoundTripFlight}
                  handleSelectFlight={(flightNumber) => handleSelectRoundTripFlight(flightNumber)}
                  adults={adults}
                  childCount={childCount}
                  infants={infants}
                  formatDate={formatDate}
                  departureDate={departureDate}
                  returnDate={returnDate}
                  tripType={tripType}
                  excludedFlight={selectedOneWayFlight}
                  onContinue={(selectedFlight) => {
                    setSelectedRoundTripFlight(selectedFlight);
                    navigate('/booking/flight-result/passenger-info', {
                      state: {
                        selectedFlight: selectedOneWayFlight,
                        returnFlight: selectedFlight,
                        adults,
                        childCount,
                        infants,
                        departureDate,
                        returnDate,
                        tripType
                      }
                    });
                  }}
                />
              ) : (
                <p>Không tìm thấy chuyến bay chiều về phù hợp.</p>
              )}
            </>
          )}

        </div>


      </div>
    </>
  );
};

// Component số lượng hành khách
const PassengerRow = ({ label, count, setCount, min }) => (
  <div className="passenger-row">
    <span className="passenger-label">{label}:</span>
    <div className="passenger-controls">
      <button
        onClick={() => setCount(count - 1)}
        disabled={count <= min}
        className="control-btn"
      >
        -
      </button>
      <span className="passenger-count">{count}</span>
      <button onClick={() => setCount(count + 1)} className="control-btn">
        +
      </button>
    </div>
  </div>
);

PassengerRow.propTypes = {
  label: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  setCount: PropTypes.func.isRequired,
  min: PropTypes.number.isRequired,
};

// ✅ Kiểm tra prop truyền vào
FlightResult_Info.propTypes = {
  departure_airport: PropTypes.string.isRequired,
  departure_airport_code: PropTypes.string.isRequired,
  arrival_airport: PropTypes.string.isRequired,
  arrival_airport_code: PropTypes.string.isRequired,
  departureDate: PropTypes.string.isRequired,
  returnDate: PropTypes.string,
  tripType: PropTypes.oneOf(['one-way', 'round-trip']).isRequired,
  adults: PropTypes.number.isRequired,
  setAdults: PropTypes.func.isRequired,
  childCount: PropTypes.number.isRequired,
  setChildCount: PropTypes.func.isRequired,
  infants: PropTypes.number.isRequired,
  setInfants: PropTypes.func.isRequired,
};

export default FlightResult_Info;


// FlightResult_List.propTypes = {
//   filteredFlights: PropTypes.arrayOf(
//     PropTypes.shape({
//       flight_number: PropTypes.string.isRequired,
//       airline_logo: PropTypes.string.isRequired,
//       airline_name: PropTypes.string.isRequired,
//       aircraft_type: PropTypes.string.isRequired,
//       departure_time: PropTypes.string,
//       arrival_time: PropTypes.string,
//       duration: PropTypes.string,
//       departure_airport: PropTypes.string.isRequired,
//       departure_airport_code: PropTypes.string.isRequired,
//       arrival_airport: PropTypes.string.isRequired,
//       arrival_airport_code: PropTypes.string.isRequired,
//       base_price: PropTypes.number,
//     })
//   ).isRequired,
// };



