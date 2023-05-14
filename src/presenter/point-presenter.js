import PointView from '../view/point-view.js';
import EditingFormView from '../view/editing-form-view.js';
import { render, replace, remove } from '../framework/render.js';
import { isEscape } from '../utils/common.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #eventsList = null;
  #point = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #changeData = null;
  #changeMode = null;

  #mode = Mode.DEFAULT;

  constructor (eventsList, changeData, changeMode) {
    this.#eventsList = eventsList;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point, destinations, offers) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView(point, destinations, offers);
    this.#pointEditComponent = new EditingFormView(point, destinations, offers);

    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#pointEditComponent.setFormSubmitHandler(this.#handleEditFormSubmit);
    this.#pointEditComponent.setFormCloseHandler(this.#handleEditFormClose);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#eventsList);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closeForm();
    }
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };

  #closeForm = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceEditFormToPoint();

    document.removeEventListener('keydown', this.#handleEscKeyDown);
  };

  #replacePointToEditForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);

    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceEditFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#mode = Mode.DEFAULT;
  };

  #handleEscKeyDown = (evt) => {
    if (isEscape(evt)) {
      evt.preventDefault();
      this.#closeForm();
    }
  };

  #handleEditFormClose = () => this.#closeForm();

  #handleEditClick = () => {
    this.#replacePointToEditForm();
    document.addEventListener('keydown', this.#handleEscKeyDown);
  };

  #handleFavoriteClick = () => {
    this.#changeData({...this.#point, isFavourite: !this.#point.isFavourite});
  };

  #handleEditFormSubmit = (point) => {
    this.#changeData(point);
    this.#replaceEditFormToPoint();
    document.removeEventListener('keydown', this.#handleEscKeyDown);
  };
}
