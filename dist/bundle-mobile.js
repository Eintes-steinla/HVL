/* ---- description.js ---- */
const activeTimeouts = new WeakMap(); // lưu timeout riêng cho từng description

function getDescription(needDescription) {
  // 1. .description là con/cháu bên trong (trường hợp track: add-to-playlist, 3-dots)
  const child = needDescription.querySelector(".description");
  if (child) return child;

  // 2. .description là anh em ngay sau (sibling)
  if (needDescription.nextElementSibling?.classList.contains("description")) {
    return needDescription.nextElementSibling;
  }

  // 3. .description nằm trong cùng 1 wrapper cha gần nhất
  const parent = needDescription.parentElement;
  if (parent) {
    const inParent = parent.querySelector(".description");
    if (inParent) return inParent;
  }

  return null;
}

document.addEventListener("pointerover", (e) => {
  const needDescription = e.target.closest(".need-description");
  if (!needDescription) return;
  if (needDescription.contains(e.relatedTarget)) return; // đã ở trong rồi, bỏ qua

  const description = getDescription(needDescription);
  if (!description) return;

  description.classList.remove("hidden");

  const timeout = setTimeout(() => {
    description.classList.remove("opacity-0", "translate-y-2");
    description.classList.add("opacity-80", "translate-y-0");
  }, 200);

  activeTimeouts.set(description, timeout);
});

document.addEventListener("pointerout", (e) => {
  const needDescription = e.target.closest(".need-description");
  if (!needDescription) return;
  if (needDescription.contains(e.relatedTarget)) return; // vẫn còn ở trong, bỏ qua

  const description = getDescription(needDescription);
  if (!description) return;

  clearTimeout(activeTimeouts.get(description));

  description.classList.remove("opacity-80", "translate-y-0");
  description.classList.add("opacity-0", "translate-y-2");

  setTimeout(() => {
    if (description.classList.contains("opacity-0")) {
      description.classList.add("hidden");
    }
  }, 500);
});


/* ---- play-button.js ---- */
// play-button-bg (click để check/uncheck)
document.addEventListener("click", (e) => {
  const button = e.target.closest(".play-button-bg");
  if (!button) return;

  const songCheckbox = button.querySelector(".play-button-song input");

  if (songCheckbox) {
    const isChecked = songCheckbox.checked;
    document.querySelectorAll(".play-button-song input").forEach((checkbox) => {
      checkbox.checked = !isChecked;
    });
  } else {
    const checkbox = button.querySelector(".play-button input");
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
    }
  }
});

// space play song - giữ nguyên, không liên quan render động
document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    event.preventDefault();

    let audio = document.getElementById("audio-song");
    let allLabels = document.querySelectorAll(".play-button-song input");

    if (audio.paused) {
      audio.play();
      allLabels.forEach((input) => (input.checked = false));
    } else {
      audio.pause();
      allLabels.forEach((input) => (input.checked = true));
    }
  }
});


/* ---- follow-button.js ---- */
const followButton = document.getElementById("follow-button");
if (followButton) {
  followButton.addEventListener("click", function () {
    const span = this.querySelector("span");
    span.textContent =
      span.textContent === "Following" ? "Follow" : "Following";
  });
}

const followButtonAbout = document.getElementById("follow-button-about");
if (followButtonAbout) {
  followButtonAbout.addEventListener("click", function () {
    const span = this.querySelector("span");
    span.textContent = span.textContent === "Unfollow" ? "Follow" : "Unfollow";
  });
}

const followButtonCredits = document.getElementById("follow-button-credits");
if (followButtonCredits) {
  followButtonCredits.addEventListener("click", function () {
    const span = this.querySelector("span");
    span.textContent = span.textContent === "Unfollow" ? "Follow" : "Unfollow";
  });
}


/* ---- add-to-playlist.js ---- */
// ========== 1. Add to playlist (click) ==========
document.addEventListener("click", (e) => {
  const container = e.target.closest(".add-to-playlist");
  if (!container) return;

  const svgClicked = e.target.closest("svg");
  if (!svgClicked) return;

  e.stopPropagation();

  const firstSvg = container.querySelector("svg:first-of-type");
  const secondSvg = container.querySelector("svg:last-of-type");

  if (svgClicked === firstSvg) {
    firstSvg.classList.add("hidden");
    secondSvg.classList.remove("hidden");
  } else {
    firstSvg.classList.remove("hidden");
    secondSvg.classList.add("hidden");
  }
});

// ========== 2. Hover STT -> hiện icon play (track-main thường) ==========
document.addEventListener("pointerover", (e) => {
  const track = e.target.closest(".track-main");
  if (!track || track.id === "five-line") return;
  if (track.contains(e.relatedTarget)) return; // đang ở trong track, bỏ qua

  const container = track.querySelector(".stt-play");
  if (!container) return;

  container.querySelector("span:first-of-type").classList.add("hidden");
  container.querySelector("span:last-of-type").classList.remove("hidden");
});

document.addEventListener("pointerout", (e) => {
  const track = e.target.closest(".track-main");
  if (!track || track.id === "five-line") return;
  if (track.contains(e.relatedTarget)) return; // vẫn còn trong track, bỏ qua

  const container = track.querySelector(".stt-play");
  if (!container) return;

  container.querySelector("span:first-of-type").classList.remove("hidden");
  container.querySelector("span:last-of-type").classList.add("hidden");
});

// ========== 3. Track "five-line" (now playing) - phần tử tĩnh, không đổi ==========
const fiveLineTrack = document.getElementById("five-line");
if (fiveLineTrack) {
  const playing = document.getElementById("playing");
  const stop = document.getElementById("five-line-stop");

  if (window.matchMedia("(max-width: 639.99px)").matches) {
    fiveLineTrack.addEventListener("click", (e) => {
      e.stopPropagation();
      playing.classList.add("hidden");
      stop.classList.remove("hidden");
    });
    document.addEventListener("click", (e) => {
      e.stopPropagation();
      playing.classList.remove("hidden");
      stop.classList.add("hidden");
    });
  } else {
    fiveLineTrack.addEventListener("pointerenter", (e) => {
      e.stopPropagation();
      playing.classList.add("hidden");
      playing.classList.remove("flex");
      stop.classList.remove("hidden");
    });
    fiveLineTrack.addEventListener("pointerleave", (e) => {
      e.stopPropagation();
      playing.classList.remove("hidden");
      playing.classList.add("flex");
      stop.classList.add("hidden");
    });
  }
}

/* ---- carousel.js ---- */
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


/* ---- x-about.js ---- */
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


/* ---- hide-about.js ---- */
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


/* ---- play-progress.js ---- */
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


/* ---- marquee.js ---- */
/**
 * Biến 1 phần tử chứa text tĩnh thành marquee NẾU text bị tràn khung chứa.
 * @param {HTMLElement} el - phần tử sẽ chứa marquee (phải nằm trong khung có chiều rộng giới hạn)
 * @param {string} text - nội dung cần hiển thị
 * @param {{ always?: boolean }} options - always: true = chạy liên tục, false = chỉ chạy khi hover .track-main cha
 */
function setupMarquee(el, text, { always = false } = {}) {
  el.innerHTML = "";
  el.classList.remove(
    "text-ellipsis",
    "overflow-hidden",
    "marquee-viewport",
    "marquee-always",
  );

  const viewport = document.createElement("span");
  viewport.className = "block";
  const track = document.createElement("span");
  track.style.display = "inline-block";
  track.textContent = text;
  viewport.appendChild(track);
  el.appendChild(viewport);

  requestAnimationFrame(() => {
    const overflow = track.scrollWidth > el.clientWidth + 1;

    if (!overflow) {
      // Không tràn -> hiển thị bình thường, cắt bằng dấu "..."
      el.classList.add("text-ellipsis", "overflow-hidden");
      return;
    }

    // Tràn -> nhân đôi nội dung để chạy vòng lặp mượt (không giật khi lặp lại)
    const gap = "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0";
    const span1 = document.createElement("span");
    span1.textContent = text + gap;
    const span2 = document.createElement("span");
    span2.textContent = text + gap;

    track.textContent = "";
    track.className = "marquee-track";
    track.appendChild(span1);
    track.appendChild(span2);

    const distance = span1.scrollWidth;
    const speed = 1; // px/giây, chỉnh để nhanh/chậm hơn
    const duration = Math.max(distance / speed, 4);
    track.style.setProperty("--marquee-duration", `${duration}s`);

    el.classList.add("marquee-viewport");
    if (always) el.classList.add("marquee-always");
  });
}


/* ---- tracks-mobile.js ---- */
// 1. Danh sách dữ liệu các bài hát
// >>> URL gốc của R2 bucket (thay bằng URL thật của bạn sau khi Enable Public Development URL) <<<
// const R2_BASE = "https://pub-5cee7735d10d4f61896814b089cfc9a8.r2.dev";
const R2_IMG_BASE = "https://pub-5cee7735d10d4f61896814b089cfc9a8.r2.dev";
const R2_BASE = "/media";
const tracks = [
  {
    stt: 1,
    title: "Elegie",
    artist: "RPT MCK",
    img: R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Elegie_Track01_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Elegie_spotdown.org.mp3",
    duration: "1:27",
  },
  {
    stt: 2,
    title: "IDK",
    artist: "RPT MCK",
    img: R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_IDK_Track02_N0L4B3L.png",
    audio: R2_BASE + "/hvl/IDK_spotdown.org.mp3",
    duration: "3:16",
  },
  {
    stt: 3,
    title: "Wtf Bby I'm Lit",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Wtf_Bby_Im_Lit_Track03_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Wtf_Bby_Im_Lit_spotdown.org.mp3",
    duration: "2:46",
  },
  {
    stt: 4,
    title: "Anh Không Muốn Nó Dễ Dàng",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Anh_Khong_Muon_No_De_Dang_Track04_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Anh_Khong_Muon_No_De_Dang_spotdown.org.mp3",
    duration: "2:45",
  },
  {
    stt: 5,
    title: "Baby (feat. marzuz)",
    artist: "RPT MCK, marzuz",
    img: R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Baby_Track05_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Baby_feat_marzuz_spotdown.org.mp3",
    duration: "2:53",
  },
  {
    stt: 6,
    title: "Yêu Anh Giết Anh",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Yeu_Anh_Giet_Anh_Track06_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Yeu_Anh_Giet_Anh_spotdown.org.mp3",
    duration: "2:45",
  },
  {
    stt: 7,
    title: "Mắt Môi Tay Chân (feat. Tage)",
    artist: "RPT MCK, Tage",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Mat_Moi_Tay_Chan_Track07_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Mat_Moi_Tay_Chan_feat_Tage_spotdown.org.mp3",
    duration: "3:12",
  },
  {
    stt: 8,
    title: "Đao Của Anh Vừa",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Dao_Cua_Anh_Vua_Track08_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Dao_Cua_Anh_Vua_spotdown.org.mp3",
    duration: "2:04",
  },
  {
    stt: 9,
    title: "Là Gì Của Nhau",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_La_Gi_Cua_Nhau_Track09_N0L4B3L.png",
    audio: R2_BASE + "/hvl/La_Gi_Cua_Nhau_spotdown.org.mp3",
    duration: "2:22",
  },
  {
    stt: 10,
    title: "Night In Prague",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Night_In_Prague_Track10_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Night_In_Prague_spotdown.org.mp3",
    duration: "3:33",
  },
  {
    stt: 11,
    title: "Một Cái Ôm",
    artist: "RPT MCK",
    img:
      R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Mot_Cai_Om_Track11_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Mot_Cai_Om_spotdown.org.mp3",
    duration: "3:21",
  },
  {
    stt: 12,
    title: "Liệm",
    artist: "RPT MCK",
    img: R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Liem_Track12_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Liem_spotdown.org.mp3",
    duration: "3:53",
  },
  {
    stt: 13,
    title: "Nếu Như Ta Chẳng Còn (feat. A$AP Ướt Mi)",
    artist: "RPT MCK, A$AP Ướt Mi",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Neu_Nhu_Ta_Chang_Con_Track13_N0L4B3L.png",
    audio:
      R2_BASE + "/hvl/Neu_Nhu_Ta_Chang_Con_feat_ ASAP_Uot_Mi_spotdown.org.mp3",
    duration: "5:17",
  },
  {
    stt: 14,
    title: "Ai Mới Là Kẻ Xấu Xa",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Ai_Moi_La_Ke_Xau_Xa_Track14_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Ai_Moi_La_Ke_Xau_Xa_spotdown.org.mp3",
    duration: "3:11",
  },
  {
    stt: 15,
    title: "Slippery (feat. Tùng Dương)",
    artist: "RPT MCK, Tùng Dương",
    img:
      R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Slippery_Track15_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Slippery_feat_Tung_Duong_spotdown.org.mp3",
    duration: "3:35",
  },
  {
    stt: 16,
    title: "Interpol",
    artist: "RPT MCK",
    img:
      R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Intenpol_Track16_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Intenpol_spotdown.org.mp3",
    duration: "0:53",
  },
  {
    stt: 17,
    title: "Tây Thi",
    artist: "RPT MCK",
    img: R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Tay_Thi_Track17_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Tay_Thi_spotdown.org.mp3",
    duration: "1:44",
  },
  {
    stt: 18,
    title: "Hút và Hút",
    artist: "RPT MCK",
    img:
      R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Hut_Va_Hut_Track18_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Hut_va_Hut_spotdown.org.mp3",
    duration: "2:14",
  },
  {
    stt: 19,
    title: "Dưa Chua",
    artist: "RPT MCK",
    img:
      R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Dua_Chua_Track19_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Dua_Chua_spotdown.org.mp3",
    duration: "3:02",
  },
  {
    stt: 20,
    title: "Xa Xôi (feat. Obito)",
    artist: "RPT MCK, Obito",
    img: R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Xa_Xoi_Track20_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Xa_Xoi_feat_Obito_spotdown.org.mp3",
    duration: "3:37",
  },
  {
    stt: 21,
    title: "Che Phủ",
    artist: "RPT MCK",
    img: R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Che_Phu_Track21_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Che_Phu_spotdown.org.mp3",
    duration: "2:35",
  },
  {
    stt: 22,
    title: "Oanh M = Thuoc",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Oanh_M_Thuoc_Track22_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Oanh_M_bang_Thuoc_spotdown.org.mp3",
    duration: "3:24",
  },
  {
    stt: 23,
    title: "Ghet Xog Lai Thik",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Ghet_Xog_Lai_Thik_Track23_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Ghet_Xog_Lai_Thik_spotdown.org.mp3",
    duration: "1:53",
  },
  {
    stt: 24,
    title: "Nhìn Kẻ Thù Của Tao",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Nhin_Ke_Thu_Cua_Tao_Track24_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Nhin_Ke_Thu_Cua_Tao_spotdown.org.mp3",
    duration: "3:54",
  },
  {
    stt: 25,
    title: "Envy (feat. THANHDRAW)",
    artist: "RPT MCK, THANHDRAW",
    img: R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Envy_Track25_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Envy_feat_Thanh_Draw_spotdown.org.mp3",
    duration: "3:55",
  },
  {
    stt: 26,
    title: "Cảm Ơn",
    artist: "RPT MCK",
    img: R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Cam_On_Track26_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Cam_On_spotdown.org.mp3",
    duration: "2:39",
  },
  {
    stt: 27,
    title: "Không Cần Lo Cho Tao",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Khong_Can_Lo_Cho_Tao_Track27_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Khong_Can_Lo_Cho_Tao_spotdown.org.mp3",
    duration: "2:36",
  },
  {
    stt: 28,
    title: "Huh (feat. RPT Orijinn & THANHDRAW)",
    artist: "RPT MCK, RPT Orijinn, THANHDRAW",
    img: R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Huh_Track28_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Huh_feat_RPT_Orijinn_Thanh_Draw)_spotdown.org.mp3",
    duration: "4:11",
  },
  {
    stt: 29,
    title: "Nguyễn Văn Mười",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Nguyen_Van_Muoi_Track29_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Nguyen_Van_Muoi_spotdown.org.mp3",
    duration: "4:02",
  },
  {
    stt: 30,
    title: "Thịt Lợn",
    artist: "RPT MCK",
    img:
      R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Thit_Lon_Track30_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Thit_Lon_spotdown.org.mp3",
    duration: "3:48",
  },
];

// Cho next-song.js dùng chung mảng này
window.tracks = tracks;

// * Hang doi phat nhac tuy chinh (dung chung voi queue.js) - dung cho mobile
window.customQueue = window.customQueue || [];

window.addToQueue = function (index) {
  if (!window.customQueue.includes(index)) {
    window.customQueue.push(index);
    if (typeof window.onQueueChange === "function") window.onQueueChange();
  }
};

window.removeFromQueue = function (index) {
  const pos = window.customQueue.indexOf(index);
  if (pos !== -1) {
    window.customQueue.splice(pos, 1);
    if (typeof window.onQueueChange === "function") window.onQueueChange();
  }
};

// 1.5
function randomViews() {
  const rand = Math.random();
  let num;

  if (rand < 0.15) {
    // 15% bài hot: 1,000,000 - 20,000,000
    num = Math.floor(Math.random() * (20_000_000 - 1_000_000) + 1_000_000);
  } else if (rand < 0.55) {
    // 40% bài trung bình: 100,000 - 1,000,000
    num = Math.floor(Math.random() * (1_000_000 - 100_000) + 100_000);
  } else {
    // 45% bài ít nghe: 1,000 - 100,000
    num = Math.floor(Math.random() * (100_000 - 1_000) + 1_000);
  }

  return num.toLocaleString("en-US"); // 1234567 -> "1,234,567"
}

tracks.forEach((track) => {
  track.views = randomViews();
});

// 2. Tiện ích format giây -> "m:ss"
function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

// 3. Hàm chuyển đổi 1 đối tượng track thành chuỗi HTML
function createTrackHTML(track, index) {
  return `
    <!-- * track ${track.stt} -->
    <li
      data-index="${index}"
      class="group justify-normal items-center gap-4 grid grid-cols-[22px_1fr_auto] hover:bg-[#282831] px-[16px] py-[8px] rounded track-main"
    >
      <!-- * stt -->
      <div class="flex justify-center items-center w-[22px] h-full stt-play">
        <span class="px-2 text-[#989FB9] text-md track-stt">${track.stt}</span>

        <div class="hidden playing track-playing-icon">
          <div class="greenline line-1"></div>
          <div class="greenline line-2"></div>
          <div class="greenline line-3"></div>
          <div class="greenline line-4"></div>
          <div class="greenline line-5"></div>
        </div>

        <span class="hidden track-play-icon cursor-pointer">
          <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
            <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z" fill="#FFFFFF"></path>
          </svg>
        </span>

        <span class="hidden track-pause-icon cursor-pointer">
          <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
            <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z" fill="#FFFFFF"></path>
          </svg>
        </span>
      </div>

      <!-- * img + title -->
      <div class="flex justify-start items-center gap-2 h-full min-w-0">
        <div class="w-[40px] min-w-[40px] h-[40px]">
          <img src="${track.img}" alt="${track.title}" class="rounded" loading="lazy" decoding="async"/>
        </div>
        <div class="min-w-0">
          <span class="block text-md text-white track-title hover:underline text-nowrap overflow-hidden text-ellipsis hover:cursor-pointer">${track.title}</span>
          ${track.artist ? `<span class="block text-sm text-[#989FB9] text-nowrap overflow-hidden text-ellipsis">${track.artist}</span>` : ""}
        </div>
      </div>

      <!-- * more options (thay cho add to playlist tren mobile) -->
      <div class="flex justify-end items-center h-full">
        <div class="flex items-center gap-2">
          <div class="relative track-more">
            <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-encore-id="icon" role="img" aria-hidden="true" class="track-more-toggle hover:scale-105 active:scale-95 cursor-pointer" viewBox="0 0 24 24" width="22" height="22">
              <path d="M4.5 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm15 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-7.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill-opacity="1" fill="#fff"></path>
            </svg>

            <div class="hidden right-0 top-full z-1 absolute bg-[#282828] shadow-xl mt-1 rounded-md w-[230px] overflow-hidden track-more-menu">
              <button type="button" class="flex items-center gap-3 hover:bg-[#3E3E3E] px-3 py-2 w-full text-left cursor-pointer track-add-queue-item">
                <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" fill="#B3B3B3" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                  <path d="M16 15H2v-1.5h14zm0-4.5H2V9h14zm-8.034-6A5.5 5.5 0 0 1 7.187 6H13.5a2.5 2.5 0 0 0 0-5H7.966c.159.474.255.978.278 1.5H13.5a1 1 0 1 1 0 2zM2 2V0h1.5v2h2v1.5h-2v2H2v-2H0V2z" fill="#B3B3B3"></path>
                </svg>
                <span class="text-white text-sm">Thêm vào hàng đợi</span>
              </button>
              <button type="button" class="flex items-center gap-3 hover:bg-[#3E3E3E] px-3 py-2 w-full text-left cursor-pointer track-add-playlist-item">
                <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" fill="#B3B3B3" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                  <path d="M11.999 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11z"></path>
                  <path d="M17.999 12a1 1 0 0 1-1 1h-4v4a1 1 0 1 1-2 0v-4h-4a1 1 0 1 1 0-2h4V7a1 1 0 1 1 2 0v4h4a1 1 0 0 1 1 1z"></path>
                </svg>
                <span class="text-white text-sm">Thêm vào danh sách phát</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  `;
}

// 4. Render danh sách ra giao diện — chỉ hiện 5 bài đầu, phần còn lại
// chỉ thực sự render (và do đó chỉ thực sự tải ảnh) khi bấm "See more".
const playlistContainer = document.getElementById("playlist");
const INITIAL_COUNT = 5;
let seeMoreExpanded = false;

function renderPlaylist(expanded) {
  const list = expanded ? tracks : tracks.slice(0, INITIAL_COUNT);
  playlistContainer.innerHTML = list
    .map((track, i) => createTrackHTML(track, i))
    .join("");
}

renderPlaylist(false); // lần đầu: chỉ 5 bài -> chỉ 5 request ảnh

const seeMoreBtn = document.getElementById("see-more");
if (seeMoreBtn) {
  const seeMoreLabel = seeMoreBtn.querySelector("span");
  seeMoreBtn.addEventListener("click", () => {
    seeMoreExpanded = !seeMoreExpanded;
    renderPlaylist(seeMoreExpanded);
    if (seeMoreLabel) {
      seeMoreLabel.textContent = seeMoreExpanded ? "See less" : "See more";
    }
  });
}

// 5. KHÔNG tải trước bất kỳ file audio nào để lấy duration.
// Duration chỉ được cập nhật từ audio THẬT khi người dùng bấm nghe
// (audio#audio-song đã được gán src bởi playTrackAtIndex ở file khác).
const audioElForDuration = document.getElementById("audio-song");
if (audioElForDuration) {
  audioElForDuration.addEventListener("loadedmetadata", () => {
    const index =
      typeof window.getCurrentTrackIndex === "function"
        ? window.getCurrentTrackIndex()
        : null;
    if (index === null || !tracks[index]) return;

    tracks[index].duration = formatTime(audioElForDuration.duration);
    const timeEl = document.querySelector(
      `.track-main[data-index="${index}"] .track-time`,
    );
    if (timeEl) timeEl.textContent = tracks[index].duration;
  });
}

// 6. Click vao 1 dong track -> phat bai do, hoac xu ly popup more-options
playlistContainer.addEventListener("click", (e) => {
  const toggle = e.target.closest(".track-more-toggle");
  if (toggle) {
    e.stopPropagation();
    const menu = toggle
      .closest(".track-more")
      .querySelector(".track-more-menu");
    document.querySelectorAll(".track-more-menu").forEach((m) => {
      if (m !== menu) m.classList.add("hidden");
    });
    menu.classList.toggle("hidden");
    return;
  }

  const addQueueBtn = e.target.closest(".track-add-queue-item");
  if (addQueueBtn) {
    e.stopPropagation();
    const idx = Number(addQueueBtn.closest(".track-main").dataset.index);
    if (typeof window.addToQueue === "function") window.addToQueue(idx);
    addQueueBtn.closest(".track-more-menu").classList.add("hidden");
    return;
  }

  const addPlaylistBtn = e.target.closest(".track-add-playlist-item");
  if (addPlaylistBtn) {
    e.stopPropagation();
    const idx = Number(addPlaylistBtn.closest(".track-main").dataset.index);
    if (typeof window.toggleAddToPlaylist === "function")
      window.toggleAddToPlaylist(idx);
    addPlaylistBtn.closest(".track-more-menu").classList.add("hidden");
    return;
  }

  if (e.target.closest(".track-more")) return;

  const track = e.target.closest(".track-main");
  if (!track) return;

  const index = Number(track.dataset.index);
  if (typeof window.playTrackAtIndex === "function") {
    window.playTrackAtIndex(index);
  }
});

// * dong popup more-options khi click ra ngoai
document.addEventListener("click", (e) => {
  if (!e.target.closest(".track-more")) {
    document
      .querySelectorAll(".track-more-menu")
      .forEach((m) => m.classList.add("hidden"));
  }
});

// 8. Áp dụng marquee cho tên bài trong danh sách (chạy khi hover dòng đó)
document.querySelectorAll(".track-title").forEach((el) => {
  const text = el.textContent.trim();
  setupMarquee(el, text, { always: false });
});

// 7. Đánh dấu bài đang phát trong danh sách (đổi số thứ tự + tên bài sang màu xanh)
function highlightPlayingTrack(index) {
  document.querySelectorAll(".track-main.is-playing").forEach((el) => {
    el.classList.remove("is-playing");
  });

  const active = document.querySelector(`.track-main[data-index="${index}"]`);
  if (active) active.classList.add("is-playing");

  // * đồng bộ label tên bài hát + ca sĩ ở đầu lyrics view
  const track = tracks[index];
  if (track) {
    const lyricsTitle = document.getElementById("lyrics-view-title");
    const lyricsArtist = document.getElementById("lyrics-view-artist");
    const lyricsCover = document.getElementById("lyrics-view-cover");

    if (lyricsTitle) lyricsTitle.textContent = track.title;
    if (lyricsArtist) lyricsArtist.textContent = track.artist || "";
    if (lyricsCover) lyricsCover.src = track.img;
  }
}
window.highlightPlayingTrack = highlightPlayingTrack;


