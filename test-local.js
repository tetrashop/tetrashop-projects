import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.json({ test: 'Local test passed', timestamp: new Date().toISOString() });
});

app.get('/api/nlp', (req, res) => {
  res.json({ total: 251, success: true });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Local API running on port ${PORT}`);
  console.log(`   Test with: curl http://localhost:${PORT}/api/nlp`);
});
