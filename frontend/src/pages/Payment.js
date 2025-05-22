import React from 'react';
import { useLocation } from 'react-router-dom';
import PassengerFormFlightInfo from './PassengerFormFlightInfo';
import PaymentMethod from './PaymentMethod';
import '../styles/Payment.css';

const Payment = () => {
  const location = useLocation();

  // Destructure props from location.state with fallback to default values
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
    passengerInfo = [],
    baggageOptions = [],
    mealOptions = [],
    contactInfo,
    totalPrice,
  } = location.state || {};

  // Early return if no data in location.state
  if (!location.state) {
    return <div className="error-message">No data available. Please complete your booking first.</div>;
  }

  return (
    <div className="payment-page-wrapper">
      {/* DIV1: Chuyến bay chiều đi */}
      <div className="flight-info-summary">
        <PassengerFormFlightInfo 
          selectedFlight={selectedFlight}
          returnFlight={returnFlight}
          departureDate={departureDate}
          returnDate={returnDate}
          tripType={tripType}
        />
      </div>

      {/* DIV2: Phương thức thanh toán */}
      <div className="payment-methods">
        <PaymentMethod
          selectedFlight={selectedFlight}
          returnFlight={returnFlight}
          departureDate={departureDate}
          returnDate={returnDate}
          tripType={tripType}
          voucherDiscount={voucherDiscount}
          adults={adults}
          childCount={childCount}
          infants={infants}
          passengerInfo={passengerInfo}
          baggageOptions={baggageOptions}
          mealOptions={mealOptions}
          contactInfo={contactInfo}  // Make sure to pass this prop
          totalPrice={totalPrice}
        />
      </div>

    </div>
  );
};

export default Payment;