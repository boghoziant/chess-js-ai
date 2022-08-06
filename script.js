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
    // get current score of board
    // go through fen string 
    var total = eval(game)
    
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

function eval(b) {
    var currentBoard = b.fen().split('')

    // get current score of board
    // go through fen string 
    var total = 0
    
    for (let i = 0; i < currentBoard.length; i++) {
        var piece = currentBoard[i]
        // Skip '/' in fen
        if (piece == ' ') break
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
    return total
}

function topLevelMiniMax() {
    var res = miniMax(game, 2, false, -10000, 10000)

    game.move(res.m)
    board.position(game.fen())
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function miniMax(node, depth, maximizingPlayer, move=null, alpha, beta) {
    if (depth == 0) {
        var bestMove = {
            v: eval(node),
            m: move
        }
        return bestMove
    }
    if (maximizingPlayer) {
        var children = shuffle(node.moves())
        length = children.length
        var child = new Chess()
        var bestMove = {
            v: -10000,
            m: move
        }

        for (var i = 0; i < length; i++) {
            child.load(node.fen())
            child.move(children[i])
            value = miniMax(child, depth - 1, false, children[i], alpha, beta)
            if (value.v > bestMove.v) {
                bestMove.v = value.v
                bestMove.m = children[i]
            }
            alpha = Math.max(alpha, bestMove.v);
            if (beta <= alpha) {
                return bestMove;
            }
        }

        return bestMove
    } else /* minimizingPlayer */{
        var children = shuffle(node.moves())
        length = children.length
        var child = new Chess()
        bestMove = {
            v: 10000,
            m:children[0] 
        }

        for (var i = 0; i < length; i++) {
            child.load(node.fen())
            child.move(children[i])
            value = miniMax(child, depth - 1, true, children[i], alpha, beta)
            if (value.v < bestMove.v) {
                bestMove.v = value.v
                bestMove.m = children[i]
            }
            beta = Math.min(beta, bestMove.v);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove
    }
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
    window.setTimeout(topLevelMiniMax, 50)
}

function onSnapEnd() {
    board.position(game.fen())
}


var config = {
    draggable: true,
    position: game.fen(),
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd

}

board = ChessBoard('board', config)