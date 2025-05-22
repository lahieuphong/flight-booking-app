// Express route for aircraft types
const express = require('express');
const router = express.Router();
const db = require('../../config/db'); 

// Get all aircraft types
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM aircraft_types');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách loại máy bay' });
  }
});

// Add aircraft type
router.post('/', async (req, res) => {
  const { type_name, description } = req.body;
  try {
    await db.execute(
      'INSERT INTO aircraft_types (type_name, description) VALUES (?, ?)',
      [type_name, description]
    );
    res.status(201).json({ message: 'Đã thêm loại máy bay' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi thêm loại máy bay' });
  }
});

// Update aircraft type
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { type_name, description } = req.body;
  try {
    await db.execute(
      'UPDATE aircraft_types SET type_name = ?, description = ? WHERE id = ?',
      [type_name, description, id]
    );
    res.json({ message: 'Đã cập nhật loại máy bay' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi cập nhật loại máy bay' });
  }
});

// Delete aircraft type
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM aircraft_types WHERE id = ?', [id]);
    res.json({ message: 'Đã xóa loại máy bay' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi xóa loại máy bay' });
  }
});

module.exports = router;