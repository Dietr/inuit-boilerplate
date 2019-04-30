/* ======================
   #MOBILE NAVIGATION
   https://inclusive-components.design/menus-menu-buttons/
   ====================== */

var html = $('html');
var nav = $('.js-nav');
var navButton = $('.js-nav-toggle');

function toggleNav() {
  var expanded = $(this).attr('aria-expanded') === 'true';

  html.toggleClass('has-nav');
  nav.toggleClass('is-visible');
  $(this).attr('aria-expanded', !expanded);
}

navButton.on('click', toggleNav);
