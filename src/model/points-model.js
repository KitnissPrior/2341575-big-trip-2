import { generatePoint } from '../fish/point.js';
import { POINTS_COUNT } from '../fish/constants.js';

export default class PointsModel{
  #points = null;

  constructor (){
    this.#points = Array.from({length: POINTS_COUNT}, generatePoint);
  }

  get points () { return this.#points;}
}
