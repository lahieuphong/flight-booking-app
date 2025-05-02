const express = require('express');
const cors = require('cors');
const bookingRoutes = require('./routes/booking');


const airportsRoute = require('./routes/airports');

const searchRoutes = require('./routes/search');
const resultsRoutes = require('./routes/results');  // Import route results
const pricesRoutes = require('./routes/prices');
const seatsRoutes = require('./routes/seats');
const airlinesRoutes = require('./routes/airlines');
const aircraftRoutes = require('./routes/aircraft');
const priceRangeRoutes = require('./routes/price-range');

const updateSeatTypeRoute = require('./routes/update-seat-type');

const ticketConditionsRoute = require('./routes/ticket-conditions');

const timesRoutes = require('./routes/times');

const passengersRoutes = require('./routes/passengers');

const baggageRoutes = require('./routes/baggage');

const mealsRoutes = require('./routes/meals');

const vouchersRoutes = require('./routes/vouchers');

const contactInfoRoutes = require('./routes/contact-info');

const app = express();
const PORT = 5001;

// Cấu hình CORS chi tiết
app.use(cors({
  origin: '*',  // Cho phép mọi origin để test
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Đảm bảo rằng các route được sử dụng đúng cách
app.use('/api/booking', bookingRoutes);  // Các route booking



app.use('/api/airports', airportsRoute.router); // <== Thêm .router ở đây
app.use('/api/search', searchRoutes);    // Các route search

app.use('/api/results', resultsRoutes);  // Đảm bảo bạn sử dụng /api/results đúng
app.use('/api/prices', pricesRoutes);
app.use('/api/seats', seatsRoutes);
app.use('/api/airlines', airlinesRoutes);
app.use('/api/aircraft', aircraftRoutes);
app.use('/api/price-range', priceRangeRoutes);

app.use('/api/update-seat-type', updateSeatTypeRoute);

app.use('/api/ticket-conditions', ticketConditionsRoute);

app.use('/api/times', timesRoutes);

app.use('/api/passengers', passengersRoutes);

app.use('/api/baggage', baggageRoutes);

app.use('/api/meals', mealsRoutes);

app.use('/api/vouchers', vouchersRoutes);

app.use('/api/contact-info', contactInfoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});