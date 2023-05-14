import { getRandomNumber, getRandomElement } from '../utils/common.js';
import { Prices } from './constants.js';
import { generateDate } from './dates.js';
import {nanoid} from 'nanoid';
import { destinations } from '../fish/destination';
import { allOffers } from './offers.js';

export const generatePoint = () => {
  const dateFrom = generateDate();
  const offersByType = getRandomElement(allOffers);
  const offersTotalCount = offersByType.offers.length;
  const offersCount = offersTotalCount > 2? getRandomNumber(2, offersTotalCount) : offersTotalCount;

  return ({
    'basePrice': getRandomNumber(Prices.MIN, Prices.MAX),
    dateFrom,
    'dateTo': generateDate(dateFrom),
    'destination': getRandomElement(destinations).id,
    'id': nanoid(),
    'isFavourite': Boolean(getRandomNumber(0,1)),
    'offers': offersByType.offers.map((offer) => offer.id).slice(0, offersCount),
    'type': offersByType.type,
  });
};
