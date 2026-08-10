const audioSong = document.getElementById("audio-song"); // Thẻ audioSong
const volumeSlider = document.getElementById("volume"); // Thanh điều chỉnh âm lượng
const volumeBtn = document.getElementById("volume-btn"); // Nút mute/unmute
const mute = document.getElementById("mute"); //  mute
const unmute = document.getElementById("unmute"); //  unmute

// Đặt âm lượng ban đầu
volumeSlider.value = audioSong.volume * 100;

// Khi thay đổi thanh âm lượng
volumeSlider.addEventListener("input", () => {
  audioSong.volume = volumeSlider.value / 100;
  audioSong.muted = false; // kéo thanh thì tự động unmute
  updateMuteState();
});

// Khi bấm nút mute/unmute
volumeBtn.addEventListener("click", () => {
  if (audioSong.muted || audioSong.volume === 0) {
    audioSong.muted = false;
    volumeSlider.value = audioSong.volume * 100; // Khôi phục giá trị
  } else {
    audioSong.muted = true;
    volumeSlider.value = 0; // Đưa về 0 khi mute
  }
  updateMuteState();
  updateVolumeSlider(); // cập nhật màu thanh trượt ngay lập tức
});

// Lăn chuột trên thanh volume để tăng/giảm âm lượng
volumeSlider.addEventListener("wheel", (e) => {
  e.preventDefault();
  let volumeChange = e.deltaY < 0 ? 5 : -5; // Lăn lên tăng 5%, lăn xuống giảm 5%
  let newVolume = Math.min(
    100,
    Math.max(0, Number(volumeSlider.value) + volumeChange),
  );
  volumeSlider.value = newVolume;
  audioSong.volume = newVolume / 100;
  audioSong.muted = false;
  updateMuteState();
  updateVolumeSlider();
});

// Cập nhật  mute/unmute
function updateMuteState() {
  if (audioSong.muted || audioSong.volume === 0) {
    mute.classList.remove("hidden");
    unmute.classList.add("hidden");
  } else {
    mute.classList.add("hidden");
    unmute.classList.remove("hidden");
  }
}

// Khởi tạo trạng thái ban đầu
updateMuteState();

// Cập nhật màu nền thanh trượt theo tiến trình
function updateVolumeSlider() {
  const value = (volumeSlider.value / volumeSlider.max) * 100;
  const isHovered = volumeSlider.classList.contains("hovered");
  const isDragging = volumeSlider.classList.contains("dragging");

  // Nếu đang hover hoặc kéo, nền xanh, còn không thì nền trắng
  const color = isHovered || isDragging ? "#1DB954" : "white";

  volumeSlider.style.background = `linear-gradient(to right, ${color} ${value}%, gray ${value}%)`;
}

// Khi hover vào, đổi nền xanh
volumeSlider.addEventListener("mouseenter", function () {
  volumeSlider.classList.add("hovered");
  updateVolumeSlider();
});

// Khi rời chuột, nếu không kéo thì quay lại nền trắng
volumeSlider.addEventListener("mouseleave", function () {
  volumeSlider.classList.remove("hovered");
  if (!volumeSlider.classList.contains("dragging")) {
    updateVolumeSlider();
  }
});

// Khi bắt đầu kéo, giữ nền xanh lá
volumeSlider.addEventListener("mousedown", function () {
  volumeSlider.classList.add("dragging");
  updateVolumeSlider();
});

// Khi kéo (di chuyển giá trị), giữ nền xanh lá
volumeSlider.addEventListener("input", function () {
  updateVolumeSlider();
});

// Khi thả chuột, kiểm tra nếu không hover thì quay lại nền trắng
document.addEventListener("mouseup", function () {
  if (volumeSlider.classList.contains("dragging")) {
    volumeSlider.classList.remove("dragging");
    if (!volumeSlider.classList.contains("hovered")) {
      updateVolumeSlider();
    }
  }
});

// Đặt màu nền ban đầu
updateVolumeSlider();
