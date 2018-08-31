/* ======================
   #TABS
   https://heydon.github.io/inclusive-components-demos/tab-interface/true-tabbed-interface.html
   ====================== */

(function () {
  // Get relevant elements and collections
  const tabbed = document.querySelector('.js-tabs');
  const tablist = tabbed.querySelector('.js-tabs__list');
  const tabs = tablist.querySelectorAll('.js-tabs__link');
  const panels = tabbed.querySelectorAll('[id^="section"]');

  // The tab switching function
  const switchTab = (oldTab, newTab) => {
    newTab.focus();
    // Make the active tab focusable by the user (Tab key)
    newTab.removeAttribute('tabindex');
    // Set the selected state
    newTab.setAttribute('aria-selected', 'true');
    oldTab.removeAttribute('aria-selected');
    oldTab.setAttribute('tabindex', '-1');
    // Get the indices of the new and old tabs to find the correct
    // tab panels to show and hide
    let index = Array.prototype.indexOf.call(tabs, newTab);
    let oldIndex = Array.prototype.indexOf.call(tabs, oldTab);
    panels[oldIndex].hidden = true;
    panels[index].hidden = false;
  }

  // Add the tablist role to the first <ul> in the .tabbed container
  tablist.setAttribute('role', 'tablist');

  // Add semantics are remove user focusability for each tab
  Array.prototype.forEach.call(tabs, (tab, i) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('id', 'tab' + (i + 1));
    tab.setAttribute('tabindex', '-1');
    tab.parentNode.setAttribute('role', 'presentation');

    // Handle clicking of tabs for mouse users
    tab.addEventListener('click', e => {
      e.preventDefault();
      let currentTab = tablist.querySelector('[aria-selected]');
      if (e.currentTarget !== currentTab) {
        switchTab(currentTab, e.currentTarget);
      }
    });

    // Handle keydown events for keyboard users
    tab.addEventListener('keydown', e => {
      // Get the index of the current tab in the tabs node list
      let index = Array.prototype.indexOf.call(tabs, e.currentTarget);

      // If down arrow is pressed handle that
      if (e.which === 40) {
        panels[index].focus()
        return;
      }

      // Determine arrow key pressed
      var dir = e.which === 37 ? index - 1 : e.which === 39 ? index + 1 : null;

      // Switch to the new tab if it exists
      if (dir !== null) {
        e.preventDefault();

        // Find correct tab to focus
        let newIndex;
        if (tabs[dir]) {
          newIndex = dir;
        } else {
          // Loop around if adjacent tab doesn't exist
          newIndex = dir === index - 1 ? tabs.length - 1 : 0;
        }
        switchTab(e.currentTarget, tabs[newIndex]);
        tabs[newIndex].focus();
      }
    });
  });

  // Add tab panel semantics and hide them all
  Array.prototype.forEach.call(panels, (panel, i) => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('tabindex', '-1');
    let id = panel.getAttribute('id');
    panel.setAttribute('aria-labelledby', tabs[i].id);
    panel.hidden = true;
  });

  // Initially activate the first tab and reveal the first tab panel
  tabs[0].removeAttribute('tabindex');
  tabs[0].setAttribute('aria-selected', 'true');
  panels[0].hidden = false;
})();
