// utils/priceCalculations.js

export const calcBaggageFee = (passengerInfo, baggageOptions, direction) => {
  return passengerInfo.reduce((sum, pax) => {
    const baggageId = direction === 'departure' ? pax.departureBaggageId : pax.returnBaggageId;
    const bag = baggageOptions.find(opt => opt.id === Number(baggageId));
    return sum + (bag && bag.id !== 1 ? Number(bag.price) : 0);
  }, 0);
};

export const calcMealFee = (passengerInfo, mealOptions, direction, type) => {
  return passengerInfo.reduce((total, pax) => {
    const id =
      direction === 'departure'
        ? type === 'food'
          ? pax.departureFoodMealId
          : pax.departureDrinkMealId
        : type === 'food'
        ? pax.returnFoodMealId
        : pax.returnDrinkMealId;

    const item = mealOptions.find(opt => opt.id === Number(id));
    if (!item) return total;

    if ((type === 'food' && item.id !== 1) || (type === 'drink' && item.id !== 2)) {
      return total + Number(item.price);
    }
    return total;
  }, 0);
};

export const calcFlightCost = (flight, adults, childCount, infants) => {
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
    total: totalBase + totalTax
  };
};

export const formatCurrency = (num) => `${Number(num).toLocaleString('vi-VN')} VND`;

export const calculateTotals = (
  selectedFlight, returnFlight, voucherDiscount, baggageOptions, mealOptions,
  passengerInfo, tripType, adults, childCount, infants
) => {
  const go = selectedFlight ? calcFlightCost(selectedFlight, adults, childCount, infants) : { total: 0 };
  const back = returnFlight ? calcFlightCost(returnFlight, adults, childCount, infants) : { total: 0 };

  const goDiscount = (go.total || 0) * (voucherDiscount / 100);
  const backDiscount = (back.total || 0) * (voucherDiscount / 100);

  const baggageFeeGo = calcBaggageFee(passengerInfo, baggageOptions, 'departure');
  const baggageFeeBack = tripType === 'round-trip' ? calcBaggageFee(passengerInfo, baggageOptions, 'return') : 0;

  const mealFoodFeeGo = calcMealFee(passengerInfo, mealOptions, 'departure', 'food');
  const mealDrinkFeeGo = calcMealFee(passengerInfo, mealOptions, 'departure', 'drink');
  const mealFoodFeeBack = tripType === 'round-trip' ? calcMealFee(passengerInfo, mealOptions, 'return', 'food') : 0;
  const mealDrinkFeeBack = tripType === 'round-trip' ? calcMealFee(passengerInfo, mealOptions, 'return', 'drink') : 0;

  const subtotalGo = (go.total || 0) + baggageFeeGo + mealFoodFeeGo + mealDrinkFeeGo;
  const subtotalBack = tripType === 'round-trip'
    ? (back.total || 0) + baggageFeeBack + mealFoodFeeBack + mealDrinkFeeBack
    : 0;
  const subtotal = subtotalGo + subtotalBack;
  const serviceFee = 54000;
  const grandTotal = subtotal - (goDiscount + backDiscount) + serviceFee;

  return {
    subtotalGo,
    subtotalBack,
    subtotal,
    serviceFee,
    grandTotal,
    goDiscount,
    backDiscount,
    formatCurrency
  };
};