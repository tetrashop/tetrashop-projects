import { useState } from 'react';

export default function OcrDemo() {
  const [uploaded, setUploaded] = useState(false);
  const [text, setText] = useState('');

  const simulate = () => {
    setUploaded(true);
    setText('متن استخراج‌شده: «سلام، این یک تست OCR است. فروشگاه تتـــرا»');
  };

  return (
    <div className="max-w-sm mx-auto p-4">
      <div
        onClick={simulate}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
          uploaded ? 'bg-green-50 border-green-300' : 'hover:bg-gray-100 border-gray-300'
        }`}
      >
        {!uploaded ? (
          <p className="text-gray-500">برای آپلود عکس کلیک کنید</p>
        ) : (
          <p className="text-green-600 font-semibold">عکس دریافت شد</p>
        )}
      </div>
      {text && <p className="mt-4 p-3 bg-gray-100 rounded-xl">{text}</p>}
    </div>
  );
}
