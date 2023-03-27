import { getRandomNumber, getRandomElement } from '../utils/common.js';
import { OFFERS, Prices, OffersCount, TYPES } from './constants.js';

const generateOffer = (id) => ({
  'id': id,
  'title': getRandomElement(OFFERS),
  'price': getRandomNumber(Prices.MIN, Prices.MAX),
});


const generateOffersByType = (typeId, min = OffersCount.MIN, max = OffersCount.MAX) => ({
  'type': TYPES[typeId],
  'offers': Array.from({length: getRandomNumber(min, max)}, (value, id) => generateOffer(id)),
});

const generateOffersByAllTypes = () => Array.from({length: TYPES.length}, (value, id) => generateOffersByType(id));

const getOffersByType = (type) => generateOffersByAllTypes().find((item) => item.type === type).offers;

export {generateOffersByType, getOffersByType};
