import EventsView from '../view/trip-events-view.js';
import NoEventsView from '../view/no-events-view.js';
import SortingView from '../view/sorting-view.js';
import PointPresenter from './point-presenter.js';
import NewFormPresenter from './new-form-presenter.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { render, RenderPosition, remove } from '../framework/render.js';
import { SortType, UserAction, UpdateType, FilterType } from '../const.js';
import { sortPointsByTime, sortPointsByPrice, sortPointsByDay } from '../utils/point.js';
import { filterPoints } from '../utils/filter.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

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
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);
  #isLoading = true;

  #noEventsComponent = null;
  #sortingComponent = null;
  #loadingComponent = new LoadingView();

  constructor(tripContainer, pointsModel, offersModel, destinationsModel, filtersModel) {
    this.#eventsListComponent = new EventsView();
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const points = this.#pointsModel.points;

    this.#currentFilterType = this.#filtersModel.filter;
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

  init () {
    this.#renderTripEvents();
  }

  createNewForm (callback) {
    this.#currentSortType = SortType.DAY;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#deleteNoEventsComponent();
    this.#newFormPresenter.init(callback);
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

  #deleteNoEventsComponent = () => {
    if(this.#noEventsComponent){
      remove(this.#noEventsComponent);
    }
  };

  #clearEvents = ({resetSortType = false} = {}) => {
    this.#newFormPresenter.destroy();
    this.#eventsPresenter.forEach((presenter) => presenter.destroy());
    this.#eventsPresenter.clear();

    remove(this.#sortingComponent);
    remove(this.#loadingComponent);

    this.#deleteNoEventsComponent();

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderPoint (point) {
    const pointPresenter = new PointPresenter(this.#eventsListComponent.element, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point, this.destinations, this.offers);

    this.#eventsPresenter.set(point.id, pointPresenter);
  }

  #renderTripEvents = () => {
    render(this.#eventsListComponent, this.#tripContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if(this.points.length === 0){
      this.#renderNoEvents();
      return;
    }

    this.#renderSort();

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

  #renderLoading = () => {
    render(this.#loadingComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType){
      case UserAction.UPDATE_POINT:
        this.#eventsPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#eventsPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newFormPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newFormPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#eventsPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#eventsPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#deleteNoEventsComponent();
        this.#newFormPresenter = new NewFormPresenter(this.#eventsListComponent.element,
          this.#handleViewAction, this.#destinationsModel.destinations, this.#offersModel.offers);
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
}
