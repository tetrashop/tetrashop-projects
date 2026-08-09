export default async function handler(req, res) {
  let storageStatus = 'FileStorage JSON (بدون MongoDB)';
  if (process.env.MONGODB_URI) {
    try {
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState) {
        storageStatus = 'MongoDB متصل';
      } else {
        await mongoose.connect(process.env.MONGODB_URI);
        storageStatus = 'MongoDB متصل';
      }
    } catch (e) {
      storageStatus = 'FileStorage JSON (fallback)';
    }
  }

  res.status(200).json({
    server: 'online',
    storage: storageStatus,
    jwt: process.env.JWT_SECRET ? 'real' : 'simulated',
    zarinpal: process.env.ZARINPAL_MERCHANT_ID ? 'real' : 'simulated',
    email: process.env.EMAIL_API_KEY ? 'real' : 'simulated',
    ton: process.env.NEXT_PUBLIC_TON_ADDRESS ? 'real' : 'simulated',
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'real' : 'simulated',
    message: 'همه ماژول‌ها فعال هستند. برای تولید واقعی، متغیرهای محیطی را تنظیم کنید.',
    timestamp: new Date().toISOString(),
  });
}
