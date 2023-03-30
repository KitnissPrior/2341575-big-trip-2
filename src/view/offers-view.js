import AbstractView from '../framework/view/abstract-view.js';

const createOffersTemplate = (offers) => (
  `<ul class="event__selected-offers">
  ${offers}
  </ul>`
);

export default class OffersView extends AbstractView {
  #offers = null;

  constructor(offers){
    super();
    this.#offers = offers;
  }

  get template () {
    return createOffersTemplate(this.#offers);
  }
}
