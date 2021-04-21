import { PersistentVector, RNG, logging, context } from "near-sdk-as";

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
  tabuleiro: PersistentVector<PersistentVector<i8>>;
  constructor() {
    const RNG = new RNG<u32>(1, u32.MAX_VALUE);
    this.gameId = RNG.next();
    this.gameState = GameState.Created;
    this.player1 = context.sender;
    this.tabuleiro = new PersistentVector<PersistentVector<i8>>("c");
    for (let i=0; i<3; i++) {
      let linha = new PersistentVector<i8>(`${i}`);
      for (let j=0; j<3; j++) {
        linha.push(0);
      }
      this.tabuleiro.push(linha);
    }
  }
}

export const games = new PersistentVector<TicTacToe>("c");