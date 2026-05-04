import { useState, useEffect } from 'react';

export default function FinanceDemo() {
  const [data, setData] = useState([40, 70, 45, 90, 65, 80, 50]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => prev.map(() => Math.floor(Math.random() * 90) + 10));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-center">📈 داشبورد مالی</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-xl text-center">
          <p className="text-sm text-gray-600">موجودی</p>
          <p className="text-2xl font-bold">۲٬۵۰۰٬۰۰۰ ریال</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl text-center">
          <p className="text-sm text-gray-600">معاملات امروز</p>
          <p className="text-2xl font-bold">{Math.floor(Math.random() * 30) + 5}</p>
        </div>
      </div>
      <div className="flex items-end gap-2 h-40">
        {data.map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-500"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <p className="text-center text-sm text-gray-500 mt-3">نمودار قیمت هفتگی (بروزرسانی خودکار)</p>
    </div>
  );
}
