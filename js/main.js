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

// Fade page sections in gradually as they scroll into view: the further a
// section has come up the screen, the clearer it is (and scrolling back up
// fades it out again). The look is in css/style.css; without this script, or
// when the visitor's device is set to reduce motion, everything simply shows
// normally.
document.addEventListener("DOMContentLoaded", function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  var sections = Array.prototype.slice.call(document.querySelectorAll("main section"));
  var waiting = false;

  // How far a section has faded in, from 0 (hidden) to 1 (fully shown).
  // It starts when the section's top enters the bottom of the screen and is
  // complete when its top reaches 70% of the way down. A section near the end
  // of the page that can never get that high is complete when the page is
  // scrolled all the way down, so nothing is ever left half-faded.
  function fadeAmount(section) {
    var screen = window.innerHeight;
    var top = section.getBoundingClientRect().top;
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
    sections.forEach(function (section) {
      var amount = fadeAmount(section);
      section.style.opacity = amount;
      section.style.transform = "translateY(" + ((1 - amount) * 20) + "px)";
    });
  }

  // Update at most once per screen refresh while scrolling.
  function onScroll() {
    if (!waiting) {
      waiting = true;
      window.requestAnimationFrame(update);
    }
  }

  sections.forEach(function (section) {
    section.classList.add("reveal");
  });

  // When the page opens, let the sections on screen glide into place, then
  // switch to following the scrolling directly.
  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(function () {
      update();
      window.setTimeout(function () {
        sections.forEach(function (section) {
          section.classList.add("is-scroll-linked");
        });
      }, 650);
    });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
});
