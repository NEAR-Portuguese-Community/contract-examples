import { logging, context } from "near-sdk-as";
import { TicTacToe, games, GameState } from "./model";


export function createGame(): u32 {
  const game = new TicTacToe();
  games.set(game.gameId, game);
  return game.gameId; 
}

export function play(gameId: u32, lin: i8, col: i8): u32 {
  if (games.contains(gameId)) {
    if (games.getSome(gameId).gameState==GameState.Created) {
      let game = games.getSome(gameId);
      game.tabuleiro[lin][col] = 1;

      return gameId;
    }
  }
  return 0;
}

export function getBoard(gameId: u32): Array<Array<u8>> {
  if (games.contains(gameId)) {
    if (games.getSome(gameId).gameState==GameState.Created) {
      let game = games.getSome(gameId);
      let board = game.tabuleiro;

      logging.log(board.);
      let res = new Array<Array<u8>>();
      // for (let i=0; i<3; i++) {
      //   res.push(new Array<u8>(3));
      //   for (let j=0; j<3; j++) {
      //     res[i][j] = board[i][j];
      //   }
      // }
      return res;
    }
  }
  return new Array<Array<u8>>();
}
