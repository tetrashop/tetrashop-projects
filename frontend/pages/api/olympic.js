export default function handler(req, res) {
  res.status(200).json({
    events: [{ id: 1, name: 'دو سرعت', status: 'live', score1: 50, score2: 45, time: '۱۰:۳۰' }, { id: 2, name: 'شنا', status: 'upcoming', time: '۱۱:۰۰' }, { id: 3, name: 'کشتی', status: 'finished', score1: 3, score2: 2, time: '۰۹:۲۰' }],
    medals: [{ country: 'ایران', gold: 5, silver: 7, bronze: 4 }, { country: 'ژاپن', gold: 8, silver: 5, bronze: 6 }, { country: 'چین', gold: 10, silver: 6, bronze: 8 }],
    updates: ['خبر ۱', 'خبر ۲', 'خبر ۳'],
    lastUpdate: new Date().toLocaleTimeString('fa-IR'),
  });
}
