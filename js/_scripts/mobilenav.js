/* ==========================================================================
   #Mobilenav
   ========================================================================== */

var html = $('html');
var button = $('.js-nav-toggle');
var navigation = $('.js-nav');

function toggleNav(e) {
  button.toggleClass('is-active');
  navigation.toggleClass('is-active');
  html.toggleClass('has-nav');
}

button.on('click', toggleNav);
