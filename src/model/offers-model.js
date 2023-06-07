import Obserbvable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class OffersModel extends Obserbvable {
  #offers = [];
  #pointsApiService = null;

  constructor (pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get offers () {return this.#offers;}

  init = async () => {
    try {
      this.#offers = await this.#pointsApiService.offers;
    } catch(err) {
      this.#offers = [];
    }

    this._notify(UpdateType.INIT);
  };

}
