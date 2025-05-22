const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// GET all airports
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM airports');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create new airport
router.post('/', async (req, res) => {
  const { name, code } = req.body;
  if (!name || !code) {
    return res.status(400).json({ error: 'Missing name or code' });
  }

  try {
    await db.execute('INSERT INTO airports (name, code) VALUES (?, ?)', [name, code]);
    res.json({ message: 'Airport added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update airport
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, code } = req.body;

  try {
    await db.execute('UPDATE airports SET name = ?, code = ? WHERE id = ?', [name, code, id]);
    res.json({ message: 'Airport updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE airport
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute('DELETE FROM airports WHERE id = ?', [id]);
    res.json({ message: 'Airport deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;