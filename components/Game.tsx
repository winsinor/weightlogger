'use client';

import { useGameState } from '@/hooks/useGameState';
import Board from './Board';
import StatusBar from './StatusBar';
import Fireworks from './Fireworks';
import SecretCorners from './SecretCorners';

export default function Game() {
  const { board, status, winningLine, isAIThinking, cheatMode, toggleCheat, handleCellClick, resetGame } = useGameState();

  const gameOver = status !== 'ongoing';

  return (
    <>
      {status === 'O' && <Fireworks />}
      <SecretCorners cheatMode={cheatMode} onToggle={toggleCheat} />
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 relative z-10">
        <h1 className="text-white text-3xl font-bold tracking-tight">Tic Tac Toe</h1>
        <StatusBar status={status} isAIThinking={isAIThinking} />
        <Board
          board={board}
          onCellClick={handleCellClick}
          winningLine={winningLine}
          isDisabled={isAIThinking || gameOver}
        />
        <button
          onClick={resetGame}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          New Game
        </button>
      </div>
    </>
  );
}
