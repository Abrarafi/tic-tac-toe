import { GameState, Player } from "./types";
import { players, deriveGame } from "./utils";

export function findBestMove(state: GameState): number {
  const game = deriveGame(state);
  const availableMoves = getAvailableMoves(state);
  
  // If it's the first move, return a corner for better gameplay
  if (state.currentGameMoves.length === 0) {
    return [1, 3, 7, 9][Math.floor(Math.random() * 4)];
  }

  let bestScore = -Infinity;
  let bestMove = -1;

  for (const move of availableMoves) {
    const newState = makeMove(state, move, players[1]); // Computer is player 2
    const score = minimax(newState, 0, false);
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function minimax(state: GameState, depth: number, isMaximizing: boolean): number {
  const game = deriveGame(state);
  
  if (game.status.isComplete) {
    if (game.status.winner?.id === 2) return 10 - depth; // Computer wins
    if (game.status.winner?.id === 1) return depth - 10; // Player wins
    return 0; // Tie
  }

  const availableMoves = getAvailableMoves(state);
  
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const move of availableMoves) {
      const newState = makeMove(state, move, players[1]); // Computer's move
      const score = minimax(newState, depth + 1, false);
      bestScore = Math.max(score, bestScore);
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const move of availableMoves) {
      const newState = makeMove(state, move, players[0]); // Player's move
      const score = minimax(newState, depth + 1, true);
      bestScore = Math.min(score, bestScore);
    }
    return bestScore;
  }
}

function getAvailableMoves(state: GameState): number[] {
  const allSquares = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const occupiedSquares = state.currentGameMoves.map(move => move.squareId);
  return allSquares.filter(square => !occupiedSquares.includes(square));
}

function makeMove(state: GameState, squareId: number, player: Player): GameState {
  const newState = structuredClone(state);
  newState.currentGameMoves.push({
    squareId,
    player
  });
  return newState;
}