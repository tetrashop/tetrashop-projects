let tickets = [
  { id: 1, user: 'کاربر تست', subject: 'مشکل در پرداخت', status: 'open', priority: 'high', createdAt: new Date().toISOString() },
  { id: 2, user: 'علی', subject: 'سوال درباره محصول', status: 'open', priority: 'medium', createdAt: new Date(Date.now()-86400000).toISOString() },
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(tickets);
  }
  if (req.method === 'POST') {
    const { user, subject, priority } = req.body;
    if (!user || !subject) return res.status(400).json({ error: 'اطلاعات ناقص' });
    const newTicket = { id: Date.now(), user, subject, status: 'open', priority: priority || 'medium', createdAt: new Date().toISOString() };
    tickets.unshift(newTicket);
    return res.status(201).json(newTicket);
  }
  if (req.method === 'PATCH') {
    const { id, status } = req.body;
    const ticket = tickets.find(t => t.id === id);
    if (!ticket) return res.status(404).json({ error: 'یافت نشد' });
    ticket.status = status;
    return res.status(200).json(ticket);
  }
  res.status(405).json({ error: 'Method not allowed' });
}
