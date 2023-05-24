import NewFormView from '../view/new-form-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { isEscape } from '../utils/common.js';
import { UserAction, UpdateType, EVENT_TYPES } from '../const.js';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

export default class NewFormPresenter {
  #eventsListContainer = null;
  #newFormComponent = null;

  #changeData = null;
  #destroyCallback = null;

  #offers = null;
  #destinations = null;

  constructor (eventsListContainer, changeData, destinations, offers) {
    this.#eventsListContainer = eventsListContainer;
    this.#changeData = changeData;

    this.#offers = offers;
    this.#destinations = destinations;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#newFormComponent !== null) {
      return;
    }

    this.#newFormComponent = new NewFormView(this.#getBlankForm(), this.#destinations, this.#offers);

    this.#newFormComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#newFormComponent.setFormCloseHandler(this.#handleFormClose);
    this.#newFormComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#newFormComponent, this.#eventsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#newFormComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#newFormComponent);
    this.#newFormComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #getBlankForm = () => ({
    'basePrice': 0,
    'dateFrom': dayjs().toDate(),
    'dateTo': dayjs().toDate(),
    'destination': this.#destinations[0].id,
    'id': 0,
    'isFavourite': false,
    'offers': [],
    'type': EVENT_TYPES[0],
  });

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
    );

    this.destroy();
  };

  #handleDeleteClick = () => this.destroy();

  #handleFormClose = () => this.destroy();

  #escKeyDownHandler = (evt) => {
    if (isEscape(evt)){
      evt.preventDefault();
      this.destroy();
    }
  };
}
