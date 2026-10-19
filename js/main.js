// Chaim V'Shalom Women's Learning Center — small site scripts:
// 1. The "Menu" button on phones, which opens the menu as a small floating box
//    on top of the page.
// 2. A gentle fade-in for page sections as they scroll into view.

// Tell the CSS that JavaScript is running, so the phone menu can start closed.
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {
  var button = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");

  if (!button || !nav) {
    return;
  }

  function setOpen(isOpen) {
    nav.classList.toggle("is-open", isOpen);
    button.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  // Open or close the menu when the button is pressed.
  button.addEventListener("click", function () {
    setOpen(!nav.classList.contains("is-open"));
  });

  // Close the menu when tapping anywhere outside it.
  document.addEventListener("click", function (event) {
    if (!nav.contains(event.target) && !button.contains(event.target)) {
      setOpen(false);
    }
  });

  // Close the menu with the Escape key, and put the focus back on the button.
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      button.focus();
    }
  });
});

// Fade page content in gradually as it scrolls into view: the further an item
// has come up the screen, the clearer it is. Each item only ever fades in:
// scrolling back up never fades it out again. Items are whole sections, or,
// in sections that contain cards, the section's heading and each card on its
// own. The look is in css/style.css; without this script, or when the
// visitor's device is set to reduce motion, everything simply shows normally.
document.addEventListener("DOMContentLoaded", function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  var items = [];
  Array.prototype.forEach.call(document.querySelectorAll("main section"), function (section) {
    var cards = section.querySelectorAll(".card");
    if (cards.length === 0) {
      items.push(section);
    } else {
      Array.prototype.forEach.call(section.children, function (child) {
        if (/^H[1-6]$/.test(child.tagName)) {
          items.push(child);
        }
      });
      Array.prototype.forEach.call(cards, function (card) {
        items.push(card);
      });
    }
  });

  var shown = items.map(function () { return 0; });   // how far each item has faded in so far
  var waiting = false;
  var pageOpened = false;        // true once the opening glide has finished

  // How far an item should be faded in right now, from 0 (hidden) to 1 (fully
  // shown). It starts when the item's top enters the bottom of the screen and
  // is complete when its top reaches 70% of the way down. An item near the end
  // of the page that can never get that high is complete when the page is
  // scrolled all the way down, so nothing is ever left half-faded.
  function fadeAmount(item, i) {
    var screen = window.innerHeight;
    // Where the item really is, leaving out the small downward shift that is
    // part of the fade (20px when hidden, 0 when fully shown).
    var top = item.getBoundingClientRect().top - (1 - shown[i]) * 20;
    var scrollLeft = document.documentElement.scrollHeight - screen - window.scrollY;
    var lowestTop = top - Math.max(0, scrollLeft);   // its top once fully scrolled down
    var start = screen;
    var end = Math.max(screen * 0.7, lowestTop);
    if (top <= end || end >= start) {
      return 1;
    }
    if (top >= start) {
      return 0;
    }
    return (start - top) / (start - end);
  }

  function update() {
    waiting = false;
    items.forEach(function (item, i) {
      if (shown[i] === null) {
        return;                  // finished: fully shown for good
      }
      var amount = Math.max(shown[i], fadeAmount(item, i));   // never fade back out
      shown[i] = amount;
      if (amount === 1 && pageOpened) {
        // Fully shown: remove the fade settings so the item goes back to its
        // normal styles (e.g. cards lifting on hover).
        item.style.opacity = "";
        item.style.transform = "";
        item.classList.remove("reveal", "is-scroll-linked");
        shown[i] = null;
      } else {
        item.style.opacity = amount;
        item.style.transform = "translateY(" + ((1 - amount) * 20) + "px)";
      }
    });
  }

  // Update at most once per screen refresh while scrolling.
  function onScroll() {
    if (!waiting) {
      waiting = true;
      window.requestAnimationFrame(update);
    }
  }

  items.forEach(function (item) {
    item.classList.add("reveal");
  });

  // When the page opens, let the items on screen glide into place, then
  // switch to following the scrolling directly.
  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(function () {
      update();
      window.setTimeout(function () {
        pageOpened = true;
        items.forEach(function (item) {
          item.classList.add("is-scroll-linked");
        });
        update();
      }, 650);
    });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
});
