const express = require('express');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./routes/user');
const airportsRoute = require('./routes/airports');
const searchRoutes = require('./routes/search');
const resultsRoutes = require('./routes/results');  
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
const paymentMethodRoutes = require('./routes/payment-method');


const adminUserRoutes = require('./routes/admin/user');
const adminAirlinesRoutes = require('./routes/admin/airlines');
const adminAircraftRoutes = require('./routes/admin/aircraft');
const adminAirportsRoutes = require('./routes/admin/airports');
const adminFlightsRoutes = require('./routes/admin/flights');
const adminBaggageRoutes = require('./routes/admin/baggage');
const adminMealsRoutes = require('./routes/admin/meals');
const adminPaymentMethodRoutes = require('./routes/admin/payment-method');
const adminVouchersRoutes = require('./routes/admin/vouchers');
const adminPostpaidRoutes = require('./routes/admin/postpaid');
const adminPassengersRoutes = require('./routes/admin/passengers');
const adminDashboardRoutes = require('./routes/admin/dashboard');


const app = express();
const PORT = 5001;

// Cấu hình CORS chi tiết
app.use(cors({
  origin: '*',  // Cho phép mọi origin để test
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());


// Đảm bảo rằng các route được sử dụng đúng cách
app.use('/api', userRoutes);
app.use('/api/airports', airportsRoute.router);
app.use('/api/search', searchRoutes);
app.use('/api/results', resultsRoutes);
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
app.use('/api/payment-method', paymentMethodRoutes);


// Admin Routes
app.use('/api/admin/user', adminUserRoutes);
app.use('/api/admin/airlines', adminAirlinesRoutes);
app.use('/api/admin/aircraft', adminAircraftRoutes);
app.use('/api/admin/airports', adminAirportsRoutes);
app.use('/api/admin/flights', adminFlightsRoutes);
app.use('/api/admin/baggage', adminBaggageRoutes);
app.use('/api/admin/meals', adminMealsRoutes);
app.use('/api/admin/payment-method', adminPaymentMethodRoutes);
app.use('/api/admin/vouchers', adminVouchersRoutes);
app.use('/api/admin/postpaid', adminPostpaidRoutes);
app.use('/api/admin/passengers', adminPassengersRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);


app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/icons', express.static(path.join(__dirname, 'public/icons')));
app.use('/logos', express.static(path.join(__dirname, 'public/logos')));


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});