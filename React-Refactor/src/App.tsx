import { useState } from "react";
import "./App.css";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import Modal from "./components/Modal";
import { GameState, Player } from "./types";
import classNames from "classnames";
import { useLocalStorage } from "./useLocalStorage";
import { deriveGame, deriveStats } from "./utils";


export default function App() {
  const [state, setState] = useLocalStorage<GameState>("game-state-key",{
    currentGameMoves: [],
    history: {
      currentRoundGames: [],
      allGames: [],
    },
  });

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
      }
      return stateClone;
    });
  }

  function handlePlayerMove(squareId: number, player: Player) {
    setState((prev) => {
      const stateClone = structuredClone(prev);
      stateClone.currentGameMoves.push({
        squareId,
        player,
      });
      return stateClone;
    });
  }

  const showModal = false;

  return (
    <>
      <main>
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
              Player {game.currentPlayer.id}, you're up!
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
                  if (existingMove) return;
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
            <p>Player 1</p>
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
            <p>Player 2</p>
            <span data-id="p2-wins">{stats.playerWithStats[1].wins} Wins</span>
          </div>
        </div>
      </main>

      <Footer />
      {game.status.isComplete && (
        <Modal
          message={
            game.status.winner
              ? `Player ${game.status.winner.id} Wins!`
              : "Tie!"
          }
          onClick={() => resetGame(false)}
        />
      )}
    </>
  );
}
