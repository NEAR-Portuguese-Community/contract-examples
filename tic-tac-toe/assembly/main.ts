import { logging } from "near-sdk-as";
import { TicTacToe, games, GameState } from "./model";

export function createGame(): u32 {
  const game = new TicTacToe();
  games.push(game);
  return game.gameId;
}

export function play(gameId: u32, lin: i8, col: i8): string {
  for (let i=0; i<games.length; i++) {
    logging.log(games[i].gameId);
    if (games[i].gameId==gameId && games[i].gameState==GameState.InProgress) {
      let game = games[i];
      game.gameState = GameState.Completed;
      return "this was played";
    }
  }
  return "";
}
