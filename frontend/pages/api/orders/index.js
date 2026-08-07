// ذخیره در حافظه (در نسخه واقعی باید MongoDB باشد)
let orders = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(orders);
  }

  if (req.method === 'POST') {
    const { customer, email, phone, note, items, total } = req.body;

    if (!customer || !phone || !items || items.length === 0) {
      return res.status(400).json({ error: 'اطلاعات ناقص است' });
    }

    const newOrder = {
      id: Date.now(),
      customer,
      email: email || '',
      phone,
      note: note || '',
      items,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    return res.status(201).json({ success: true, orderId: newOrder.id });
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
