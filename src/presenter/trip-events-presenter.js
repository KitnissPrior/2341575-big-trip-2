import EventsView from '../view/trip-events-view.js';
import PointView from '../view/point-view.js';
import NewFormView from '../view/new-form-view.js';
import EditingFormView from '../view/editing-form-view.js';
import SortingView from '../view/sorting-view.js';
import { render } from '../render.js';
import { isEscape } from '../utils.js';

export default class TripEventsPresenter {
  #eventsList = null;

  constructor() {
    this.#eventsList = new EventsView();
  }

  init (tripContainer, pointsModel, editingFormModel, destinationsModel) {
    this.tripContainer = tripContainer;
    this.pointsModel = pointsModel;
    this.points = [...this.pointsModel.points];
    this.destinations = destinationsModel.destinations;

    render(new SortingView(), this.tripContainer);
    render(this.#eventsList, this.tripContainer);

    for (let i = 0; i < this.points.length; i++){
      this.#renderPoint(this.points[i]);
    }
  }

  #renderPoint (point) {
    const pointComponent = new PointView(point, this.destinations);
    const editingForm = new EditingFormView(point, this.destinations);

    const replacePointToEditForm = () => {
      this.#eventsList.element.replaceChild(pointComponent.element, editingForm.element);
    }

    const replaceEditFormToPoint = () => {
      this.#eventsList.element.replaceChild(editingForm.element, pointComponent.element);
    }

    const onEscKeyDown = (evt) => {
      if (isEscape(evt)) {
        evt.preventDefault();
        replaceEditFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    }

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToEditForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointComponent.element.querySelector('.event__save-btn').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    })

    render(pointComponent, this.#eventsList.element);

  }
}
