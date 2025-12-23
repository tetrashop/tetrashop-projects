import express from "express";
const app = express();
app.get("/", (req, res) => res.json({ 
  message: "TetraSaaS API", 
  nlpPosts: 251,
  status: "✅ Running on Vercel" 
}));
app.get("/api/nlp", (req, res) => res.json({ 
  total: 251, 
  page: 1, 
  posts: Array.from({length: 25}, (_, i) => ({id: i+1, title: `NLP Post ${i+1}`}))
}));
export default app;
