let commissionRate = 5; // درصد کمیسیون

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ commissionRate });
  }
  if (req.method === 'POST') {
    const { rate } = req.body;
    if (rate !== undefined && rate >= 0 && rate <= 100) {
      commissionRate = rate;
      return res.status(200).json({ commissionRate, message: 'درصد کمیسیون به‌روز شد' });
    }
    return res.status(400).json({ error: 'درصد نامعتبر' });
  }
  res.status(405).json({ error: 'Method not allowed' });
}
