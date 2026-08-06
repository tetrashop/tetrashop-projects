import blogPosts from '../../../data/blogPosts.json';
export default function handler(req, res) {
  if (req.method === 'GET') {
    const posts = blogPosts.map(({ content, ...rest }) => rest); // بدون محتوا
    return res.status(200).json(posts);
  }
  res.status(405).json({ error: 'Method not allowed' });
}
