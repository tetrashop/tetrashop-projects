import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { amount, description, orderId } = req.body;
  if (!amount || !orderId) return res.status(400).json({ error: 'مبلغ و شناسه سفارش الزامی است' });

  const merchantId = process.env.ZARINPAL_MERCHANT_ID;
  const sandbox = process.env.ZARINPAL_SANDBOX === 'true';
  const callbackUrl = process.env.ZARINPAL_CALLBACK_URL;

  if (!merchantId) return res.status(500).json({ error: 'درگاه پرداخت تنظیم نشده است' });

  try {
    const response = await axios.post(
      `https://${sandbox ? 'sandbox' : 'api'}.zarinpal.com/pg/v4/payment/request.json`,
      {
        merchant_id: merchantId,
        amount: amount * 10, // تبدیل تومان به ریال
        description: description || `پرداخت سفارش ${orderId}`,
        callback_url: callbackUrl,
        metadata: { orderId: orderId.toString() },
      }
    );

    const { data } = response.data;

    if (data.code === 100) {
      const paymentUrl = `https://${sandbox ? 'sandbox' : 'www'}.zarinpal.com/pg/StartPay/${data.authority}`;
      res.status(200).json({ success: true, paymentUrl, authority: data.authority });
    } else {
      res.status(400).json({ error: `خطا از زرین‌پال: ${data.message}` });
    }
  } catch (error) {
    res.status(500).json({ error: 'خطا در ارتباط با درگاه پرداخت' });
  }
}
