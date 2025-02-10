const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./Database/connection');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan'); 
const userRouter = require('./routes/userRoutes')
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); 
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); 
app.use(morgan('common')); 
app.use(cookieParser());
connectDB();


app.use('/user', userRouter);
app.use(express.static(path.join(__dirname, '/client/dist')))
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
});


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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
