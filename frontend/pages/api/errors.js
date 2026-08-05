export default function handler(req, res) {
  const errors = [
    { id: 1, type: 'API', message: 'Connection timeout to payment gateway', status: 'active', severity: 'high', time: new Date(Date.now() - 7200000).toISOString(), service: 'payment' },
    { id: 2, type: 'UI', message: 'Hydration mismatch in ProductCard component', status: 'resolved', severity: 'medium', time: new Date(Date.now() - 86400000).toISOString(), service: 'frontend' },
    { id: 3, type: 'Webhook', message: '503 Service Unavailable from Bale API', status: 'active', severity: 'high', time: new Date(Date.now() - 1800000).toISOString(), service: 'bot' },
    { id: 4, type: 'Database', message: 'MongoDB connection refused on port 27017', status: 'pending', severity: 'critical', time: new Date(Date.now() - 3600000).toISOString(), service: 'database' },
    { id: 5, type: 'Auth', message: 'JWT token expired for user 1042', status: 'resolved', severity: 'low', time: new Date(Date.now() - 43200000).toISOString(), service: 'auth' },
    { id: 6, type: 'Network', message: 'DNS resolution failed for cdn.tetrashop.ir', status: 'active', severity: 'medium', time: new Date(Date.now() - 600000).toISOString(), service: 'cdn' },
  ];

  if (req.method === 'POST') {
    const { id } = req.body;
    const error = errors.find(e => e.id === id);
    if (error) {
      error.status = 'resolved';
      return res.status(200).json({ success: true, error });
    }
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(200).json({ errors, total: errors.length, active: errors.filter(e => e.status === 'active').length });
}
