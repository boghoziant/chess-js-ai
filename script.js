var game = new Chess()
var board = null

function makeRandomMove () {
  var possibleMoves = game.moves()

  // exit if the game is over
  if (game.game_over()) return

  var randomIdx = Math.floor(Math.random() * possibleMoves.length)
  game.move(possibleMoves[randomIdx])
  board.position(game.fen())

  window.setTimeout(makeRandomMove, 500)
}


board = ChessBoard('board', 'start')
window.setTimeout(makeRandomMove, 500)