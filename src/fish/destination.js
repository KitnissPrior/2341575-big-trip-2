import { getRandomElement} from '../utils/common.js';
import { DESCRIPTIONS, DESTINATIONS } from './constants.js';
import { generatePictures } from './picture.js';

const generateDestination = (id) =>  ({
  'id': id,
  'description': getRandomElement(DESCRIPTIONS),
  'name': DESTINATIONS[id],
  'pictures': generatePictures(),
});

export const destinations = Array.from({length: DESTINATIONS.length}, (value, index) => generateDestination(index));
