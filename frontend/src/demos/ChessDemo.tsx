import { useState } from 'react';
const initial = [
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
  const [board, setBoard] = useState(initial.map(r => [...r]));
  const [sel, setSel] = useState<[number,number]|null>(null);
  const [turn, setTurn] = useState('white');
  const click = (r: number, c: number) => {
    const piece = board[r][c];
    if (sel) {
      const [sr, sc] = sel;
      if (sr === r && sc === c) { setSel(null); return; }
      const nb = board.map(row => [...row]);
      nb[r][c] = board[sr][sc];
      nb[sr][sc] = '';
      setBoard(nb);
      setSel(null);
      setTurn(turn === 'white' ? 'black' : 'white');
    } else {
      if (piece && ((turn === 'white' && '♙♖♘♗♕♔'.includes(piece)) || (turn === 'black' && '♟♜♞♝♛♚'.includes(piece)))) setSel([r, c]);
    }
  };
  return (
    <div className="max-w-sm mx-auto overflow-x-auto">
      <div className="grid grid-cols-8 border border-gray-400">
        {board.map((row, r) => row.map((cell, c) => (
          <div key={`${r}${c}`} onClick={() => click(r, c)}
               className={`aspect-square flex items-center justify-center text-xl cursor-pointer ${(r+c)%2===0 ? 'bg-amber-100' : 'bg-amber-800'} ${sel && sel[0]===r && sel[1]===c ? 'ring-2 ring-blue-400' : ''}`}>
            {cell}
          </div>
        )))}
      </div>
      <p className="text-center mt-2 font-medium">نوبت: {turn === 'white' ? 'سفید' : 'سیاه'}</p>
    </div>
  );
}
