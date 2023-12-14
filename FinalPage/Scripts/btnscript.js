function smoothScroll(target) {
  //function that makes the scrolling smooth when run
  let targetElement = document.querySelector(target);
  window.scrollTo({
    top: targetElement.offsetTop,
    behavior: "smooth",
    duration: 100000,
  });
}
