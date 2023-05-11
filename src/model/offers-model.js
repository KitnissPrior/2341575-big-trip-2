import { generateOffersByAllTypes } from '../fish/offers';

export default class OffersModel{
  #offers = null;

  constructor (){
    this.#offers = generateOffersByAllTypes();
  }

  get offers () {return this.#offers;}
}
