import {render} from './framework/render.js';
import {generateFilter} from './fish/filter.js';
import FiltersView from './view/filters-view.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');
const tripPresenter = new TripEventsPresenter();

const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

const filters = generateFilter(pointsModel.points);

render(new FiltersView(filters), siteHeaderElement.querySelector('.trip-controls__filters'));

tripPresenter.init(siteMainElement.querySelector('.trip-events'), pointsModel, destinationsModel, offersModel);
