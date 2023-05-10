const TYPES = ['taxi', 'bus', 'train', 'ship','drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const POINTS_COUNT = 10;

const DESTINATIONS = [
  'Praha',
  'Ekaterinburg',
  'New York',
  'Sochi',
  'Hamburg',
  'Machu Picchu',
  'Detroit',
  'Madrid',
  'London',
];

const DESCRIPTIONS = [
  'This is a perfect place for vacation with children.',
  'There are wonderful beaches and sunny days.',
  'You can easily get lost in this tangled streets.',
  'A nice city with cozy cafes and green alleys.',
  'Beatiful, modern city located in the coldest region of the country.',
  null,
];

const PICTURE_DISCRIPTIONS = [
  'Nice place',
  'Ugly building',
  'Pretty picture',
  'Ancient city',
];

const PicturesInfo = {
  COUNT: 5,
  SRC: 100,
};

const Prices = {
  MIN: 100,
  MAX: 500
};

const OffersCount = {
  MIN: 0,
  MAX: 6
};

export {TYPES, POINTS_COUNT, DESTINATIONS, DESCRIPTIONS, PICTURE_DISCRIPTIONS,
  PicturesInfo, Prices, OffersCount };
