const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ API lấy khoảng giá từ database
router.get('/min-max', async (req, res) => {
    try {
        // Cập nhật câu truy vấn SQL để lấy giá min và max từ bảng flight_prices
        const result = await db.query(`
            SELECT 
                MIN(CAST(fp.price_adult AS DECIMAL(10, 2))) AS min_price, 
                MAX(CAST(fp.price_adult AS DECIMAL(10, 2))) AS max_price 
            FROM flight_prices fp
        `);
        // Trả về kết quả
        res.json(result[0]);
    } catch (error) {
        console.error('Lỗi khi lấy giá vé:', error);
        res.status(500).json({ error: 'Lỗi khi lấy giá vé' });
    }
});

module.exports = router;