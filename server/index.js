const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
// Parse application/json
app.use(bodyParser.json());
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Welcome Route
app.get('/', (req, res) => {
  res.json({ message: 'ShopEZ E-commerce API is running...' });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connection verified
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
