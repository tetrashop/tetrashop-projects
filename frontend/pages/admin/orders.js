import { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';
import useAuth from '../../src/utils/useAuth';

export default function AdminOrders() {
  useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(setOrders)
      .catch(() => {});
  }, []);

  const updateStatus = async (id, status) => {
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <AdminLayout>
      <h1>📦 مدیریت سفارشات</h1>
      <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', textAlign: 'right' }}>
              <th style={{ padding: '12px 16px' }}>شناسه</th>
              <th style={{ padding: '12px 16px' }}>مشتری</th>
              <th style={{ padding: '12px 16px' }}>مبلغ</th>
              <th style={{ padding: '12px 16px' }}>وضعیت</th>
              <th style={{ padding: '12px 16px' }}>تاریخ</th>
              <th style={{ padding: '12px 16px' }}>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '10px 16px' }}>#{order.id}</td>
                <td style={{ padding: '10px 16px' }}>{order.customer}<br/><small>{order.email}</small></td>
                <td style={{ padding: '10px 16px' }}>{order.total.toLocaleString()} تومان</td>
                <td style={{ padding: '10px 16px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: 12, fontSize: '0.8rem',
                    background: order.status === 'completed' ? '#d1fae5' : order.status === 'pending' ? '#fef3c7' : '#fee2e2',
                    color: order.status === 'completed' ? '#059669' : order.status === 'pending' ? '#92400e' : '#dc2626'
                  }}>
                    {order.status === 'completed' ? 'تکمیل' : order.status === 'pending' ? 'در انتظار' : 'لغو'}
                  </span>
                </td>
                <td style={{ padding: '10px 16px' }}>{order.date}</td>
                <td style={{ padding: '10px 16px' }}>
                  {order.status !== 'completed' && (
                    <button onClick={() => updateStatus(order.id, 'completed')}
                      style={{ padding: '4px 10px', background: '#059669', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', marginRight: 4 }}>
                      تکمیل
                    </button>
                  )}
                  {order.status !== 'cancelled' && order.status !== 'completed' && (
                    <button onClick={() => updateStatus(order.id, 'cancelled')}
                      style={{ padding: '4px 10px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                      لغو
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
