import { logging, context, PersistentVector } from "near-sdk-as";
import { TicTacToe, games, GameState } from "./model";


export function createGame(player2: string): u32 {
  const game = new TicTacToe(player2);
  games.set(game.gameId, game);
  return game.gameId;
}

export function play(gameId: u32, lin: i8, col: i8): string {
  assert(games.contains(gameId), 'GameId not found');

  let game = games.getSome(gameId);
  let currentPlayer = context.sender;
  assert(game.nextPlayer==currentPlayer, 'Its not your turn');
  assert(game.gameState==GameState.Created, 'Game not started or it has finished');
  //assert(game.line0[lin] == 0, 'This line is already signed');

  if (lin == 0) {
    fillBoard(game.line0, col, currentPlayer, game)
  } else if (lin == 1) {
    fillBoard(game.line1, col, currentPlayer, game)
  } else if (lin == 2) {
    fillBoard(game.line2, col, currentPlayer, game)
  }

  games.set(game.gameId, game);

  return getBoard(game.line0, game.line1, game.line2);
}

function fillBoard(line: PersistentVector<i8>, col: i8, player: string, game: TicTacToe): void {
  if (player == game.player1) {
    line[col] = 1;
    game.nextPlayer = game.player2;
  } else if(player == game.player2){
    line[col] = 2;
    game.nextPlayer = game.player1;
  }
}

export function viewBoard(gameId: u32): string {
  let game = games.getSome(gameId);
  return getBoard(game.line0, game.line1, game.line2);
}

function getBoard(line0: PersistentVector<i8>, line1: PersistentVector<i8>, line2: PersistentVector<i8>): string {
  var parseBoard = "";

  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      if (i==0) {
        parseBoard = parseBoard.concat(line0[j].toString())
      } else if (i==1) {
        parseBoard = parseBoard.concat(line1[j].toString())
      } else if (i==2) {
        parseBoard = parseBoard.concat(line2[j].toString())
      }
    }

    if (i!=2) {
      parseBoard = parseBoard.concat('-')
    }
  }

  return parseBoard;
}
