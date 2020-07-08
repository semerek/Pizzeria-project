/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
      cart: {
        wrapperActive: 'active',
      },
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    },
    cart: {
      defaultDeliveryFee: 20,
    },
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),

  };

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
      });

    }

    processOrder() {
      const thisProduct = this;
      //console.log('processOrder: ', thisProduct);

      /* set variable price to equal thisProduct.data.price */
      let variablePrice = thisProduct.data.price;
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
            variablePrice += option.price; //+=	price = price + option.price

            /* END IF: if option is selected and option is not default */
            /* START ELSE IF: if option is not selected and option is default */
          } else if (!optionSelected && option.default) { //opcja niewybrana jest opcją domyślną
            /* deduct price of option from price */
            variablePrice -= option.price; //-=	price = price - option.price //
            /* END ELSE IF: if option is not selected and option is default */
          }
          /*create const = all found elements in thisProduct.imageWrapper*/
          /*wszystkie obrazki składają się z kropki, klucza parametru, myśnika, klucza opcji.. dlaczego?*/
          const images = thisProduct.imageWrapper.querySelectorAll('.' + [paramId] + '-' + [optionId]);
          if (optionSelected) {
            for (let image of images) {
              image.classList.add(classNames.menuProduct.imageVisible);
            } /* END LOOP for each image*/
          } else {
            for (let image of images) {
              image.classList.remove(classNames.menuProduct.imageVisible);
            }
          }
        }
      }
      /* set the contents of thisProduct.priceElem to be the value of variable price */
      variablePrice *= thisProduct.amountWidget.value;
      thisProduct.priceElem.innerHTML = variablePrice;
      //console.log('total price:', variablePrice);
    }
    initAmountWidget() { /*metoda tworząca instancję dla klasy AmountWidget*/
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', function () {
        thisProduct.processOrder();
      });
    }
  }

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

      const event = new Event('updated');
      thisWidget.element.dispatchEvent(event);
    }

  }

  class Cart {
    constructor(element) {
      const thisCart = this;

      thisCart.products = []; // tworzenie tablice, w której będą przechowywane produkty w koszyku
      thisCart.getElements(element);
      thisCart.initActions();
      console.log('new Cart', thisCart);

    }
    getElements(element) {
      const thisCart = this;
      thisCart.dom = {};
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    }

    initActions() {
      const thisCart = this;

      //add EventListener 'click' for thisCart.dom.toggleTrigger
      thisCart.dom.toggleTrigger.addEventListener('click', function (event) {
        console.log('clicked');
        // toggle thisCart.dom.wrapper saved in classNames.cart.wrapperActive
        thisCart.dom.wrapper.classList.toggle(classNames.menuProduct.wrapperActive);
      });
    }
  }

  const app = { //metoda OBIEKTU

    initMenu: function () { // instancja klasy PRODUCT
      const thisApp = this; //this pojedyncza instancja - pozwala na dodawanie właściwości i uruchamianie danej metody
      //console.log('thisApp.data', thisApp.data);

      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function () { // INSTANCJA dla każdego PRODUCT
      const thisApp = this;

      thisApp.data = dataSource; //dataSource = informacje o produkcie
    },

    initCart: function () {
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem); //
    },

    init: function () {
      const thisApp = this;
      //console.log('*** App starting ***');
      //console.log('thisApp:', thisApp);
      //console.log('classNames:', classNames);
      //console.log('settings:', settings);
      //console.log('templates:', templates);
      thisApp.initData();
      thisApp.initMenu();
      thisApp.initCart();
    },
  };


  app.init();
}