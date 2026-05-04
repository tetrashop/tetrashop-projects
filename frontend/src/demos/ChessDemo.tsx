import { useState } from 'react';

type Board = string[][];
const initial: Board = [
  ['♜','♞','♝','♛','♚','♝','♞','♜'],
  ['♟','♟','♟','♟','♟','♟','♟','♟'],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['♙','♙','♙','♙','♙','♙','♙','♙'],
  ['♖','♘','♗','♕','♔','♗','♘','♖']
];

export default function ChessDemo() {
  const [board, setBoard] = useState<Board>(initial.map(r => [...r]));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<'white' | 'black'>('white');
  const [message, setMessage] = useState('');

  const isValidMove = (sr: number, sc: number, tr: number, tc: number) => {
    const piece = board[sr][sc];
    if (!piece) return false;
    const isWhite = '♙♖♘♗♕♔'.includes(piece);
    const target = board[tr][tc];
    if (target && ((isWhite && '♙♖♘♗♕♔'.includes(target)) || (!isWhite && '♟♜♞♝♛♚'.includes(target)))) return false;
    return true;
  };

  const handleClick = (r: number, c: number) => {
    if (selected) {
      const [sr, sc] = selected;
      if (sr === r && sc === c) { setSelected(null); return; }
      if (isValidMove(sr, sc, r, c)) {
        const newBoard = board.map(row => [...row]);
        newBoard[r][c] = board[sr][sc];
        newBoard[sr][sc] = '';
        setBoard(newBoard);
        setTurn(turn === 'white' ? 'black' : 'white');
        setMessage('');
      } else {
        setMessage('حرکت نامعتبر!');
        setTimeout(() => setMessage(''), 1500);
      }
      setSelected(null);
    } else {
      const piece = board[r][c];
      if (piece && ((turn === 'white' && '♙♖♘♗♕♔'.includes(piece)) || (turn === 'black' && '♟♜♞♝♛♚'.includes(piece)))) {
        setSelected([r, c]);
      }
    }
  };

  const reset = () => {
    setBoard(initial.map(r => [...r]));
    setSelected(null);
    setTurn('white');
    setMessage('');
  };

  return (
    <div className="max-w-sm mx-auto text-center">
      <div className="grid grid-cols-8 border-2 border-gray-500 rounded overflow-hidden shadow-lg">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}${c}`}
              onClick={() => handleClick(r, c)}
              className={`aspect-square flex items-center justify-center text-2xl cursor-pointer transition-colors
                ${(r + c) % 2 === 0 ? 'bg-amber-100 hover:bg-amber-200' : 'bg-amber-800 hover:bg-amber-900'}
                ${selected && selected[0] === r && selected[1] === c ? 'ring-4 ring-blue-500 scale-110' : ''}
              `}
            >
              {cell}
            </div>
          ))
        )}
      </div>
      <div className="mt-3 flex justify-between items-center">
        <span className="font-bold text-lg">
          نوبت: <span className={turn === 'white' ? 'text-gray-700' : 'text-gray-900'}>{turn === 'white' ? '⚪ سفید' : '⚫ سیاه'}</span>
        </span>
        <button onClick={reset} className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded text-sm">شروع مجدد</button>
      </div>
      {message && <p className="text-red-500 mt-2 animate-pulse">{message}</p>}
    </div>
  );
}
