import express from 'express';

const app = express();

// Middleware
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: '✅ TetraSaaS API is running',
    timestamp: new Date().toISOString(),
    version: '3.0.0'
  });
});

// NLP endpoint با 251 پست
app.get('/api/nlp', (req, res) => {
  const totalPosts = 251;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;
  
  res.json({
    success: true,
    totalPosts: 251,
    page,
    limit,
    message: 'NLP Projects - Total 251 posts',
    data: {
      posts: Array.from({ length: Math.min(limit, totalPosts - (page-1)*limit) }, (_, i) => ({
        id: (page - 1) * limit + i + 1,
        title: `NLP Research Project ${(page - 1) * limit + i + 1}`,
        description: `Natural Language Processing research and implementation`,
        author: `Researcher ${i + 1}`,
        createdAt: new Date().toISOString()
      }))
    }
  });
});

// Services endpoint
app.get('/api/services', (req, res) => {
  res.json({
    success: true,
    services: [
      { id: 1, name: 'Sentiment Analysis', category: 'NLP', posts: 251 },
      { id: 2, name: 'Text Classification', category: 'NLP', posts: 189 },
      { id: 3, name: 'Named Entity Recognition', category: 'NLP', posts: 167 },
      { id: 4, name: 'Text Summarization', category: 'NLP', posts: 142 },
      { id: 5, name: 'Machine Translation', category: 'NLP', posts: 98 }
    ],
    totalServices: 26
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 TetraSaaS Platform API',
    version: '3.0.0',
    endpoints: {
      root: '/',
      health: '/api/health',
      nlp: '/api/nlp',
      services: '/api/services'
    },
    stats: {
      totalNLPosts: 251,
      totalServices: 26,
      status: 'Operational'
    }
  });
});

// برای Vercel
export default app;
