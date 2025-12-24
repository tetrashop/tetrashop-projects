import express from 'express';
const app = express();

app.get('/test-nlp/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (id >= 1 && id <= 251) {
    res.json({ 
      success: true, 
      id, 
      message: `پست ${id} از ۲۵۱`,
      total: 251 
    });
  } else {
    res.status(404).json({ 
      success: false, 
      error: 'پست یافت نشد',
      validRange: '۱ تا ۲۵۱'
    });
  }
});

app.get('/test-nlp', (req, res) => {
  res.json({ 
    total: 251, 
    page: 1, 
    posts: Array.from({length: 25}, (_, i) => ({id: i+1}))
  });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`✅ تست سرور روی پورت ${PORT}`);
  console.log(`   تست پست 251: curl http://localhost:${PORT}/test-nlp/251`);
  console.log(`   تست همه پست‌ها: curl http://localhost:${PORT}/test-nlp`);
});
