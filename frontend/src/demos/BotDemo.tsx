import { useState, useRef, useEffect } from 'react';

const QA: Record<string, string> = {
  'محصول': 'ما محصولات متنوعی شامل ساعت هوشمند، هدفون، کتاب و شارژر داریم. کدام مورد را می‌پسندید؟',
  'قیمت': 'قیمت‌ها از ۱۹۵ هزار تومان برای شارژر شروع و تا ۴.۲ میلیون تومان برای ساعت هوشمند ادامه دارد.',
  'پرداخت': 'می‌توانید با کیف پول بله پرداخت کنید. گزینه «پرداخت با کیف پول بله» را انتخاب نمایید.',
  'تخفیف': 'در حال حاضر تمام محصولات با ۱۰٪ تخفیف ویژه عرضه می‌شوند.',
  'پشتیبانی': 'کارشناسان ما ۲۴ ساعته آماده پاسخگویی هستند. شماره تماس: ۰۲۱-۱۲۳۴۵۶۷۸',
};

function getReply(msg: string): string {
  const m = msg.toLowerCase();
  for (const [key, val] of Object.entries(QA)) {
    if (m.includes(key)) return val;
  }
  return 'سلام! من ربات پشتیبانی فروشگاه TetraShop هستم. هر سوالی دارید بپرسید.';
}

export default function BotDemo() {
  const [chat, setChat] = useState<{ type: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, typing]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setChat(prev => [...prev, { type: 'user', text: userMsg }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setChat(prev => [...prev, { type: 'bot', text: getReply(userMsg) }]);
      setTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <div className="max-w-md mx-auto border rounded-2xl p-4 bg-gray-50 shadow-lg">
      <div className="h-96 overflow-y-auto mb-4 space-y-2 p-2 bg-white rounded-xl">
        {chat.length === 0 && (
          <p className="text-center text-gray-400 mt-20">پیام خود را بنویسید...</p>
        )}
        {chat.map((m, i) => (
          <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : ''}`}>
            <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
              m.type === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex">
            <div className="bg-gray-200 px-4 py-2 rounded-2xl rounded-bl-none text-sm text-gray-500">
              در حال نوشتن...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="پیام خود را بنویسید..."
          className="flex-1 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={send}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-xl text-sm font-medium transition"
        >
          ارسال
        </button>
      </div>
    </div>
  );
}
