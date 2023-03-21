import EventsView from '../view/trip-events-view.js';
import NoEventsView from '../view/no-events-view.js';
import PointView from '../view/point-view.js';
import EditingFormView from '../view/editing-form-view.js';
import SortingView from '../view/sorting-view.js';
import { render } from '../render.js';
import { isEscape } from '../utils.js';

export default class TripEventsPresenter {
  #eventsList = null;
  #tripContainer = null;
  #pointsModel = null;
  #points = null;
  #destinations = null;

  constructor() {
    this.#eventsList = new EventsView();
  }

  init (tripContainer, pointsModel, destinationsModel) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#points = [...this.#pointsModel.points];
    this.#destinations = destinationsModel.destinations;

    if(this.#points.length === 0){
      render(new NoEventsView(), this.#tripContainer);
    }

    else{
      render(new SortingView(), this.#tripContainer);
      render(this.#eventsList, this.#tripContainer);

      for (let i = 0; i < this.#points.length; i++){
        this.#renderPoint(this.#points[i]);
      }
    }
  }

  #renderPoint (point) {
    const pointComponent = new PointView(point, this.#destinations);
    const editingForm = new EditingFormView(point, this.#destinations);

    const replacePointToEditForm = () => {
      this.#eventsList.element.replaceChild(editingForm.element, pointComponent.element);
    }

    const replaceEditFormToPoint = () => {
      this.#eventsList.element.replaceChild(pointComponent.element, editingForm.element);
    }

    const closeEditForm = () => {
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }

    const onEscKeyDown = (evt) => {
      if (isEscape(evt)) {
        evt.preventDefault();
        closeEditForm();
      }
    }

    const onCloseEditFormClick = () => closeEditForm();

    const onOpenEditFormClick = () => {
      replacePointToEditForm();
      document.addEventListener('keydown', onEscKeyDown);
    }

    const onEditFormSubmit = (evt) => {
      evt.preventDefault();
      closeEditForm();
    }

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', onOpenEditFormClick);

    editingForm.element.addEventListener('submit', onEditFormSubmit);

    editingForm.element.querySelector('.event__rollup-btn').addEventListener('click', onCloseEditFormClick);

    render(pointComponent, this.#eventsList.element);
  }
}
