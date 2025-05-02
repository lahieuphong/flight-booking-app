const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

router.get('/', async (req, res) => {
    try {
      const [results] = await db.execute('SELECT * FROM airlines'); 
      res.json(results);
    } catch (err) {
      console.error('❌ Error fetching cities:', err);
      res.status(500).json({ error: 'Failed to fetch cities' });
    }
});

module.exports = router;