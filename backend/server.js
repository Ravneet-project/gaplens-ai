
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const researchRoutes = require('./routes/researchRoutes');

const app = express();

// Security
app.disable('x-powered-by');

// Allowed frontend URLs
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://gaplens-ai.onrender.com'
];

// Support additional frontend URLs from Render environment
if (process.env.FRONTEND_URL) {
  const extraOrigins = process.env.FRONTEND_URL
    .split(',')
    .map(origin => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  allowedOrigins.push(...extraOrigins);
}

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without Origin (e.g. server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/+$/, '');

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      console.warn('CORS blocked origin:', origin);
      return callback(null, false);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204
  })
);

// JSON request body
app.use(express.json({ limit: '100kb' }));

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'GapLens AI Backend is running',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'GapLens AI backend is running',
    timestamp: new Date().toISOString()
  });
});

// Research API
app.use('/api/research', researchRoutes);

// Unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found.'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);

  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Request payload is too large.'
    });
  }

  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred.'
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`GapLens AI API running on port ${PORT}`);
  console.log('Allowed frontend origins:', [
    ...new Set(allowedOrigins)
  ]);
});