/* ---- shuffle-repeat.js ---- */
(function () {
  const shuffleBtn = document.getElementById("shuffle-btn");
  const repeatBtn = document.getElementById("repeat-btn");
  const repeatIcon = document.getElementById("repeat-icon");
  const repeatOneIcon = document.getElementById("repeat-one-icon");

  if (!shuffleBtn || !repeatBtn || !repeatIcon || !repeatOneIcon) {
    console.warn(
      "shuffle-repeat.js: thiếu phần tử cần thiết, kiểm tra lại id trong HTML",
    );
    return;
  }

  const COLOR_ACTIVE = "#1ED760";
  const COLOR_INACTIVE = "#999FB9";

  // ----- Trạng thái toàn cục (next-song.js đọc 2 biến này) -----
  window.isShuffle = false;
  window.repeatMode = "off"; // "off" | "all" | "one"

  function setIconColor(svgEl, color) {
    svgEl
      .querySelectorAll("path")
      .forEach((p) => p.setAttribute("fill", color));
  }

  // ----- Shuffle -----
  function updateShuffleUI() {
    setIconColor(
      shuffleBtn.querySelector("svg"),
      window.isShuffle ? COLOR_ACTIVE : COLOR_INACTIVE,
    );
  }

  shuffleBtn.addEventListener("click", () => {
    window.isShuffle = !window.isShuffle;
    updateShuffleUI();
  });

  // ----- Repeat: tắt -> lặp tất cả -> lặp 1 bài -> tắt -----
  function updateRepeatUI() {
    if (window.repeatMode === "one") {
      repeatIcon.classList.add("hidden");
      repeatOneIcon.classList.remove("hidden");
      setIconColor(repeatOneIcon, COLOR_ACTIVE);
    } else {
      repeatOneIcon.classList.add("hidden");
      repeatIcon.classList.remove("hidden");
      setIconColor(
        repeatIcon,
        window.repeatMode === "all" ? COLOR_ACTIVE : COLOR_INACTIVE,
      );
    }
  }

  repeatBtn.addEventListener("click", () => {
    window.repeatMode =
      window.repeatMode === "off"
        ? "all"
        : window.repeatMode === "all"
          ? "one"
          : "off";
    updateRepeatUI();
  });

  // Khởi tạo màu icon ban đầu
  updateShuffleUI();
  updateRepeatUI();
})();


/* ---- media-session.js ---- */
(function () {
  if (!("mediaSession" in navigator)) return; // trình duyệt không hỗ trợ thì bỏ qua

  const audio = document.getElementById("audio-song");
  if (!audio) return;

  // Cập nhật ảnh + tên bài + nghệ sĩ trên notification/lock screen
  function updateMetadata() {
    const list = window.tracks || [];
    const index =
      typeof window.getCurrentTrackIndex === "function"
        ? window.getCurrentTrackIndex()
        : 0;
    const track = list[index];
    if (!track) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist || "",
      album: "HVL",
      artwork: [
        { src: track.img, sizes: "96x96", type: "image/png" },
        { src: track.img, sizes: "192x192", type: "image/png" },
        { src: track.img, sizes: "256x256", type: "image/png" },
        { src: track.img, sizes: "384x384", type: "image/png" },
        { src: track.img, sizes: "512x512", type: "image/png" },
      ],
    });
  }

  // Đăng ký hành động cho các nút trên notification
  navigator.mediaSession.setActionHandler("play", () => {
    audio.play();
  });

  navigator.mediaSession.setActionHandler("pause", () => {
    audio.pause();
  });

  navigator.mediaSession.setActionHandler("previoustrack", () => {
    if (typeof window.prevSongFromMediaSession === "function") {
      window.prevSongFromMediaSession();
    } else {
      document.getElementById("prev-song")?.click();
    }
  });

  navigator.mediaSession.setActionHandler("nexttrack", () => {
    if (typeof window.nextSongFromMediaSession === "function") {
      window.nextSongFromMediaSession();
    } else {
      document.getElementById("next-song")?.click();
    }
  });

  // Đồng bộ trạng thái play/pause thật của audio -> notification
  audio.addEventListener("play", () => {
    navigator.mediaSession.playbackState = "playing";
    updateMetadata();
  });

  audio.addEventListener("pause", () => {
    navigator.mediaSession.playbackState = "paused";
  });

  // Mỗi khi đổi bài (src thay đổi) -> cập nhật lại metadata ngay
  audio.addEventListener("loadedmetadata", updateMetadata);

  // Thanh tiến trình trên lock screen (một số trình duyệt hỗ trợ)
  audio.addEventListener("timeupdate", () => {
    if (!isFinite(audio.duration) || audio.duration <= 0) return;
    try {
      navigator.mediaSession.setPositionState({
        duration: audio.duration,
        playbackRate: audio.playbackRate,
        position: audio.currentTime,
      });
    } catch (e) {
      // một số trình duyệt không hỗ trợ setPositionState, bỏ qua lỗi
    }
  });
})();


/* ---- next-song.js ---- */
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
  if (!list.length) return;

  const customQueue = window.customQueue || [];

  // Ưu tiên phát bài trong hàng đợi trước, sau đó xóa nó khỏi hàng đợi
  if (customQueue.length) {
    const nextIndex = customQueue.shift();
    if (typeof window.onQueueChange === "function") window.onQueueChange();
    loadSong(nextIndex);
    return;
  }

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

  // Có bài trong hàng đợi -> phát bài đầu tiên, rồi bỏ khỏi hàng đợi
  const customQueue = window.customQueue || [];
  if (customQueue.length) {
    const nextIndex = customQueue.shift();
    if (typeof window.onQueueChange === "function") window.onQueueChange();
    loadSong(nextIndex);
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
      loadSong(0);
    }
    return;
  }

  loadSong(currentIndex + 1);
});

// loadSong(0, false);


/* ---- lyrics-data.js ---- */
// JS/lyrics-data.js
// Du lieu lyric dong bo theo tung bai hat.
// Dinh dang: mang cac dong { time: giay (so thap phan), text: "noi dung dong do" }
// time la thoi diem (tinh bang giay) ma dong do bat dau duoc hat.
//
// Key phai khop CHINH XAC voi "title" trong tracks.js

