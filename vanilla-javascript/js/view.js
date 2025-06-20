export default class View {
  $ = {};
  $$ = {};

  constructor() {
    //single Elements
    this.$.menu = this.#qs('[data-id = "menu"]');
    this.$.menuBtn = this.#qs('[data-id = "menu-btn"]');
    this.$.menuItems = this.#qs('[data-id = "menu-items"]');
    this.$.resetBtn = this.#qs('[data-id = "reset-btn"]');
    this.$.newRoundBtn = this.#qs('[data-id = "new-round-btn"]');
    this.$.modal = this.#qs('[data-id = "modal"]');
    this.$.modalTxt = this.#qs('[data-id = "modal-txt"]');
    this.$.modalBtn = this.#qs('[data-id = "modal-btn"]');
    this.$.turn = this.#qs('[data-id = "turn"]');
    this.$.p1wins = this.#qs('[data-id = "p1wins"]');
    this.$.p2wins = this.#qs('[data-id = "p2wins"]');
    this.$.ties = this.#qs('[data-id = "ties"]');
    this.$.grid = this.#qs('[data-id = "grid"]');

    //elements list
    this.$$.square = this.#qsAll('[data-id = "square"]');

    //UI only evenlisteners
  }

  #qs(selector, parent) {
    const el = parent
      ? parent.queryselector(selector)
      : document.querySelector(selector);

    if (!el) throw new Error("Could not find the Element!");

    return el;
  }

  #qsAll(selector) {
    const elist = document.querySelectorAll(selector);

    if (!elist) throw new Error("Could not find the Element!");

    return elist;
  }
}
