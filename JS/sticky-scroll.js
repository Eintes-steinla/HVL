const stickyHeader = document.getElementById("sticky-header");
const main = document.getElementById("main");

main.addEventListener("scroll", () => {
  if (main.scrollTop > 200) {
    stickyHeader.classList.remove("hidden");
    stickyHeader.classList.remove("opacity-0");
  } else {
    stickyHeader.classList.add("hidden");
    stickyHeader.classList.add("opacity-100");
  }
});
