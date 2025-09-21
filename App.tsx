
import React, { useState, useEffect, useCallback } from 'react';
import type { BoardState, Winner, CellValue } from './types';
import { Player } from './types';
import { ROWS, COLS } from './constants';
import Board from './components/Board';
import GameStatus from './components/GameStatus';
import ResetButton from './components/ResetButton';
import getAIsMove from './services/geminiService';

const createEmptyBoard = (): BoardState => Array(ROWS).fill(null).map(() => Array(COLS).fill(null));

const App: React.FC = () => {
    const [board, setBoard] = useState<BoardState>(createEmptyBoard());
    const [currentPlayer, setCurrentPlayer] = useState<Player>(Player.User);
    const [winner, setWinner] = useState<Winner>(null);
    const [isAITurn, setIsAITurn] = useState<boolean>(false);

    const checkWinner = useCallback((currentBoard: BoardState): Winner => {
        const checkLine = (a: CellValue, b: CellValue, c: CellValue, d: CellValue): Player | null => {
            if (a !== null && a === b && a === c && a === d) {
                return a;
            }
            return null;
        };

        // Horizontal
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c <= COLS - 4; c++) {
                const win = checkLine(currentBoard[r][c], currentBoard[r][c + 1], currentBoard[r][c + 2], currentBoard[r][c + 3]);
                if (win) return win;
            }
        }

        // Vertical
        for (let r = 0; r <= ROWS - 4; r++) {
            for (let c = 0; c < COLS; c++) {
                const win = checkLine(currentBoard[r][c], currentBoard[r + 1][c], currentBoard[r + 2][c], currentBoard[r + 3][c]);
                if (win) return win;
            }
        }

        // Diagonal (down-right)
        for (let r = 0; r <= ROWS - 4; r++) {
            for (let c = 0; c <= COLS - 4; c++) {
                const win = checkLine(currentBoard[r][c], currentBoard[r + 1][c + 1], currentBoard[r + 2][c + 2], currentBoard[r + 3][c + 3]);
                if (win) return win;
            }
        }
        
        // Diagonal (up-right)
        for (let r = 3; r < ROWS; r++) {
            for (let c = 0; c <= COLS - 4; c++) {
                const win = checkLine(currentBoard[r][c], currentBoard[r - 1][c + 1], currentBoard[r - 2][c + 2], currentBoard[r - 3][c + 3]);
                if (win) return win;
            }
        }

        if (currentBoard.flat().every(cell => cell !== null)) {
            return 'draw';
        }

        return null;
    }, []);

    const handlePlayerMove = (colIndex: number) => {
        if (winner || isAITurn || board[0][colIndex] !== null) {
            return;
        }

        const newBoard = board.map(row => [...row]);
        for (let r = ROWS - 1; r >= 0; r--) {
            if (newBoard[r][colIndex] === null) {
                newBoard[r][colIndex] = Player.User;
                break;
            }
        }

        setBoard(newBoard);
        const gameWinner = checkWinner(newBoard);
        if (gameWinner) {
            setWinner(gameWinner);
        } else {
            setCurrentPlayer(Player.AI);
        }
    };

    const handleReset = () => {
        setBoard(createEmptyBoard());
        setCurrentPlayer(Player.User);
        setWinner(null);
        setIsAITurn(false);
    };
    
    useEffect(() => {
        if (currentPlayer === Player.AI && !winner) {
            setIsAITurn(true);
            const makeAIMove = async () => {
                try {
                    const aiCol = await getAIsMove(board);
                    
                    const newBoard = board.map(row => [...row]);
                    let moveMade = false;
                    for (let r = ROWS - 1; r >= 0; r--) {
                        if (newBoard[r][aiCol] === null) {
                            newBoard[r][aiCol] = Player.AI;
                            moveMade = true;
                            break;
                        }
                    }

                    if(moveMade) {
                        setBoard(newBoard);
                        const gameWinner = checkWinner(newBoard);
                        if (gameWinner) {
                            setWinner(gameWinner);
                        } else {
                            setCurrentPlayer(Player.User);
                        }
                    } else {
                        // AI picked a full column, user's turn again
                         setCurrentPlayer(Player.User);
                    }
                } catch (error) {
                    console.error("AI failed to make a move:", error);
                    // Give turn back to player on error
                    setCurrentPlayer(Player.User); 
                } finally {
                    setIsAITurn(false);
                }
            };
            
            const aiThinkTime = 750 + Math.random() * 500;
            setTimeout(makeAIMove, aiThinkTime);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPlayer, winner]);


    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <header className="text-center mb-6">
                <h1 className="text-5xl md:text-6xl font-extrabold">
                    Connect Four
                </h1>
                <p className="text-lg text-gray-400">vs Gemini AI</p>
            </header>
            <main className="flex flex-col items-center">
                 <GameStatus winner={winner} currentPlayer={currentPlayer} isAITurn={isAITurn} />
                 <Board board={board} onColumnClick={handlePlayerMove} disabled={isAITurn || !!winner} />
                 <ResetButton onReset={handleReset} disabled={isAITurn} />
            </main>
             <footer className="mt-8 text-center text-gray-500 text-sm">
                <p>Built by a world-class senior frontend React engineer.</p>
                <p>Powered by the Gemini API.</p>
            </footer>
        </div>
    );
};

export default App;
