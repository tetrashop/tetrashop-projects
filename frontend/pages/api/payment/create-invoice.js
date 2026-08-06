import { BALE_CONFIG } from '../../../src/utils/baleConfig';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { productId, productName, amount, customerInfo } = req.body;

  try {
    // شبیه‌سازی ایجاد فاکتور در بله
    // در محیط واقعی باید با API بله ارتباط برقرار کنید
    const invoiceData = {
      invoiceId: 'INV-' + Date.now(),
      walletId: BALE_CONFIG.WALLET_ID,
      productName: productName || 'محصول دیجیتال',
      amount: amount || 99000,
      currency: BALE_CONFIG.CURRENCY,
      description: BALE_CONFIG.PAYMENT_DESCRIPTION,
      status: 'pending',
      paymentUrl: `https://bale.ai/invoice/${Date.now()}`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    };

    res.status(200).json({ success: true, invoice: invoiceData });
  } catch (error) {
    res.status(500).json({ error: 'خطا در ایجاد فاکتور', details: error.message });
  }
}
