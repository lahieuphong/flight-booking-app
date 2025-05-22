const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Kết nối CSDL

// API đăng nhập
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc!' });
  }

  try {
    // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
    const [user] = await db.execute(`
      SELECT id, username, email, password, role, is_active
      FROM users
      WHERE email = ? AND is_active = 1
    `, [email]);

    if (user.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng với email này!' });
    }

    // Kiểm tra mật khẩu trực tiếp (không mã hóa)
    if (password !== user[0].password) {
      return res.status(401).json({ message: 'Sai mật khẩu!' });
    }

    // Trả về thông tin người dùng nếu đăng nhập thành công
    res.json({
      message: 'Đăng nhập thành công!',
      user: {
        id: user[0].id,
        username: user[0].username,
        email: user[0].email,
        role: user[0].role
      }
    });
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});



// API đăng ký (Insert người dùng mới)
router.post('/register', async (req, res) => {
  const { username, email, password, role = 'user' } = req.body; // role mặc định là 'user'

  // Kiểm tra dữ liệu nhập vào
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Tên người dùng, email và mật khẩu là bắt buộc!' });
  }

  try {
    // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
    const [existingUser] = await db.execute(`
      SELECT id FROM users WHERE email = ?
    `, [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email đã tồn tại!' });
    }

    // Thực hiện chèn người dùng mới vào cơ sở dữ liệu
    const [result] = await db.execute(`
      INSERT INTO users (username, email, password, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    // Trả về kết quả thành công
    res.status(201).json({
      message: 'Đăng ký thành công!',
      user: {
        id: result.insertId,
        username,
        email,
        role
      }
    });
  } catch (error) {
    console.error('Lỗi khi đăng ký người dùng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

module.exports = router;