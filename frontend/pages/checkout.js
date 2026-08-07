import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../src/components/Layout';
import { useCartStore } from '../src/store/cartStore';

export default function Checkout() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', note: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();

  // اگر سبد خالی است، به فروشگاه برگرد
  useEffect(() => {
    if (items.length === 0) {
      router.push('/products');
    }
  }, [items, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      setMessage('❌ نام و شماره تماس الزامی است');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form.name,
          email: form.email,
          phone: form.phone,
          note: form.note,
          items: items.map(i => ({ product: i.product, quantity: i.quantity })),
          total: totalPrice(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در ثبت سفارش');
      
      clearCart();
      setMessage(`✅ سفارش شما با موفقیت ثبت شد. شماره پیگیری: ${data.orderId}`);
      setTimeout(() => router.push('/'), 3000);
    } catch (err) {
      setMessage('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <Layout>
      <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
        <h1 style={{ textAlign: 'center', color: '#059669' }}>🛒 تکمیل سفارش</h1>

        {message && (
          <div style={{ padding: 12, background: message.includes('✅') ? '#d1fae5' : '#fee2e2', borderRadius: 8, marginBottom: 15, textAlign: 'center' }}>
            {message}
          </div>
        )}

        {/* خلاصه سبد */}
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
              {items.map(item => (
                <tr key={item.product.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: 8 }}>{item.product.name}</td>
                  <td style={{ padding: 8, textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ padding: 8 }}>{(item.product.price * item.quantity).toLocaleString()} تومان</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ textAlign: 'left', fontWeight: 'bold', marginTop: 10, fontSize: 18, color: '#059669' }}>
            جمع: {totalPrice().toLocaleString()} تومان
          </p>
        </div>

        {/* فرم اطلاعات */}
        <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3>اطلاعات شما</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 15 }}>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="نام و نام خانوادگی *" required style={{ padding: 10, border: '2px solid #e5e7eb', borderRadius: 8 }} />
            <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="شماره تماس *" required style={{ padding: 10, border: '2px solid #e5e7eb', borderRadius: 8 }} />
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="ایمیل (اختیاری)" style={{ padding: 10, border: '2px solid #e5e7eb', borderRadius: 8 }} />
            <textarea value={form.note} onChange={e => setForm({...form, note: e.target.value})} placeholder="توضیحات اضافی" rows={2} style={{ padding: 10, border: '2px solid #e5e7eb', borderRadius: 8 }} />
            <button type="submit" disabled={loading} style={{ padding: 12, background: loading ? '#9ca3af' : '#059669', color: 'white', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer', fontSize: 16 }}>
              {loading ? '⏳ در حال ثبت...' : '📝 ثبت سفارش'}
            </button>
          </div>
        </form>

        {/* راهنمای پرداخت */}
        <div style={{ marginTop: 20, padding: 15, background: '#fef3c7', borderRadius: 8, fontSize: 14 }}>
          <strong>💡 نحوه پرداخت:</strong>
          <p style={{ margin: '5px 0 0 0' }}>
            پس از ثبت سفارش، می‌توانید مبلغ را به شماره کارت زیر واریز کنید و سپس رسید را در پنل کاربری خود آپلود نمایید.
          </p>
          <p style={{ margin: '10px 0 0 0', direction: 'ltr', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
            ۶۰۳۷-۹۹۱۸-۹۰۰۰-۰۰۰۰
          </p>
          <p style={{ margin: '5px 0 0 0', textAlign: 'center', color: '#6b7280' }}>به نام: رامین اجلال</p>
        </div>
      </div>
    </Layout>
  );
}
