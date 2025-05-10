import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState(0);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  // Giả sử bạn lấy thông tin giá trị từ các props hoặc API, ví dụ:
  const flightPrice = 1000000; // Giá vé
  const baggageFee = 200000;  // Phí hành lý
  const mealFee = 150000;     // Phí đồ ăn
  const discount = 0.1;       // Giảm giá 10% từ mã giảm giá

  useEffect(() => {
    const calculateTotalAmount = () => {
      const total = flightPrice + baggageFee + mealFee;
      const discountAmount = total * discount;
      setVoucherDiscount(discountAmount);
      setTotalAmount(total - discountAmount);
    };

    calculateTotalAmount();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePayment = () => {
    let valid = true;
    const newErrors = {
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
    };

    if (!paymentDetails.cardNumber.match(/^\d{16}$/)) {
      newErrors.cardNumber = 'Số thẻ phải là 16 chữ số';
      valid = false;
    }

    if (!paymentDetails.cardHolder.trim()) {
      newErrors.cardHolder = 'Tên chủ thẻ không được để trống';
      valid = false;
    }

    if (!paymentDetails.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      newErrors.expiryDate = 'Ngày hết hạn không hợp lệ (MM/YY)';
      valid = false;
    }

    if (!paymentDetails.cvv.match(/^\d{3}$/)) {
      newErrors.cvv = 'CVV phải là 3 chữ số';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handlePaymentSubmit = () => {
    if (!validatePayment()) {
      return;
    }

    // Gửi thông tin thanh toán lên server (giả sử API thanh toán)
    alert('Thanh toán thành công!');

    // Chuyển hướng sau khi thanh toán thành công
    navigate('/confirmation');
  };

  return (
    <div className="payment-page-wrapper">
      <h2>Thanh Toán</h2>

      <div className="payment-summary">
        <h3>Tổng Chi Phí</h3>
        <p><strong>Giá vé:</strong> {flightPrice.toLocaleString()} VND</p>
        <p><strong>Phí hành lý:</strong> {baggageFee.toLocaleString()} VND</p>
        <p><strong>Phí đồ ăn:</strong> {mealFee.toLocaleString()} VND</p>
        <p><strong>Giảm giá:</strong> -{voucherDiscount.toLocaleString()} VND</p>
        <p className="total-amount">
          <strong>Tổng cộng:</strong> {totalAmount.toLocaleString()} VND
        </p>
      </div>

      <div className="payment-form">
        <h3>Thông tin thẻ thanh toán</h3>

        <div className="form-group">
          {/* <label>Số thẻ</label> */}
          <input
            type="text"
            name="cardNumber"
            maxLength="16"
            value={paymentDetails.cardNumber}
            onChange={handleInputChange}
            placeholder="Nhập số thẻ 16 chữ số"
          />
          {errors.cardNumber && <p className="error">{errors.cardNumber}</p>}
        </div>

        <div className="form-group">
          {/* <label>Chủ thẻ</label> */}
          <input
            type="text"
            name="cardHolder"
            value={paymentDetails.cardHolder}
            onChange={handleInputChange}
            placeholder="Nhập tên chủ thẻ"
          />
          {errors.cardHolder && <p className="error">{errors.cardHolder}</p>}
        </div>

        <div className="form-group">
          {/* <label>Ngày hết hạn (MM/YY)</label> */}
          <input
            type="text"
            name="expiryDate"
            value={paymentDetails.expiryDate}
            onChange={handleInputChange}
            placeholder="MM/YY"
          />
          {errors.expiryDate && <p className="error">{errors.expiryDate}</p>}
        </div>

        <div className="form-group">
          {/* <label>CVV</label> */}
          <input
            type="text"
            name="cvv"
            maxLength="3"
            value={paymentDetails.cvv}
            onChange={handleInputChange}
            placeholder="Nhập CVV"
          />
          {errors.cvv && <p className="error">{errors.cvv}</p>}
        </div>

        <div className="submit-section">
          <button onClick={handlePaymentSubmit} className="pay-button">
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;