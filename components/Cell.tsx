
import React from 'react';
import type { CellValue } from '../types';
import { Player } from '../types';

interface CellProps {
  value: CellValue;
}

const Cell: React.FC<CellProps> = ({ value }) => {
  const baseClasses = "w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-colors duration-300";

  const colorClasses = {
    [Player.User]: "bg-red-500 shadow-lg shadow-red-500/50",
    [Player.AI]: "bg-yellow-400 shadow-lg shadow-yellow-400/50",
    'empty': "bg-gray-800"
  };

  const finalClasses = `${baseClasses} ${value ? colorClasses[value] : colorClasses.empty}`;

  return (
    <div className="w-14 h-14 md:w-20 md:h-20 flex items-center justify-center">
      <div className={finalClasses}></div>
    </div>
  );
};

export default Cell;
