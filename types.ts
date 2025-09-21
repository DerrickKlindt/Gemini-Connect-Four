
export enum Player {
  User = 1,
  AI = 2,
}

export type CellValue = Player | null;

export type BoardState = CellValue[][];

export type Winner = Player | 'draw' | null;
