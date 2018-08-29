/* ======================
   #MOBILE NAVIGATION
   ====================== */

const html = $('html');
const navigation = $('.js-nav');
const navigationToggle = $('.js-nav-toggle');

function toggleNav() {
  // Set pressed state
  const pressed = navigationToggle.attr('aria-expanded') === 'true';
  // Toggle button state
  navigationToggle.attr('aria-expanded', !pressed);
  // Toggle navigation visibility
  navigation.toggleClass('is-visible');
  // Add navigation class on html
  html.toggleClass('has-nav');
}

navigationToggle.on('click', toggleNav);
