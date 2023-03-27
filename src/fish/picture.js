import { getRandomElement, getRandomNumber } from '../utils/common.js';
import { PICTURE_DISCRIPTIONS, PicturesInfo } from './constants.js';

const generatePicture = () => ({
  'src': `http://picsum.photos/248/152?r=${getRandomNumber(0, PicturesInfo.SRC)}`,
  'description': getRandomElement(PICTURE_DISCRIPTIONS),
});

export const generatePictures = () => {
  const isPictures = Boolean(getRandomNumber(0,1));

  if (!isPictures){
    return null;
  }

  return Array.from({length: PicturesInfo.COUNT}, generatePicture);
};
