import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import eventRoutes from './routes/events.js';
import registrationRoutes from './routes/registrations.js';
import attendanceRoutes from './routes/attendance.js';
import certificateRoutes from './routes/certificates.js';

// Load environment variables ONCE at the app entry point
dotenv.config();

console.log('🔄 Loading environment variables in app.js...');
console.log('ALCHEMY_URL:', process.env.ALCHEMY_URL ? '✅ Loaded' : '❌ Missing');
console.log('PRIVATE_KEY:', process.env.PRIVATE_KEY ? '✅ Loaded' : '❌ Missing');
console.log('CONTRACT_ADDRESS:', process.env.CONTRACT_ADDRESS ? '✅ Loaded' : '❌ Missing');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use real routes
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/certificates', certificateRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Blockcerts Backend API is running! 🚀',
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});