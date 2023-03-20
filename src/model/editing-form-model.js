import { generateEditingForm } from '../fish/editing-form';

export default class EditingFormModel{
  #form = null;

  constructor (){
    this.#form = generateEditingForm();
  }

  get form () { return this.#form;}
}
