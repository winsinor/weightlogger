'use client';

import { GameStatus } from '@/lib/minimax';

const GLOATS = [
  'Too easy. Try again?',
  'Did you even try?',
  'I calculated that 14 moves ago.',
  'Statistically inevitable.',
  'I am inevitable.',
  'You never had a chance.',
  'Better luck next time. (You will need it.)',
  'I have no weaknesses.',
];

interface StatusBarProps {
  status: GameStatus;
  isAIThinking: boolean;
}

export default function StatusBar({ status, isAIThinking }: StatusBarProps) {
  let message: string;
  let colorClass: string;

  if (status === 'X') {
    message = 'You win!';
    colorClass = 'text-blue-400';
  } else if (status === 'O') {
    message = GLOATS[Math.floor(Math.random() * GLOATS.length)];
    colorClass = 'text-rose-400';
  } else if (status === 'draw') {
    message = "It's a draw!";
    colorClass = 'text-yellow-400';
  } else if (isAIThinking) {
    message = 'AI is thinking...';
    colorClass = 'text-gray-400 animate-pulse';
  } else {
    message = 'Your turn (X)';
    colorClass = 'text-gray-300';
  }

  return <p className={`text-lg font-medium ${colorClass}`}>{message}</p>;
}
