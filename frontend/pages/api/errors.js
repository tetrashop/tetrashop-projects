export default function handler(req, res) {
  const errors = [
    { id: 1, type: 'API', message: 'Connection timeout', status: 'active', service: 'payment' },
    { id: 2, type: 'UI', message: 'Hydration mismatch', status: 'resolved', service: 'frontend' },
    { id: 3, type: 'Webhook', message: '503 Bale API', status: 'active', service: 'bot' },
  ];
  if (req.method === 'POST') {
    const e = errors.find(e => e.id === req.body.id);
    if (e) { e.status = 'resolved'; return res.status(200).json({ success: true }); }
    return res.status(404).json({ error: 'Not found' });
  }
  res.status(200).json({ errors, total: errors.length, active: errors.filter(e => e.status === 'active').length });
}