window.lyricsDatabase = {
  Elegie: [],
  IDK: [
    { time: 16.69, text: "Ah-ah-ah-ah-ah-ah-ah-ah-ah-ah-ah-ah-ah-ah-ah-ah" },
    {
      time: 22.91,
      text: "Khói bay nơi phố xưa, ánh mắt quen chiều chạng vạng",
    },
    { time: 25.72, text: "Vắng hoe, chỉ còn mỗi anh, cigar và rượu vang" },
    { time: 28.5, text: "Giá như em ở đây, như lúc xưa, anh sẽ sà vào" },
    { time: 31.33, text: "Nàng nhắc anh là đã lâu anh vẫn chưa được về nhà" },
    {
      time: 34.15,
      text: "Và cứ như là không quan tâm, nhưng vẫn cứ luôn miệng xì xào",
    },
    { time: 36.9, text: "Chẳng mấy khi, thấy suy, châm bi stiva" },
    { time: 39.72, text: "Còn nhớ em, anh muốn quên, để những câu hỏi kỳ lạ" },
    {
      time: 42.52,
      text: "Trả lời giúp anh, sao anh hút ben mà chẳng thấy phê, chẳng gì cả",
    },
    { time: 46.65, text: "Chẳng thấy phê, chẳng gì cả" },
    { time: 49.52, text: "Chẳng thấy phê, chẳng gì cả" },
    { time: 52.46, text: "Chẳng thấy phê, chẳng gì cả, chyah" },
    { time: 56.1, text: "Baby, what's up?" },
    { time: 57.79, text: "Chạy đuổi theo nhau thành một vòng tròn" },
    { time: 60.75, text: "Đôi khi thấy nhưng không đợi mong" },
    { time: 63.48, text: "Chắc sẽ đến lúc con tim mình thôi nhung nhớ, yah" },
    { time: 68.09, text: "Gió thu, déjà vu, tưởng thấy em ở gần nhà" },
    { time: 70.85, text: "Màu tóc quen làm ngỡ như bóng em vụt qua" },
    { time: 73.75, text: "Nếu ta chạm mắt nhau, liệu có như hai người xa lạ?" },
    { time: 76.34, text: "Anh phóng lên, tay vít ga, ngược gió thu, vraaa" },
    {
      time: 79.34,
      text: "Trong một khoảnh khắc anh tưởng như anh đã tìm thấy thứ bao lâu nay anh kiếm tìm",
    },
    {
      time: 82.24,
      text: "Mọi mảnh ghép kia hiện ra thật hợp lý, anh nghĩ là anh đã có lại niềm tin",
    },
    {
      time: 85.08,
      text: "Không gian xung quanh như là đang sáng lên, anh lao đi ở trong một bộ phim",
    },
    {
      time: 87.74,
      text: "Cào cào trắng trong màn đêm đen, FMF xé không gian lặng im",
    },
    {
      time: 90.71,
      text: "Từng lời nguyện cầu trở thành hiện thực rồi, điều gì sẽ thuộc về anh?",
    },
    {
      time: 93.47,
      text: "Anh không muốn mất em thêm lần nữa đâu nên đã phóng theo em thật nhanh",
    },
    {
      time: 96.32,
      text: "Càng đi theo em, anh lại càng xa, tiếng chim lợn kêu báo điềm chẳng lành",
    },
    {
      time: 102.02,
      text: "Từng lời nguyện cầu trở thành hiện thực rồi, điều gì sẽ thuộc về anh?",
    },
    {
      time: 104.84,
      text: "Anh không muốn mất em thêm lần nữa đâu nên đã phóng theo em thật nhanh",
    },
    {
      time: 107.66,
      text: "Càng đi theo em, anh lại càng xa, tiếng chim lợn kêu báo điềm chẳng lành",
    },
    { time: 110.97, text: "Hah-ah-ah, ah-ah-ah" },
    { time: 113.19, text: "Con tim như đang được sống lại" },
    { time: 116.08, text: "Giấc mơ chia làm hai" },
    { time: 118.92, text: "Anh mang mùa thu ngày hôm qua" },
    { time: 122.02, text: "Em mang ngày mai" },
    { time: 124.38, text: "Con tim như đang được sống lại" },
    { time: 127.28, text: "Giấc mơ chia làm hai" },
    { time: 130.2, text: "Anh mang mùa thu ngày hôm qua" },
    { time: 133.0, text: "Em mang ngày mai" },
    { time: 135.66, text: "Ở ngã ba, một tiếng la, thất thanh và" },
    { time: 138.43, text: "Một tiếng xe, cứu thương, rít lên từ đằng xa" },
    {
      time: 141.36,
      text: "Anh muốn em, chậm lại chút thôi, anh muốn đi về nhà",
    },
    { time: 144.02, text: "Họ đến đây để bắt anh, đừng bỏ anh, yeah" },
    { time: 146.95, text: "Phải rất lâu, hai chúng ta chẳng nến, vang, cigar" },
    { time: 149.95, text: "Đốt thêm, khói bay, Camel, trà đen" },
    { time: 152.88, text: "Áo quan, lẵng hoa, chỉ là vẫn như hai người xa lạ" },
    {
      time: 155.57,
      text: "Anh vẫn luôn là chính anh, đợi hình bóng quen, là em",
    },
    {
      time: 158.47,
      text: "Khói bay nơi phố xưa, ánh mắt quen chiều chạng vạng",
    },
    { time: 161.07, text: "Màu tóc quen, làm ngỡ như bóng ai vụt qua" },
    {
      time: 164.06,
      text: "Nếu ta chạm mắt nhau, liệu có như hai người xa lạ?",
    },
    { time: 166.62, text: "Nàng nhắc anh là đã lâu anh vẫn chưa được về nhà" },
    { time: 169.61, text: "Gió thu, déjà vu, tưởng thấy em ở gần nhà" },
    { time: 172.65, text: "Vắng hoe, chỉ còn mỗi anh, cigar và rượu vang" },
    { time: 175.44, text: "Giá như em ở đây, như lúc xưa, anh sẽ sà vào" },
    { time: 177.98, text: "Anh phóng lên, tay vít ga, ngược gió thu, vraaa" },
  ],
  "Wtf Bby I'm Lit": [
    { time: 15.25, text: "In the game, baby, I'm lit" },
    { time: 17.1, text: "Không cần filter, anh ít khi điêu" },
    { time: 18.86, text: "Bôi nhiều son vào, hôn anh chi chít" },
    { time: 20.7, text: "On the beat, anh lead em phiêu" },
    { time: 22.59, text: "Đi quanh club, họ nhận ra anh nhiều quá" },
    { time: 24.46, text: "Rít một hơi, thổi làn khói tan ra" },
    { time: 26.28, text: "Xanh rồi đen, rồi lục, lam, chàm, tím" },
    { time: 27.87, text: "Chúng ngã vào nhau ở trong một tấm canvas" },
    { time: 30.02, text: "What the fuck? Baby, I'm still lit" },
    { time: 31.82, text: "Bóc đồ đi, xem outfit bao nhiêu" },
    { time: 33.57, text: "Second-hand tao vẫn bring the heat" },
    { time: 35.46, text: "Quá là fresh nên tao thích thì tao kiêu" },
    { time: 37.34, text: "Mấy thứ chúng mày coi là bình thường nhất" },
    { time: 39.17, text: "Lên người tao thành đồ rất cao siêu" },
    { time: 40.91, text: "Đừng săm soi chuyện đời tư của bố mày" },
    { time: 42.96, text: "Cuộc đời tao, yeah, tao thích thì tao yêu" },
    { time: 44.78, text: "Ah, ah-ah-ah-ah-ah, ah-ah-ah-ah-ah" },
    { time: 49.36, text: "Ah-ah-ah-ah-ah, ah, ah, ah, ah" },
    { time: 53.05, text: "Ah-ah-ah-ah-ah, ah-ah-ah-ah-ah" },
    { time: 56.73, text: "Ah-ah-ah-ah-ah, ah, ah, ah, yeah" },
    {
      time: 60.34,
      text: "Yeah, tim anh như đang nổ tung nhưng mà lại chẳng biết nói gì với em",
    },
    {
      time: 64.1,
      text: "Nhẹ nhàng, nhẹ nhàng dâng lên bao nhiêu cảm xúc này anh đang kìm nén (Ah)",
    },
    {
      time: 67.78,
      text: "Linh hồn mình đi tìm nhau, chìm vào cùng khoảnh khắc căn phòng tối đen",
    },
    {
      time: 71.55,
      text: "Nhẹ chạm vào bờ môi, đung đưa trôi khi hai ta say mèm",
    },
    {
      time: 74.39,
      text: "(Khẽ chạm vào bờ môi) Đung, đung đưa trôi khi hai ta say mèm",
    },
    {
      time: 77.94,
      text: "(Đến bên em người ơi) Đung đưa trôi khi mà hai ta say mèm (Khẽ chạm vào bờ môi)",
    },
    { time: 88.28, text: "Okay, in the game, baby, I'm lit" },
    { time: 91.81, text: "Ít khi điêu" },
    { time: 93.36, text: "Hôn anh chi chít" },
    { time: 95.35, text: "Anh lead em phiêu" },
    { time: 97.06, text: "Nhận ra anh nhiều quá" },
    { time: 99.12, text: "Khói tan ra" },
    { time: 100.15, text: "Xanh rồi đen, rồi lục, lam, chàm, tím" },
    { time: 101.63, text: "Chúng ngã vào nhau ở trong một tấm canvas" },
    { time: 105.12, text: "(Khi mà em) Khi mà em đang say" },
    { time: 109.34, text: "Đung đưa, đung đưa khi mà em đang say" },
    { time: 113.9, text: "Khi mà em đang say" },
    { time: 116.7, text: "Đung đưa, đung đưa khi mà em đang" },
    { time: 118.51, text: "Ngã ra trong một tấm canvas" },
    { time: 120.42, text: "Lướt qua chạm vào làn da" },
    { time: 122.23, text: "Your aura, your vibe" },
    { time: 126.09, text: "Ngã ra trong một tấm canvas" },
    { time: 127.58, text: "Anh giờ quá phê, anh trông như là tảng đá" },
    { time: 129.77, text: "My aura, my vibe" },
    { time: 133.35, text: "In the game, baby, I'm lit" },
    { time: 135.11, text: "Không cần filter, anh ít khi điêu" },
    { time: 137.13, text: "Bôi nhiều son vào, hôn anh chi chít" },
    { time: 138.95, text: "On the beat, anh lead em phiêu" },
    { time: 140.86, text: "Đi quanh club, họ nhận ra anh nhiều quá" },
    { time: 142.59, text: "Rít một hơi, thổi làn khói tan ra" },
    { time: 144.49, text: "Xanh rồi đen, rồi lục, lam, chàm, tím" },
    { time: 146.0, text: "Chúng ngã vào nhau ở trong một tấm canvas" },
    { time: 148.09, text: "In the game, I'm-I'm lit" },
    { time: 150.26, text: "Ít, anh ít khi, ít khi" },
    { time: 151.84, text: "Bôi nhiều son vào, hôn chi chít" },
    { time: 154.39, text: "Anh lead em ph–" },
    { time: 155.49, text: "Nhận, nhận, nhận ra anh nhiều quá" },
    { time: 157.33, text: "Rít một hơi, khói tan ra" },
    { time: 159.11, text: "Xanh rồi đen, rồi lục, lam, chàm, tím" },
    { time: 160.76, text: "Chúng ngã vào nhau ở trong một tấm canvas" },
  ],
  "Anh Không Muốn Nó Dễ Dàng": [
    { time: 0.53, text: "Có lẽ anh đã vội vàng, yeah" },
    {
      time: 4.7,
      text: "Khi mà ta chạm vào nhau đan bàn tay trao nhau những ánh mắt",
    },
    { time: 7.19, text: "Chầm chậm lướt lên trên đôi môi nàng, yeah" },
    {
      time: 12.96,
      text: "Tất cả chỉ là trò chơi tình yêu đến nhanh rồi lại mờ phai thôi",
    },
    { time: 44.06, text: "Anh vẫn mong là sẽ dễ dàng nói yêu với em" },
    { time: 49.34, text: "Hay là anh từ chối tất cả để nói yêu mình em" },
    { time: 54.61, text: "Quit playin', I ain't get it (I ain't get it)" },
    { time: 56.67, text: "Thế có yêu hay không để anh còn biết nào?" },
    {
      time: 59.31,
      text: "Giá băng trong con tim là không cần thiết (Chẳng cần thiết)",
    },
    {
      time: 61.82,
      text: "Sự cô đơn nó đã theo chân em đến đây (Theo nhịp chân em)",
    },
    { time: 65.35, text: "Cứ gặp anh ở trong những giấc mơ, những giấc mơ" },
    { time: 68.54, text: "Và nó sẽ đem cho em cảm giác như lần đầu" },
    { time: 70.72, text: "Cứ gặp anh ở trong những giấc mơ, những giấc mơ" },
    { time: 73.85, text: "Và nó sẽ đem cho em cảm giác như lần đầu" },
    {
      time: 76.48,
      text: "Bởi vì anh biết yêu thương này không mờ phai (Không bao giờ phai)",
    },
    {
      time: 79.04,
      text: "Đừng đẩy anh ra xa và trong phòng em chỉ còn tiếng thở dài",
    },
    { time: 81.86, text: "Nhiều lần anh muốn quên đi em là ai" },
    { time: 84.25, text: "Fuck that, I can’t do that nên là anh trở lại" },
    { time: 87.39, text: "Người đừng tạo nỗi nhớ, để anh một mình bơ vơ" },
    {
      time: 89.82,
      text: 'Anh chỉ muốn kêu lên là, "Ối giời ơi" (Quá đau, oh my god)',
    },
    {
      time: 92.36,
      text: "Để anh làm với nàng thế nhớ, để xem là có okay không?",
    },
    { time: 95.27, text: "Baby, em chơi anh như một món đồ chơi" },
    { time: 98.35, text: "Hết cách rồi (Bó tay)" },
    { time: 99.66, text: "ten out of ten đấy là feedback cho bộ mông của em" },
    { time: 102.9, text: "baby let me hit that" },
    {
      time: 104.67,
      text: "Chỉ cần nói với em vài câu, anh đã thấy bí bách quá đi",
    },
    { time: 108.33, text: "Phòng chỉ toàn là sương thôi nên là quá là mù mờ" },
    { time: 111.0, text: "Khói cứ bay ở đâu ra, anh tưởng anh ở Vancouver" },
    { time: 113.67, text: "Hút một bi tưởng pod chill, anh lăn quay cu đơ" },
    { time: 116.35, text: "Có lẽ ở cạnh bên em, nên là anh khù khờ" },
    { time: 118.82, text: "Tùng Mai đang on the track, baby, anh vu vơ" },
    {
      time: 121.4,
      text: "Không chỉ là đôi câu thơ mà baby khiến anh ngủ mơ (Chết dở)",
    },
    { time: 124.35, text: "Trói em luôn bắt baby phải bù cơ" },
    { time: 126.71, text: "I never gon' cheat, never do that thing to her" },
    {
      time: 129.87,
      text: "Bởi vì anh biết yêu thương này không mờ phai",
    },
    { time: 132.21, text: "Anh sẽ đem niềm vui khi mà anh trở lại" },
    { time: 135.16, text: "Và vì anh biết, baby, you're my ride or die" },
    { time: 138.08, text: "Fuck the fame, ta cùng đi một đoạn đường dài" },
    { time: 140.7, text: "Ah-ah-ah-ah-ah-ah" },
    { time: 145.07, text: "Ah-ah-ah-ah-ah-ah-ah-ah" },
    { time: 151.2, text: "Ah-ah-ah-ah-ah-ah" },
    { time: 156.64, text: "Để anh nói yêu mình em" },
  ],
  "Baby (feat. marzuz)": [
    { time: 12.78, text: "Way to go, girl" },
    { time: 14.22, text: "Way to go, go, go, go" },
    { time: 15.63, text: "Baby, baby, baby" },
    { time: 17.94, text: "Way to go, girl" },
    { time: 19.11, text: "Way to go, go, go, go" },
    { time: 20.78, text: "Em ở đâu?" },
    {
      time: 21.3,
      text: "Hỏa tinh của anh là Xà Phu nên em mà hư là anh đem vào show",
    },
    {
      time: 23.84,
      text: "Nghe bảo gu của em là sang, hoặc là trên người anh, hoặc là lên hàng đầu",
    },
    {
      time: 26.65,
      text: "VIP thì đông và xa, không thể thấy được em thì cũng chỉ thế mà thôi",
    },
    {
      time: 29.11,
      text: "Backstage hôn nhau tê cả môi, xin luôn con yêu zai Hà Nội",
    },
    {
      time: 31.4,
      text: "Oh my, anh chàng này là ai mà lời đường mật này cứ rót tai là trôi",
    },
    {
      time: 34.13,
      text: "Anh thích tỏ ra không quan tâm để ta như nam châm ta sẽ hút nhau cả đời",
    },
    {
      time: 36.63,
      text: "Em là gu của anh, anh là gu của em, hai con át chung một đôi",
    },
    { time: 39.11, text: "Tay chạm tay, môi chạm môi, designers on you" },
    { time: 41.42, text: "Sáng, rất thích quậy ở một nhà hàng hạng sang" },
    { time: 44.97, text: "Những hoài niệm của em em coi là vàng" },
    {
      time: 47.29,
      text: "Bởi vì mình biết giá trị của mình rồi chẳng cần chứng minh",
    },
    { time: 49.64, text: "Nhưng mà anh sẽ thích khi em động tay vào làm" },
    { time: 52.47, text: "Anh yêu tâm hồn nên anh sẽ chẳng thấy chán" },
    { time: 55.1, text: "Nhan sắc cũng sẽ tàn phai màu thời gian" },
    { time: 57.62, text: "Rực cháy hết cả tuổi xuân cho đời bàn tán" },
    { time: 59.76, text: "Em muốn cái gì em cứ hỏi, anh sẽ làm" },
    { time: 61.62, text: "Baby, baby, baby (Mwoah)" },
    { time: 64.26, text: "Em yêu mau tới đây đi" },
    { time: 65.72, text: "Chạng vạng chiều hoàng hôn anh siêu nhớ em luôn" },
    { time: 68.62, text: "Mụ mị bủa vây xung quanh tâm trí anh lạc đường" },
    { time: 70.73, text: "Anh cần nghe giọng em mà" },
    { time: 71.94, text: "Baby, baby, baby" },
    { time: 74.38, text: "Anh yêu em, tới đây đi" },
    { time: 75.95, text: "I’ll be your twin flame, your therapist" },
    { time: 78.63, text: "Con tim này cuồng si em như thế là vì" },
    { time: 81.0, text: "'Em designers on you" },
    { time: 82.29, text: "Sáng, rất thích quậy ở một nhà hàng hạng sang" },
    { time: 85.61, text: "Những hoài niệm của em, em coi là vàng" },
    {
      time: 88.06,
      text: "Bởi vì mình biết giá trị của mình rồi chẳng cần chứng minh",
    },
    { time: 90.5, text: "Nhưng mà anh sẽ thích khi em động tay vào làm" },
    { time: 93.3, text: "Anh yêu tâm hồn nên anh sẽ chẳng thấy chán" },
    { time: 96.04, text: "Nhan sắc cũng sẽ tàn phai màu thời gian" },
    { time: 98.52, text: "Rực cháy hết cả tuổi xuân cho đời bàn tán" },
    { time: 100.53, text: "Em muốn cái gì em cứ hỏi, anh sẽ làm" },
    { time: 102.47, text: "Baby, baby, baby" },
    { time: 104.66, text: "Way to go, girl" },
    { time: 106.04, text: "Way to go, go, go, go" },
    { time: 107.87, text: "Váy vóc với cả tóc tai, tóc tai" },
    { time: 110.24, text: "Vừa gai góc lại vừa thướt tha, thướt tha" },
    { time: 112.92, text: "Anh há hốc mồm khi em lướt qua, lướt qua" },
    { time: 115.53, text: "Gần rồi thì khó xa, baby biết mà" },
    { time: 118.19, text: "Nếu anh muốn cứ xé ra, anh cứ tàn phá" },
    { time: 120.62, text: "Em đang muốn được gào thét, muốn được tan ra" },
    { time: 123.21, text: "Anh hãy là nguồn cảm hứng cho từng câu ca" },
    { time: 125.44, text: "Và em là người ca sĩ hát, ah, ah, ah, ah" },
    { time: 127.38, text: "Baby hãy yêu em, yêu em thật điên cuồng" },
    { time: 130.64, text: "Như hai kẻ thù nằm chung giường" },
    { time: 133.14, text: "Khiến em muốn đâm đầu vô tường" },
    { time: 136.72, text: "Và nếu biết mai đây sẽ có lời từ khước" },
    { time: 139.21, text: "Hãy yêu như thể chúng ta là một điều ước" },
    {
      time: 141.71,
      text: "Anh phải rất muốn em thì anh mới có thể làm được, mm",
    },
    {
      time: 145.33,
      text: "Anh phải rất muốn em như cái cách em muốn anh, baby",
    },
    { time: 148.91, text: "Yeah, I like that, yeah" },
    { time: 151.77, text: "Như cái cách em muốn anh, baby" },
    { time: 156.85, text: "Em muốn gì em sẽ hỏi và anh cứ làm" },
    { time: 158.98, text: "Hai con át chung một đôi, um-hm" },
    { time: 161.55, text: "Tay chạm tay, môi chạm môi, yeah, oh-oh-oh" },
    { time: 163.84, text: "Baby, baby" },
  ],
  "Yêu Anh Giết Anh": [
    { time: 14.62, text: "Anh ta luôn đạt được những gì mình muốn" },
    { time: 16.71, text: "Đôi khi là cũng tùy tình huống" },
    { time: 18.36, text: "Anh bảo cô ta nếu vui thì mình uống" },
    { time: 22.04, text: "Cầm cốc trên tay, cô ta chỉ rình uống" },
    { time: 23.98, text: "Cô ta muốn anh tối nay ghì mình xuống" },
    { time: 25.75, text: "Để nhau làm thể chỉ là vì mình muốn" },
    { time: 29.39, text: "Shawty wanna fuck, những lúc cô đơn" },
    { time: 31.22, text: "Callin' my, called up my phone" },
    { time: 33.18, text: "Cho anh nghe em, ah-ah-ah-ah-ah-ah" },
    { time: 35.23, text: "Ah-ah-ah-ah-ah-ah" },
    { time: 36.78, text: "I just wanna link, now she want love" },
    { time: 38.65, text: "Things got real nhưng mà em hơi bớp" },
    { time: 40.43, text: "Sao mà anh lại cho là do anh không tốt?" },
    { time: 44.17, text: "Dã man, thật là dã man" },
    { time: 45.97, text: "Voodoo Voo như là Shaman" },
    { time: 47.95, text: "Đeo bịt mắt vào rồi, I just wanna fuck" },
    { time: 49.66, text: "Situationship này thật là quá toang" },
    { time: 51.56, text: "Dễ thôi, tháo ra, bốt đen, cùng với áo da" },
    { time: 55.25, text: "Va vào nhau để mình nhão ra" },
    { time: 57.06, text: "Những cảm xúc lại tuôn như là pháo hoa" },
    { time: 58.42, text: "Ah-ah-ah-ah, ah, ah, ah, ah, ah-ah-ah-ah" },
    { time: 64.09, text: "Ah-ah-ah-ah, ah, ah, ah, ah, ah-ah-ah-ah" },
    { time: 66.03, text: "Ah-ah-ah-ah-ah-ah-ah-ah" },
    { time: 71.45, text: "Ah-ah-ah" },
    { time: 73.64, text: "Cứ hôn thật lâu, nhỡ đâu lại yêu" },
    { time: 77.38, text: "Cứ chạm vào nhau (Lâu, lâu, hmm-hmm, lâu, lâu)" },
    { time: 80.94, text: "Cứ hôn thật lâu (Lâu, lâu), nhỡ đâu lại yêu" },
    { time: 84.52, text: "Cứ chạm vào nhau (Lâu, lâu, lâu, lâu, lâu, lâu)" },
    {
      time: 88.54,
      text: "Biết nhau còn cô đơn nhưng mà sao mà cô đơn, tò mò ít thôi",
    },
    {
      time: 91.9,
      text: 'Chẳng thể mãi là của nhau thì kêu tên của nhau, đặt cho nhau là "Mê Nhất Ở Trên Đời"',
    },
    {
      time: 95.58,
      text: "Chạm vào mắt hay vào môi, vào mông, vào hông lại càng trôi, quăng em nằm trên gối",
    },
    { time: 99.27, text: "Từng ngón tay em đan vào nhau, còn tay anh ở đâu?" },
    { time: 101.72, text: "Anh cho sâu vào em rồi" },
    { time: 103.13, text: "Cô ta kiêu ngạo với những gì mình có (Kiêu ngạo)" },
    { time: 105.32, text: "Anh ta nên cẩn thận điều đó" },
    { time: 106.81, text: "Keep it down, low, low, undercover" },
    { time: 110.59, text: "Thích đi cửa sau nên là chạy đường vòng" },
    {
      time: 112.41,
      text: "Cứ va vào nhau thôi một lần chẳng bõ (Va vào nhau)",
    },
    { time: 114.33, text: "Vậy thì lại bên nhau, just keep comin' up" },
    { time: 118.07, text: "Shawty wanna fuck, những lúc cô đơn" },
    { time: 119.85, text: "Callin' my, yeah, called up my phone" },
    { time: 121.62, text: "Cho anh nghe em, ah, ah-ah," },
    { time: 123.82, text: "ah-ah-ah-ah-ah-ah" },
    { time: 125.38, text: "I just wanna link, now she want love" },
    { time: 127.19, text: "Things got real nhưng mà em hơi bớp" },
    { time: 129.0, text: "Sao mà anh lại cho là do anh không tốt?" },
    { time: 130.83, text: "Sao mà anh lại cho là do anh không— (Uh)" },
    { time: 132.66, text: "Shawty wanna fuck, những lúc cô đơn" },
    { time: 134.66, text: "Callin' my, yeah, called up my phone" },
    { time: 136.5, text: "Shawty wanna uh-huh-uh-huh" },
    { time: 138.22, text: "Shawty wanna uh-huh-uh-huh" },
    { time: 140.08, text: "Shawty wanna fuck, những lúc cô đơn" },
    { time: 142.08, text: "Callin' my, yeah, called up my phone" },
    { time: 143.77, text: "Cho anh nghe em, ah, ah-ah, ah-ah-ah-ah-ah-ah" },
  ],
  "Mắt Môi Tay Chân (feat. Tage)": [
    {
      time: 28.61,
      text: "Mắt không thể nói dối, nàng có biết điều này không?",
    },
    {
      time: 31.28,
      text: "Môi không thể lên tiếng, nó đang tan ra trong phòng",
    },
    {
      time: 33.7,
      text: "Tay anh tạo ra mọi thứ trong đầu anh mơ, tâm anh mong",
    },
    {
      time: 36.05,
      text: "Đôi chân anh luôn đứng vững vì anh là một thằng đàn ông",
    },
    { time: 38.75, text: "2/3/99, có một vị vua tên là Hoàng Long" },
    {
      time: 41.15,
      text: "Được sinh ra ở thế giới biến mọi thứ, tất cả thành vàng ròng",
    },
    { time: 43.85, text: "Đi qua một vùng đất, nước đục chẳng còn trong" },
    {
      time: 46.48,
      text: "Đem lòng yêu một nàng thơ trong tim đêm ngày đợi mong",
    },
    { time: 48.92, text: "Nếu em không tin, xin được lấy con tim anh ra" },
    { time: 51.42, text: "Cho con tim vào khuôn nhẫn, đeo tay em coi như là" },
    { time: 53.93, text: "Tặng cho em bức thư cùng vài lời nhắn hơi qua loa" },
    { time: 56.58, text: "Tưởng gọi là bình yên, từng gọi là nhà" },
    {
      time: 58.93,
      text: "Đôi mắt này không thể nói dối, nàng có biết điều này không?",
    },
    {
      time: 61.3,
      text: "Đôi tai anh đang nghe tiếng, đôi môi đang tan ra trong phòng",
    },
    {
      time: 63.82,
      text: "Đôi tay này nếu không thể giữ em lại thì cứ vứt đi là xong",
    },
    {
      time: 66.43,
      text: "Em nhìn xuyên qua lớp da rồi nhìn xuyên qua được Hoàng Long",
    },
    {
      time: 68.99,
      text: "Mà chỉ là vài dòng chữ thôi mà anh cứ chờ đợi mãi một người",
    },
    {
      time: 71.58,
      text: "Anh sẽ phải đi tiếp thôi, tìm những thứ thuộc về anh",
    },
    {
      time: 73.86,
      text: "Hãy để dành lời xin lỗi đi, chỉ là đến lúc ta phải xa nhau rồi",
    },
    { time: 76.69, text: "Biển nhớ đến em, anh làm thành một bài thơ" },
    { time: 79.23, text: 'Gọi "Thuyền ơi", thuyền trả lời' },
    { time: 81.77, text: "Thuyền nhìn xa xăm, thuyền hiểu cả rồi" },
    { time: 84.36, text: "Bảo là rời đi nhưng mà chẳng thể rời" },
    { time: 86.75, text: "Nàng bảo đợi em, anh sẽ đợi cả đời" },
    { time: 89.03, text: "Nhưng nếu mắt không thấy thì con tim không nhớ" },
    { time: 91.85, text: "Đôi môi thôi không nói và tâm không trông chờ" },
    { time: 94.34, text: "Đôi chân như không tiến, đôi tay như buông thõng" },
    {
      time: 96.7,
      text: "Thời gian như đứng im thì liệu còn ai ngồi đợi mong?",
    },
    {
      time: 99.26,
      text: "Đôi mắt đã biết nói dối, nàng có biết điều này không?",
    },
    { time: 101.87, text: "Anh chẳng phải là vua, anh chẳng phải là rồng" },
    {
      time: 104.41,
      text: "Chỉ là một chàng trai có con tim làm bằng vàng ròng",
    },
    { time: 106.98, text: "Anh đã trao cho em mà em có biết điều này không?" },
    {
      time: 109.55,
      text: "Mắt không thể nói dối, liệu nàng có biết điều này không?",
    },
    {
      time: 112.01,
      text: "Tai đã không còn nghe rõ để mặc tiếng nấc ai kia trong vô vọng",
    },
    {
      time: 114.53,
      text: "Giơ ra đôi bàn tay trắng, chân bước lên con thuyền nhà rồng",
    },
    {
      time: 117.11,
      text: "Coi như là một kẻ vô tâm, anh cũng không nghĩ mình cần được cảm thông",
    },
    {
      time: 119.67,
      text: "Lao đầu vào cạm bẫy chỉ để muốn thấy được điều gì ở trong đấy",
    },
    {
      time: 121.99,
      text: "Rồi đưa nó ra khỏi tâm trí, những luồng suy nghĩ này cần được sàng lọc",
    },
    {
      time: 124.79,
      text: "Coi như tim này sắt đá, đôi chân này được làm bằng đồng",
    },
    {
      time: 127.29,
      text: "Ba anh dạy phải như thế mới được gọi là một thằng đàn ông",
    },
    {
      time: 129.42,
      text: "Nhưng thực ra anh chỉ mong mai này tự do cao bay xa chạy",
    },
    {
      time: 132.23,
      text: "Nói rằng tôi đang chỉ dạo chơi thôi, đâu cần phải chờ đợi",
    },
    {
      time: 134.68,
      text: "Có câu chuyện tuổi đôi mươi mà đôi khi ngỡ là cả đời người",
    },
    {
      time: 137.16,
      text: "Có dư vị của đôi môi mà đôi khi ngỡ chỉ mình tôi thôi",
    },
    {
      time: 139.64,
      text: "Chạm một tay lên làn da để lại vụt tan như giấc mơ",
    },
    {
      time: 142.31,
      text: "Bao đêm Sài Gòn chơ vơ mà sao anh tưởng là Hà Nội?",
    },
    { time: 144.99, text: "Tại sao chọn rời xa mà hôm nay lòng mình vẫn nhớ?" },
    { time: 147.72, text: "Mà thôi, anh không tìm câu trả lời" },
    {
      time: 149.98,
      text: "Mắt đã không thể nói dối, liệu nàng có biết điều này không?",
    },
    {
      time: 152.55,
      text: "Tai đã không còn nghe rõ để mặc tiếng nấc ai kia trong vô vọng",
    },
    {
      time: 155.02,
      text: "Giơ ra đôi bàn tay trắng, chân bước lên con thuyền nhà rồng",
    },
    {
      time: 157.51,
      text: "Coi như là một kẻ vô tâm, anh cũng không nghĩ mình cần được cảm thông",
    },
    {
      time: 160.02,
      text: "Mắt không thể nói dối, nàng có biết điều này không?",
    },
    {
      time: 162.69,
      text: "Môi không thể lên tiếng, nó đang tan ra trong phòng",
    },
    {
      time: 165.17,
      text: "Tay anh tạo ra mọi thứ trong đầu anh mơ, tâm anh mong",
    },
    {
      time: 167.45,
      text: "Đôi chân anh luôn đứng vững vì anh là một thằng đàn ông",
    },
    { time: 171.15, text: "Yeah-yeah" },
    { time: 173.61, text: "Yeah-yeah" },
  ],
  "Đao Của Anh Vừa": [
    { time: 0.14, text: "Sẽ không tin vào tình yêu thêm một lần nào nữa đâu" },
    { time: 6.52, text: "Vì lỡ mau tin vào tình yêu đã luôn mong cầu" },
    { time: 10.66, text: "Ah-ah, ah-ah, uh" },
    { time: 14.39, text: "You callin' me on my phone" },
    { time: 16.09, text: "Và nói là em muốn ra khỏi đây" },
    { time: 17.52, text: "Làm một hơi sâu, lồng ngực căng phồng" },
    { time: 19.29, text: "Bảo là thích hôn anh, đôi môi anh dày" },
    { time: 20.89, text: "Và xốc nhau lên ngay trong thang máy" },
    { time: 22.23, text: "Anh dẫn em yêu đi ra khỏi đây" },
    { time: 23.84, text: "Anh biết em đang đưa anh vào bẫy" },
    { time: 25.4, text: "Và anh biết em đang đưa anh vào—" },
    { time: 26.7, text: "Uh, uh, uh" },
    { time: 28.49, text: "Và anh biết em đang đưa anh vào—" },
    { time: 29.75, text: "Uh, uh, uh" },
    { time: 31.77, text: "Anh biết em đang đưa anh vào—" },
    { time: 33.02, text: "Uh, uh, uh" },
    { time: 35.02, text: "Và anh biết em đang đưa anh vào—" },
    { time: 36.1, text: "Yah, ah, ah" },
    { time: 38.56, text: "Ta như đang được sống" },
    { time: 39.98, text: "Em đến với nó đi" },
    { time: 41.51, text: "Cầm bút anh mà ghi" },
    { time: 42.44, text: "Xem con tim anh nó đang nói lên điều gì" },
    { time: 44.05, text: "Uh, uhm" },
    { time: 44.72, text: "Anh như đang được sống" },
    { time: 46.56, text: "Em xuống dưới đó đi" },
    { time: 48.05, text: "Em cuốn lấy nó đi" },
    { time: 48.97, text: "Giữ lấy nó đi" },
    { time: 49.74, text: "I'm fallin' in love" },
    { time: 50.49, text: "Fuck it, fall" },
    { time: 51.11, text: "Anh muốn có được nó" },
    {
      time: 53.25,
      text: "Anh muốn có tình yêu của em but I'm way too careful",
    },
    { time: 54.44, text: "Bởi cảm xúc anh rất to mà chẳng thể nào đo" },
    { time: 56.01, text: "Nhưng mà con tim anh bé nhỏ" },
    { time: 57.56, text: "Vậy tại sao nụ hôn này say mê mà làm anh bị gây tê" },
    { time: 59.29, text: "Yeah, I'm tryin' to focus" },
    { time: 60.61, text: "Và đừng thắp hy vọng trong anh" },
    { time: 61.72, text: "Tia nắng đó thật mong manh" },
    { time: 62.6, text: "Đừng lấy nó từ anh, em ơi, đâu cần" },
    { time: 63.85, text: "Anh như đang được sống" },
    { time: 65.49, text: "Em đã lấy nó đi" },
    { time: 66.76, text: "Em cuốn lấy nó đi" },
    { time: 67.64, text: "Em giữ lấy nó đi" },
    { time: 68.49, text: "Chẳng có những nghĩ suy" },
    { time: 70.14, text: "Em như đang được sống" },
    { time: 71.51, text: "Vì em đã lấy nó đi" },
    { time: 73.59, text: "Cất nó đi" },
    { time: 74.31, text: "Chìm xuống dưới đáy ly" },
    { time: 75.12, text: "Hay là ta tới đó đi" },
    { time: 75.95, text: "Uh, uh" },
    { time: 76.72, text: "Và khi ta làm xong" },
    { time: 77.99, text: "Chẳng muốn phải đợi mong" },
    { time: 79.47, text: "Cảm xúc này bẻ cong, em giữ nó ở trong" },
    { time: 81.11, text: "Tên anh vẫn là Hoàng Long" },
    { time: 82.57, text: "Và anh giữ những đường cong" },
    { time: 84.09, text: "Để anh đính lên hàm răng" },
    {
      time: 85.87,
      text: "Bọn họ muốn có được anh nhưng không thể chạm vào anh",
    },
    { time: 87.47, text: "Vào bộ răng anh vàng ròng, uh, uh" },
    { time: 89.22, text: "Và nó là vàng ròng" },
    { time: 89.99, text: "Tên trộm này ngu si, nó vẫn đi lòng vòng" },
    { time: 91.74, text: "Chạm được vào em, chẳng phải vứt đi là xong" },
    { time: 93.21, text: "Khi em ra đi em đã vẽ nên mùa đông" },
    { time: 94.73, text: "Giao em con tim, anh tự đưa anh vào còng" },
    { time: 96.42, text: "Vứt đi con tim, anh đang bơi đi ngược dòng" },
    { time: 97.94, text: "Chẳng thể làm cho anh quên đi một hình bóng" },
    { time: 99.5, text: "Hôn lên đôi môi anh làm cho anh lạnh cóng" },
    { time: 101.1, text: "Yeah-eh-eh" },
    { time: 103.3, text: "Vị lạc đà đầu môi đã khiến cho em nhung nhớ" },
    { time: 106.86, text: "Cảm nhận được qua phone, telephone call" },
    { time: 109.86, text: "Anh chỉ giữ cho em, uh-uh" },
    { time: 113.06, text: "Uh, yeah, uh, yeah, uh" },
  ],
  "Là Gì Của Nhau": [
    {
      time: 6.94,
      text: "Mỗi đêm tôi cười, cười một mình tôi cho đêm bớt đi lạnh vắng",
    },
    {
      time: 11.76,
      text: "Mỗi đêm tôi nhìn, nhìn từng cuộc vui, trong tôi xót xa ngàn nỗi",
    },
    { time: 16.09, text: "Rồi sẽ có lúc, tôi thôi rong chơi" },
    { time: 18.39, text: "Rồi sẽ có lúc, tim thôi đơn côi" },
    {
      time: 21.0,
      text: "Xót xa tôi nhìn, và tôi chợt thấy thương tôi, vô cùng",
    },
    { time: 26.69, text: "Rồi sẽ có lúc, tôi thôi rong chơi" },
    { time: 29.06, text: "Rồi sẽ có lúc, tim thôi đơn côi" },
    { time: 31.74, text: "Xót xa tôi nhìn, và tôi chợt thấy thương tôi, vô—" },
    { time: 54.79, text: "(Ayy, ah-ah, ayy, ah-ah)" },
    { time: 58.99, text: "(Ah-ah)" },
    { time: 60.23, text: '"Em là gì của anh?", em hỏi anh khi Mặt Trời rạng' },
    {
      time: 62.3,
      text: "Lần đầu tiên mà ta chạm môi, ta biết nhau còn hơn là bạn",
    },
    { time: 64.76, text: "Tín hiệu ta đã bắn cho nhau bay nhanh như là đạn" },
    {
      time: 67.09,
      text: "Anh không muốn thứ gì dài lâu, anh cũng không muốn đây là tạm",
    },
    { time: 69.87, text: "Hold on, little mama, đôi tay này đang dần sa đà" },
    {
      time: 72.09,
      text: "Không cần Louis Vui', không cần Gucci, không cần Prada",
    },
    {
      time: 74.54,
      text: "Anh cần thêm nụ hôn của em, hôn anh đi, little mama",
    },
    {
      time: 77.0,
      text: "Làm anh say như Hennessy, quyện vào anh y như là zaza",
    },
    {
      time: 79.61,
      text: "Không thể quên được anh đâu, không thể quên được, không thể quên được",
    },
    {
      time: 81.79,
      text: "Không còn cơ hội cho một ai đâu, không thể thêm được, không thể thêm được",
    },
    {
      time: 84.11,
      text: "Ngày mai là anh phải đi rồi, anh phải lên đường, anh phải đi",
    },
    {
      time: 86.52,
      text: "Chỉ còn mùi hương của anh là lưu ở trên giường, lưu ở trên giường",
    },
    {
      time: 89.1,
      text: "Liệu em còn nhớ về anh không? Hay là quên rồi? Em lại quên rồi?",
    },
    {
      time: 91.63,
      text: "Liệu trong em anh là thiên thần hay anh cũng chỉ là một tên tồi?",
    },
    {
      time: 93.95,
      text: "Liệu ta chỉ đang dạo chơi và đống cảm xúc này chỉ là game thôi?",
    },
    {
      time: 96.2,
      text: "Liệu anh có thay được em không, hay là em chỉ có một trên đời?",
    },
    { time: 98.82, text: "One time, two times, three times to the four" },
    {
      time: 101.32,
      text: "Wanna see you naked, put your panties on the floor",
    },
    {
      time: 103.35,
      text: "I'm a fuck you like I hate you nhưng mà hôn thì hôn thật lâu",
    },
    {
      time: 105.82,
      text: "Such a fuck boy when I'm sayin' that không thể quên được đâu",
    },
    {
      time: 108.16,
      text: "Yeah, one time, two times, three times to the four, yah",
    },
    { time: 110.8, text: "Như là ocean, anh sẽ bơi, nó quá là sâu" },
    {
      time: 113.09,
      text: "Làm anh quay lại ngay ngày mai đi, make me comin' back for more",
    },
    { time: 115.35, text: "Mút linh hồn của anh ra ngoài đi" },
    { time: 116.58, text: "Brain freeze, I don't know" },
    { time: 119.59, text: "I don't know, talk to me, babe" },
    { time: 123.85, text: "Talk to me, babe, uh-ah" },
    { time: 128.44, text: "Thế em là gì của anh?" },
    { time: 130.84, text: "Thế thì anh là gì của em?" },
    { time: 133.04, text: "Thế ta là gì của nhau?" },
    { time: 135.84, text: "Talk to me, babe" },
  ],
  "Night In Prague": [
    { time: 1.32, text: "Muốn đi, đi khắp nơi cả, cậu ấy" },
    { time: 6.83, text: "Muốn sáng tạo" },
    { time: 11.88, text: "Muốn là niềm cảm hứng của cậu luôn" },
    {
      time: 17.13,
      text: "Nhiều thứ lắm, mẹ, để mà nói câu chuyện muốn thì—",
    },
    { time: 24.8, text: "I don’t use to love before" },
    { time: 30.62, text: "I don’t use to love before" },
    { time: 34.43, text: "Có lẽ biết như thế thì đã không yêu" },
    { time: 36.68, text: "Cảm xúc đã không phiêu" },
    { time: 38.07, text: "Thổn thức biết bao đêm" },
    { time: 40.25, text: "Nghe xem con tim anh đặt điều" },
    { time: 46.59, text: "Có lẽ anh nên nghĩ ít hơn" },
    { time: 48.43, text: "Dùng cảm xúc ít hơn" },
    { time: 49.67, text: "Chắc là cũng phải lí trí hơn" },
    { time: 52.06, text: "Có lẽ chuyện này cũng chỉ là vui thôi" },
    { time: 54.15, text: "Chỉ là một trò chơi thôi, anh thua rồi" },
    {
      time: 58.43,
      text: "Ngồi lại và nghe cùng anh điệu valse cho sương rơi ướt mi",
    },
    {
      time: 61.45,
      text: "Chạm nhẹ làn môi của em vào anh, thật nhanh trước khi",
    },
    { time: 64.44, text: "Kim đồng hồ nhích sang bên và em, em bước đi" },
    {
      time: 67.41,
      text: "Chỉ còn lại có mỗi anh ngẩn ngơ, đến quên thời gian",
    },
    { time: 71.06, text: "Có mỗi anh ngẩn ngơ, quên thời gian" },
    { time: 74.27, text: "Có mỗi anh ngẩn ngơ, quên thời gian" },
    { time: 77.11, text: "Có biết anh ngẩn ngơ đến quên thời gian" },
    { time: 80.18, text: "Đừng để anh ngẩn ngơ" },
    {
      time: 145.75,
      text: "Có lẽ anh đã đúng khi vẫn yêu em, dù biết trước không nên, vì hình dáng ấy thân quen",
    },
    {
      time: 151.61,
      text: "Anh luôn sợ là một ngày ta (Anh luôn sợ là một—) lại phải rời xa, anh đau",
    },
    {
      time: 157.74,
      text: "Có lẽ anh nên nghĩ ít hơn, dùng bàn tay của anh chỉ để ôm lấy em",
    },
    {
      time: 163.31,
      text: "Anh biết em chẳng thể làm thinh với anh, bởi vì là anh cũng đang làm em phát điên",
    },
    {
      time: 169.47,
      text: "Vậy thì lại đan bàn tay vào nhau cho sương rơi ướt mi",
    },
    {
      time: 172.69,
      text: "Chạm nhẹ làn môi của ta vào nhau thật nhanh trước khi",
    },
    { time: 175.59, text: "Kim đồng hồ nhích sang bên và ta chẳng ai muốn đi" },
    { time: 178.59, text: "Và chẳng cần nói với nhau câu gì, cứ tan vào nhau" },
    { time: 182.12, text: "Nói với nhau câu gì, cứ tan vào nhau" },
    { time: 185.13, text: "Nói với nhau câu gì, cứ tan vào nhau" },
    { time: 187.98, text: "Chẳng cần nói với nhau, cứ tan vào nhau" },
    { time: 191.25, text: "Chẳng cần nói với nhau" },
  ],
  "Một Cái Ôm": [
    {
      time: 60.54,
      text: "Chỉ là một cái ôm chạm được vào linh hồn, chạm được vào anh, vào em",
    },
    {
      time: 63.84,
      text: "Chạm được vào nơi sâu nhất của cảm xúc, bắt những cảm xúc đó trào lên",
    },
    {
      time: 67.04,
      text: "Khi đi qua hết chỉ còn lại kỉ niệm sau bao nhiêu kiếp cũng không thể nào quên",
    },
    { time: 70.44, text: "Chưa bao giờ là có khoảng cách" },
    { time: 72.18, text: "Những đốm sáng của màn đêm" },
    {
      time: 73.54,
      text: "Anh đã khóc, anh đã khóc rất nhiều, anh căm ghét sự nổi tiếng, không thích mình nổi lên",
    },
    {
      time: 76.81,
      text: "Anh đã khóc, anh đã khóc rất nhiều, luôn là khóe mắt trái, anh hy vọng nó đổi bên",
    },
    {
      time: 80.07,
      text: "Anh đã khóc, anh đã khóc rất nhiều, anh muốn là vĩnh cửu chứ không phải nhớ rồi quên",
    },
    { time: 83.32, text: "Anh đã khóc, anh đã khóc thật nhiều, woah" },
    { time: 86.62, text: "Uh, có những thứ anh biết anh nên buông" },
    { time: 88.34, text: "Anh nghĩ mình mạnh mẽ khi chọn giữ lại" },
    {
      time: 90.26,
      text: "Đôi khi chỉ là còn yêu, nên mặt anh dày và anh đéo biết đến chữ ngại",
    },
    {
      time: 93.47,
      text: "Muốn được một lần làm trẻ con, và có vẻ như thế sẽ khỏe hơn",
    },
    {
      time: 96.79,
      text: "Ngu si thì hưởng thái bình, anh nhường cho người khác làm kẻ khôn",
    },
    { time: 99.78, text: "Muốn móc con tim anh ra để treo thưởng" },
    { time: 101.42, text: "Anh bắt buộc phải đi ngược vào trong" },
    { time: 103.22, text: "Đứng dưới hàng triệu những đốm sáng" },
    { time: 104.58, text: "Có một cậu bé tên là Nghiêm Vũ Hoàng Long" },
    { time: 106.48, text: "Cậu bé này làm cho anh có động lực" },
    { time: 108.0, text: "Làm nốt những thứ cần được làm xong" },
    { time: 109.6, text: "Nhưng anh vẫn chưa làm được gì cho nó" },
    { time: 111.36, text: "Và những người muốn có anh ngày càng đông" },
    { time: 113.13, text: "Lãng du anh tìm kiếm tình yêu" },
    { time: 114.56, text: "Anh quên mất là nó ở trong anh" },
    {
      time: 116.42,
      text: "Chạy ở trong từng nốt nhạc, trong đám mây ngày tiết trời trong xanh",
    },
    {
      time: 119.55,
      text: "Ở trong đồng tiền mà anh kiếm, anh đếm nó xong và cảm thấy mình xông xênh",
    },
    {
      time: 122.85,
      text: "Anh thấy nó ở trong em, đôi mắt em như mặt hồ long lanh",
    },
    { time: 126.18, text: "Anh đi rồi anh ngã, rồi anh đứng dậy" },
    { time: 127.67, text: "Những niềm đau của anh thôi đành phải cất lại" },
    { time: 129.36, text: "Anh đã quen với chiến thắng? Đúng vậy" },
    { time: 131.07, text: "Vì anh yêu giọt nước mắt những lần thất bại" },
    { time: 132.77, text: "Anh đi rồi anh ngã, rồi anh đứng dậy" },
    { time: 134.12, text: "Những niềm đau của anh thôi đành phải cất lại" },
    { time: 135.92, text: "Anh đã quen với chiến thắng? Đúng vậy" },
    { time: 137.55, text: "Vì anh yêu giọt nước mắt những lần thất bại" },
    {
      time: 139.44,
      text: "Chỉ là một cái ôm chạm được vào linh hồn, chạm được vào anh, vào em",
    },
    {
      time: 142.79,
      text: "Chạm được vào nơi sâu nhất của cảm xúc, bắt những cảm xúc đó trào lên",
    },
    {
      time: 145.95,
      text: "Khi đi qua hết chỉ còn lại kỉ niệm sau bao nhiêu kiếp cũng không thể nào quên",
    },
    { time: 149.39, text: "Chưa bao giờ là có khoảng cách" },
    { time: 150.92, text: "Những đốm sáng của màn đêm" },
    {
      time: 152.68,
      text: "Chỉ là một cái ôm chạm được vào linh hồn, chạm được vào anh, vào em",
    },
    {
      time: 155.93,
      text: "Chạm được vào nơi sâu nhất của cảm xúc, bắt những cảm xúc đó trào lên",
    },
    {
      time: 159.28,
      text: "Khi đi qua hết chỉ còn lại kỉ niệm sau bao nhiêu kiếp cũng không thể nào quên",
    },
    { time: 162.45, text: "Chưa bao giờ là có khoảng cách" },
    { time: 164.03, text: "Những đốm sáng của màn đêm" },
  ],
  Liệm: [
    { time: 22.69, text: "Anh đã nói quá nhiều về tình yêu" },
    { time: 24.98, text: "Nhưng lại chẳng biết anh muốn điều gì từ tình yêu" },
    { time: 26.82, text: "Và đã có những vết cắt rất sâu, nhắc anh bao điều" },
    { time: 30.02, text: "Đừng có tin khi con tim này còn phiêu" },
    { time: 32.58, text: "Ừ thì viết nốt lần này thôi" },
    { time: 34.78, text: "Chẳng thể để cảm xúc cứ mãi tồn đọng ở bờ môi" },
    { time: 36.8, text: "Và anh sẽ xóa hết những thước phim khi em đi xa rồi" },
    { time: 39.71, text: "Chẳng còn đớn đau, chỉ là do con tim anh rã rời" },
    { time: 41.86, text: "Thêm một party, thêm một ly on the weekend" },
    { time: 46.83, text: "Vậy đừng đỡ anh ra khỏi đây, anh đang say mèm" },
    { time: 51.86, text: "Anh chẳng biết thế nào là tốt đâu" },
    { time: 53.42, text: "Anh đang đi tìm chính mình" },
    { time: 54.65, text: "Giết em luôn, không để cho em thay đổi tính tình" },
    {
      time: 57.15,
      text: "Fuck all the bitches, không thể tin, không thể phiêu được",
    },
    { time: 59.58, text: "I got no chill dù anh trip hơi sâu, eh-eh-eh-eh" },
    { time: 63.97, text: "Và thế nào là một thằng đàn ông?" },
    { time: 66.36, text: "Là phải giang tay và ôm em vào lòng?" },
    {
      time: 69.07,
      text: "Sẽ trao cho em bao nụ hôn",
    },
    { time: 71.36, text: "Dù là chẳng còn lại gì ở bên trong?" },
    { time: 73.92, text: "Và nếu cho anh quay ngược thời gian" },
    { time: 76.31, text: "Anh sẽ yêu em như là yêu một người bạn" },
    { time: 78.85, text: "Như cách em đã từng yêu một người bạn (Yeah)" },
    {
      time: 81.25,
      text: "Yeah, yeah, vậy đừng có nói quá nhiều về tình yêu (Nói quá nhiều về tình yêu)",
    },
    {
      time: 84.78,
      text: "Như là mình biết tất cả mọi chuyện về tình yêu (Hah-uh-huh)",
    },
    { time: 86.95, text: "Đã có những vết cắt rất sâu, nhắc anh bao điều" },
    {
      time: 89.99,
      text: "Đừng có tin khi con tim này còn phiêu (Huh-huh-huh)",
    },
    { time: 92.32, text: "Và anh chỉ viết nốt lần này thôi" },
    { time: 94.68, text: "Chẳng thể để cảm xúc cứ mãi tồn đọng ở bờ môi" },
    {
      time: 96.83,
      text: "Và anh sẽ xóa hết những thước phim khi em đi xa rồi",
    },
    { time: 99.78, text: "Chẳng còn gì nữa đâu bởi vì con tim anh rã rời" },
    { time: 102.45, text: "Ah, hết rồi (Huh), anh chưa từng nghĩ ngợi" },
    { time: 105.23, text: "Hãy để, cho anh được nghỉ ngơi" },
    { time: 107.87, text: "Nói hết, ra những lời trong lòng" },
    { time: 110.37, text: "Hiên ngang không quan tâm ai quy tội" },
    {
      time: 112.65,
      text: "Trào lên bao nhiêu nghi ngờ vùi dập đi những khúc ca tình (Những khúc ca)",
    },
    {
      time: 115.16,
      text: "Cảm ơn vì những bài học này làm cho anh nhận ra mình (Hah-hah)",
    },
    {
      time: 117.56,
      text: "Em làm đúng những thứ anh suy luận giờ đã sáng tỏ khung hình",
    },
    {
      time: 120.15,
      text: "Và bước đi anh cần tôn trọng thằng đàn ông ở trong mình, yeah-eh",
    },
    { time: 127.46, text: "Eh-eh" },
    { time: 132.43, text: "Eh-eh" },
    { time: 137.59, text: "Eh-eh, eh-eh" },
    { time: 141.13, text: "Uh-uh" },
    { time: 142.55, text: "Mọc đâu ra cây hoa ở ngoài hiên nhà" },
    { time: 144.94, text: "Mong cho hoa đưa hương bay thật xa" },
    { time: 147.28, text: "Anh đã cảm thấy nơi đây như là thiên đường" },
    { time: 149.83, text: "Mặc người đời nói rằng anh điêu toa" },
    { time: 152.32, text: "Ngân nga câu hát ta và hoa đã từng đắm chìm" },
    { time: 154.94, text: "Nhưng anh biết, không phải bông hoa của riêng anh" },
    { time: 157.4, text: "Và nếu anh muốn, chắc chắn anh sẽ làm" },
    { time: 160.08, text: "Anh đủ yêu hoa để anh rời xa" },
    { time: 162.87, text: "Nói, về tình yêu" },
    { time: 164.92, text: "Mà chẳng biết, về tình yêu" },
    { time: 167.13, text: "Cắt rất sâu, bao điều" },
    { time: 170.02, text: "Đừng tin khi tim còn phiêu" },
    { time: 172.81, text: "Viết, lần này thôi" },
    { time: 175.09, text: "Cảm xúc, đọng bờ môi" },
    { time: 177.41, text: "Xóa phim, đi xa rồi" },
    { time: 180.03, text: "Đớn đau, tim rã rời, yeah" },
    {
      time: 182.47,
      text: "Vậy đừng có nói quá nhiều về tình yêu (Quá nhiều về tình yêu)",
    },
    {
      time: 184.95,
      text: "Như là mình sẽ mãi mãi luôn bên nhau (Huh-huh)",
    },
    { time: 186.52, text: "Anh không bao giờ chạm vào nữa đâu" },
    {
      time: 189.32,
      text: "(Nhưng tại sao mà anh lại tin khi con tim này còn phiêu, uh-huh)",
    },
    { time: 192.18, text: "(Trao cho ai nhờ?)" },
    { time: 192.59, text: "Anh chỉ viết nốt lần này (Viết nốt lần này)" },
    { time: 195.3, text: "(Viết nốt lần này)" },
    {
      time: 196.23,
      text: "Chẳng còn cách nào có thể xóa được những buồn phiền khi em đi xa rồi",
    },
    {
      time: 199.76,
      text: "Chẳng còn đớn đau chẳng còn phù hợp (Uh-huh) thì giữ lại làm gì",
    },
    { time: 211.96, text: "(Em đừng nói gì với tình yêu nữa)" },
    { time: 214.99, text: "(Anh nghe chán rồi, yeah)" },
    { time: 219.82, text: "(Em đừng nói gì với tình yêu nữa)" },
  ],
  "Nếu Như Ta Chẳng Còn (feat. A$AP Ướt Mi)": [
    { time: 27.8, text: "Vẫn luôn là anh bây giờ" },
    { time: 30.46, text: "Muốn nói với em sau này" },
    { time: 32.89, text: "Rằng dẫu có dối gian, em đừng" },
    { time: 35.67, text: "Trách than mùa đông đã làm ta tan vỡ" },
    { time: 38.29, text: "Vẫn luôn là anh nói câu giã từ muộn màng" },
    { time: 43.84, text: "Lòng giá băng, anh nhìn lại, tình đã xa" },
    {
      time: 48.6,
      text: "Và thật ra anh nhớ em sau đêm hôm qua vì anh tin lời yêu đó mà",
    },
    {
      time: 54.31,
      text: "Làm ơn đừng cho nỗi buồn tìm anh thêm một lần nào nữa",
    },
    {
      time: 59.19,
      text: "Nếu như ta chẳng còn quấn lấy nhau vì tình yêu làm cho ta héo mòn",
    },
    { time: 64.82, text: "Hẹn ước khi xưa không thành thì trách ai bây giờ?" },
    {
      time: 69.62,
      text: "Nếu mai sau này nhớ đến nhau, quay về giây phút đầu",
    },
    { time: 75.3, text: 'Hãy nói với anh "Ở bên nhau, đừng rời xa nữa"' },
    { time: 80.03, text: "Nếu em vô tình nhớ đến anh, đừng hát về anh" },
    { time: 85.85, text: "Coi anh như câu ca buồn trong giấc mơ thôi" },
    { time: 111.8, text: "Lá đã thay màu, sao vẫn không thôi mong đợi?" },
    { time: 116.52, text: "Vẫn luôn là anh, vẫn đi tìm em ở trong quá khứ" },
    {
      time: 122.32,
      text: "Đi tìm lại giấc mơ đã trao trong buổi chiều nát tan",
    },
    { time: 126.95, text: "Khi em đi, anh biết giấc mơ sẽ không ở lại" },
    {
      time: 132.13,
      text: "Chiều mưa vắng, thoáng bóng hình ở trên phố quen thuộc như ngày nào",
    },
    { time: 138.06, text: "Có khi nào ta lại được nhìn thấy nhau?" },
    {
      time: 142.6,
      text: "Nếu mai sau này nhớ đến nhau, quay về giây phút đầu",
    },
    { time: 148.5, text: 'Hãy nói với anh "Ở bên nhau, đừng rời xa nữa"' },
    { time: 153.05, text: "Nếu em vô tình nhớ đến anh, đừng hát về anh" },
    { time: 158.99, text: "Coi anh như câu ca buồn trong giấc mơ thôi" },
    {
      time: 185.79,
      text: "Trong giấc mơ thôi, trong giấc mơ thôi, coi anh như câu ca buồn",
    },
    {
      time: 190.95,
      text: "Trong giấc mơ thôi, trong giấc mơ thôi, coi anh như câu ca buồn",
    },
    {
      time: 196.14,
      text: "Trong giấc mơ thôi, trong giấc mơ thôi, coi anh như câu ca buồn",
    },
    {
      time: 201.34,
      text: "Trong giấc mơ thôi, trong giấc mơ thôi, coi anh như câu ca buồn",
    },
    {
      time: 206.54,
      text: "Trong giấc mơ thôi, trong giấc mơ thôi, coi anh như câu ca buồn",
    },
    { time: 211.74, text: "Trong giấc mơ thôi" },
    {
      time: 216.98,
      text: "Trong giấc mơ thôi, trong giấc mơ thôi, coi anh như câu ca buồn",
    },
    {
      time: 222.24,
      text: "Trong giấc mơ thôi, trong giấc mơ thôi, coi anh như câu ca buồn",
    },
    { time: 227.41, text: "Trong giấc mơ thôi, coi anh như câu ca buồn" },
    { time: 232.67, text: "Trong giấc mơ thôi" },
    {
      time: 239.72,
      text: "Nếu mai sau này nhớ đến nhau, quay về giây phút đầu",
    },
    { time: 245.52, text: 'Hãy nói với anh "Ở bên nhau, đừng rời xa nữa"' },
    { time: 250.14, text: "Nếu em vô tình nhớ về anh, đừng hát về anh" },
    { time: 256.06, text: "Coi anh như câu ca buồn trong giấc mơ" },
    {
      time: 260.67,
      text: "Nếu mai sau này nhớ đến nhau, quay về giây phút đầu",
    },
    { time: 266.49, text: 'Hãy nói với anh "Ở bên nhau, đừng rời xa nữa"' },
    { time: 271.28, text: "Nếu em vô tình nhớ về anh, đừng hát về anh" },
    { time: 276.92, text: "Coi anh như câu ca buồn trong giấc mơ thôi" },
    {
      time: 282.82,
      text: "Sẽ có một ngày những nỗi đau không còn như lúc đầu (Không còn anh và em ngày trước)",
    },
    { time: 288.68, text: "Thôi không mong đợi và sẽ không tìm về anh nữa" },
    { time: 293.28, text: "Nếu đã vô tình nhớ đến em, đừng nói về em" },
    { time: 299.1, text: "Xem em như bao người từng bước qua anh thôi" },
  ],
  "Ai Mới Là Kẻ Xấu Xa": [
    { time: 0.31, text: "Thì thôi ta chia đôi" },
    { time: 2.97, text: "Anh cũng không muốn OD" },
    { time: 5.4, text: "Buồn vì những lời tổn thương" },
    { time: 8.15, text: "Mà ta đã gửi đến nhau" },
    { time: 10.24, text: "Yeah, yeah" },
    { time: 10.95, text: "Thì thôi ta chia đôi" },
    { time: 13.57, text: "Anh cũng không muốn OD" },
    { time: 16.27, text: "Buồn vì những lời tổn thương" },
    { time: 18.84, text: "Mà ta đã gửi đến nhau" },
    { time: 20.97, text: "Trong suốt bao nhiêu lâu qua" },
    { time: 23.97, text: "Dồn hết tâm tư vào câu ca" },
    { time: 26.78, text: "Rồi họ bảo rằng anh xấu xa" },
    { time: 29.33, text: "Nhưng ai mới là kẻ xấu xa?" },
    { time: 31.53, text: "Em nói cho anh nghe đi" },
    { time: 34.88, text: "Giận hờn buông trên khóe mi" },
    { time: 37.66, text: "Em nói em sẽ đi" },
    { time: 40.22, text: "Em nói em sẽ đi" },
    { time: 43.27, text: "Baby, em sẽ quên rằng ta từng êm đềm" },
    { time: 45.82, text: "Quên rằng khi trời khuya đường lên đèn" },
    { time: 48.56, text: "Hôn vào môi làm môi nàng thêm mềm" },
    { time: 51.1, text: "Xem hạt mưa nhẹ rơi ở bên thềm" },
    { time: 53.97, text: "Anh nhẹ đan tay vào tay nàng" },
    { time: 56.53, text: "Im lặng lâu đổi ra một khay vàng" },
    { time: 59.26, text: "Xuyên màn đêm, tăng gas thay làn" },
    { time: 61.86, text: "Run away là cách mà ta hay làm" },
    { time: 64.31, text: "Thì thôi ta chia đôi" },
    { time: 66.89, text: "Anh cũng không muốn OD" },
    { time: 69.43, text: "Buồn vì những lời tổn thương" },
    { time: 72.12, text: "Mà ta đã gửi đến nhau" },
    { time: 74.07, text: "Trong suốt bao nhiêu lâu qua" },
    { time: 77.32, text: "Dồn hết tâm tư vào câu ca" },
    { time: 80.03, text: "Rồi họ bảo rằng anh xấu xa" },
    { time: 82.54, text: "Nhưng ai mới là kẻ xấu xa?" },
    { time: 84.83, text: "Em nói cho anh nghe đi" },
    { time: 88.59, text: "Cho anh nghe đi" },
    { time: 91.19, text: "Cho anh nghe đi" },
    { time: 93.79, text: "Cho anh nghe đi" },
    { time: 96.36, text: "Mình kéo nhau về những câu chuyện" },
    { time: 99.16, text: "Vết thương lòng, uhm, là vết nhanh liền" },
    { time: 101.73, text: "Em muốn anh là chàng nghệ sĩ đa tài" },
    { time: 104.24, text: "Cuộc sống bên ngoài, yuh, họ thấy anh phiền" },
    { time: 107.14, text: "Anh không muốn bước ra ngoài kia" },
    { time: 109.53, text: "Phải quên đi giông bão, cùng mấy vại bia" },
    { time: 112.37, text: "Và sâu trong tâm trí, chỉ có em và anh" },
    { time: 114.98, text: "Vậy sao em quay đi? Tại sao em quay đi?" },
    { time: 117.6, text: "Thì thôi ta chia đôi" },
    { time: 120.14, text: "Anh cũng không muốn OD" },
    { time: 122.8, text: "Buồn vì những lời tổn thương" },
    { time: 125.57, text: "Mà ta đã gửi đến nhau, yeah" },
    { time: 128.36, text: "Thì thôi ta chia ly" },
    { time: 130.67, text: "Đừng để lệ vương trên khoé mi" },
    { time: 133.67, text: "Em nói em phải đi" },
    { time: 136.23, text: "Em nói em phải đi" },
    { time: 141.9, text: "Uh-huh" },
    { time: 160.63, text: "Thì thôi ta chia đôi" },
    { time: 162.8, text: "Anh cũng không muốn OD" },
    { time: 165.52, text: "Buồn vì những lời tổn thương" },
    { time: 168.13, text: "Mà ta đã gửi đến nhau" },
    { time: 170.24, text: "Trong suốt bao nhiêu lâu qua" },
    { time: 173.34, text: "Dồn hết tâm tư vào câu ca" },
    { time: 176.11, text: "Rồi họ bảo rằng anh xấu xa" },
    { time: 178.76, text: "Nhưng ai mới là kẻ xấu xa?" },
    { time: 181.28, text: "Em nói cho anh nghe đi" },
  ],
  "Slippery (feat. Tùng Dương)": [
    { time: 12.54, text: "Chúng mày thì biết cái đéo gì về tao" },
    { time: 15.62, text: "Rockstar made, tao đéo ngại thằng nào" },
    { time: 18.77, text: "Da vàng trẻ, tao nhét tiền vào bao" },
    { time: 21.48, text: "Cho đến khi tao chết, tao vẫn lowkey flex" },
    { time: 22.96, text: "Đừng nói về đời tao, bởi vì tao không thích" },
    { time: 24.69, text: "Yeah, yeah, yeah, tao không thích" },
    { time: 27.77, text: "Yeah, yeah, yeah, tao không—" },
    { time: 30.45, text: "Yeah, yeah, yeah, tao không thích" },
    { time: 33.49, text: "Yeah, yeah, yeah" },
    { time: 35.84, text: "Tao không thích mấy thằng hai mặt đâu, bitch" },
    { time: 37.92, text: "Tao sẽ không gặp đâu, bitch" },
    { time: 39.62, text: "Trái Tim Chrome outfit, trái Tim Chrome outfit" },
    {
      time: 42.68,
      text: "Yeah, tao bước đi vào pit, yeah, tao bước đi vào pit",
    },
    { time: 45.68, text: "Mấy cô em trông lit, mấy quả cảnh sâu tít" },
    {
      time: 71.95,
      text: "Tao đang thích nghi, nó quá slippery, cả người tao trơn trượt",
    },
    {
      time: 74.86,
      text: "Yeah, tao thích bay dưới những đám mây, đéo thể nào cao hơn được",
    },
    { time: 77.56, text: "Mày muốn respect của tao?" },
    { time: 78.65, text: "Muốn trust của tao?" },
    { time: 79.51, text: "Thử dành lấy đi bố mày xem nào" },
    {
      time: 80.87,
      text: "N0L4B3L là công ty riêng, mấy thằng ngoài kia đừng cố mà xen vào",
    },
    {
      time: 83.61,
      text: "Bởi vì tao không thích mấy thằng hai mặt đâu, bitch",
    },
    { time: 86.07, text: "Tao sẽ không gặp đâu, bitch" },
    { time: 87.64, text: "Trái Tim Chrome outfit, trái Tim Chrome outfit" },
    {
      time: 90.78,
      text: "Yeah, tao bước đi vào pit, yeah, tao bước đi vào pit",
    },
    { time: 93.81, text: "Mấy cô em trông lit, mấy quả cảnh sâu tít" },
    { time: 96.74, text: "Way, way, way, way, way, way" },
    { time: 102.03, text: "Tao không thích mấy thằng hai mặt đâu, bitch" },
    { time: 117.71, text: "Tao không thích mấy thằng hai mặt đâu, bitch" },
    { time: 120.16, text: "Tao sẽ không gặp đâu, bitch" },
    { time: 122.06, text: "Trái Tim Chrome outfit, trái Tim Chrome outfit" },
    {
      time: 125.26,
      text: "Yeah, tao bước đi vào pit, yeah, tao bước đi vào pit",
    },
    { time: 128.71, text: "Mấy cô em trông lit, mấy quả cảnh sâu tít" },
    { time: 157.17, text: "Mẹ ơi, dưới đất trời con cúi lạy" },
    { time: 170.82, text: "Trên đỉnh núi cao, chơi vơi quá" },
    { time: 176.99, text: "Trong vô định, con tìm về nơi bắt đầu" },
    {
      time: 182.93,
      text: "Thích như nào, thích như nào, thích như nào, như nào? Huh?",
    },
    {
      time: 185.73,
      text: "Cách số phận lôi tao vào rap game này, tao bước ra đằng trước, huh-huh",
    },
    { time: 188.78, text: "Tham vọng lan khắp phòng, uh-huh" },
    { time: 192.49, text: "Từng đường nét chroma, chroma" },
    { time: 193.0, text: "Từng đường nét chroma, chroma" },
    { time: 194.52, text: "Tao không thích mấy thằng hai mặt đâu, bitch" },
    { time: 196.62, text: "Tao sẽ không gặp đâu, bitch" },
    { time: 197.82, text: "Trái Tim Chrome outfit, chrome outfit" },
    {
      time: 201.4,
      text: "Yeah, tao bước đi vào pit, yeah, tao bước đi vào pit",
    },
    { time: 204.49, text: "Mấy cô em trông lit" },
    { time: 206.37, text: "Tao không thích mấy thằng hai mặt đâu, bitch" },
  ],
  Interpol: [
    { time: 0.5, text: "(MCK, MCK, MCK)" },
    { time: 2.0, text: "Đứng ở dưới thì nhảy mạnh lên" },
    { time: 4.0, text: "Ai sợ thì đi về" },
    { time: 6.5, text: "Dân mạng vô cùng bức xúc trước lời chia sẻ của MCK" },
    {
      time: 10.0,
      text: "Thậm chí, thái độ bị cho là đang thách thức khán giả",
    },
    {
      time: 13.5,
      text: "(Tin tức: MCK vấp phải nhiều lời chỉ trích đang dành cho nam rapper)",
    },
    { time: 17.0, text: "(Đề cập, Phát Thanh Truyền Hình cũng đã đề cập…)" },
    { time: 19.5, text: "MCK vẫn bị chê nhạc dở" },
    { time: 21.5, text: "Phát ngôn, hành động của MCK" },
    { time: 23.5, text: "Vẫn bị… vẫn bị…" },
    { time: 25.0, text: "Ngông trên sân khấu" },
    { time: 26.5, text: "Bị tố…" },
    { time: 28.0, text: "Tự dưng nhiều view thế nhở" },
    { time: 30.0, text: "Nổi tiếng… nhiều view…" },
    { time: 32.0, text: "That’s my mo’fucking ninja, MCK, man" },
    {
      time: 34.5,
      text: "Top một trending, và được chương trình giải trí với công chúng",
    },
    { time: 37.5, text: "(Địt mẹ nó flow đỉnh vãi lồn)" },
    { time: 39.0, text: "MCK đã đánh bại HIEUTHUHAI" },
    { time: 41.0, text: "(Lồn)" },
    { time: 42.5, text: "Rapper “Ai sợ thì đi về”" },
    { time: 44.5, text: "Đã thuộc… của MCK (thì người đấy có quyền)" },
    { time: 47.0, text: "What I’m talking about, G" },
    {
      time: 48.5,
      text: "That shit slap, that shit tough, that shit hard, that shit, ah",
    },
    { time: 51.0, text: "Thì mình có giải thưởng dành cho…" },
    { time: 52.5, text: "99%, MCK" },
  ],
  "Tây Thi": [
    { time: 0.04, text: "Tên tao là gì?" },
    { time: 1.9, text: "MCK" },
    { time: 3.09, text: "Tên tao là gì?" },
    { time: 5.12, text: "MCK" },
    { time: 6.28, text: "Tên tao là gì?" },
    { time: 8.35, text: "MCK" },
    { time: 9.42, text: "Tên tao là gì?" },
    { time: 11.51, text: "MCK" },
    { time: 12.72, text: "Anh Long, em fan anh, em xin kiểu ảnh" },
    { time: 15.89, text: "Anh Long, em fan anh, em xin kiểu ảnh" },
    { time: 19.17, text: "Anh Long, em fan anh, em xin kiểu ảnh" },
    { time: 22.25, text: "Anh Long, em fan anh, em xin kiểu ảnh" },
    {
      time: 25.14,
      text: "Uh, trốn tránh cái trách nhiệm này quá lâu nên truyền thông rất thích săn đuổi",
    },
    {
      time: 29.01,
      text: "Cạn chén nếu mà mày là fan tao bất kể ngành nghề hay là năm tuổi",
    },
    {
      time: 32.25,
      text: "Thả cả nếu mà đấy là anh em, tần số trở nên nó đéo thể ngăn nổi",
    },
    {
      time: 35.5,
      text: "Thông minh và không ăn xổi, chung sở thích là làm, làm tài khoản nhân đôi",
    },
    { time: 38.98, text: "Tao làm việc của tao (Kiếm tiền, kiếm tiền)" },
    { time: 40.57, text: "Hi vọng là mày thích nó" },
    { time: 42.18, text: "Đừng nói về thành công (Về tao)" },
    { time: 43.44, text: "Mày vẫn chưa chạm tới cái đích đó" },
    { time: 45.38, text: "Mày thấy nó giống cái vòng vàng á?" },
    { time: 46.92, text: "Tao lại tưởng nó là cái xích chó" },
    { time: 47.95, text: "Ai để mày đi lung tung ngoài đường này?" },
    { time: 49.46, text: "Xích vô, xích vô, xích vô, xích vô" },
    { time: 51.61, text: "Khi tao pull up, pull up (Pull up)" },
    { time: 53.25, text: "Gái phải đẹp như Tây Thi" },
    { time: 54.95, text: 'Bảo là, "Em xinh quá đi" (Quá ngon)' },
    { time: 56.53, text: '"Wanna be my lady?"' },
    { time: 58.08, text: "Có thể gọi anh là bố" },
    { time: 59.64, text: "Hoặc gọi anh là baby" },
    { time: 61.09, text: "Mấy thằng ngoài kia ý kiến cái con cặc" },
    { time: 63.02, text: "Fuck you, pay me" },
    {
      time: 64.64,
      text: "Bố mày đéo gang, bố mày đéo gang, bố mày đéo gang, đéo phải gang, gang",
    },
    {
      time: 67.79,
      text: "Phong cách người chơi là chất chơi người dơi, chúng nó bảo tao là vamp, vamp",
    },
    {
      time: 70.85,
      text: "Bắt được con vợ ở Hàng Chiếu xong tao bảo nó làm điếu bởi thấy nó có vẻ quen quen",
    },
    {
      time: 73.94,
      text: "Nếu mà không phải thì thôi nhớ, dạo này mắt anh hơi bị lem nhem",
    },
    {
      time: 77.03,
      text: "Không thể hiểu rõ được nhân tình thế thái, đôi khi vạch dái vào chân mình cứ thế đái",
    },
    {
      time: 80.79,
      text: "Chúng nó muốn có chỗ đứng còn tao thì mỏi rồi, cho tao tìm cái ghế cái",
    },
    { time: 83.65, text: "Đừng có cap, cap, cap, cap, cap" },
    { time: 85.05, text: "Bố mày đéo tin, đéo phải loại dễ dãi" },
    { time: 86.77, text: "Thôi tao đi về đây, trông tao bễ vãi" },
    { time: 88.32, text: "Nếu là công việc, thôi cứ để mai" },
    { time: 90.01, text: "Khi tao pull up, pull up (Pull up)" },
    { time: 91.71, text: "Gái phải đẹp như Tây Thi" },
    { time: 93.24, text: 'Bảo là, "Em xinh quá đi" (Quá ngon)' },
    { time: 94.86, text: '"Wanna be my lady?"' },
    { time: 96.52, text: "Có thể gọi anh là bố" },
    { time: 98.02, text: "Hoặc gọi anh là baby (Baby)" },
    { time: 99.43, text: "Mấy thằng ngoài kia ý kiến cái con cặc" },
    { time: 101.41, text: "Fuck you, pay me" },
    { time: 102.77, text: "Hay là như này nhở?" },
  ],
  "Hút và Hút": [
    { time: 4.44, text: "(Tùng ơi)" },
    { time: 7.46, text: "MCK, MCK, MCK" },
    { time: 10.77, text: "Hi-hi-hi, MCK, MCK (Chyeah)" },
    { time: 17.29, text: "Yeah, ah-ah-ah, yeah" },
    {
      time: 19.28,
      text: "Không động tay vào phone nhưng tao vẫn biết là mấy giờ, yeah",
    },
    {
      time: 22.22,
      text: "Xuất hiện trên mặt báo hàng trăm tờ raw paper, yeah",
    },
    { time: 25.32, text: "Money rơi vào túi, tao gạt tay vào fader, yeah" },
    {
      time: 28.48,
      text: "Ôm mặt chơi đi mà, chơi đi mà, okay, okay vãi lờ, yeah",
    },
    {
      time: 31.48,
      text: "Quen với những thứ tao có, những lời khen này, ôi-ồ-ôi",
    },
    {
      time: 34.11,
      text: "Phải làm sao để cho con số nó không tăng lên nữa, ôi-ồ-ôi, yeah",
    },
    {
      time: 37.6,
      text: "Tao chỉ hút và hút thôi không cần xem là mấy giờ, ah",
    },
    { time: 40.76, text: "Tao chỉ flow một tí mà okay vãi lồn thế nhờ, yeah" },
    {
      time: 43.83,
      text: "Bao nhiêu tiền mà thích phô phô ra, vẫn đang ngồi mà trap thôi thật là bất cập (Thật là bất cập)",
    },
    {
      time: 46.96,
      text: "Tao vẫn đang ngồi trap trong phòng, cố để mà phân tích kiểu thực chất thì gọi là fuck up",
    },
    {
      time: 49.92,
      text: "Chơi mày như là chiếc tay cầm four by four like a motherfuckin' trucker",
    },
    {
      time: 53.05,
      text: "Flow này gọi là, flow này gọi là, trap my phone like a motherfuckin' trap phone, chyeah",
    },
    {
      time: 56.05,
      text: "Chúng nó vẫn sẽ thấy tao, nhưng không biết tao đang đâu (Uh-huh)",
    },
    {
      time: 59.18,
      text: "Ghét tao xong phán xét tao chúng mày quá ngây thơ (Chúng mày quá là non)",
    },
    {
      time: 61.97,
      text: "Giọng nói trên cao kêu tên tao là God’s favorite (MCK, chyuh)",
    },
    {
      time: 65.36,
      text: "Sắp xếp rồi nghe rất hay nhưng mà can’t follow (MCK, MCK; swag)",
    },
    {
      time: 68.48,
      text: "Anh chỉ hút và hút thôi, không cần biết là mấy giờ, uh (Hút)",
    },
    {
      time: 71.46,
      text: "Anh chỉ hút và hút thôi, không phải lo về giấy tờ, uh",
    },
    {
      time: 74.52,
      text: "Anh chỉ hút và hút thôi, không cần xem là mấy giờ, uh",
    },
    {
      time: 77.61,
      text: "Anh chỉ hút và hút thôi, mấy em gái này quấy nhờ, uh",
    },
    { time: 80.76, text: "Anh chỉ hút và hút thôi, gotta see you later, uh" },
    { time: 83.74, text: "Anh ở khu Hồ Tây và trong lòng fan hâm mộ, uh" },
    {
      time: 86.98,
      text: "Đêm chạy qua nhà anh, baby girl muốn đóng làm giang hồ (Bitch)",
    },
    { time: 89.95, text: "Em bảo em bị đau ở đâu? Để đấy anh khám hộ (Fwah)" },
    { time: 93.09, text: "Okay, okay, okay, okay, okay, okay, oh (Okay)" },
    { time: 96.02, text: "Đang trên phố, em đang đâu, anh đang bờ hồ" },
    { time: 99.28, text: "Anh đi mua cho bố anh iPhone 16 Pro (Vuýp)" },
    {
      time: 102.23,
      text: "Mua thêm sim cho bố, con dâu nó add số Zalo (Fwah)",
    },
    {
      time: 105.28,
      text: "Anh là ngôi sao xa xôi, em cho anh ra khơi, anh đưa em vào đời",
    },
    { time: 108.45, text: "Dưới anh là mặt đất thôi còn trên anh là giời" },
    {
      time: 111.53,
      text: "Nhắn cho anh mấy hôm rồi mà vẫn chưa thấy anh này trả lời",
    },
    {
      time: 114.57,
      text: "Anh này người nhà giời à? Cứ bắt em chờ mà— (Chyeah)",
    },
    { time: 117.67, text: "Tao chỉ hút và hút mà không cần biết là mấy giờ" },
    {
      time: 120.45,
      text: "Từ ngày chết đói, từng ngày mưa rơi, (Gọi là) Camel flavor",
    },
    { time: 123.86, text: "Tao đã đi từ đáy mà bây giờ oke vãi lờ" },
    {
      time: 126.86,
      text: "Long đẹp zai represent Hoàng Mai see you later (Vuýp)",
    },
  ],
  "Dưa Chua": [
    {
      time: 20.41,
      text: "Uh, hay ơi là hay, bật beat lên, cậu thích cậu rap luôn",
    },
    {
      time: 23.29,
      text: "Siêu bảnh, siêu chảnh, cà phê phiêu cảnh, mắt mày nhìn đểu là lác luôn (Lác)",
    },
    {
      time: 26.47,
      text: "Dập cả dìu, nhún cả nhảy, buổi chiều thứ Bảy anh em tao vi vu, uh, huh, uh",
    },
    {
      time: 29.71,
      text: "Gọi là mấy thằng bạn thôi nhưng mà sát sườn, lời vàng ý ngọc, flow thác tuôn",
    },
    {
      time: 32.85,
      text: "Mười triệu để thấy rõ bộ mặt của mấy thằng fake này, đời này còn dài lắm nhé các em ơi",
    },
    {
      time: 36.09,
      text: "Đừng để tao phải nói khi mà tao đã không muốn nói, giữ được chữ tín thì mới đáng mặt dân chơi (Chơi)",
    },
    {
      time: 39.28,
      text: "Đấm rơi bao cát, nhức mỏi hai vai, massage Tài Thu bọn tao tắm xông hơi",
    },
    {
      time: 42.47,
      text: "Suốt ngày cắn nhau, thế thì gọi là kém rồi, bọn tao trap xuyên lục địa rồi, khắp muôn nơi",
    },
    {
      time: 45.85,
      text: "Huh, huh, huh, huh, huh, tao vẫn freestyle không cần bài bản, uh",
    },
    {
      time: 49.17,
      text: "Flow tao lạnh cóng, khuyên mày đóng hai viên oresol, gọi là giải cảm, uh",
    },
    {
      time: 52.36,
      text: "Mấy em tao quen đều thơm, không tanh, tao không thể gọi là ghệ, không phải hải sản, uh",
    },
    {
      time: 55.42,
      text: "Không thể cản, không cần phải cản, nơi tao đi đấy là đường chúng mày trải thảm, uh",
    },
    {
      time: 58.68,
      text: "Uh, tao reclaim the power nên càng tham vọng thâm trầm",
    },
    {
      time: 61.69,
      text: "Tao thích năng lượng mới của mấy thằng trẻ trẻ muốn feat, uh, đang làm thân dần",
    },
    {
      time: 64.84,
      text: "Tao thích năng lượng trẻ của mấy em gái mười tám, hút nó luôn, đi bằng chân trần",
    },
    {
      time: 68.1,
      text: "Đón tiếp anh bằng thái độ ân cần, anh là thiện xạ, anh sẽ bắn ngay vào trong tâm",
    },
    {
      time: 71.37,
      text: "Gái ngoan gặp anh là hết ngại, gái hư gặp anh ngại luôn",
    },
    {
      time: 74.53,
      text: "Gu anh là gái mình dây, nên mặt phải xinh, và eo phải thuôn",
    },
    {
      time: 77.76,
      text: "Mấy gái thịt thà nhìn thấy được phen lại ghen, chị em lại buôn",
    },
    {
      time: 80.73,
      text: "Thôi thì anh là people pleaser, sang chơi với anh đi rồi anh lại thương (Thương)",
    },
    {
      time: 84.69,
      text: "Anh có nhiều vấn đề và anh không thích lừa bịp, chúng nó đuổi theo anh nhưng mà khó để mà kịp",
    },
    {
      time: 87.71,
      text: "Tài năng cho mọi người mà baby, it's a gift, anh bỏ chất gây nghiện dù anh đã có nhiều dịp",
    },
    {
      time: 91.01,
      text: "Anh rockin' this shit, I fuck on this shit, I fuck on this shit and keep rockin' this shit",
    },
    {
      time: 94.21,
      text: "I fuck on this shit and keep rockin' this shit, schyeah, schyeah, schyeah",
    },
    {
      time: 96.64,
      text: "Quá là khủng, tao là cái thằng nó chất nhất cả vùng",
    },
    {
      time: 99.15,
      text: "Các bên công ty vẫn đang cố để mà lùng, tao đi ăn phở béo và mặc đúng cái quần thụng (Đẳng cấp)",
    },
    {
      time: 102.8,
      text: "Thụng và thấp, nhưng hàng của tao cao, cap cái ảnh nhưng mà tao lại sao sao",
    },
    {
      time: 105.57,
      text: "Sao chúng mày phải cố làm cho nó bé lại? Tao chụp lại phát nữa này cho chúng mày lao đao (Được chưa? Bitch)",
    },
    {
      time: 109.86,
      text: "Uh, hay ơi là hay, bật beat lên, cậu thích cậu rap luôn",
    },
    {
      time: 112.82,
      text: "Siêu bảnh, siêu chảnh, cà phê phiêu cảnh, mắt mày nhìn đểu là lác luôn",
    },
    {
      time: 116.11,
      text: "Dập cả dìu, nhún cả nhảy, buổi chiều thứ Bảy anh em tao vi vu, uh, huh, uh",
    },
    {
      time: 119.24,
      text: "Gọi là mấy thằng bạn thôi nhưng mà sát sườn, lời vàng ý ngọc, flow—",
    },
    {
      time: 122.0,
      text: "Mỗi ngày bố mày thức dậy, thứ mà tao nghĩ đến nó đều là tiền",
    },
    {
      time: 123.87,
      text: "Không nói chuyện với mấy thằng ngu, tốn nước bọt dành để đếm dollars",
    },
    {
      time: 125.94,
      text: "Mẹ tao dạy là không tin ai, I fuck then I leave, rê, dribble, drib', gọi tao là baller",
    },
    {
      time: 129.13,
      text: "Không qua lại cả mấy con méng cũ, đấy là luật, you broke, I'm up, yeah, that's your karma",
    },
    {
      time: 132.24,
      text: 'Đừng hỏi tao kiểu "Đây là ai? Đây là ai?", đéo biết, hệ điều hành tao chạy nó gọi là undercover',
    },
    {
      time: 135.61,
      text: "Bọn tao đốt Berlin, Praha, Rick Owens Abstract, mắt trợn kính râm Balenciaga",
    },
    {
      time: 138.69,
      text: "Kẻ đường to như Quốc Lộ 1A, ống hút giấy, thằng đổ ra, cũng chơi drill, tên nó là Loco Montana (Gì nữa?)",
    },
    {
      time: 141.97,
      text: "Nó có mẹ trẻ sống cùng cả cha già (Gì nữa?), tuyết trắng, cỏ xanh, coke, zaza (Gì nữa?)",
    },
    {
      time: 145.06,
      text: "Anh em gọi nhau collab nhảy qua nhà (Gì nữa?), hút cỏ nhập, goo-goo-goo-ga-ga (Hah)",
    },
    { time: 148.63, text: "Quá là uyển, flow và beat như cá và biển" },
    {
      time: 151.07,
      text: "Sáng dậy thức tỉnh như Johnny Trí Não, tự thấy vẻ đẹp này quá là tuyển",
    },
    {
      time: 154.62,
      text: "Gặp được nhau nó là cái duyên, thích làm gì cứ thế mà triển",
    },
    {
      time: 157.71,
      text: "Anh em tao không thích đi club nên đóng đến đoạn Lương Ngọc Quyến là tỏa",
    },
    { time: 173.68, text: "(No, I'm just getting warmed up)" },
  ],
  "Xa Xôi (feat. Obito)": [
    { time: 24.31, text: "Tao như là nước thôi, mày định xiên vào đâu?" },
    { time: 25.77, text: 'Tao chỉ nói đúng một câu, "Em ơi đừng hòng"' },
    { time: 27.62, text: "Chúng mày ngao ác mỗi khi mà tao trap" },
    { time: 29.02, text: "Chất lên thành từng đống đô la đầy phòng" },
    {
      time: 30.74,
      text: "Count 'em, chà, chà, úi chà, chao ôi, tay đâu mà đếm",
    },
    {
      time: 33.86,
      text: "Count 'em up, alo, tao một tay ba cô, cháo lưỡi đổ ngay ra tô",
    },
    {
      time: 36.77,
      text: "Bố mày chỉ như là nước thôi, mày định xiên vào đâu?",
    },
    { time: 38.29, text: 'Tao chỉ nói đúng một câu, "Em ơi đừng hòng"' },
    { time: 40.08, text: "Chúng mày ngao ác mỗi khi mà tao trap" },
    { time: 41.32, text: "Chất lên thành từng đống đô la đầy phòng" },
    { time: 43.12, text: "Tao đã thông suốt flow đi như nước" },
    { time: 44.48, text: "Dân chơi muốn nuốt, muốn stole my flow" },
    { time: 46.28, text: "Đêm đông buốt, tao đi ra châm thuốc" },
    { time: 47.5, text: "Mày dành cả đời tìm không ra đâu" },
    { time: 49.3, text: "Okay, mấy thằng chó này xàm quá đi" },
    {
      time: 50.26,
      text: "Chúng mày nói chỉ nghe thôi chứ còn đợi mày làm được, thì chúng mày quá là xa xôi",
    },
    { time: 53.13, text: "Khi album ra, không gian bao la" },
    {
      time: 54.26,
      text: "Bất cứ thằng nào trên thị trường mà cứ ương là va thôi",
    },
    { time: 56.22, text: "Còn nếu như em yêu đã tin anh" },
    { time: 57.45, text: "Cho em khóa tim anh, anh sẽ khóa tay, khóa môi" },
    { time: 59.45, text: "Em là con album này, coi như anh là fan" },
    { time: 60.88, text: 'Anh muốn nghe là "Ra rồi, ra rồi"' },
    { time: 62.57, text: "Nhấc em ra trước gương" },
    { time: 63.56, text: "Cầm camera, 4K? Okay" },
    { time: 65.57, text: "Nhạc hay, tay vỗ ngay" },
    {
      time: 66.66,
      text: 'Mấy thằng ôn con này gọi từ "anh" lên thành "bố" ngay',
    },
    { time: 68.62, text: "Vụt như cơm bữa ngay" },
    { time: 69.81, text: "Chúng nó hô to tên tao, bố mày mới là chúa phê" },
    { time: 71.76, text: "Còn gì không? Comment nữa đê" },
    { time: 72.84, text: "Mấy thằng ôn con này thích sủa, vào mà sủa đê" },
    { time: 76.98, text: "Em ấy muốn được tao quan tâm?" },
    { time: 78.35, text: "Mặt xinh, dâm, mông đàn hồi" },
    {
      time: 79.99,
      text: "Tao đéo hiểu sao mà chúng mày vẫn khệnh được với mấy quả flow nó đã quá nhàm rồi",
    },
    { time: 82.92, text: "Thứ mà chúng mày nghĩ là sáng tạo" },
    { time: 84.58, text: "Mấy thằng Mỹ đen nó đã làm rồi" },
    {
      time: 86.33,
      text: "Bá hơn tất cả chúng mày, anh em tao càng đi càng xa thôi",
    },
    { time: 88.88, text: "N0L4B3L gang cho chúng mày thu lu" },
    { time: 90.25, text: "Send your locate, bố mày vẫn chu du" },
    { time: 92.23, text: "Mấy dân chơi này cho vào stu', stu'" },
    { time: 93.37, text: "Flow cho tao nghe nếu mà ăn thì cứ thu, thu" },
    { time: 95.27, text: "Thu line vocal cool, cool" },
    { time: 96.45, text: "Thêm line bè trầm vào, ú ú nu nu" },
    {
      time: 98.36,
      text: "Mua thêm con La-bù-bubu, tối mang sang nhà ghệ cho em bú, bú, cool, cool",
    },
    { time: 101.56, text: "Chất vãi lồn" },
    { time: 102.25, text: "Âm nhạc của tao nó là không mai một" },
    { time: 103.86, text: "Làm được không? Không thì kháy cái lồn" },
    { time: 105.32, text: "Hay là nói ít thôi hay là bé cái mồm lại" },
    {
      time: 106.99,
      text: "Mày không quen tao trước khi tao nổi fame vào, trước khi chân tao ở trên cao",
    },
    {
      time: 110.03,
      text: "Còn bây giờ thì đêm nào mày cũng phải nghĩ phải làm thế nào",
    },
    { time: 112.15, text: "Mày vẫn cố để thay thế tao" },
    {
      time: 114.04,
      text: "Có những câu chuyện thật sự rất là đơn giản, bảo mãi không hiểu",
    },
    {
      time: 117.18,
      text: "Tại vì là cái cách tao đi vần nó đã tách khỏi quy luật, tao đã bay như cánh diều mà",
    },
    {
      time: 120.23,
      text: "Tại vì là tao đéo quan tâm ai là tướng, ai là vua, mặt tao rất kênh kiệu",
    },
    { time: 122.92, text: "Chắn đường tao thì tránh ra, đau đừng trách nha" },
    { time: 125.64, text: "Tao như là nước thôi, mày định xiên vào đâu?" },
    {
      time: 127.0,
      text: 'Tao chỉ nói đúng một câu, "Em ơi đừng hòng" (Yeah, huh)',
    },
    {
      time: 128.88,
      text: "Chúng mày ngao ác mỗi khi mà tao trap (youngtobiee)",
    },
    { time: 130.17, text: "Chất lên thành từng đống đô la đầy phòng" },
    {
      time: 131.82,
      text: "Count 'em, chà, chà, úi chà, chao ôi, tay đâu mà đếm (Ah)",
    },
    {
      time: 135.03,
      text: "Count 'em up, alo, tao một tay ba cô (Huh), cháo lưỡi đổ ngay ra tô",
    },
    { time: 138.02, text: "youngtobiee, MCK, fuck all that shit" },
    { time: 139.51, text: "flow tuôn, cuốn mày luôn như là AK" },
    { time: 141.19, text: "Cash, cash, tiền về, bitch, payday" },
    { time: 142.51, text: "Nếu mày đéo thích thì cút mẹ, đừng nhây, nhây" },
    { time: 144.24, text: 'Mấy em ghệ như cừu kêu "Bae, bae"' },
    { time: 145.77, text: "trên cao tao ngắm nghía nhìn mây bay" },
    { time: 147.35, text: "Dù là hát hay là rap vẫn là phát cho mày táp" },
    { time: 148.82, text: "motherfuck hết mấy con chó, tụi mày lại cay, cay" },
    { time: 150.52, text: "Mon men, bon chen ở comment" },
    { time: 152.08, text: "Mấy thằng ngu chúng mày cần căng lên" },
    { time: 153.59, text: "Đéo cần dập đâu cho mày xăng thêm" },
    { time: 155.1, text: "Flow tao đốt cháy mẹ mày content" },
    {
      time: 156.83,
      text: "Bựa với cả nhựa, rách rưới cho mày lượn, mồm mày nhớ tích đức cho con em",
    },
    {
      time: 159.86,
      text: "Gom thêm trong đêm cho xôm lên, bắt ghế nhìn lũ chúng mày hom hem",
    },
    { time: 163.16, text: "Album drop của thằng bố mày xoay game" },
    { time: 164.69, text: "đầu đội trời chân tao đạp mây đen" },
    { time: 166.22, text: "Mấy thằng đần sủa như kiểu say men" },
    { time: 167.58, text: "Đéo biết tưởng ngầu hay là được ai khen" },
    { time: 169.18, text: "Tao là thứ tụi mày thích nhưng mà với đéo tới" },
    { time: 170.76, text: "Giọng mày nghe mít đặc như thằng mập Chaien" },
    { time: 172.43, text: "Mấy thằng đàn bà thích mặc size men" },
    { time: 174.03, text: "Tụi mày càng cắn, bố mày càng oai thêm" },
    { time: 175.54, text: "Qua rồi cái cảnh rap về gangster shit" },
    { time: 177.27, text: "nói cho mày nghe I ain't gangster bitch" },
    { time: 178.75, text: "Bước về khu tao mấy thằng gangster biết" },
    { time: 180.29, text: "rót ra đầy ly mấy thằng gangster tiếp" },
    { time: 181.88, text: "Em út trong hẻm mấy thằng gangster thích" },
    { time: 183.43, text: "Biết cái đéo gì mà đem gangster khích" },
    { time: 184.96, text: "Nhạc tụi tao drop mấy thằng gangster click" },
    {
      time: 186.3,
      text: "tao chửi thẳng luôn vào mặt nếu thằng gangster chích, bitch",
    },
    { time: 188.07, text: "Bước ra sân, thích là ra chân" },
    { time: 189.48, text: "Nhìn tao chạy dọc biên cộng với lối đá gấu" },
    { time: 191.01, text: "Nhảy múa tung tăng, lả lướt trên cung trăng" },
    { time: 192.57, text: "bố mày lùa qua hết mấy thằng có thói đá xấu" },
    { time: 194.1, text: "Nhạc trap trên xe, tụi tao ngao du" },
    { time: 195.95, text: "sáng bánh mì thịt xong tối phá lấu" },
    { time: 197.24, text: "Still top tier, man, sống êm re" },
    { time: 198.75, text: 'gọi tao Lý Tiểu Long vì lời tao nói "watou"' },
    { time: 203.77, text: "Tao như là nước thôi" },
    { time: 205.77, text: "Em ơi đừng hòng" },
    { time: 209.85, text: "Tao như là nước thôi" },
    { time: 212.08, text: "Em ơi đừng hòng" },
  ],
  "Che Phủ": [
    { time: 24.17, text: "Đã apologize chưa?" },
    { time: 25.72, text: "Huh, quan tâm làm gì?" },
    { time: 27.26, text: "Thấy nó chưa vibe" },
    { time: 28.8, text: "Thấy sai sai, từng lời nói rất xuôi tai, yeah" },
    { time: 32.07, text: "Lấy anh telephone, hẹn thằng chó đó trưa mai, yeah" },
    { time: 35.03, text: "Kí tên xong rồi mà lại đéo biết đưa ai, yeah" },
    {
      time: 38.16,
      text: "Bây giờ anh đầu cua rồi nhưng mà anh vốn rất ngon zai, yeah",
    },
    {
      time: 41.46,
      text: "Aight, that's my fault, anh đẻ ra hai đứa con trai, yeah",
    },
    {
      time: 44.51,
      text: "Chúng nó nhắc tên anh, anh làm mẹ chúng nó mang thai, yeah",
    },
    { time: 47.79, text: "Beef xong xuôi rồi mà khó nói chuyện quá" },
    { time: 50.53, text: "Lắm khói quá, mây mù che phủ" },
    { time: 52.42, text: "Chúng nó đang ở đâu? Yeah" },
    { time: 53.87, text: "Khói quá, mây mù che phủ" },
    { time: 55.42, text: "Đéo biết đang đâu, yeah" },
    { time: 57.13, text: "Khói quá, mây mù che phủ" },
    { time: 58.74, text: "Chúng nó đang đâu? Yeah" },
    { time: 60.23, text: "Khói quá mây mù che phủ" },
    { time: 61.89, text: "I don’t give a fuck" },
    { time: 63.19, text: "Huh, vậy mày đừng có nói nhiều" },
    { time: 64.99, text: "Bơm vào tai tao, tao đã hết năng lượng rồi" },
    { time: 66.56, text: "Cố bơm cho tao noid" },
    { time: 67.87, text: "Nhưng mà sao mà tao có thể rơi được, uhm" },
    { time: 69.63, text: "Trap all over, trap is all over" },
    { time: 72.64, text: "Aight that’s my fault" },
    { time: 74.14, text: "Alright that’s my fault" },
    {
      time: 75.72,
      text: "Chúng mày cần một thằng chất như tao, phải không bọn chó này?",
    },
    { time: 77.48, text: "Ạ đi tao cho" },
    {
      time: 78.78,
      text: "Chúng mày cần một thằng chất như tao, phải không bọn chó này?",
    },
    { time: 80.31, text: "Ạ đi tao cho" },
    { time: 82.04, text: "Chúng mày cần một thằng chất như tao" },
    { time: 83.4, text: "Ạ đi bọn chó này, vào đây tao cho" },
    { time: 85.17, text: "Chúng nó cần một thằng chất như tao" },
    { time: 86.66, text: "Chúng nó cần một thằng chất như" },
    {
      time: 88.37,
      text: "Chúng mày cần một thằng chất như tao, phải không bọn chó này?",
    },
    { time: 89.97, text: "Ạ đi tao cho" },
    {
      time: 91.53,
      text: "Năm lít tip nhét vào đít rồi đốt thuốc và hít, đấy là cách tao bo mày",
    },
    {
      time: 94.4,
      text: "Không thể trách móc mấy thằng oắt con này khi tao vẫn đứng trên trang đầu cover",
    },
    { time: 97.73, text: "Ở bên dưới chân tao là monitor" },
    { time: 98.9, text: "Chúng mày gào thét tên tao thật to" },
    { time: 100.82, text: "Lắm khói quá, mây mù che phủ" },
    { time: 102.53, text: "Chúng nó đang ở đâu? Yeah" },
    { time: 104.14, text: "Khói quá, mây mù che phủ" },
    { time: 105.74, text: "Đéo biết đang đâu, yeah" },
    { time: 107.21, text: "Khói quá, mây mù che phủ" },
    { time: 108.76, text: "Chúng nó đang đâu? Yeah" },
    { time: 110.38, text: "Khói quá mây mù che phủ" },
    { time: 112.06, text: "I don’t give a fuck" },
    { time: 113.19, text: "Huh, thằng bạn tao bảo thế này là chết rồi" },
    { time: 114.87, text: "Ừ thì chết thôi, có thế thôi mà cũng—" },
    {
      time: 116.65,
      text: "Hah, quá là bừa phứa nên tao sẽ không hứa nếu như không làm được",
    },
    { time: 125.08, text: "Anh pop và anh giữ được cái flavor" },
    { time: 126.64, text: "Em muốn như nào, thích như nào? Huh-huh" },
    { time: 128.22, text: "Tại sao đôi tay anh luôn trầy xước?" },
    { time: 129.82, text: "Tạ ơn trên đã ban phước" },
    { time: 131.49, text: "Quỳ xuống anh xin cho họ sức mạnh" },
    { time: 132.97, text: "Thêm mấy tấm bè để có chỗ cho họ lươn" },
    { time: 134.54, text: "Ganh ghét thì sẽ luôn bị từ khước" },
    { time: 135.86, text: "Mấy thằng hai mặt này nợ anh từ kiếp trước" },
    { time: 138.35, text: "Lắm khói quá, mây mù che phủ" },
    { time: 140.15, text: "Chúng nó đang ở đâu? Yeah" },
    { time: 141.8, text: "Khói quá, mây mù che phủ" },
    { time: 143.46, text: "Đéo biết đang đâu, yeah" },
    { time: 144.92, text: "Khói quá, mây mù che phủ" },
    { time: 146.57, text: "Chúng nó đang đâu? Yeah" },
    { time: 148.13, text: "Khói quá mây mù che phủ" },
    { time: 149.68, text: "I don’t give a fuck" },
  ],
  "Oanh M = Thuoc": [
    { time: 17.77, text: "Bố mày đánh mày bằng thước" },
    { time: 20.05, text: "Cho mày bắn ra đằng trước" },
    { time: 22.2, text: "Cái việc bố mày nhầm bước" },
    { time: 24.26, text: "Có phải là cái điều mày thầm ước?" },
    { time: 26.56, text: "Mấy chị em này nầm ướt" },
    { time: 28.63, text: "Còn tao như đang cần nước (Shh)" },
    { time: 30.7, text: "Nếu mà lỡ có mùi của tao" },
    { time: 32.87, text: "Xin lỗi, bố mày nhầm suốt, chyuh" },
    { time: 35.79, text: "Fuck 'em, fuck 'em, fuck 'em (Khoan, khoan, khoan)" },
    { time: 39.47, text: "Không bao giờ rung khi mà va chạm (Không bao giờ)" },
    {
      time: 41.52,
      text: "Tớ không bao giờ thích là làm việc qua mạng (Uh, uh)",
    },
    { time: 43.72, text: "E và Bò Húc trộn vào pha tạm" },
    { time: 45.66, text: "Tình bạn này là không cần gia hạn (Bất tử)" },
    { time: 47.97, text: "Bạn ơi, ở đâu đấy?" },
    { time: 48.71, text: "Cho tớ qua tạm" },
    { time: 50.31, text: "Tớ có khẩu súng" },
    { time: 50.98, text: "Bắn là ra đạn (Bắn phát một)" },
    { time: 52.27, text: "Bạn cũng lắt léo đấy" },
    {
      time: 53.03,
      text: "Bạn cũng đa dạng (Quá hay, có lời khen, có lời khen), tớ hiểu (Shh)",
    },
    {
      time: 56.44,
      text: "Mặt là dân chơi nhưng mà rất là si tình (Quá là phiền)",
    },
    { time: 58.64, text: "Không thể đú được đâu" },
    { time: 59.4, text: "Bạn chỉ có thể ghi hình (Chụp lại)" },
    { time: 60.76, text: "Alo" },
    {
      time: 62.35,
      text: "Thực ra để là câu chuyện này tớ đéo phân tích cái kiểu có thứ không đâu vào đâu",
    },
    { time: 65.27, text: "Nhá? Nhớ chưa con chó?" },
    { time: 67.55, text: "Yeah, yeah" },
    { time: 87.11, text: "(Tùng ơi)" },
    { time: 87.71, text: "(Trai tráng Đại Trượng Fu)" },
    {
      time: 88.7,
      text: "Đụ má Fuji (Hah), (Fuck) đụ má Fuji (Fuji), (Fuck) đụ má Fuji (Tùng ơi)",
    },
    { time: 95.06, text: "Tao gọi cái này lit, lit, lit, lit, lit, lit" },
    { time: 96.81, text: "Huh" },
    {
      time: 97.75,
      text: "Như là những tên cowboy (Những tên cowboy), cách tao rong chơi (Long Vũ Hoàng)",
    },
    { time: 101.27, text: "Rút súng bóp cò (Click, clack)" },
    { time: 102.74, text: "Ngắm lên sao trời (Grrah, chết luôn)" },
    { time: 104.38, text: "Rockstar lifestyle (Rockstar life)" },
    { time: 106.06, text: "Chapman No.4 (Rockstar life)" },
    { time: 107.59, text: "I can't do no wrong (Hah)" },
    { time: 108.51, text: "Chất nhất trên đời" },
    { time: 109.27, text: "Họ biết tên tao rồi (Aaargh)" },
    { time: 111.06, text: "Fashion rapper? Họ mặc so lame (Lame shit)" },
    { time: 112.55, text: "Tùng Dương" },
    { time: 113.05, text: "Anh tao mặc Balmain (Bố mày chứ ai?)" },
    { time: 114.36, text: "Fuck a bitch with a Rick fit on Santa Fe" },
    { time: 116.4, text: "được gọi là thâu đêm, huh" },
    { time: 117.94, text: 'Huh? "Một người như em" — Adele (Adele)' },
    { time: 120.43, text: '"Yêu em anh nhé?" — Adele (Long)' },
    { time: 121.92, text: "I got that liêm shit from my old man (Quá được)" },
    {
      time: 123.95,
      text: "Chúng mày to được bằng móng chân nhưng mà thích call out (Hah, không thể)",
    },
    { time: 127.2, text: "Tao đốt Mơ Màng cháy luôn" },
    { time: 128.63, text: "tất cả vé sold out (Chyuh)" },
    {
      time: 130.65,
      text: "Huh, tao được bảo hộ ở trên cao, sáu cánh ngôi sao (Long)",
    },
    { time: 133.72, text: "Anh nhớ đã xôm như nào" },
    { time: 134.76, text: "cố mà bu khi my dick fall out (Huh)" },
    {
      time: 136.95,
      text: "Như là những tên cowboy (Những tên cowboy), cách tao rong chơi (Long Vũ Hoàng)",
    },
    { time: 140.54, text: "Rút súng bóp cò (Click, clack)" },
    { time: 142.1, text: "Ngắm lên sao trời (Grrah, chết luôn)" },
    { time: 143.69, text: "Rockstar lifestyle (Rockstar life)" },
    { time: 145.17, text: "Chapman No.4 (Rockstar life)" },
    { time: 146.82, text: "(Vãi chất) I can't do no wrong (Hah)" },
    { time: 147.77, text: "Chất nhất trên đời" },
    { time: 148.43, text: "Họ biết tên tao rồi" },
    { time: 149.79, text: "Hmm, ai biết?" },
    { time: 151.95, text: "Không thể control, sai khiến" },
    { time: 152.69, text: "Crippled flow tai mày tai biến" },
    { time: 154.35, text: "MCK như là một cây kiếm" },
    { time: 155.91, text: "Ngông và tham vọng, tao không than phiền" },
    { time: 157.46, text: "Trăm phần trăm là trăm phần trăm, yeah" },
    { time: 159.28, text: "MCK như một cái khiên" },
    { time: 160.74, text: "Người đến rồi đi, tao không tiếc, hmm" },
    {
      time: 162.57,
      text: "Chất vãi lồn rồi mà đôi khi vẫn bị insecure? Thế mới đau",
    },
    {
      time: 166.49,
      text: "Chúng nó rời đi vì rắn và rồng thì không thể nào cùng sống với nhau",
    },
    {
      time: 169.78,
      text: "Máu mày có chảy thì hãy nhớ đến tao vì tao sẽ đến lau, hah",
    },
    {
      time: 172.88,
      text: "Như là những tên cowboy (Những tên cowboy), cách tao rong chơi (Long Vũ Hoàng)",
    },
    { time: 176.41, text: "Rút súng bóp cò (Click, clack)" },
    { time: 178.01, text: "Ngắm lên sao trời (Grrah, chết luôn)" },
    { time: 179.69, text: "Rockstar lifestyle (Rockstar life)" },
    { time: 181.2, text: "Chapman No.4 (Rockstar life)" },
    { time: 182.8, text: "I can't do no wrong (Hah)" },
    { time: 183.73, text: "Chất nhất trên đời" },
    { time: 184.39, text: "Họ biết tên tao rồi" },
    { time: 185.54, text: "(Hah) Những tên cowboy (Hah)" },
    { time: 188.79, text: "Long Vũ Hoàng (Trai tráng Đại Trượng Fu)" },
    { time: 190.32, text: "Click, clack, (Fuji) grrah, chết luôn" },
    { time: 193.09, text: "Long rockstar life" },
    { time: 194.84, text: "Long rockstar life (Vãi chất)" },
    { time: 196.76, text: "Hah, aaargh" },
  ],
  "Ghet Xog Lai Thik": [
    {
      time: 18.41,
      text: "Tao không bao giờ muốn nghe đâu, chúng mày cap, cap (Cap, cap)",
    },
    { time: 21.54, text: "Purple Haze" },
    { time: 22.17, text: "Mùi Purple Haze gọi là khét lẹt (Whoo, woah)" },
    { time: 24.54, text: "Fuck, tao đói rồi" },
    { time: 25.74, text: "Bụng tao lép kẹp (Cái gì?)" },
    { time: 27.56, text: "Tao là chỉ đi ngang qua đây" },
    { time: 28.62, text: "Now she's wet, wet (She's wet)" },
    {
      time: 30.58,
      text: 'Nhắn cho anh là, "Please give me a chance" (Give me, yah)',
    },
    {
      time: 33.22,
      text: "Anh không thích là phải làm việc qua middleman (Middle, woah)",
    },
    {
      time: 36.18,
      text: "Anh thích ký cho fan của anh bằng bút bi đen (Woah)",
    },
    { time: 39.11, text: "Blown her back out" },
    { time: 40.3, text: "Fill her coochie" },
    { time: 41.87, text: "I love that juicy pussy, bring it to me" },
    { time: 45.02, text: "Bọn chó này ghét xong rồi lại thích à? (Woah)" },
    { time: 47.12, text: "Đéo muốn giải thích, uh" },
    { time: 48.6, text: "Ghét xong rồi lại thích à? (Turn it)" },
    { time: 50.08, text: "Đéo muốn giải thích, chyah" },
    { time: 51.45, text: "Ghét xong rồi lại thích à? (Turn it)" },
    { time: 52.89, text: "Đéo muốn giải thích, chyah" },
    { time: 54.37, text: "Ghét xong rồi lại thích à? (Turn it)" },
    { time: 55.98, text: "Không cần phải giải thích" },
    {
      time: 57.05,
      text: "Tao thích ngắm gái nhưng em nào vibe mới được tao follow",
    },
    {
      time: 60.04,
      text: "Thấy mình quá là bay nhưng đéo hiểu đấy là do đâu (Yah)",
    },
    { time: 63.12, text: "MCK nó đã trở lại rồi" },
    { time: 64.5, text: "Đéo còn lo âu" },
    { time: 66.03, text: "Tao set the trend" },
    { time: 67.64, text: "Chúng mày follow (Nhìn xem này)" },
    { time: 69.64, text: "Tao vẫn đang trên top (Trên top)" },
    { time: 70.76, text: "Cùng Thành Draw đi xem Van Gogh (Okay)" },
    { time: 72.42, text: "Bọn tao làm Vietnamese hot (She's hot)" },
    { time: 74.03, text: "Hip-hop pha với pop (Pop)" },
    { time: 75.49, text: "Rick Owens mob (Mob)" },
    { time: 77.09, text: "Tequila shots (Shots)" },
    {
      time: 78.51,
      text: "Vamp, vamp, vamp, vamp, vamp, vamp, vamp, vamp, vamp, vamp",
    },
    { time: 81.12, text: "Chúng nó ghét xong lại thích à? (Woah)" },
    { time: 83.08, text: "Đéo cần phải giải thích, chyah" },
    { time: 84.71, text: "Ghét xong lại thích à? (Turn it)" },
    { time: 86.12, text: "Đéo cần phải giải thích, chyah" },
    { time: 87.64, text: "Ghét xong lại thích à? (Turn it)" },
    { time: 88.86, text: "Đéo cần phải giải thích, chyah" },
    { time: 90.57, text: "Ghét xong lại thích à? (Turn it)" },
    { time: 92.02, text: "Đéo cần phải giải thích" },
    { time: 94.36, text: "Woah" },
  ],
  "Nhìn Kẻ Thù Của Tao": [
    { time: 51.63, text: "Yeah, tao đang không đeo bịt mắt" },
    { time: 54.67, text: "Take off that cover" },
    { time: 56.16, text: "Để xem không gian tối đen lan rộng" },
    { time: 60.11, text: "Yeah, không đeo bịt mắt" },
    { time: 61.82, text: "Nhìn xuyên qua trò lừa gạt này" },
    { time: 63.16, text: "Giờ lại thấy như không" },
    { time: 65.68, text: "Vụn vỡ nhưng đã trao" },
    { time: 67.48, text: "Niềm tin như vết dao họ đâm vào lưng" },
    { time: 69.53, text: "Khi tao đã quay đi rồi" },
    { time: 72.02, text: "Từng câu chuyện bị họ hiên ngang đánh tráo" },
    { time: 74.56, text: "Như là cách tao đang đứng dậy" },
    { time: 75.9, text: "Nhìn kẻ thù của tao" },
    { time: 77.21, text: "Sao? Huh? Mày muốn thấy tao chết à?" },
    { time: 78.78, text: "Ngủ tiếp đi, cảnh đấy trong mơ thôi" },
    { time: 80.41, text: "Hạ tao xuống? Mày muốn hạ tao xuống?" },
    { time: 81.83, text: "Gọi thêm mười thằng, anh em tao cưa đôi" },
    { time: 83.51, text: "Bảo tao thay đổi chắc là nhà đéo có gương soi" },
    { time: 85.21, text: "Chúng mày phát triển" },
    { time: 85.87, text: "Chạy theo một đường lối" },
    { time: 86.91, text: "Bất quy tắc, tao mới là đương thời" },
    { time: 88.47, text: "Trồi lên từ sỏi để lại hương thơm" },
    { time: 90.05, text: "Phủi bụi, uhm, giày tao như mới" },
    { time: 91.48, text: "Đúng là lòng người đéo mẹ bạc như vôi" },
    { time: 93.34, text: "Đéo ai quan tâm khi mà tao chưa nổi" },
    { time: 94.59, text: "Sao bây giờ lại thay đổi hả mấy thằng ngu ơi?" },
    { time: 96.41, text: "Đặt điều về tao kiểu đấy quá xưa rồi" },
    { time: 97.95, text: "Đái vào mặt mày gọi là một ngày mưa rơi" },
    { time: 99.63, text: "Tao im lặng khi mà thông tin đưa tới" },
    { time: 101.26, text: "Tao im lặng cho chúng mày múa mép khua môi" },
    { time: 103.29, text: "Huh-huh-huh-huh-huh-huh" },
    { time: 108.01, text: "(Chúng nó đéo biết đấu với cái gì)" },
    { time: 109.62, text: "Huh-huh-huh-huh-huh-huh" },
    { time: 115.86, text: "Chúng nó đéo biết đấu với cái gì" },
    { time: 117.55, text: "Huh-huh-huh-huh-huh-huh-huh-huh" },
    { time: 123.86, text: "Huh-huh-huh-huh-huh-huh-huh-huh" },
    { time: 130.42, text: "Huh-huh-huh-huh-huh-huh-huh-huh" },
    { time: 136.66, text: "Huh-huh-huh-huh-huh-huh-huh-huh" },
    {
      time: 142.7,
      text: "(Kẻ thù của tao) Sao? Huh? Mày muốn thấy tao chết à?",
    },
    { time: 144.4, text: "Ngủ tiếp đi, cảnh đấy trong mơ thôi" },
    { time: 146.07, text: "Hạ tao xuống? Mày muốn hạ tao xuống?" },
    { time: 147.39, text: "Gọi thêm mười thằng, anh em tao cưa đôi" },
    { time: 149.18, text: "Bảo tao thay đổi chắc là nhà đéo có gương soi" },
    { time: 150.84, text: "Chúng mày phát triển" },
    { time: 151.39, text: "Chạy theo một đường lối" },
    { time: 152.43, text: "Bất quy tắc, tao mới là đương thời" },
    { time: 154.05, text: "Trồi lên từ sỏi để lại hương thơm" },
    { time: 155.69, text: "Phủi bụi, uhm, giày tao như mới" },
    { time: 157.19, text: "Đúng là lòng người đéo mẹ bạc như vôi" },
    { time: 158.89, text: "Đéo ai quan tâm khi mà tao chưa nổi" },
    { time: 160.21, text: "Sao bây giờ lại thay đổi hả mấy thằng ngu ơi?" },
    { time: 162.02, text: "Đặt điều về tao kiểu đấy quá xưa rồi" },
    { time: 163.65, text: "Đái vào mặt mày" },
    { time: 164.19, text: "Gọi là một ngày mưa rơi" },
    { time: 165.23, text: "Tao im lặng khi mà thông tin đưa tới" },
    { time: 166.8, text: "Tao im lặng cho chúng mày múa mép khua môi" },
    { time: 168.19, text: "Bá hơn ai?" },
    { time: 168.9, text: "Bá hơn tao?" },
    { time: 169.71, text: "Tao bắt đầu chán rồi tao ra khỏi đại lao" },
    { time: 171.14, text: "Bắt đầu thèm khát" },
    { time: 171.77, text: "Thứ sức mạnh chúng mày không thể" },
    { time: 172.8, text: "Kiểm soát được việc đó" },
    { time: 173.24, text: "Khiến cho chúng mày lại ngao à? (Huh)" },
    { time: 174.95, text: "Sống lại để chết xong lại sống" },
    { time: 176.13, text: "Rồi lại chết để con người" },
    { time: 176.87, text: "Trong gương vẫn là của tao" },
    { time: 177.82, text: "Của tao là của tao" },
    { time: 178.56, text: "Chúng mày không thể đánh tráo" },
    { time: 179.57, text: "Định cho tao vai ác? Motherfuckers" },
    { time: 180.57, text: "Tao sẽ khiến chúng mày điên lên" },
    { time: 184.94, text: "Bozo đen keep rocking my fit" },
    { time: 186.27, text: "Vẫn đang nghe xem" },
    { time: 186.88, text: "Mấy anh công ty rap cái gì" },
    { time: 187.98, text: "Yeah, I be cold, I stay low like this" },
    { time: 189.62, text: "Đã quá lâu tao không post lên IG" },
    { time: 191.0, text: "Rằng bọn khổng lồ sẽ gục" },
    { time: 192.02, text: "Dưới chân thằng bé tí" },
    { time: 192.89, text: "Fuck it, get lit" },
    { time: 193.75, text: "I be swerve" },
    { time: 194.38, text: "Tao đi như này đứng như này rap như này" },
    { time: 195.88, text: "Okay, nếu mày gan thì mày cop đi này" },
    { time: 197.52, text: "Cổ tay tao Rolex, không phải Cartier" },
    { time: 198.92, text: "Fuck your bitch fuck your fame fuck your polymer" },
    { time: 200.51, text: "Tao đi như này đứng như này rap như này" },
    { time: 202.13, text: "Đừng cố để bằng tao" },
    { time: 202.8, text: "Chọn kiếp khác đi vậy" },
    { time: 203.86, text: "Tao đi qua nó biến nó thành spotlight" },
    { time: 205.46, text: "Để cho chúng mày biết đâu là trap" },
  ],
  "Envy (feat. THANHDRAW)": [
    {
      time: 53.47,
      text: "Tao đéo biết tại sao mấy thằng khốn này ghen tị, yuh",
    },
    { time: 56.72, text: "Chúng nó bị che mắt bằng mấy tờ, mấy tờ VND, yuh" },
    { time: 60.02, text: "VSLY, Rick, tao cần thêm cả Balenci'" },
    {
      time: 62.84,
      text: "Đéo thể cản được tao kiếm tiền đâu, chúng mày nên làm quen đi",
    },
    { time: 66.16, text: "Tiền tươi, thóc thật, uh, đẹp zai mọi góc mặt, uh" },
    {
      time: 69.47,
      text: "Suy nghĩ vẫn cứ giữ là người tốt, nếu mày đéo hiểu mày óc cặc",
    },
    { time: 72.39, text: "(Bitch) Cỏ nhập, và đây là sativa," },
    { time: 74.38, text: "young boy đi cảnh mafia" },
    { time: 75.82, text: "Tao phang hết gái của chúng mày," },
    { time: 77.22, text: "burn the club để đánh dấu nơi mà tao đi qua" },
    {
      time: 79.39,
      text: "Tao trả, tao trả, tao trả, tao trả, tao trả, tao trả, tao trả",
    },
    {
      time: 82.48,
      text: "Tao chỉ sống cuộc đời của tao, mày thấy đéo vừa mắt à? Sao hả? Sao hả?",
    },
    { time: 85.6, text: "Show up và tao không cần truyền thông" },
    { time: 86.9, text: "vì lý tưởng của tao nó đã quá là cao cả" },
    { time: 88.96, text: "Còn tài năng và âm nhạc thì đéo nói," },
    {
      time: 90.43,
      text: "Tao đánh sập bảng xếp hạng khi tao bước sang tuổi hai ba",
    },
    {
      time: 92.86,
      text: 'Uh, nhắn với chúng nó là, "You don\'t know this shit"',
    },
    { time: 95.32, text: "Fuck, mấy cái thằng ngu này, where your crew at?" },
    { time: 97.45, text: "Hàng mỹ ký thì đừng gọi đấy là cubans" },
    { time: 99.05, text: "Tao để moi, mọi người gọi nó là mullet" },
    { time: 100.68, text: "Mày đéo ngầu đâu, you ain't cool" },
    { time: 102.37, text: "Tầm nhìn chúng mày nó đã bị thu hẹp" },
    { time: 103.96, text: "Thiếu hiểu biết, drink up the Kool-Aid" },
    { time: 105.67, text: "Đứng trước mặt mày eat my full plate" },
    { time: 107.26, text: "Bet you hate it when I do that" },
    { time: 108.32, text: "(Đĩ, đĩ, đĩ) Fuck" },
    { time: 111.61, text: "(Đĩ, đĩ, đĩ) Fuck" },
    { time: 114.66, text: "(Đĩ, đĩ, đĩ) Mày xấu vãi cả lồn" },
    { time: 117.95, text: "(Đĩ, đĩ, đĩ) Fuck, do that" },
    { time: 121.78, text: "(Đĩ, đĩ, đĩ) Fuck" },
    { time: 124.78, text: "(Đĩ, đĩ, đĩ) Fuck" },
    { time: 127.78, text: "(Đĩ, đĩ, đĩ) Mày xấu vãi cả lồn" },
    { time: 131.39, text: "(Đĩ, đĩ)" },
    { time: 133.52, text: "Take off that shit, xem mày như nào? (Đĩ, đĩ, đĩ)" },
    { time: 136.88, text: "Take off that shit, xem mày như nào? (Đĩ, đĩ, đĩ)" },
    { time: 140.13, text: "Put down that shit, xem mày như nào? (Đĩ, đĩ, đĩ)" },
    { time: 141.78, text: "Take off that shit, xem mày như nào? (Đĩ, đĩ)" },
    { time: 146.65, text: "Put down that shit, xem mày như nào?" },
    { time: 148.33, text: "Huh, yeah, yeah, sao đây?" },
    { time: 149.98, text: "Quay đi quay lại đã làm sao đây? (Huh)" },
    {
      time: 151.27,
      text: "Tao đang ăn sáng đã phải callin' (What?)<br>Đến đây nói chuyện, khuyên mày mau lên (Hah)",
    },
    { time: 154.96, text: "Thiên thần sa lầy" },
    {
      time: 156.17,
      text: "Muốn tao chứng kiến cảnh tượng này tiếp tục bao lần",
    },
    { time: 158.25, text: "Mỗi lần mày sống thay mặt bao lần" },
    {
      time: 159.46,
      text: "Thích thì cứ nói không phải ganh tị, tao phần (What?)",
    },
    { time: 161.42, text: "Suốt ngày đòi gang, gang, gang," },
    { time: 162.79, text: "không có thông điệp rồi lại bảo chơi cho thật vui" },
    { time: 164.43, text: "Kiếm tiền đầy túi nhớ dành cho mình đường lui" },
    { time: 165.95, text: "(I'm bogeyman), bắt mày giấu đầu hở đuôi" },
    { time: 167.74, text: "Cạn tình cạn nghĩa thì lí nào mà chả xuôi," },
    { time: 169.28, text: "xắn tay áo lên, nghĩ cho cùng cũng phải thôi" },
    { time: 170.93, text: "Nằm gai nếm mật nên ong nào tao chả nuôi," },
    { time: 172.32, text: "nên cứ ghét tiếp đi, yah" },
    { time: 175.34, text: "Swagged out" },
    { time: 175.7, text: "(Woah, swag)" },
    { time: 177.48, text: "Swag" },
    { time: 178.77, text: "Huh" },
    { time: 179.42, text: "Take off my shit cho mày ghét luôn" },
    { time: 182.03, text: "Huh, swagged out" },
    { time: 182.82, text: "Nhịn mày lần này gọi là xong" },
    { time: 184.41, text: "Cho mày lấy giấy bút ra mà chép luôn," },
    { time: 185.99, text: "bọn tao là dân chơi thì không được phép buồn" },
    { time: 187.71, text: "Huh, huh, huh, huh" },
    { time: 189.03, text: "Coi như xưa nay chưa quen nhau (Lil' bitch)" },
    {
      time: 190.67,
      text: "Để tao phải thấy thêm lần nữa, khuyên mày nhớ lấy (I'm bogeyman)",
    },
    { time: 192.95, text: "Rượu đâu mang ra đê" },
    { time: 193.92, text: "Uh, cho tiền vào bank xong tao skrt like woah" },
    { time: 195.92, text: "Không cần nhìn giá, tao skrt like woah" },
    { time: 197.68, text: "Anh em tao vâm, bố mày skrt, we roll" },
    {
      time: 199.19,
      text: "Yeah, anh em tao trap, không hùa được đâu",
    },
    { time: 200.9, text: "Trap it, trap it, trap it, trap it (Được đấy, hmm)" },
    {
      time: 203.33,
      text: "Trap it, trap it, trap it, trap it",
    },
    {
      time: 205.86,
      text: "Trap it, trap it, trap it, trap it",
    },
    { time: 210.36, text: "Được đấy, uh, được" },
  ],
  "Cảm Ơn": [
    { time: 1.91, text: "Haha, ayy, yeah" },
    {
      time: 4.69,
      text: "Gửi cái này cho tất cả các homie của tao, my bro, my bro (Hahaha)",
    },
    { time: 8.94, text: "Yo, yo, yo, yo, yo, listen" },
    { time: 11.07, text: "You ain't gotta worry 'bout nothin'" },
    { time: 11.84, text: "(Đéo phải nghĩ gì cả)" },
    { time: 13.19, text: "Things gon' be alright (Mọi thứ sẽ ổn thôi)" },
    { time: 14.8, text: "Tao tin vào những mối lương duyên (Yeah, hahahaha)" },
    {
      time: 16.69,
      text: "Nếu mà anh em có duyên thật thì anh em sẽ gặp thôi (Will meet)",
    },
    { time: 17.63, text: "Cùng tần sóng (Will, will, will speak, okay?)" },
    {
      time: 20.05,
      text: "Cho tất cả những người ở lại và tất cả những người đã rời đi",
    },
    {
      time: 22.17,
      text: '"Thanks for creating me, wish you all the best" (Yes sir)',
    },
    { time: 25.16, text: "Fuck what they think about me" },
    { time: 26.76, text: "29, 23, Hoàng Long, MCK (Hold on; yeah)" },
    { time: 30.25, text: "Fuck what they say about me" },
    { time: 32.08, text: "Kệ mẹ cho chúng nó nói" },
    { time: 33.25, text: "Tao cứ thế mà lao đi (Sao nữa?)" },
    { time: 35.45, text: "Fuck what they think about me" },
    { time: 37.57, text: "Xin cảm ơn vì đã ở đấy" },
    { time: 38.85, text: "Vào những cái lúc mà tao suy (Chân thành cảm ơn)" },
    { time: 41.42, text: "Fuck what they say about me" },
    { time: 42.81, text: "They ain't really know shit" },
    { time: 43.73, text: "They don't know about me (Alright)" },
    { time: 45.52, text: "Và đúng thật là có những lầm lỡ" },
    { time: 47.14, text: "Tao từ một thằng nhóc con" },
    { time: 48.09, text: "Sau bốn năm trở thành thằng tầm cỡ" },
    { time: 49.86, text: "Ngã để đau, đau để lớn" },
    { time: 51.13, text: "Nếu thế thì tao không cần đỡ" },
    {
      time: 52.35,
      text: "Chỉ có những nút thắt trong tâm là những thứ bây giờ tao đang cần gỡ (Yeah, aight)",
    },
    { time: 56.22, text: "Và thằng nào cũng nói về may mắn" },
    {
      time: 57.6,
      text: "Tao ở ga Kasumi, kiếm tiền yên bằng đôi bàn tay trắng",
    },
    {
      time: 60.22,
      text: "Vì thành quả sẽ ngọt nhất sau khi mày được nếm trải cay đắng",
    },
    {
      time: 62.77,
      text: 'Tao mong một ngày chúng mày làm được, tao sẽ vỗ tay bảo là, "Hay lắm" (Hay lắm)',
    },
    { time: 67.21, text: "Tao đi thật xa để quay trở về" },
    { time: 68.49, text: "Biết ơn những người đã tin vào" },
    { time: 69.7, text: "Thằng nhóc vô tâm suy tư bộn bề" },
    { time: 71.36, text: "Trái tim tao lớn hơn" },
    { time: 72.23, text: "Những niềm đau này không còn đau đến thế" },
    { time: 73.65, text: "Cụ công tằng tao tên Chiến" },
    { time: 74.73, text: "Tao cúi đầu thắp hương lúc tao về thăm quê" },
    { time: 76.7, text: "Cho những đứa trẻ lớn lên giống như tao" },
    { time: 78.48, text: "Muốn một lần được sống như tao" },
    {
      time: 79.47,
      text: "Hi vọng tao truyền được lửa cho chúng mày cuộc sống này sắc màu",
    },
    {
      time: 81.91,
      text: "Cho người anh em ở bên, những người yêu không kể tên",
    },
    { time: 84.2, text: "Những niềm vui này không không thể quên" },
    { time: 85.63, text: "Là lí do mà chúng mình bắt đầu" },
    { time: 87.1, text: "Cám ơn cả những ngày nắng ban mai" },
    {
      time: 89.04,
      text: "Tao đã yêu bao hạt mưa giờ tao lại yêu thêm cả nắng, uh",
    },
    { time: 92.24, text: "Cám ơn người đàn ông luôn thầm lặng" },
    {
      time: 94.23,
      text: "Ủng hộ, dõi theo con, cho flow của con thêm hăng",
    },
    { time: 97.0, text: "Cái đoạn mà bố vừa đẻ con ra xong ấy" },
    { time: 99.83, text: "Mấy ngày đầu cảm giác như nào?" },
    { time: 102.24, text: "Lạ cực kì luôn" },
    { time: 103.45, text: "Lạ cực kì á?" },
    { time: 104.66, text: "Như hai thằng chưa gặp nhau bao giờ (Hahaha)" },
    { time: 107.19, text: "Cái cảm giác rất buồn cười" },
    { time: 109.12, text: "Kiểu đi ra, kiểu đi ra xem mắt ấy" },
    {
      time: 112.54,
      text: "Rất muốn xem nhưng mà nhìn ngượng ngượng, ngại ngại, ngượng ngượng",
    },
    { time: 117.81, text: "Mặc dù là cũng gọi là vai bố đấy" },
    {
      time: 120.66,
      text: "Mà rất ngượng thật, chưa, chưa nghĩ ra mình lại, mình là bố",
    },
    { time: 125.03, text: "Fuck what they think about me" },
    { time: 127.2, text: "29, 23, Hoàng Long, MCK (Hold on; yeah)" },
    { time: 130.55, text: "Fuck what they say about me" },
    { time: 132.56, text: "Kệ mẹ cho chúng nó nói" },
    { time: 133.55, text: "Tao cứ thế mà lao đi (Sao nữa?)" },
    { time: 135.75, text: "Fuck what they think about me" },
    { time: 137.51, text: "Xin cảm ơn vì đã ở đấy" },
    { time: 138.6, text: "Vào những cái lúc mà tao suy (Chân thành cảm ơn)" },
    { time: 141.42, text: "Fuck what they say about me" },
    { time: 142.81, text: "They ain't really know shit" },
    { time: 144.13, text: "They don't know about me (Alright)" },
  ],
  "Không Cần Lo Cho Tao": [
    { time: 18.21, text: "Tao chỉ muốn được rong chơi" },
    { time: 19.22, text: "Không còn cô đơn" },
    { time: 19.83, text: "Vì đường tao đi rất xa (yeah)" },
    { time: 21.35, text: "Không muốn làm vì sao rơi" },
    { time: 22.26, text: "Chỉ muốn ngắm nhìn" },
    { time: 23.12, text: "Chỉ muốn look from afar" },
    { time: 24.44, text: "Tao chỉ muốn người tao yêu" },
    { time: 25.31, text: "Là cười tươi lên, dù đôi khi rất đau (yeah)" },
    { time: 27.57, text: "We’re gonna do it again and again" },
    { time: 28.91, text: "And again như là chưa từng mất nhau" },
    { time: 30.59, text: "Chỉ là vài chuyện buồn" },
    { time: 31.71, text: "Làm mình muộn phiền" },
    { time: 32.47, text: "Làm mình quên đi bao nhiêu yêu thương" },
    { time: 33.75, text: "Đã nói từ ngày đầu" },
    { time: 34.64, text: "Tao không còn ngây thơ" },
    { time: 35.43, text: "Nụ cười tươi trên môi bao lâu nay" },
    { time: 36.64, text: "Nó biến mất rồi còn đâu" },
    { time: 37.73, text: "Đôi khi muốn chìm vào" },
    { time: 38.62, text: "Một nụ hôn của yêu thương si mê" },
    { time: 39.93, text: "Say đắm, ngọt ngào" },
    { time: 40.7, text: "Sao tao không thể" },
    { time: 41.57, text: "Sao tao không hiểu đâu mới là điều" },
    { time: 42.95, text: "Mà mình thật sự khát khao" },
    { time: 45.31, text: "Với tay lên trời" },
    { time: 46.09, text: "Tao muốn thoát ra khỏi đây" },
    { time: 48.44, text: "Từng nhịp từng nhịp" },
    { time: 49.1, text: "Như tan trong lòng bàn tay" },
    { time: 51.54, text: "Bao nhiêu yêu thương đong" },
    { time: 52.33, text: "Cho con tim tràn đầy?" },
    { time: 54.67, text: "Kệ mẹ muộn phiền" },
    { time: 55.46, text: "Ở dưới những đám mây" },
    { time: 56.38, text: "Vui đi men, sau chỉ còn lại" },
    { time: 57.57, text: "Những câu chuyện hài kỉ niệm" },
    { time: 58.48, text: "Và vài cọc polymer" },
    { time: 59.42, text: "Khi tao cô đơn, tao buồn tao biết" },
    { time: 60.73, text: "Tao phải tìm đến chỗ chúng mày phàn nàn" },
    { time: 62.8, text: "Quá khứ và những tổn thương" },
    { time: 63.92, text: "Đã cùng tao xây những bức tường bằng vàng" },
    { time: 65.84, text: "Cám ơn những thằng bạn chó" },
    { time: 67.05, text: "Vẫn ngồi cùng tao" },
    { time: 67.84, text: "Những buổi chiều chạng vạng" },
    { time: 71.18, text: "Không cần lo cho tao, ah-ah" },
    { time: 74.37, text: "Không cần lo cho tao, ah" },
    { time: 77.5, text: "Không cần lo cho tao, yah" },
    { time: 80.52, text: "Tao chỉ muốn được rong chơi" },
    { time: 81.58, text: "Không còn cô đơn" },
    { time: 82.28, text: "Vì đường tao đi rất xa" },
    { time: 83.57, text: "Không muốn làm vì sao rơi" },
    { time: 84.69, text: "Muốn ngắm nhìn" },
    { time: 85.4, text: "Chỉ muốn look from afar" },
    { time: 86.78, text: "Tao chỉ muốn người tao yêu" },
    { time: 87.79, text: "Cười tươi lên, dù đôi khi rất đau" },
    { time: 89.8, text: "We’re gonna do it again and again" },
    { time: 91.23, text: "And again như là chưa từng mất nhau" },
    { time: 92.78, text: "♪" },
    { time: 118.0, text: "Chỉ là vài chuyện buồn" },
    { time: 118.96, text: "Làm mình muộn phiền" },
    { time: 119.64, text: "Làm mình quên đi bao nhiêu yêu thương" },
    { time: 120.84, text: "Đã nói từ ngày đầu" },
    { time: 121.78, text: "Tao vẫn còn ngây thơ" },
    { time: 122.79, text: "Nụ cười tươi trên môi bao lâu nay" },
    { time: 123.86, text: "Nó không mất đi được đâu" },
    { time: 124.97, text: "Tao rất muốn chìm vào" },
    { time: 125.93, text: "Một nụ hôn của yêu thương si mê" },
    { time: 127.09, text: "Say đắm, ngọt ngào" },
    { time: 128.05, text: "Tao đã có thể, do tao đã hiểu" },
    { time: 129.4, text: "Đâu mới là điều mà mình" },
    { time: 130.44, text: "Thật sự khát khao" },
  ],
  "Huh (feat. RPT Orijinn & THANHDRAW)": [
    { time: 21.56, text: "Everyday we try, we fly" },
    { time: 24.17, text: "Tự nhắc bản thân của tao là không sợ hãi" },
    { time: 26.61, text: 'Nói là "yêu", "thank you", "apologize"' },
    {
      time: 28.88,
      text: "Mọi thứ có thể fucked up, tao tin rằng it's gonna be alright",
    },
    {
      time: 31.55,
      text: "Không muốn tắm trong tiền, tao muốn tắm trong ánh nắng một sớm ban mai",
    },
    {
      time: 34.42,
      text: "Chỉ có khoảnh khắc gọi là tồn tại, và những thứ khác là không còn mãi",
    },
    {
      time: 37.03,
      text: "Bảo là có hiểu được không thì chắc chắn ở đây là không một ai",
    },
    {
      time: 39.81,
      text: "Tao yêu sự tự do vĩnh cửu này, say đắm và không mờ phai",
    },
    {
      time: 42.57,
      text: "Tao đã phải hi sinh đi đôi mắt, tìm tình yêu, love was blind",
    },
    { time: 45.59, text: "Tình cảm này luôn là thật, can't fake, never lied" },
    {
      time: 48.09,
      text: "Cho những người ở trong khoang ngực thằng MCK ở ngăn bên trái",
    },
    {
      time: 50.89,
      text: "Nó vẫn luôn mong nó là ngọn lửa cho mọi người băng qua những đêm dài",
    },
    { time: 53.62, text: "Okay, MC-MC-MCK, hyperpop star" },
    { time: 55.33, text: "Tao rep' Hà Nội, that's my city" },
    { time: 58.08, text: "Put V on the map, lên cổ tay tao đóng băng VV" },
    {
      time: 60.85,
      text: "Ghét tao nhưng vẫn follow, thế muốn như nào? Wanna be me?",
    },
    { time: 63.74, text: "They wanna be me" },
    {
      time: 66.8,
      text: "Nhưng mà tao thì lại không muốn là tao giống như ai cả",
    },
    { time: 69.89, text: "Only one be, thời gian không thể phai nhoà" },
    { time: 72.32, text: "Tao sẽ feat cả Jennie, Carti, Raye, Tyla" },
    { time: 75.18, text: "Bọn họ biết tao là MCK đẹp zai mà" },
    { time: 76.76, text: "Còn điều gì chưa nói, điều gì để dành cho nhau?" },
    { time: 78.62, text: "Lời nói ấy sẽ khắc ghi như khi vẫn còn đậm sâu" },
    {
      time: 81.51,
      text: "Chặng đường dài ai cũng đã từng một mình chênh vênh",
    },
    {
      time: 84.02,
      text: "Để rồi sau này khi nhận ra lại mong bình yên như ngày đầu",
    },
    {
      time: 86.69,
      text: "Vậy thì còn điều gì chưa nói, điều gì để dành cho nhau?",
    },
    { time: 89.67, text: "Lời nói ấy sẽ khắc ghi như khi vẫn còn đậm sâu" },
    { time: 92.55, text: "Còn điều gì chưa nói, điều gì để dành cho nhau?" },
    { time: 104.24, text: "Nói nhau nghe người ơi" },
    {
      time: 124.01,
      text: "Tao vẫn chưa thể nào hiểu hết được như thế nào là tình yêu",
    },
    {
      time: 126.85,
      text: "Tao vẫn đang loay hoay nhồi nhét cảm xúc vào nốt nhạc mình phiêu",
    },
    {
      time: 129.6,
      text: "Lại nuốt hết những cơn đau khi thấy ánh mắt em buồn thiu",
    },
    {
      time: 132.49,
      text: "Vì thứ khiến tao đau nhất có lẽ cũng chỉ là tình yêu",
    },
    {
      time: 135.16,
      text: "Tao muốn ngắm nhìn những tia nắng qua những ô kính đang rọi vào",
    },
    {
      time: 137.88,
      text: "Bỏ qua hết những đàm tiếu, cả những giả dối đang gọi chào",
    },
    {
      time: 140.65,
      text: "Nhìn mây cứ trôi lửng lơ, vẫn đang ngẩn ngơ trên bầu trời",
    },
    {
      time: 143.49,
      text: "Tự do khiến tao đắm say, tao không thể nói lên thành lời",
    },
    {
      time: 146.12,
      text: 'Trưởng thành là khi mày đúng nhưng vẫn có thể nói câu "Sorry"',
    },
    {
      time: 148.85,
      text: "Sau khi lần mà tao tiếc nuối, bài học tao nhận lại là cho đi",
    },
    { time: 151.86, text: "One, for my fam, two, for my freedom" },
    { time: 154.61, text: "Everything I do, yeah, I do it for a reason" },
    {
      time: 157.15,
      text: 'Tao nhớ có lần mày nói bạn cũng là sói, đôi khi nên "gọn" vào',
    },
    {
      time: 159.95,
      text: "Lời nói mấy kẻ đàm tiếu thật ra chỉ muốn nhìn thấy mày xôn xao",
    },
    {
      time: 162.73,
      text: 'Dạo này trông tao hơi lạ, tao nghĩ, "Còn mày thế nào?"',
    },
    {
      time: 165.48,
      text: "Chuẩn bị tâm tư hàng tá, muốn giữ mọi chuyện truyền miệng mà không giao, uh",
    },
    { time: 169.14, text: "Phóng đi trong lặng im, tao đâu phải xác sống" },
    {
      time: 171.09,
      text: "Không muốn là những thân quen cùng ký ức từ đâu lại trở về",
    },
    {
      time: 173.72,
      text: "Từng câu, từng chữ, từng cuộc đấu đá, nghĩ lại chỉ thấy mình không nên",
    },
    {
      time: 176.54,
      text: "Tình bạn như mảnh chắp vá, tao vẫn giữ lấy dù biết nó không bền",
    },
    { time: 179.48, text: "Mọi thứ cứ thế đến, xin đừng nói mà quên" },
    {
      time: 182.65,
      text: "Thiếu gì đâu những chuyện ngoài tai, họ chỉ quen thói mà man",
    },
    {
      time: 185.33,
      text: "Cánh cửa này sẽ thành vật cản nếu mày cố bám lấy nó",
    },
    {
      time: 188.03,
      text: "Còn phòng tao vẫn sẽ luôn mở, có việc cứ thế mà lên",
    },
    {
      time: 190.38,
      text: "Vậy thì còn điều gì chưa nói, điều gì để dành cho nhau?",
    },
    { time: 193.15, text: "Lời nói ấy sẽ khắc ghi như khi vẫn còn đậm sâu" },
    {
      time: 196.05,
      text: "Chặng đường dài, ai cũng đã từng một mình chênh vênh",
    },
    {
      time: 198.27,
      text: "Để rồi sau này khi nhận ra lại mong bình yên như ngày đầu",
    },
    {
      time: 201.32,
      text: "Vậy thì còn điều gì chưa nói, điều gì để dành cho nhau?",
    },
    { time: 204.11, text: "Lời nói ấy sẽ khắc ghi như khi vẫn còn đậm sâu" },
    { time: 207.01, text: "Còn điều gì chưa nói, điều gì để dành cho nhau?" },
    { time: 209.44, text: "Nói nhau nghe người ơi" },
  ],
  "Nguyễn Văn Mười": [
    { time: 28.64, text: "Thôi, cứ như vậy đi, đã đến lúc dừng lại" },
    { time: 35.14, text: "Nhưng sẽ luôn còn khao khát được yêu" },
    { time: 42.21, text: "Thôi, cứ như vậy đi, đã đến lúc dừng lại" },
    { time: 48.86, text: "Vì anh biết yêu là không dễ dàng" },
    { time: 52.38, text: "Cùng bao nhiêu tổn thương đang mang" },
    { time: 55.76, text: "Và nếu lúc ấy, anh nhìn vào đôi mắt em" },
    { time: 62.69, text: "Để biết em đang nghĩ gì, lau đi giọt lệ trên mi" },
    { time: 69.45, text: "Và nếu lúc ấy, vẫn quan tâm nhau như giây phút đầu" },
    { time: 76.38, text: "Vì em chẳng thể yêu một người vô tâm" },
    { time: 81.35, text: "Không yêu một người vô tâm" },
    {
      time: 96.62,
      text: "Thật sự rất khó để yêu, để tin, để thương, để nhớ một người, oh-oh-oh",
    },
    {
      time: 103.52,
      text: "Vì chẳng ai muốn bỏ ra thời gian để nhận về bao tiếc nuối",
    },
    { time: 110.88, text: "Tìm lại trong hai ta bao nhiêu những kí ức đẹp" },
    {
      time: 115.97,
      text: "Đôi khi câu yêu thương em đã giấu đi, những khi anh không ở đây",
    },
    { time: 124.36, text: "Và nếu lúc ấy, đã không đánh mất em" },
    { time: 131.25, text: "Anh đã không quay lại trước khi ta gặp" },
    { time: 134.94, text: "Gió đông đã chẳng còn lạnh lẽo" },
    { time: 141.5, text: "Và nếu lúc ấy, anh nhìn vào đôi mắt em" },
    { time: 148.56, text: "Để biết em đang nghĩ gì, lau đi giọt lệ trên mi" },
    {
      time: 155.27,
      text: "Và nếu lúc ấy, vẫn quan tâm nhau như giây phút đầu",
    },
    { time: 162.13, text: "Vì em chẳng thể yêu một người vô tâm" },
    { time: 167.28, text: "Không yêu một người vô tâm" },
    { time: 170.21, text: "Huh-uh-uh-uh, uh-uh-huh-uh-uh-uh-uh" },
    {
      time: 176.04,
      text: "Nếu thực sự ta xa rời thì anh không thể viết về người anh yêu tràn đầy sức sống",
    },
    { time: 189.81, text: "Giống như một giấc mơ chưa kịp đặt tên" },
    { time: 196.56, text: "Dắt anh đi xa dần bóng hình em" },
    { time: 204.96, text: "Và nếu lúc ấy, anh nhìn vào đôi mắt em" },
    { time: 211.85, text: "Để biết em đang nghĩ gì (Biết em đang nghĩ gì)" },
    { time: 215.12, text: "Lau đi giọt lệ trên mi (Lau đi giọt lệ trên mi)" },
    {
      time: 218.87,
      text: "Và nếu lúc ấy, vẫn quan tâm nhau như giây phút đầu (Huh-uh)",
    },
    { time: 225.52, text: "Vì em chẳng thể yêu một người vô tâm" },
    { time: 230.59, text: "Không yêu một người vô tâm" },
  ],
  "Thịt Lợn": [
    {
      time: 23.76,
      text: "Tao đã nguyện không oán những cái chuyện không đáng",
    },
    { time: 25.26, text: "Nhưng có những chuyện nó khó có thể tha thứ" },
    { time: 27.06, text: "Tùng yêu, từng ghét, từng giận, từng quen" },
    { time: 28.61, text: "Dù không muốn thì cũng đã phải giã từ" },
    { time: 30.16, text: "Chưa bao giờ hối hận vì những thứ đã làm" },
    { time: 31.58, text: "Trời cao độ cho linh hồn xa xứ" },
    { time: 33.02, text: 'Chưa bao giờ có "nếu", hoặc là "đáng tiếc"' },
    { time: 34.39, text: 'Hoặc là "thương hại", hay là hai từ "giá như"' },
    { time: 36.18, text: "Okay, tao đi ra phố, mấy em fan chạy lại hú hét" },
    {
      time: 38.92,
      text: "Bỏ hút cỏ mấy em cứ ép, hút cái này nhiều đầu anh lú đét",
    },
    {
      time: 41.95,
      text: "Mấy em gái chạy lại và hú hét, có em vú to, có em vú lép",
    },
    {
      time: 44.71,
      text: 'Bảo là, "Nghe nhạc anh sao mà tai nghe cứ khét", CapCut hai ảnh các em cứ ghép',
    },
    { time: 48.35, text: "Ayy, tiếng lành đồn xa" },
    { time: 49.87, text: "Chúng nó bảo anh là không làm được" },
    { time: 51.08, text: "Đến cái lúc anh làm được mặt chúng nó đần ra" },
    {
      time: 52.84,
      text: "Anh đã không còn cảm thấy cô đơn trong lòng ở nơi phố thị phồn hoa",
    },
    {
      time: 55.82,
      text: "Anh đã thấy được giá trị của anh khi mà cuộc đời anh trải qua một phần ba",
    },
    { time: 59.03, text: "Và anh đã quen với cô đơn" },
    {
      time: 60.72,
      text: "Con tim anh đã an nhiên, đã thôi nhung nhớ, đã thôi thét gào lên từng cơn",
    },
    {
      time: 63.59,
      text: "Anh giữ niềm yêu thương, trao hy vọng, điệu nhạc này chớ buồn làm gì",
    },
    {
      time: 66.59,
      text: "Với những thứ không quan trọng, anh sẽ lấy tay gạt đi",
    },
    { time: 70.2, text: "Suy nghĩ làm gì cho tốn thời gian" },
    { time: 71.68, text: "Tâm anh sáng và cái dáng anh hiền" },
    { time: 72.8, text: "Baby, mắt anh phát sáng, va vào cái say liền" },
    { time: 74.31, text: "Ôm, lúc nào cũng ôm một đống ưu phiền" },
    {
      time: 75.89,
      text: "Em làm cho anh nhung nhớ tặng anh cái dây chuyền, okay",
    },
    { time: 77.96, text: "Chắc là em cũng quên rồi" },
    { time: 78.89, text: "Nhưng mà anh thì nhớ những lúc em phá lên cười" },
    { time: 80.48, text: "Đẹp như là show của anh, show của anh" },
    { time: 81.87, text: 'Bình luận "hai chấm, ngoặc, ngoặc", "Quá ăn tiền"' },
    { time: 83.37, text: "Xong rồi anh nhận ra, không phải yêu" },
    {
      time: 85.1,
      text: "Bởi vì anh chưa bao giờ là người được em quan tâm, quan tâm",
    },
    {
      time: 87.15,
      text: "Thật buồn, anh phải chỉnh lại bản thân và đi chơi với cả mấy em da nâu ngăm ngăm",
    },
    {
      time: 90.02,
      text: "Em nghĩ thế thôi mà đã hạ được anh? Baby, aight, get some, get some",
    },
    {
      time: 93.12,
      text: "Bao nhiêu thằng muốn cắn anh ngoài kia nhìn lại mông anh thì toàn là vết răng, vết răng",
    },
    { time: 96.38, text: "Anh mà đi ở đâu thì camera tự nhiên ra follow" },
    {
      time: 99.35,
      text: 'Mấy thằng chưa gặp anh comment bảo, "Trông mày như thằng côn đồ"',
    },
    {
      time: 102.15,
      text: "Hỏi anh tại sao đỉnh cao, hình như là do đẹp zai? I don't know",
    },
    { time: 105.31, text: "Mày đang làm đau đầu tao, để yên cho tao về ôm bồ" },
    { time: 109.41, text: "Take care, baby, are you take care?" },
    { time: 112.9, text: "I just wanted you to take care" },
    { time: 115.87, text: "Hy vọng em vẫn đang đổi thay, yeah" },
    {
      time: 120.44,
      text: "Anh đã nguyện không oán (Anh là như thế), những cái chuyện không đáng (Không bao giờ)",
    },
    {
      time: 123.56,
      text: "Anh đã nguyện không bán (Anh là vô giá), thể diện trong sáng (Okay luôn)",
    },
    {
      time: 126.55,
      text: "Không thích chuyện công cán (Nghe chưa?), cả mấy chuyện ân oán (Nghe rõ chưa?)",
    },
    {
      time: 129.61,
      text: "Chỉ có em và nhạc (M-O-U), là anh nghiện không chán (Yêu luôn)",
    },
    {
      time: 132.45,
      text: "Anh muốn trèo lên cao nhất (Tít trên), chỉ để khoe với mẹ anh (Mẹ ơi)",
    },
    {
      time: 135.61,
      text: "Con mẹ đã lớn, vững vàng, chững chạc không còn là thằng trẻ ranh (Con mẹ đã lớn rồi)",
    },
    {
      time: 138.55,
      text: "Đối mặt với thử thách, thân trai hai lăm gặp hổ bẻ nanh",
    },
    {
      time: 140.74,
      text: "Nhỡ đâu con dâu lại là người nước ngoài, cúi đầu tạ lễ, biếu mẹ cái thẻ xanh",
    },
    {
      time: 144.02,
      text: "Long Nhật Bản đã từng ngủ ở hè phố, Long Việt Nam giờ là báu vật của bố",
    },
    {
      time: 146.93,
      text: "Những người bạn vẫn luôn ở đó, chỉ cần nhìn thấy họ là nó đã được củng cố",
    },
    {
      time: 150.08,
      text: "Bước ra đường với đôi giày khủng bố, nhạc bật bung loa vang khắp cả phố",
    },
    {
      time: 152.87,
      text: "Racks on racks on racks on racks on racks on racks on racks, alo?",
    },
    {
      time: 155.88,
      text: "Long Tân Mai mãi là một thằng nhóc, Long Ba Đình nhiều lần gục mặt khóc",
    },
    {
      time: 158.8,
      text: "Long Phố Vọng đã có nhiều bằng cấp, Long Kim Mã, uhm, chẳng cao chẳng thấp",
    },
    {
      time: 161.97,
      text: "Long Thủ Thiêm tiêu tiền bằng xấp, Long-Long Hồ Tây quá giàu chẳng chấp",
    },
    {
      time: 164.92,
      text: "Long đẹp zai represent Hoàng Mai, Hà Nội, Ba Đình, đỉnh cao, đẳng cấp",
    },
    { time: 167.14, text: "Và anh đã quen với cô đơn" },
    {
      time: 168.75,
      text: "Con tim anh đã an nhiên, đã thôi nhung nhớ, thôi thét gào lên từng cơn",
    },
    { time: 171.72, text: "Gieo thêm hy vọng, điệu nhạc này chớ buồn làm gì" },
    {
      time: 174.72,
      text: "Với những thứ không quan trọng, anh sẽ lấy tay gạt đi",
    },
    { time: 178.13, text: "Suy nghĩ làm gì cho tốn thời gian" },
    {
      time: 180.62,
      text: "Con tim anh đã an nhiên, đã thôi nhung nhớ, thôi thét gào lên từng cơn",
    },
    { time: 183.68, text: "Gieo thêm hy vọng, điệu nhạc này chớ buồn làm gì" },
    {
      time: 186.72,
      text: "Với những thứ không quan trọng, anh sẽ lấy tay gạt đi",
    },
    { time: 190.24, text: "Suy nghĩ làm gì cho tốn thời gian" },
  ],
};


