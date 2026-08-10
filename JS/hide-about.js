function checkHeight() {
  const element = document.getElementById("hideAbout");
  if (window.innerHeight < window.screen.height / 2) {
    element.style.display = "none";
  } else {
    element.style.display = "block";
  }
}

window.addEventListener("resize", checkHeight);
window.addEventListener("load", checkHeight);
