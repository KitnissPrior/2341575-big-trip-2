import NewFormView from '../view/new-form-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { isEscape } from '../utils/common.js';
import { UserAction, UpdateType, EVENT_TYPES } from '../const.js';
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
    this.#newFormComponent.setCancelClickHandler(this.#handleCancelClick);

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

  setSaving = () => {
    this.#newFormComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#newFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#newFormComponent.shake(resetFormState);
  };

  #getBlankForm = () => ({
    'basePrice': 0,
    'dateFrom': dayjs().toDate(),
    'dateTo': dayjs().toDate(),
    'destination': this.#destinations[0].id,
    'isFavourite': false,
    'offers': [],
    'type': EVENT_TYPES[0],
  });

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleCancelClick = () => this.destroy();

  #escKeyDownHandler = (evt) => {
    if (isEscape(evt)){
      evt.preventDefault();
      this.destroy();
    }
  };
}