/* ---- lyrics.js ---- */
// JS/lyrics.js
// Hien thi va dong bo lyric ngay trong khu vuc #main, nen lay mau chu dao tu anh bai hat
// Dung chung du lieu tu window.lyricsDatabase (JS/lyrics-data.js)

const lyricsBtn = document.querySelector(".lyrics-btn");
const lyricsAudioEl = document.getElementById("audio-song");
const mainContent = document.getElementById("main");
const lyricsView = document.getElementById("lyrics-view");
const lyricsViewHeader = document.getElementById("lyrics-view-header");
const lyricsViewLines = document.getElementById("lyrics-view-lines");
const lyricsScrollContainer =
  document.getElementById("lyrics-view-scroll") || lyricsView;

let lyricsPanelOpen = false;
let currentLineIndex = -1;
let lastColorTrackTitle = null;

// Mau mac dinh khi khong doc duoc mau anh (vi du bi chan CORS)
const LYRICS_DEFAULT_BG_COLOR = { r: 30, g: 30, b: 46 }; // tuong ung #1E1E2E

function getCurrentTrack() {
  const list = window.tracks || [];
  const index =
    typeof window.getCurrentTrackIndex === "function"
      ? window.getCurrentTrackIndex()
      : 0;
  return list[index];
}

// Lay mau trung binh (chu dao tho) tu 1 anh, tra ve Promise<{r,g,b}>
function extractLyricsDominantColor(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const size = 20; // thu nho anh de tinh trung binh nhanh
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, size, size);

        const data = ctx.getImageData(0, 0, size, size).data;
        let r = 0,
          g = 0,
          b = 0,
          count = 0;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }

        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);

        resolve({ r, g, b });
      } catch (err) {
        // Anh bi chan CORS (tainted canvas) -> dung mau mac dinh
        resolve(LYRICS_DEFAULT_BG_COLOR);
      }
    };

    img.onerror = () => resolve(LYRICS_DEFAULT_BG_COLOR);
    img.src = imageUrl;
  });
}

