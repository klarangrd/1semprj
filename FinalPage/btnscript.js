function smoothScroll(target) {
  var targetElement = document.querySelector(target);
  window.scrollTop({
    top: targetElement.offsetTop,
    behavior: "smooth",
    duration: 100000,
  });
}
