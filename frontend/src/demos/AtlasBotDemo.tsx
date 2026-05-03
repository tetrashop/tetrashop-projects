import { useState } from 'react';

function reply(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('محصول')) return 'محصولات: ساعت هوشمند، هدفون، کتاب، ماگ و شارژر.';
  if (m.includes('قیمت')) return 'قیمت‌ها از ۱۹۵,۰۰۰ تومان شروع می‌شود.';
  if (m.includes('پشتیبانی')) return 'کارشناسان ۲۴ ساعته پاسخگوی شما هستند.';
  return 'سلام! من ربات پشتیبانی فروشگاه هستم. چطور می‌توانم کمک کنم؟';
}

export default function BotDemo({ productId }: { productId: string }) {
  const [chat, setChat] = useState<{ type: 'user'|'bot', text: string }[]>([]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    const user = input.trim();
    setChat([...chat, { type: 'user', text: user }]);
    setInput('');
    setTimeout(() => setChat(prev => [...prev, { type: 'bot', text: reply(user) }]), 500);
  };

  return (
    <div className="border rounded-2xl p-4 bg-gray-50 max-w-md mx-auto">
      <div className="h-80 overflow-y-auto mb-4 space-y-2 p-2">
        {chat.map((m, i) => (
          <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : ''}`}>
            <p className={`px-3 py-2 rounded-xl max-w-[80%] ${m.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>{m.text}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="پیام خود را بنویسید..." className="flex-1 border rounded-xl p-2" />
        <button onClick={send} className="bg-blue-600 text-white px-4 rounded-xl">ارسال</button>
      </div>
    </div>
  );
}