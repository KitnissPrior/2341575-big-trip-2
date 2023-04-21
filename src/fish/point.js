import { getRandomNumber, getRandomElement } from '../utils/common.js';
import { generateOffersByType } from './offers.js';
import { TYPES, Prices, DESTINATIONS} from './constants.js';
import { generateDate } from './dates.js';
import {nanoid} from 'nanoid';
import { generateDestination } from '../fish/destination';

export const generatePoint = () => {
  const type = getRandomElement(TYPES);
  const dateFrom = generateDate();
  const destinations = Array.from({length: DESTINATIONS.length}, (value, index) => generateDestination(index));

  return ({
    'basePrice': getRandomNumber(Prices.MIN, Prices.MAX),
    dateFrom,
    'dateTo': generateDate(dateFrom),
    'destination': getRandomElement(destinations).id,
    'id': nanoid(),
    'isFavourite': Boolean(getRandomNumber(0,1)),
    'offers': generateOffersByType(type),
    type,
  });
};
