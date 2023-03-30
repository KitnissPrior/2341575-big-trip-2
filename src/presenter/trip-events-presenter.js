import EventsView from '../view/trip-events-view.js';
import NoEventsView from '../view/no-events-view.js';
import PointView from '../view/point-view.js';
import EditingFormView from '../view/editing-form-view.js';
import SortingView from '../view/sorting-view.js';
import {render, replace } from '../framework/render.js';
import { isEscape } from '../utils/common.js';

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
      replace(editingForm, pointComponent);
    };

    const replaceEditFormToPoint = () => {
      replace(pointComponent, editingForm);
    };

    const onEscKeyDown = (evt) => {
      if (isEscape(evt)) {
        evt.preventDefault();

        replaceEditFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    const closeEditForm = () => {
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    };

    pointComponent.setEditClickHandler(() => {
      replacePointToEditForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    editingForm.setFormSubmitHandler(closeEditForm);
    editingForm.setFormCloseHandler(closeEditForm);

    render(pointComponent, this.#eventsList.element);
  }
}
