import AbstractView from '../framework/view/abstract-view.js';

const createTripEventsTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class EventsView extends AbstractView {
  get template () {
    return createTripEventsTemplate();
  }
}