// Lam toi mot mau di 1 chut de chu trang de doc hon tren nen do
function darken({ r, g, b }, factor = 0.55) {
  return {
    r: Math.round(r * factor),
    g: Math.round(g * factor),
    b: Math.round(b * factor),
  };
}

function applyBackgroundColor({ r, g, b }) {
  const top = `rgb(${r}, ${g}, ${b})`;
  const bottomColor = darken({ r, g, b }, 0.35);
  const bottom = `rgb(${bottomColor.r}, ${bottomColor.g}, ${bottomColor.b})`;

  lyricsView.style.background = `linear-gradient(to bottom, ${top} 0%, ${bottom} 400px, #121212 800px)`;

  // * dong bo mau header (mobile) theo mau chu dao cua anh bai hat
  if (lyricsViewHeader) {
    const headerColor = darken({ r, g, b }, 0.7); // hơi tối hơn 1 chút để chữ dễ đọc
    lyricsViewHeader.style.background = `rgba(${headerColor.r}, ${headerColor.g}, ${headerColor.b}, 0.85)`;
  }
}

async function updateBackgroundForTrack(track) {
  if (!track) return;

  // Tranh tinh lai mau neu van dang o cung 1 bai
  if (lastColorTrackTitle === track.title) return;
  lastColorTrackTitle = track.title;

  // Ap mau mac dinh truoc trong luc dang doc anh, tranh nhap nhay
  applyBackgroundColor(LYRICS_DEFAULT_BG_COLOR);

  const color = await extractLyricsDominantColor(track.img);

  // Neu nguoi dung da chuyen sang bai khac trong luc doi anh tai -> bo qua ket qua cu
  const stillSameTrack = getCurrentTrack()?.title === track.title;
  if (stillSameTrack) {
    applyBackgroundColor(color);
  }
}

