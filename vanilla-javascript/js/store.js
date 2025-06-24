const initialState = {
  currentGameMoves: [],
  history: {
    currentRoundGames: [],
    allGames: [],
  },
};
export default class store extends EventTarget {
  constructor(key, player) {
    this.storageKey = key;
    this.players = player;
  }

  #saveState() {
    const prevState = this.#getState();
    let newState;

    switch (typeof stateOrFn) {
      case "function":
        newState = stateOrFn(prevState);
        break;
      case "object":
        newState = stateOrFn;
        break;
      default:
        throw new Error("Ivalid argument passed or saveState");
    }

    window.localStorage.setItem(this.storageKey,JSON.stringify(newState));
    this.dispatchEvent(new Event("statechange"));
  }

  #getState() {
    const item = window.localStorage.getItem(this.storageKey);
    return item ? JSON.parse(item) : initialState;
  }
}
