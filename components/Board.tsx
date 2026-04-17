'use client';

import { Board as BoardType } from '@/lib/minimax';
import Cell from './Cell';

interface BoardProps {
  board: BoardType;
  onCellClick: (index: number) => void;
  winningLine: number[] | null;
  isDisabled: boolean;
}

export default function Board({ board, onCellClick, winningLine, isDisabled }: BoardProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {Array.from({ length: 9 }, (_, i) => (
        <Cell
          key={i}
          value={board[i]}
          onClick={() => onCellClick(i)}
          isWinning={winningLine?.includes(i) ?? false}
          isDisabled={isDisabled}
        />
      ))}
    </div>
  );
}
