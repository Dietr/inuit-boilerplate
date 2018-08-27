/* ==========================================================================
   #Mobilenav
   ========================================================================== */

const html = $('html');
const button = $('.js-nav-toggle');
const navigation = $('.js-nav');

function toggleNav(e) {
  button.toggleClass('is-active');
  navigation.toggleClass('is-active');
  html.toggleClass('has-nav');
}

button.on('click', toggleNav);
