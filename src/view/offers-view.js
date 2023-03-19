import { createElement } from '../render.js';

const createOffersTemplate = (offers) => (
  `<ul class="event__selected-offers">
  ${offers}
  </ul>`
);

export default class OffersView {
  #element = null;
  #offers = null;

  constructor(offers){
    this.#offers = offers;
  }

  get template () {
    return createOffersTemplate(this.#offers);
  }

  get element() {
    if (!this.#element){
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
