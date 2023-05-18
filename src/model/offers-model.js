import { allOffers } from '../fish/offers.js';
import Obserbvable from '../framework/observable.js';

export default class OffersModel extends Obserbvable {
  #offers = null;

  constructor () {
    super();
    this.#offers = allOffers;
  }

  get offers () {return this.#offers;}

  setOffers(updateType, newOffers) {
    this.#offers = newOffers;
    this._notify(updateType, newOffers);
  }
}
