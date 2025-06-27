import Store from "./store.js";
import View from "./view.js";

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

function init() {
  const view = new View();
  const store = new Store("game-state-key", players);

  store.addEventListener("statechange", () => {
    view.render(store.game, store.stat);
  });

  window.addEventListener("storage", () => {
    console.log("statchange from different tab");
    view.render(store.game, store.stat);
  });

  view.render(store.game, store.stat);

  view.bindResetGameEvent((event) => {
    store.reset();
  });

  view.bindNewRoundEvent((event) => {
    store.newRound();
  });

  view.bindPlayerMoveEvent((square) => {
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );

    if (existingMove) {
      return;
    }
    store.playerMove(+square.id);
  });
}

window.addEventListener("load", init);
