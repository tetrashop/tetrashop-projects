import axios from 'axios';
import dbConnect from '../../../src/lib/db';
import Order from '../../../src/models/Order';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { authority, status, orderId } = req.body;

  if (status !== 'OK') return res.redirect('/payment?status=failed');

  const merchantId = process.env.ZARINPAL_MERCHANT_ID;
  const sandbox = process.env.ZARINPAL_SANDBOX === 'true';

  try {
    // دریافت اطلاعات پرداخت برای استخراج مبلغ
    await dbConnect();
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'سفارش یافت نشد' });

    const response = await axios.post(
      `https://${sandbox ? 'sandbox' : 'api'}.zarinpal.com/pg/v4/payment/verify.json`,
      {
        merchant_id: merchantId,
        amount: order.totalAmount * 10,
        authority: authority,
      }
    );

    const { data } = response.data;

    if (data.code === 100 || data.code === 101) {
      order.status = 'paid';
      order.paymentId = data.ref_id?.toString();
      await order.save();
      res.redirect(`/payment?status=success&refId=${data.ref_id}`);
    } else {
      order.status = 'failed';
      await order.save();
      res.redirect(`/payment?status=failed`);
    }
  } catch (error) {
    res.status(500).json({ error: 'خطا در تأیید پرداخت' });
  }
}
