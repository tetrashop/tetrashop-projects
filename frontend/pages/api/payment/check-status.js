export default function handler(req, res) {
  const { invoiceId } = req.query;

  // شبیه‌سازی وضعیت پرداخت
  const statuses = ['completed', 'pending', 'failed'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  res.status(200).json({
    invoiceId: invoiceId || 'INV-unknown',
    status: randomStatus,
    message: randomStatus === 'completed' ? 'پرداخت موفق' : randomStatus === 'pending' ? 'در انتظار پرداخت' : 'پرداخت ناموفق',
    paidAt: randomStatus === 'completed' ? new Date().toISOString() : null,
    transactionId: randomStatus === 'completed' ? 'TXN-' + Date.now() : null,
  });
}
