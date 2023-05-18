import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const NoEventsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future points now',
  [FilterType.PAST]: 'There are no past points today',
};

const createNoEventsTemplate = (filterType) => (
  `<p class="trip-events__msg">${NoEventsTextType[filterType]}</p>`);

export default class NoEventsView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template () {
    return createNoEventsTemplate(this.#filterType);
  }
}
