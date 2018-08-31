/* ======================
   #MOBILE NAVIGATION
   https://inclusive-components.design/menus-menu-buttons/
   ====================== */

const html = document.querySelector('html');
const nav = document.querySelector('.js-nav');
const navButton = document.querySelector('.js-nav-toggle');

navButton.addEventListener('click', function() {
  let expanded = this.getAttribute('aria-expanded') === 'true';
  this.setAttribute('aria-expanded', !expanded);
  nav.classList.toggle('is-visible');
  html.classList.toggle('has-nav');
});