function renderLyricsForCurrentTrack() {
  const track = getCurrentTrack();
  if (!track) return;

  updateBackgroundForTrack(track);

  const lyrics =
    (window.lyricsDatabase && window.lyricsDatabase[track.title]) || [];

  currentLineIndex = -1;
  lyricsScrollContainer.scrollTop = 0;

  if (!lyrics.length) {
    lyricsViewLines.innerHTML = `
      <div class="text-center">
        <p class="text-white text-2xl sm:text-3xl font-[SpotifyMixUITitleBold]">Hmm. We don't know the lyrics for this one.</p>
      </div>
    `;
    return;
  }

  lyricsViewLines.innerHTML = lyrics
    .map(
      (line, i) =>
        `<p data-index="${i}" data-time="${line.time}" class="lyric-line text-white/60 text-2xl sm:text-3xl font-[SpotifyMixUIBold] leading-snug transition-all duration-300 cursor-pointer">${line.text}</p>`,
    )
    .join("");

  lyricsViewLines.querySelectorAll(".lyric-line").forEach((el) => {
    el.addEventListener("click", () => {
      lyricsAudioEl.currentTime = Number(el.dataset.time);
    });
  });
}

function updateActiveLine() {
  if (!lyricsPanelOpen) return;

  const track = getCurrentTrack();
  const lyrics =
    (window.lyricsDatabase && window.lyricsDatabase[track?.title]) || [];
  if (!lyrics.length) return;

  const t = lyricsAudioEl.currentTime;
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (t >= lyrics[i].time) activeIndex = i;
    else break;
  }

  if (activeIndex === currentLineIndex) return;
  currentLineIndex = activeIndex;

  lyricsViewLines.querySelectorAll(".lyric-line").forEach((el, i) => {
    if (i === activeIndex) {
      el.classList.add("text-white", "scale-105");
      el.classList.remove("text-white/60");
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      el.classList.remove("text-white", "scale-105");
      el.classList.add("text-white/60");
    }
  });
}

