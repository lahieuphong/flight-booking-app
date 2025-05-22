import React from 'react';
import PropTypes from 'prop-types';
import '../styles/PassengerFormFinalSummary.css';

const PassengerFormFinalSummary = ({
  selectedFlight,
  returnFlight,
  tripType,
  adults,
  childCount,
  infants,
  voucherDiscount,
  passengerInfo,
  baggageOptions,
  mealOptions
}) => {

  const calcBaggageFee = (direction) => {
    return passengerInfo.reduce((sum, pax) => {
      const baggageId = direction === 'departure' ? pax.departureBaggageId : pax.returnBaggageId;
      const bag = baggageOptions.find(opt => opt.id === Number(baggageId));
      return sum + (bag && bag.id !== 1 ? Number(bag.price) : 0);
    }, 0);
  };

  const calcMealFoodFee = (direction) => {
    return passengerInfo.reduce((total, pax) => {
      const foodId = direction === 'departure' ? pax.departureFoodMealId : pax.returnFoodMealId;
      const food = mealOptions.find(opt => opt.id === Number(foodId));
      return food && food.id !== 1 ? total + Number(food.price) : total;
    }, 0);
  };

  const calcMealDrinkFee = (direction) => {
    return passengerInfo.reduce((total, pax) => {
      const drinkId = direction === 'departure' ? pax.departureDrinkMealId : pax.returnDrinkMealId;
      const drink = mealOptions.find(opt => opt.id === Number(drinkId));
      return drink && drink.id !== 2 ? total + Number(drink.price) : total;
    }, 0);
  };

  const calcFlightCost = (flight) => {
    const additional = Number(flight.additional_price);
    const taxRate = Number(flight.tax);

    const baseAdult = adults * (Number(flight.price_adult) + additional);
    const baseChild = childCount * (Number(flight.price_child) + additional);
    const baseInfant = infants * (Number(flight.price_infant) + additional);

    const taxAdult = baseAdult * taxRate;
    const taxChild = baseChild * taxRate;
    const taxInfant = baseInfant * taxRate;

    const totalBase = baseAdult + baseChild + baseInfant;
    const totalTax = taxAdult + taxChild + taxInfant;
    const total = totalBase + totalTax;

    return {
      baseAdult, baseChild, baseInfant,
      taxAdult, taxChild, taxInfant,
      totalBase, totalTax, total
    };
  };

  const formatCurrency = (num) => `${Number(num).toLocaleString('vi-VN')} VND`;

  const go = selectedFlight ? calcFlightCost(selectedFlight) : {};
  const back = returnFlight ? calcFlightCost(returnFlight) : {};

  const goDiscount = (go.total || 0) * voucherDiscount / 100;
  const backDiscount = (back.total || 0) * voucherDiscount / 100;

  const baggageFeeGo = calcBaggageFee('departure');
  const baggageFeeBack = tripType === 'round-trip' ? calcBaggageFee('return') : 0;

  const mealFoodFeeGo = calcMealFoodFee('departure');
  const mealDrinkFeeGo = calcMealDrinkFee('departure');

  const mealFoodFeeBack = tripType === 'round-trip' ? calcMealFoodFee('return') : 0;
  const mealDrinkFeeBack = tripType === 'round-trip' ? calcMealDrinkFee('return') : 0;

  const goFinal = (go.total || 0) - goDiscount + baggageFeeGo + mealFoodFeeGo + mealDrinkFeeGo;
  const backFinal = (back.total || 0) - backDiscount + baggageFeeBack + mealFoodFeeBack + mealDrinkFeeBack;

  const totalPrice = goFinal + (tripType === 'round-trip' ? backFinal : 0);

  return (
    <div className="final-summary-container">
      <div className="summary-header">
        <p className="trip-type">CHUYẾN BAY: {tripType === 'round-trip' ? 'KHỨ HỒI' : 'MỘT CHIỀU'}</p>
        <div className="airport-code-row">
          <span className="airport-code">{selectedFlight?.departure_airport_code}</span>
          <img src="/images/ic-line-flight.png" alt="Flight arrow" className="flight-arrow-icon" />
          <span className="airport-code">{selectedFlight?.arrival_airport_code}</span>
        </div>
      </div>

      {/* Lượt đi */}
      {selectedFlight && (
        <div className="segment-section">
          <h3 className="segment-title">Lượt đi</h3>
          <p className="airport-names"><strong>{selectedFlight.departure_airport_name} → {selectedFlight.arrival_airport_name}</strong></p>

          <h4 className="price-section-title">Giá cơ bản</h4>
          <p className="price-row">{adults} Người lớn x <span>{formatCurrency(go.baseAdult)}</span></p>
          <p className="price-row">{childCount} Trẻ em x <span>{formatCurrency(go.baseChild)}</span></p>
          <p className="price-row">{infants} Trẻ nhỏ x <span>{formatCurrency(go.baseInfant)}</span></p>

          <h4 className="price-section-title">Thuế và lệ phí</h4>
          <p className="price-row">{adults} Người lớn x <span>{formatCurrency(go.taxAdult)}</span></p>
          <p className="price-row">{childCount} Trẻ em x <span>{formatCurrency(go.taxChild)}</span></p>
          <p className="price-row">{infants} Trẻ nhỏ x <span>{formatCurrency(go.taxInfant)}</span></p>

          <h4 className="price-section-title price-row">
            Tổng giá trên vé <span className="total-price">{formatCurrency(go.total)}</span>
          </h4>
          <h4 className="price-section-title price-row">
            Giảm giá <span className="discount">(-{voucherDiscount}%) -{formatCurrency(goDiscount)}</span>
          </h4>
          <h4 className="price-section-title price-row">
            Phí hành lý <span className="baggage-fee">{formatCurrency(baggageFeeGo)}</span>
          </h4>
          <h4 className="price-section-title price-row">
            Phí đồ ăn <span className="meal-fee">{formatCurrency(mealFoodFeeGo)}</span>
          </h4>
          <h4 className="price-section-title price-row">
            Phí nước uống <span className="meal-fee">{formatCurrency(mealDrinkFeeGo)}</span>
          </h4>
          <h4 className="price-section-title price-section-label price-row">
            Giá vé lượt đi <span className="final-price">{formatCurrency(goFinal)}</span>
          </h4>
        </div>
      )}

      {/* Lượt về */}
      {tripType === 'round-trip' && returnFlight && (
        <div className="segment-section return-segment">
          <h3 className="segment-title">Lượt về</h3>
          <p className="airport-names"><strong>{returnFlight.departure_airport_name} → {returnFlight.arrival_airport_name}</strong></p>

          <h4 className="price-section-title">Giá cơ bản</h4>
          <p className="price-row">{adults} Người lớn x <span>{formatCurrency(back.baseAdult)}</span></p>
          <p className="price-row">{childCount} Trẻ em x <span>{formatCurrency(back.baseChild)}</span></p>
          <p className="price-row">{infants} Trẻ nhỏ x <span>{formatCurrency(back.baseInfant)}</span></p>

          <h4 className="price-section-title">Thuế và lệ phí</h4>
          <p className="price-row">{adults} Người lớn x <span>{formatCurrency(back.taxAdult)}</span></p>
          <p className="price-row">{childCount} Trẻ em x <span>{formatCurrency(back.taxChild)}</span></p>
          <p className="price-row">{infants} Trẻ nhỏ x <span>{formatCurrency(back.taxInfant)}</span></p>

          <h4 className="price-section-title price-row">
            Tổng giá trên vé <span className="total-price">{formatCurrency(back.total)}</span>
          </h4>
          <h4 className="price-section-title price-row">
            Giảm giá <span className="discount">(-{voucherDiscount}%) -{formatCurrency(backDiscount)}</span>
          </h4>
          <h4 className="price-section-title price-row">
            Phí hành lý <span className="baggage-fee">{formatCurrency(baggageFeeBack)}</span>
          </h4>
          <h4 className="price-section-title price-row">
            Phí đồ ăn <span className="meal-fee">{formatCurrency(mealFoodFeeBack)}</span>
          </h4>
          <h4 className="price-section-title price-row">
            Phí nước uống <span className="meal-fee">{formatCurrency(mealDrinkFeeBack)}</span>
          </h4>
          <h4 className="price-section-title price-section-label price-row">
            Giá vé lượt về <span className="final-price">{formatCurrency(backFinal)}</span>
          </h4>
        </div>
      )}

      {/* Tổng tiền */}
      <div className="total-summary">
        <h4 className="price-section-title total-price-section-label price-row">
          Tổng tiền <span>{formatCurrency(totalPrice)}</span>
        </h4>
      </div>
    </div>
  );
};

PassengerFormFinalSummary.propTypes = {
  selectedFlight: PropTypes.object,
  returnFlight: PropTypes.object,
  tripType: PropTypes.string,
  adults: PropTypes.number,
  childCount: PropTypes.number,
  infants: PropTypes.number,
  voucherDiscount: PropTypes.number,
  passengerInfo: PropTypes.array.isRequired,
  baggageOptions: PropTypes.array.isRequired,
  mealOptions: PropTypes.array.isRequired,
};

export default PassengerFormFinalSummary;