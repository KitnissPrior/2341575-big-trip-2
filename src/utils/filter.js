import { FilterType } from '../fish/constants';
import { isFuturePoint, isPastPoint } from './point';

const filterPoints = {
  [FilterType.EVERYTHING]: (points) => Array.from(points),
  [FilterType.FUTURE]: (points) => Array.from(points).filter((point) => isFuturePoint(point)),
  [FilterType.PAST]: (points) => Array.from(points).filter((point) => isPastPoint(point))
};

export { filterPoints };
