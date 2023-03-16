import { createElement } from '../render.js';

const createTripEventsTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class TripEventsView {
  #element = null;

  get template () {
    return createTripEventsTemplate;
  }

  get element() {
    if (!this.#element){
      this.#element = createElement(this.getTemplate());
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

