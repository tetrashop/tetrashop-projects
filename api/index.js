// api/index.js
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
    environment: process.env.NODE_ENV || 'production',
    version: '3.0.0',
    note: 'For full database functionality, connect to PostgreSQL'
  });
});

// NLP Page with 251 posts
app.get('/api/nlp', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;
  const totalPosts = 251;
  const totalPages = Math.ceil(totalPosts / limit);
  
  // Generate mock posts
  const generatePosts = () => {
    const posts = [];
    const categories = ['Sentiment Analysis', 'Text Classification', 'NER', 'Summarization', 'Translation'];
    const statuses = ['Active', 'Pending', 'Completed', 'Archived'];
    
    for (let i = 1; i <= limit && ((page - 1) * limit + i) <= totalPosts; i++) {
      const postId = (page - 1) * limit + i;
      posts.push({
        id: postId,
        title: `NLP Project ${postId}`,
        description: `Natural Language Processing project #${postId} focusing on AI text analysis`,
        category: categories[Math.floor(Math.random() * categories.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        author: `Researcher ${Math.floor(Math.random() * 50) + 1}`,
        createdAt: new Date(Date.now() - Math.random() * 31536000000).toISOString(),
        updatedAt: new Date().toISOString(),
        views: Math.floor(Math.random() * 1000) + 100,
        likes: Math.floor(Math.random() * 500) + 50,
        tags: ['AI', 'NLP', 'Machine Learning', 'Text Processing'],
        progress: Math.floor(Math.random() * 100),
        priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)]
      });
    }
    return posts;
  };

  res.json({
    success: true,
    message: 'NLP Projects Page',
    data: {
      page,
      limit,
      totalPosts,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      posts: generatePosts()
    },
    pagination: {
      current: page,
      next: page < totalPages ? `/api/nlp?page=${page + 1}&limit=${limit}` : null,
      previous: page > 1 ? `/api/nlp?page=${page - 1}&limit=${limit}` : null,
      first: `/api/nlp?page=1&limit=${limit}`,
      last: `/api/nlp?page=${totalPages}&limit=${limit}`
    },
    stats: {
      totalProjects: 251,
      activeProjects: 189,
      completedProjects: 45,
      pendingReview: 17,
      averageProgress: 78
    },
    timestamp: new Date().toISOString()
  });
});

// All Services
app.get('/api/services', (req, res) => {
  res.json({
    success: true,
    count: 26,
    services: [
      { id: 1, name: 'Sentiment Analysis', category: 'NLP', status: 'active', posts: 251 },
      { id: 2, name: 'Text Classification', category: 'NLP', status: 'active', posts: 189 },
      { id: 3, name: 'Named Entity Recognition', category: 'NLP', status: 'active', posts: 167 },
      { id: 4, name: 'Text Summarization', category: 'NLP', status: 'active', posts: 142 },
      { id: 5, name: 'Machine Translation', category: 'NLP', status: 'active', posts: 98 },
      { id: 6, name: 'Speech Recognition', category: 'Audio Processing', status: 'active', posts: 76 },
      { id: 7, name: 'Image Classification', category: 'Computer Vision', status: 'active', posts: 211 },
      { id: 8, name: 'Object Detection', category: 'Computer Vision', status: 'active', posts: 187 },
      { id: 9, name: 'Image Generation', category: 'Computer Vision', status: 'active', posts: 154 },
      { id: 10, name: 'Video Analysis', category: 'Computer Vision', status: 'active', posts: 89 },
      { id: 11, name: 'Predictive Analytics', category: 'Data Science', status: 'active', posts: 178 },
      { id: 12, name: 'Anomaly Detection', category: 'Data Science', status: 'active', posts: 132 },
      { id: 13, name: 'Recommendation System', category: 'Data Science', status: 'active', posts: 167 },
      { id: 14, name: 'Fraud Detection', category: 'Security', status: 'active', posts: 98 },
      { id: 15, name: 'Chatbot Development', category: 'Conversational AI', status: 'active', posts: 211 },
      { id: 16, name: 'Voice Assistant', category: 'Conversational AI', status: 'active', posts: 87 },
      { id: 17, name: 'Code Generation', category: 'Developer Tools', status: 'active', posts: 143 },
      { id: 18, name: 'Code Review', category: 'Developer Tools', status: 'active', posts: 98 },
      { id: 19, name: 'Document Analysis', category: 'OCR & Document', status: 'active', posts: 176 },
      { id: 20, name: 'Form Processing', category: 'OCR & Document', status: 'active', posts: 121 },
      { id: 21, name: 'Medical Diagnosis', category: 'Healthcare AI', status: 'active', posts: 87 },
      { id: 22, name: 'Drug Discovery', category: 'Healthcare AI', status: 'active', posts: 65 },
      { id: 23, name: 'Financial Forecasting', category: 'Finance AI', status: 'active', posts: 154 },
      { id: 24, name: 'Risk Assessment', category: 'Finance AI', status: 'active', posts: 132 },
      { id: 25, name: 'Content Moderation', category: 'Social Media', status: 'active', posts: 187 },
      { id: 26, name: 'Trend Analysis', category: 'Social Media', status: 'active', posts: 143 }
    ],
    categories: {
      'NLP': 5,
      'Computer Vision': 4,
      'Data Science': 3,
      'Conversational AI': 2,
      'Developer Tools': 2,
      'OCR & Document': 2,
      'Healthcare AI': 2,
      'Finance AI': 2,
      'Social Media': 2,
      'Audio Processing': 1,
      'Security': 1
    },
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
      home: '/',
      health: '/api/health',
      services: '/api/services',
      nlp: '/api/nlp?page=1&limit=25',
      docs: 'https://docs.tetrasaas.com'
    },
    stats: {
      totalServices: 26,
      totalCategories: 11,
      nlpPosts: 251,
      activeProjects: 189,
      platformStatus: 'Operational'
    },
    deployment: {
      platform: 'Vercel',
      environment: 'production',
      database: 'Mock Data (PostgreSQL ready)'
    },
    note: 'Connect PostgreSQL database for full functionality',
    support: 'contact@tetrasaas.com',
    timestamp: new Date().toISOString()
  });
});

// Vercel requires this export
export default app;
