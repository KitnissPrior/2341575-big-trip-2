import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

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

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const getWeightForTwoNullDates = (pointA, pointB) => {
  const weightA = getWeightForNullDate(pointA.dateFrom, pointA.dateTo);
  const weightB = getWeightForNullDate(pointB.dateFrom, pointB.dateTo);

  return weightA && weightB;
};

const sortPointsByDay = (pointA, pointB) => {
  const weight = getWeightForNullDate(pointA.dateFrom, pointB.dateFrom);

  return weight ?? dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
};

const sortPointsByTime = (pointA, pointB) => {
  const weight = getWeightForTwoNullDates(pointA, pointB);

  const timeA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const timeB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return weight?? timeB - timeA;
};

const sortPointsByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const humanizeFormDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const isRightPoint = (point) => dayjs(point.dateFrom).isBefore(dayjs()) && dayjs(point.dateTo).isAfter(dayjs());

const isPastPoint = (point) => dayjs(point.dateTo).isBefore(dayjs()) || isRightPoint(point);

const isFuturePoint = (point) => dayjs(point.dateFrom).isAfter(dayjs())
|| dayjs(point.dateFrom).isSame(dayjs(), 'D') || isRightPoint(point);

const isDatesEqual = (dateA, dateB) => dayjs(dateA).isSame(dateB, 'D');

export{ humanizePointDay, humanizePointTime, humanizeFormDate, getEventDuration, isDatesEqual,
  isPastPoint, isFuturePoint, getWeightForNullDate, sortPointsByDay, sortPointsByTime, sortPointsByPrice };
