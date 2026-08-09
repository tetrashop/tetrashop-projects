export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return res.status(500).json({ error: 'Cloudinary تنظیم نشده است.' });
  try {
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
    const result = await cloudinary.uploader.upload(req.body.file, { folder: 'tetrashop' });
    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: 'خطا در آپلود تصویر' });
  }
}
