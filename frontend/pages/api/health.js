import { readCollection } from '../../../src/lib/fileStorage';

export default function handler(req, res) {
  // تست FileStorage
  let storageStatus = 'فعال';
  try {
    readCollection('health_check');
  } catch (error) {
    storageStatus = 'خطا';
  }

  const status = {
    server: 'online',
    storage: storageStatus + ' (FileStorage JSON)',
    jwt: process.env.JWT_SECRET ? 'real' : 'simulated',
    zarinpal: process.env.ZARINPAL_MERCHANT_ID ? 'real' : 'simulated',
    email: process.env.EMAIL_API_KEY ? 'real' : 'simulated',
    ton: process.env.NEXT_PUBLIC_TON_ADDRESS ? 'real' : 'simulated',
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'real' : 'simulated',
    message: 'فروشگاه بدون نیاز به MongoDB Atlas کار می‌کند. داده‌ها در فایل JSON ذخیره می‌شوند.',
    timestamp: new Date().toISOString(),
  };
  res.status(200).json(status);
}
