import FiltersView from './view/filters-view.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';
import { render } from './render.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');
const tripPresenter = new TripEventsPresenter();

const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();

render(new FiltersView(), siteHeaderElement.querySelector('.trip-controls__filters'));

tripPresenter.init(siteMainElement.querySelector('.trip-events'), pointsModel, destinationsModel);
