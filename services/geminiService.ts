
import { GoogleGenAI, Type } from "@google/genai";
import type { BoardState } from '../types';
import { Player } from '../types';

const getAIsMove = async (board: BoardState): Promise<number> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const boardString = JSON.stringify(board, null, 2);

    const prompt = `
        You are playing Connect Four as Player ${Player.AI} (AI).
        The board is ${board.length} rows by ${board[0].length} columns.
        - 'null' represents an empty slot.
        - '${Player.User}' represents Player ${Player.User}'s piece (User).
        - '${Player.AI}' represents your piece (AI).

        Here is the current board state:
        ${boardString}

        Based on this board, what is your next move? You must choose a column from 0 to ${board[0].length - 1}.
        The column you choose must not be full. Your goal is to win, and if you cannot win, block the opponent from winning.
        Return your answer as a JSON object with a single key "column".
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "You are an expert, strategic Connect Four player. Your goal is to win the game.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        column: {
                            type: Type.INTEGER,
                            description: "The column number (0-6) to drop the piece into.",
                        },
                    },
                    required: ["column"],
                },
                temperature: 0.9,
            }
        });

        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);

        if (typeof result.column === 'number' && result.column >= 0 && result.column < board[0].length) {
            // Check if column is full
            if (board[0][result.column] === null) {
                return result.column;
            }
        }
        
        // Fallback: if AI returns invalid move, find the first available column
        for (let c = 0; c < board[0].length; c++) {
            if (board[0][c] === null) {
                return c;
            }
        }
        
        throw new Error("AI returned an invalid or full column, and no fallback was possible.");

    } catch (error) {
        console.error("Error getting AI move:", error);
        // Fallback in case of API error
        for (let c = 0; c < board[0].length; c++) {
            if (board[0][c] === null) {
                return c;
            }
        }
        throw new Error("AI move generation failed and no fallback was possible.");
    }
};

export default getAIsMove;
