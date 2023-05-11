import { getRandomNumber } from '../utils/common.js';
import { Prices, OffersCount, TYPES } from './constants.js';

const generateOffer = (id, type) => ({
  'id': id,
  'title': `Offer for ${type}-${id+1}`,
  'price': getRandomNumber(Prices.MIN, Prices.MAX),
});

const generateOffersByType = (typeId, isEmpty = false, min = OffersCount.MIN, max = OffersCount.MAX) => ({
  'type': TYPES[typeId],
  'offers': isEmpty ? []
    : Array.from({length: getRandomNumber(min, max)}, (value, id) => generateOffer(id, TYPES[typeId])),
});

const generateOffersByAllTypes = () => Array.from({length: TYPES.length}, (value, id) => generateOffersByType(id));

export { generateOffersByType, generateOffersByAllTypes };
