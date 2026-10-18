// Chaim V'Shalom Women's Learning Center — small site scripts.
// Right now this only handles the "Menu" button on phones, which opens the
// menu as a small floating box on top of the page.

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
