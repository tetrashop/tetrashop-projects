// Vercel Serverless Function - TetraSaaS API
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: '✅ TetraSaaS API v3.0 is running on Vercel',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    note: 'SQLite is not available on Vercel. Use PostgreSQL for production.'
  });
});

// Services list (mock for now)
app.get('/api/services', (req, res) => {
  res.json({
    success: true,
    count: 26,
    message: 'TetraSaaS AI Services Platform',
    services: [
      { name: 'Image Enhancement', category: 'Computer Vision', status: 'available' },
      { name: 'Sentiment Analysis', category: 'NLP', status: 'available' },
      { name: 'Text Summarization', category: 'NLP', status: 'available' }
    ],
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 TetraSaaS Cloud Platform v3.0',
    version: '3.0.0',
    status: 'API is running on Vercel',
    endpoints: {
      health: '/api/health',
      services: '/api/services',
      docs: 'https://docs.tetrasaas.com'
    },
    note: 'Full database functionality requires PostgreSQL setup',
    timestamp: new Date().toISOString()
  });
});

// Vercel requires exporting the app
export default app;
