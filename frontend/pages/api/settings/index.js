let siteSettings = {
  siteName: 'TetraShop',
  logo: '🛍️',
  maintenance: false,
  allowRegister: true,
  currency: 'IRR',
};
export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(siteSettings);
  }
  if (req.method === 'POST') {
    siteSettings = { ...siteSettings, ...req.body };
    return res.status(200).json(siteSettings);
  }
  res.status(405).json({ error: 'Method not allowed' });
}
