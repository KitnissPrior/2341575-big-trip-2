const getOffersByType = (offers, type) => offers.find((offer) => offer.type === type);

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const isEscape = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export { isEscape, getOffersByType, capitalizeFirstLetter };
