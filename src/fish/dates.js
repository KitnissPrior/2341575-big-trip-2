import { getRandomNumber } from '../utils/common.js';
import dayjs from 'dayjs';

export const generateDate = (day1 = dayjs()) =>{
  const maxDaysGap = 7;
  const maxHoursGap = 24;
  const maxMinutesGap = 60;

  const daysGap = getRandomNumber(0, maxDaysGap);
  const hoursGap = getRandomNumber(0, maxHoursGap);
  const minutesGap = getRandomNumber(0, maxMinutesGap);

  return dayjs(day1).add(daysGap, 'day').
    add(hoursGap, 'hour').
    add(minutesGap, 'minute').toDate();
};
