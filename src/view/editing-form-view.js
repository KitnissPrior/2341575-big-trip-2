import { humanizeFormDate } from '../utils/point.js';
import { getOffersByType } from '../fish/offers.js';
import AbstractView from '../framework/view/abstract-view.js';

const fillOffersList = (checkedItems, allOffers) => {
  let offers = '';

  allOffers.forEach((item) => {
    const isChecked = checkedItems.find((offer) => offer.id === item.id) ? 'checked' : '';

    offers += `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort" ${isChecked}>
    <label class="event__offer-label" for="event-offer-comfort-1">
      <span class="event__offer-title">${item.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${item.price}</span>
    </label>
    </div>`;
  });

  return offers;
};

const getOffers = (checkedOffers, allOffers) => {
  if (allOffers.length === 0){
    return '';
  }

  return (`<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${fillOffersList(checkedOffers, allOffers)}
    </div>
    </section>`);
};

const getAvailableDestinations = (destinations) => {
  let values = '';

  destinations.forEach((item) => {
    values += `<option value='${item.name}'></option>`;
  });

  return (
    `<datalist id="destination-list-1">
      ${values}
    </datalist>`);
};

const getDestinationsList = (thisDestination, destinations, type) => {
  const destinationsByType = destinations.find((item) => item.type === type);
  const allDestinatioins = destinationsByType? destinationsByType : destinations;

  return(
    `<div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
    ${type}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value='${thisDestination}' list="destination-list-1">
    ${getAvailableDestinations(allDestinatioins)}
    </div>`);
};

const getPhotosBlock = (items) => {
  if (items === null){
    return '';
  }

  let photos = '';

  items.forEach((item) => {
    photos += `<img class="event__photo" src='${item.src}' alt='${item.description}'></img>`;
  });

  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
      ${photos}
      </div>
    </div>`);
};

const getDestinationBlock = (destination) => {
  const description = destination.description !== null ? destination.description : '';

  return(
    `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>
    ${getPhotosBlock(destination.pictures)}
    </section>`);
};

const createEditingFormTemplate = (form, allDestinations) => {
  const {basePrice, dateFrom, dateTo, destination, offers, type} = form;

  const allOffers = getOffers(offers.offers, getOffersByType(type));

  const humanizedDateFrom = humanizeFormDate(dateFrom);
  const humanizedDateTo = humanizeFormDate(dateTo);

  const currentDestination = allDestinations.find((item) => item.id === destination);

  const destinationBlock = currentDestination.description === null && currentDestination.pictures === null
    ? ''
    : getDestinationBlock(currentDestination);

  const availableDestinations = getDestinationsList(currentDestination.name, allDestinations, type);

  return(
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>

            <div class="event__type-item">
              <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
              <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
              <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
              <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
              <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
              <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
              <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
              <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
              <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
              <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
            </div>
          </fieldset>
        </div>
      </div>
      ${availableDestinations}
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value='${humanizedDateFrom}'>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value='${humanizedDateTo}'>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value=${basePrice}>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      ${allOffers}
      ${destinationBlock}
    </section>
  </form>
</li>`
  );
};

export default class EditingFormView extends AbstractView {
  #form = null;
  #destinations = null;

  constructor(form, allDestinatioins){
    super();
    this.#form = form;
    this.#destinations = allDestinatioins;
  }

  get template () {
    return createEditingFormTemplate(this.#form, this.#destinations);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.addEventListener('submit', this.#formSubmitHandler);
  };

  setFormCloseHandler = (callback) => {
    this._callback.formClose = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formCloseHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(this.#form);
  };

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this._callback.formClose();
  };
}
