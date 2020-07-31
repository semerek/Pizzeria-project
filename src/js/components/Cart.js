import { settings, select, classNames, templates } from './settings.js';
import { utils } from '/utils.js';
import CartProduct from '.components/CartProduct.js';

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = []; // tworzenie tablice, w której będą przechowywane produkty w koszyku
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;

    thisCart.getElements(element);
    thisCart.initActions();
    console.log('new Cart', thisCart);
  }

  getElements(element) {
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.address = document.querySelector(select.cart.address);
    thisCart.dom.phone = document.querySelector(select.cart.phone);

    for (let key of thisCart.renderTotalsKeys) {
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }
  }

  initActions() {
    const thisCart = this;

    //add EventListener 'click' for thisCart.dom.toggleTrigger
    thisCart.dom.toggleTrigger.addEventListener('click', function () {
      console.log('clicked');
      // toggle thisCart.dom.wrapper saved in classNames.cart.wrapperActive
      thisCart.dom.wrapper.classList.toggle(classNames.menuProduct.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function () {
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisCart.sendOrder();
    });

  }

  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;

    const payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      totalPrice: thisCart.totalPrice,
      deliveryFee: thisCart.deliveryFee,
      products: [],

    };

    for (const products of thisCart.products) {
      payload.products.push(products.getData());
    }



    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function (response) {
        return response.json();
      }).then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);
      });
  }

  add(menuProduct) {
    const thisCart = this;
    //console.log('adding product', menuProduct)

    // generate HTML and save it as generatedHTML*/
    const generatedHTML = templates.cartProduct(menuProduct);
    // create element DOM 
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    // add element to thisCart.dom.productList. 
    thisCart.dom.productList.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    console.log('thisCart.products', thisCart.products);
    //stworzona nowa instancja klasy new CartProduct

    thisCart.update();
  }

  update() {
    const thisCart = this;

    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    for (let products of thisCart.products) {
      thisCart.subtotalPrice += products.price; // thisCart.subtotalPrice = thisCart.subtotalPrice + product.price
      thisCart.totalNumber += products.amount; // thisCart.subtotalPrice = thisCart.totalNumber + products.amount
    }
    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    console.log('subtotalPrice', thisCart.subtotalPrice);
    console.log('thisCart.totalPrice', thisCart.totalPrice);
    for (let key of thisCart.renderTotalsKeys) {
      for (let elem of thisCart.dom[key]) {
        elem.innerHTML = thisCart[key];
      }
    }
  }

  remove(cartProduct) {
    const thisCart = this;

    const index = thisCart.products.indexOf(cartProduct);

    thisCart.products.splice(index, 1);
    cartProduct.dom.wrapper.remove();
    thisCart.update();

  }

}

export default Cart;