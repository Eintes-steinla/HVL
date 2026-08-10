let currentIndex = 0;

function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function loadSong(index, autoplay = true) {
  const list = window.tracks || [];
  if (!list.length) return;

  currentIndex = ((index % list.length) + list.length) % list.length;
  const track = list[currentIndex];

  // === Player dưới cùng ===
  const picture = document.getElementById("picture-song");
  const title = document.getElementById("title-song");
  const artist = document.getElementById("artist-song");
  const audio = document.getElementById("audio-song");
  const end = document.getElementById("end-time");
  const progressBar = document.getElementById("play-progress");

  picture.src = track.img;
  picture.alt = track.title;
  // title.textContent = track.title;
  setupMarquee(title, track.title, { always: true });
  artist.textContent = track.artist ?? "";
  audio.src = track.audio;
  end.textContent =
    track.duration && track.duration !== "0:00" ? track.duration : "0:00";

  audio.addEventListener(
    "loadedmetadata",
    () => {
      progressBar.max = audio.duration;
      const realDuration = formatTime(audio.duration);
      end.textContent = realDuration;

      track.duration = realDuration;
      const timeEl = document.querySelector(
        `.track-main[data-index="${currentIndex}"] .track-time`,
      );
      if (timeEl) timeEl.textContent = realDuration;
    },
    { once: true },
  );

  let allLabels = document.querySelectorAll(".play-button-song input");
  allLabels.forEach((input) => (input.checked = !autoplay));

  audio.load();
  if (autoplay) audio.play();

  // === Panel "playing view" bên phải ===
  const viewImg = document.getElementById("playing-view-img");
  const viewTitle = document.getElementById("playing-view-title");
  const viewArtist = document.getElementById("playing-view-artist");
  const viewMoreDesc = document.getElementById("playing-view-more-desc");

  // artist gốc có thể kèm "(feat. X)" -> bỏ phần feat khi hiển thị ở panel này
  const mainArtist = (track.artist || "")
    .replace(/\s*\(feat\..*?\)\s*/i, "")
    .trim();

  if (viewImg) {
    viewImg.src = track.img;
    viewImg.alt = track.title;
  }
  // if (viewTitle) viewTitle.textContent = track.title;
  if (viewTitle) setupMarquee(viewTitle, track.title, { always: true });
  if (viewArtist) viewArtist.textContent = mainArtist;
  if (viewMoreDesc)
    viewMoreDesc.textContent = `More options for ${track.title}`;

  // === Đồng bộ highlight trong danh sách ===
  if (typeof window.highlightPlayingTrack === "function") {
    window.highlightPlayingTrack(currentIndex);
  }
}

// Chọn ngẫu nhiên 1 index khác với index hiện tại (dùng cho shuffle)
function pickRandomIndex(excludeIndex, length) {
  if (length <= 1) return excludeIndex;
  let idx;
  do {
    idx = Math.floor(Math.random() * length);
  } while (idx === excludeIndex);
  return idx;
}

function nextSong() {
  const list = window.tracks || [];
  if (window.isShuffle && list.length > 1) {
    loadSong(pickRandomIndex(currentIndex, list.length));
  } else {
    loadSong(currentIndex + 1);
  }
}

function prevSong() {
  const list = window.tracks || [];
  if (window.isShuffle && list.length > 1) {
    loadSong(pickRandomIndex(currentIndex, list.length));
  } else {
    loadSong(currentIndex - 1);
  }
}

document.getElementById("next-song").addEventListener("click", nextSong);
document.getElementById("prev-song").addEventListener("click", prevSong);

window.playTrackAtIndex = (index) => loadSong(index, true);
window.getCurrentTrackIndex = () => currentIndex;

// === Xử lý khi bài hát tự kết thúc: áp dụng shuffle + repeat ===
document.getElementById("audio-song").addEventListener("ended", () => {
  const list = window.tracks || [];
  if (!list.length) return;

  // Lặp lại đúng bài đang phát
  if (window.repeatMode === "one") {
    loadSong(currentIndex);
    return;
  }

  // Đang bật trộn bài -> chọn ngẫu nhiên bài kế tiếp
  if (window.isShuffle) {
    loadSong(pickRandomIndex(currentIndex, list.length));
    return;
  }

  const isLastTrack = currentIndex >= list.length - 1;
  if (isLastTrack) {
    if (window.repeatMode === "all") {
      loadSong(0); // quay lại bài đầu danh sách
    }
    // repeatMode "off" và đã hết danh sách -> dừng lại, không làm gì thêm
    return;
  }

  loadSong(currentIndex + 1);
});

// loadSong(0, false);
