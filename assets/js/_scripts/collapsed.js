/* ======================
   #COLLAPSED SECTIONS
   https://codepen.io/heydon/pen/gGNaoM
   ====================== */

(function () {
  // Get all the headings
  var headings = $('.js-collapsed > .js-collapsed__title');

  Array.prototype.forEach.call(headings, function (heading) {
    // Give each title a toggle button child
    // with the SVG plus/minus icon
    heading.innerHTML = '<button class="c-collapsed__btn aria-expanded="false">' +
    heading.textContent + '<svg aria-hidden="true" focusable="false" viewBox="0 0 10 10" class="c-icon c-icon--plus"><rect class="c-icon--plus__vert" height="8" width="2" y="1" x="4"/><rect height="2" width="8" y="4" x="1"/></svg></button>';

    // Function to create a node list
    // of the content between this title and the next
    var getContent = function getContent(elem) {
      var elems = [];
      while (elem.nextElementSibling && elem.nextElementSibling.classList.contains('js-collapsed__title') == false) {
        elems.push(elem.nextElementSibling);
        elem = elem.nextElementSibling;
      }

      // Delete the old versions of the content nodes
      elems.forEach(function (node) {
        node.parentNode.removeChild(node);
      });

      return elems;
    };

    // Assign the contents to be expanded/collapsed (array)
    var contents = getContent(heading);

    // Create a wrapper element for `contents` and hide it
    var wrapper = document.createElement('div');
    wrapper.className = 'c-collapsed__body';
    wrapper.hidden = true;

    // Add each element of `contents` to `wrapper`
    contents.forEach(function (node) {
      wrapper.appendChild(node);
    });

    // Add the wrapped content back into the DOM
    // after the heading
    heading.parentNode.insertBefore(wrapper, heading.nextElementSibling);

    // Assign the button
    var btn = heading.querySelector('button');

    btn.onclick = function () {
      // Cast the state as a boolean
      var expanded = btn.getAttribute('aria-expanded') === 'true' || false;

      // Switch the state
      btn.setAttribute('aria-expanded', !expanded);
      // Switch the content's visibility
      wrapper.hidden = expanded;
    };
  });
})();
