
import React from 'react';
import type { BoardState } from '../types';
import Cell from './Cell';

interface BoardProps {
  board: BoardState;
  onColumnClick: (colIndex: number) => void;
  disabled: boolean;
}

const Board: React.FC<BoardProps> = ({ board, onColumnClick, disabled }) => {
  return (
    <div className={`bg-blue-600 p-2 md:p-4 rounded-xl shadow-2xl inline-block ${disabled ? 'cursor-not-allowed opacity-75' : ''}`}>
      <div className="flex flex-col gap-1">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-row gap-1">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={` ${disabled ? '' : 'cursor-pointer hover:bg-blue-500/50'} rounded-lg transition-colors`}
                onClick={() => !disabled && onColumnClick(colIndex)}
              >
                <Cell value={cell} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
