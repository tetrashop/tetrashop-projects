import blogPosts from '../../../data/blogPosts.json';

export default function handler(req, res) {
  const { slug } = req.query;
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) return res.status(404).json({ error: 'مقاله یافت نشد' });
  res.status(200).json(post);
}
