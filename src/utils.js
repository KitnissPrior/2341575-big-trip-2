import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const getRandomNumber = (start, end) => {
  start = Math.min(start,end);
  end = Math.max(start, end);

  return Math.round(Math.random()* (end - start) + start);
};

const getRandomElement = (elements) => {
  const randomIndex = getRandomNumber(0, elements.length - 1);

  return elements[randomIndex];
};

const humanizePointDay = (date) => dayjs(date).format('D MMMM');

const humanizePointTime = (date) => dayjs(date).format('HH:mm');

const getEventDuration = (dateFrom, dateTo) => {
  const timeParts = dayjs.duration(dayjs(dateTo).diff(dateFrom)).
    format('DD HH mm').
    split(' ');

  const days = timeParts[0];
  const hours = timeParts[1];

  let eventDuration = `${timeParts[2]}M`;

  if (hours !== '00' || (hours === '00' && days !== '00')){
    eventDuration = `${hours}H ${eventDuration}`;
  }

  if (days !== '00' ){
    eventDuration = `${days}D ${eventDuration}`;
  }

  return eventDuration;
};

const humanizeFormDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const isEscape = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export{getRandomNumber, getRandomElement,
  humanizePointDay, humanizePointTime, humanizeFormDate,
  getEventDuration, isEscape};
