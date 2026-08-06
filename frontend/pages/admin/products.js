import { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';
import useAuth from '../../src/utils/useAuth';

export default function AdminProducts() {
  useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ id: null, name: '', price: '', image: '', category: 'general', stock: '', description: '' });
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    setProducts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const method = editing ? 'PUT' : 'POST';
    try {
      const res = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(editing ? '✅ محصول ویرایش شد' : '✅ محصول جدید اضافه شد');
      resetForm();
      fetchProducts();
    } catch (err) {
      setMessage('❌ ' + err.message);
    }
  };

  const resetForm = () => {
    setForm({ id: null, name: '', price: '', image: '', category: 'general', stock: '', description: '' });
    setEditing(false);
  };

  const editProduct = (product) => {
    setForm({ ...product, price: product.price.toString(), stock: product.stock?.toString() || '' });
    setEditing(true);
  };

  const deleteProduct = async (id) => {
    if (!confirm('آیا مطمئن هستید؟')) return;
    await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchProducts();
  };

  return (
    <AdminLayout>
      <h1>📦 مدیریت محصولات</h1>

      {message && (
        <div style={{ padding: 12, background: message.includes('✅') ? '#d1fae5' : '#fee2e2', borderRadius: 8, marginBottom: 15, textAlign: 'center' }}>
          {message}
        </div>
      )}

      {/* فرم افزودن/ویرایش */}
      <div style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: 30 }}>
        <h3>{editing ? 'ویرایش محصول' : 'افزودن محصول جدید'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="نام محصول" required style={inputStyle} />
            <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="قیمت (تومان)" type="number" required style={inputStyle} />
            <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="آدرس تصویر (اختیاری)" style={inputStyle} />
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle}>
              <option value="general">عمومی</option>
              <option value="electronics">الکترونیک</option>
              <option value="accessories">لوازم جانبی</option>
              <option value="home">خانه</option>
              <option value="books">کتاب</option>
            </select>
            <input value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} placeholder="موجودی (عدد)" type="number" style={inputStyle} />
          </div>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="توضیحات" rows={2} style={{ padding: 10, border: '2px solid #e5e7eb', borderRadius: 8, resize: 'vertical' }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" style={{ padding: 10, background: '#059669', color: 'white', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer', flex: 1 }}>
              {editing ? '💾 ذخیره تغییرات' : '➕ افزودن محصول'}
            </button>
            {editing && (
              <button type="button" onClick={resetForm} style={{ padding: 10, background: '#6b7280', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                لغو
              </button>
            )}
          </div>
        </form>
      </div>

      {/* جدول محصولات */}
      <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', textAlign: 'right' }}>
              <th style={{ padding: 12 }}>تصویر</th>
              <th style={{ padding: 12 }}>نام</th>
              <th style={{ padding: 12 }}>قیمت</th>
              <th style={{ padding: 12 }}>دسته</th>
              <th style={{ padding: 12 }}>موجودی</th>
              <th style={{ padding: 12 }}>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: 10 }}>{p.image && <img src={p.image} alt={p.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }} />}</td>
                <td style={{ padding: 10 }}>{p.name}</td>
                <td style={{ padding: 10 }}>{p.price.toLocaleString()} تومان</td>
                <td style={{ padding: 10 }}>{p.category}</td>
                <td style={{ padding: 10 }}>{p.stock}</td>
                <td style={{ padding: 10 }}>
                  <button onClick={() => editProduct(p)} style={{ padding: '4px 12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', marginRight: 4 }}>ویرایش</button>
                  <button onClick={() => deleteProduct(p.id)} style={{ padding: '4px 12px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
const inputStyle = { padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', width: '100%' };
