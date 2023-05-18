import { destinations } from '../fish/destination.js';
import Obserbvable from '../framework/observable.js';

export default class DestinationsModel extends Obserbvable {
  #destinations = null;

  constructor () {
    super();
    this.#destinations = destinations;
  }

  get destinations () {return this.#destinations;}

  setDestinations(updateType, newDestinations) {
    this.#destinations = newDestinations;
    this._notify(updateType, destinations);
  }
}
