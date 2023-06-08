import AbstractView from '../framework/view/abstract-view.js';
import { humanizeHeaderDate, isMonthsEqual, isDatesEqual } from '../utils/point.js';

const CitiesCount = {
  ONE_CITY: 1,
  TWO_CITIES: 2,
  THREE_CITIES:3,
};

const getCitiesBlock = (cities) => {
  let route = '';
  switch (cities.length){
    case CitiesCount.ONE_CITY:
      route = cities[0];
      break;
    case CitiesCount.TWO_CITIES:
      route = `${cities[0]}  —  ${cities[1]}`;
      break;
    case CitiesCount.THREE_CITIES:
      route = `${cities[0]}  —  ${cities[1]}  —  ${cities[2]}`;
      break;
    default:
      route = `${cities[0]}  —  ...  —  ${cities[cities.length - 1]}`;
      break;
  }

  return `<h1 class="trip-info__title">${route}</h1>`;
};

const getDatesBlock = (dateFrom, dateTo) => {
  let datesBlock = `${humanizeHeaderDate(dateFrom)}`;

  const humanizedDateTo = humanizeHeaderDate(dateTo);

  if (!isDatesEqual(dateFrom, dateTo)) {
    datesBlock +=`&nbsp;&mdash;&nbsp;${isMonthsEqual(dateFrom, dateTo)? humanizedDateTo.split(' ')[1] : humanizedDateTo}`;
  }

  return `<p class="trip-info__dates">${datesBlock}</p>`;
};

const createHeaderTemplate = (tripInfo) => {
  const {cities, dateFrom, dateTo, price} = tripInfo;

  return (
    `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      ${getCitiesBlock(cities)}
      ${getDatesBlock(dateFrom, dateTo)}
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
    </p>
    </section>`
  );
};

export default class HeaderInfoView extends AbstractView {
  #tripInfo = null;

  constructor(tripInfo) {
    super();
    this.#tripInfo = tripInfo;
  }

  get template() {
    return createHeaderTemplate(this.#tripInfo);
  }
}
