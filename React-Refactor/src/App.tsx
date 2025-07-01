import { useEffect, useState } from "react";
import "./App.css";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import Modal from "./components/Modal";
import { GameMode, GameState, Player } from "./types";
import classNames from "classnames";
import { useLocalStorage } from "./useLocalStorage";
import { deriveGame, deriveStats, players } from "./utils";
import { findBestMove } from "./ai";

export default function App() {
  const [state, setState] = useLocalStorage<GameState>("game-state-key", {
    currentGameMoves: [],
    history: {
      currentRoundGames: [],
      allGames: [],
    },
    mode: "pvp",
  });
  const [showModeSelection, setShowModeSelection] = useState(true);
  const [isComputerMoving, setIsComputerMoving] = useState(false);

  const game = deriveGame(state);
  const stats = deriveStats(state);

  function resetGame(isNewRound: boolean) {
    setState((prev) => {
      const stateClone = structuredClone(prev);
      const { status, moves } = game;

      if (status.isComplete) {
        stateClone.history.currentRoundGames.push({
          moves,
          status,
        });
      }

      stateClone.currentGameMoves = [];
      if (isNewRound) {
        stateClone.history.currentRoundGames.push(
          ...stateClone.history.currentRoundGames
        );
        stateClone.history.currentRoundGames = [];
        setShowModeSelection(true);
      }

      return stateClone;
    });
  }

  function handlePlayerMove(squareId: number, player: Player) {
    if (isComputerMoving) return;
    setState((prev) => {
      const stateClone = structuredClone(prev);
      stateClone.currentGameMoves.push({
        squareId,
        player,
      });
      return stateClone;
    });
  }

  function selectMode(mode: GameMode) {
    resetGame(true);
    setState((prev) => {
      const stateClone = structuredClone(prev);
      stateClone.mode = mode;
      stateClone.currentGameMoves = [];
      return stateClone;
    });
    setIsComputerMoving(false);
    setShowModeSelection(false);
  }

  useEffect(() => {
  // Only proceed if it's computer's turn in PVC mode
  if (
    state.mode !== "pvc" ||
    game.status.isComplete ||
    game.currentPlayer.id !== 2 ||
    isComputerMoving
  ) {
    return;
  }

  setIsComputerMoving(true);
  console.log("Computer starting to think...");

  const timer = setTimeout(() => {
    console.log("Computer making move");
    const bestMove = findBestMove(state,'hard');
    console.log("Best move:", bestMove);
    
    setState((prev) => {
      const stateClone = structuredClone(prev);
      stateClone.currentGameMoves.push({
        squareId: bestMove,
        player: players[1],
      });
      return stateClone;
    });
    
    setIsComputerMoving(false);
  }, 500);

  return () => {
    console.log("Cleaning up computer move timer");
    clearTimeout(timer);
  };
}, [state.currentGameMoves.length, game.status.isComplete]); // Simplified dependencies

  return (
    <>
      <main>
        {showModeSelection && (
          <div className="modal">
            <div className="modal-content">
              <h2>Select Game Mode</h2>
              <button
                className="btn btn-turquoise"
                onClick={() => selectMode("pvp")}
              >
                Player vs Player
              </button>
              <button
                className="btn btn-yellow"
                onClick={() => selectMode("pvc")}
              >
                Player vs Computer
              </button>
            </div>
          </div>
        )}
        <div className="mode-selector">
          <h2>Play:</h2>
          {state.mode === 'pvc'?(
            <button
                className="btn btn-turquoise"
                onClick={() => selectMode("pvp")}
              >
                Player vs Player
              </button>
          ):
          (
            <button
                className="btn btn-yellow"
                onClick={() => selectMode("pvc")}
              >
                Player vs Computer
              </button>
          )}
        </div>
        <div className="grid" data-id="grid">
          <div className="turn yellow" data-id="turn">
            <i
              className={classNames(
                "fa-solid",
                game.currentPlayer.colorClass,
                game.currentPlayer.iconClass
              )}
            ></i>
            <p className={classNames(game.currentPlayer.colorClass)}>
              {state.mode === "pvc" && game.currentPlayer.id === 2
                ? "Computer thinking..."
                : `Player ${game.currentPlayer.id}, you're up!`}
            </p>
          </div>

          <Menu onAction={(action) => resetGame(action === "new-round")} />

          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((squareId) => {
            const existingMove = game.moves.find(
              (move) => move.squareId === squareId
            );

            return (
              <div
                key={squareId}
                className="square shadow"
                onClick={() => {
                  if (
                    existingMove ||
                    isComputerMoving ||
                    (state.mode === "pvc" && game.currentPlayer.id === 2)
                  )
                    return;
                  handlePlayerMove(squareId, game.currentPlayer);
                }}
              >
                {existingMove && (
                  <i
                    className={classNames(
                      "fa-solid",
                      existingMove.player.colorClass,
                      existingMove.player.iconClass
                    )}
                  ></i>
                )}
              </div>
            );
          })}

          <div
            className="score shadow"
            style={{ backgroundColor: "var(--turquoise)" }}
          >
            <p>{state.mode==='pvc'? 'Player':'Player 1'}</p>
            <span data-id="p1-wins">{stats.playerWithStats[0].wins} Wins</span>
          </div>
          <div
            className="score shadow"
            style={{ backgroundColor: "var(--light-gray)" }}
          >
            <p>Ties</p>
            <span data-id="ties">{stats.ties}</span>
          </div>
          <div
            className="score shadow"
            style={{ backgroundColor: "var(--yellow)" }}
          >
            <p>{state.mode==='pvc'? 'Computer':'Player 2'}</p>
            <span data-id="p2-wins">{stats.playerWithStats[1].wins} Wins</span>
          </div>
        </div>
      </main>

      <Footer />
      {game.status.isComplete && (
        <Modal
          message={
            game.status.winner
              ? ` ${game.status.winner.id===2&&state.mode==='pvc'? 'Computer':`Player ${game.status.winner.id}`} Wins!`
              : "Tie!"
          }
          onClick={() => resetGame(false)}
        />
      )}
    </>
  );
}
