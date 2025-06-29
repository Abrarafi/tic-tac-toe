import { useState } from "react";
import "./App.css";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import Modal from "./components/Modal";
import { GameState, Player } from "./types";
import classNames from "classnames";

const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "turquoise",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "yellow",
  },
];

function deriveGame(state: GameState) {
  const currentPlayer = players[state.currentGameMoves.length % 2];

  const winningPatterns = [
    [1, 2, 3],
    [1, 5, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 5, 7],
    [3, 6, 9],
    [4, 5, 6],
    [7, 8, 9],
  ];

  let winner = null;
  for (const player of players) {
    const selectedSquareIds = state.currentGameMoves
      .filter((move) => move.player.id === player.id)
      .map((move) => move.squareId);

    for (const pattern of winningPatterns) {
      if (pattern.every((v) => selectedSquareIds.includes(v))) {
        winner = player;
      }
    }
  }
  return {
    moves: state.currentGameMoves,
    currentPlayer,
    status: {
      isComplete: winner != null || state.currentGameMoves.length === 9,
      winner,
    },
  };
}

function deriveStats(state: GameState) {
  return {
    playerWithStats: players.map((player) => {
      const wins = state.history.currentRoundGames.filter(
        (game) => game.status.winner?.id === player.id
      ).length;

      return {
        ...player,
        wins,
      };
    }),
    ties: state.history.currentRoundGames.filter(
      (game) => game.status.winner === null
    ).length,
  };
}

export default function App() {
  const [state, setState] = useState<GameState>({
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
            <i className="fa-solid fa-x"></i>
            <p>Player 1, you're up!</p>
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