function updateLyricsButtonColor() {
  if (!lyricsBtn) return;
  const path = lyricsBtn.querySelector("svg path");
  if (path) {
    path.setAttribute("fill", lyricsPanelOpen ? "#1ED760" : "#BCBCC1");
  }
}

// * an/hien sticky-header-mobile dua tren trang thai lyrics + queue
function syncStickyHeaderMobileVisibility() {
  const stickyHeaderMobile = document.getElementById("sticky-header-mobile");
  if (!stickyHeaderMobile) return;

  const queueOpen =
    typeof window.isQueuePanelOpen === "function"
      ? window.isQueuePanelOpen()
      : false;

  stickyHeaderMobile.classList.toggle("hidden", lyricsPanelOpen || queueOpen);
}
window.syncStickyHeaderMobileVisibility = syncStickyHeaderMobileVisibility;

function toggleLyricsPanel(forceState) {
  lyricsPanelOpen = forceState !== undefined ? forceState : !lyricsPanelOpen;

  mainContent.classList.toggle("hidden", lyricsPanelOpen);
  lyricsView.classList.toggle("hidden", !lyricsPanelOpen);
  updateLyricsButtonColor();

  // * Đóng MV nếu đang mở (giống cách MV đóng Lyrics)
  if (lyricsPanelOpen && typeof window.closeMvPanel === "function") {
    window.closeMvPanel();
  }

  // * tranh xung dot voi Queue khi ca 2 cung dung chung #main (mobile)
  const hasDesktopQueueSidebar = !!document.getElementById(
    "playing-view-normal",
  );
  if (
    lyricsPanelOpen &&
    !hasDesktopQueueSidebar &&
    typeof window.closeQueuePanel === "function"
  ) {
    window.closeQueuePanel();
  }

  if (lyricsPanelOpen) {
    renderLyricsForCurrentTrack();
    updateActiveLine();
  }

  syncStickyHeaderMobileVisibility();
}

