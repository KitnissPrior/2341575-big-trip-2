import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, currentFilter) => {
  const {type, name, count } = filter;

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${name}" 
      class="trip-filters__filter-input  visually-hidden" 
      type="radio" 
      name="trip-filter" 
      ${type === currentFilter ? 'checked' : ''}
      ${count > 0 ? '' : 'disabled'}
      value=${type}>
      <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
    </div>`
  );
};

const createFiltersTemplate = (filterItems, currentFilter) => {
  const filterItemsTemplate = Array.from(filterItems)
    .map((filter) => createFilterItemTemplate(filter, currentFilter))
    .join('');

  return(
    `<form class="trip-filters" action="#" method="get">
     ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template () {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  };
}
