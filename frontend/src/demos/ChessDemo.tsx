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
  const [turn, setTurn] = useState<'white'|'black'>('white');

  const isValidSelection = (r: number, c: number) => {
    const piece = board[r][c];
    if (!piece) return false;
    return (turn === 'white' && '♙♖♘♗♕♔'.includes(piece)) || (turn === 'black' && '♟♜♞♝♛♚'.includes(piece));
  };

  const handleClick = (r: number, c: number) => {
    if (selected) {
      const [sr, sc] = selected;
      const piece = board[sr][sc];
      if (sr === r && sc === c) { setSelected(null); return; }
      const newBoard = board.map(row => [...row]);
      newBoard[r][c] = piece;
      newBoard[sr][sc] = '';
      setBoard(newBoard);
      setSelected(null);
      setTurn(turn === 'white' ? 'black' : 'white');
    } else {
      if (isValidSelection(r, c)) setSelected([r, c]);
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <div className="grid grid-cols-8 border border-gray-400">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => handleClick(r, c)}
              className={`aspect-square flex items-center justify-center text-2xl cursor-pointer
                ${(r + c) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-800'} 
                ${selected?.[0] === r && selected?.[1] === c ? 'ring-4 ring-blue-400' : ''}`}
            >
              {cell}
            </div>
          ))
        )}
      </div>
      <p className="text-center mt-2 font-medium">نوبت: {turn === 'white' ? 'سفید' : 'سیاه'}</p>
    </div>
  );
}
