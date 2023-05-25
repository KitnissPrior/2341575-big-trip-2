import Obserbvable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class DestinationsModel extends Obserbvable {
  #destinations = [];
  #pointsApiService = null;

  constructor (pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get destinations () {return this.#destinations;}

  init = async () => {
    try {
      this.#destinations = await this.#pointsApiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  };
}
