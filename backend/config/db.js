const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'flight_booking',
    password: process.env.DB_PASSWORD || 'flight_booking',
    database: process.env.DB_NAME || 'flight_booking',
    waitForConnections: true,
    connectionLimit: 10
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
