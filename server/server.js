const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const classRoutes = require('./routes/classes');
const assignmentRoutes = require('./routes/assignments');
const studentRoutes = require('./routes/student');
const printRoutes = require('./routes/print');
const notifyRoutes = require('./routes/notify');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'https://assignment-hub-eight.vercel.app',
  'http://localhost:5173' // for local dev
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/assignmenthub', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.log('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/print', printRoutes);
app.use('/api/notify', notifyRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AssignmentHub server is running!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 AssignmentHub API ready at http://localhost:${PORT}/api`);
});