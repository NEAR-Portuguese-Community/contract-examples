import { PersistentVector, RNG, context, PersistentMap, logging, storage } from "near-sdk-as";

export enum GameState {
  Created,
  InProgress,
  Completed,
  NotFound
}

@nearBindgen
export class TicTacToe {
  gameId: u32;
  gameState: GameState;
  player1: string;
  player2: string;
  
  nextPlayer: string;
  board: PersistentVector<i8>;
  // board: PersistentVector<PersistentVector<i8>>;
  constructor(setPlayer2: string) {
    let rng = new RNG<u32>(1, u32.MAX_VALUE);
    let roll = rng.next();
    this.gameId = roll;

    this.gameState = GameState.Created;
    this.player1 = context.sender;
    this.nextPlayer = this.player1;
    this.player2 = setPlayer2;

    this.board = new PersistentVector<i8>(`${this.gameId}`);
    
    for (let i=0; i<3; i++) {
      this.board.push(0);
    }
  }
}

export const games = new PersistentMap<u32, TicTacToe>("g");
