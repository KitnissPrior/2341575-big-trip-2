import TripEventsPresenter from './presenter/trip-events-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.trip-events');
const newEventButton = siteHeaderElement.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
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

newEventButton.addEventListener('click', handleNewEventButtonClick);

tripPresenter.init();
filterPresenter.init();
