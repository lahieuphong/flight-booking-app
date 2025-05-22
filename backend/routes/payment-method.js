const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Kết nối CSDL

// GET /api/payment-method - Lấy danh sách phương thức thanh toán
router.get('/', async (req, res) => {
  try {
    const [results] = await db.execute(`
      SELECT id, code, name, description, icon_url, is_active 
      FROM payment_method
      WHERE is_active = TRUE
    `);
    res.json(results);
  } catch (error) {
    console.error('Lỗi khi lấy phương thức thanh toán:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});


// Hàm chuyển đổi ngày từ MM/YY thành YYYY-MM-DD (ngày cuối tháng)
function convertExpirationDate(expirationDate) {
  const [month, year] = expirationDate.split('/'); // Tách tháng và năm từ chuỗi MM/YY
  const currentYear = new Date().getFullYear().toString().slice(0, 2); // Lấy 2 chữ số đầu của năm hiện tại
  const fullYear = currentYear + year; // Ghép năm hiện tại với năm từ dữ liệu (YYYY)

  // Chuyển thành ngày cuối tháng
  const lastDayOfMonth = new Date(fullYear, month, 0).getDate(); // Tìm ngày cuối của tháng

  // Trả về ngày cuối tháng ở định dạng YYYY-MM-DD
  return `${fullYear}-${month.padStart(2, '0')}-${lastDayOfMonth}`;
}


// POST /api/payment-method/card-payment - Thêm thông tin thẻ thanh toán
router.post('/card-payment', async (req, res) => {
  const { cardholder_name, last_four_digits, expiration_date, card_token, cvv, payment_method_code } = req.body;

  // Kiểm tra và thay thế giá trị trống thành null
  const formattedCardholderName = cardholder_name || null;
  const formattedLastFourDigits = last_four_digits || null;
  const formattedExpirationDate = expiration_date || null;
  const formattedCardToken = card_token || null;
  const formattedCvv = cvv || null;
  const formattedPaymentMethodCode = payment_method_code || null;

  try {
    // Chuyển đổi ngày hết hạn từ MM/YY thành YYYY-MM-DD
    const formattedExpirationDate = convertExpirationDate(expiration_date);

    // Thực hiện truy vấn INSERT vào bảng card_payment
    const [result] = await db.execute(`
      INSERT INTO card_payment (cardholder_name, last_four_digits, expiration_date, card_token, cvv, payment_method_code)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [formattedCardholderName, formattedLastFourDigits, formattedExpirationDate, formattedCardToken, formattedCvv, formattedPaymentMethodCode]);

    // Trả về kết quả thành công cùng với ID của bản ghi vừa được thêm
    res.status(201).json({
      message: 'Thêm thông tin thẻ thành công',
      id: result.insertId  // Trả về ID của bản ghi mới được thêm
    });
  } catch (error) {
    console.error('Lỗi khi thêm thông tin thẻ:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});


// GET /api/payment-method/postpaid-partner - Lấy danh sách đối tác trả sau
router.get('/postpaid-partner', async (req, res) => {
  try {
    const [partners] = await db.execute(`
      SELECT id, name, description, logo_url, is_active, payment_method_code 
      FROM postpaid_partner
      WHERE is_active = 1
    `);
    res.json(partners);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đối tác trả sau:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});


// POST /api/payment-method/postpaid-application
router.post('/postpaid-application', async (req, res) => {
  const {
    full_name,
    national_id,
    email,
    phone,
    address,
    occupation,
    monthly_income,
    postpaid_partner_id
  } = req.body;

  try {
    // Gán null cho các trường không bắt buộc nếu chúng trống
    const data = [
      full_name || null,
      national_id || null,
      email || null,
      phone || null,
      address || null,
      occupation || null,
      monthly_income || null,
      postpaid_partner_id || null
    ];

    const [result] = await db.execute(`
      INSERT INTO postpaid_application
      (full_name, national_id, email, phone, address, occupation, monthly_income, postpaid_partner_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, data);

    res.status(201).json({
      message: 'Đăng ký trả sau thành công',
      id: result.insertId
    });
  } catch (error) {
    console.error('Lỗi khi thêm hồ sơ trả sau:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});


module.exports = router;