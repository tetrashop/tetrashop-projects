// محصولات دیجیتال با پلن‌های فروش
let digitalProducts = [
  {
    id: 'bot',
    name: 'ربات بله',
    description: 'ربات هوشمند پشتیبانی و فروش برای پیام‌رسان بله با قابلیت پرداخت.',
    features: ['پاسخگویی خودکار', 'اتصال به کیف پول', 'گزارش فروش'],
    plans: [
      { name: 'پایه', price: 99000, duration: 'ماهانه', features: ['پشتیبانی ۲۴/۷', '۱۰۰ پیام در روز'] },
      { name: 'حرفه‌ای', price: 249000, duration: 'ماهانه', features: ['نامحدود', 'پنل مدیریت', 'وب‌هوک'] },
      { name: 'سالیانه', price: 999000, duration: 'سالیانه', features: ['همه امکانات', '۲ ماه رایگان'] }
    ],
    image: 'https://picsum.photos/seed/bot/400/300',
    demoUrl: '/demos/bot.html'
  },
  {
    id: 'chess',
    name: 'موتور شطرنج',
    description: 'بازی شطرنج آنلاین با حرکت قانونی، قابلیت بازی با دوستان و حریف هوش مصنوعی.',
    features: ['حرکت قانونی', 'حالت دو نفره', 'هوش مصنوعی'],
    plans: [
      { name: 'رایگان', price: 0, duration: 'ماهانه', features: ['بازی با دوستان'] },
      { name: 'پریمیوم', price: 129000, duration: 'ماهانه', features: ['AI پیشرفته', 'آنالیز بازی'] }
    ],
    image: 'https://picsum.photos/seed/chess/400/300',
    demoUrl: '/demos/chess.html'
  },
  {
    id: 'ai',
    name: 'تحلیل احساسات',
    description: 'تحلیل احساسات متون فارسی با دقت بالا، مناسب برای کسب‌وکارها.',
    features: ['دقت ۹۰٪', 'API دسترسی', 'گزارش ماهانه'],
    plans: [
      { name: 'شروع', price: 89000, duration: 'ماهانه', features: ['۱۰۰۰ درخواست'] },
      { name: 'تجاری', price: 299000, duration: 'ماهانه', features: ['۱۰۰۰۰ درخواست', 'پشتیبانی ویژه'] }
    ],
    image: 'https://picsum.photos/seed/ai/400/300',
    demoUrl: '/demos/ai.html'
  }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(digitalProducts);
  }
  res.status(405).json({ error: 'Method not allowed' });
}
