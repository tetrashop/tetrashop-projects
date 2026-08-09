import { getRealOrSimulated } from '../../src/utils/fallback';

export default async function handler(req, res) {
  let storageStatus = 'FileStorage JSON (بدون MongoDB)';
  if (process.env.MONGODB_URI) {
    try {
      // تلاش برای اتصال به MongoDB (در صورت وجود)
      // در اینجا mongoose را require می‌کنیم، اما اگر نصب نباشد خطا می‌دهد
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState) {
        storageStatus = 'MongoDB متصل';
      } else {
        await mongoose.connect(process.env.MONGODB_URI);
        storageStatus = 'MongoDB متصل';
      }
    } catch (e) {
      storageStatus = 'FileStorage JSON (MongoDB در دسترس نیست)';
    }
  }

  res.status(200).json({
    server: 'online',
    storage: storageStatus,
    jwt: getRealOrSimulated(process.env.JWT_SECRET, 'simulated'),
    zarinpal: getRealOrSimulated(process.env.ZARINPAL_MERCHANT_ID, 'simulated'),
    email: getRealOrSimulated(process.env.EMAIL_API_KEY, 'simulated'),
    ton: getRealOrSimulated(process.env.NEXT_PUBLIC_TON_ADDRESS, 'simulated'),
    cloudinary: getRealOrSimulated(process.env.CLOUDINARY_CLOUD_NAME, 'simulated'),
    message: 'همه ماژول‌ها فعال هستند. برای تولید واقعی، متغیرهای محیطی را تنظیم کنید.',
    timestamp: new Date().toISOString(),
  });
}
