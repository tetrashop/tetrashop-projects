// کاربران نمونه
let users = [
  { id: 1, username: 'admin', role: 'admin', email: 'admin@tetrashop.ir', createdAt: '۱۴۰۴-۰۱-۰۱' },
  { id: 2, username: 'user1', role: 'user', email: 'user1@example.com', createdAt: '۱۴۰۵-۰۳-۱۵' },
  { id: 3, username: 'manager', role: 'manager', email: 'manager@tetrashop.ir', createdAt: '۱۴۰۴-۱۲-۲۰' },
];
export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(users);
  }
  if (req.method === 'POST') {
    const { username, role, email } = req.body;
    if (!username) return res.status(400).json({ error: 'نام کاربری الزامی است' });
    const newUser = { id: Date.now(), username, role: role || 'user', email: email || '', createdAt: new Date().toLocaleDateString('fa-IR') };
    users.push(newUser);
    return res.status(201).json(newUser);
  }
  if (req.method === 'DELETE') {
    const { id } = req.body;
    users = users.filter(u => u.id !== id);
    return res.status(200).json({ success: true });
  }
  res.status(405).json({ error: 'Method not allowed' });
}
