import { logging, context, PersistentVector } from "near-sdk-as";
import { TicTacToe, games, GameState } from "./model";

export function createGame(): u32 {
  const game = new TicTacToe();
  games.set(game.gameId, game);
  return game.gameId;
}

export function play(gameId: u32, lin: i8, col: i8): string {
  assert(games.contains(gameId), 'GameId not found');

  let game = games.getSome(gameId);
  let currentPlayer = context.sender;
  assert(lin>=0 && lin<3, 'Not valid line');
  assert(col>=0 && col<3, 'Not valid column');
  if (lin==0) assert(game.line0[col]==0, 'Position already asigned');
  if (lin==1) assert(game.line1[col]==0, 'Position already asigned');
  if (lin==2) assert(game.line2[col]==0, 'Position already asigned');
  assert(game.nextPlayer == currentPlayer, 'Its not your turn');
  assert(game.gameState == GameState.InProgress, 'Game is not in progress');

  if (lin == 0) {
    fillBoard(game.line0, col, currentPlayer, game);
  } else if (lin == 1) {
    fillBoard(game.line1, col, currentPlayer, game);
  } else if (lin == 2) {
    fillBoard(game.line2, col, currentPlayer, game);
  }

  let res = verifyBoard(game.line0, game.line1, game.line2);
  if (res == 1) {
    game.gameState = GameState.Completed;
    games.set(game.gameId, game);
    return finishGame(game.player1);
  } 
  if (res == 2) {
    game.gameState = GameState.Completed;
    games.set(game.gameId, game);
    return finishGame(game.player2);
  }

  games.set(game.gameId, game);
  return getBoard(game.line0, game.line1, game.line2);
}

function finishGame(winnerId: string): string {
  return `Congratulations: ${winnerId} is the winner`;
}

function fillBoard(line: PersistentVector<i8>, col: i8, player: string, game: TicTacToe): void {
  if (player == game.player1) {
    line[col] = 1;
    game.nextPlayer = game.player2;
  } else if (player == game.player2) {
    line[col] = -1;
    game.nextPlayer = game.player1;
  }
}

export function viewBoard(gameId: u32): string {
  let game = games.getSome(gameId);
  return getBoard(game.line0, game.line1, game.line2);
}

export function getBoard(line0: PersistentVector<i8>, line1: PersistentVector<i8>, line2: PersistentVector<i8>): string {
  var parseBoard = "";

  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      if (i == 0) {
        parseBoard = parseBoard.concat(line0[j].toString())
      } else if (i == 1) {
        parseBoard = parseBoard.concat(line1[j].toString())
      } else if (i == 2) {
        parseBoard = parseBoard.concat(line2[j].toString())
      }
    }

    if (i != 2) {
      parseBoard = parseBoard.concat(' | ')
    }
  }

  return parseBoard;
}

export function verifyBoard(line0: PersistentVector<i8>, line1: PersistentVector<i8>, line2: PersistentVector<i8>): u8 {
  let col0Count = 0;
  let col1Count = 0;
  let col2Count = 0;
  for (let i = 0; i < 3; ++i) {
    let lineCount = 0;
    for (let j = 0; j < 3; ++j) {
      if (i == 0) {
        if (j==0) col0Count += line0[j];
        if (j==1) col1Count += line0[j];
        if (j==2) col2Count += line0[j];
        lineCount += line0[j];
      } else if (i == 1) {
        if (j==0) col0Count += line1[j];
        if (j==1) col1Count += line1[j];
        if (j==2) col2Count += line1[j];
        lineCount += line1[j];
      } else if (i == 2) {
        if (j==0) col0Count += line2[j];
        if (j==1) col1Count += line2[j];
        if (j==2) col2Count += line2[j];
        lineCount += line2[j];
      }
      if (lineCount == -3) return 2;
      if (lineCount == 3) return 1;
    }
  }
  if (col0Count == -3 || col1Count == -3 || col2Count == -3) {
    return 2;
  }
  if (col0Count == 3 || col1Count == 3 || col2Count == 3) {
    return 1;
  }
  return 0;
}

export function joinGame(gameId: u32): string {
  assert(games.contains(gameId), 'Game does not exists');
  let game = games.getSome(gameId);
  assert(game.player2 == "", 'This game already has two players');
  assert(game.player1 != context.sender, 'You cant play with youself :(');

  game.player2 = context.sender;
  game.amount2 = context.attachedDeposit;
  game.gameState = GameState.InProgress;

  games.set(gameId, game);

  return "Joined the game, lets play!";
}
