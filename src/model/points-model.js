import { UpdateType } from '../const.js';
import Obserbvable from '../framework/observable.js';

export default class PointsModel extends Obserbvable {
  #points = null;
  #pointsApiService = null;

  constructor (pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  init = async () => {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch(err) {
      this.#points = [];
    }

    this._notify(UpdateType.INIT);
  };

  get points () { return this.#points;}

  updatePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedTask = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedTask,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, updatedTask);
    } catch(err) {
      throw new Error('Can\'t update task');
    }
  };

  addPoint= (updateType, update) => {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  };

  deletePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  };

  #adaptToClient = (point) => {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      isFavourite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'] ;
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  };
}
