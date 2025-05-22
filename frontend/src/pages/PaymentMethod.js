import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import '../styles/PaymentMethod.css';
// import QRCode from 'qrcode.react';
import axios from 'axios';
import { calculateTotals } from './utils/priceCalculations';


const PaymentMethod = ({
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

}) => { 
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isAgreedPostpaid, setIsAgreedPostpaid] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]); 
  const [isChecked, setIsChecked] = useState(false); 
  const [showModal, setShowModal] = useState(false);
  const [postpaidPartners, setPostpaidPartners] = useState([]);

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?.id;


  const {
    subtotal,
    serviceFee,
    grandTotal,
    goDiscount,
    backDiscount,
    formatCurrency
  } = calculateTotals(
    selectedFlight, returnFlight, voucherDiscount, baggageOptions, mealOptions,
    passengerInfo, tripType, adults, childCount, infants
  );



  // Fetch phương thức thanh toán từ API
  useEffect(() => {
    fetch('http://localhost:5001/api/payment-method')
      .then(res => res.json())
      .then(data => setPaymentMethods(data))
      .catch(err => console.error('Lỗi khi fetch phương thức thanh toán:', err));
  }, []);



  // Quản lý trạng thái cho form
  const [cardDetails, setCardDetails] = useState({
    cardholder_name: '',
    last_four_digits: '',
    expiration_date: '',
    cvv: '',
    card_token: '',
  });

  // Xử lý thay đổi trong các trường input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value,
    });
  };

  // Hàm gửi thông tin thanh toán khi nhấn nút "Xác nhận thanh toán"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn không cho form reload lại trang

    // Tự động thay đổi giá trị trống thành null trước khi gửi
    const dataToSubmit = {
      cardholder_name: cardDetails.cardholder_name || null,
      last_four_digits: cardDetails.last_four_digits || null,
      expiration_date: cardDetails.expiration_date || null,
      cvv: cardDetails.cvv || null,
      card_token: cardDetails.card_token || null,
      payment_method_code: 'card', // Cố định là 'card'
    };

    // In ra dataToSubmit để kiểm tra dữ liệu đã chuẩn bị gửi
    console.log('Thông tin thanh toán:', dataToSubmit);

    try {
      const response = await axios.post('http://localhost:5001/api/payment-method/card-payment', dataToSubmit);
      
      // Kiểm tra xem server có trả về mã thành công hay không
      if (response.status === 200 || response.status === 201) {
        alert('Thông tin thẻ đã được lưu thành công!');
        console.log(response.data); // Kiểm tra phản hồi từ server
      } else {
        alert('Có lỗi xảy ra, vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Lỗi khi gửi thông tin thẻ:', error.response?.data || error.message);
      alert(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };



  useEffect(() => {
    if (selectedMethod === 'postpaid') {
      axios.get('http://localhost:5001/api/payment-method/postpaid-partner')
        .then(res => setPostpaidPartners(res.data))
        .catch(err => console.error('Lỗi khi tải đối tác trả sau:', err));
    }
  }, [selectedMethod]);

  const [postpaidForm, setPostpaidForm] = useState({
    full_name: '',
    national_id: '',
    email: '',
    phone: '',
    address: '',
    occupation: '',
    monthly_income: '',
    postpaid_partner_id: '', 
  });

  const handlePostpaidChange = (e) => {
    const { name, value } = e.target;
    setPostpaidForm({ ...postpaidForm, [name]: value });
  };

  const submitPostpaidForm = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5001/api/payment-method/postpaid-application', postpaidForm);
      alert('Gửi hồ sơ trả sau thành công!');
      console.log(response.data);
    } catch (error) {
      console.error('Lỗi khi gửi hồ sơ:', error.response?.data || error.message);
      alert(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };



  // Phân loại các phương thức
  const methodGroups = {
    now: ['card', 'momo', 'qr'],
    hold: ['pay_later'],
    later: ['postpaid']
  };



  const accountNumber = '0326526898';
  const accountName = 'La Hiểu Phong';
  const amount = grandTotal;
  const note = 'Thanh toán vé máy bay';
  const vietQRUrl = `https://img.vietqr.io/image/MB-${accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(note)}&accountName=${encodeURIComponent(accountName)}`;



  const handlePayment = async () => {
    try {
      // 1. Lấy ID phương thức thanh toán đã chọn
      const selectedPaymentId = paymentMethods.find(
        method => method.code === selectedMethod
      )?.id;

      if (!selectedPaymentId) {
        alert('Vui lòng chọn phương thức thanh toán.');
        return;
      }

      // 2. Kiểm tra tổng tiền
      if (!grandTotal || grandTotal <= 0) {
        alert('Tổng tiền không hợp lệ.');
        return;
      }

      // 3. Lấy userId từ localStorage nếu chưa có (dự phòng)
      let finalUserId = userId;
      if (!finalUserId) {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        finalUserId = storedUser?.id;
      }

      if (!finalUserId) {
        alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        return;
      }

      // 4. Gửi dữ liệu thanh toán lên server
      const response = await fetch('http://localhost:5001/api/passengers/payment-method', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passengerIds: passengerInfo.map(p => p.id),
          paymentMethodId: selectedPaymentId,
          totalPrice: grandTotal,
          userId: finalUserId
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Thanh toán thành công!');

        // 5. Điều hướng đến trang Success
        navigate('/success', {
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
            totalPrice: grandTotal,
            contactInfo,
            userId: finalUserId,
          },
        });
      } else {
        alert(`Lỗi từ server: ${result.error || 'Không xác định'}`);
      }
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      alert('Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.');
    }
  };


  return (
    <>
      <div className="payment-methods">
        <h3>Phương thức thanh toán</h3>

        <p className="payment-method"><strong>Thanh toán ngay</strong></p>
        <div className="payment-option-buttons">
          {paymentMethods.filter(p => methodGroups.now.includes(p.code)).map(method => (
            <button key={method.code} className="payment-button" onClick={() => setSelectedMethod(method.code)}>
              <img src={`/images/${method.icon_url}`} alt={method.name} className="payment-icon" />
              {method.name}
            </button>
          ))}
        </div>

        
        <p className="payment-method"><strong>Giữ mã đặt chỗ & Thanh toán sau</strong></p>
        {paymentMethods.filter(p => methodGroups.hold.includes(p.code)).map(method => (
          <button
            key={method.code}
            className="payment-button"
            onClick={async () => {
              const paymentMethodId = method.id;

              // Lấy userId từ localStorage
              const storedUser = JSON.parse(localStorage.getItem('user'));
              const userId = storedUser?.id;

              if (!userId) {
                alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
                return;
              }

              // if (!userId) {
              //   navigate('/login', { state: { from: '/payment' } });
              //   return;
              // }

              try {
                const response = await fetch('http://localhost:5001/api/passengers/payment-method', {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    passengerIds: passengerInfo.map(p => p.id),
                    paymentMethodId: paymentMethodId,
                    totalPrice: grandTotal,
                    userId: userId
                  }),
                });

                const data = await response.json();
                if (response.ok) {
                  console.log('Cập nhật phương thức thanh toán thành công:', data.message);

                  navigate('/pay-later', {
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
                      totalPrice: grandTotal,
                      contactInfo,
                      userId,
                    },
                  });
                } else {
                  console.error('Lỗi khi cập nhật phương thức thanh toán:', data.error);
                  alert('Có lỗi khi cập nhật phương thức thanh toán. Vui lòng thử lại!');
                }
              } catch (error) {
                console.error('Lỗi kết nối API:', error);
                alert('Đã xảy ra lỗi khi cập nhật phương thức thanh toán');
              }
            }}
          >
            <img src={`/images/${method.icon_url}`} alt={method.name} className="payment-icon" />
            {method.name}
          </button>
        ))}


        <p className="payment-method"><strong>Thanh toán trả sau</strong></p>
        {paymentMethods.filter(p => methodGroups.later.includes(p.code)).map(method => (
          <button key={method.code} className="payment-button" onClick={() => setSelectedMethod(method.code)}>
            <img src={`/images/${method.icon_url}`} alt={method.name} className="payment-icon" />
            {method.name}
          </button>
        ))}


        {/* Nội dung theo phương thức đã chọn */}
        <div className="selected-method-content">
          {selectedMethod === 'card' && (
            <div className="payment-details-form">
              <h4>Thông tin thẻ & chủ thẻ</h4>
              <input
                type="text"
                placeholder="Chủ thẻ"
                name="cardholder_name"
                value={cardDetails.cardholder_name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                placeholder="4 chữ số cuối của thẻ"
                name="last_four_digits"
                value={cardDetails.last_four_digits}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                placeholder="Ngày hết hạn (MM/YY)"
                name="expiration_date"
                value={cardDetails.expiration_date}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                placeholder="CVV"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                placeholder="Token thẻ (Card Token)"
                name="card_token"
                value={cardDetails.card_token}
                onChange={handleInputChange}
              />
              <button type="button" onClick={handleSubmit}>Xác nhận thanh toán</button>
            </div>
          )}

          {selectedMethod === 'momo' && (
            <div className="payment-qrcode">
              <h4>Quét QR Momo</h4>
              <img src="/images/momo-qr.png" alt="Mã QR Momo" className="qr-code" />
              <div className="payment-info">
                <p><strong>Tổng cộng:</strong> {formatCurrency(grandTotal)}</p>
                <p><strong>Tài khoản:</strong> {accountNumber} ({accountName})</p>
                <p><strong>Nội dung chuyển khoản:</strong> {note}</p>
              </div>
            </div>
          )}

          {selectedMethod === 'qr' && (
            <div className="payment-qrcode">
              <h4>Quét QR MBBank</h4>
              <img src={vietQRUrl} alt="Banking QR" className="qr-code" />
              <div className="payment-info">
                <p><strong>Tổng cộng:</strong> {formatCurrency(grandTotal)}</p>
                <p><strong>Tài khoản:</strong> {accountNumber} ({accountName})</p>
                <p><strong>Nội dung chuyển khoản:</strong> {note}</p>
              </div>
            </div>
          )}


          {selectedMethod === 'postpaid' && (
            <div className="postpaid-info">
              <h4>Thông tin trả sau</h4>

              {/* Điều khoản trả sau */}
              <div className="terms-postpaid">
                <p><strong>Điều khoản:</strong></p>
                <ul className="postpaid-terms-list">
                  <li>Trả sau trong 30 ngày hoặc trả góp theo kỳ hạn</li>
                  <li>Phí dịch vụ có thể được áp dụng tùy theo đơn vị</li>
                  <li>Xét duyệt thông tin sẽ được thực hiện tự động qua các đối tác</li>
                </ul>
              </div>
              <div className="checkbox">
                <input
                  type="checkbox"
                  id="agree-postpaid"
                  checked={isAgreedPostpaid}
                  onChange={(e) => setIsAgreedPostpaid(e.target.checked)}
                />
                <label htmlFor="agree-postpaid">Tôi đồng ý với điều khoản trả sau</label>
              </div>

              {/* Chỉ hiển thị khi người dùng đồng ý điều khoản */}
              {isAgreedPostpaid && (
                <div className="partners-buttons">
                  <h5>Chọn đơn vị hỗ trợ trả sau</h5>
                  <div className="payment-option-buttons">
                    {postpaidPartners.map((partner) => (
                      <div className="partner-card" key={partner.id}>
                        <button
                          className="payment-button"
                          onClick={() => setSelectedPartner(partner.name)}
                        >
                          <img
                            src={`/images/${partner.logo_url}`} 
                            alt={partner.name}
                            className="payment-icon"
                          />
                          {partner.name}
                        </button>
                        <p className="partner-desc">{partner.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal hiển thị khi chọn đối tác */}
              {selectedPartner && (
                <div className="loan-modal">
                  <div className="loan-modal-content">
                    <button className="close-modal" onClick={() => setSelectedPartner(null)}>×</button>
                    <h4>Đăng ký vay – {selectedPartner}</h4>
                    <form onSubmit={submitPostpaidForm}>
                      <input type="text" name="full_name" placeholder="Họ tên" onChange={handlePostpaidChange} />
                      <input type="text" name="national_id" placeholder="CMND/CCCD" onChange={handlePostpaidChange} />
                      <input type="email" name="email" placeholder="Email" onChange={handlePostpaidChange} />
                      <input type="text" name="phone" placeholder="Số điện thoại" onChange={handlePostpaidChange} />
                      <input type="text" name="address" placeholder="Địa chỉ" onChange={handlePostpaidChange} />
                      <input type="text" name="occupation" placeholder="Nghề nghiệp" onChange={handlePostpaidChange} />
                      <input type="number" name="monthly_income" placeholder="Thu nhập hàng tháng" onChange={handlePostpaidChange} />
                      <input type="number" name="postpaid_partner_id" placeholder="ID đối tác trả sau" onChange={handlePostpaidChange} />

                      <button type="submit">Gửi hồ sơ trả sau</button>
                    </form>

                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        </div>

        <div className="payment-summary">
          <h3>Chi tiết thanh toán</h3>
          <p><strong>Tạm tính:</strong> {formatCurrency(subtotal)}</p>
          <p><strong>Mã giảm giá:</strong> -{formatCurrency(goDiscount + backDiscount)}</p>
          <p><strong>Phí dịch vụ:</strong> {formatCurrency(serviceFee)}</p>
          <p className="total-amount">
            <strong>Tổng cộng:</strong> {formatCurrency(grandTotal)}</p>
        </div>


        <div className="terms">
          <input
            type="checkbox"
            id="terms"
            checked={isChecked}   // Gắn giá trị checked cho checkbox
            onChange={(e) => setIsChecked(e.target.checked)}  // Cập nhật state khi người dùng tick checkbox
          />
          <label htmlFor="terms">
            Tôi đã đọc, hiểu và đồng ý với{' '}
            <span
              className="link-text"
              role="button"
              tabIndex={0}
              onClick={() => setShowModal(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setShowModal(true);
                }
              }}
            >
              Điều lệ vận chuyển, điều kiện vé và Quy định vật dụng bị cấm mang lên máy bay
            </span>.
          </label>

          {showModal && (
            <div
              className="modal-overlay"
              role="presentation"
              onClick={() => setShowModal(false)}
            >
              <div className="modal-content">
                <h2>Điều lệ và Quy định</h2>
                <p><strong>Điều lệ vận chuyển</strong></p>
                <ul>
                  <li><strong>Check-in:</strong> Hành khách cần có mặt trước 2 giờ (nội địa) và 3 giờ (quốc tế).</li>
                  <li><strong>Hành lý:</strong> Hành lý xách tay tối đa 7kg, hành lý ký gửi 20kg (hạng phổ thông).</li>
                  <li><strong>Trách nhiệm:</strong> Hành khách đảm bảo giấy tờ tùy thân và tuân thủ quy định an ninh.</li>
                </ul>

                <p><strong>Điều kiện vé</strong></p>
                <ul>
                  <li><strong>Hủy/hoàn vé:</strong> Có thể hủy hoặc thay đổi theo quy định của từng hạng vé với phí phụ trội.</li>
                  <li><strong>Thay đổi hành trình:</strong> Chịu phí thay đổi nếu có yêu cầu trước giờ bay.</li>
                </ul>

                <p><strong>Quy định vật dụng bị cấm</strong></p>
                <ul>
                  <li><strong>Cấm mang lên:</strong> Chất nổ, dễ cháy, chất ăn mòn, vũ khí, vật sắc nhọn.</li>
                  <li><strong>Giới hạn:</strong> Chất lỏng, gel, kem (tối đa 100ml mỗi món, tổng không quá 1 lít).</li>
                  <li><strong>Pin dự phòng:</strong> Mang trong hành lý xách tay.</li>
                </ul>

                <button onClick={() => setShowModal(false)}>Đóng</button>
              </div>
            </div>
          )}

        </div>

        <div className="button-container">
          <button className="btn-payment" onClick={handlePayment} disabled={!isChecked}>
            Thanh toán
          </button>
        </div>


      </>
    );
  };

PaymentMethod.propTypes = {
  selectedFlight: PropTypes.object.isRequired,
  returnFlight: PropTypes.object,
  tripType: PropTypes.string.isRequired,
  adults: PropTypes.number.isRequired,
  childCount: PropTypes.number.isRequired,
  infants: PropTypes.number.isRequired,
  voucherDiscount: PropTypes.number,
  passengerInfo: PropTypes.array.isRequired,
  baggageOptions: PropTypes.array.isRequired,
  mealOptions: PropTypes.array.isRequired,
  departureDate: PropTypes.string.isRequired,
  returnDate: PropTypes.string,
  contactInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired
  }).isRequired,
};

export default PaymentMethod;