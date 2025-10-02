import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple direct routes - no external imports
app.get('/api/events', (req, res) => {
  res.json({ 
    message: 'Events API is working!',
    endpoint: '/api/events'
  });
});

app.post('/api/events', (req, res) => {
  res.json({ 
    message: 'Event created successfully!',
    data: req.body
  });
});

app.get('/api/registrations', (req, res) => {
  res.json({ 
    message: 'Registrations API is working!',
    endpoint: '/api/registrations'
  });
});

app.post('/api/registrations', (req, res) => {
  res.json({ 
    message: 'Registration created successfully!',
    data: req.body
  });
});

app.get('/api/attendance', (req, res) => {
  res.json({ 
    message: 'Attendance API is working!',
    endpoint: '/api/attendance'
  });
});

app.post('/api/attendance/mark', (req, res) => {
  res.json({ 
    message: 'Attendance marked successfully!',
    data: req.body
  });
});

app.get('/api/certificates', (req, res) => {
  res.json({ 
    message: 'Certificates API is working!',
    endpoint: '/api/certificates'
  });
});

app.post('/api/certificates/generate', (req, res) => {
  res.json({ 
    message: 'Certificate generated successfully!',
    data: req.body
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Blockcerts Backend API is running! 🚀',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/events',
      '/api/registrations', 
      '/api/attendance',
      '/api/certificates'
    ]
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'production' ? {} : err.message 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});

export default app;