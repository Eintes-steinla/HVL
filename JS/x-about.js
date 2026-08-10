const about = document.getElementById("about");
const aboutView = document.getElementById("about-view");
const aboutDes = document.getElementById("about-des");
const xAbout = document.getElementById("x-about");

aboutView.addEventListener("click", (e) => {
  aboutDes.classList.remove("hidden"); // Hiện lên
  setTimeout(() => {
    aboutDes.classList.remove("opacity-0");
  }, 10); // Delay nhẹ để Tailwind kịp nhận class
  e.stopPropagation();
});

about.addEventListener("click", (e) => {
  aboutDes.classList.remove("hidden"); // Hiện lên
  setTimeout(() => {
    aboutDes.classList.remove("opacity-0");
  }, 10); // Delay nhẹ để Tailwind kịp nhận class
  e.stopPropagation();
});

xAbout.addEventListener("click", (e) => {
  aboutDes.classList.add("opacity-0"); // Kích hoạt hiệu ứng ẩn
  setTimeout(() => {
    aboutDes.classList.add("hidden"); // Ẩn hoàn toàn sau khi animation chạy xong
  }, 300); // Delay bằng duration của Tailwind
  e.stopPropagation();
});

document.addEventListener("click", (e) => {
  if (!aboutDes.contains(e.target) && !about.contains(e.target)) {
    aboutDes.classList.add("opacity-0");
    setTimeout(() => {
      aboutDes.classList.add("hidden");
    }, 300);
  }
});
