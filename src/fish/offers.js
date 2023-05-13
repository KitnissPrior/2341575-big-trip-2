import { getRandomNumber } from '../utils/common.js';
import { Prices, OffersCount, TYPES } from './constants.js';

const generateOffer = (id, type) => ({
  'id': id,
  'title': `Offer for ${type}`,
  'price': getRandomNumber(Prices.MIN, Prices.MAX),
});

const generateOffersByType = (typeId, min = OffersCount.MIN, max = OffersCount.MAX) => {
  const isEmpty = getRandomNumber(0, TYPES.length) > TYPES.length - 3;

  return {
    'type': TYPES[typeId],
    'offers': isEmpty ? []
      : Array.from({length: getRandomNumber(min, max)}, (value, id) => generateOffer(id, TYPES[typeId])),
  };
};

const generateOffersByAllTypes = () => Array.from({length: TYPES.length}, (value, id) => generateOffersByType(id));

const allOffers = generateOffersByAllTypes();

export { allOffers, generateOffersByType };
