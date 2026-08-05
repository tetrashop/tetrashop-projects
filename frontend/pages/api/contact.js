export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;
    // اینجا می‌توانید ایمیل کنید یا در دیتابیس ذخیره نمایید
    console.log(`پیام جدید از ${name} (${email}): ${message}`);
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
