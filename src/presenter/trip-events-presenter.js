import EventsView from '../view/trip-events-view.js';
import NoEventsView from '../view/no-events-view.js';
import SortingView from '../view/sorting-view.js';
import PointPresenter from './point-presenter.js';
import { render, RenderPosition } from '../framework/render.js';
import { updateItem } from '../utils/common.js';

export default class TripEventsPresenter {
  #eventsList = null;
  #tripContainer = null;
  #eventsPresenter = new Map();

  #pointsModel = null;
  #points = null;
  #tripEvents = [];

  #destinations = null;

  #noEventsComponent = new NoEventsView();
  #sortingComponent = new SortingView();

  constructor() {
    this.#eventsList = new EventsView();
  }

  init (tripContainer, pointsModel, destinationsModel) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#points = [...this.#pointsModel.points];
    this.#destinations = destinationsModel.destinations;

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
    pointPresenter.init(point, this.#destinations);

    this.#eventsPresenter.set(point.id, pointPresenter);
  }

  #renderPoints = () => {
    this.#renderEventsList();

    for (let i = 0; i < this.#points.length; i++){
      this.#renderPoint(this.#points[i]);
    }
  };

  #handlePointChange = (updatedPoint) => {
    this.#tripEvents = updateItem(this.#tripEvents, updatedPoint);
    this.#eventsPresenter.get(updatedPoint.id).init(updatedPoint, this.#destinations);
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
  };

  #renderNoEvents = () => {
    render(this.#noEventsComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };
}
