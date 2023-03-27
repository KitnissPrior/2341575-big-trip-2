const getRandomNumber = (start, end) => {
  start = Math.min(start,end);
  end = Math.max(start, end);

  return Math.round(Math.random()* (end - start) + start);
};

const getRandomElement = (elements) => {
  const randomIndex = getRandomNumber(0, elements.length - 1);

  return elements[randomIndex];
};

const isEscape = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export {getRandomNumber, getRandomElement, isEscape};
