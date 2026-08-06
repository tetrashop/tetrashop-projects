let wishlists = {}; // key: userId, value: array of product ids

export default function handler(req, res) {
  const userId = req.headers['x-user-id'] || 'anonymous';

  if (req.method === 'GET') {
    return res.status(200).json(wishlists[userId] || []);
  }

  if (req.method === 'POST') {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId required' });
    if (!wishlists[userId]) wishlists[userId] = [];
    if (!wishlists[userId].includes(productId)) {
      wishlists[userId].push(productId);
    }
    return res.status(200).json(wishlists[userId]);
  }

  if (req.method === 'DELETE') {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId required' });
    if (wishlists[userId]) {
      wishlists[userId] = wishlists[userId].filter(id => id !== productId);
    }
    return res.status(200).json(wishlists[userId] || []);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
