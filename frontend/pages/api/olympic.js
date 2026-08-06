export default function handler(req, res) {
  res.status(200).json({
    events: [
      { id: 1, name: '🏃 دو سرعت ۱۰۰ متر', status: 'live', score1: Math.floor(Math.random() * 100), score2: Math.floor(Math.random() * 100), time: '۱۰:۳۰' },
      { id: 2, name: '🏊 شنای ۲۰۰ متر', status: 'upcoming', time: '۱۱:۱۵' },
      { id: 3, name: '🤼 کشتی آزاد', status: 'finished', score1: 3, score2: 2, time: '۰۹:۲۰' },
    ],
    medals: [
      { country: '🇮🇷 ایران', gold: 5, silver: 7, bronze: 4 },
      { country: '🇯🇵 ژاپن', gold: 8, silver: 5, bronze: 6 },
      { country: '🇨🇳 چین', gold: 10, silver: 6, bronze: 8 },
    ],
    updates: [
      '🏃 حسن رضایی به نیمه‌نهایی صعود کرد.',
      '🏊 سارا احمدی رکورد جدیدی ثبت کرد.',
      '⚽ تیم ملی فوتبال به فینال راه یافت!',
    ],
    lastUpdate: new Date().toLocaleTimeString('fa-IR'),
  });
}
