import { select, classNames, templates } from '../settings.js';
import { utils } from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product { // stworzenie KLASY o nazwie PRODUCT
  constructor(id, data) {
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();


    //console.log('new Product:', thisProduct);
  }
  renderInMenu() {
    const thisProduct = this;
    /* generate HTML of each product based on template*/
    const generatedHTML = templates.menuProduct(thisProduct.data);
    /* create element DOM using utilis.createElementfromHTML (basen on created code above)*/
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    /* find menu container */
    const menuContainer = document.querySelector(select.containerOf.menu);
    /* add element to the menu (put the elemnt dom into the menu container) */
    menuContainer.appendChild(thisProduct.element);
  }
  getElements() { //wszystkie elementy w kontenerze produktu
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  initAccordion() {
    const thisProduct = this;

    /* find the clickable trigger (the element that should react to clicking) */
    const trigger = thisProduct.element.querySelector(select.menuProduct.clickable);

    /* START: click event listener to trigger */
    trigger.addEventListener('click', function () { // function(event) czy function()?
      //console.log('clicked');

      /* prevent default action for event */
      event.preventDefault();

      /* toggle active class on element of thisProduct */
      thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);

      /* find all active products */
      const activeProducts = document.querySelectorAll(select.all.menuProductsActive);

      /* START LOOP: for each active product */
      for (let activeProduct of activeProducts) {
        /* START: if the active product isn't the element of thisProduct */
        if (activeProduct !== thisProduct.element) {
          /* remove class active for the active product */
          activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
          //console.log('active product:', activeProduct);
          /* END: if the active product isn't the element of thisProduct */
        }
        /* END LOOP: for each active product */

      }

      /* END: click event listener to trigger */
    });

  }

  initOrderForm() {
    const thisProduct = this;
    // console.log('initOrderForm: ', thisProduct);
    thisProduct.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisProduct.processOrder();

    });

    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function () {
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });

  }

  processOrder() {
    const thisProduct = this;
    //console.log('processOrder: ', thisProduct);

    thisProduct.params = {}; //zapisanie pustego obiektu
    /* set variable price to equal thisProduct.data.price */
    let price = thisProduct.data.price;
    /* define variable params */
    let params = thisProduct.data.params;

    /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
    //odczytywanie właściwości z formularza klucza parametru ( atrybut name), opcji (atrybut value)
    const formData = utils.serializeFormToObject(thisProduct.form);
    //console.log('formData', formData);


    /* START LOOP: for each paramId in thisProduct.data.params */
    for (let paramId in params) {
      /* save the element in thisProduct.data.params with key paramId as const param */
      const param = thisProduct.data.params[paramId];
      /* START LOOP: for each optionId in param.options */
      for (let optionId in param.options) {
        /* save the element in param.options with key optionId as const option */
        const option = param.options[optionId]; // dlaczego nie thisProduct.param.options..?
        /* START IF: if option is selected and option is not default */
        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
        if (optionSelected && !option.default) { // opcja wybrana nie jest opcją domyślną
          price += option.price; //+=	price = price + option.price

          /* END IF: if option is selected and option is not default */
          /* START ELSE IF: if option is not selected and option is default */
        } else if (!optionSelected && option.default) { //opcja niewybrana jest opcją domyślną
          /* deduct price of option from price */
          price -= option.price; //-=	price = price - option.price //
          /* END ELSE IF: if option is not selected and option is default */
        }
        /*create const = all found elements in thisProduct.imageWrapper*/
        /*wszystkie obrazki składają się z kropki, klucza parametru, myśnika, klucza opcji.. dlaczego?*/
        const images = thisProduct.imageWrapper.querySelectorAll('.' + [paramId] + '-' + [optionId]);
        if (optionSelected) {
          if (!thisProduct.params[paramId]) {
            thisProduct.params[paramId] = {
              label: param.label,
              options: {},
            };
          }
          thisProduct.params[paramId].options[optionId] = option.label;

          for (let image of images) {
            image.classList.add(classNames.menuProduct.imageVisible);
          } /* END LOOP for each image*/
        } else {
          for (let image of images) {
            image.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
      console.log('thisProduct.params', thisProduct.params);

    }
    /*multiply price by amount*/
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;
    /* set the contents of thisProduct.priceElem to be the value of variable price */
    thisProduct.priceElem.innerHTML = thisProduct.price;
    //console.log('total price:', variablePrice);

  }
  initAmountWidget() { /*metoda tworząca instancję dla klasy AmountWidget*/
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function () {
      thisProduct.processOrder();
    });
  }
  addToCart() {
    const thisProduct = this;

    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;

    //app.cart.add(thisProduct); //przekazywanie instancji ??? co to oznacza?

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });
    thisProduct.element.dispatchEvent(event);
  }
}

export default Product;