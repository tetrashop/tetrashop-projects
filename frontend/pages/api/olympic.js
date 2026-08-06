export default function handler(req, res) {
  res.status(200).json({
    events: [{ id: 1, name: 'دو سرعت', status: 'live', score1: 50, score2: 45 }, { id: 2, name: 'شنا', status: 'upcoming' }],
    medals: [{ country: 'ایران', gold: 5, silver: 7, bronze: 4 }],
  });
}
