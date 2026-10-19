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

// Fade page sections in gently as they scroll into view. The look is in
// css/style.css; without this script everything simply shows normally.
document.addEventListener("DOMContentLoaded", function () {
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section"));
  var waiting = false;

  // Show every section that is on screen or already scrolled past, so nothing
  // stays hidden even if the visitor jumps straight to the bottom of the page.
  function revealUpToScreen() {
    waiting = false;
    sections = sections.filter(function (section) {
      if (section.getBoundingClientRect().top < window.innerHeight) {
        section.classList.add("is-visible");
        return false;            // done with this one
      }
      return true;               // still below the screen
    });
    if (sections.length === 0) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
  }

  // Check at most once per screen refresh while scrolling.
  function onScroll() {
    if (!waiting) {
      waiting = true;
      window.requestAnimationFrame(revealUpToScreen);
    }
  }

  sections.forEach(function (section) {
    section.classList.add("reveal");
  });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  revealUpToScreen();
});
