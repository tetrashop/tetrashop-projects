import { getRealOrSimulated } from '../../../src/utils/fallback';

export default function handler(req, res) {
  const status = {
    server: 'online',
    jwt: getRealOrSimulated(process.env.JWT_SECRET, 'simulated'),
    mongodb: getRealOrSimulated(process.env.MONGODB_URI, 'simulated'),
    zarinpal: getRealOrSimulated(process.env.ZARINPAL_MERCHANT_ID, 'simulated'),
    email: getRealOrSimulated(process.env.EMAIL_API_KEY, 'simulated'),
    ton: getRealOrSimulated(process.env.NEXT_PUBLIC_TON_ADDRESS, 'simulated'),
    cloudinary: getRealOrSimulated(process.env.CLOUDINARY_CLOUD_NAME, 'simulated'),
    message: 'برای فعال‌سازی کامل، متغیرهای محیطی را در Vercel تنظیم کنید.',
    timestamp: new Date().toISOString(),
  };
  res.status(200).json(status);
}
