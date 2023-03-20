import { generateDestination } from '../fish/destination';
import { DESTINATIONS } from '../fish/constants.js';

export default class DestinationsModel{
  #destinations = null;

  constructor (){
    this.#destinations = Array.from({length: DESTINATIONS.length},(value, index) => generateDestination(index));
  }

  get destinations () {return this.#destinations;}
}
