import {render, replace, remove, RenderPosition} from '../framework/render.js';
import FilterView from '../view/filters-view.js';
import HeaderInfoView from '../view/header-info-view.js';
import {filterPoints} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';
import { getOffersByType } from '../utils/common.js';
import { sortPointsByDay } from '../utils/point.js';

export default class HeaderPresenter {
  #headerContainer = null;
  #filterModel = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #filterComponent = null;
  #infoComponent = null;

  constructor(headerContainer, filterModel, pointsModel, offersModel, destinationsModel) {
    this.#headerContainer = headerContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points () {return this.#pointsModel.points;}

  get filters() {
    return [
      {
        type: FilterType.EVERYTHING,
        name: 'EVERYTHING',
        count: filterPoints[FilterType.EVERYTHING](this.points).length,
      },
      {
        type: FilterType.FUTURE,
        name: 'FUTURE',
        count: filterPoints[FilterType.FUTURE](this.points).length,
      },
      {
        type: FilterType.PAST,
        name: 'PAST',
        count: filterPoints[FilterType.PAST](this.points).length,
      },
    ];
  }

  get destinations() {return this.#destinationsModel.destinations;}

  get offers () {return this.#offersModel.offers;}

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#headerContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);

    this.#renderInfo();
  };

  #getTotalPrice = (points) => {
    let price = 0;

    points.forEach((point) => {
      price += point.basePrice;

      const offersByCurrentType = getOffersByType(this.offers, point.type).offers;

      if (offersByCurrentType.length > 0 && point.offers.length > 0){
        point.offers.forEach((offerId) => {
          const offer = offersByCurrentType.find((offerByType) => offerByType.id === offerId);
          price += offer.price;
        });
      }
    });

    return price;
  };

  #getStartDate = (points) => {
    if(points.length > 0){
      return points[0].dateFrom;
    }

    return null;
  };

  #getEndDate = (points) => {
    if(points.length > 0){
      return points[points.length - 1].dateTo;
    }

    return null;
  };

  #getCities = (points) => {
    if(this.destinations.length > 0){
      return points.map((point) =>
        this.destinations.find((destination) => destination.id === point.destination).name);
    }

    return [];
  };

  #updateInfo = () => {
    if(this.points){
      const sortedPoints = this.points.sort(sortPointsByDay);

      this.#infoComponent = new HeaderInfoView({
        cities: this.#getCities(sortedPoints),
        dateFrom: this.#getStartDate(sortedPoints),
        dateTo: this.#getEndDate(sortedPoints),
        price: this.#getTotalPrice(sortedPoints),
      });
    }
  };

  #renderInfo = () => {
    let previousInfoComponent = this.#infoComponent;

    if(this.points.length && this.offers.length && this.destinations.length) {
      this.#updateInfo();
    }
    if(this.points.length === 0 && previousInfoComponent){
      replace(this.#infoComponent, previousInfoComponent);
      remove(previousInfoComponent);
      previousInfoComponent = null;
      return;
    }

    if(this.#infoComponent)
    {
      if(previousInfoComponent) {
        replace(this.#infoComponent, previousInfoComponent);
        remove(previousInfoComponent);
      }
      render(this.#infoComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
    }
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
