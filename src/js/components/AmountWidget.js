import { settings, select } from '../settings.js';
import BaseWidget from './BaseWidget.js';

class AmountWidget extends BaseWidget {
  constructor(element) {
    super(element, settings.amountWidget.defaultValue);
    const thisWidget = this;


    thisWidget.getElements(element);
    thisWidget.initActions();

    //console.log('AmountWidget:', thisWidget);
    //console.log('constructor arguments:', element);
  }

  getElements() {
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }



  isValid(value) {
    return !isNaN(value)
      && value >= settings.amountWidget.defaultMin
      && value <= settings.amountWidget.defaultMax;

  }

  renderValue() {
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value; //jeśli wartość jest dopuszczalna to zapisujemy ją w thisWidget.value
  }


  initActions() {

    const thisWidget = this;
    //dodanie reakcji na eventy
    //add EventListener 'change' for thisWidget.input listener
    thisWidget.dom.input.addEventListener('change', function () {
      thisWidget.value = thisWidget.dom.input.value; //in the handler use setValue method with the argument as above
    });
    //add EventListener 'click' for thisWidget.linkDecrease
    thisWidget.dom.linkDecrease.addEventListener('click', function (event) {
      event.preventDefault(); // in the handler use prevent Default, setValue method with argument thisWidget.value -1
      thisWidget.value = thisWidget.value - 1;
    });
    //add EventListener 'click' for thisWidget.linkIncrease
    thisWidget.dom.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault(); //// in the handler use prevent Default, setValue method with argument thisWidget.value +1
      thisWidget.value = thisWidget.value + 1;
    });
  }



}

export default AmountWidget; 
