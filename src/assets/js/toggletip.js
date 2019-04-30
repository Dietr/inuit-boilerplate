(function () {
  // Get all the toggletip buttons
  var toggletips = document.querySelectorAll('.js-toggletip');

  // Iterate over them
  Array.prototype.forEach.call(toggletips, function (toggletip) {
    // Get the message from the data-content element
    var message = toggletip.getAttribute('title');
    toggletip.setAttribute('data-tooltip-content', message);
    toggletip.removeAttribute('title');


    // Get the live region element
    var liveRegion = toggletip.nextElementSibling;

    // Toggle the message
    toggletip.addEventListener('click', function () {
      liveRegion.innerHTML = '';
      window.setTimeout(function () {
        liveRegion.innerHTML = '<span class="c-toggletip__body js-toggletip__bubble">' + message + '</span>';
      }, 100);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (toggletip !== e.target)
        liveRegion.innerHTML = '';
    });

    // Close on blur
    toggletip.addEventListener('blur', function (e) {
      liveRegion.innerHTML = '';
    });

    // Remove toggletip on ESC
    toggletip.addEventListener('keydown', function (e) {
      if ((e.keyCode || e.which) === 27)
        liveRegion.innerHTML = '';
    });
  });
}());
