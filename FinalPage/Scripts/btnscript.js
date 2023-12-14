function smoothScroll(target) {
  let targetElement = document.querySelector(target);
  window.scrollTo({
    top: targetElement.offsetTop,
    behavior: "smooth",
    duration: 100000,
  });
}
