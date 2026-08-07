// توجه: این API نیاز به کلید خصوصی دارد و فقط در محیط امن باید استفاده شود.
// در نسخه واقعی، کلید خصوصی باید از متغیر محیطی خوانده شود.

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { toAddress, amount } = req.body;
  if (!toAddress || !amount) return res.status(400).json({ error: 'آدرس مقصد و مقدار الزامی است' });

  // بررسی وجود کلید خصوصی
  const privateKey = process.env.TON_PRIVATE_KEY;
  if (!privateKey) {
    return res.status(500).json({
      error: 'کلید خصوصی TON تنظیم نشده است.',
      hint: 'لطفاً TON_PRIVATE_KEY را در متغیرهای محیطی Vercel تنظیم کنید.',
    });
  }

  try {
    // کتابخانه‌های TON (اگر نصب شده باشند)
    const { TonClient, WalletContractV4, internal } = require('@ton/ton');
    const { Address, toNano } = require('@ton/core');

    const client = new TonClient({ endpoint: 'https://toncenter.com/api/v2/jsonRPC' });
    const keyPair = { publicKey: Buffer.from(privateKey, 'hex').slice(32), secretKey: Buffer.from(privateKey, 'hex') };
    const wallet = WalletContractV4.create({ workchain: 0, publicKey: keyPair.publicKey });
    const contract = client.open(wallet);

    const seqno = await contract.getSeqno();
    await contract.sendTransfer({
      seqno,
      secretKey: keyPair.secretKey,
      messages: [
        internal({
          to: Address.parse(toAddress),
          value: toNano(amount),
          body: '',
          bounce: true,
        }),
      ],
    });

    res.status(200).json({ success: true, message: `تراکنش ${amount} TON به ${toAddress} با موفقیت ارسال شد.` });
  } catch (error) {
    // اگر کتابخانه‌ها نصب نباشند، راهنما برگردان
    if (error.code === 'MODULE_NOT_FOUND') {
      return res.status(500).json({
        error: 'کتابخانه‌های TON نصب نیستند.',
        hint: 'لطفاً npm install @ton/ton @ton/crypto @ton/core را در frontend اجرا کنید.',
      });
    }
    res.status(500).json({ error: error.message });
  }
}
