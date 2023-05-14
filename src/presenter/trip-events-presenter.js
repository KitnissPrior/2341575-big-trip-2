import EventsView from '../view/trip-events-view.js';
import NoEventsView from '../view/no-events-view.js';
import SortingView from '../view/sorting-view.js';
import PointPresenter from './point-presenter.js';
import { render, RenderPosition } from '../framework/render.js';
import { updateItem } from '../utils/common.js';
import { SortType } from '../const.js';
import { sortPointsByTime, sortPointsByPrice, sortPointsByDay } from '../utils/point.js';

export default class TripEventsPresenter {
  #eventsList = null;
  #tripContainer = null;
  #eventsPresenter = new Map();

  #pointsModel = null;
  #points = null;
  #tripEvents = [];

  #currentSortType = SortType.DAY;
  #sourcedPoints = [];

  #destinations = null;
  #offers = null;

  #noEventsComponent = new NoEventsView();
  #sortingComponent = new SortingView();

  constructor() {
    this.#eventsList = new EventsView();
  }

  init (tripContainer, pointsModel) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#destinations = pointsModel.destinations;
    this.#offers = pointsModel.offers;

    const pointsSortedByDefault = [...this.#pointsModel.points].sort(sortPointsByDay);

    this.#points = pointsSortedByDefault;
    this.#sourcedPoints = pointsSortedByDefault;

    if(this.#points.length === 0){
      this.#renderNoEvents();
    }

    else{
      this.#renderSort();
      this.#renderPoints();
    }
  }

  #renderPoint (point) {
    const pointPresenter = new PointPresenter(this.#eventsList.element, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point, this.#destinations, this.#offers);

    this.#eventsPresenter.set(point.id, pointPresenter);
  }

  #renderPoints = () => {
    this.#renderEventsList();

    for (let i = 0; i < this.#points.length; i++){
      this.#renderPoint(this.#points[i]);
    }
  };

  #sortEvents = (sortType) => {
    switch (sortType){
      case SortType.PRICE:
        this.#points.sort(sortPointsByPrice);
        break;
      case SortType.TIME:
        this.#points.sort(sortPointsByTime);
        break;
      default:
        this.#points.sort(sortPointsByDay);
    }

    this.#currentSortType = sortType;
  };

  #handlePointChange = (updatedPoint) => {
    this.#tripEvents = updateItem(this.#tripEvents, updatedPoint);
    this.#sourcedPoints = updateItem(this.#sourcedPoints, updatedPoint);
    this.#eventsPresenter.get(updatedPoint.id).init(updatedPoint, this.#destinations, this.#offers);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortEvents(sortType);

    this.#clearEventsList();
    this.#renderPoints();
  };

  #handleModeChange = () => {
    this.#eventsPresenter.forEach((presenter) => presenter.resetView());
  };

  #clearEventsList = () => {
    this.#eventsPresenter.forEach((presenter) => presenter.destroy());
    this.#eventsPresenter.clear();
  };

  #renderEventsList = () => {
    render(this.#eventsList, this.#tripContainer);
  };

  #renderSort = () => {
    render(this.#sortingComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
    this.#sortingComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderNoEvents = () => {
    render(this.#noEventsComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };
}
