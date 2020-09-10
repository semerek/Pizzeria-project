import {select, classNames } from '../settings.js';
//import { utils } from '../utils.js';

class Home {
  constructor(data) {

    const thisHome = this;
    thisHome.data = data;

    // thisHome.renderHome();
    thisHome.activateLinks();

  }
  
  /*

  renderHome(){
  const thisHome = this;
  const generatedHTML = templates.homePage(thisHome.data);
  thisHome.element = utils.createDOMFromHTML(generatedHTML);
  const homeContainer = document.querySelector(select.containerOf.home)
  homeContainer.appendChild(thisHome.element);
  }

*/
  activateLinks() {


    const orderLink = document.getElementById('order-id');
    const orderLinkId = orderLink.getAttribute('href').replace('#', '');

    const pages = document.querySelector(select.containerOf.pages).children;

    orderLink.addEventListener('click', function () {
      for (let page of pages) {
        if (page.id == orderLinkId) {
          page.classList.add(classNames.pages.active);
        } else {
          page.classList.remove(classNames.pages.active);
        }
      }
    });

    const bookLink = document.getElementById('book-id');
    const bookLinkId = bookLink.getAttribute('href').replace('#', '');

    bookLink.addEventListener('click', function(){
      for(let page of pages) {
        if(page.id == bookLinkId) {
          page.classList.add(classNames.pages.active);
        } else {
          page.classList.remove(classNames.pages.active);
        }
      }
    });
  }
}

export default Home; 