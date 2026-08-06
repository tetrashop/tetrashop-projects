const COUPONS = {
  'WELCOME10': { discount: 10, type: 'percent' },
  'SAVE50': { discount: 50000, type: 'fixed' },
  'FREESHIP': { discount: 0, type: 'shipping' },
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { code, total } = req.body;
    if (!code) return res.status(400).json({ error: 'کد تخفیف الزامی است' });
    const coupon = COUPONS[code.toUpperCase()];
    if (!coupon) return res.status(404).json({ error: 'کد تخفیف نامعتبر است' });

    let discountAmount = 0;
    if (coupon.type === 'percent') {
      discountAmount = (total * coupon.discount) / 100;
    } else if (coupon.type === 'fixed') {
      discountAmount = coupon.discount;
    } // shipping case handled elsewhere

    res.status(200).json({
      valid: true,
      code: code.toUpperCase(),
      discountAmount,
      finalTotal: Math.max(0, total - discountAmount),
      message: `کد تخفیف ${coupon.discount}${coupon.type === 'percent' ? '%' : ' تومان'} اعمال شد`
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
