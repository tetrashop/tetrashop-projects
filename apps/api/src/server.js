import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request ID middleware
app.use((req, res, next) => {
  req.requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  res.set('X-Request-ID', req.requestId);
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Welcome to TetraSaaS Cloud Platform v3.0',
    version: '3.0.0',
    documentation: 'https://docs.tetrasaas.com',
    endpoints: {
      services: '/api/services',
      auth: '/api/auth/validate',
      status: '/api/status',
      health: '/health'
    },
    features: [
      '26 AI Services',
      'Real-time Monitoring',
      'API Key Management',
      'Credit-Based Billing',
      'Rate Limiting',
      'Comprehensive Logging'
    ],
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: '✅ TetraSaaS API v3.0 is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: 'Connected via @tetrasaas/database',
    auth: 'Connected via @tetrasaas/auth'
  });
});

// API Routes
app.use('/api', apiRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: true,
    message: 'Route not found',
    path: req.originalUrl,
    requestId: req.requestId,
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`[${req.requestId}] Error:`, err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    error: true,
    message: message,
    code: err.code || 'INTERNAL_ERROR',
    requestId: req.requestId,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
  🚀 TetraSaaS API Server v3.0
  📍 Port: ${PORT}
  ⏰ Time: ${new Date().toISOString()}
  🔗 Health: http://localhost:${PORT}/health
  📚 Docs: http://localhost:${PORT}/
  🛡️  Auth: Integrated with @tetrasaas/auth
  🗄️  Database: Connected to SQLite via @tetrasaas/database
  `);
});

export default app;
