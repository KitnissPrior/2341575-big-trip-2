const getRandomNumber = (start, end) => {
  start = Math.min(start,end);
  end = Math.max(start, end);

  return Math.round(Math.random()* (end - start) + start);
};

const getRandomElement = (elements) => {
  const randomIndex = getRandomNumber(0, elements.length - 1);

  return elements[randomIndex];
};

const getOffersByType = (offers, type) => offers.find((offer) => offer.type === type);

const isEscape = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export {getRandomNumber, getRandomElement, isEscape, updateItem, getOffersByType};
