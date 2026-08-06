const allProducts = [
  { id: 1, name: 'هدفون بی‌سیم', price: 3500000, image: 'https://picsum.photos/seed/headphone/400/400', category: 'electronics', specs: { weight: '250g', battery: '20h', bluetooth: '5.0' } },
  { id: 2, name: 'کوله‌پشتی', price: 1250000, image: 'https://picsum.photos/seed/backpack/400/400', category: 'accessories', specs: { weight: '500g', size: '15.6"', material: '防水' } },
  { id: 3, name: 'ماگ', price: 280000, image: 'https://picsum.photos/seed/mug/400/400', category: 'home', specs: { volume: '350ml', dishwasher: 'بله' } },
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { ids } = req.query;
    if (ids) {
      const idArray = ids.split(',').map(Number);
      const products = allProducts.filter(p => idArray.includes(p.id));
      return res.status(200).json(products);
    }
    return res.status(200).json(allProducts);
  }
  res.status(405).json({ error: 'Method not allowed' });
}
