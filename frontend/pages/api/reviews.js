let reviews = [
  { id: 1, productId: 1, user: 'کاربر تست', rating: 5, comment: 'عالی بود!', date: '۱۴۰۵-۰۴-۰۱' },
  { id: 2, productId: 1, user: 'علی', rating: 4, comment: 'خوب بود.', date: '۱۴۰۵-۰۴-۰۵' },
];
export default function handler(req, res) {
  if (req.method === 'GET') {
    const { productId } = req.query;
    const filtered = productId ? reviews.filter(r => r.productId === parseInt(productId)) : reviews;
    return res.status(200).json(filtered);
  }
  if (req.method === 'POST') {
    const { productId, user, rating, comment } = req.body;
    if (!productId || !rating) return res.status(400).json({ error: 'اطلاعات ناقص' });
    const newReview = { id: Date.now(), productId, user: user || 'ناشناس', rating, comment, date: new Date().toLocaleDateString('fa-IR') };
    reviews.push(newReview);
    return res.status(201).json(newReview);
  }
  res.status(405).json({ error: 'Method not allowed' });
}
