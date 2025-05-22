const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// GET all baggage
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM baggage ORDER BY weight');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create new baggage
router.post('/', async (req, res) => {
  const { weight, price } = req.body;
  if (!weight || price === undefined) {
    return res.status(400).json({ error: 'Missing weight or price' });
  }

  try {
    await db.execute('INSERT INTO baggage (weight, price) VALUES (?, ?)', [weight, price]);
    res.json({ message: 'Baggage added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update baggage
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { weight, price } = req.body;

  if (!weight || price === undefined) {
    return res.status(400).json({ error: 'Missing weight or price' });
  }

  try {
    await db.execute('UPDATE baggage SET weight = ?, price = ? WHERE id = ?', [weight, price, id]);
    res.json({ message: 'Baggage updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE baggage
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute('DELETE FROM baggage WHERE id = ?', [id]);
    res.json({ message: 'Baggage deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;