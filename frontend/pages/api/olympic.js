export default function handler(req, res) {
  const events = [
    { id: 1, name: '🏃 دو سرعت ۱۰۰ متر', status: 'live', score1: Math.floor(Math.random()*100), score2: Math.floor(Math.random()*100), time: '۱۰:۳۰' },
    { id: 2, name: '🏊 شنای ۲۰۰ متر', status: 'live', score1: Math.floor(Math.random()*100), score2: Math.floor(Math.random()*100), time: '۱۰:۴۵' },
    { id: 3, name: '🤼 کشتی آزاد', status: 'upcoming', time: '۱۱:۱۵' },
    { id: 4, name: '⚽ فینال فوتبال', status: 'live', score1: Math.floor(Math.random()*5), score2: Math.floor(Math.random()*5), time: '۱۲:۰۰' },
    { id: 5, name: '🏋️ وزنه‌برداری', status: 'finished', score1: 85, score2: 92, time: '۰۹:۲۰' },
    { id: 6, name: '🎯 تیراندازی', status: 'upcoming', time: '۱۴:۰۰' },
    { id: 7, name: '🏀 بسکتبال', status: 'live', score1: Math.floor(Math.random()*50), score2: Math.floor(Math.random()*50), time: '۱۳:۳۰' },
    { id: 8, name: '🎾 تنیس', status: 'finished', score1: 3, score2: 2, time: '۰۸:۴۵' },
  ];

  const medals = [
    { country: '🇮🇷 ایران', gold: 5, silver: 7, bronze: 4 },
    { country: '🇯🇵 ژاپن', gold: 8, silver: 5, bronze: 6 },
    { country: '🇨🇳 چین', gold: 10, silver: 6, bronze: 8 },
    { country: '🇺🇸 آمریکا', gold: 7, silver: 9, bronze: 5 },
    { country: '🇩🇪 آلمان', gold: 4, silver: 6, bronze: 7 },
  ];

  const updates = [
    '🏃 حسن رضایی به نیمه‌نهایی دو ۱۰۰ متر صعود کرد.',
    '🏊 سارا احمدی رکورد جدیدی در شنای ۲۰۰ متر ثبت کرد.',
    '⚽ تیم ملی فوتبال ایران به فینال راه یافت!',
    '🏋️ علی محمدی در وزنه‌برداری مدال طلا کسب کرد.',
    '🤼 تیم کشتی آزاد ایران در مرحله گروهی پیروز شد.',
  ];

  res.status(200).json({
    events,
    medals: medals.sort((a, b) => (b.gold * 3 + b.silver * 2 + b.bronze) - (a.gold * 3 + a.silver * 2 + a.bronze)),
    updates: updates.sort(() => Math.random() - 0.5).slice(0, 3),
    lastUpdate: new Date().toLocaleTimeString('fa-IR'),
  });
}
