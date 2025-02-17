const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./Database/connection');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

// Create an Express app
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan('common'));
app.use(cookieParser());

// Connect to the database
connectDB();

// Route setup
app.use('/user', userRouter);

// Serve static files (frontend build)
const buildPath = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, '/client/dist')  // If production, use dist folder
  : path.join(__dirname, '/client/public'); // If development, use public folder
app.use(express.static(buildPath));

// Catch-all route for all other requests to serve index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// Set the port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
