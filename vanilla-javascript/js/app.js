import View from "./view.js";

const players = [
  {
    id : 1,
    name : "Player 1",
    iconClass: "fa-x",
    colorClass: "turquoise"
  },
   {
    id : 2,
    name : "Player 2",
    iconClass: "fa-o",
    colorClass: "yellow"
  }
]

function init() {
  const view = new View();

  view.bindResetGameEvent((event) => {
    console.log("game reset");
  });

  view.bindNewRoundEvent((event) => {
    console.log("New round");
  });

  view.bindPlayerMoveEvent((square) => {
    console.log(square);
  });
}

window.addEventListener("load", init);
