import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/PassengerForm.css';
import PassengerFormFlightInfo from './PassengerFormFlightInfo';
import PassengerFormFinalSummary from './PassengerFormFinalSummary';

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



  /* DIV 2: Thông tin hành khách 
  /* ========================================================================== */
  const [passengerErrors, setPassengerErrors] = useState(
    Array.from({ length: adults + childCount + infants }, () => ({
      firstName: '',
      lastName: '',
      gender: '',
      dob: '',
      idNumber: ''
    }))
  );

  const [passengerInfo, setPassengerInfo] = useState(
    Array.from({ length: adults + childCount + infants }, () => ({
      firstName: '',
      lastName: '',
      gender: '', // hoặc null nếu bạn thích rõ kiểu
      dob: '',
      idNumber: '',
      departureBaggageId: null,    
      returnBaggageId: null,      
      departureFoodMealId: null,   
      departureDrinkMealId: null,  
      returnFoodMealId: null,     
      returnDrinkMealId: null,     
      voucherId: null,
      contactInfoId: null
    }))
  );

  
  const handlePassengerChange = (e, index) => {
    const { name, value, type } = e.target;

    // Nếu input là radio (để chọn giới tính)
    if (type === 'radio') {
      setPassengerInfo(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          gender: value // Chỉ cập nhật trường gender
        };
        return updated;
      });
    } else {
      // Cập nhật các input khác (text, date, number, v.v.)
      setPassengerInfo(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          [name]: value // Cập nhật giá trị dựa trên name của input
        };
        return updated;
      });
    }
  };


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
    const { id, value } = e.target;
  
    if (id.startsWith('baggage-departure-')) {
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
  const [voucherId, setVoucherId] = useState(null);

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
      console.log('Voucher data:', data);  // Log dữ liệu trả về từ API

      const discountValue = Math.round(Number(data.discount)); // làm tròn số
      setVoucherDiscount(discountValue);
      setVoucherMessage(`✅ Áp dụng mã thành công! Giảm ${discountValue}%`);

      // Lưu voucherId vào state
      setVoucherId(data.id); // Lưu voucherId vào state

      console.log('Voucher ID:', data.id); // Log voucherId để kiểm tra

    } catch (error) {
      console.error('Lỗi khi áp dụng mã:', error);
      setVoucherMessage('❌ Lỗi máy chủ.');
    }
  };


  


  /* DIV 6: Thông tin liên hệ
  /* ========================================================================== */  
  
  const [contactErrors, setContactErrors] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const saveContactInfo = async () => {
    // Kiểm tra lỗi đầu vào
    const newErrors = {
      name: contactInfo.name ? '' : 'Vui lòng nhập họ và tên',
      phone: contactInfo.phone ? '' : 'Vui lòng nhập số điện thoại',
      email: contactInfo.email ? '' : 'Vui lòng nhập email',
      address: contactInfo.address ? '' : 'Vui lòng nhập địa chỉ',
    };

    setContactErrors(newErrors);

    // Nếu có bất kỳ lỗi nào, không gửi
    const hasError = Object.values(newErrors).some(error => error !== '');
    if (hasError) {
      return;
    }

    try {
      // Lưu contactInfo vào localStorage
      localStorage.setItem('contactInfo', JSON.stringify(contactInfo)); // Lưu vào localStorage
      console.log("Lưu thông tin liên hệ:", contactInfo); // Kiểm tra thông tin liên hệ

      // Gửi thông tin liên hệ đến server
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

      // Cập nhật ID vào tất cả hành khách (nếu cần thiết)
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
  
  const calculateBaggageFee = (direction) => {
    return passengerInfo.reduce((sum, pax) => {
      const baggageId = direction === 'go' ? pax.departureBaggageId : pax.returnBaggageId;
      const bag = baggageOptions.find(opt => opt.id === Number(baggageId));
      return sum + (bag && bag.id !== 1 ? Number(bag.price) : 0);
    }, 0);
  };

  const calculateMealFee = (direction) => {
    return passengerInfo.reduce((sum, pax) => {
      const foodId  = direction === 'go' ? pax.departureFoodMealId  : pax.returnFoodMealId;
      const drinkId = direction === 'go' ? pax.departureDrinkMealId : pax.returnDrinkMealId;

      const food  = mealOptions.find(opt => opt.id === Number(foodId));
      const drink = mealOptions.find(opt => opt.id === Number(drinkId));

      if (food && food.id !== 1) sum += Number(food.price);
      if (drink && drink.id !== 2) sum += Number(drink.price);
      return sum;
    }, 0);
  };

  const calculateFlightTotal = (flight) => {
    const additional = Number(flight?.additional_price || 0);
    const tax = Number(flight?.tax || 0);
    const adult = (Number(flight?.price_adult) + additional) * adults;
    const child = (Number(flight?.price_child) + additional) * childCount;
    const infant = (Number(flight?.price_infant) + additional) * infants;
    const base = adult + child + infant;
    const taxAmount = base * tax;
    return base + taxAmount;
  };

  

  /* SUBMIT
  /* ========================================================================== */
  const handleSubmit = async () => {
    // Kiểm tra lỗi cho từng hành khách
    const newErrors = passengerInfo.map(passenger => ({
      firstName: passenger.firstName ? '' : 'Vui lòng nhập họ',
      lastName: passenger.lastName ? '' : 'Vui lòng nhập tên đệm & tên',
      gender: passenger.gender ? '' : 'Vui lòng chọn giới tính',
      dob: passenger.dob ? '' : 'Vui lòng chọn ngày sinh',
      idNumber: passenger.idNumber ? '' : 'Vui lòng nhập CMND/CCCD/Hộ chiếu'
    }));

    setPassengerErrors(newErrors);

    const hasPassengerError = newErrors.some(errors => Object.values(errors).some(error => error !== ''));
    if (hasPassengerError) {
      return;
    }

    try {
      // Thực hiện gửi thông tin hành khách nếu không có lỗi
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
          contactInfoId,
        } = passenger;

        const newPassenger = {
          first_name: firstName,
          last_name: lastName,
          gender,
          dob,
          id_number: idNumber,
          flight_id: selectedFlight?.id ?? null,
          departure_baggage_id: departureBaggageId ?? null,
          return_baggage_id: returnBaggageId ?? null,
          departure_food_meal_id: departureFoodMealId ?? null,
          departure_drink_meal_id: departureDrinkMealId ?? null,
          return_food_meal_id: returnFoodMealId ?? null,
          return_drink_meal_id: returnDrinkMealId ?? null,
          voucher_id: voucherId ?? null, 
          contact_info_id: contactInfoId ?? null,
        };

        const response = await fetch('http://localhost:5001/api/passengers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPassenger)
        });

        if (!response.ok) {
          alert('Lỗi khi lưu thông tin hành khách!');
          return;
        }

        const result = await response.json();
        passenger.id = result.insertId; // Lưu id vào passengerInfo
      }

      // Các phần tính toán giá
      const baggageFeeGo = calculateBaggageFee('go');
      const baggageFeeBack = tripType === 'round-trip' ? calculateBaggageFee('back') : 0;
      const departureMealFee = calculateMealFee('go');
      const returnMealFee = tripType === 'round-trip' ? calculateMealFee('back') : 0;

      const totalFlightPriceGo = calculateFlightTotal(selectedFlight);
      const totalFlightPriceBack = tripType === 'round-trip' ? calculateFlightTotal(returnFlight) : 0;

      const flightTotal = totalFlightPriceGo + totalFlightPriceBack;
      const discountAmount = (flightTotal * voucherDiscount) / 100;

      // Total price calculation
      const totalPrice = flightTotal + baggageFeeGo + baggageFeeBack + departureMealFee + returnMealFee - discountAmount;

      alert('🎉 Đã lưu toàn bộ thông tin hành khách!');

      // Passing totalPrice to the payment page along with other details
      navigate('/payment', {
        state: {
          selectedFlight,
          returnFlight,
          departureDate,
          returnDate,
          tripType,
          voucherDiscount,
          adults,
          childCount,
          infants,
          passengerInfo,
          baggageOptions,
          mealOptions,
          baggageFeeGo,
          baggageFeeBack,
          departureMealFee,
          returnMealFee,
          totalPrice,  // Pass totalPrice here
          contactInfo
        }
      });

    } catch (error) {
      console.error('Lỗi khi gửi passenger:', error);
      alert('Đã xảy ra lỗi kết nối!');
    }
  };


  return (
    <div className="passenger-form-wrapper">
      <div className="form-columns-container">
        <div className="left-column">
          {/* DIV 1: Chuyến bay chiều đi */}
          <div className="flight-info-summary">
            <PassengerFormFlightInfo 
              selectedFlight={selectedFlight}
              returnFlight={returnFlight}
              departureDate={departureDate}
              returnDate={returnDate}
              tripType={tripType}
            />
          </div>

          {/* DIV 2: Thông tin hành khách */}
          <div className="passenger-form-container">
            <h2>
              <span role="img" aria-label="icon hành khách">👤</span> Thông tin hành khách
            </h2>

            {[...Array(adults + childCount + infants)].map((_, index) => (
              <div key={index} className="form-wrapper">
                {/* Tiêu đề hành khách theo loại */}
                {index < adults ? (
                  <h3>
                    <span role="img" aria-label="hành khách người lớn">🧑‍💼</span> Hành khách {index + 1}
                  </h3>
                ) : index < adults + childCount ? (
                  <h3>
                    <span role="img" aria-label="trẻ em">👶</span> Trẻ em {index - adults + 1}
                  </h3>
                ) : (
                  <h3>
                    <span role="img" aria-label="em bé">🍼</span> Em bé {index - adults - childCount + 1}
                  </h3>
                )}

                {/* Custom radio theo tone cam */}
                <div
                  className={`custom-radio-group ${
                    passengerErrors[index]?.gender ? 'error-radio-group' : ''
                  }`}
                >
                  <label className="custom-radio">
                    <input
                      type="radio"
                      value="Male"
                      name={`gender-${index}`}
                      checked={passengerInfo[index]?.gender === 'Male'}
                      onChange={(e) => handlePassengerChange(e, index)}
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
                      onChange={(e) => handlePassengerChange(e, index)}
                    />
                    <span className="radio-checkmark">✓</span>
                    {index < adults
                      ? 'Quý bà'
                      : index < adults + childCount
                      ? 'Bé gái'
                      : 'Em bé gái'}
                  </label>
                </div>

                {/* Hiển thị lỗi nếu chưa chọn giới tính */}
                {/* {passengerErrors[index]?.gender && (
                  <div className="error-text">{passengerErrors[index].gender}</div>
                )} */}

                {/* Form nhập thông tin */}
                <form className="passenger-input-form">
                  <div className="input-group">
                    <input
                      id={`firstName-${index}`}
                      type="text"
                      placeholder="Họ (VD: La)"
                      value={passengerInfo[index]?.firstName}
                      name="firstName"
                      onChange={(e) => handlePassengerChange(e, index)}
                      className={passengerErrors[index]?.firstName ? 'error-input' : ''}
                    />
                    {passengerErrors[index]?.firstName && (
                      <div className="error-text">{passengerErrors[index].firstName}</div>
                    )}
                  </div>

                  <div className="input-group">
                    <input
                      id={`lastName-${index}`}
                      type="text"
                      placeholder="Tên đệm & tên (VD: Hiểu Phong)"
                      value={passengerInfo[index]?.lastName}
                      name="lastName"
                      onChange={(e) => handlePassengerChange(e, index)}
                      className={passengerErrors[index]?.lastName ? 'error-input' : ''}
                    />
                    {passengerErrors[index]?.lastName && (
                      <div className="error-text">{passengerErrors[index].lastName}</div>
                    )}
                  </div>

                  <div className="input-group">
                    <input
                      id={`dob-${index}`}
                      type="date"
                      name="dob"
                      value={passengerInfo[index]?.dob}
                      onChange={(e) => handlePassengerChange(e, index)}
                      className={passengerErrors[index]?.dob ? 'error-input' : ''}
                    />
                    {passengerErrors[index]?.dob && (
                      <div className="error-text">{passengerErrors[index].dob}</div>
                    )}
                  </div>

                  <div className="input-group">
                    <input
                      id={`idNumber-${index}`}
                      type="text"
                      placeholder="CMND/CCCD/Hộ chiếu"
                      name="idNumber"
                      value={passengerInfo[index]?.idNumber}
                      onChange={(e) => handlePassengerChange(e, index)}
                      className={passengerErrors[index]?.idNumber ? 'error-input' : ''}
                    />
                    {passengerErrors[index]?.idNumber && (
                      <div className="error-text">{passengerErrors[index].idNumber}</div>
                    )}
                  </div>
                </form>

              </div>
            ))}
          </div>


          {/* DIV 3: Thông tin hành lý */}
          <div className="flight-info-summary">
            <h2>
              <span role="img" aria-label="hành lý">🎒</span> Thông tin hành lý
            </h2>

            {/* === ✈️ Chiều đi === */}
            <div className="flight-direction-section">
              <label className="flight-direction-label">
                <span className="flight-direction-title" role="img" aria-label="chiều đi máy bay">
                  ✈️ Chiều đi:
                </span>{" "}
                <span className="airport-name">{selectedFlight?.departure_airport_name || 'Không rõ'}</span>
                <img src="/images/ic-line-flight.png" alt="→" className="flight-arrow-icon" />
                <span className="airport-name">{selectedFlight?.arrival_airport_name || 'Không rõ'}</span>
              </label>

              {[...Array(adults + childCount)].map((_, index) => (
                <div key={`departure-${index}`} className="passenger-form-section">
                  {index < adults ? (
                    <h3>
                      <span role="img" aria-label="hành khách người lớn">🧑‍💼</span> Hành khách {index + 1}
                    </h3>
                  ) : (
                    <h3>
                      <span role="img" aria-label="trẻ em">👶</span> Trẻ em {index - adults + 1}
                    </h3>
                  )}

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
              <div className="flight-direction-section">
                <label className="flight-direction-label">
                  <span className="flight-direction-title">
                    <span role="img" aria-label="chiều về">✈️</span> Chiều về:
                  </span>
                  <span className="airport-name">{returnFlight?.departure_airport_name || 'Không rõ'}</span>
                  <img src="/images/ic-line-flight.png" alt="→" className="flight-arrow-icon" />
                  <span className="airport-name">{returnFlight?.arrival_airport_name || 'Không rõ'}</span>
                </label>

                {[...Array(adults)].map((_, index) => (
                  <div key={`return-${index}`} className="passenger-form-section">
                    <h3>
                      <span role="img" aria-label="hành khách người lớn">🧑‍💼</span> Hành khách {index + 1}
                    </h3>
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
            <h2>
              <span role="img" aria-label="đồ ăn và đồ uống">🍱</span> Chọn đồ ăn & đồ uống
            </h2>

            {/* === ✈️ Chiều đi === */}
            <div className="flight-direction-section">
              <label className="flight-direction-label">
                <span className="flight-direction-title">
                  <span role="img" aria-label="máy bay">✈️</span> Chiều đi:
                </span>{" "}
                <span className="airport-name">{selectedFlight?.departure_airport_name || 'Không rõ'}</span>
                <img src="/images/ic-line-flight.png" alt="→" className="flight-arrow-icon" />
                <span className="airport-name">{selectedFlight?.arrival_airport_name || 'Không rõ'}</span>
              </label>

              {[...Array(adults + childCount)].map((_, index) => (
                <div key={`departure-${index}`} className="passenger-form-section">
                  {index < adults ? (
                    <h3>
                      <span role="img" aria-label="người lớn">🧑‍💼</span> Hành khách {index + 1}
                    </h3>
                  ) : index < adults + childCount ? (
                    <h3>
                      <span role="img" aria-label="trẻ em">👶</span> Trẻ em {index - adults + 1}
                    </h3>
                  ) : null}

                  {/* Meal and Drink Selection for Departure */}
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
              <div className="flight-direction-section">
                <label className="flight-direction-label">
                  <span className="flight-direction-title">
                    <span role="img" aria-label="máy bay">✈️</span> Chiều về:
                  </span>{" "}
                  <span className="airport-name">{returnFlight?.departure_airport_name || 'Không rõ'}</span>
                  <img src="/images/ic-line-flight.png" alt="→" className="flight-arrow-icon" />
                  <span className="airport-name">{returnFlight?.arrival_airport_name || 'Không rõ'}</span>
                </label>

                {[...Array(adults)].map((_, index) => (
                  <div key={`return-${index}`} className="passenger-form-section">
                    <h3>
                      <span role="img" aria-label="hành khách người lớn">🧑‍💼</span> Hành khách {index + 1}
                    </h3>
                    {/* Meal and Drink Selection for Return */}
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
            <h2>
              <span role="img" aria-label="voucher giảm giá">🎁</span> Voucher giảm giá
            </h2>
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
            <h2>
              <span role="img" aria-label="điện thoại">📞</span> Thông tin liên hệ
            </h2>
            <p>
              Thông tin này giúp hãng hàng không liên lạc với quý khách để thông báo cập nhật lịch bay
              thay đổi và gửi vé điện tử cho quý khách.
            </p>

            <label htmlFor="contactName">Họ và Tên:</label>
            <div className="input-group">
              <input
                id="contactName"
                name="name"
                className={contactErrors.name ? 'error-input' : ''}
                value={contactInfo.name}
                placeholder="Nhập họ và tên (VD: La Hiểu Phong)"
                onChange={handleContactChange}
              />
              {contactErrors.name && <div className="error-text">{contactErrors.name}</div>}
            </div>

            <label htmlFor="contactPhone">Số điện thoại di động (*):</label>
            <div className="input-group">
              <input
                id="contactPhone"
                name="phone"
                className={contactErrors.phone ? 'error-input' : ''}
                value={contactInfo.phone}
                placeholder="Nhập số điện thoại (VD: 0326526898)"
                onChange={handleContactChange}
              />
              {contactErrors.phone && <div className="error-text">{contactErrors.phone}</div>}
            </div>

            <label htmlFor="contactEmail">Email:</label>
            <div className="input-group">
              <input
                id="contactEmail"
                name="email"
                className={contactErrors.email ? 'error-input' : ''}
                value={contactInfo.email}
                placeholder="Nhập email (VD: hieuphong144@gmail.com)"
                onChange={handleContactChange}
              />
              {contactErrors.email && <div className="error-text">{contactErrors.email}</div>}
            </div>

            <label htmlFor="contactAddress">Địa chỉ:</label>
            <div className="input-group">
              <input
                id="contactAddress"
                name="address"
                className={contactErrors.address ? 'error-input' : ''}
                value={contactInfo.address}
                placeholder="Nhập địa chỉ (VD: 430/28/5 TA28)"
                onChange={handleContactChange}
              />
              {contactErrors.address && <div className="error-text">{contactErrors.address}</div>}
            </div>

            {/* Nút Lưu thông tin liên hệ */}
            <button type="button" onClick={saveContactInfo}>
              <span role="img" aria-label="lưu">💾</span> Lưu thông tin liên hệ
            </button>
          </div>
        </div>

        <div className="right-column">
          {/* DIV 7: Tổng kết lại */}
          <div className="final-summary-section">
            <PassengerFormFinalSummary
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

      {/* DIV: Tiếp tục */}
      <div className="submit-section">
        <button type="button" onClick={() => navigate(-1)}>← Quay lại</button>
        <button type="button" onClick={handleSubmit}>→ Tiếp tục</button>
      </div>
    </div>
  );        
};

export default PassengerForm;