const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'flight_booking'
});

(async () => {
    try {
        const connection = await db.getConnection();
        console.log('✅ Connected to MySQL');
        connection.release();
    } catch (err) {
        console.error('❌ Error connecting to MySQL:', err);
    }
})();

module.exports = db;