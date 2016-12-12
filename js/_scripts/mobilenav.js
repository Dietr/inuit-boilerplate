/* ==========================================================================
   #Mobilenav
   ========================================================================== */

const button = document.querySelector('.js-nav-toggle');
const navigation = document.querySelector('.js-nav');
const html = document.querySelector('html');

function toggleNav(e) {
  button.classList.toggle('is-active');
  navigation.classList.toggle('is-active');
  html.classList.toggle('has-nav');
}

button.addEventListener('click', toggleNav);
