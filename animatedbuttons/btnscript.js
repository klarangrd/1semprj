//Funktion der gennem querySelector scroller ned til et givent element, samt er gjort langsomere gennem duration
function smoothScroll(target) {
  var targetElement = document.querySelector(target);
  window.scrollTo({
    top: targetElement.offsetTop,
    behavior: "smooth",
    duration: 100000,
  });
}
