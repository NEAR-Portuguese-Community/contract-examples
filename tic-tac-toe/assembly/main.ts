import { logging, context, PersistentVector } from "near-sdk-as";
import { TicTacToe, games, GameState } from "./model";


export function createGame(player2: string): u32 {
  const game = new TicTacToe(player2);
  games.set(game.gameId, game);
  return game.gameId;
}

export function play(gameId: u32, lin: i8): Array<i8> {
  assert(games.contains(gameId), 'GameId not found');
  
  let game = games.getSome(gameId);
  assert(game.nextPlayer==context.sender, 'Its not your turn');
  assert(game.gameState==GameState.Created, 'Game not started or it has finished');
  logging.log(game.board[lin]);
  assert(game.board[lin] == 0, 'This line is already signed');
  
  logging.log(context.sender);
  logging.log(game.nextPlayer);

  if (context.sender == game.player1) {
    game.board[lin] = 1;
    game.nextPlayer = game.player2;
  } else if(context.sender == game.player2){
    game.board[lin] = 2;
    game.nextPlayer = game.player1;
  }

  games.set(game.gameId, game);

  return getBoard(game.board);
}


function getBoard(board: PersistentVector<i8>): Array<i8> {
  
  var parseBoard = new Array<i8>();
  
  for (let i = 0; i < board.length; ++i) {
    parseBoard.push(board[i]);
  }

  return parseBoard;
}
