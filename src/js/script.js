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

  class Product{ // stworzenie KLASY o nazwie PRODUCT
    constructor(id, data){
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.initAccordion();

      console.log('new Product:', thisProduct);
    }
    renderInMenu(){
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

    initAccordion(){
      const thisProduct = this;

      /* find the clickable trigger (the element that should react to clicking) */
      const trigger = thisProduct.element.querySelector(select.menuProduct.clickable)

    /* START: click event listener to trigger */
      trigger.addEventListener('click', function(){ // function(event) czy function()?
      console.log('clicked')
    
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
          console.log('active product:', activeProduct)
        /* END: if the active product isn't the element of thisProduct */
        }
      /* END LOOP: for each active product */
        
      }

    /* END: click event listener to trigger */
    });

  }
  } 


  const app = { //metoda OBIEKTU

    initMenu: function(){ // instancja klasy PRODUCT
      const thisApp = this; //this pojedyncza instancja - pozwala na dodawanie właściwości i uruchamianie danej metody
      console.log('thisApp.data', thisApp.data);

      for(let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    }, 

    initData: function(){ // INSTANCJA dla każdego PRODUCT
      const thisApp = this;

      thisApp.data = dataSource; //dataSource = informacje o produkcie
    },

    init: function(){
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