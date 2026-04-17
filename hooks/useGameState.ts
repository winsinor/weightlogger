'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Board,
  Cell,
  GameStatus,
  getGameStatus,
  getWinningLine,
  getBestMove,
  getRandomMove,
} from '@/lib/minimax';

const EMPTY_BOARD: Board = Array(9).fill(null) as Cell[];

interface GameState {
  board: Board;
  status: GameStatus;
  winningLine: number[] | null;
  isAIThinking: boolean;
}

const initialState: GameState = {
  board: [...EMPTY_BOARD],
  status: 'ongoing',
  winningLine: null,
  isAIThinking: false,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(initialState);
  const [cheatMode, setCheatMode] = useState(false);

  const toggleCheat = useCallback(() => setCheatMode((v) => !v), []);

  const handleCellClick = useCallback((index: number) => {
    setState((prev) => {
      if (prev.board[index] !== null || prev.status !== 'ongoing' || prev.isAIThinking) {
        return prev;
      }
      const newBoard = [...prev.board] as Board;
      newBoard[index] = 'X';
      const statusAfterX = getGameStatus(newBoard);
      if (statusAfterX !== 'ongoing') {
        return { board: newBoard, status: statusAfterX, winningLine: getWinningLine(newBoard), isAIThinking: false };
      }
      return { board: newBoard, status: 'ongoing', winningLine: null, isAIThinking: true };
    });
  }, []);

  useEffect(() => {
    if (!state.isAIThinking) return;

    const timer = setTimeout(() => {
      setState((current) => {
        if (!current.isAIThinking) return current;
        const aiBoard = [...current.board] as Board;
        const aiIndex = cheatMode ? getRandomMove(aiBoard) : getBestMove(aiBoard);
        if (aiIndex === -1) return { ...current, isAIThinking: false };
        aiBoard[aiIndex] = 'O';
        const statusAfterO = getGameStatus(aiBoard);
        return { board: aiBoard, status: statusAfterO, winningLine: getWinningLine(aiBoard), isAIThinking: false };
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [state.isAIThinking, cheatMode]);

  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    board: state.board,
    status: state.status,
    winningLine: state.winningLine,
    isAIThinking: state.isAIThinking,
    cheatMode,
    toggleCheat,
    handleCellClick,
    resetGame,
  };
}
