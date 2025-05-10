import React from 'react';
import PropTypes from 'prop-types';
import '../styles/PassengerForm_FinalSummary.css';

const PassengerForm_FinalSummary = ({
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

  const calcBaggageFeeGo = () => {
    return passengerInfo.reduce((sum, pax) => {
      const bag = baggageOptions.find(opt => opt.id === Number(pax.departureBaggageId));
      return sum + (bag && bag.id !== 1 ? Number(bag.price) : 0);
    }, 0);
  };

  const calcBaggageFeeBack = () => {
    if (tripType !== 'round-trip') return 0;
    return passengerInfo.reduce((sum, pax) => {
      const bag = baggageOptions.find(opt => opt.id === Number(pax.returnBaggageId));
      return sum + (bag && bag.id !== 1 ? Number(bag.price) : 0);
    }, 0);
  };

  const calcMealFee = (direction) => {
    let total = 0;

    passengerInfo.forEach(pax => {
      const foodId  = direction === 'departure' ? pax.departureFoodMealId  : pax.returnFoodMealId;
      const drinkId = direction === 'departure' ? pax.departureDrinkMealId : pax.returnDrinkMealId;

      const food  = mealOptions.find(opt => opt.id === Number(foodId));
      const drink = mealOptions.find(opt => opt.id === Number(drinkId));

      if (food && food.id !== 1)   total += Number(food.price);   // ID 1: 'Không chọn'
      if (drink && drink.id !== 2) total += Number(drink.price); // ID 2: 'Không chọn'
    });

    return total;
  };

  const baggageFeeGo      = calcBaggageFeeGo();
  const baggageFeeBack    = calcBaggageFeeBack();
  const departureMealFee  = calcMealFee('departure');
  const returnMealFee     = tripType === 'round-trip' ? calcMealFee('return') : 0;

  const calcFlightCost = (flight) => {
    const additional = Number(flight.additional_price);
    const taxRate    = Number(flight.tax);

    const baseAdult  = adults     * (Number(flight.price_adult)  + additional);
    const baseChild  = childCount * (Number(flight.price_child)  + additional);
    const baseInfant = infants    * (Number(flight.price_infant) + additional);

    const taxAdult   = baseAdult  * taxRate;
    const taxChild   = baseChild  * taxRate;
    const taxInfant  = baseInfant * taxRate;

    const totalBase  = baseAdult + baseChild + baseInfant;
    const totalTax   = taxAdult + taxChild + taxInfant;
    const total      = totalBase + totalTax;

    return {
      baseAdult, baseChild, baseInfant,
      taxAdult, taxChild, taxInfant,
      totalBase, totalTax, total
    };
  };

  const formatCurrency = (num) => `${Number(num).toLocaleString('vi-VN')} VND`;

  const go   = selectedFlight ? calcFlightCost(selectedFlight) : {};
  const back = returnFlight   ? calcFlightCost(returnFlight)   : {};

  const goDiscount   = (go.total   * voucherDiscount) / 100;
  const backDiscount = (back.total * voucherDiscount) / 100;

  const goFinal   = (go.total || 0)   - goDiscount   + baggageFeeGo   + departureMealFee;
  const backFinal = (back.total || 0) - backDiscount + baggageFeeBack + returnMealFee;

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

PassengerForm_FinalSummary.propTypes = {
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

export default PassengerForm_FinalSummary;