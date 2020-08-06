
class BaseWidget {
    constructor(wrapperElement, initialValue) {
        const thisWidget = this;

        thisWidget.dom = {};
        thisWidget.dom.wrapper = wrapperElement;

        thisWidget.correctValue = initialValue;
    }
    get value() {
        const thisWidget = this;
        return thisWidget.correctValue;

    }
    set value(value) { //metoda zapisująca wartość zapisanego argumentu
        const thisWidget = this;

        const newValue = thisWidget.parseValue(value);

        if (newValue !== thisWidget.correctValue // new Value jest inna niż dotychczasowa
            && thisWidget.isValid(newValue)) {//newValue jest większa bądź równa amount.Widget.defaultMin
            thisWidget.correctValue = newValue; //do sprawdzania czy wartość jest poprawna i mieści się w przyjętym zakresie
            thisWidget.announce();
        }

        thisWidget.renderValue();

    }


    setValue(value) {
        const thisWidget = this;

        thisWidget.value = value;
    }

    parseValue(value) {
        return parseInt(value);

    }

    isValid() {
        return !isNaN(value);

    }
    renderValue() {
        const thisWidget = this;

        thisWidget.dom.wraper.innerHTML = thisWidget.correctValue;
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