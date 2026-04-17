'use client';

import { Cell as CellType } from '@/lib/minimax';

interface CellProps {
  value: CellType;
  onClick: () => void;
  isWinning: boolean;
  isDisabled: boolean;
}

export default function Cell({ value, onClick, isWinning, isDisabled }: CellProps) {
  const baseClasses =
    'w-24 h-24 rounded-xl text-4xl font-bold flex items-center justify-center transition-all duration-150 focus:outline-none';

  const stateClasses = isWinning
    ? 'bg-yellow-400/20 ring-2 ring-yellow-400'
    : isDisabled || value !== null
    ? 'bg-gray-800 cursor-default'
    : 'bg-gray-800 hover:bg-gray-700 cursor-pointer';

  const valueClasses =
    value === 'X'
      ? isWinning
        ? 'text-yellow-300'
        : 'text-blue-400'
      : value === 'O'
      ? isWinning
        ? 'text-yellow-300'
        : 'text-rose-400'
      : '';

  return (
    <button
      className={`${baseClasses} ${stateClasses} ${valueClasses}`}
      onClick={onClick}
      disabled={isDisabled || value !== null}
      aria-label={value ?? 'empty cell'}
    >
      {value}
    </button>
  );
}
