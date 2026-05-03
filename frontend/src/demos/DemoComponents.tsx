import React, { useState } from 'react';

// ---------- دمو ربات ----------
function BotChat() {
  const [chat, setChat] = useState<{ type: 'u' | 'b'; text: string }[]>([]);
  const [inp, setInp] = useState('');

  const send = () => {
    const t = inp.trim();
    if (!t) return;
    const reply = t.includes('قیمت') ? 'قیمت‌ها از ۱۹۵ هزار تومان' : 'سلام! چطور می‌تونم کمک کنم؟';
    setChat(prev => [...prev, { type: 'u', text: t }, { type: 'b', text: reply }]);
    setInp('');
  };

  return (
    <div className="border rounded-xl p-3 max-w-sm mx-auto bg-gray-50">
      <div className="h-60 overflow-y-auto mb-2 space-y-1">
        {chat.map((m, i) => (
          <p key={i} className={`p-2 rounded-lg max-w-[80%] text-sm ${m.type === 'u' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200'}`}>
            {m.text}
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={inp} onChange={e => setInp(e.target.value)} className="flex-1 border rounded px-2 py-1 text-sm" placeholder="پیام..." />
        <button onClick={send} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">ارسال</button>
      </div>
    </div>
  );
}

// ---------- دمو شطرنج ----------
function ChessBoard() {
  const initial = [
    ['♜','♞','♝','♛','♚','♝','♞','♜'],
    ['♟','♟','♟','♟','♟','♟','♟','♟'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['♙','♙','♙','♙','♙','♙','♙','♙'],
    ['♖','♘','♗','♕','♔','♗','♘','♖'],
  ];
  const [board, setBoard] = useState(initial);
  const [sel, setSel] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<'w'|'b'>('w');

  const click = (r: number, c: number) => {
    if (sel) {
      const [sr, sc] = sel;
      if (sr === r && sc === c) { setSel(null); return; }
      const nb = board.map(row => [...row]);
      nb[r][c] = board[sr][sc];
      nb[sr][sc] = '';
      setBoard(nb);
      setSel(null);
      setTurn(turn === 'w' ? 'b' : 'w');
    } else {
      const piece = board[r][c];
      if (!piece) return;
      const isWhite = '♙♖♘♗♕♔'.includes(piece);
      if ((turn === 'w' && isWhite) || (turn === 'b' && !isWhite)) setSel([r, c]);
    }
  };

  return (
    <div className="max-w-xs mx-auto">
      <div className="grid grid-cols-8 border">
        {board.map((row, r) => row.map((cell, c) => (
          <div key={`${r}${c}`} onClick={() => click(r, c)}
               className={`aspect-square flex items-center justify-center text-xl cursor-pointer
                 ${(r+c)%2===0 ? 'bg-amber-100' : 'bg-amber-800'}
                 ${sel && sel[0]===r && sel[1]===c ? 'ring-2 ring-blue-400' : ''}`}>
            {cell}
          </div>
        )))}
      </div>
      <p className="text-center mt-2">نوبت: {turn === 'w' ? 'سفید' : 'سیاه'}</p>
    </div>
  );
}

// ---------- دمو AI ----------
function AiDemo() {
  const [text, setText] = useState('');
  const [res, setRes] = useState('');
  const analyze = () => {
    if (!text.trim()) return;
    setRes(Math.random() > 0.5 ? 'احساس: مثبت' : 'احساس: منفی');
  };
  return (
    <div className="max-w-sm mx-auto p-3 bg-white rounded-xl shadow">
      <textarea rows={3} value={text} onChange={e => setText(e.target.value)}
        placeholder="متن فارسی..." className="w-full border rounded p-2 text-sm" />
      <button onClick={analyze} className="mt-2 bg-purple-600 text-white px-4 py-1 rounded">تحلیل</button>
      {res && <p className="mt-3 p-2 bg-gray-100 rounded">{res}</p>}
    </div>
  );
}

// ---------- دمو مالی ----------
function FinanceDemo() {
  return (
    <div className="p-3 bg-white rounded-xl shadow max-w-sm mx-auto">
      <h3 className="font-bold mb-2">📈 مالی</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-blue-50 p-2 rounded">موجودی: ۲.۵ میلیون</div>
        <div className="bg-green-50 p-2 rounded">معاملات: ۱۲</div>
      </div>
    </div>
  );
}

// ---------- دمو پلتفرم ----------
function PlatformDemo() {
  return (
    <div className="p-3 bg-white rounded-xl shadow max-w-sm mx-auto">
      <h3 className="font-bold mb-2">⚙️ پنل مدیریت</h3>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="bg-blue-100 p-2 rounded">کاربران: ۱۲۰</div>
        <div className="bg-green-100 p-2 rounded">سفارش‌ها: ۴۳</div>
        <div className="bg-yellow-100 p-2 rounded">درآمد: ۱۲M</div>
      </div>
    </div>
  );
}

// ========== نقشه‌بردار اصلی ==========
const demoMap: Record<string, React.FC> = {
  bot: BotChat,
  game: ChessBoard,
  ai: AiDemo,
  finance: FinanceDemo,
  platform: PlatformDemo,
};

interface DigitalProduct {
  id: string;
  name: string;
  category: string;
}

// داده‌ها رو مستقیم import می‌کنیم
import digitalProducts from '../data/digitalProducts.json';

export default function DemoComponent({ productId }: { productId: string }) {
  const product = (digitalProducts as DigitalProduct[]).find(p => p.id === productId);
  if (!product) return <p className="text-red-500 text-center mt-4">محصول یافت نشد.</p>;

  let Comp: React.FC | undefined;

  // اولویت با شناسه محصول
  const id = product.id.toLowerCase();
  if (id.includes('bale') || id.includes('bot')) Comp = BotChat;
  else if (id.includes('chess')) Comp = ChessBoard;
  else if (id.includes('nlp') || id.includes('ocr') || id.includes('speech') || id.includes('voice')) Comp = AiDemo;
  else if (id.includes('payment') || id.includes('wallet') || id.includes('binance')) Comp = FinanceDemo;
  else if (id.includes('user') || id.includes('admin') || id.includes('dashboard') || id.includes('saas') || id.includes('platform') || id.includes('vercel') || id.includes('gateway') || id.includes('services')) Comp = PlatformDemo;
  else Comp = demoMap[product.category];

  if (!Comp) return <p className="text-center mt-4 text-gray-500">نسخه نمایشی آماده نیست</p>;

  return (
    <div className="mt-4">
      <Comp />
    </div>
  );
}
