
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const researchRoutes = require('./routes/researchRoutes');

const app = express();

app.disable('x-powered-by');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));

app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'GapLens AI backend is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/research', researchRoutes);

app.use((err, req, res, next) => {
  console.error('Server error:', err.message);

  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred.'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`GapLens AI API running on http://localhost:${PORT}`);
});
