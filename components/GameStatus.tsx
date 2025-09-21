
import React from 'react';
import type { Winner } from '../types';
import { Player } from '../types';

interface GameStatusProps {
  winner: Winner;
  currentPlayer: Player;
  isAITurn: boolean;
}

const GameStatus: React.FC<GameStatusProps> = ({ winner, currentPlayer, isAITurn }) => {
  const getStatusMessage = () => {
    if (winner) {
      if (winner === 'draw') return "It's a Draw!";
      if (winner === Player.User) return "🎉 You Win! 🎉";
      return "🤖 Gemini Wins! 🤖";
    }
    if (isAITurn) {
      return "Gemini is thinking...";
    }
    return currentPlayer === Player.User ? "Your Turn" : "Gemini's Turn";
  };
  
  const getStatusColor = () => {
    if (winner) {
       if (winner === 'draw') return "text-gray-400";
       if (winner === Player.User) return "text-green-400";
       return "text-red-400";
    }
    if (isAITurn) {
        return "text-yellow-400 animate-pulse";
    }
    return "text-white";
  };


  return (
    <div className="my-4 text-center">
      <h2 className={`text-3xl md:text-4xl font-bold transition-colors duration-500 ${getStatusColor()}`}>
        {getStatusMessage()}
      </h2>
    </div>
  );
};

export default GameStatus;
