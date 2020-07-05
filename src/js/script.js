/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
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
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
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
      thisProduct.processOrder();

      console.log('new Product:', thisProduct);
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
    }

    initAccordion() {
      const thisProduct = this;

      /* find the clickable trigger (the element that should react to clicking) */
      const trigger = thisProduct.element.querySelector(select.menuProduct.clickable);

      /* START: click event listener to trigger */
      trigger.addEventListener('click', function () { // function(event) czy function()?
        console.log('clicked');

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
            console.log('active product:', activeProduct);
            /* END: if the active product isn't the element of thisProduct */
          }
          /* END LOOP: for each active product */

        }

        /* END: click event listener to trigger */
      });

    }

    initOrderForm() {
      const thisProduct = this;
      console.log('initOrderForm: ', thisProduct);
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
      console.log('processOrder: ', thisProduct);

      /* set variable price to equal thisProduct.data.price */
      let variablePrice = thisProduct.data.price;
      /* define variable params */
      let params = thisProduct.data.params;
      /* define variable options */
      let options = thisProduct.data.options;

      /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
      //odczytywanie właściwości z formularza klucza parametru ( atrybut name), opcji (atrybut value)
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData', formData);


      /* START LOOP: for each paramId in thisProduct.data.params */
      for (let paramId in params) {
        /* save the element in thisProduct.data.params with key paramId as const param */
        const param = thisProduct.data.params[paramId];
        /* START LOOP: for each optionId in param.options */
        for (let optionId in options) {
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
          const images =  thisProduct.imageWrapper.querySelectorAll('.' + [paramId] + '-' + [optionId]);
          console.log('images', images);
        for (let image in images){
           /*start if/else when element was cliked*/
          if(optionSelected) {
              image.classList.add(classNames.menuProduct.imageVisible);
          } else{
              image.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
      }
      /* set the contents of thisProduct.priceElem to be the value of variable price */
      thisProduct.priceElem.innerHTML = variablePrice;

    }
  }




  const app = { //metoda OBIEKTU

    initMenu: function () { // instancja klasy PRODUCT
      const thisApp = this; //this pojedyncza instancja - pozwala na dodawanie właściwości i uruchamianie danej metody
      console.log('thisApp.data', thisApp.data);

      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function () { // INSTANCJA dla każdego PRODUCT
      const thisApp = this;

      thisApp.data = dataSource; //dataSource = informacje o produkcie
    },

    init: function () {
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();
}