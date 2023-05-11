import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const createSortingTemplate = () => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${Object.values(SortType).map((sortType) => (
    `<div class="trip-sort__item  trip-sort__item--${sortType}">
      <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" data-sort-type="${sortType}"
        type="radio" name="trip-sort" value="sort-${sortType}" 
        ${sortType === SortType.EVENT || sortType === SortType.OFFER ? 'disabled' : ''} 
        ${sortType === SortType.DAY ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-${sortType}">${sortType === SortType.OFFER ? 'Offers' : sortType}</label>
    </div>`)).join('')}
  </form>`
);

export default class SortingView extends AbstractView {
  get template () {
    return createSortingTemplate();
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
