import { readCollection, writeCollection, generateId } from '../../../src/lib/fileStorage';

export default function handler(req, res) {
  let orders = readCollection('orders');

  if (req.method === 'GET') {
    return res.status(200).json(orders);
  }

  if (req.method === 'POST') {
    const { customer, email, phone, nationalId, address, note, items, total, type, paymentMethod } = req.body;
    if (!customer || !phone || !items || items.length === 0) {
      return res.status(400).json({ error: 'اطلاعات ناقص است' });
    }

    const newOrder = {
      id: generateId(),
      customer,
      email: email || '',
      phone,
      nationalId: nationalId || '',
      address: address || '',
      note: note || '',
      items,
      total,
      type: type || 'physical',
      paymentMethod: paymentMethod || 'card',
      status: 'pending',
      commission: Math.round(total * 0.05),
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    writeCollection('orders', orders);
    return res.status(201).json({ success: true, orderId: newOrder.id });
  }

  if (req.method === 'PATCH') {
    const { id, status } = req.body;
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) return res.status(404).json({ error: 'سفارش یافت نشد' });
    orders[orderIndex].status = status;
    writeCollection('orders', orders);
    return res.status(200).json(orders[orderIndex]);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