window.closeLyricsPanel = () => toggleLyricsPanel(false);
window.isLyricsPanelOpen = () => lyricsPanelOpen;

if (lyricsBtn) {
  lyricsBtn.addEventListener("click", () => toggleLyricsPanel());
}

lyricsAudioEl.addEventListener("timeupdate", updateActiveLine);
lyricsAudioEl.addEventListener("loadedmetadata", () => {
  if (lyricsPanelOpen) renderLyricsForCurrentTrack();
});


/* ---- queue.js ---- */
// JS/queue.js
// Hien thi hang doi phat nhac (Now playing + Next from queue + Next up)
// Dung chung cho ca desktop (sidebar) va mobile (hien trong #main nhu lyrics)

const queueBtn = document.querySelector(".queue-btn");
const playingViewNormal = document.getElementById("playing-view-normal"); // chi co tren desktop
const mainContentForQueue = document.getElementById("main"); // dung khi o mobile
const queueView = document.getElementById("queue-view");
const queueList = document.getElementById("queue-view-list");
const queueViewClose = document.getElementById("queue-view-close");
const audioForQueue = document.getElementById("audio-song");

let queuePanelOpen = false;

function getCurrentTrackIndexSafe() {
  return typeof window.getCurrentTrackIndex === "function"
    ? window.getCurrentTrackIndex()
    : 0;
}

// * luu cac bai da "Them vao danh sach phat" (demo don gian, dung chung ca 2 layout)
window.playlistSet = window.playlistSet || new Set();
window.toggleAddToPlaylist = function (index) {
  if (window.playlistSet.has(index)) {
    window.playlistSet.delete(index);
  } else {
    window.playlistSet.add(index);
  }
};

function trackRowHTML(track, realIndex, { inQueue = false } = {}) {
  return `
    <div data-index="${realIndex}" class="group flex justify-between items-center gap-3 hover:bg-[#282831] px-3 py-2 rounded cursor-pointer queue-item">
      <div class="flex items-center gap-3 min-w-0">
        <img src="${track.img}" alt="${track.title}" class="rounded w-10 h-10 object-cover" />
        <div class="min-w-0">
          <div class="text-white text-sm truncate">${track.title}</div>
          <div class="text-[#a7a7a7] text-xs truncate">${track.artist ?? ""}</div>
        </div>
      </div>

      <!-- * 3 dots -->
      <div class="relative queue-more">
        <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-encore-id="icon" role="img" aria-hidden="true" class="queue-more-toggle hover:scale-105 active:scale-95 cursor-pointer" viewBox="0 0 24 24" width="20" height="20">
          <path d="M4.5 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm15 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-7.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill-opacity="1" fill="#fff"></path>
        </svg>

        <!-- * popup -->
        <div class="hidden right-0 top-full z-50 absolute bg-[#282828] shadow-xl mt-1 rounded-md w-[230px] overflow-hidden queue-more-menu">
          ${
            inQueue
              ? `<button type="button" class="flex items-center gap-3 hover:bg-[#3E3E3E] px-3 py-2 w-full text-left cursor-pointer queue-remove-item">
                  <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" fill="#B3B3B3" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                    <path d="M5.25 3v-.917C5.25.933 6.183 0 7.333 0h1.334c1.15 0 2.083.933 2.083 2.083V3h4.75v1.5h-.972l-1.257 9.544A2.25 2.25 0 0 1 11.041 16H4.96a2.25 2.25 0 0 1-2.23-1.956L1.472 4.5H.5V3zm1.5-.917V3h2.5v-.917a.583.583 0 0 0-.583-.583H7.333a.583.583 0 0 0-.583.583M2.986 4.5l1.23 9.348a.75.75 0 0 0 .744.652h6.08a.75.75 0 0 0 .744-.652L13.015 4.5H2.985z" fill="#B3B3B3"></path>
                  </svg>
                  <span class="text-white text-sm">Xóa khỏi hàng đợi</span>
                </button>`
              : `<button type="button" class="flex items-center gap-3 hover:bg-[#3E3E3E] px-3 py-2 w-full text-left cursor-pointer queue-add-item">
                  <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" fill="#B3B3B3" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                    <path d="M16 15H2v-1.5h14zm0-4.5H2V9h14zm-8.034-6A5.5 5.5 0 0 1 7.187 6H13.5a2.5 2.5 0 0 0 0-5H7.966c.159.474.255.978.278 1.5H13.5a1 1 0 1 1 0 2zM2 2V0h1.5v2h2v1.5h-2v2H2v-2H0V2z" fill="#B3B3B3"></path>
                  </svg>
                  <span class="text-white text-sm">Thêm vào hàng đợi</span>
                </button>`
          }
          <button type="button" class="flex items-center gap-3 hover:bg-[#3E3E3E] px-3 py-2 w-full text-left cursor-pointer queue-add-playlist-item">
            <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" fill="#B3B3B3" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
              <path d="M11.999 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11z"></path>
              <path d="M17.999 12a1 1 0 0 1-1 1h-4v4a1 1 0 1 1-2 0v-4h-4a1 1 0 1 1 0-2h4V7a1 1 0 1 1 2 0v4h4a1 1 0 0 1 1 1z"></path>
            </svg>
            <span class="text-white text-sm">Thêm vào danh sách phát</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderQueue() {
  const list = window.tracks || [];
  const currentIndex = getCurrentTrackIndexSafe();
  const current = list[currentIndex];
  const customQueue = window.customQueue || [];

  let html = "";

  if (current) {
    html += `
      <div class="mb-6">
        <h3 class="mb-2 font-[SpotifyMixUITitleBold] text-white text-sm">Now playing</h3>
        <div class="flex items-center gap-3 bg-[#1E1E2E] px-3 py-2 rounded">
          <img src="${current.img}" alt="${current.title}" class="rounded w-10 h-10 object-cover" />
          <div class="min-w-0">
            <div class="text-[#1ED760] text-sm truncate">${current.title}</div>
            <div class="text-[#a7a7a7] text-xs truncate">${current.artist ?? ""}</div>
          </div>
        </div>
      </div>
    `;
  }

  if (customQueue.length) {
    html += `
      <div class="mb-6">
        <h3 class="mb-2 font-[SpotifyMixUITitleBold] text-white text-sm">Next from queue</h3>
        <div class="space-y-1">
          ${customQueue
            .filter((idx) => list[idx])
            .map((idx) => trackRowHTML(list[idx], idx, { inQueue: true }))
            .join("")}
        </div>
      </div>
    `;
  }

  const upcoming = list
    .map((track, i) => ({ track, i }))
    .slice(currentIndex + 1)
    .filter(({ i }) => !customQueue.includes(i));

  html += `<h3 class="mb-2 font-[SpotifyMixUITitleBold] text-white text-sm">Next up</h3>`;

  if (!upcoming.length) {
    html += `<p class="text-[#a7a7a7] text-sm">No more songs in queue.</p>`;
  } else {
    html +=
      `<div class="space-y-1">` +
      upcoming
        .map(({ track, i }) => trackRowHTML(track, i, { inQueue: false }))
        .join("") +
      `</div>`;
  }

  queueList.innerHTML = html;

  // * mo/dong popup more-options trong queue
  queueList.querySelectorAll(".queue-more-toggle").forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const menu = toggle
        .closest(".queue-more")
        .querySelector(".queue-more-menu");
      queueList.querySelectorAll(".queue-more-menu").forEach((m) => {
        if (m !== menu) m.classList.add("hidden");
      });
      menu.classList.toggle("hidden");
    });
  });

  // * them vao hang doi (tu dong Next up)
  queueList.querySelectorAll(".queue-add-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = Number(btn.closest(".queue-item").dataset.index);
      window.addToQueue(idx);
      btn.closest(".queue-more-menu").classList.add("hidden");
    });
  });

  // * xoa khoi hang doi (tu dong Next from queue)
  queueList.querySelectorAll(".queue-remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = Number(btn.closest(".queue-item").dataset.index);
      window.removeFromQueue(idx);
      btn.closest(".queue-more-menu").classList.add("hidden");
    });
  });

  // * them vao danh sach phat
  queueList.querySelectorAll(".queue-add-playlist-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = Number(btn.closest(".queue-item").dataset.index);
      window.toggleAddToPlaylist(idx);
      btn.closest(".queue-more-menu").classList.add("hidden");
    });
  });

  // * click vao dong -> phat bai do (va tu dong bo khoi hang doi neu dang trong hang doi)
  queueList.querySelectorAll(".queue-item").forEach((el) => {
    el.addEventListener("click", () => {
      const idx = Number(el.dataset.index);
      const customQueue = window.customQueue || [];
      const pos = customQueue.indexOf(idx);
      if (pos !== -1) {
        customQueue.splice(pos, 1);
        if (typeof window.onQueueChange === "function") window.onQueueChange();
      }
      if (typeof window.playTrackAtIndex === "function") {
        window.playTrackAtIndex(idx);
      }
    });
  });
}

const QUEUE_ACTIVE_COLOR = "#1ED760";
const QUEUE_INACTIVE_COLOR = "#BCBCC1";

function syncQueueBtnColor() {
  if (!queueBtn) return;
  const paths = queueBtn.querySelectorAll("svg path");
  paths.forEach((p) => {
    p.setAttribute(
      "fill",
      queuePanelOpen ? QUEUE_ACTIVE_COLOR : QUEUE_INACTIVE_COLOR,
    );
  });
}

// * an/hien sticky-header-mobile dua tren trang thai queue + lyrics
function syncStickyHeaderMobileVisibilityFromQueue() {
  const stickyHeaderMobile = document.getElementById("sticky-header-mobile");
  if (!stickyHeaderMobile) return;

  const lyricsOpen =
    typeof window.isLyricsPanelOpen === "function"
      ? window.isLyricsPanelOpen()
      : false;

  stickyHeaderMobile.classList.toggle("hidden", queuePanelOpen || lyricsOpen);
}

function toggleQueuePanel(forceState) {
  queuePanelOpen = forceState !== undefined ? forceState : !queuePanelOpen;

  if (playingViewNormal) {
    // * Desktop: sidebar "Now playing" <-> "Queue"
    playingViewNormal.classList.toggle("hidden", queuePanelOpen);
  } else if (mainContentForQueue) {
    // * Mobile: #main <-> Queue toan man hinh (giong lyrics)
    mainContentForQueue.classList.toggle("hidden", queuePanelOpen);

    // * tranh xung dot voi panel lyrics dang mo
    if (queuePanelOpen && typeof window.closeLyricsPanel === "function") {
      window.closeLyricsPanel();
    }
  }

  if (queueView) queueView.classList.toggle("hidden", !queuePanelOpen);

  syncQueueBtnColor();

  if (queuePanelOpen) {
    renderQueue();
  }

  // * chi can dieu chinh sticky-header-mobile khi dang o layout mobile (khong co sidebar desktop)
  if (!playingViewNormal) {
    syncStickyHeaderMobileVisibilityFromQueue();
  }
}

window.closeQueuePanel = () => toggleQueuePanel(false);
window.isQueuePanelOpen = () => queuePanelOpen;

if (queueBtn) {
  queueBtn.addEventListener("click", () => toggleQueuePanel());
}
if (queueViewClose) {
  queueViewClose.addEventListener("click", () => toggleQueuePanel(false));
}

audioForQueue.addEventListener("loadedmetadata", () => {
  if (queuePanelOpen) renderQueue();
});

// * dong popup khi click ra ngoai
document.addEventListener("click", (e) => {
  if (!e.target.closest(".queue-more")) {
    queueList
      .querySelectorAll(".queue-more-menu")
      .forEach((m) => m.classList.add("hidden"));
  }
});

// Goi lai khi customQueue thay doi (tu tracks.js / tracks-mobile.js)
window.onQueueChange = () => {
  if (queuePanelOpen) renderQueue();
};
