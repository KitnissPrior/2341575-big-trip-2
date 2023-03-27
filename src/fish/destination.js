import { getRandomElement} from '../utils/common.js';
import { DESCRIPTIONS, DESTINATIONS } from './constants.js';
import { generatePictures } from './picture.js';

export const generateDestination = (id) =>  ({
  'id': id,
  'description': getRandomElement(DESCRIPTIONS),
  'name': DESTINATIONS[id],
  'pictures': generatePictures(),
});
