
class BaseWidget {
  constructor(wrapperElement, initialValue) {
    const thisWidget = this;

    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;

    thisWidget.correctValue = initialValue;
  }
  get value() { //metoda get value zwraca wartość właściwości correctValue - w tej właściwości będzie przechowywana wartość widgetu
    
    const thisWidget = this;
    return thisWidget.correctValue;
  }

    

  set value(value) {/// metoda set value zostanie wywołana kiedy value zostanie zmienione
    const thisWidget = this;

    const newValue = thisWidget.parseValue(value); //stała newValue będzie zawierała metodę parsedValue(

            
    //if sprawdza czy wartość jest inna niż dotychczasowa i isValid sprawdza czy wartość jest poprawna – np. czy jest liczbą.
    if (newValue !== thisWidget.correctValue // new Value jest inna niż dotychczasowa
            && thisWidget.isValid(newValue)) {//newValue jest większa bądź równa amount.Widget.defaultMin
      thisWidget.correctValue = newValue; // czy wartość jest poprawna i mieści się w przyjętym zakresie
      thisWidget.announce();
    }

    thisWidget.renderValue(); //wywołujemy metodę wyświetlającą wartość widgetu

  }


  setValue(value) {
    const thisWidget = this;

    thisWidget.value = value;
  }

  parseValue(value) { //konwertowanie przekazanego argumentu na liczbę
    return parseInt(value);

  }

  isValid(value) { //sprawdzamy czy ustawiona wartość jest poprawna
    return !isNaN(value);

  }
  renderValue() {
    const thisWidget = this;

    thisWidget.dom.wraper.innerHTML = thisWidget.correctalue;
  }
  announce() {
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }

}

export default BaseWidget;