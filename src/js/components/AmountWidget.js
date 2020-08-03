import { settings, select } from '../settings.js';

class AmountWidget {
  constructor(element) {
    const thisWidget = this;

    thisWidget.value = settings.amountWidget.defaultValue;

    thisWidget.getElements(element);
    thisWidget.setValue(thisWidget.input.value);
    thisWidget.initActions();

    //console.log('AmountWidget:', thisWidget);
    //console.log('constructor arguments:', element);
  }

  getElements(element) {
    const thisWidget = this;

    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }

  setValue(value) { //metoda zapisująca wartość zapisanego argumentu
    const thisWidget = this;
    const newValue = parseInt(value);

    /*TODO: add validation */
    if (newValue !== thisWidget.value // new Value jest inna niż dotychczasowa
      && newValue >= settings.amountWidget.defaultMin //newValue jest większa bądź równa amount.Widget.defaultMin
      && newValue <= settings.amountWidget.defaultMax) { //newValue jest mniejsza bądź równa amountWidget.default
      thisWidget.value = newValue; //do sprawdzania czy wartość jest poprawna i mieści się w przyjętym zakresie
      thisWidget.announce();
    }

    thisWidget.input.value = thisWidget.value; //jeśli wartość jest dopuszczalna to zapisujemy ją w thisWidget.value
  }

  initActions() {

    const thisWidget = this;
    //dodanie reakcji na eventy
    //add EventListener 'change' for thisWidget.input listener
    thisWidget.input.addEventListener('change', function () {
      thisWidget.setValue(thisWidget.input.value); //in the handler use setValue method with the argument as above
    });
    //add EventListener 'click' for thisWidget.linkDecrease
    thisWidget.linkDecrease.addEventListener('click', function (event) {
      event.preventDefault(); // in the handler use prevent Default, setValue method with argument thisWidget.value -1
      thisWidget.setValue(thisWidget.value - 1);
    });
    //add EventListener 'click' for thisWidget.linkIncrease
    thisWidget.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault(); //// in the handler use prevent Default, setValue method with argument thisWidget.value +1
      thisWidget.setValue(thisWidget.value + 1);
    });
  }

  // metoda annouce tworzy instance klasy.... 
  announce() {
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.element.dispatchEvent(event);
  }

}

export default AmountWidget; 
