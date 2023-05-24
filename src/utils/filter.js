import { FilterType } from '../const.js';
import { isFuturePoint, isPastPoint } from './point';

const filterPoints = {
  [FilterType.EVERYTHING]: (points) => points === null ? [] : Array.from(points),
  [FilterType.FUTURE]: (points) => points === null ? [] : Array.from(points).filter((point) => isFuturePoint(point)),
  [FilterType.PAST]: (points) => points === null ? [] : Array.from(points).filter((point) => isPastPoint(point))
};

export { filterPoints };
