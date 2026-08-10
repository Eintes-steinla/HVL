const audio = document.getElementById("audio-song");
const progressBar = document.getElementById("play-progress");
const playTime = document.getElementById("play-time");
const playButtons = document.querySelectorAll(".play-button-bg-song"); // Nút nền
const playCheckboxes = document.querySelectorAll(".play-button-song input"); // Checkbox

let isPlaying = false;
let isDragging = false;

// Chuyển giây thành định dạng mm:ss
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

// Khi bấm vào nút nền (play-button-bg-song)
playButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const checkbox = playCheckboxes[index]; // Lấy checkbox bên trong nút

    if (!checkbox.checked) {
      checkbox.checked = true; // Check → Tắt nhạc
      audio.pause();
      isPlaying = false;
    } else {
      checkbox.checked = false; // Uncheck → Phát nhạc
      audio.play();
      isPlaying = true;
    }

    syncCheckboxes(checkbox.checked);
  });
});

// Đồng bộ trạng thái của tất cả các checkbox
function syncCheckboxes(state) {
  playCheckboxes.forEach((checkbox) => {
    checkbox.checked = state;
  });
}

// Cập nhật thanh trượt và thời gian khi nhạc chạy
audio.addEventListener("timeupdate", () => {
  if (!isDragging) {
    progressBar.value = Math.floor(audio.currentTime);
    playTime.textContent = formatTime(audio.currentTime);
    updateProgressBar();
  }
});

// Khi nhạc kết thúc
audio.addEventListener("ended", () => {
  isPlaying = false;
  progressBar.value = 0;
  playTime.textContent = "0:00";
  syncCheckboxes(true); // Giữ trạng thái đã check khi nhạc kết thúc
  updateProgressBar();
});

// Khi kéo thanh trượt
progressBar.addEventListener("input", () => {
  isDragging = true;
  playTime.textContent = formatTime(progressBar.value);
  updateProgressBar();
});

// Khi thả thanh trượt → Cập nhật vị trí nhạc
progressBar.addEventListener("change", () => {
  audio.currentTime = progressBar.value;
  isDragging = false;
});

// Cập nhật màu nền thanh trượt theo tiến trình
function updateProgressBar() {
  const value = (progressBar.value / progressBar.max) * 100;
  const isHovered = progressBar.classList.contains("hovered");
  const isDragging = progressBar.classList.contains("dragging");

  // Nếu đang hover hoặc kéo, nền xanh, còn không thì nền trắng
  const color = isHovered || isDragging ? "#1DB954" : "white";

  progressBar.style.background = `linear-gradient(to right, ${color} ${value}%, gray ${value}%)`;
}

// Khi hover vào, đổi nền xanh
progressBar.addEventListener("mouseenter", function () {
  this.classList.add("hovered");
  updateProgressBar();
});

// Khi rời chuột, nếu không kéo thì quay lại nền trắng
progressBar.addEventListener("mouseleave", function () {
  this.classList.remove("hovered");
  if (!this.classList.contains("dragging")) {
    updateProgressBar();
  }
});

// Khi bắt đầu kéo, giữ nền xanh lá
progressBar.addEventListener("mousedown", function () {
  this.classList.add("dragging");
  updateProgressBar();
});

// Khi kéo (di chuyển giá trị), giữ nền xanh lá
progressBar.addEventListener("input", function () {
  updateProgressBar();
});

// Khi thả chuột, kiểm tra nếu không hover thì quay lại nền trắng
document.addEventListener("mouseup", function () {
  if (progressBar.classList.contains("dragging")) {
    progressBar.classList.remove("dragging");
    if (!progressBar.classList.contains("hovered")) {
      updateProgressBar();
    }
  }
});

// Đặt màu nền ban đầu
updateProgressBar();
