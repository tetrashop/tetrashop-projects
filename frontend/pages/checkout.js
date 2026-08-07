import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../src/components/Layout';
import { useCartStore } from '../src/store/cartStore';

export default function Checkout() {
  const router = useRouter();
  const { type, productId, planName, price: planPrice } = router.query;
  const isDigital = type === 'digital';

  const [form, setForm] = useState({
    name: '',
    nationalId: '',
    phone: '',
    address: '',
    email: '',
    note: '',
    paymentMethod: 'card',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { items, totalPrice, clearCart } = useCartStore();

  // اگر محصول دیجیتال از طریق پارامترها آمده باشد
  const digitalItem = isDigital ? {
    product: { id: productId, name: planName + ' ' + productId, price: parseInt(planPrice) || 0 },
    quantity: 1
  } : null;

  const cartItems = isDigital ? [digitalItem] : items;
  const total = isDigital ? (parseInt(planPrice) || 0) : totalPrice();

  useEffect(() => {
    if (!isDigital && items.length === 0) {
      router.push('/products');
    }
  }, [items, isDigital, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.nationalId) {
      setMessage('❌ نام، شماره تماس و کد ملی الزامی است');
      return;
    }
    // اعتبارسنجی شماره تلفن (شماره موبایل ۱۱ رقمی)
    if (!/^09\d{9}$/.test(form.phone)) {
      setMessage('❌ شماره تماس باید موبایل ۱۱ رقمی با ۰۹ شروع شود');
      return;
    }
    // اعتبارسنجی کد ملی (۱۰ رقم)
    if (!/^\d{10}$/.test(form.nationalId)) {
      setMessage('❌ کد ملی باید ۱۰ رقم باشد');
      return;
    }

    setLoading(true);
    try {
      if (form.paymentMethod === "wallet") {
        const walletRes = await fetch("/api/wallet/pay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total }),
        });
        const walletData = await walletRes.json();
        if (!walletRes.ok) throw new Error(walletData.error);
      }
      const res = await fetch("/api/orders", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form.name,
          email: form.email,
          phone: form.phone,
          nationalId: form.nationalId,
          address: form.address,
          note: form.note,
          items: cartItems.map(i => ({ product: i.product, quantity: i.quantity })),
          total,
          type: isDigital ? 'digital' : 'physical',
          paymentMethod: form.paymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در ثبت سفارش');

      if (!isDigital) clearCart();
      setMessage(`✅ سفارش شما با موفقیت ثبت شد. شماره پیگیری: ${data.orderId}`);
      setTimeout(() => router.push('/'), 3000);
    } catch (err) {
      setMessage('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !isDigital) return null;

  return (
    <Layout>
      <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
        <h1 style={{ textAlign: 'center', color: '#059669' }}>🛒 تکمیل سفارش</h1>
        {message && (
          <div style={{ padding: 12, background: message.includes('✅') ? '#d1fae5' : '#fee2e2', borderRadius: 8, marginBottom: 15, textAlign: 'center' }}>
            {message}
          </div>
        )}

        {/* خلاصه */}
        <div style={{ background: 'white', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: 20 }}>
          <h3>خلاصه سفارش</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: 8, textAlign: 'right' }}>محصول</th>
                <th style={{ padding: 8 }}>تعداد</th>
                <th style={{ padding: 8 }}>قیمت</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: 8 }}>{item.product.name}</td>
                  <td style={{ padding: 8, textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ padding: 8 }}>{(item.product.price * item.quantity).toLocaleString()} تومان</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ textAlign: 'left', fontWeight: 'bold', marginTop: 10, fontSize: 18, color: '#059669' }}>
            جمع: {total.toLocaleString()} تومان
          </p>
        </div>

        {/* فرم اطلاعات مشتری */}
        <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3>اطلاعات ضروری</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 15 }}>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="نام و نام خانوادگی *" required style={inputStyle} />
            <input value={form.nationalId} onChange={e => setForm({...form, nationalId: e.target.value})} placeholder="کد ملی (۱۰ رقم) *" required maxLength={10} style={inputStyle} />
            <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="شماره تماس (09xxxxxxxxx) *" required maxLength={11} style={inputStyle} />
            <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="آدرس کامل پستی" style={inputStyle} />
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="ایمیل (اختیاری)" style={inputStyle} />
            <textarea value={form.note} onChange={e => setForm({...form, note: e.target.value})} placeholder="توضیحات اضافی" rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            
            {/* انتخاب روش پرداخت */}
            <select value={form.paymentMethod} onChange={e => setForm({...form, paymentMethod: e.target.value})} style={inputStyle}>
              <option value="card">💳 کارت به کارت</option>
              <option value="wallet">💎 پرداخت با کیف پول</option>
            </select>

            <button type="submit" disabled={loading} style={{ padding: 12, background: loading ? '#9ca3af' : '#059669', color: 'white', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer', fontSize: 16 }}>
              {loading ? '⏳ در حال ثبت...' : '📝 ثبت سفارش'}
            </button>
          </div>
        </form>

        {/* راهنمای پرداخت */}
        {form.paymentMethod === 'card' && (
          <div style={{ marginTop: 20, padding: 15, background: '#fef3c7', borderRadius: 8, fontSize: 14 }}>
            <strong>💡 پرداخت با کارت:</strong>
            <p style={{ margin: '5px 0 0 0' }}>لطفاً مبلغ را به شماره کارت زیر واریز و رسید را در پنل خود آپلود کنید.</p>
            <p style={{ margin: '10px 0 0 0', direction: 'ltr', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
              ۶۰۳۷-۹۹۱۸-۹۰۰۰-۰۰۰۰
            </p>
            <p style={{ margin: '5px 0 0 0', textAlign: 'center', color: '#6b7280' }}>به نام: رامین اجلال</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
const inputStyle = { padding: 10, border: '2px solid #e5e7eb', borderRadius: 8 };
