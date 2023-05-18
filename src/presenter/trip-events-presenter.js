import EventsView from '../view/trip-events-view.js';
import NoEventsView from '../view/no-events-view.js';
import SortingView from '../view/sorting-view.js';
import PointPresenter from './point-presenter.js';
import NewFormPresenter from './new-form-presenter.js';
import { render, RenderPosition, remove } from '../framework/render.js';
import { SortType, UserAction, UpdateType, FilterType } from '../const.js';
import { sortPointsByTime, sortPointsByPrice, sortPointsByDay } from '../utils/point.js';
import { filterPoints } from '../utils/filter.js';

export default class TripEventsPresenter {
  #eventsListComponent = null;
  #tripContainer = null;
  #eventsPresenter = new Map();
  #newFormPresenter = null;

  #pointsModel = null;
  #filtersModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #currentSortType = SortType.DAY;
  #currentFilterType = FilterType.EVERYTHING;

  #noEventsComponent = null;
  #sortingComponent = null;

  constructor(tripContainer, pointsModel, offersModel, destinationsModel, filtersModel) {
    this.#eventsListComponent = new EventsView();
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#newFormPresenter = new NewFormPresenter(this.#eventsListComponent.element,
      this.#handleViewAction, this.#destinationsModel.destinations, this.#offersModel.offers);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
  }

  init () {
    this.#renderTripEvents();
  }

  createNewForm (callback) {
    this.#currentSortType = SortType.DAY;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newFormPresenter.init(callback);
  }

  get points() {
    this.#currentFilterType = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filterPoints[this.#currentFilterType](points);

    switch (this.#currentSortType){
      case SortType.PRICE:
        return filteredPoints.sort(sortPointsByPrice);
      case SortType.TIME:
        return filteredPoints.sort(sortPointsByTime);
      default:
        return filteredPoints.sort(sortPointsByDay);
    }
  }

  get destinations() {return this.#destinationsModel.destinations;}

  get offers () {return this.#offersModel.offers;}

  #renderPoint (point) {
    const pointPresenter = new PointPresenter(this.#eventsListComponent.element, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point, this.destinations, this.offers);

    this.#eventsPresenter.set(point.id, pointPresenter);
  }

  #sortEvents = (sortType) => {
    switch (sortType){
      case SortType.PRICE:
        this.#pointsModel.points.sort(sortPointsByPrice);
        break;
      case SortType.TIME:
        this.#pointsModel.points.sort(sortPointsByTime);
        break;
      default:
        this.#pointsModel.points.sort(sortPointsByDay);
    }

    this.#currentSortType = sortType;
  };

  #clearEvents= ({resetSortType = false} = {}) => {
    this.#newFormPresenter.destroy();
    this.#eventsPresenter.forEach((presenter) => presenter.destroy());
    this.#eventsPresenter.clear();

    remove(this.#sortingComponent);

    if(this.#noEventsComponent){
      remove(this.#noEventsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType){
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventsPresenter.get(data.id).init(data, this.destinations, this.offers);
        break;
      case UpdateType.MINOR:
        this.#clearEvents();
        this.#renderTripEvents();
        break;
      case UpdateType.MAJOR:
        this.#clearEvents({resetSortType: true});
        this.#renderTripEvents();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortEvents(sortType);

    this.#clearEvents();
    this.#renderTripEvents();
  };

  #handleModeChange = () => {
    this.#newFormPresenter.destroy();
    this.#eventsPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderTripEvents = () => {
    const points = this.points;
    const pointsCount = points.length;

    if(pointsCount === 0){
      this.#renderNoEvents();
      return;
    }

    this.#renderSort();
    render(this.#eventsListComponent, this.#tripContainer);

    for (let i = 0; i < this.points.length; i++){
      this.#renderPoint(this.points[i]);
    }
  };

  #renderSort = () => {
    this.#sortingComponent = new SortingView(this.#currentSortType);
    this.#sortingComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortingComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderNoEvents = () => {
    this.#noEventsComponent = new NoEventsView({
      filterType: this.#currentFilterType,
    });

    render(this.#noEventsComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };
}
