import { adminOnly } from '../../../src/utils/security';

let products = [
  { id: 1, name: 'هدفون بی‌سیم', price: 3500000, image: 'https://picsum.photos/seed/headphone/400/400', category: 'electronics', stock: 15, description: 'کیفیت صدای بالا' },
  { id: 2, name: 'کوله‌پشتی', price: 1250000, image: 'https://picsum.photos/seed/backpack/400/400', category: 'accessories', stock: 8, description: 'ضدآب و جادار' },
  { id: 3, name: 'ماگ', price: 280000, image: 'https://picsum.photos/seed/mug/400/400', category: 'home', stock: 30, description: 'ظرفیت ۳۵۰ میلی‌لیتر' },
];

async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(products);
  }
  if (req.method === 'POST') {
    const { name, price, image, category, stock, description } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'نام و قیمت الزامی است' });
    const newProduct = {
      id: Date.now(),
      name,
      price: parseInt(price),
      image: image || `https://picsum.photos/seed/${Date.now()}/400/400`,
      category: category || 'general',
      stock: stock || 0,
      description: description || '',
    };
    products.push(newProduct);
    return res.status(201).json(newProduct);
  }
  if (req.method === 'PUT') {
    const { id, name, price, image, category, stock, description } = req.body;
    const product = products.find(p => p.id === id);
    if (!product) return res.status(404).json({ error: 'محصول یافت نشد' });
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = parseInt(price);
    if (image !== undefined) product.image = image;
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = parseInt(stock);
    if (description !== undefined) product.description = description;
    return res.status(200).json(product);
  }
  if (req.method === 'DELETE') {
    const { id } = req.body;
    products = products.filter(p => p.id !== id);
    return res.status(200).json({ success: true });
  }
  res.status(405).json({ error: 'Method not allowed' });
}

export default adminOnly(handler);
