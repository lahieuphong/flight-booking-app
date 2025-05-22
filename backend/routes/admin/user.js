const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// Lấy danh sách user
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username, email, password, role, is_active FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Thêm user mới
router.post('/', async (req, res) => {
  const { username, email, password, role = 'user', is_active = 1 } = req.body;
  
  // Kiểm tra xem các trường có hợp lệ không
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Thêm người dùng mới vào cơ sở dữ liệu (mật khẩu sẽ được lưu dưới dạng văn bản thuần túy)
    const [result] = await db.query(
      'INSERT INTO users (username, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)',
      [username, email, password, role, is_active]
    );
    res.status(201).json({ id: result.insertId, username, email, role, is_active });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cập nhật user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, role, is_active, password } = req.body;

  try {
    // Cập nhật người dùng. Nếu có trường mật khẩu thì sẽ cập nhật mật khẩu
    const query = password
      ? 'UPDATE users SET username = ?, email = ?, password = ?, role = ?, is_active = ? WHERE id = ?'
      : 'UPDATE users SET username = ?, email = ?, password = ?, role = ?, is_active = ? WHERE id = ?';

    const values = password
      ? [username, email, password, role, is_active, id]
      : [username, email, password, role, is_active, id];

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ id: Number(id), username, email, password, role, is_active });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Xóa user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;