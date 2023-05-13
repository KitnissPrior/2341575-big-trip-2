import { generatePoint } from '../fish/point.js';
import { POINTS_COUNT } from '../fish/constants.js';
import { allOffers } from '../fish/offers.js';
import { destinations } from '../fish/destination.js';

export default class PointsModel{
  #points = null;
  #offers = null;
  #destinations = null;

  constructor (){
    this.#points = Array.from({length: POINTS_COUNT}, generatePoint);
    this.#offers = allOffers;
    this.#destinations = destinations;
  }

  get points () { return this.#points;}

  get destinations () {return this.#destinations;}

  get offers () {return this.#offers;}
}
