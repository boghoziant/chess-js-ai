var game = new Chess()
var board = null

function makeRandomMove () {
  var possibleMoves = game.moves()

  // exit if the game is over
  if (possibleMoves.length === 0) return

  var randomIdx = Math.floor(Math.random() * possibleMoves.length)
  game.move(possibleMoves[randomIdx])
  board.position(game.fen())

}

function makeEvalMove () {
    var currentBoard = board.fen().split('')

    // get current score of board
    // go through fen string 
    var total = 0
    
    
    for (let i = 0; i < currentBoard.length; i++) {
        var piece = currentBoard[i]
        // Skip '/' in fen
        if (!piece.match(/[a-z]/i)) {
            continue
        }

        // If uppercase then it's a white piece which means
        // the piece value should be added to the score 
        var white = 1
        if (piece == piece.toLowerCase()) {
            white = -1
        }

        piece = piece.toLowerCase()
        total += pieceValue(piece, white)
    }

    var possibleMoves = game.moves({verbose : true})
    if (possibleMoves.length == 0) return

    
    
    var minTotal = total
    var bestMove = possibleMoves[0]
    for (let i = 0; i < possibleMoves.length; i++) {
        var currTotal = total
        var move = possibleMoves[i]
        if (possibleMoves[i].captured == undefined) {
            continue
        }
        // then that means something was captured and look into the captured key to find what it is and deduct that piece value
        var capturedPiece = possibleMoves[i].captured
        // for now, the color of the captured piece will always be white
        white = 1
        currTotal -= pieceValue(capturedPiece, white)

        // compare to min total
        if (currTotal < minTotal) {
            minTotal = currTotal
            bestMove = move
        }
    }

    // use max as move
    game.move(bestMove)
    board.position(game.fen())
}

function pieceValue (p, white) {

      switch(p) {
                case 'p':
                    return  10 * white
                    break;
                case 'n':
                    return  30 * white
                    break;
                case 'b':
                    return  30 * white
                    break;
                case 'r':
                    return  50 * white
                    break;
                case 'q':
                    return  90 * white
                    break;
                case 'k':
                    return  900 * white
                    break;
                default:
                    break;
            }
}

function onDragStart (source, piece, position, orientation) {
    if (game.game_over()) return false

    if (piece.search(/^b/) !== -1 ) return false
}

function onDrop(source, target) {
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    })

    if (move == null) return 'snapback'

    // window.setTimeout(makeRandomMove, 550)
    window.setTimeout(makeEvalMove, 550)
}

function onSnapEnd() {
    board.position(game.fen())
}


var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd

}

board = ChessBoard('board', config)