document.getElementById("see-more").addEventListener("click", () => {
  document.querySelectorAll(".content-hide").forEach((element) => {
    element.classList.toggle("hidden");
    element.classList.toggle("grid");
  });
});

document.getElementById("see-more").addEventListener("click", function () {
  const span = this.querySelector("span");
  span.textContent = span.textContent === "See more" ? "Show less" : "See more";
});

// full screen
document.getElementById("full-screen").addEventListener("click", function () {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});
