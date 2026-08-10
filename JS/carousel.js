const carousel = document.getElementById("carousel");
const slides = document.querySelectorAll("#carousel > div");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let index = 0;
const visibleSlides = 3; // Số ảnh hiển thị cùng lúc
const totalSlides = slides.length;
let startX = 0;
let endX = 0;

function updateCarousel() {
  const translateX = -index * (100 / visibleSlides);
  carousel.style.transform = `translateX(${translateX}%)`;
}

// Xử lý nút bấm
nextBtn.addEventListener("click", () => {
  moveNext();
});

prevBtn.addEventListener("click", () => {
  movePrev();
});

// Xử lý vuốt (swipe)
carousel.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

carousel.addEventListener("touchmove", (e) => {
  endX = e.touches[0].clientX;
});

carousel.addEventListener("touchend", () => {
  if (startX - endX > 50) {
    moveNext(); // Vuốt trái (next)
  } else if (endX - startX > 50) {
    movePrev(); // Vuốt phải (prev)
  }
});

function moveNext() {
  index++;
  if (index > totalSlides - visibleSlides) {
    index = 0; // Quay về đầu khi hết ảnh
  }
  updateCarousel();
}

function movePrev() {
  index--;
  if (index < 0) {
    index = totalSlides - visibleSlides; // Quay về cuối khi bấm lùi ở ảnh đầu
  }
  updateCarousel();
}
