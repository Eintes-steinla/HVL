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
