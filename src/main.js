import TripEventsPresenter from './presenter/trip-events-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic fiyq9ygu563sda35hvsm';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip/';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.trip-events');
const newEventButton = siteHeaderElement.querySelector('.trip-main__event-add-btn');

const apiService = new PointsApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel(apiService);
const offersModel = new OffersModel(apiService);
const destinationsModel = new DestinationsModel(apiService);
const filtersModel = new FilterModel();

const filterPresenter = new FilterPresenter(siteHeaderElement.querySelector('.trip-controls__filters'),
  filtersModel, pointsModel);
const tripPresenter = new TripEventsPresenter(siteMainElement,
  pointsModel, offersModel, destinationsModel, filtersModel);

const handleNewFormClose = () => {
  newEventButton.disabled = false;
};

const handleNewEventButtonClick = () => {
  tripPresenter.createNewForm(handleNewFormClose);
  newEventButton.disabled = true;
};

tripPresenter.init();
filterPresenter.init();

offersModel.init().finally(() => {
  destinationsModel.init().finally(() => {
    pointsModel.init().finally(() => {
      newEventButton.addEventListener('click', handleNewEventButtonClick);
    });
  });
});
