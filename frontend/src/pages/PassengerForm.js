import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/PassengerForm.css';
import PassengerForm_FinalSummary from './PassengerForm_FinalSummary';

const PassengerForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
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



  /* DIV 1: Chuyến bay chiều đi 
  /* ========================================================================== */

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketConditions, setTicketConditions] = useState(null);

  // Fetch ticket conditions based on selected flight
  useEffect(() => {
    if (!selectedFlight?.flight_number) return;
  
    fetch(`http://localhost:5001/api/prices/${selectedFlight.flight_number}`)
      .then(res => {
        if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Dữ liệu chi tiết chuyến bay:', data);
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
  

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

  const renderFlightInfo = (flight, flightDate, label, index) => (
    <div className="flight-block" key={`${flight?.flight_number}-${index}`}>
      <div className="flight-info">
        <div className="flight-header">
          <h3>✈️ {label}</h3>
          <p className="airport-route">
            <span className="airport-name">{flight?.departure_airport_name || 'Không rõ'}</span>
            <img src="/images/ic-line-flight.png" alt="Flight arrow" className="flight-arrow-icon" />
            <span className="airport-name">{flight?.arrival_airport_name || 'Không rõ'}</span>
          </p>
        </div>

        <div className="flight-details">
          <div className="column-img">
            <img
              src={`/images/${flight?.airline_logo}`}
              alt={flight?.airline_name}
              className="airline-logo"
              onError={(e) => { e.target.src = '/images/placeholder.png'; }}
            />
          </div>

          <div className="column-info">
            <p><strong>Mã C.Bay:</strong> {flight?.flight_number}</p>
            <p><strong>Loại vé:</strong> {flight?.remaining_seats || 'N/A'}</p>
          </div>

          <div className="column-time">
            <p><strong className="label-text">Từ:</strong> {flight?.departure_airport_name}</p>
            <p>
              <strong className="highlight-time">{flight?.departure_time}</strong>
              <span className="gray-date">, {new Date(flightDate).toLocaleDateString('vi-VN')}</span>
            </p>
          </div>

          <div className="column-arrival">
            <p><strong className="label-text">Tới:</strong> {flight?.arrival_airport_name}</p>
            <p>
              <strong className="highlight-time">{flight?.arrival_time}</strong>
              <span className="gray-date">, {calculateArrivalDate(flightDate, flight?.departure_time, flight?.arrival_time)}</span>
            </p>
          </div>

          <div className="column-button">
            <button className="condition-button" onClick={openModal}>Điều kiện vé</button>
          </div>
        </div>
      </div>
    </div>
  );



  /* DIV 2: Thông tin hành khách 
  /* ========================================================================== */

  const [passengerInfo, setPassengerInfo] = useState(
    Array.from({ length: adults + childCount + infants }, () => ({
      firstName: '',
      lastName: '',
      gender: '',
      dob: '',
      idNumber: '',
      departureBaggageId: 1,    
      returnBaggageId: 1,      
      departureFoodMealId: 1,   
      departureDrinkMealId: 2,  
      returnFoodMealId: 1,     
      returnDrinkMealId: 2,     
      voucherId: 1,
      contactInfoId: null
    }))
  );
  


  /* DIV 3: Thông tin hành lý
  /* ========================================================================== */
  
  const [baggageOptions, setBaggageOptions] = useState([]); // Để lưu thông tin các gói hành lý

  useEffect(() => {
    // Fetch dữ liệu món ăn và đồ uống từ API
    const fetchBaggageOptions = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/baggage');
        const data = await response.json();

        if (data) {
          setBaggageOptions(data); // Lưu dữ liệu hành lý vào state
        }
      } catch (error) {
        console.error("Error fetching baggage options:", error);
      }
    };
    fetchBaggageOptions();
  }, []); // Chạy 1 lần khi component mount
  
  const handleChange = (e, index) => {
    const { id, value, type } = e.target;
  
    if (type === 'radio') {
      setPassengerInfo(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          gender: value
        };
        return updated;
      });
    } else if (id.startsWith('baggage-departure-')) {
      // Cập nhật baggageId cho chiều đi
      setPassengerInfo(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          departureBaggageId: parseInt(value) // value là baggage.id
        };
        return updated;
      });
    } else if (id.startsWith('baggage-return-')) {
      // Cập nhật baggageId cho chiều về
      setPassengerInfo(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          returnBaggageId: parseInt(value) // value là baggage.id
        };
        return updated;
      });
    } else {
      // Xử lý các input text, date, idNumber, v.v.
      setPassengerInfo(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          [id.split('-')[0]]: value
        };
        return updated;
      });
    }
  };
  


  /* DIV 4: Đồ ăn / đồ uống
  /* ========================================================================== */

  const [mealOptions, setMealOptions] = useState([]); // Để lưu thông tin các món ăn và đồ uống

  useEffect(() => {
    // Fetch dữ liệu món ăn và đồ uống từ API
    const fetchMealOptions = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/meals');
        const data = await response.json();

        if (data) {
          setMealOptions(data); // Lưu dữ liệu món ăn và đồ uống vào state
        }
      } catch (error) {
        console.error("Error fetching meal options:", error);
      }
    };
    fetchMealOptions();
  }, []); // Chạy 1 lần khi component mount

  const handleMealChange = (e, index, type) => {
    const { value } = e.target;
    const updatedInfo = [...passengerInfo];
    
    if (type === 'departureFood') {
      updatedInfo[index].departureFoodMealId = value;
    } else if (type === 'departureDrink') {
      updatedInfo[index].departureDrinkMealId = value;
    } else if (type === 'returnFood') {
      updatedInfo[index].returnFoodMealId = value;
    } else if (type === 'returnDrink') {
      updatedInfo[index].returnDrinkMealId = value;
    }
  
    setPassengerInfo(updatedInfo);
  };



  /* DIV 5: Mã giảm giá
  /* ========================================================================== */  

  const [voucherCode, setVoucherCode] = useState('');
  const [voucherDiscount, setVoucherDiscount] = useState(0); // phần trăm giảm giá
  const [voucherMessage, setVoucherMessage] = useState('');

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      setVoucherMessage('Vui lòng nhập mã giảm giá.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5001/api/vouchers/${voucherCode.trim()}`);
      if (!response.ok) {
        setVoucherDiscount(0);
        setVoucherMessage('❌ Mã giảm giá không hợp lệ hoặc đã hết hạn.');
        return;
      }
  
      const data = await response.json();
      const discountValue = Math.round(Number(data.discount)); // làm tròn số
      setVoucherDiscount(discountValue);
      setVoucherMessage(`✅ Áp dụng mã thành công! Giảm ${discountValue}%`);
    } catch (error) {
      console.error('Lỗi khi áp dụng mã:', error);
      setVoucherMessage('❌ Lỗi máy chủ.');
    }
  };
  


  /* DIV 6: Thông tin liên hệ
  /* ========================================================================== */  
  
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const saveContactInfo = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/contact-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactInfo),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        console.error('Lỗi khi thêm thông tin liên hệ:', result.message);
        alert('❌ Không thể lưu thông tin liên hệ!');
        return null;
      }
  
      const { contactInfoId } = result;
  
      // Cập nhật ID vào tất cả hành khách
      setPassengerInfo(prev =>
        prev.map(p => ({ ...p, contactInfoId }))
      );
  
      alert('✅ Đã lưu thông tin liên hệ!');
      return contactInfoId;
    } catch (error) {
      console.error('Lỗi khi gọi API contact-info:', error);
      alert('❌ Lỗi mạng khi lưu thông tin liên hệ!');
      return null;
    }
  };
  
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };
  

  /* SUBMIT
  /* ========================================================================== */ 
  const handleSubmit = async () => {
    // Kiểm tra xem đã lưu liên hệ chưa
    if (!passengerInfo[0]?.contactInfoId) {
      alert('❗ Vui lòng nhấn "Lưu Thông tin liên hệ" trước khi tiếp tục!');
      return;
    }
  
    // Tiếp tục gửi từng hành khách
    for (const passenger of passengerInfo) {
      const {
        firstName,
        lastName,
        dob,
        idNumber,
        gender,
        departureBaggageId,
        returnBaggageId,
        departureFoodMealId,
        departureDrinkMealId,
        returnFoodMealId,
        returnDrinkMealId,
        voucherId,
        contactInfoId,
      } = passenger;
  
      if (!firstName || !lastName || !dob || !idNumber) {
        alert('Vui lòng điền đầy đủ thông tin hành khách!');
        return;
      }
  
      const newPassenger = {
        first_name: firstName,
        last_name: lastName,
        gender,
        dob,
        id_number: idNumber,
        flight_id: selectedFlight?.id || null,
        departure_baggage_id: departureBaggageId || 1,
        return_baggage_id: returnBaggageId || 1,
        departure_food_meal_id: departureFoodMealId || 1,
        departure_drink_meal_id: departureDrinkMealId || 2,
        return_food_meal_id: returnFoodMealId || 1,
        return_drink_meal_id: returnDrinkMealId || 2,
        voucher_id: voucherId || 1,
        contact_info_id: contactInfoId,
      };
  
      try {
        const response = await fetch('http://localhost:5001/api/passengers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPassenger),
        });
  
        if (!response.ok) {
          alert('Lỗi khi lưu thông tin hành khách!');
          return;
        }
      } catch (error) {
        console.error('Lỗi khi gửi passenger:', error);
        alert('Đã xảy ra lỗi kết nối!');
        return;
      }
    }
  
    alert('🎉 Đã lưu toàn bộ thông tin hành khách!');
  };
  
  

  return (
    <div className="passenger-form-wrapper">

      <div className="left-column">
        {/* DIV 1: Chuyến bay chiều đi */}
        <div className="flight-info-summary">
          <h2>🛫 Thông tin chuyến bay</h2>
          {selectedFlight && renderFlightInfo(selectedFlight, departureDate, 'Chiều đi:', 0)}
          {tripType === 'round-trip' && returnFlight && renderFlightInfo(returnFlight, returnDate, 'Chiều về:', 1)}
        </div>

        {/* Modal điều kiện vé */}
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
                    Đổi chuyến: Thay đổi chuyến bay, chặng bay, ngày bay: Trước 3 tiếng so với giờ khởi hành. 
                    Thu phí đổi {Number(ticketConditions.flight_change).toLocaleString('vi-VN')} VND + Chênh lệch tiền vé nếu có/1 khách/1 chặng.
                  </li>
                  <li>
                    Nâng hạng: Thu phí đổi {Number(ticketConditions.upgrade).toLocaleString('vi-VN')} VND + Chênh lệch tiền vé nếu có/1 khách/1 chặng
                  </li>
                  <li>
                    Hoàn vé: Bảo lưu định danh, trước 24h so với giờ khởi hành, thời gian bảo lưu 365 ngày. 
                    Phí hoàn {Number(ticketConditions.refund).toLocaleString('vi-VN')} VND/1 khách/1 chặng.
                  </li>
                  <li>No Show: Vé của hành khách sẽ bị hủy, toàn bộ tiền vé sẽ {ticketConditions.no_show}</li>
                </ul>

                <p><strong>📌 Lưu ý:</strong></p>
                <p>{ticketConditions.note}</p>
              </div>
            </div>
          </div>
        )}

        {/* DIV 2: Thông tin hành khách */}
        <div className="passenger-form-container">
          <h2>👤 Thông tin hành khách</h2>

          {[...Array(adults + childCount + infants)].map((_, index) => (
            <div key={index} className="form-wrapper">
              {/* Tiêu đề hành khách theo loại */}
              {index < adults ? (
                <h3>🧑‍💼 Hành khách {index + 1}</h3>
              ) : index < adults + childCount ? (
                <h3>👶 Trẻ em {index - adults + 1}</h3>
              ) : (
                <h3>🍼 Em bé {index - adults - childCount + 1}</h3>
              )}

              {/* Custom radio theo tone cam */}
              <div className="custom-radio-group">
                <label className="custom-radio">
                  <input
                    type="radio"
                    value="Male"
                    name={`gender-${index}`}
                    checked={passengerInfo[index]?.gender === 'Male'}
                    onChange={(e) => handleChange(e, index)}
                  />
                  <span className="radio-checkmark">✓</span>
                  {index < adults
                    ? 'Quý ông'
                    : index < adults + childCount
                    ? 'Bé trai'
                    : 'Em bé trai'}
                </label>

                <label className="custom-radio">
                  <input
                    type="radio"
                    value="Female"
                    name={`gender-${index}`}
                    checked={passengerInfo[index]?.gender === 'Female'}
                    onChange={(e) => handleChange(e, index)}
                  />
                  <span className="radio-checkmark">✓</span>
                  {index < adults
                    ? 'Quý bà'
                    : index < adults + childCount
                    ? 'Bé gái'
                    : 'Em bé gái'}
                </label>
              </div>

              {/* Form nhập thông tin */}
              <form>
                <input
                  id={`firstName-${index}`}
                  type="text"
                  placeholder="Họ (VD: La)"
                  value={passengerInfo[index]?.firstName}
                  onChange={(e) => handleChange(e, index)}
                />

                <input
                  id={`lastName-${index}`}
                  type="text"
                  placeholder="Tên đệm & tên (VD: Hiểu Phong)"
                  value={passengerInfo[index]?.lastName}
                  onChange={(e) => handleChange(e, index)}
                />

                <input
                  id={`dob-${index}`}
                  type="date"
                  value={passengerInfo[index]?.dob}
                  onChange={(e) => handleChange(e, index)}
                />

                <input
                  id={`idNumber-${index}`}
                  type="text"
                  placeholder="CMND/CCCD/Hộ chiếu"
                  value={passengerInfo[index]?.idNumber}
                  onChange={(e) => handleChange(e, index)}
                />
              </form>
            </div>
          ))}
        </div>

        {/* DIV 3: Thông tin hành lý */}
        <div className="flight-info-summary">
          <h2>🎒 Thông tin hành lý</h2>

          {/* === ✈️ Chiều đi === */}
          <div className="flight-direction-section">
            <label className="flight-direction-label">
              ✈️ Chiều đi:{" "}
              <span className="airport-name">{selectedFlight?.departure_airport_name || 'Không rõ'}</span>
              <img src="/images/ic-line-flight.png" alt="→" className="flight-arrow-icon" />
              <span className="airport-name">{selectedFlight?.arrival_airport_name || 'Không rõ'}</span>
            </label>

            {[...Array(adults + childCount)].map((_, index) => (
              <div key={`departure-${index}`} className="passenger-form-section">
                {index < adults ? (
                  <h3>🧑‍💼 Hành khách {index + 1}</h3>
                ) : index < adults + childCount ? (
                  <h3>👶 Trẻ em {index - adults + 1}</h3>
                ) : null}

                <label>
                  <select
                    id={`baggage-departure-${index}`}
                    value={passengerInfo[index]?.departureBaggageId}
                    onChange={(e) => handleChange(e, index)}
                  >
                    {baggageOptions.map(option => (
                      <option key={option.id} value={option.id}>
                      {option.id === 1
                        ? 'Chưa mua hành lý'
                        : `${option.weight}kg - ${Number(option.price).toLocaleString('vi-VN')} VND`}
                    </option>                  
                    ))}
                  </select>
                </label>
              </div>
            ))}
          </div>

          {/* === ✈️ Chiều về (Chỉ hiển thị khi chọn vé khứ hồi) === */}
          {tripType !== "one-way" && (
            <div className="flight-direction-section" style={{ marginTop: '2em' }}>
              <label className="flight-direction-label">
                ✈️ Chiều về:{" "}
                <span className="airport-name">{returnFlight?.departure_airport_name || 'Không rõ'}</span>
                <img src="/images/ic-line-flight.png" alt="→" className="flight-arrow-icon" />
                <span className="airport-name">{returnFlight?.arrival_airport_name || 'Không rõ'}</span>
              </label>

              {[...Array(adults)].map((_, index) => (
                <div key={`return-${index}`} className="passenger-form-section">
                  <h3>🧑‍💼 Hành khách {index + 1}</h3>
                  <label>
                    <select
                      id={`baggage-return-${index}`}
                      value={passengerInfo[index]?.returnBaggageId}
                      onChange={(e) => handleChange(e, index)}
                    >
                      {baggageOptions.map(option => (
                        <option key={option.id} value={option.id}>
                        {option.id === 1
                          ? 'Chưa mua hành lý'
                          : `${option.weight}kg - ${Number(option.price).toLocaleString('vi-VN')} VND`}
                      </option>                    
                      ))}
                    </select>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DIV 4: Đồ ăn / đồ uống */}
        <div className="meal-section">
          <h2>🍱 Chọn đồ ăn & đồ uống</h2>

          {/* === ✈️ Chiều đi === */}
          <div className="flight-direction-section">
            <label className="flight-direction-label">
              ✈️ Chiều đi:{" "}
              <span className="airport-name">{selectedFlight?.departure_airport_name || 'Không rõ'}</span>
              <img src="/images/ic-line-flight.png" alt="→" className="flight-arrow-icon" />
              <span className="airport-name">{selectedFlight?.arrival_airport_name || 'Không rõ'}</span>
            </label>

            {[...Array(adults + childCount)].map((_, index) => (
              <div key={`departure-${index}`} className="passenger-form-section">
                {index < adults ? (
                  <h3>🧑‍💼 Hành khách {index + 1}</h3>
                ) : index < adults + childCount ? (
                  <h3>👶 Trẻ em {index - adults + 1}</h3>
                ) : null}

                {/* Bữa ăn chiều đi */}
                <label>Chọn bữa ăn chiều đi:
                  <select
                    id={`departure-food-meal-${index}`}
                    value={passengerInfo[index]?.departureFoodMealId}
                    onChange={(e) => handleMealChange(e, index, 'departureFood')}
                  >
                    {mealOptions.filter(m => m.type === 'food').map(option => (
                      <option key={option.id} value={option.id}>
                        {option.id === 1
                          ? 'Không chọn'
                          : `${option.name} - ${Number(option.price).toLocaleString('vi-VN')} VND`}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Đồ uống chiều đi */}
                <label>Chọn đồ uống chiều đi:
                  <select
                    id={`departure-drink-meal-${index}`}
                    value={passengerInfo[index]?.departureDrinkMealId}
                    onChange={(e) => handleMealChange(e, index, 'departureDrink')}
                  >
                    {mealOptions.filter(m => m.type === 'drink').map(option => (
                      <option key={option.id} value={option.id}>
                        {option.id === 2
                          ? 'Không chọn'
                          : `${option.name} - ${Number(option.price).toLocaleString('vi-VN')} VND`}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ))}
          </div>

          {/* === ✈️ Chiều về === */}
          {tripType !== "one-way" && (
            <div className="flight-direction-section" style={{ marginTop: '2em' }}>
              <label className="flight-direction-label">
                ✈️ Chiều về:{" "}
                <span className="airport-name">{returnFlight?.departure_airport_name || 'Không rõ'}</span>
                <img src="/images/ic-line-flight.png" alt="→" className="flight-arrow-icon" />
                <span className="airport-name">{returnFlight?.arrival_airport_name || 'Không rõ'}</span>
              </label>

              {[...Array(adults)].map((_, index) => (
                <div key={`return-${index}`} className="passenger-form-section">
                  <h3>🧑‍💼 Hành khách {index + 1}</h3>

                  {/* Bữa ăn chiều về */}
                  <label>Chọn bữa ăn chiều về:
                    <select
                      id={`return-food-meal-${index}`}
                      value={passengerInfo[index]?.returnFoodMealId}
                      onChange={(e) => handleMealChange(e, index, 'returnFood')}
                    >
                      {mealOptions.filter(m => m.type === 'food').map(option => (
                        <option key={option.id} value={option.id}>
                          {option.id === 1
                            ? 'Không chọn'
                            : `${option.name} - ${Number(option.price).toLocaleString('vi-VN')} VND`}
                        </option>
                      ))}
                    </select>
                  </label>

                  {/* Đồ uống chiều về */}
                  <label>Chọn đồ uống chiều về:
                    <select
                      id={`return-drink-meal-${index}`}
                      value={passengerInfo[index]?.returnDrinkMealId}
                      onChange={(e) => handleMealChange(e, index, 'returnDrink')}
                    >
                      {mealOptions.filter(m => m.type === 'drink').map(option => (
                        <option key={option.id} value={option.id}>
                          {option.id === 2
                            ? 'Không chọn'
                            : `${option.name} - ${Number(option.price).toLocaleString('vi-VN')} VND`}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DIV 5: Mã giảm giá */}
        <div className="voucher-section">
          <h2>🎁 Voucher giảm giá</h2>
          <p>
            Nhập mã voucher để được hưởng thêm ưu đãi.
          </p>
          <p>
            Lưu ý: Khách hàng vui lòng nhập đúng Mã Voucher hoặc để trống.
          </p>
          <input
            type="text"
            placeholder="Nhập mã giảm giá"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
          />
          <button onClick={handleApplyVoucher}>Áp dụng</button>
          {voucherMessage && (
            <p className={`voucher-message ${voucherDiscount > 0 ? 'success' : 'error'}`}>
              {voucherMessage}
            </p>
          )}
        </div>

        {/* DIV 6: Thông tin liên hệ */}
        <div className="contact-info-section">
          <h2>📞 Thông tin liên hệ</h2>
          <p>
            Thông tin này giúp hãng hàng không liên lạc với quý khách để thông báo cập nhật lịch bay
            thay đổi và gửi vé điện tử cho quý khách.
          </p>

          <label htmlFor="contactName">Họ và Tên:</label>
          <input
            id="contactName"
            name="name"
            value={contactInfo.name}
            placeholder="Nhập họ và tên (VD: La Hiểu Phong)"
            onChange={handleContactChange}
          />

          <label htmlFor="contactPhone">Số điện thoại di động (*):</label>
          <input
            id="contactPhone"
            name="phone"
            value={contactInfo.phone}
            placeholder="Nhập số điện thoại (VD: 0326526898)"
            onChange={handleContactChange}
            required
          />

          <label htmlFor="contactEmail">Email:</label>
          <input
            id="contactEmail"
            name="email"
            value={contactInfo.email}
            placeholder="Nhập email (VD: hieuphong144@gmail.com)"
            onChange={handleContactChange}
          />

          <label htmlFor="contactAddress">Địa chỉ:</label>
          <input
            id="contactAddress"
            name="address"
            value={contactInfo.address}
            placeholder="Nhập địa chỉ (VD: 430/28/5 TA28)"
            onChange={handleContactChange}
          />

          {/* Nút lưu thông tin liên hệ */}
          <button type="button" onClick={saveContactInfo}>
            💾 Lưu thông tin liên hệ
          </button>
        </div>
        
        {/* DIV: Tiếp tục */}
        <div className="submit-section">
          <button onClick={() => navigate(-1)}>← Quay lại</button>
          <button type="button" onClick={handleSubmit}>➡️ Tiếp tục</button>
        </div>
      </div>
    
      <div className="right-column">
        {/* DIV 7: Tổng kết lại */}
        <div className="final-summary-section">
          <PassengerForm_FinalSummary
            selectedFlight={selectedFlight}
            returnFlight={returnFlight}
            tripType={tripType}
            adults={adults}
            childCount={childCount}
            infants={infants}
            voucherDiscount={voucherDiscount}
            passengerInfo={passengerInfo}
            baggageOptions={baggageOptions}
            mealOptions={mealOptions}
          />
        </div>  
      </div>  
      
    </div>
  );        
};

export default PassengerForm;