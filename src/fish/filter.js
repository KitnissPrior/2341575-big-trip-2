import {filterPoints} from '../utils/filter.js';

function generateFilter(points) {
  return Object.entries(filterPoints).map(
    ([filterName, isFilteredPoints]) => ({
      name: filterName,
      isPoints: isFilteredPoints(points).length > 0,
    }),
  );
}

export {generateFilter};
