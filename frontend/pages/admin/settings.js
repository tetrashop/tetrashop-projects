import { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';
import useAuth from '../../src/utils/useAuth';

export default function SettingsPage() {
  useAuth();
  const [settings, setSettings] = useState({ siteName: '', maintenance: false, allowRegister: true, currency: 'IRR' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(()=>{});
  }, []);

  const save = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
    if (res.ok) setMsg('✅ تنظیمات ذخیره شد.');
    else setMsg('❌ خطا در ذخیره‌سازی.');
  };

  return (
    <AdminLayout>
      <h1>⚙️ تنظیمات سایت</h1>
      {msg && <p style={{ background: msg.includes('✅')?'#d1fae5':'#fee2e2', padding: 10, borderRadius: 8, marginBottom: 15 }}>{msg}</p>}
      <form onSubmit={save} style={{ background: 'white', borderRadius: 12, padding: 20, maxWidth: 500 }}>
        <label style={{ display: 'block', marginBottom: 5 }}>نام سایت</label>
        <input value={settings.siteName} onChange={e => setSettings({...settings, siteName: e.target.value})} style={{ width: '100%', padding: 10, marginBottom: 15, border: '2px solid #e5e7eb', borderRadius: 8 }} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15 }}>
          <input type="checkbox" checked={settings.maintenance} onChange={e => setSettings({...settings, maintenance: e.target.checked})} />
          حالت تعمیرات
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15 }}>
          <input type="checkbox" checked={settings.allowRegister} onChange={e => setSettings({...settings, allowRegister: e.target.checked})} />
          ثبت‌نام باز
        </label>
        <button type="submit" style={{ width: '100%', padding: 10, background: '#059669', color: 'white', border: 'none', borderRadius: 8, fontWeight: 'bold' }}>ذخیره</button>
      </form>
    </AdminLayout>
  );
}
