import AbstractView from '../framework/view/abstract-view.js';

const createNoEventsTemplate = () => (
  '<p class="trip-events__msg">Click New Event to create your first point</p>');

export default class NoEventsView extends AbstractView {
  get template () {
    return createNoEventsTemplate();
  }
}
