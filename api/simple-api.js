export default function handler(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  
  if (pathname === '/' || pathname === '') {
    return res.json({
      message: '🚀 TetraSaaS v3.0',
      nlpPosts: 251,
      status: '✅ Deployed!',
      endpoints: [
        '/api/health',
        '/api/nlp',
        '/api/nlp/1..251',
        '/api/services',
        '/api/stats'
      ]
    });
  }
  
  if (pathname === '/api/health') {
    return res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  }
  
  if (pathname === '/api/nlp') {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const page = parseInt(url.searchParams.get('page')) || 1;
    
    return res.json({
      total: 251,
      page,
      posts: Array.from({length: 10}, (_, i) => ({
        id: i + 1,
        title: `NLP Project ${i + 1}`
      }))
    });
  }
  
  if (pathname.startsWith('/api/nlp/')) {
    const id = pathname.split('/')[3];
    return res.json({
      id: parseInt(id),
      title: `NLP Project ${id}`,
      note: `This is project ${id} of 251 NLP projects`
    });
  }
  
  return res.status(404).json({ error: 'Not found' });
}
