// Chaim V'Shalom — small site scripts.
// Right now this only handles the "Menu" button on phones.

// Tell the CSS that JavaScript is running, so the phone menu can start closed.
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {
  var button = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");

  if (!button || !nav) {
    return;
  }

  // Open or close the menu when the button is pressed.
  button.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
});
