// backend/routes/meals.js
const express = require('express');
const router = express.Router();
const db = require('../../config/db'); 

// Lấy danh sách meals
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM meals ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Thêm meal mới
router.post('/', async (req, res) => {
  const { name, price, type } = req.body;
  if (!name || price == null || !type || !['food', 'drink'].includes(type)) {
    return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
  }
  try {
    const [result] = await db.execute(
      'INSERT INTO meals (name, price, type) VALUES (?, ?, ?)',
      [name, price, type]
    );
    res.status(201).json({ id: result.insertId, name, price, type });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Cập nhật meal
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, type } = req.body;
  if (!name || price == null || !type || !['food', 'drink'].includes(type)) {
    return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
  }
  try {
    const [result] = await db.execute(
      'UPDATE meals SET name = ?, price = ?, type = ? WHERE id = ?',
      [name, price, type, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    res.json({ id: Number(id), name, price, type });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Xóa meal
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM meals WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    res.json({ message: 'Xóa thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;