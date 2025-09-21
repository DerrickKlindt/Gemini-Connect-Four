
import React from 'react';

interface ResetButtonProps {
  onReset: () => void;
  disabled: boolean;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onReset, disabled }) => {
  return (
    <button
      onClick={onReset}
      disabled={disabled}
      className="mt-6 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
    >
      New Game
    </button>
  );
};

export default ResetButton;
