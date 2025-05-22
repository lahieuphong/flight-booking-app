const express = require('express');
const router = express.Router();
const db = require('../../config/db'); // Cấu hình kết nối MySQL

// Lấy tất cả hành khách
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id, p.first_name, p.last_name, p.gender, p.dob, p.id_number,
        
        fr.flight_number,
        
        ci.name AS contact_name, ci.phone, ci.email, ci.address,
        
        pm.name AS payment_method_name, pm.icon_url,
        v.code AS voucher_code

      FROM passengers p
      LEFT JOIN contact_info ci ON p.contact_info_id = ci.id
      LEFT JOIN payment_method pm ON p.payment_method_id = pm.id
      LEFT JOIN vouchers v ON p.voucher_id = v.id
      LEFT JOIN flight_results fr ON p.flight_id = fr.id
      ORDER BY p.id DESC

    `);

    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách hành khách:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});



// Lấy tất cả thông tin liên hệ
router.get('/contact-info', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, name, phone, email, address FROM contact_info ORDER BY id DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy contact_info:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Thêm thông tin liên hệ
router.post('/contact-info', async (req, res) => {
  const { name, phone, email, address } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO contact_info (name, phone, email, address) VALUES (?, ?, ?, ?)`,
      [name, phone, email, address]
    );
    res.status(201).json({ id: result.insertId, name, phone, email, address });
  } catch (error) {
    console.error('Lỗi khi thêm contact_info:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Cập nhật thông tin liên hệ
router.put('/contact-info/:id', async (req, res) => {
  const contactId = req.params.id;
  const { name, phone, email, address } = req.body;
  try {
    await db.query(
      `UPDATE contact_info SET name = ?, phone = ?, email = ?, address = ? WHERE id = ?`,
      [name, phone, email, address, contactId]
    );
    res.json({ id: contactId, name, phone, email, address });
  } catch (error) {
    console.error('Lỗi khi cập nhật contact_info:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Xóa thông tin liên hệ
router.delete('/contact-info/:id', async (req, res) => {
  const contactId = req.params.id;
  try {
    await db.query(`DELETE FROM contact_info WHERE id = ?`, [contactId]);
    res.json({ message: 'Đã xóa thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa contact_info:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;




