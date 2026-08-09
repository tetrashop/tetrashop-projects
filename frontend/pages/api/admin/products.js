import { readCollection, writeCollection, generateId } from '../../../src/lib/storage';

export default async function handler(req, res) {
  let products = await readCollection('products');

  if (req.method === 'GET') {
    return res.status(200).json(products);
  }

  if (req.method === 'POST') {
    const { name, price, image, category, stock, description } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'نام و قیمت الزامی است' });

    const newProduct = {
      id: await generateId(),
      name,
      price: parseInt(price),
      image: image || `https://picsum.photos/seed/${Date.now()}/400/400`,
      category: category || 'general',
      stock: stock || 0,
      description: description || '',
      createdAt: new Date().toISOString(),
    };
    products.push(newProduct);
    await writeCollection('products', products);
    return res.status(201).json(newProduct);
  }

  if (req.method === 'PUT') {
    const { id, name, price, image, category, stock, description } = req.body;
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) return res.status(404).json({ error: 'محصول یافت نشد' });

    const product = products[productIndex];
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = parseInt(price);
    if (image !== undefined) product.image = image;
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = parseInt(stock);
    if (description !== undefined) product.description = description;
    products[productIndex] = product;
    await writeCollection('products', products);
    return res.status(200).json(product);
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    products = products.filter(p => p.id !== id);
    await writeCollection('products', products);
    return res.status(200).json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
