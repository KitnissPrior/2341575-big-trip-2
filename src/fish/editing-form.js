import { getRandomNumber, getRandomElement } from '../utils/common.js';
import { generateDate } from './dates.js';
import { generateOffersByType} from './offers.js';
import { generateDestination } from './destination.js';
import { TYPES, DESTINATIONS, Prices, OffersCount } from './constants.js';

export const generateEditingForm = () => {
  const dateFrom = generateDate();
  const type = getRandomElement(TYPES);
  const destinations = Array.from({length: DESTINATIONS.length}, (value, index) => generateDestination(index));

  return ({
    'basePrice': getRandomNumber(Prices.MIN,Prices.MAX),
    dateFrom,
    'dateTo': generateDate(dateFrom),
    'destination': getRandomElement(destinations).id,
    'isFavorite': Boolean(getRandomNumber(0,1)),
    'offers': generateOffersByType(type, OffersCount.MIN, OffersCount.MAX),
    type,
  });
};
