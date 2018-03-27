var maxDepth = 4;
var solution = false;

function setMaxDepth(d) {
	maxDepth = d;
}

function copy(qttt) {
	var result = new QTTT();
	result.turn = qttt.turn;
	result.loopMarks = qttt.loopMarks;
	result.selectedSquare = qttt.selectedSquare;
	result.winner = qttt.winner;
	result.computerPlayer = qttt.computerPlayer;
	for (var mark in qttt.marks) {
		if (qttt.marks[mark] != null) {
			result.marks[mark] = [qttt.marks[mark][0], qttt.marks[mark][1]];
		}
	}
	for (var i = 0; i < 9; i++) {
		if (typeof qttt.board[i] == "object") {
			for (var j = 0; j < qttt.board[i].length; j++) {
				result.board[i].push(qttt.board[i][j]);
			}
		} else {
			result.board[i] = qttt.board[i];
		}
	}
	return result;
}

function generateMove(oldState, move, resolution) {
	var result = {};
	result.oldState = oldState;
	result.newState = copy(oldState);
	if (resolution != null) {
		result.resolution = resolution;
		result.newState.resolve(resolution[0], resolution[1]);
	}
	if (move != null) {
		result.move = move;
		result.newState.move(move[0], move[1]);
	}
	return result;
}

function getPossibleResolutions(game) {
	if (!game.hasCycle()) {
		return [];
	}
	var result = [];
	var mark = game.loopMarks[0];
	var squares = game.marks[mark];
	result[0] = [squares[0], mark];
	result[1] = [squares[1], mark];
	return result;
}

function getPossibleMoves(game) {
	if (game.winner != null) return [];

	var result = [];
	var resolutions = [];
	var resolutionResults = [];
	if (game.hasCycle()) {
		resolutions = getPossibleResolutions(game);
		for (var i = 0; i < resolutions.length; i++) {
			resolutionResults[i] = copy(game);
			resolutionResults[i].resolve(resolutions[i][0], resolutions[i][1]);
		}
	} else {
		resolutionResults.push(copy(game));
	}

	for (var r = 0; r < resolutionResults.length; r++) {
		var preMove = resolutionResults[r];
		var resolution = null;
		if (resolutions.length > r) resolution = resolutions[r];
		if (preMove.winner != null) {
			result.push(generateMove(game, null, resolution));
			continue;
		}
		var validSquares = [];
		for (var i = 0; i < preMove.board.length; i++) {
			if (typeof preMove.board[i] == "object") {
				validSquares.push(i);
			}
		}
		for (var i = 0; i+1 < validSquares.length; i++) {
			for (var j = i+1; j < validSquares.length; j++) {
				result.push(generateMove(game, [validSquares[i], validSquares[j]], resolution))
			}
		}
	}
	result.sort(function(move1, move2) { return orderingScore(move2) - orderingScore(move1); });
	return result;
}

function evaluate(game) {
	var result = 0;
	if (game.winner != null) {
		result = game.winner * 1000;
		solution = true;
	}

	// todo: heuristic

	if (game.computerPlayer == 'O') result *= -1;
	return result;
}

function orderingScore(move) {
	var score = 0;
	if (move.newState.winner != null) return 100;
	if (move.move[0] == 4 || move.move[1] == 4) {
		score = 30;
	} else if ([0,2,6,8].includes(move.move[0]) || [0,2,6,8].includes(move.move[1])) {
		score = 20;
	} else {
		score = 10;
	}
	if (move.newState.hasCycle()) {
		score += 50;
	}
	return score;
}

function dfs(qttt) {
	var move = alphaBetaSearch(qttt, maxDepth);
	if (move.resolution != null) {
		qttt.resolve(move.resolution[0], move.resolution[1]);
	}
	if (move.move != null) {
		qttt.move(move.move[0], move.move[1]);
	}
}

function alphaBetaSearch(game, maxDepth) {
//	return maxValue(game, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, maxDepth, 0);
	var v = Number.NEGATIVE_INFINITY;
	var alpha = Number.NEGATIVE_INFINITY;
	var beta = Number.POSITIVE_INFINITY;
	var moves = getPossibleMoves(game);
	var bestMoves = [];
	solution = false;
	for (var i = 0; i < moves.length; i++) {
		var move = moves[i];
		var moveValue = minValue(move.newState, alpha, beta, maxDepth, 1);
		if (moveValue > v) {
			v = moveValue;
			bestMoves = [move];
		} else if (moveValue == v) {
			bestMoves.push(move);
		}
		if (v >= beta) break;
		alpha = Math.max(alpha, v);
	}
	if (solution) {
		return bestMoves[Math.floor(Math.random()*bestMoves.length)];
	} else {
		return bestMoves[0];
	}
}

function maxValue(game, alpha, beta, maxDepth, depth) {
	if (game.winner != null || depth >= maxDepth) return evaluate(game);
	var v = Number.NEGATIVE_INFINITY;
	var moves = getPossibleMoves(game);
	//console.log("Depth " + depth + " - " + moves.length + " moves");
	for (var i = 0; i < moves.length; i++) {
		//console.log("Depth " + depth + " - move " + i + "/" + moves.length);
		v = Math.max(v, minValue(moves[i].newState, alpha, beta, maxDepth, depth+1));
		if (v >= beta) return v;
		alpha = Math.max(alpha, v);
	}
	return v;
}

function minValue(game, alpha, beta, maxDepth, depth) {
	if (game.winner != null || depth >= maxDepth) return evaluate(game);
	var v = Number.POSITIVE_INFINITY;
	var moves = getPossibleMoves(game);
	//console.log("Depth " + depth + " - " + moves.length + " moves");
	for (var i = 0; i < moves.length; i++) {
		//console.log("Depth " + depth + " - move " + i + "/" + moves.length);
		v = Math.min(v, maxValue(moves[i].newState, alpha, beta, maxDepth, depth+1));
		if (v <= alpha) return v;
		beta = Math.min(beta, v);
	}
	return v;
}