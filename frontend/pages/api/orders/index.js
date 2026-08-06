let orders = [
  { id: 1001, customer: 'کاربر تست', email: 'user@example.com', total: 3500000, status: 'completed', items: [{ name: 'هدفون', price: 3500000 }], date: '۱۴۰۵-۰۴-۱۰' },
  { id: 1002, customer: 'علی', email: 'ali@test.com', total: 1250000, status: 'pending', items: [{ name: 'کوله‌پشتی', price: 1250000 }], date: '۱۴۰۵-۰۵-۰۲' },
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(orders);
  }
  if (req.method === 'POST') {
    const { customer, email, items } = req.body;
    if (!customer || !items) return res.status(400).json({ error: 'اطلاعات ناقص' });
    const total = items.reduce((sum, item) => sum + item.price, 0);
    const newOrder = {
      id: Date.now(),
      customer,
      email: email || '',
      total,
      status: 'pending',
      items,
      date: new Date().toLocaleDateString('fa-IR')
    };
    orders.push(newOrder);
    return res.status(201).json(newOrder);
  }
  if (req.method === 'PATCH') {
    const { id, status } = req.body;
    const order = orders.find(o => o.id === id);
    if (!order) return res.status(404).json({ error: 'سفارش یافت نشد' });
    order.status = status;
    return res.status(200).json(order);
  }
  res.status(405).json({ error: 'Method not allowed' });
}
