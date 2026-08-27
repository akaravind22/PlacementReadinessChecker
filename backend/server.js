const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Files Statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Route / Health Check
app.get('/', (req, res) => {
  res.json({
    message: 'Placement Readiness Checker API is online',
    version: '1.0.0',
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/officer', require('./routes/officerRoutes'));
app.use('/api/drives', require('./routes/driveRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Global Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` Placement Readiness Checker Backend Server Running `);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Port: ${PORT}`);
  console.log(` Base URL: http://localhost:${PORT}`);
  console.log(`=================================================`);
});
